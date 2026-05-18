'use client';

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const menuItems = [
  { 
    id: 1, 
    label: 'Washing Machines', 
    icon: '⚙', 
    sub: ['PCB', 'Water Level Sensor', 'Pulsators', 'Inlet Valve', 'Drain Hose', 'Shock Absorbers', 'Belt', 'Clutch/Gearbox', 'Drain Motors', 'Door Lock', 'Spider Arm', 'Capacitors', 'Others'] 
  },
  { 
    id: 2, 
    label: 'Air Conditioners', 
    icon: '❄', 
    sub: ['Remote', 'IDU Motor', 'ODU Motor', 'PCB', 'Capacitors', 'Others'] 
  },
  { 
    id: 3, 
    label: 'Refrigerators', 
    icon: '🗄', 
    sub: ['Refrigerator Motors', 'PCB', 'Thermostat', 'Overload/Relay', 'Heating Condenser', 'Sensor/Bi-metal', 'Timer', 'Others'] 
  },
];

export default function SidebarMenu() {
  return (
    <div className="w-full h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-card flex flex-col">

      {/* Header */}
      <div className="bg-brand-green px-5 py-4 flex items-center gap-2.5">
        <svg className="w-4 h-4 text-brand-yellow-light" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 012 10z" clipRule="evenodd"/>
        </svg>
        <span className="text-white font-semibold text-sm tracking-wide">All Categories</span>
      </div>

      {/* Menu items */}
      <ul className="flex-1 flex flex-col divide-y divide-gray-50 overflow-visible">
        {menuItems.map((item) => (
          <li key={item.id} className="group relative">
            <button className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-brand-light hover:text-brand-green transition-colors gap-3">
              <span className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                {item.label}
              </span>
              <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-green transition-colors flex-shrink-0" />
            </button>

            {/* Flyout */}
            <div className="absolute left-full top-0 min-w-[200px] bg-white border border-gray-100 rounded-2xl shadow-card-hover p-4 hidden group-hover:block z-50 ml-1">
              <p className="text-[10px] font-mono-tech text-gray-400 uppercase tracking-[0.15em] mb-3">{item.label}</p>
              <ul className="space-y-2">
                {item.sub.map((sub) => (
                  <li key={sub}>
                    <Link
                      href={`/search?q=${encodeURIComponent(sub)}`}
                      className="text-sm text-gray-600 hover:text-brand-green flex items-center gap-2 group/link transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-brand-green/30 group-hover/link:bg-brand-green transition-colors" />
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer CTA */}
      <div className="border-t border-gray-100">
        <Link
          href="/search"
          className="flex items-center justify-between px-4 py-3.5 text-xs font-semibold text-brand-yellow hover:bg-brand-yellow-pale transition-colors font-mono-tech uppercase tracking-wider group"
        >
          View All Parts
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}