'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

const PER_PAGE = 20;

interface Contact {
  id: number;
  name: string;
  email: string;
  projectType: string;
  scale: string;
  fileUrl: string;
  date: string;
}

const TABS = ['Contacts', 'Projects', 'Settings'] as const;
type Tab = (typeof TABS)[number];

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

const FILE_OPTIONS = ['All', 'Has files', 'No files'] as const;

export default function AdminDashboard() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [scaleFilter, setScaleFilter] = useState('');
  const [fileFilter, setFileFilter] = useState<string>('All');

  useEffect(() => {
    fetch('/api/admin/verify')
      .then((r) => {
        if (r.ok) setAuthenticated(true);
        else window.location.href = '/admin-login';
      })
      .catch(() => { window.location.href = '/admin-login'; })
      .finally(() => setChecking(false));
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const r = await fetch('/api/admin/contacts');
      if (!r.ok) throw new Error('Failed to fetch');
      const data = await r.json();
      setContacts(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated || activeTab !== 'Contacts') return;
    fetchContacts();
  }, [authenticated, activeTab, fetchContacts]);

  const projectTypes = useMemo(() => {
    const set = new Set<string>();
    contacts.forEach((c) => { if (c.projectType) set.add(c.projectType); });
    return Array.from(set).sort();
  }, [contacts]);

  const scales = useMemo(() => {
    const set = new Set<string>();
    contacts.forEach((c) => { if (c.scale) set.add(c.scale); });
    return Array.from(set).sort();
  }, [contacts]);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      if (projectFilter && c.projectType !== projectFilter) return false;
      if (scaleFilter && c.scale !== scaleFilter) return false;
      if (fileFilter === 'Has files' && !c.fileUrl) return false;
      if (fileFilter === 'No files' && c.fileUrl) return false;
      if (dateFrom || dateTo) {
        const d = new Date(c.date);
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        if (dateFrom) {
          const from = new Date(dateFrom).getTime();
          if (dayStart < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo).getTime() + 86400000;
          if (dayStart >= to) return false;
        }
      }
      return true;
    });
  }, [contacts, projectFilter, scaleFilter, fileFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [filtered, contacts]);

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50"><p className="font-mono text-base text-gray-400">Checking...</p></div>;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold tracking-wider uppercase text-gray-900">Admin</h1>
        <p className="mt-1 font-mono text-base text-gray-500">ACE Services dashboard</p>
      </div>

      <div className="mb-8 flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-mono text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Contacts' && (
        <div>
          <div className="mb-6 flex flex-wrap items-end justify-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">From</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">To</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">Project</label>
              <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:outline-none">
                <option value="">All</option>
                {projectTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">Scale</label>
              <select value={scaleFilter} onChange={(e) => setScaleFilter(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:outline-none">
                <option value="">All</option>
                {scales.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">Files</label>
              <div className="flex overflow-hidden rounded border border-gray-300 font-mono text-sm">
                {FILE_OPTIONS.map((opt) => (
                  <button key={opt} onClick={() => setFileFilter(opt)}
                    className={`px-3 py-2 transition-colors ${
                      fileFilter === opt ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}>{opt}</button>
                ))}
              </div>
            </div>
            <button onClick={fetchContacts} disabled={loading}
              className="flex items-center gap-1.5 self-end rounded border border-gray-300 bg-white px-4 py-2 font-mono text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40">
              <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
              Refresh
            </button>
          </div>

          {error && <p className="mb-4 font-mono text-base text-red-500">Error: {error}</p>}

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full border-collapse font-mono text-base">
              <thead>
                <tr className="bg-gray-50 text-left text-sm uppercase tracking-wider text-gray-500">
                  <th className="border-2 border-gray-300 px-5 py-4">Ref</th>
                  <th className="border-2 border-gray-300 px-5 py-4">Date</th>
                  <th className="border-2 border-gray-300 px-5 py-4">Name</th>
                  <th className="border-2 border-gray-300 px-5 py-4">Email</th>
                  <th className="border-2 border-gray-300 px-5 py-4">Project</th>
                  <th className="border-2 border-gray-300 px-5 py-4">Scale</th>
                  <th className="border-2 border-gray-300 px-5 py-4">File</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="border-2 border-gray-200 px-5 py-4">
                          <div className="h-4 w-full max-w-[100px] animate-pulse rounded bg-gray-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <>
                    <tr>
                      <td colSpan={7} className="border-2 border-gray-200 px-5 py-12 text-center font-mono text-base text-gray-400">
                        No submissions match the filters.
                      </td>
                    </tr>
                    {Array.from({ length: 9 }).map((_, i) => (
                      <tr key={`empty-${i}`}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="border-2 border-gray-200 px-5 py-4">&nbsp;</td>
                        ))}
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {paginated.map((c) => (
                      <tr key={c.id} className="transition-colors hover:bg-gray-50">
                        <td className="border-2 border-gray-200 whitespace-nowrap px-5 py-4 font-mono text-sm text-gray-400">#{c.id}</td>
                        <td className="border-2 border-gray-200 whitespace-nowrap px-5 py-4 text-gray-500">{formatDate(c.date)}</td>
                        <td className="border-2 border-gray-200 px-5 py-4 font-semibold text-gray-900">{c.name}</td>
                        <td className="border-2 border-gray-200 px-5 py-4 text-gray-700">{c.email}</td>
                        <td className="border-2 border-gray-200 px-5 py-4 capitalize text-gray-700">{c.projectType || '-'}</td>
                        <td className="border-2 border-gray-200 px-5 py-4 text-gray-700">{c.scale || '-'}</td>
                        <td className="border-2 border-gray-200 px-5 py-4">
                          {c.fileUrl ? (
                            <a href={c.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">View</a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {paginated.length < 10 && Array.from({ length: 10 - paginated.length }).map((_, i) => (
                      <tr key={`fill-${i}`}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="border-2 border-gray-200 px-5 py-4">&nbsp;</td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>

            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="font-mono text-sm uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-10 w-10 rounded font-mono text-sm transition-colors ${
                        p === page ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="font-mono text-sm uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            <div className="flex items-center justify-end gap-4 border-t border-gray-200 px-5 py-3">
              <p className="font-mono text-sm text-gray-500">
                {filtered.length} of {contacts.length} submissions
              </p>
              <p className="font-mono text-sm text-gray-400">
                Page {page} of {totalPages}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Projects' && (
        <p className="font-mono text-base text-gray-400">Projects coming soon.</p>
      )}

      {activeTab === 'Settings' && (
        <p className="font-mono text-base text-gray-400">Settings coming soon.</p>
      )}
    </div>
  );
}
