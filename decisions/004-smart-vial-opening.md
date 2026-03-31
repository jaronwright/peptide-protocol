# Decision 004: Smart Vial Opening Threshold

**Date:** March 2026
**Status:** Final

## Context

When a cycle's ON period is ending and a vial runs out, the simulation would previously open a new vial even if there were only 1–6 days remaining. This meant reconstituting an entire vial (e.g., 50mg GHK-Cu) for a few days of use, then the vial expires during the OFF period with most of its contents wasted.

## Decision

Don't reconstitute a new vial if there aren't enough ON days remaining to use at least 40% of the vial's usable contents.

## Implementation

```
minDaysToOpen = ceil(min(daysPerVial, shelfLife) * 0.4)
```

If `remainingOnDays < minDaysToOpen`, skip reconstitution.

## Per-Peptide Thresholds

| Peptide | Days/Vial | Usable Days | 40% Threshold | Skip if fewer than |
|---------|-----------|-------------|---------------|-------------------|
| BPC/TB4 | 10 | 10 | 4 | 4 ON days remaining |
| KPV | 20 | 20 | 8 | N/A (continuous) |
| GHK-Cu (1mg) | 50 | 28 | 12 | 12 ON days remaining |
| GHK-Cu (2mg) | 25 | 25 | 10 | 10 ON days remaining |

## Impact

- Subject B GHK-Cu: eliminates the 38mg waste events at cycle boundaries (was opening a 50mg vial for 6 days = 76% waste)
- Means some ON days at the end of a cycle may have no GHK-Cu — this is acceptable; a few days without it doesn't negate the prior weeks of dosing
- The user explicitly agreed: "it's not like we should mix it up for one day"
