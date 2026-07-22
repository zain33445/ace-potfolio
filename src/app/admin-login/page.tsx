'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        setError('Wrong password');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-gray-50 p-8">
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div>
          <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-gray-900">Admin Login</h1>
          <p className="mt-1 font-mono text-xs text-gray-500">ACE Services</p>
        </div>
        <div className="space-y-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 font-mono text-sm outline-none focus:border-orange-500"
            placeholder="Enter password"
            autoFocus
          />
          {error && <p className="font-mono text-xs text-red-500">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-orange-500 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
