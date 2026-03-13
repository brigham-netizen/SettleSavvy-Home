'use client';

import { useState } from 'react';
import AddressInput from '@/components/AddressInput';
import UtilityDashboard from '@/components/UtilityDashboard';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import { UtilityReport } from '@/types/utilities';

export default function Home() {
  const [report, setReport] = useState<UtilityReport | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleResult(r: UtilityReport) {
    setReport(r);
    setLoading(false);
  }

  function handleError(msg: string) {
    setError(msg);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Settle<span className="text-blue-600">Savvy</span>
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
            Enter your new address and instantly find every utility provider, estimated costs, and how to sign up.
          </p>
        </div>

        <AddressInput
          onResult={handleResult}
          onError={handleError}
          onLoadingChange={setLoading}
        />

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}

        {loading && <DashboardSkeleton />}
        {!loading && report && <UtilityDashboard report={report} />}
      </div>
    </main>
  );
}
