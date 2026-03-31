# Peptide Research Protocol — Project Context

## What This Is

A web application for a peptide research company that generates personalized dosing protocols for test subjects running a 4-peptide regimen (BPC-157/TB-500, KPV, GHK-Cu). The app calculates vial schedules, cycling periods, reconstitution instructions, and supplement recommendations based on subject profiles.

## Why It Exists

The company sells a "KLOW Blend" that combines all 4 peptides in one vial. We're building the case that this is chemically problematic (copper in GHK-Cu degrades BPC-157 and TB-500 via methionine oxidation) and that the correct approach is separate vials. This app is both a practical tool for test subjects AND a demonstration that separate vials work better — at the same price ($456 vs $458).

## Current State

**Prototype:** Working React/JSX single-file app in `prototype/`. Renders in Claude.ai artifacts. Has 5 tabs: Overview, Reconstitution, Timeline, Calendar, Supplements. Supports 2 test subjects via dropdown.

**Next step:** Convert prototype into a proper React app suitable for GitHub Pages deployment.

## Key Domain Rules (DO NOT VIOLATE)

1. **Never mix peptides in the same syringe or vial.** This is the entire thesis of the project.
2. **KPV runs continuously** — it does NOT cycle. It's a simple tripeptide, no desensitization concern.
3. **BPC-157/TB-500 and GHK-Cu cycle** 8 weeks on, 4 weeks off.
4. **Don't open a new vial** if there aren't enough ON days left to use ≥40% of it.
5. **Reconstituted vials expire after 28 days** regardless of remaining contents.
6. **GHK-Cu for Subject A uses only 2 vials** (not 5). Subject B gets 8. They split a 10-vial kit.
7. **BPC-157/TB-500 and KPV are split evenly** — 5 vials each per subject.

## Subject Profiles

- **Subject A:** 24F, 5'8", 120 lbs. BPC/TB4 500mcg/day, KPV 500mcg/day, GHK-Cu 1mg/day. 2 GHK-Cu vials.
- **Subject B:** 33M, 5'9", 160 lbs. BPC/TB4 500mcg/day, KPV 500mcg/day, GHK-Cu 2mg/day. 8 GHK-Cu vials. Has right knee (partial meniscus removal) and lower back/QL issues — BPC/TB4 can be injected near these areas.

## Tech Stack

- React (Vite or CRA)
- Tailwind CSS (preferred for production)
- Static site — GitHub Pages deployment
- No backend, no database, all calculations client-side

## Directory Structure

```
context/         Domain knowledge docs — read these to understand the science
decisions/       Architectural and protocol decisions with rationale
prototype/       Current working single-file prototype
src/             Production source code (to be built)
public/          Static assets
docs/            Generated documentation
```

## Commands

```bash
# Development (once src/ is set up)
npm install
npm run dev

# Build for GitHub Pages
npm run build
```

## Important Context Files

Read these before making changes:
- `context/DOMAIN.md` — How the 4 peptides work and interact
- `context/DEGRADATION.md` — The chemistry argument against blending
- `context/DOSING.md` — All dosing math and cycling logic
- `decisions/` — Why specific choices were made (read all before proposing changes)
