// /src/router/context-loader.ts
// File selection logic with token budgeting

import { Domain } from './capability-resolver';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

// Core project files to always include
const coreFiles = [
  'PLAN.md',
  'CLAUDE.md',
  'design.md',
  'src/types.ts',
];

// Source directories by domain
const domainDirs: Record<Domain, string[]> = {
  frontend: [
    'src/components',
    'src/pages',
    'src/hooks',
  ],
  backend: [
    'src/services',
    'src/api',
  ],
  architecture: [
    'src',
  ],
};

// Token budget (approximate: 1 token ≈ 4 chars)
const TOKEN_BUDGET = 8000;
const CHARS_PER_TOKEN = 4;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

function getFiles(dir: string, maxFiles: number = 10): string[] {
  const files: string[] = [];
  try {
    const items = readdirSync(dir);
    for (const item of items) {
      if (files.length >= maxFiles) break;
      const fullPath = join(dir, item);
      try {
        const stat = statSync(fullPath);
        if (stat.isFile()) {
          files.push(fullPath);
        } else if (stat.isDirectory()) {
          files.push(...getFiles(fullPath, maxFiles - files.length));
        }
      } catch {
        // Skip inaccessible files
      }
    }
  } catch {
    // Directory not found
  }
  return files;
}

export function loadContext(domain: Domain, task: string): string[] {
  const loaded: string[] = [];
  let totalTokens = 0;
  const cwd = process.cwd();
  
  // Load core files (always include, check budget after)
  for (const file of coreFiles) {
    try {
      const content = readFileSync(join(cwd, file), 'utf-8');
      const tokens = estimateTokens(content);
      
      if (totalTokens + tokens > TOKEN_BUDGET) {
        // Truncate to fit budget
        const remainingChars = (TOKEN_BUDGET - totalTokens) * CHARS_PER_TOKEN;
        const truncated = content.substring(0, remainingChars) + '\n... [truncated]';
        loaded.push(`--- ${file} ---\n${truncated}`);
        totalTokens = TOKEN_BUDGET;
        break;
      }
      
      loaded.push(`--- ${file} ---\n${content}`);
      totalTokens += tokens;
    } catch {
      // Core file not found - skip
    }
  }
  
  if (totalTokens >= TOKEN_BUDGET) {
    return loaded;
  }
  
  // Load domain-specific source files (respect budget)
  const dirs = domainDirs[domain];
  for (const dir of dirs) {
    if (totalTokens >= TOKEN_BUDGET) break;
    
    const fullDir = join(cwd, dir);
    const files = getFiles(fullDir, 10);
    
    for (const file of files) {
      if (totalTokens >= TOKEN_BUDGET) break;
      
      try {
        const content = readFileSync(file, 'utf-8');
        const tokens = estimateTokens(content);
        
        if (totalTokens + tokens > TOKEN_BUDGET) {
          // Truncate to fit budget
          const remainingChars = (TOKEN_BUDGET - totalTokens) * CHARS_PER_TOKEN;
          const truncated = content.substring(0, remainingChars) + '\n... [truncated]';
          const relativePath = relative(cwd, file);
          loaded.push(`--- ${relativePath} ---\n${truncated}`);
          totalTokens = TOKEN_BUDGET;
          break;
        }
        
        const relativePath = relative(cwd, file);
        loaded.push(`--- ${relativePath} ---\n${content}`);
        totalTokens += tokens;
      } catch {
        // File read failed - skip
      }
    }
  }
  
  return loaded;
}