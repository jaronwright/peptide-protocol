# Decision 003: KPV Runs Continuously (No Cycling)

**Date:** March 2026
**Status:** Final

## Context

Initially all four peptides were cycling together (8 on / 4 off). This created waste when KPV vials were reconstituted near the end of an ON period and expired during the OFF break.

## Decision

KPV runs continuously from day 1 until supply is exhausted. No cycling breaks.

## Rationale

1. **Pharmacology:** KPV is a simple tripeptide fragment (Lys-Pro-Val) of alpha-MSH. It acts on melanocortin receptors as an anti-inflammatory. Unlike growth factor peptides, receptor desensitization is not a meaningful concern for short anti-inflammatory peptides.

2. **Eliminates waste:** Running continuously means 5 vials × 20 days = 100 straight days with zero waste. Under the cycling model, a partially-used vial would expire during OFF periods.

3. **Sustained benefit:** Continuous NF-κB suppression provides a stable anti-inflammatory baseline that supports the other peptides during ON periods AND maintains inflammation control during OFF periods when BPC/TB4 and GHK-Cu are paused.

4. **Not everything needs to run together:** The user explicitly noted this — different compounds can follow different schedules based on their pharmacology.

## Consequences

- KPV continues during OFF periods for BPC/TB4 and GHK-Cu
- Simplifies the vial schedule (no partial-vial waste calculations)
- Calendar shows KPV dots on OFF days (expected, not a bug)
- Timeline shows KPV as a separate continuous bar rather than cycle-aligned
