# Peptide Research Protocol

A web application that generates personalized peptide dosing protocols, including vial schedules, cycling periods, reconstitution instructions, and supplement recommendations.

## The Argument

Four peptides (BPC-157, TB-500, GHK-Cu, KPV) are commonly sold as a single blend. The copper ion in GHK-Cu catalyzes oxidative degradation of methionine residues in BPC-157 and TB-500, producing altered compounds with unknown bioactivity.

This app demonstrates that purchasing the same peptides as separate products costs the same ($456 vs $458), eliminates degradation risk, and allows independent dosing.

## Features

- Subject profile selector with personalized dosing
- Day-by-day simulation with cycling (8 weeks on / 4 weeks off)
- Smart vial management (prevents wasteful reconstitution near cycle boundaries)
- Detailed reconstitution and injection guide
- Interactive calendar with mix/toss markers
- Supplement stack optimized for active athletes

## Development

```bash
npm install
npm run dev
```

## Deployment

Static site — deploys to GitHub Pages.

```bash
npm run build
```

## Project Structure

```
CLAUDE.md          Claude Code context (read by AI automatically)
context/           Domain knowledge and science
decisions/         Architecture decision records
prototype/         Working single-file prototype
src/               Production source code
public/            Static assets
docs/              Documentation
```

## License

Private / Internal Use
