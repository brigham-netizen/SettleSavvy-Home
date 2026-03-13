'use client';

import { PriceTrend } from '@/types/utilities';

interface Props {
  data: PriceTrend[];
  color?: string;
}

export default function SparklineChart({ data, color = '#3b82f6' }: Props) {
  if (data.length < 2) return null;

  const values = data.map(d => d.averageCost);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const W = 120;
  const H = 36;
  const pad = 2;

  const points = values
    .slice()
    .reverse()
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (W - pad * 2);
      const y = H - pad - ((v - min) / range) * (H - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const latest = values[0];
  const oldest = values[values.length - 1];
  const delta = latest - oldest;
  const sign = delta >= 0 ? '+' : '';
  const pct = oldest !== 0 ? ((delta / oldest) * 100).toFixed(1) : '0.0';
  const trendColor = delta > 0 ? '#ef4444' : '#22c55e';

  return (
    <div className="flex items-end gap-3 mt-1">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xs font-medium" style={{ color: trendColor }}>
        {sign}{pct}% (12mo)
      </span>
    </div>
  );
}
