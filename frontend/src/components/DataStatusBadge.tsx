import React from 'react';
import { MarketStatus } from '../types';

interface Props {
  status: MarketStatus | null;
}

export const DataStatusBadge: React.FC<Props> = ({ status }) => {
  if (!status) {
    return (
      <div className="flex items-center gap-1.5 bg-[#0D121A] border border-[#27303B] text-[#8994A3] px-2.5 py-1 rounded text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-[#5F6B79] animate-pulse"></span>
        <span>CONNECTING...</span>
      </div>
    );
  }

  const isLive = status.status_code === 'LIVE';
  const isDelayed = status.status_code === 'DELAYED';
  const isClosed = ['CLOSED', 'WEEKEND', 'HOLIDAY'].includes(status.status_code);

  const badgeColor = isLive
    ? 'bg-[#111823] border-[#00C896]/40 text-[#00C896]'
    : isDelayed
    ? 'bg-[#111823] border-[#F0B44D]/40 text-[#F0B44D]'
    : 'bg-[#111823] border-[#27303B] text-[#8994A3]';

  const dotColor = isLive ? 'bg-[#00C896]' : isDelayed ? 'bg-[#F0B44D]' : 'bg-[#5F6B79]';

  const label = isLive
    ? 'MARKET: LIVE'
    : isDelayed
    ? 'MARKET: DELAYED'
    : `MARKET: CLOSED (${status.status_code})`;

  return (
    <div
      className={`flex items-center gap-2 border px-3 py-1 rounded text-xs font-mono shadow-sm ${badgeColor}`}
      title={status.description}
    >
      <div className="relative flex h-2 w-2">
        {isLive && <span className="absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#00C896] animate-ping" />}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </div>
      <span className="font-semibold tracking-wide">{label}</span>
      <span className="text-[#5F6B79] text-[10px] hidden sm:inline">| {status.timestamp}</span>
    </div>
  );
};
