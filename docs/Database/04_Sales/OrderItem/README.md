# 📦 Order Item

---

## Purpose

The **Order Item** table stores the individual products ordered within a customer order.

It answers the business question:

> **"What products did the customer order?"**

This table stores **product-level sales transaction information**, not permanent product information.

---

## Business Questions Answered

This table helps answer:

- Which products were ordered?
- How many blocks were ordered?
- What was the selling price at the time of the order?
- Which order does this product belong to?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| OrderItemID (PK) | Unique order item | Identifies one ordered product |
| OrderID (FK) | References Order | Parent order |
| ProductID (FK) | References Product | Which block size |
| OrderedQuantity | Number of blocks ordered | Customer requirement |
| UnitSellingPrice | Selling price per block | Price at the time of sale |
| Remarks | Optional notes | Additional information |

---

## Business Relationship

```text
             Order
                │
                ▼
          Order Item
           │        │
           ▼        ▼
      Product    Delivery Item
```

One Order can contain:

- Multiple Order Items

One Product can appear in:

- Multiple Order Items

One Order Item may be delivered through:

- Multiple Delivery Items

---

## Business Rules

- Every Order Item belongs to one Order.
- Every Order Item references one Product.
- Selling Price is stored for every order.
- Ordered Quantity records the customer's requirement.
- One Order Item may be delivered in multiple trips.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Customer Name | Customer | Master Data |
| Order Date | Order | Order header |
| Current Stock | Finished Goods Stock | Inventory |
| Delivery Vehicle | Delivery | Logistics |
| Payment Information | Payment | Financial transaction |

---

## Architect Discoveries

### Selling Price is Transactional

One of the biggest discoveries during architecture discussions:

The selling price must **never** be stored in the Product table.

Reason:

The selling price may vary depending on:

- Customer relationship
- Bulk quantity
- Discounts
- Future price revisions

Example:

Mr. Ratan

100 Blocks

₹38

Another Customer

100 Blocks

₹40

Therefore,

Selling Price belongs only to **Order Item**.

---

### One Order, Many Products

An order is simply the customer's request.

The actual products are stored separately.

Example:

Order-101

- 100 × 4" Blocks
- 200 × 6" Blocks
- 50 × 8" Blocks

The Order remains one transaction.

The products become three Order Items.

---

### Partial Delivery Support

One Order Item may require multiple deliveries.

Example:

Ordered:

1000 × 6" Blocks

Delivered:

- 600 Today
- 200 Tomorrow
- 200 After Production

Order Item remains unchanged.

Delivery records the physical movement.

---

## Architect Decisions

- Order Item is a Transaction table.
- Selling Price belongs only here.
- Product remains Master Data.
- Ordered Quantity belongs only here.
- Delivery fulfills Order Items over time.

---

## Future Enhancements

Possible future additions:

- Discount Percentage
- GST Rate
- Tax Amount
- Reserved Quantity
- AI Suggested Selling Price
- Product Customization Notes

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