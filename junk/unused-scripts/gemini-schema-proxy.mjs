/**
 * Gemini Schema Sanitization Proxy
 *
 * MITM proxy that intercepts Gemini API traffic (googleapis.com),
 * sanitizes boolean enums in JSON schemas, and forwards.
 *
 * Usage:
 *   set NODE_EXTRA_CA_CERTS=%USERPROFILE%\.config\opencode\proxy-ca\ca-cert.pem
 *   set HTTPS_PROXY=http://127.0.0.1:9080
 *   opencode
 */

import http from "node:http";
import https from "node:https";
import tls from "node:tls";
import net from "node:net";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const PORT = 9080;
const HOME = process.env.USERPROFILE || process.env.HOME || process.cwd();
const CA_DIR = path.join(HOME, ".config", "opencode", "proxy-ca");
const CA_KEY = path.join(CA_DIR, "ca-key.pem");
const CA_CERT = path.join(CA_DIR, "ca-cert.pem");
const OPENSSL = "C:\\Program Files\\Git\\usr\\bin\\openssl.exe";

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function run(...args) { return spawnSync(OPENSSL, args, { stdio: "pipe" }); }

function loadOrCreateCA() {
  ensureDir(CA_DIR);
  if (fs.existsSync(CA_KEY) && fs.existsSync(CA_CERT)) {
    return { key: fs.readFileSync(CA_KEY, "utf-8"), cert: fs.readFileSync(CA_CERT, "utf-8") };
  }
  const keyRes = run("genrsa", "-out", CA_KEY, "2048");
  if (keyRes.status !== 0) throw new Error("CA key gen failed: " + keyRes.stderr);
  const certRes = run("req", "-x509", "-new", "-nodes",
    "-key", CA_KEY, "-sha256", "-days", "365",
    "-out", CA_CERT, "-subj", "/CN=GeminiSchemaProxyCA");
  if (certRes.status !== 0) throw new Error("CA cert gen failed: " + certRes.stderr);
  console.log(`[proxy] CA created at ${CA_CERT}`);
  return { key: fs.readFileSync(CA_KEY, "utf-8"), cert: fs.readFileSync(CA_CERT, "utf-8") };
}

function hostCert(caKey, hostname) {
  const keyPath = path.join(CA_DIR, `${hostname}-key.pem`);
  const csrPath = path.join(CA_DIR, `${hostname}-csr.pem`);
  const certPath = path.join(CA_DIR, `${hostname}-cert.pem`);
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return { key: fs.readFileSync(keyPath, "utf-8"), cert: fs.readFileSync(certPath, "utf-8") };
  }
  const sanCfg = path.join(CA_DIR, `${hostname}-san.cnf`);

  run("genrsa", "-out", keyPath, "2048");
  run("req", "-new", "-key", keyPath, "-out", csrPath, "-subj", `/CN=${hostname}`);

  fs.writeFileSync(sanCfg, `subjectAltName=DNS:${hostname}\n`, "utf-8");
  run("x509", "-req", "-in", csrPath, "-CA", CA_CERT, "-CAkey", CA_KEY,
    "-CAcreateserial", "-out", certPath, "-days", "7", "-sha256", "-extfile", sanCfg);
  try { fs.unlinkSync(csrPath); } catch {}
  try { fs.unlinkSync(sanCfg); } catch {}
  return { key: fs.readFileSync(keyPath, "utf-8"), cert: fs.readFileSync(certPath, "utf-8") };
}

// ── Schema sanitizer ─────────────────────────────────────────────────
function sanitizeSchema(schema) {
  if (typeof schema !== "object" || schema === null) return schema;
  if (Array.isArray(schema)) return schema.map(sanitizeSchema);
  const result = {};
  for (const [k, v] of Object.entries(schema))
    result[k] = k === "enum" && Array.isArray(v) ? v.map(String) : sanitizeSchema(v);
  if (Array.isArray(result.enum) && (result.type === "integer" || result.type === "number")) result.type = "string";
  if (Array.isArray(result.enum) && result.type === "boolean") delete result.enum;
  return result;
}

