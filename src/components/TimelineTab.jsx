import { START } from '../data/constants';
import { fmt, fmtF, diffD } from '../utils/format';

export default function TimelineTab({ peps, sims, cycles, protEnd, activeCyc }) {
  return (
    <div>
      <div className="text-[22px] font-extrabold text-[#F0F2F5] mb-1">Cycle Timeline</div>
      <p className="text-[13px] text-gray-500 mb-2">
        BPC/TB4 and GHK-Cu cycle 8 weeks on, 4 weeks off. KPV runs continuously through everything.
      </p>

      {/* KPV continuous */}
      <div className="card border-l-[3px] border-l-kpv mb-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="py-[3px] px-2.5 rounded-full bg-kpv/15 text-kpv text-[11px] font-bold">CONTINUOUS</span>
          <span className="text-sm font-semibold text-[#F0F2F5]">KPV</span>
          <span className="text-xs text-gray-500">
            {fmt(START)} {'\u2192'} {sims.kpv.lastDoseDay ? fmt(sims.kpv.lastDoseDay.date) : '\u2014'} ({sims.kpv.totalDosed} days straight, no breaks)
          </span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {sims.kpv.vialLog.map(v => (
            <div key={v.num} className="py-1 px-2.5 bg-kpv/[0.08] rounded-md text-[11px] text-kpv">
              #{v.num} {fmt(v.reconDate)} {'\u2192'} {fmt(v.endDate)}
            </div>
          ))}
        </div>
      </div>

      {/* Cycles */}
      {activeCyc.map(c => {
        const cycVials = {};
        for (const p of peps.filter(p => p.doesCycle)) {
          cycVials[p.key] = sims[p.key].vialLog.filter(v => v.reconDate >= c.onStart && v.reconDate <= c.onEnd);
        }
        const hasNext = peps.some(p => p.doesCycle && sims[p.key].dayLog.some(d => d.dosed && d.date > c.offEnd));
        const cycActive = peps.filter(p => p.doesCycle && sims[p.key].dayLog.some(d => d.dosed && d.date >= c.onStart && d.date <= c.onEnd));

        return (
          <div key={c.num} className="mb-6">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="text-[13px] font-extrabold text-[#F0F2F5] bg-dark-elevated py-[5px] px-3.5 rounded-full">
                Cycle {c.num}
              </span>
              <div className="flex gap-1">
                {cycActive.map(p => (
                  <div key={p.key} className="w-2.5 h-2.5 rounded-[3px]" style={{ background: p.color }} />
                ))}
              </div>
            </div>

            <div className="card border-l-[3px] border-l-ghk mb-2">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="py-1 px-3 rounded-full bg-ghk/[0.12] text-ghk text-[11px] font-bold">ON &mdash; DOSING</span>
                <span className="text-sm font-semibold text-[#F0F2F5]">{fmt(c.onStart)} {'\u2192'} {fmt(c.onEnd)}</span>
                <span className="text-xs text-zinc-600">8 weeks</span>
              </div>

              {peps.filter(p => p.doesCycle).map(p => {
                const vials = cycVials[p.key];
                if (!vials || !vials.length) return null;
                return (
                  <div key={p.key} className="mb-2">
                    <div className="text-xs font-bold mb-1 flex items-center gap-1.5" style={{ color: p.color }}>
                      <div className="w-2 h-2 rounded-[2px]" style={{ background: p.color }} />
                      {p.short}
                    </div>
                    {vials.map(v => (
                      <div key={v.num} className="flex items-center gap-2 py-[7px] px-3 bg-black/15 rounded-lg mb-[3px] text-xs flex-wrap">
                        <span className="font-bold text-[#F0F2F5] min-w-[22px]">#{v.num}</span>
                        <span className="text-ghk">Mix {fmt(v.reconDate)}</span>
                        <span className="text-zinc-700">{'\u2192'}</span>
                        <span className={v.reason === 'empty' ? 'text-[#8B8FA3]' : 'text-amber-400'}>
                          {v.reason === 'empty' ? `Empty ${fmt(v.endDate)}` : `Expires ${fmt(v.endDate)}`}
                        </span>
                        {v.waste > 0.01 && (
                          <span className="text-amber-400 ml-auto font-semibold">{'\u26a0'} {v.waste}mg waste</span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}

              {peps.filter(p => p.doesCycle).filter(p => {
                const l = sims[p.key].lastDoseDay;
                return l && l.date >= c.onStart && l.date < c.onEnd;
              }).map(p => (
                <div key={p.key} className="mt-1.5 py-2 px-3 rounded-lg bg-amber-400/[0.06] border border-amber-400/15 text-xs text-amber-400">
                  {p.short} supply exhausted {fmt(sims[p.key].lastDoseDay.date)} &mdash; {diffD(sims[p.key].lastDoseDay.date, c.onEnd)} days left in cycle without it
                </div>
              ))}
            </div>

            {hasNext && (
              <div className="card border-l-[3px] border-l-zinc-700 bg-white/[0.01] mb-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="py-1 px-3 rounded-full bg-white/[0.04] text-gray-500 text-[11px] font-bold">OFF &mdash; REST</span>
                  <span className="text-sm font-semibold text-gray-500">{fmt(c.offStart)} {'\u2192'} {fmt(c.offEnd)}</span>
                  <span className="text-xs text-zinc-700">4 weeks &middot; BPC/TB4 &amp; GHK-Cu paused &middot; KPV continues</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="text-center p-6 text-zinc-700">
        <div className="text-xl mb-1.5">{'\ud83c\udfc1'}</div>
        <div className="text-sm font-semibold">All supply exhausted</div>
        <div className="text-xs mt-1">{fmtF(protEnd)}</div>
      </div>
    </div>
  );
}
