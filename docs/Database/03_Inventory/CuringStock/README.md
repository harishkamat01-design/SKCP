# 🏭 Curing Stock

---

## Purpose

The **Curing Stock** table stores the batches of cement blocks currently undergoing the curing process.

It answers the business question:

> **"Which batches are still curing and when will they become ready for sale?"**

This table represents the **Production Yard**, where freshly manufactured blocks remain for approximately **3 days** before moving to Finished Goods Stock.

---

## Business Questions Answered

This table helps answer:

- Which batches are currently curing?
- How many blocks are in each curing batch?
- When was the batch produced?
- When will the batch be ready?
- Which batches are ready to move to Finished Goods Stock?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| CuringStockID (PK) | Unique curing batch | Identifies one curing batch |
| ProductID (FK) | References Product | Which block size is curing |
| Quantity | Number of blocks | Quantity in this curing batch |
| ProductionDate | Date of manufacture | Start of curing period |
| ExpectedReadyDate | Planned ready date | Normally Production Date + 3 Days |
| Status | Curing / Ready / Moved | Current batch status |
| Remarks | Optional notes | Rain, damage, delay, etc. |

---

## Business Relationship

```text
             Production

                  │

                  ▼

            Curing Stock

                  │

                  ▼

       Finished Goods Stock
```

Every production batch enters:

- Curing Stock

After curing completes:

- The same batch moves to Finished Goods Stock.

---

## Business Rules

- Every production batch creates one Curing Stock record.
- A batch normally remains in curing for **3 days**.
- A batch cannot be sold directly from Curing Stock.
- Once curing is completed, the batch moves to Finished Goods Stock.
- Batch identity is preserved throughout the movement.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Customer | Order | Sales information |
| Selling Price | Order Item | Sales transaction |
| Current Ready Stock | Finished Goods Stock | Ready inventory |
| Dispatch Information | Delivery | Delivery process |
| Payment Information | Payment | Financial transaction |

---

## Architect Discoveries

### Production Does NOT Go Directly to Finished Goods

One of the biggest discoveries during Sprint 2:

```text
Production

↓

Curing Stock

↓

Finished Goods Stock
```

Blocks require curing before becoming saleable.

---

### Production Yard vs Finished Goods Yard

During business discussions, we discovered the actual factory workflow:

- Freshly produced blocks remain in the **Production (Curing) Yard**.
- They stay there for approximately **3 days**.
- Only after curing are they moved to the **Finished Goods Stock Yard**.

This real-world process is reflected directly in the database.

---

### Batch Identity Must Be Preserved

A curing batch does not disappear.

The **same batch** moves into Finished Goods Stock.

This preserves production traceability for future enhancements.

---

## Architect Decisions

- Curing Stock belongs to the Inventory domain.
- It represents work-in-progress inventory.
- Batches remain here until curing completes.
- Batch identity is preserved when moving to Finished Goods Stock.
- Curing is treated as an inventory stage, not merely a status.

---

## Future Enhancements

Possible future additions:

- Actual Ready Date
- Curing Yard Location
- Weather Delay Indicator
- Quality Inspection Status
- Damaged Quantity
- Production Shift

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Inventory |
| Table Status | ✅ Approved |
| Sprint | Sprint 2 – Business Domain & Database Design |
| Last Updated | 29 July 2026 |
| Architect | Harish Kamat & ChatGPT |

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |