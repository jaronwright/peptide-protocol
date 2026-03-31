import { SUPPS } from '../data/subjects';

export default function SupplementsTab() {
  return (
    <div>
      <div className="text-[22px] font-extrabold text-[#F0F2F5] mb-1">Supplements</div>
      <p className="text-[13px] text-gray-500 mb-6">
        Cofactors and performance support for a protocol that includes cycling, weight training, and swimming.
      </p>

      {[
        { tier: 1, label: 'Essential', color: '#34D399', desc: 'Start day one' },
        { tier: 2, label: 'Recommended', color: '#4F8CF7', desc: 'Add if budget allows' },
        { tier: 3, label: 'Optional', color: '#6B7280', desc: 'Nice to have' },
      ].map(t => (
        <div key={t.tier} className="mb-6">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span
              className="py-[3px] px-3 rounded-full text-[11px] font-bold"
              style={{ background: `${t.color}18`, color: t.color }}
            >
              {t.label}
            </span>
            <span className="text-xs text-zinc-600">{t.desc}</span>
          </div>
          {SUPPS.filter(s => s.tier === t.tier).map((sup, i) => (
            <div key={i} className="card border-l-[3px] mb-2 py-3.5 px-[18px]" style={{ borderLeftColor: t.color }}>
              <div className="flex justify-between flex-wrap gap-1.5 mb-1">
                <span className="text-sm font-bold text-[#F0F2F5]">{sup.name}</span>
                <div className="flex gap-3">
                  <span className="text-xs font-semibold" style={{ color: t.color }}>{sup.dose}</span>
                  <span className="text-xs text-zinc-600">{sup.timing}</span>
                </div>
              </div>
              <div className="text-[13px] text-[#8B8FA3] leading-normal">{sup.why}</div>
            </div>
          ))}
        </div>
      ))}

      {/* Daily Timing */}
      <div className="card border-l-[3px] border-l-kpv">
        <div className="text-sm font-bold text-violet-300 mb-3">Daily Timing</div>
        {[
          { time: 'Morning \u00b7 empty stomach', items: 'Peptide injections (all 3) \u2192 Probiotics \u2192 wait 20 min' },
          { time: 'Morning \u00b7 with breakfast', items: 'Creatine \u00b7 Vitamin D3+K2 \u00b7 Vitamin C \u00b7 Omega-3 (half) \u00b7 Collagen' },
          { time: 'Midday \u00b7 with food', items: 'NAC (1st dose) \u00b7 Zinc' },
          { time: 'Evening \u00b7 with dinner', items: 'Omega-3 (half) \u00b7 NAC (2nd dose)' },
          { time: 'Before bed', items: 'Magnesium Glycinate \u00b7 Glycine' },
        ].map((s, i) => (
          <div
            key={i}
            className="flex gap-4 py-2"
            style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
          >
            <div className="text-xs font-semibold text-kpv min-w-[180px] shrink-0">{s.time}</div>
            <div className="text-[13px] text-[#8B8FA3]">{s.items}</div>
          </div>
        ))}
      </div>

      {/* Training Note */}
      <div className="card border-l-[3px] border-l-amber-400 bg-amber-400/[0.03]">
        <div className="text-sm font-bold text-amber-400 mb-1.5">Training Note</div>
        <div className="text-[13px] text-[#8B8FA3] leading-[1.7]">
          <strong className="text-[#F0F2F5]">Injection timing around workouts:</strong> Inject peptides in the morning before training or at least 30 minutes before a workout. BPC-157/TB-500 may enhance recovery when injected post-workout as well. Creatine timing doesn&rsquo;t matter &mdash; just take it daily with water. On heavy training days (long rides, heavy lifts), the recovery benefits of this stack will be most noticeable.
        </div>
      </div>
    </div>
  );
}
