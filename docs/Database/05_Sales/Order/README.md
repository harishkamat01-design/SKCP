# 📋 Order

---

## Purpose

The **Order** table stores the header information of every customer order placed with SKCP.

It answers the business question:

> **"Which customer placed an order, when was it placed, and what is the overall status of the order?"**

This table stores only the **order header**.

The individual products ordered are stored separately in **Order Item**.

---

## Business Questions Answered

This table helps answer:

- Who placed the order?
- When was the order placed?
- What is the expected delivery date?
- What is the current order status?
- Is the order completed or still pending?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| OrderID (PK) | Unique order identifier | Identifies one customer order |
| CustomerID (FK) | References Customer | Who placed the order |
| OrderDate | Date order was placed | Business transaction date |
| ExpectedDeliveryDate | Planned delivery date | Delivery planning |
| OrderStatus | Pending / Partial / Completed / Cancelled | Current order lifecycle |
| Remarks | Optional notes | Additional business information |

---

## Business Relationship

```text
              Customer
                  │
                  ▼
               Order
                  │
                  ▼
             Order Item
                  │
                  ▼
              Delivery
```

One Customer can have:

- Multiple Orders

One Order can contain:

- Multiple Order Items

One Order may require:

- Multiple Deliveries

---

## Business Rules

- Every Order belongs to exactly one Customer.
- Every Order has a unique OrderID.
- An Order may contain one or many Order Items.
- One Order may be delivered in multiple trips.
- Order Status changes as deliveries are completed.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Product Details | Order Item | One order can contain multiple products |
| Ordered Quantity | Order Item | Product-level information |
| Selling Price | Order Item | Price belongs to each product |
| Vehicle Information | Delivery | Logistics information |
| Payment Details | Payment | Financial transaction |

---

## Architect Discoveries

### Business Thinks Customer First

During discussions with the business, we discovered:

Your father naturally thinks:

> **"Mr. Ratan has ₹17,000 pending."**

He never thinks:

> **"Order-101 has ₹12,000 pending."**

The business always starts with the **Customer**.

---

### Database Thinks Order First

Although the business starts with the customer, the database starts with the Order.

Reason:

One Customer can place multiple orders.

```text
Customer

↓

Order

↓

Order Item
```

This keeps the database normalized while allowing the UI to remain customer-centric.

---

### Partial Deliveries

One important business discovery:

One Order may require multiple deliveries.

Example:

Order:

1000 × 6" Blocks

Delivery-1 → 600 Blocks

Delivery-2 → 200 Blocks

Delivery-3 → 200 Blocks

The Order remains the same.

Only Deliveries increase over time.

---

## Architect Decisions

- Order is a Transaction table.
- Customer owns customer information.
- Order Item owns product information.
- Delivery owns logistics.
- Payment will be associated with the Order through the Sales/Payment design.
- One Order supports multiple deliveries.

---

## Future Enhancements

Possible future additions:

- Order Priority
- Salesperson
- Quotation Reference
- Customer Purchase Order Number
- Expected Completion Date
- AI Delivery Prediction

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Sales |
| Data Classification | Transaction Data |
| Owner | Sales Domain |
| Table Status | ✅ Approved |
| Sprint | Sprint 2 – Business Domain & Database Design |
| Last Updated | 30 July 2026 |
| Architect | Harish Kamat & ChatGPT |

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |