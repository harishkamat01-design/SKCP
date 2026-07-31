# 👤 Customer

---

## Purpose

The **Customer** table stores the permanent list of customers who purchase cement products from SKCP.

It answers the business question:

> **"Who are our customers?"**

This is **Master Data**, meaning customer information changes infrequently.

This table **does not** store orders, deliveries, payments, or pending amounts.

---

## Business Questions Answered

This table helps answer:

- Who are SKCP's customers?
- What are their contact details?
- Where is the customer located?
- Is the customer currently active?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| CustomerID (PK) | Unique customer identifier | Identifies each customer |
| CustomerName | Customer's name | Primary business identification |
| MobileNumber | Contact number | Communication |
| AlternateMobile | Optional second contact | Backup contact |
| Address | Customer address | Delivery reference |
| Village | Village / Area | Business location |
| City | City | Customer location |
| Pincode | Postal code | Address information |
| GSTNumber | GST registration (Optional) | Business customer identification |
| Remarks | Optional notes | Business-specific information |
| Status | Active / Inactive | Indicates whether customer is currently doing business |

---

## Business Relationship

```text
                  Customer
                     │
     ┌───────────────┼────────────────┐
     │               │                │
     ▼               ▼                ▼
   Order         Payment        Delivery
```

A single Customer can have:

- Multiple Orders
- Multiple Payments
- Multiple Deliveries

---

## Business Rules

- Every customer must have a unique CustomerID.
- One customer can place multiple orders.
- Customers are never deleted; they are marked as Inactive if required.
- Customer details are maintained separately from transactional data.
- Pending payment is calculated from Orders and Payments, not stored here.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Order Details | Order | Transaction data |
| Products Purchased | Order Item | Sales transaction |
| Payment History | Payment | Financial transaction |
| Pending Amount | System Calculation | Derived value |
| Delivery Details | Delivery | Logistics transaction |

---

## Architect Discoveries

During business discussions, we discovered:

- Your father naturally remembers pending payments by **Customer Name**, not by Order Number.
- The UI should always start from the Customer because it matches the business thinking.
- The database remains normalized while the UI remains customer-centric.

---

## Architect Decisions

- Customer is a Master Data table.
- Customer information is stored only once.
- Financial information is never stored in Customer.
- Customer Pending Amount is always calculated by the system.
- Customer acts as the starting point for Order, Payment, and Delivery workflows.

---

## Future Enhancements

Possible future additions:

- Email Address
- Customer Category (Retail / Contractor / Builder)
- Credit Limit
- Preferred Payment Mode
- Google Maps Location
- Customer Profile Photo

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Sales |
| Owner  | Sales Management |
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
