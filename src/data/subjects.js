export const SUBJECTS = {
  a: { id: 'a', label: 'Subject A', tag: "24F \u00b7 5'8\" \u00b7 120 lbs", ghkVials: 5, ghkDose: 1, ghkUnits: 10 },
  b: { id: 'b', label: 'Subject B', tag: "33M \u00b7 5'9\" \u00b7 160 lbs", ghkVials: 5, ghkDose: 2, ghkUnits: 20 },
};

export const makePeptides = (s) => [
  { key: 'bpc', name: 'BPC-157 / TB-500', short: 'BPC/TB4', mg: 5, dose: 0.5, doseLabel: '500mcg', vials: 5, shelf: 28, bac: 1, units: 10, conc: '5mg/ml', color: '#4F8CF7', purpose: 'Tissue repair \u00b7 Gut healing \u00b7 Neuroprotection', doesCycle: true },
  { key: 'kpv', name: 'KPV', short: 'KPV', mg: 10, dose: 0.5, doseLabel: '500mcg', vials: 5, shelf: 28, bac: 2, units: 10, conc: '5mg/ml', color: '#A78BFA', purpose: 'Anti-inflammatory \u00b7 NF-\u03baB suppression \u00b7 Gut & skin', doesCycle: false },
  { key: 'ghk', name: 'GHK-Cu', short: 'GHK-Cu', mg: 50, dose: s.ghkDose, doseLabel: `${s.ghkDose}mg`, vials: s.ghkVials, shelf: 28, bac: 5, units: s.ghkUnits, conc: '10mg/ml', color: '#34D399', purpose: 'Collagen synthesis \u00b7 Anti-aging \u00b7 Tissue remodeling', doesCycle: true },
];

export const SUPPS = [
  { name: 'Creatine Monohydrate', dose: '5g/day', timing: 'Any time, with water', why: 'ATP regeneration for cycling power, lifting strength, and swim sprints. Also supports cognitive function and recovery between sessions.', tier: 1 },
  { name: 'Vitamin C', dose: '1,000mg', timing: 'Morning w/ food', why: "Essential cofactor for collagen synthesis \u2014 directly amplifies GHK-Cu's tissue rebuilding effects.", tier: 1 },
  { name: 'Omega-3 Fish Oil', dose: '2\u20133g EPA/DHA', timing: 'Split AM/PM w/ meals', why: 'Anti-inflammatory via COX/LOX pathway \u2014 complements KPV and supports joint health for high-volume training.', tier: 1 },
  { name: 'Vitamin D3 + K2', dose: '5,000 IU + 100mcg', timing: 'Morning w/ fat', why: 'Immune modulation, bone density for impact activities, muscle function. Most people are deficient.', tier: 1 },
  { name: 'Magnesium Glycinate', dose: '400mg', timing: 'Before bed', why: 'Muscle recovery from training, sleep quality, cramping prevention. Glycinate form is gut-friendly alongside BPC-157.', tier: 1 },
  { name: 'Collagen Peptides', dose: '10\u201315g', timing: 'Morning in coffee/smoothie', why: 'Raw amino acids (glycine, proline) that GHK-Cu needs to build new collagen in tendons, skin, and connective tissue.', tier: 2 },
  { name: 'Zinc', dose: '25\u201330mg', timing: 'With food', why: 'Wound healing, immune support, testosterone maintenance during heavy training loads.', tier: 2 },
  { name: 'NAC', dose: '600mg 2\u00d7/day', timing: 'Empty stomach AM/PM', why: 'Glutathione precursor \u2014 antioxidant defense during accelerated tissue remodeling and heavy training.', tier: 2 },
  { name: 'Probiotics', dose: '50B+ CFU', timing: 'Morning empty stomach', why: "Gut microbiome support alongside BPC-157 and KPV's gut healing effects.", tier: 2 },
  { name: 'Glycine', dose: '3\u20135g', timing: 'Evening', why: 'Additional collagen precursor, sleep quality support, anti-inflammatory properties.', tier: 3 },
];

export const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'recon', label: 'Reconstitution' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'supplements', label: 'Supplements' },
];
