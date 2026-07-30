# 📦 Purchase Item

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