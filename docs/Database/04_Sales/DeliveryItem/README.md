# 📦 Delivery Item

---

## Purpose

The **Delivery Item** table stores the individual products delivered during a vehicle trip.

It answers the business question:

> **"Which products were delivered in this vehicle trip?"**

This table stores **product-level delivery information**, while the Delivery table stores the trip information.

---

## Business Questions Answered

This table helps answer:

- Which products were delivered?
- How many blocks were delivered?
- Which finished goods batch supplied these blocks?
- Which delivery trip carried these products?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| DeliveryItemID (PK) | Unique delivery item | Identifies one delivered product |
| DeliveryID (FK) | References Delivery | Parent delivery trip |
| ProductID (FK) | References Product | Which block size |
| BatchID (FK) | References Finished Goods Stock | Preserves production identity |
| DeliveredQuantity | Number of blocks delivered | Actual delivered quantity |
| Remarks | Optional notes | Additional operational information |

---

## Business Relationship

```text
            Delivery
                │
                ▼
          Delivery Item
          │          │
          ▼          ▼
     Product   Finished Goods Stock
```

One Delivery can contain:

- Multiple Delivery Items

One Product can appear in:

- Multiple Delivery Items

One Finished Goods Batch can supply:

- Multiple Delivery Items

---

## Business Rules

- Every Delivery Item belongs to one Delivery.
- Every Delivery Item references one Product.
- Delivered Quantity records the actual quantity delivered.
- One Delivery can carry multiple products.
- Finished Goods Stock is reduced according to Delivered Quantity.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Customer Name | Customer | Master Data |
| Delivery Date | Delivery | Delivery header |
| Vehicle Details | Delivery | Logistics information |
| Payment Information | Payment | Financial transaction |
| Delivery Confirmation | Delivery Confirmation | Separate business event |

---

## Architect Discoveries

### One Delivery Can Carry Multiple Products

During business discussions, we discovered:

Example:

Vehicle Trip

- 100 × 4" Blocks
- 50 × 6" Blocks

This is still **one Delivery**.

The individual products become separate Delivery Items.

---

### Batch Identity is Preserved

Although batch-level traceability is **not immediately required**, we intentionally kept:

**BatchID**

Reason:

Future quality tracking may require identifying which production batch reached which customer.

Keeping BatchID now avoids future database redesign.

---

### Delivery Item Owns Physical Movement

Delivery tells us:

> Which trip occurred?

Delivery Item tells us:

> What physically moved during that trip?

This keeps logistics properly normalized.

---

## Architect Decisions

- Delivery Item is a Transaction table.
- Product belongs here.
- Delivered Quantity belongs here.
- BatchID is preserved for future enhancements.
- Finished Goods Stock is reduced based on Delivery Items.

---

## Future Enhancements

Possible future additions:

- Returned Quantity
- Damaged Quantity
- Customer Acceptance Quantity
- Delivery Weight
- Loading Sequence
- AI Delivery Optimization

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Sales |
| Table Status | ✅ Approved |
| Sprint | Sprint 2 – Business Domain & Database Design |
| Last Updated | 29 July 2026 |
| Architect | Harish Kamat & ChatGPT |

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |