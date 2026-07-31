# Production Table

## Purpose

Stores the daily production carried out by the factory.

One Production record represents **one day's production for one product (one mould size)**.

This mirrors the current factory notebook maintained by the business.

---

## Table Structure

| Column | Type | Description |
|----------|------|-------------|
| ProductionID (PK) | UUID / INT | Unique production record |
| ProductionDate | DATE | Date of production |
| ProductID (FK) | FK | Product manufactured |
| QuantityProduced | INT | Total blocks produced |
| MorningCementBags | DECIMAL(5,2) | Cement bags used during morning production (9:00 AM – 1:00 PM) |
| AfternoonCementBags | DECIMAL(5,2) | Cement bags used during afternoon production (2:30 PM – 5:30 PM) |
| TotalCementBags | Calculated | Morning + Afternoon cement bags |
| Notes | TEXT | Remarks such as rain, machine issue, mould change, etc. |
| CreatedDate | DATE | Record creation date |
| Status | ENUM | Completed / Cancelled |
| AssetID | (FK)UUID / INT    | Block-making machine used for this production record
---

## Primary Key

ProductionID

Every production record has one unique identifier.

---

## Foreign Key

ProductID → Product(ProductID)

One product can appear in many production records.

Relationship:

One Product → Many Production Records

---

## Business Rules

- Every production record must be associated with exactly one finished product.
- Every production record must record the block-making machine (Asset) used.
- One machine can produce many production records over time.
- One production record belongs to exactly one machine.
- One production record represents one day's production for one product.
- Production is completed before curing begins.

### Rule 1

One Production record represents one day's production for one product size.

---

### Rule 2

The production machine manufactures only one mould size at a time.

Changing moulds is rare because setup takes approximately two hours.

---

### Rule 3

Cement consumption is recorded separately for:

- Morning (9:00 AM – 1:00 PM)
- Afternoon (2:30 PM – 5:30 PM)

---

### Rule 4

Total Cement Bags should always be calculated.

```
Total Cement Bags

=

Morning Cement Bags

+

Afternoon Cement Bags
```

---

### Rule 5

Only cement consumption is recorded in Version 1.

Consumption of sand, jelly, fly ash, and water is not tracked per production record.

---

## Business Example

| Date | Product | Quantity | Morning Cement | Afternoon Cement |
|------|---------|---------:|---------------:|-----------------:|
| 30-Jul-2026 | Solid Block 6" | 420 | 4 Bags | 3 Bags |

---

## Why This Design?

This table directly reflects the existing factory notebook.

It captures:

- What product was manufactured
- When it was manufactured
- How many blocks were produced
- Cement consumption during morning and afternoon

without introducing unnecessary complexity.

---

## Future Enhancements

Future versions may introduce:

- Production Batch
- Production Consumption
- Machine Allocation
- Labour Allocation
- Production Shift
- Production Quality Inspection

These can be added without changing the current table structure.

---

## Status

Domain:
Production

Data Classification:
Transaction Data

Owner:
Production Management

Status:
✅ Frozen

Date:
30th July 2026