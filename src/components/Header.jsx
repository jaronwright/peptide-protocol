export default function Header({ subjects, sid, onSelect }) {
  return (
    <div className="bg-gradient-to-b from-dark-card to-dark-bg border-b border-white/[0.08] pt-8 px-6 pb-6">
      <div className="max-w-[860px] mx-auto">
        <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-ghk mb-2.5 flex items-center gap-2">
          <span className="w-[7px] h-[7px] rounded-full bg-ghk shadow-[0_0_8px_#34D399]" />
          Active Protocol
        </div>
        <h1 className="text-[28px] font-extrabold text-[#F0F2F5] tracking-tight mb-1">
          Peptide Research Protocol
        </h1>
        <p className="text-[13px] text-gray-500">
          BPC-157/TB-500 &middot; KPV &middot; GHK-Cu &mdash; with structured cycling
        </p>
        <div className="mt-[18px] flex gap-2.5">
          {Object.values(subjects).map(s => (
            <button
              key={s.id}
              className="gb rounded-xl font-sans text-[13px] font-semibold"
              onClick={() => onSelect(s.id)}
              style={{
                padding: '10px 20px',
                border: sid === s.id ? '2px solid #4F8CF7' : '1px solid rgba(255,255,255,0.1)',
                background: sid === s.id ? 'rgba(79,140,247,0.1)' : 'rgba(255,255,255,0.03)',
                color: sid === s.id ? '#93C5FD' : '#6B7280',
              }}
            >
              <div>{s.label}</div>
              <div className="text-[11px] font-normal mt-0.5 opacity-70">{s.tag}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
