import { START } from '../data/constants';
import { fmtMY, same } from '../utils/format';

export default function CalendarTab({ peps, sims, cycles, calM, setCalM }) {
  const allLast = peps.map(p => sims[p.key].lastDoseDay?.date).filter(Boolean);
  const protEnd = allLast.length ? new Date(Math.max(...allLast)) : START;

  const mStart = new Date(calM.getFullYear(), calM.getMonth(), 1);
  const mEnd = new Date(calM.getFullYear(), calM.getMonth() + 1, 0);
  const cells = [];
  for (let i = 0; i < mStart.getDay(); i++) cells.push(null);
  for (let d = 1; d <= mEnd.getDate(); d++) {
    const dt = new Date(calM.getFullYear(), calM.getMonth(), d);
    const isOn = cycles.some(c => dt >= c.onStart && dt <= c.onEnd);
    const dp = {}, ev = [];
    for (const p of peps) {
      const dl = sims[p.key].dayLog.find(x => same(x.date, dt));
      if (dl?.dosed) dp[p.key] = p;
      if (dl?.action === 'reconstitute') ev.push({ t: 'mix', p, v: dl.vialNum });
      const vl = sims[p.key].vialLog.find(v => same(v.disposeDate, dt));
      if (vl) ev.push({ t: 'toss', p, v: vl.num, w: vl.waste, r: vl.reason });
    }
    cells.push({ dt, isOn, dp, ev });
  }

  const today = new Date();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          className="gb bg-dark-elevated border border-white/[0.08] text-[#F0F2F5] rounded-[10px] py-2 px-4 font-sans text-xs"
          onClick={() => setCalM(new Date(calM.getFullYear(), calM.getMonth() - 1, 1))}
        >
          {'\u2190'}
        </button>
        <div className="text-[17px] font-bold text-[#F0F2F5]">{fmtMY(calM)}</div>
        <button
          className="gb bg-dark-elevated border border-white/[0.08] text-[#F0F2F5] rounded-[10px] py-2 px-4 font-sans text-xs"
          onClick={() => setCalM(new Date(calM.getFullYear(), calM.getMonth() + 1, 1))}
        >
          {'\u2192'}
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3.5 mb-3 flex-wrap">
        {peps.map(p => (
          <div key={p.key} className="flex items-center gap-[5px] text-[11px] text-[#7B8194]">
            <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: p.color }} />
            {p.short}
          </div>
        ))}
        <div className="flex items-center gap-[5px] text-[11px] text-[#7B8194]">
          <div className="w-2.5 h-2.5 rounded-[3px] bg-ghk" />Mix
        </div>
        <div className="flex items-center gap-[5px] text-[11px] text-[#7B8194]">
          <div className="w-2.5 h-2.5 rounded-[3px] bg-red-500" />Toss
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center py-2 text-[10px] font-semibold text-zinc-600 tracking-wider">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`e${i}`} className="min-h-[72px] bg-dark-card rounded-md" />;
          const { dt, isOn, dp, ev } = cell;
          const hasDose = Object.keys(dp).length > 0;
          const isOff = !isOn && dt >= START && dt <= protEnd && !hasDose;
          const isToday = same(dt, today);

          return (
            <div
              key={i}
              className={`min-h-[72px] p-[5px] rounded-md ${isToday ? 'border border-bpc' : 'border border-transparent'}`}
              style={{
                background: isOff
                  ? 'repeating-linear-gradient(135deg,#1B1F2E,#1B1F2E 3px,#141720 3px,#141720 6px)'
                  : hasDose ? '#232838' : '#1B1F2E',
              }}
            >
              <div className={`text-[11px] mb-[3px] ${isToday ? 'font-bold' : 'font-normal'} ${hasDose ? 'text-[#F0F2F5]' : isOff ? 'text-zinc-700' : 'text-[#2A2E3D]'}`}>
                {dt.getDate()}
              </div>
              {hasDose && (
                <div className="flex gap-0.5 mb-0.5">
                  {Object.entries(dp).map(([k, p]) => (
                    <div key={k} className="w-[7px] h-[7px] rounded-[2px]" style={{ background: p.color }} />
                  ))}
                </div>
              )}
              {ev.map((e, j) => (
                <div key={j} className={`text-[7px] font-bold tracking-wider uppercase leading-[1.5] ${e.t === 'mix' ? 'text-ghk' : 'text-red-500'}`}>
                  {e.t === 'mix' ? 'MIX' : 'TOSS'} {e.p.short}
                </div>
              ))}
              {isOff && !ev.length && <div className="text-[7px] text-[#2A2E3D] mt-0.5">OFF</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
