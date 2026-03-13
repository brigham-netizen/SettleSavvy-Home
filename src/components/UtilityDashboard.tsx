'use client';

import { UtilityReport, UtilityCategory } from '@/types/utilities';
import { Zap, Flame, Droplets, Gauge, Trash2, Wifi, ExternalLink, CheckCircle, HelpCircle } from 'lucide-react';
import SparklineChart from './SparklineChart';

const CATEGORY_META: Record<UtilityCategory, { label: string; icon: React.ElementType; color: string }> = {
  electricity: { label: 'Electricity', icon: Zap, color: 'text-yellow-500' },
  gas: { label: 'Natural Gas', icon: Flame, color: 'text-orange-500' },
  water: { label: 'Water', icon: Droplets, color: 'text-blue-500' },
  sewer: { label: 'Sewer', icon: Gauge, color: 'text-teal-500' },
  trash: { label: 'Trash', icon: Trash2, color: 'text-gray-500' },
  internet: { label: 'Internet', icon: Wifi, color: 'text-purple-500' },
};

interface Props {
  report: UtilityReport;
}

export default function UtilityDashboard({ report }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 mt-10">
      {/* Address header */}
      <div className="text-center">
        <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Results for</p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-1">{report.address.formatted}</h2>
        <p className="text-gray-400 text-sm mt-0.5">{report.address.county}, {report.address.state} {report.address.zip}</p>
      </div>

      {/* Utility cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {report.providers.map((provider, i) => {
          const meta = CATEGORY_META[provider.category];
          const Icon = meta.icon;
          const trend =
            provider.category === 'electricity'
              ? report.electricityTrend
              : provider.category === 'gas'
              ? report.gasTrend
              : [];
          const trendColor = provider.category === 'electricity' ? '#eab308' : '#f97316';

          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${meta.color}`} />
                  <span className="text-sm font-medium text-gray-600">{meta.label}</span>
                </div>
                {provider.confidence === 'confirmed'
                  ? <CheckCircle className="w-4 h-4 text-green-400" title="Confirmed" />
                  : <HelpCircle className="w-4 h-4 text-gray-300" title="Estimated" />}
              </div>

              <p className="text-gray-900 font-semibold text-base leading-snug">{provider.name}</p>

              {provider.estimatedMonthlyCost !== null && (
                <p className="text-2xl font-bold text-gray-900">
                  {provider.estimatedMonthlyCost.toFixed(2)}
                  <span className="text-sm font-normal text-gray-400 ml-1">{provider.costUnit}</span>
                </p>
              )}

              {trend.length >= 2 && (
                <SparklineChart data={trend} color={trendColor} />
              )}

              {provider.serviceStartUrl && (
                <a
                  href={provider.serviceStartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Start Service <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Action links */}
      <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Next steps</h3>
          <p className="text-sm text-gray-500 mt-0.5">Update your address with government agencies</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <a
            href={report.uspsChangeAddressUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:border-gray-300 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors"
          >
            USPS Change of Address <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {report.dmvUpdateUrl && (
            <a
              href={report.dmvUpdateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:border-gray-300 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors"
            >
              DMV Update <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">
        <CheckCircle className="inline w-3 h-3 mr-1 text-green-400" />Confirmed &nbsp;·&nbsp;
        <HelpCircle className="inline w-3 h-3 mr-1 text-gray-300" />Estimated &nbsp;·&nbsp;
        Generated {new Date(report.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}
