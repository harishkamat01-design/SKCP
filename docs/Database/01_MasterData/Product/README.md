# 🏭 Product

---

## Purpose

The **Product** table stores the permanent list of cement products manufactured by SKCP.

It answers the business question:

> **"What products does SKCP manufacture and sell?"**

This is **Master Data**, meaning the information changes very rarely.

This table **does not** store production quantities, stock levels, pricing, customer information, or sales transactions.

---

## Business Questions Answered

This table helps answer:

- What products does SKCP manufacture?
- What are the available block sizes?
- What are the standard dimensions of each product?
- Which products are currently active?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| ProductID (PK) | Unique product identifier | Identifies each product |
| ProductName | Product name | Business identification |
| Size | Product size (4", 6", 8") | Product specification |
| Length | Standard length | Product dimension |
| Width | Standard width | Product dimension |
| Height | Standard height | Product dimension |
| Unit | Standard measurement unit | Common measurement |
| Description | Optional notes | Additional business information |
| Status | Active / Inactive | Indicates product availability |

---

## Business Relationship

```text
                     Product
                        │
      ┌─────────────────┼──────────────────┐
      │                 │                  │
      ▼                 ▼                  ▼
 Order Item      Curing Stock     Finished Goods Stock
      │
      ▼
 Delivery Item
```

A single Product can appear in:

- Multiple Order Items
- Multiple Curing Stock batches
- Multiple Finished Goods Stock batches
- Multiple Delivery Items

---

## Business Rules

- Every product must have a unique ProductID.
- Product information is Master Data.
- Product dimensions remain constant.
- Products are never deleted; they are marked as Inactive if no longer manufactured.
- Stock information is maintained separately in Inventory.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Current Stock | Finished Goods Stock | Stock changes daily |
| Quantity Produced | Curing Stock | Production transaction |
| Selling Price | Order Item | Price may vary per order |
| Customer | Order | Customer transaction |
| Supplier | Supplier | Suppliers provide raw materials, not finished products |

---

## Architect Discoveries

During business discussions, we discovered:

- Product is purely a Master Data entity.
- Inventory must never be stored inside Product.
- Pricing should remain inside Order Item because prices may change over time.
- Product dimensions are permanent business information and should be stored only once.

---

## Architect Decisions

- Product is a Master Data table.
- Product stores only permanent business information.
- Inventory is handled separately.
- Pricing is handled separately.
- Product participates in Sales and Inventory but owns neither.

---

## Future Enhancements

Possible future additions:

- Product Image
- Product Category
- Product Weight
- ISI / Quality Standard
- Barcode / QR Code
- Product Specification Sheet

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Master Data |
| Table Status | ✅ Approved |
| Sprint | Sprint 2 – Business Domain & Database Design |
| Last Updated | 29 July 2026 |
| Architect | Harish Kamat & ChatGPT |

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |

---