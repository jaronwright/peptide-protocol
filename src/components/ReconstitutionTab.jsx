export default function ReconstitutionTab({ peps, totalBac, bacV, sid }) {
  return (
    <div>
      <div className="text-[22px] font-extrabold text-[#F0F2F5] mb-1">Reconstitution Guide</div>
      <p className="text-[13px] text-gray-500 mb-6">How to prepare and dose each compound. Same process, different volumes.</p>

      {/* What You Need */}
      <div className="card">
        <div className="text-sm font-bold text-[#F0F2F5] mb-3">What You Need</div>
        {[
          { i: 'Bacteriostatic Water (BAC)', d: `${bacV} \u00d7 30ml vials (${totalBac}ml total needed)` },
          { i: 'Insulin Syringes', d: 'U-100, 1ml, 29-31 gauge, \u00bd inch' },
          { i: 'Alcohol Swabs', d: '1 box \u2014 wipe every vial top before drawing' },
          { i: 'Sharps Container', d: 'For used syringes \u2014 never trash or reuse' },
        ].map((r, i) => (
          <div key={i} className="flex gap-3 py-2.5 px-3.5 bg-white/[0.02] rounded-[10px] mb-1.5 items-center">
            <span className="text-ghk text-[15px] shrink-0">{'\u2713'}</span>
            <div>
              <span className="text-[13px] font-semibold text-[#F0F2F5]">{r.i}</span>
              {' \u2014 '}
              <span className="text-xs text-[#7B8194]">{r.d}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Per-peptide */}
      <div className="text-base font-extrabold text-[#F0F2F5] mt-6 mb-3.5">Mixing Each Compound</div>

      {peps.map(p => (
        <div key={p.key} className="card border-l-[3px] mb-4" style={{ borderLeftColor: p.color }}>
          <div className="text-[15px] font-bold mb-3.5" style={{ color: p.color }}>{p.name}</div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2.5 mb-4">
            {[
              { l: 'Vial Size', v: `${p.mg}mg`, s: 'lyophilized powder' },
              { l: 'Add BAC Water', v: `${p.bac}ml`, s: `= ${p.bac * 100} units on syringe` },
              { l: 'Concentration', v: p.conc, s: 'after mixing' },
              { l: 'Your Dose', v: p.doseLabel, s: `draw ${p.units} units (${(p.units / 100).toFixed(1)}ml)` },
              { l: 'Doses Per Vial', v: `${Math.floor(p.mg / p.dose)}`, s: `${Math.floor(p.mg / p.dose)} days if daily` },
              { l: 'Shelf Life', v: '28 days', s: 'refrigerated after mixing' },
            ].map((x, i) => (
              <div key={i} className="bg-black/20 rounded-[10px] py-2.5 px-3.5">
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-[3px]">{x.l}</div>
                <div className="text-base font-bold text-[#F0F2F5]">{x.v}</div>
                <div className="text-[11px] text-gray-500">{x.s}</div>
              </div>
            ))}
          </div>

          {/* Syringe visual */}
          <div className="bg-black/25 rounded-[10px] py-3.5 px-[18px]">
            <div className="text-xs font-semibold text-[#F0F2F5] mb-2">Syringe Reference</div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative w-[200px] h-7 bg-white/[0.06] rounded-full overflow-hidden border border-white/10">
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ width: `${p.units}%`, background: `${p.color}30` }}
                />
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(u => (
                  <div
                    key={u}
                    className="absolute top-0 h-full w-px"
                    style={{ left: `${u}%`, background: u === p.units ? '#F0F2F5' : 'rgba(255,255,255,0.06)' }}
                  />
                ))}
                <div
                  className="absolute -top-0.5 text-[10px] font-bold"
                  style={{ left: `${p.units}%`, transform: 'translateX(-50%)', color: p.color }}
                >
                  {'\u25bc'}
                </div>
              </div>
              <div className="text-[13px] text-[#8B8FA3]">
                Fill to the <strong style={{ color: p.color }}>{p.units} unit</strong> mark = <strong className="text-[#F0F2F5]">{p.doseLabel}</strong>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Mixing steps */}
      <div className="text-base font-extrabold text-[#F0F2F5] mt-7 mb-3.5">Step-by-Step: Mixing a New Vial</div>
      {[
        { n: 1, t: 'Wipe the vial', d: 'Clean the rubber stopper with an alcohol swab. Let it air dry for a few seconds.', c: '#4F8CF7' },
        { n: 2, t: 'Draw bacteriostatic water', d: 'With a fresh syringe, slowly draw the correct amount of BAC water (see amounts above). Pull steadily to avoid air bubbles.', c: '#4F8CF7' },
        { n: 3, t: 'Inject into the vial slowly', d: 'Insert the needle through the stopper at a slight angle. Release the water SLOWLY down the inside glass wall \u2014 never spray directly onto the powder. This protects the peptide structure.', c: '#4F8CF7' },
        { n: 4, t: 'Let it dissolve', d: 'Wait 2\u20133 minutes. Then gently swirl the vial \u2014 never shake. The solution should be completely clear with no particles or cloudiness.', c: '#4F8CF7' },
        { n: 5, t: 'Label and refrigerate', d: "Write today\u2019s date on the vial. Store upright in the fridge at 36\u201346\u00b0F (2\u20138\u00b0C). Good for exactly 28 days from this date \u2014 then discard regardless of how much is left.", c: '#4F8CF7' },
      ].map(s => (
        <div key={s.n} className="card flex gap-4 items-start py-4 px-5 mb-2">
          <div className="sn" style={{ background: `${s.c}22`, color: s.c }}>{s.n}</div>
          <div>
            <div className="text-sm font-bold text-[#F0F2F5] mb-[3px]">{s.t}</div>
            <div className="text-[13px] text-[#8B8FA3] leading-relaxed">{s.d}</div>
          </div>
        </div>
      ))}

      {/* Injection steps */}
      <div className="text-base font-extrabold text-[#F0F2F5] mt-7 mb-3.5">Step-by-Step: Daily Injection</div>
      <p className="text-[13px] text-gray-500 mb-3.5">Repeat for each compound. Always use a fresh syringe &mdash; never combine peptides in one syringe.</p>
      {[
        { n: 1, t: 'Draw your dose', d: 'Swab the vial top. Insert syringe needle, flip vial upside down, and slowly pull the plunger to your dose mark.', c: '#34D399' },
        { n: 2, t: 'Remove air bubbles', d: 'Hold syringe needle-up. Flick the barrel gently \u2014 bubbles float to the top. Push the plunger slightly until a tiny drop appears at the needle tip.', c: '#34D399' },
        { n: 3, t: 'Choose injection site', d: 'Pinch a fold of skin on your abdomen (2 inches from navel), upper thigh, or upper arm. Rotate sites daily to avoid irritation.', c: '#34D399' },
        { n: 4, t: 'Inject subcutaneously', d: 'Insert needle at a 45\u00b0 angle into the pinched skin fold. Push the plunger slowly and steadily. Withdraw, apply light pressure with a clean swab.', c: '#34D399' },
      ].map(s => (
        <div key={s.n} className="card flex gap-4 items-start py-4 px-5 mb-2">
          <div className="sn" style={{ background: `${s.c}22`, color: s.c }}>{s.n}</div>
          <div>
            <div className="text-sm font-bold text-[#F0F2F5] mb-[3px]">{s.t}</div>
            <div className="text-[13px] text-[#8B8FA3] leading-relaxed">{s.d}</div>
          </div>
        </div>
      ))}

      {/* Subject B note */}
      {sid === 'b' && (
        <div className="card border-l-[3px] border-l-bpc bg-bpc/[0.04]">
          <div className="text-[13px] font-bold text-blue-300 mb-1">Subject B &mdash; Targeted Injection</div>
          <div className="text-[13px] text-[#8B8FA3] leading-relaxed">
            For BPC-157/TB-500, consider rotating injection sites near the right knee and lower back/QL region to enhance local tissue repair where you need it most.
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="card border-l-[3px] border-l-red-500 bg-red-500/[0.04]">
        <div className="text-sm font-bold text-red-300 mb-2">Rules</div>
        <div className="text-[13px] text-red-300 leading-[1.8]">
          &bull; <strong>One syringe, one compound.</strong> Never mix peptides in the same syringe.<br />
          &bull; Never reuse a syringe &mdash; into the sharps container immediately.<br />
          &bull; Discard any reconstituted vial after 28 days, even with liquid remaining.<br />
          &bull; If solution looks cloudy, has particles, or changed color &mdash; throw it out.<br />
          &bull; Keep all reconstituted vials refrigerated. Never freeze.
        </div>
      </div>
    </div>
  );
}
