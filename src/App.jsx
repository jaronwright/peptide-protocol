import { useState, useMemo } from 'react';
import { START } from './data/constants';
import { SUBJECTS, makePeptides, TABS } from './data/subjects';
import { buildCycles } from './engine/cycles';
import { simulate } from './engine/simulate';
import { fmtF, diffD } from './utils/format';
import Header from './components/Header';
import TabBar from './components/TabBar';
import OverviewTab from './components/OverviewTab';
import ReconstitutionTab from './components/ReconstitutionTab';
import TimelineTab from './components/TimelineTab';
import CalendarTab from './components/CalendarTab';
import SupplementsTab from './components/SupplementsTab';

export default function App() {
  const [sid, setSid] = useState('a');
  const [tab, setTab] = useState('overview');
  const [calM, setCalM] = useState(new Date(2026, 3, 1));

  const subj = SUBJECTS[sid];
  const peps = useMemo(() => makePeptides(subj), [sid]);
  const cycles = useMemo(() => buildCycles(START, 8), []);
  const sims = useMemo(() => {
    const o = {};
    for (const p of peps) o[p.key] = simulate(p, START, cycles);
    return o;
  }, [sid]);

  const allLast = peps.map(p => sims[p.key].lastDoseDay?.date).filter(Boolean);
  const protEnd = allLast.length ? new Date(Math.max(...allLast)) : START;
  const protDays = diffD(START, protEnd) + 1;
  const activeCyc = cycles.filter(c =>
    peps.some(p => sims[p.key].dayLog.some(d => d.dosed && d.date >= c.onStart && d.date <= c.onEnd))
  );
  const totalBac = peps.reduce((s, p) => s + p.bac * p.vials, 0);
  const bacV = Math.ceil(totalBac / 30);

  return (
    <div className="font-sans bg-dark-bg text-[#C9CDD8] min-h-screen">
      <Header
        subjects={SUBJECTS}
        sid={sid}
        onSelect={(id) => { setSid(id); setTab('overview'); }}
      />
      <TabBar tabs={TABS} tab={tab} onSelect={setTab} />

      <div className="max-w-[860px] mx-auto px-6 pt-6 pb-20">
        {tab === 'overview' && (
          <OverviewTab
            peps={peps} sims={sims}
            protDays={protDays} protEnd={protEnd}
            activeCyc={activeCyc} totalBac={totalBac} bacV={bacV}
          />
        )}
        {tab === 'recon' && (
          <ReconstitutionTab peps={peps} totalBac={totalBac} bacV={bacV} sid={sid} />
        )}
        {tab === 'timeline' && (
          <TimelineTab
            peps={peps} sims={sims} cycles={cycles}
            protEnd={protEnd} activeCyc={activeCyc}
          />
        )}
        {tab === 'calendar' && (
          <CalendarTab
            peps={peps} sims={sims} cycles={cycles}
            calM={calM} setCalM={setCalM}
          />
        )}
        {tab === 'supplements' && <SupplementsTab />}
      </div>

      <div className="border-t border-white/[0.08] py-5 px-6 text-center">
        <div className="text-[11px] text-[#2A2E3D]">
          Research protocol &middot; For investigational purposes only &middot; {fmtF(new Date())}
        </div>
      </div>
    </div>
  );
}
