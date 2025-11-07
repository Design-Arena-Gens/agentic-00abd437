"use client";

import { useMemo, useState } from 'react';

export type Customer = {
  id: string;
  name: string;
  email: string;
  plan: 'Free' | 'Pro' | 'Business';
  status: 'Active' | 'Trial' | 'Churned';
  signupDate: string; // ISO date
  spend: number; // lifetime spend
};

export type DataTableProps = {
  rows: Customer[];
};

type SortKey = keyof Pick<Customer, 'name' | 'email' | 'plan' | 'status' | 'signupDate' | 'spend'>;

type SortDir = 'asc' | 'desc';

export function DataTable({ rows }: DataTableProps) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('signupDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.plan.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const dirMul = sortDir === 'asc' ? 1 : -1;
      const av = a[sortKey];
      const bv = b[sortKey];
      if (sortKey === 'spend') return (av as number - (bv as number)) * dirMul;
      if (sortKey === 'signupDate') return (new Date(av as string).getTime() - new Date(bv as string).getTime()) * dirMul;
      return String(av).localeCompare(String(bv)) * dirMul;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageClamped = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (pageClamped - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, pageClamped, pageSize]);

  function onHeaderClick(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-lg font-semibold">Customers</h2>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            className="w-60 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Search name, email, plan, status"
          />
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
      <div className="card-body overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-gray-600">
              {([
                ['name', 'Name'],
                ['email', 'Email'],
                ['plan', 'Plan'],
                ['status', 'Status'],
                ['signupDate', 'Signup'],
                ['spend', 'Spend'],
              ] as [SortKey, string][]).map(([key, label]) => {
                const active = key === sortKey;
                return (
                  <th key={key} className="px-3 py-2 font-medium">
                    <button
                      className={`inline-flex items-center gap-1 rounded px-1 py-0.5 hover:text-black ${active ? 'text-brand-700' : ''}`}
                      onClick={() => onHeaderClick(key)}
                    >
                      <span>{label}</span>
                      <span className="text-xs">
                        {active ? (sortDir === 'asc' ? '?' : '?') : ''}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{r.name}</td>
                <td className="px-3 py-2 text-gray-700">{r.email}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.plan === 'Business' ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' :
                    r.plan === 'Pro' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
                    'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
                  }`}>{r.plan}</span>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.status === 'Active' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' :
                    r.status === 'Trial' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' :
                    'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                  }`}>{r.status}</span>
                </td>
                <td className="px-3 py-2 text-gray-700">{new Date(r.signupDate).toLocaleDateString()}</td>
                <td className="px-3 py-2 text-gray-900">{r.spend.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
          <div>
            Showing <span className="font-medium">{paged.length}</span> of <span className="font-medium">{sorted.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={pageClamped === 1}
            >
              Previous
            </button>
            <span>
              Page <span className="font-medium">{pageClamped}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={pageClamped === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
