# Dosing Logic & Calculations

## Cycling Protocol

- **BPC-157/TB-500:** 8 weeks ON (56 days), 4 weeks OFF (28 days)
- **GHK-Cu:** 8 weeks ON (56 days), 4 weeks OFF (28 days)
- **KPV:** Runs continuously — no cycling required (simple tripeptide, no desensitization concern)

### Why Cycle?
Prevents receptor desensitization. Constant peptide signaling causes the body to downregulate receptor sensitivity. The 4-week break allows receptors to resensitize. Also provides assessment windows — benefits that persist during OFF periods indicate lasting tissue remodeling vs temporary effects.

### Why KPV Doesn't Cycle
KPV is a tripeptide fragment of α-MSH acting on melanocortin receptors as an anti-inflammatory. Unlike growth factor peptides (BPC-157, TB-500) and matrix-remodeling peptides (GHK-Cu), there is less concern about receptor desensitization with small anti-inflammatory peptides. Running it continuously maintains steady-state inflammation suppression.

## Why Daily (7 Days/Week)

All three injections are administered every day during ON periods — no 5-on/2-off schedule.

**BPC-157/TB-500:** BPC-157 has an extremely short plasma half-life (~15 minutes). Its therapeutic effect lasts ~24 hours via downstream signaling cascades (angiogenesis, growth factor upregulation), but consistent daily dosing is needed to keep those cascades running. TB-500 alone only needs 2x/week due to longer tissue persistence (~3–4 days), but in a daily blend at 500mcg the frequency is driven by BPC-157's pharmacokinetics.

**KPV:** Acts via intracellular NF-κB inhibition rather than cell-surface receptor binding. Low desensitization risk — continuous daily dosing maintains steady-state inflammation suppression, which is the goal.

**GHK-Cu:** Some community protocols use 5-on/2-off as a copper exposure precaution, but the therapeutic dose (1–2mg/day) is ~300× below toxic thresholds in animal studies. Daily dosing is well-supported by clinic protocols. More importantly, switching to 5/2 would increase vial waste for both subjects:

| Schedule | Subject A (1mg) waste/vial | Subject B (2mg) waste/vial |
|----------|---------------------------|---------------------------|
| 7/week (current) | 22mg (44%) | 0mg (0%) |
| 5/week | 30mg (60%) | 10mg (20%) |

The 8-weeks-on/4-weeks-off cycling protocol already provides recovery breaks, making additional weekly rest days redundant.

## Smart Vial Opening Rule

**Do NOT reconstitute a new vial if there aren't enough ON days remaining to use ≥40% of its contents.**

This prevents scenarios where a vial is opened for 1–6 days and then most of it expires during an OFF period.

Example: GHK-Cu at 2mg/day, 50mg vial (25 days per vial). If only 6 ON days remain in a cycle:
- Would use: 12mg (24%)
- Would waste: 38mg (76%)
- Decision: **Don't open.** Wait for next cycle.

## Per-Peptide Math

### BPC-157 / TB-500 Blend (5mg/5mg per vial)

| Parameter | Value |
|-----------|-------|
| Dose | 500mcg/day (0.5mg) |
| Days per vial | 10 |
| Shelf life concern | None (10 < 28) |
| Waste per vial | 0 |
| BAC water per vial | 1ml |
| Concentration | 5mg/ml |
| Syringe draw | 10 units (0.1ml) |

### KPV (10mg per vial)

| Parameter | Value |
|-----------|-------|
| Dose | 500mcg/day (0.5mg) |
| Days per vial | 20 |
| Shelf life concern | None (20 < 28) |
| Waste per vial | 0 |
| BAC water per vial | 2ml |
| Concentration | 5mg/ml |
| Syringe draw | 10 units (0.1ml) |

### GHK-Cu (50mg per vial)

**Subject A (1mg/day):**

| Parameter | Value |
|-----------|-------|
| Dose | 1mg/day |
| Days per vial (theoretical) | 50 |
| Days per vial (actual) | 28 (shelf life limit) |
| Waste per vial | 22mg (44%) |
| BAC water per vial | 5ml |
| Concentration | 10mg/ml |
| Syringe draw | 10 units (0.1ml) |

**Subject B (2mg/day):**

| Parameter | Value |
|-----------|-------|
| Dose | 2mg/day |
| Days per vial | 25 |
| Shelf life concern | None (25 < 28) |
| Waste per vial | 0 |
| BAC water per vial | 5ml |
| Concentration | 10mg/ml |
| Syringe draw | 20 units (0.2ml) |

## Vial Allocation (Splitting 10-Vial Kits)

| Product | Subject A | Subject B | Total |
|---------|-----------|-----------|-------|
| BPC-157/TB-500 | 5 | 5 | 10 |
| KPV | 5 | 5 | 10 |
| GHK-Cu | 5 | 5 | 10 |

### Even Split Rationale
All 10-vial kits are split 5/5. This keeps allocation simple and consistent. The simulation engine's smart vial opening rule handles any waste from shelf life expiration — Subject A at 1mg/day will have some per-vial waste (22mg) due to the 28-day shelf life vs 50-day theoretical supply, but the extra vials give her more flexibility across multiple cycles.

## BAC Water Requirements

**Subject A:** 5×1ml + 5×2ml + 5×5ml = 40ml → 2 × 30ml vials
**Subject B:** 5×1ml + 5×2ml + 5×5ml = 40ml → 2 × 30ml vials

## Syringe Specification

U-100 insulin syringes, 1ml capacity, 29–31 gauge, ½ inch needle.

"Units" on the syringe = percentage of 1ml:
- 10 units = 0.1ml
- 20 units = 0.2ml
- 100 units = 1.0ml

All peptides are dosed at either 10 or 20 units per injection, making measurement straightforward.
