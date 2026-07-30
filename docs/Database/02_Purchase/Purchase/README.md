# 🛒 Purchase

---

## Purpose

The **Purchase** table stores the header information of every raw material purchase made by SKCP.

It answers the business question:

> **"When did SKCP purchase raw materials, and from whom?"**

This table stores only the purchase transaction header.

The actual raw materials purchased are stored separately in **Purchase Item**.

---

## Business Questions Answered

This table helps answer:

- When was the purchase made?
- Which supplier supplied the materials?
- What is the purchase reference number?
- What is the current status of the purchase?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| PurchaseID (PK) | Unique purchase transaction | Identifies one purchase |
| SupplierID (FK) | References Supplier | Who supplied the materials |
| PurchaseDate | Date of purchase | Business transaction date |
| InvoiceNumber | Supplier invoice number | Purchase reference |
| PurchaseStatus | Draft / Received / Cancelled | Current purchase status |
| Remarks | Optional notes | Additional purchase information |

---

## Business Relationship

```text
                Supplier
                    │
                    ▼
               Purchase
                    │
                    ▼
             Purchase Item
```

One Supplier can have:

- Multiple Purchases

One Purchase can contain:

- Multiple Purchase Items

---

## Business Rules

- Every purchase must have a unique PurchaseID.
- Every purchase belongs to exactly one supplier.
- A purchase may contain one or many raw materials.
- Purchase can exist before stock is updated.
- Purchase Status controls the lifecycle of the transaction.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Raw Material | Purchase Item | One purchase contains many materials |
| Quantity Purchased | Purchase Item | Item-level information |
| Purchase Price | Purchase Item | Price differs for each material |
| Current Stock | Raw Material Stock | Inventory responsibility |
| Supplier Contact | Supplier | Master Data |

---

## Architect Discoveries

During business analysis, we discovered:

- Purchase is only the **transaction header**.
- One purchase can contain multiple raw materials.
- Purchase should never store material quantities directly.
- Purchase Status was added to support Draft, Received, and Cancelled transactions.

---

## Architect Decisions

- Purchase is a Transaction table.
- Supplier owns supplier information.
- Purchase Item owns material details.
- Inventory is updated only after the purchase is received.
- Purchase Status controls the business workflow.

---

## Future Enhancements

Possible future additions:

- Purchase Approval
- Expected Delivery Date
- Freight Charges
- Vehicle Details
- Purchase Attachment (Invoice PDF)

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