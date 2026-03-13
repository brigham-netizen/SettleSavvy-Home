'use client';

import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { UtilityReport } from '@/types/utilities';

interface AddressInputProps {
  onResult: (report: UtilityReport) => void;
  onError: (msg: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export default function AddressInput({ onResult, onError, onLoadingChange }: AddressInputProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  function setLoadingState(val: boolean) {
    setLoading(val);
    onLoadingChange?.(val);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    setLoadingState(true);
    onError('');

    try {
      const res = await fetch('/api/utilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      onResult(data as UtilityReport);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoadingState(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <MapPin className="absolute left-4 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your new US address…"
          className="w-full pl-12 pr-36 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !address.trim()}
          className="absolute right-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Looking up…' : 'Look up'}
        </button>
      </div>
    </form>
  );
}
