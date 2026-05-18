'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

// Define the props this component needs to work
interface CompatibilityCheckerProps {
  modelList: string[]; // The list of models this part fits (e.g., ["WA80", "WA85", ...])
}

export default function CompatibilityChecker({ modelList }: CompatibilityCheckerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<'idle' | 'match' | 'no-match'>('idle');
  const [matchedModels, setMatchedModels] = useState<string[]>([]);

  const handleCheck = () => {
    if (!searchQuery.trim()) return;

    // The logic: Find models that contain the search string (case-insensitive)
    const matches = modelList.filter(model => 
      model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matches.length > 0) {
      setMatchedModels(matches);
      setResult('match');
    } else {
      setMatchedModels([]);
      setResult('no-match');
    }
  };

  return (
    <div className="bg-brand-lightGreen border-2 border-brand-green/20 rounded-lg p-6 my-8">
      <h3 className="text-xl font-bold text-brand-green mb-2">
        Guaranteed Compatibility Check
      </h3>
      <p className="text-gray-700 mb-4">
        Enter your machine's model number (e.g., "WA80H4000") to verify fitment.
      </p>

      {/* Search Input Area */}
      <div className="flex gap-2 relative max-w-md">
        <input 
          type="text" 
          placeholder="Type Model Number here..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setResult('idle'); // Reset result when typing again
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          className="w-full p-3 pl-4 pr-12 border-2 border-gray-300 rounded-md focus:outline-none focus:border-brand-green uppercase"
        />
        <button 
          onClick={handleCheck}
          className="absolute right-2 top-2 bg-brand-green text-white p-2 rounded-md hover:bg-brand-green/90"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Result Messages */}
      {result === 'match' && (
        <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded">
          <div className="flex items-start">
            <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Yes! This part fits.</p>
              <p className="text-sm mt-1">Compatible with these models based on your search:</p>
              <ul className="list-disc list-inside mt-2 font-mono text-sm">
                {matchedModels.slice(0, 5).map((m, i) => <li key={i}>{m}</li>)}
                {matchedModels.length > 5 && <li>and {matchedModels.length - 5} others...</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {result === 'no-match' && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded">
          <div className="flex items-start">
            <XCircleIcon className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">No match found.</p>
              <p className="text-sm mt-1">This part may not fit "{searchQuery}". Please double-check your model number or contact us for help.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}