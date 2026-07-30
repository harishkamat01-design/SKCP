# 🧾 Payment Allocation

---

## Purpose

The **Payment Allocation** table distributes a customer's payment across one or more customer orders.

It answers the business question:

> **"Which orders were settled by this payment, and by how much?"**

This table is responsible for the accounting relationship between **Payments** and **Orders**.

---

## Business Questions Answered

This table helps answer:

- Which orders did this payment settle?
- How much of the payment was applied to each order?
- How much remains pending for each order?
- Which payments contributed to a particular order?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| PaymentAllocationID (PK) | Unique allocation record | Identifies one allocation |
| PaymentID (FK) | References Payment | Which payment is being allocated |
| OrderID (FK) | References Order | Which order receives the allocation |
| AllocatedAmount | Amount applied to the order | Financial allocation |
| AllocationDate | Date allocation occurred | Audit information |
| Remarks | Optional notes | Additional allocation details |

---

## Business Relationship

```text
            Customer

                │

                ▼

            Payment

                │

                ▼

      Payment Allocation

          │          │

          ▼          ▼

      Order-101   Order-102
```

One Payment can be allocated to:

- One Order
- Multiple Orders

One Order can receive:

- One Payment
- Multiple Payments

This creates a **many-to-many relationship**, resolved through Payment Allocation.

---

## Business Rules

- Every Payment Allocation belongs to one Payment.
- Every Payment Allocation belongs to one Order.
- A payment may be split across multiple orders.
- An order may receive payments over multiple installments.
- The **sum of all allocations must always equal the TotalAmountReceived** before the payment is saved.
- Allocations are generated automatically by the system.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Customer Name | Customer | Master Data |
| Payment Mode | Payment | Payment transaction |
| Product Details | Order Item | Sales information |
| Pending Amount | System Calculation | Derived value |
| Delivery Information | Delivery | Logistics |

---

## Architect Discoveries

### The System Should Do the Accounting

One of the biggest discoveries during the SKCP design sessions:

Your father remembers:

- Customer Name
- Total Pending
- Total Paid

He **does not manually split payments** across orders.

The ERP should therefore perform the accounting automatically.

---

### One Payment Can Settle Multiple Orders

Example:

Customer pays:

₹30,000

System automatically allocates:

- Order-101 → ₹12,000
- Order-102 → ₹18,000

Father simply enters:

₹30,000 Received

Everything else happens automatically.

---

### One Order Can Receive Multiple Payments

Example:

Order Total:

₹50,000

Payments:

- ₹20,000
- ₹15,000
- ₹15,000

The order becomes fully paid over time.

---

## Architect Decisions

- Payment Allocation is a Transaction table.
- Users never manually create allocation records.
- Allocation is generated automatically by the system.
- The total of all allocations must always equal the payment amount.
- This table resolves the many-to-many relationship between Payments and Orders.

---

## Future Enhancements

Possible future additions:

- AI Allocation Suggestions
- Manual Allocation Override (Admin Only)
- Allocation Audit Trail
- Automatic Priority Rules (Oldest Order First)
- Customer Credit Adjustment
- Refund Allocation

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Payment |
| Table Status | ✅ Approved |
| Sprint | Sprint 2 – Business Domain & Database Design |
| Last Updated | 29 July 2026 |
| Architect | Harish Kamat & ChatGPT |

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |