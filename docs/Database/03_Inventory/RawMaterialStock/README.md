# 📦 Raw Material Stock

---

## Purpose

The **Raw Material Stock** table stores the **current available quantity** of every raw material in SKCP.

It answers the business question:

> **"How much raw material do we have right now?"**

Unlike Purchase Item, this table always represents the **latest stock position**.

Stock continuously increases and decreases as business operations happen.

---

## Business Questions Answered

This table helps answer:

- How much Cement is currently available?
- How much Sand is currently available?
- Which materials are below the minimum stock level?
- Is replenishment required?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| RawMaterialStockID (PK) | Unique stock record | Identifies one inventory record |
| RawMaterialID (FK) | References Raw Material | Which material |
| CurrentQuantity | Current available quantity | Live inventory |
| LastUpdated | Last stock update timestamp | Audit information |
| Remarks | Optional notes | Operational remarks |

---

## Business Relationship

```text
          Raw Material
                 │
                 ▼
        Raw Material Stock
          ▲             ▲
          │             │
     Purchase Item   Production
```

Stock increases through:

- Purchase Item

Stock decreases through:

- Production

---

## Business Rules

- One Raw Material has exactly one Raw Material Stock record.
- Current Quantity always represents the latest physical stock.
- Purchase increases stock.
- Production consumes stock.
- Stock Adjustment transactions may increase or decrease stock.
- Current Quantity is never entered manually during normal business operations.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Purchase Price | Purchase Item | Transaction information |
| Supplier | Supplier | Master Data |
| Purchase Date | Purchase | Purchase transaction |
| Quantity Purchased | Purchase Item | Historical transaction |
| Minimum Stock Level | Raw Material | Planning information |

---

## Architect Discoveries

### Inventory Owns Fluctuating Data

One of the most important discoveries during Sprint 2:

> **Anything that continuously increases and decreases belongs to Inventory.**

Master Data should never own changing quantities.

---

### Beautiful Separation

Raw Material answers:

> What material do we use?

Purchase Item answers:

> What did we buy?

Raw Material Stock answers:

> What do we currently have?

---

### Stock is a Living Value

Unlike Purchase Item, which records history,

Raw Material Stock always stores the **latest available quantity**.

---

## Architect Decisions

- Raw Material Stock belongs to the Inventory domain.
- Inventory owns Current Quantity.
- Purchases increase stock.
- Production decreases stock.
- Future Stock Adjustment transactions will modify stock directly when required.

---

## Future Enhancements

Possible future additions:

- Reserved Quantity
- Available Quantity
- Warehouse Location
- Last Physical Verification Date
- Safety Stock Indicator
- Automatic Reorder Suggestion

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