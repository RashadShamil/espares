interface Spec {
  key: string;
  value: string;
}

interface TechSpecHudProps {
  sku: string;
  serialNumber?: string;
  specs: Spec[];
}

export default function TechSpecHud({ sku, serialNumber, specs }: TechSpecHudProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-800 bg-brand-ink">

      {/* Terminal title bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#111d16] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <span className="text-[10px] font-mono-tech text-gray-500 ml-2 uppercase tracking-[0.15em]">
            Technical Specifications
          </span>
        </div>
        <span className="text-[10px] font-mono-tech text-brand-green/60 animate-pulse-badge">
          ● LIVE
        </span>
      </div>

      {/* Spec table */}
      <div className="p-5 font-mono-tech">
        {/* Primary identifiers */}
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/5">
          <div className="flex-1">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">SKU</p>
            <p className="text-brand-green text-sm font-semibold">{sku}</p>
          </div>
          {serialNumber && (
            <div className="flex-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Serial No.</p>
              <p className="text-gray-300 text-sm">{serialNumber}</p>
            </div>
          )}
        </div>

        {/* Spec rows */}
        <div className="space-y-3">
          {specs.map((spec, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-4 text-sm py-2 border-b border-white/5 last:border-0"
            >
              <span className="text-gray-500 text-xs uppercase tracking-wider shrink-0 w-32">{spec.key}</span>
              <span className="text-gray-200 text-right">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Terminal prompt */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2">
          <span className="text-brand-green text-xs">$</span>
          <span className="text-gray-600 text-xs font-mono-tech">espares.lk/parts/{sku.toLowerCase()}</span>
          <span className="inline-block w-1.5 h-3.5 bg-brand-green/70 animate-pulse ml-0.5" />
        </div>
      </div>
    </div>
  );
}
