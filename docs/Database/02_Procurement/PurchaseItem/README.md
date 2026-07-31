# 📦 Purchase Item

# Purchase Item

## Purpose

Stores each individual raw material purchased as part of a Purchase invoice.

Purchase Item represents one line item inside a supplier invoice.

---

# Purchase Item Table

| Column | Type | Description |
|---------|------|-------------|
| PurchaseItemID (PK) | UUID / INT | Unique purchase item |
| PurchaseID (FK) | UUID / INT | Parent Purchase |
| RawMaterialID (FK) | UUID / INT | Purchased raw material |
| Quantity | DECIMAL(10,2) | Purchased quantity |
| Unit | VARCHAR(30) | Purchase unit (Bag, Tractor, Truck, Goods Vehicle, etc.) |
| UnitPrice | DECIMAL(12,2) | Price per purchase unit |
| LineAmount | DECIMAL(12,2) | Quantity × Unit Price |
| Remarks | TEXT | Optional notes |

---

# Business Relationship

Purchase

1

↓

Many

Purchase Item

Many

↓

1

Raw Material

---

# Business Event

Example

Purchase #P001

↓

Purchase Item

↓

Raw Material = Cement

Quantity = 400

Unit = Bags

Unit Price = ₹420

Line Amount = ₹168,000

Another row within the same purchase:

Purchase #P001

↓

Purchase Item

↓

Raw Material = Sand

Quantity = 2

Unit = Tractor

Unit Price = ₹7,000

Line Amount = ₹14,000

---

# What Does NOT Belong Here

The following information belongs to the Purchase table, not Purchase Item:

- Supplier
- Purchase Date
- Invoice Number
- Payment Status

Purchase Item stores only the details of one purchased material.

---

# Architect Decision

Purchase Item represents one material line inside a Purchase invoice.

Each row records:

- Which raw material was purchased
- Quantity purchased
- Purchase unit
- Price per unit
- Total amount for that line

This design follows normalization and allows one Purchase to contain multiple raw materials.

---

# Interview Takeaway

Purchase Item is a classic Header–Detail (Master–Detail) design.

Purchase acts as the Header.

Purchase Item acts as the Detail.

This pattern is widely used in ERP systems for purchases, sales, invoices, quotations, and deliveries.

---

# Beautiful Symmetry

| Sales Domain | Purchase Domain |
|--------------|-----------------|
| Customer | Supplier |
| Order | Purchase |
| Order Item | Purchase Item |
| Product | Raw Material |
| Quantity | Quantity |
| Unit Price | Unit Price |
| Line Amount | Line Amount |

Both Sales and Purchase follow the same normalized design.

---

# Architect Lesson

Raw Material identifies **what** the material is.

Purchase Item records **how it was purchased**:

- Quantity
- Unit
- Unit Price
- Line Amount

Separating master data from transaction data creates a scalable and maintainable ERP database.

---

# Status

**Status:** ✅ Frozen

**Domain:** Raw Materials

**Owner:** Purchase Domain

**Date:** 30th July 2026 
---

## Purpose

The **Purchase Item** table stores the individual raw materials purchased in each purchase transaction.

It answers the business question:

> **"What raw materials were purchased in this transaction?"**

This table stores **transaction-level material information**, not permanent business information.

---

## Business Questions Answered

This table helps answer:

- Which raw materials were purchased?
- How much quantity was purchased?
- What was the purchase price at that time?
- Which purchase transaction does the material belong to?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| PurchaseItemID (PK) | Unique purchase item | Identifies one purchased material |
| PurchaseID (FK) | References Purchase | Parent purchase transaction |
| RawMaterialID (FK) | References Raw Material | Which material was purchased |
| Quantity | Purchased quantity | Quantity received |
| UnitPrice | Purchase price per unit | Price at the time of purchase |
| Remarks | Optional notes | Additional item information |

---

## Business Relationship

```text
             Purchase
                 │
                 ▼
          Purchase Item
            │        │
            ▼        ▼
     Raw Material   Raw Material Stock
```

One Purchase can contain:

- Multiple Purchase Items

One Raw Material can appear in:

- Multiple Purchase Items

---

## Business Rules

- Every Purchase Item belongs to one Purchase.
- Every Purchase Item references one Raw Material.
- Purchase Price is recorded for every purchase.
- Quantity Purchased is recorded for every purchase.
- Purchase Item becomes the source for Raw Material Stock updates.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Supplier Name | Supplier | Master Data |
| Purchase Date | Purchase | Header information |
| Current Stock | Raw Material Stock | Inventory information |
| Minimum Stock | Raw Material | Planning information |
| Invoice Number | Purchase | Purchase header |

---

## Architect Discoveries

### Purchase Price is Transactional

Purchase Price **must never** be stored in Raw Material.

Reason:

Every purchase can have a different price.

Example:

- Cement purchased today → ₹420
- Same Cement next week → ₹435

Therefore, the purchase price belongs only to Purchase Item.

---

### Supplier and Raw Material are NOT Directly Connected

The relationship is naturally discovered through:

```text
Supplier

↓

Purchase

↓

Purchase Item

↓

Raw Material
```

This provides complete flexibility.

---

### Beautiful Separation

Raw Material answers:

> What do we use?

Purchase Item answers:

> What did we buy today?

Raw Material Stock answers:

> What do we currently have?

Each table owns exactly one responsibility.

---

## Architect Decisions

- Purchase Item is a Transaction table.
- Purchase Price is stored only here.
- Quantity Purchased is stored only here.
- Raw Material remains pure Master Data.
- Inventory updates originate from Purchase Item.

---

## Future Enhancements

Possible future additions:

- Discount
- GST
- Freight Allocation
- Received Quantity
- Rejected Quantity
- Quality Inspection Result

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Purchase |
| Table Status | ✅ Approved |
| Sprint | Sprint 2 – Business Domain & Database Design |
| Last Updated | 29 July 2026 |
| Architect | Harish Kamat & ChatGPT |

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |