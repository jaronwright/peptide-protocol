import { START } from '../data/constants';
import { fmt } from '../utils/format';

export default function OverviewTab({ peps, sims, protDays, protEnd, activeCyc, totalBac, bacV }) {
  return (
    <div>
      {/* Stat grid */}
      <div className="grid grid-cols-4 gap-2.5 mb-[22px]">
        {[
          { l: 'Duration', v: `${protDays} days`, s: `${fmt(START)} \u2192 ${fmt(protEnd)}` },
          { l: 'ON Cycles', v: activeCyc.length, s: '8wk on / 4wk off' },
          { l: 'BAC Water', v: `${totalBac}ml`, s: `${bacV}\u00d730ml vial${bacV > 1 ? 's' : ''}` },
          { l: 'Daily Shots', v: '3', s: 'separate syringes' },
        ].map((x, i) => (
          <div key={i} className="card text-center p-3.5">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-zinc-600 mb-1">{x.l}</div>
            <div className="text-xl font-extrabold text-[#F0F2F5]">{x.v}</div>
            <div className="text-[11px] text-zinc-600 mt-0.5">{x.s}</div>
          </div>
        ))}
      </div>

      {/* Peptide cards */}
      {peps.map(p => {
        const sim = sims[p.key];
        return (
          <div key={p.key} className="card flex gap-5 items-start flex-wrap border-l-[3px]" style={{ borderLeftColor: p.color }}>
            <div className="flex-[1_1_280px]">
              <div className="text-base font-bold text-[#F0F2F5] mb-1">{p.name}</div>
              <div className="text-[13px] text-[#7B8194] mb-2">{p.purpose}</div>
              <div className="flex gap-1.5 flex-wrap">
                <span
                  className="px-2.5 py-[3px] rounded-full text-[11px] font-semibold"
                  style={{ background: `${p.color}18`, color: p.color }}
                >
                  {p.doseLabel}/day
                </span>
                <span className="px-2.5 py-[3px] rounded-full bg-white/5 text-[#8B8FA3] text-[11px]">
                  {p.vials} vials &middot; {p.mg}mg each
                </span>
                <span className={`px-2.5 py-[3px] rounded-full text-[10px] font-semibold ${p.doesCycle ? 'bg-amber-400/10 text-amber-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
                  {p.doesCycle ? 'Cycles 8/4' : 'Runs continuous'}
                </span>
              </div>
            </div>
            <div className="flex gap-5 flex-wrap">
              {[
                { l: 'Active Days', v: sim.totalDosed, c: '#F0F2F5' },
                { l: 'Vials Used', v: `${sim.vialsUsed}/${p.vials}`, c: '#F0F2F5' },
                { l: 'Last Dose', v: sim.lastDoseDay ? fmt(sim.lastDoseDay.date) : '\u2014', c: '#F0F2F5' },
                { l: 'Waste', v: sim.totalWaste > 0 ? `${sim.totalWaste}mg` : 'None', c: sim.totalWaste > 0 ? '#FBBF24' : '#34D399' },
              ].map((x, i) => (
                <div key={i} className="text-center">
                  <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-[3px]">{x.l}</div>
                  <div className="text-[15px] font-bold" style={{ color: x.c }}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Synergy info */}
      <div className="card" style={{ background: 'linear-gradient(135deg,rgba(79,140,247,0.05),rgba(52,211,153,0.05))' }}>
        <div className="text-sm font-bold text-[#F0F2F5] mb-2">How They Work Together</div>
        <div className="text-[13px] text-[#8B8FA3] leading-[1.7]">
          <strong className="text-bpc">BPC-157 + TB-500</strong> coordinate repair &mdash; BPC-157 organizes healing and upregulates growth factors while TB-500 reduces inflammation and mobilizes stem cells. <strong className="text-ghk">GHK-Cu</strong> drives rebuild quality &mdash; collagen, elastin, and younger gene expression. <strong className="text-kpv">KPV</strong> suppresses NF-&#954;B inflammation so repair proceeds without immune interference. KPV runs continuously since it&rsquo;s a simple anti-inflammatory tripeptide &mdash; no receptor desensitization concern.
        </div>
      </div>

      {/* Cycling logic */}
      <div className="card border-l-[3px] border-l-amber-400">
        <div className="text-sm font-bold text-amber-400 mb-1">Cycling Logic</div>
        <div className="text-[13px] text-[#8B8FA3] leading-[1.7]">
          <strong className="text-[#F0F2F5]">BPC-157/TB-500 and GHK-Cu</strong> cycle 8 weeks on, 4 weeks off to prevent receptor desensitization. <strong className="text-[#F0F2F5]">KPV</strong> runs continuously &mdash; as a tripeptide fragment it doesn&rsquo;t carry the same desensitization risk. Not all compounds need to start and stop together. A vial won&rsquo;t be opened if there isn&rsquo;t enough time left in the cycle to use a meaningful portion of it.
        </div>
      </div>
    </div>
  );
}