function sanitizeBody(body) {
  try {
    const p = JSON.parse(body);
    if (p.tools) for (const t of p.tools)
      if (t.functionDeclarations) for (const fd of t.functionDeclarations)
        if (fd.parameters) fd.parameters = sanitizeSchema(fd.parameters);
    const out = JSON.stringify(p);
    if (out !== body) console.log("[proxy] Sanitized boolean enums");
    return out;
  } catch { return body; }
}

// ── MITM handler for Gemini ──────────────────────────────────────────
function handleGeminiMITM(socket, head, hostname, port) {
  const ca = loadOrCreateCA();
  const hc = hostCert(ca.key, hostname);
  if (head.length) socket.unshift(head);

  const tlsSocket = new tls.TLSSocket(socket, {
    isServer: true,
    key: hc.key,
    cert: hc.cert,
  });

  let buf = Buffer.alloc(0);
  let headerEnd = -1;
  let bodyLen = 0;
  let bodyStart = -1;

  function parseHttp() {
    if (headerEnd === -1) {
      const i = buf.indexOf("\r\n\r\n");
      if (i === -1) return false;
      headerEnd = i;
      bodyStart = i + 4;
      const hdr = buf.slice(0, i).toString();
      const m = hdr.match(/content-length:\s*(\d+)/i);
      bodyLen = m ? parseInt(m[1], 10) : 0;
    }
    return buf.length >= bodyStart + bodyLen;
  }

  function forward() {
    const firstLine = buf.slice(0, buf.indexOf("\r\n")).toString();
    const [method] = firstLine.split(" ");
    const body = buf.slice(bodyStart, bodyStart + bodyLen).toString();
    const sanitized = (method === "POST" && body) ? sanitizeBody(body) : body;
    const headEnd = buf.slice(0, bodyStart);
    const newReq = headEnd.toString() + sanitized;

    const upSocket = tls.connect(port, hostname, { servername: hostname }, () => {
      upSocket.write(newReq);
    });
    upSocket.on("data", d => tlsSocket.write(d));
    upSocket.on("end", () => tlsSocket.end());
    upSocket.on("error", () => tlsSocket.end());
  }

  tlsSocket.on("data", chunk => {
    buf = Buffer.concat([buf, chunk]);
    if (parseHttp()) forward();
  });
  tlsSocket.on("error", () => {});
  socket.on("error", () => {});
}

// ── Server ───────────────────────────────────────────────────────────
const server = http.createServer();

// HTTP proxy (non-tunnel) - for HTTP requests
server.on("request", (req, res) => {
  const url = new URL(req.url);
  const chunks = [];
  req.on("data", c => chunks.push(c));
  req.on("end", () => {
    let body = Buffer.concat(chunks);
    if (url.hostname.includes("googleapis.com") && body.length) {
      body = Buffer.from(sanitizeBody(body.toString()), "utf-8");
      req.headers["content-length"] = body.length;
    }
    const up = https.request({ ...url, method: req.method, headers: req.headers }, upRes => {
      res.writeHead(upRes.statusCode, upRes.headers);
      upRes.pipe(res);
    });
    up.on("error", e => { res.writeHead(502); res.end(e.message); });
    up.end(body);
  });
});

// CONNECT tunnel
server.on("connect", (req, socket, head) => {
  const [hostname, portStr] = req.url.split(":");
  const port = parseInt(portStr, 10) || 443;

  socket.write("HTTP/1.1 200 Connection Established\r\n\r\n");

  if (hostname.includes("googleapis.com")) {
    handleGeminiMITM(socket, head, hostname, port);
    return;
  }

  // Passthrough — raw TCP tunnel, no TLS termination
  socket.unshift(head);
  const up = net.connect(port, hostname, () => {
    socket.pipe(up).pipe(socket);
  });
  up.on("error", () => socket.end());
  socket.on("error", () => up.end());
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n  Gemini Schema Proxy running on http://127.0.0.1:${PORT}`);
  console.log(`  CA cert: ${CA_CERT}\n`);
});
