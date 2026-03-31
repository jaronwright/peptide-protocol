export const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
export const fmtF = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
export const fmtMY = (d) => d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
export const same = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const diffD = (a, b) => Math.round((b - a) / 864e5);
