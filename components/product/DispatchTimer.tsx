'use client';

import { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function DispatchTimer() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const getCutoff = () => {
      const cutoff = new Date();
      cutoff.setHours(16, 0, 0, 0); // 4 PM cutoff
      if (new Date() > cutoff) cutoff.setDate(cutoff.getDate() + 1);
      return cutoff;
    };

    const cutoff = getCutoff();

    const tick = () => {
      const diff = cutoff.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft(''); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3 text-sm text-blue-800">
      <div className="bg-blue-100 p-1.5 rounded-full animate-pulse shrink-0">
        <ClockIcon className="h-4 w-4 text-blue-600" />
      </div>
      <span>
        Order within{' '}
        <span className="font-bold font-mono text-blue-700">{timeLeft}</span>{' '}
        for dispatch <span className="font-bold underline">Today</span>.
      </span>
    </div>
  );
}
