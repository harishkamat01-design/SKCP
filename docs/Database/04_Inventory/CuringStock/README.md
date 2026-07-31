# 🏭 Curing Stock

# Curing Stock (Transaction Table)

---

# Purpose

The Curing Stock table stores production batches that are currently undergoing curing and are not yet available for sale.

It represents the temporary inventory located in the Production/Curing Yard.

---

# Business Responsibility

The Curing Stock table answers:

- Which batches are currently curing?
- How many blocks remain under curing?
- Which batches are ready for transfer?
- Which batches have already been partially transferred?

---

# Table Structure

| Column | Type | Description |
|----------|------|-------------|
| CuringStockID (PK) | UUID / INT | Unique curing batch |
| ProductionID (FK) | FK | Production batch reference |
| ProductID (FK) | FK | Product produced |
| ProductionDate | DATE | Date produced |
| QuantityProduced | INT | Total quantity produced |
| QuantityRemaining | INT | Quantity still under curing |
| ExpectedReadyDate | DATE | System calculated suggested ready date |
| TransferStatus | ENUM | Curing / Partially Transferred / Fully Transferred |
| OwnerConfirmation | BOOLEAN | Owner confirms batch is ready |
| Notes | TEXT | Remarks |

---

# Primary Key

CuringStockID

---

# Foreign Keys

ProductionID → Production

ProductID → Product

---

# Business Rules

## Rule 1

Every Production record creates one Curing Stock record.

---

## Rule 2

Blocks under curing cannot be sold.

---

## Rule 3

ExpectedReadyDate is calculated by the system using the normal curing period (3–5 days).

The owner decides when the batch is actually ready.

---

## Rule 4

A curing batch may be transferred partially.

Example:

Produced = 400

Transferred = 250

Remaining = 150

---

## Rule 5

When QuantityRemaining becomes zero,

TransferStatus automatically becomes:

Fully Transferred

---

# Business Workflow

Production

↓

Curing Stock

↓

Owner Inspection

↓

Transfer to Finished Goods

↓

Sales

---

# Example

| Production Date | Product | Produced | Remaining | Status |
|----------------|---------|---------:|----------:|--------|
| 30-Jul-2026 | 6" Block | 420 | 420 | Curing |
| 27-Jul-2026 | 4" Block | 600 | 150 | Partially Transferred |

---

# Why This Design?

This design reflects the real factory workflow.

The production yard acts as temporary inventory.

Only after curing and owner approval are blocks moved into Finished Goods inventory.

---

# Future Scope

Future versions may include:

- Quality Inspection
- Curing Duration Tracking
- Weather Impact
- Batch-wise Quality Rating
- Automatic Ready Suggestions

---

# Status

✅ Frozen (Version 1)

The table accurately models the temporary production inventory used during the curing process before products become available for sale.




---
## OLD VERSION

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

Domain:
Inventory

Data Classification:
Transaction Data

Owner:
Inventory Management

Status:
✅ Frozen

Date:
30th July 2026

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |