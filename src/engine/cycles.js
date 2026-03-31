import { CYCLE_ON, CYCLE_OFF } from '../data/constants';

export function buildCycles(start, n = 8) {
  const c = [];
  let d = new Date(start);
  for (let i = 1; i <= n; i++) {
    const onS = new Date(d);
    const onE = new Date(d);
    onE.setDate(onE.getDate() + CYCLE_ON - 1);
    const offS = new Date(onE);
    offS.setDate(offS.getDate() + 1);
    const offE = new Date(offS);
    offE.setDate(offE.getDate() + CYCLE_OFF - 1);
    c.push({ num: i, onStart: onS, onEnd: onE, offStart: offS, offEnd: offE });
    d = new Date(offE);
    d.setDate(d.getDate() + 1);
  }
  return c;
}
