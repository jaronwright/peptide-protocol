export function simulate(pep, start, cycles) {
  const daysPerVial = Math.floor(pep.mg / pep.dose);
  const isOnDay = (d) => !pep.doesCycle || cycles.some(c => d >= c.onStart && d <= c.onEnd);
  const onDaysRemaining = (d) => {
    if (!pep.doesCycle) return 999;
    const c = cycles.find(cy => d >= cy.onStart && d <= cy.onEnd);
    if (!c) return 0;
    return Math.round((c.onEnd - d) / 864e5) + 1;
  };
  const minDaysToOpen = Math.ceil(Math.min(daysPerVial, pep.shelf) * 0.4);

  let vialsLeft = pep.vials, cur = null, vNum = 0;
  const vLog = [], dLog = [];
  const simEnd = cycles[cycles.length - 1].offEnd;
  let d = new Date(start);

  while (d <= simEnd) {
    const on = isOnDay(d);
    let action = null, dosed = false;

    if (cur && d > cur.expiry) {
      vLog.push({ ...cur, endDate: new Date(cur.expiry), disposeDate: new Date(d), reason: 'expired', waste: parseFloat(cur.mgLeft.toFixed(1)) });
      cur = null;
    }

    if (on) {
      if (!cur && vialsLeft > 0) {
        const rem = onDaysRemaining(d);
        if (rem >= minDaysToOpen) {
          vNum++; vialsLeft--;
          const exp = new Date(d); exp.setDate(exp.getDate() + pep.shelf - 1);
          cur = { num: vNum, reconDate: new Date(d), mgLeft: pep.mg, expiry: exp };
          action = 'reconstitute';
        }
      }
      if (cur && cur.mgLeft >= pep.dose) {
        cur.mgLeft = parseFloat((cur.mgLeft - pep.dose).toFixed(4));
        dosed = true;
        if (cur.mgLeft < pep.dose * 0.5) {
          const nd = new Date(d); nd.setDate(nd.getDate() + 1);
          vLog.push({ ...cur, endDate: new Date(d), disposeDate: nd, reason: 'empty', waste: parseFloat(cur.mgLeft.toFixed(1)) });
          cur = null;
        }
      }
    }
    dLog.push({ date: new Date(d), on, dosed, action, vialNum: dosed ? vNum : null });
    d = new Date(d); d.setDate(d.getDate() + 1);
  }
  if (cur) vLog.push({ ...cur, endDate: new Date(d), disposeDate: new Date(d), reason: 'end', waste: parseFloat(cur.mgLeft.toFixed(1)) });

  return {
    vialLog: vLog,
    dayLog: dLog,
    totalDosed: dLog.filter(x => x.dosed).length,
    totalWaste: parseFloat(vLog.reduce((s, v) => s + v.waste, 0).toFixed(1)),
    lastDoseDay: [...dLog].reverse().find(x => x.dosed),
    vialsUsed: vNum,
  };
}
