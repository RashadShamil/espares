'use client';

import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ProductTabsProps {
  description: string;
  specifications: { key: string; value: string }[];
  features: string[];
}

export default function ProductTabs({ description, specifications, features }: ProductTabsProps) {
  // State to control which tab is active
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'features'>('description');

  const tabBtnClasses = (tabName: string) => `
    py-4 px-6 text-sm font-medium focus:outline-none capitalize border-b-2 transition-all
    ${activeTab === tabName
      ? 'border-brand-yellow text-brand-green font-bold'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
  `;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex bg-gray-50 border-b border-gray-200">
        <button onClick={() => setActiveTab('description')} className={tabBtnClasses('description')}>Description</button>
        <button onClick={() => setActiveTab('specifications')} className={tabBtnClasses('specifications')}>Specifications</button>
        <button onClick={() => setActiveTab('features')} className={tabBtnClasses('features')}>Features</button>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'description' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{description}</p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div>
             <h3 className="text-xl font-bold text-gray-900 mb-6">Key Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {specifications.map((spec, index) => (
                <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                  <dt className="text-gray-600 font-medium">{spec.key}</dt>
                  <dd className="text-gray-900 font-semibold text-right">{spec.value}</dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Key Features</h3>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-brand-green mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}