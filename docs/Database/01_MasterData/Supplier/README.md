# 🚚 Supplier

## Purpose

The Supplier table stores the permanent information about every supplier from whom the factory purchases raw materials.

It defines **who supplies materials** to the business.

The Supplier table contains only supplier-related information and is reused across multiple purchase transactions.

---

# Supplier Table

| Column | Type | Description |
|---------|------|-------------|
| SupplierID (PK) | UUID / INT | Unique supplier identifier |
| SupplierName | VARCHAR(100) | Supplier name |
| ContactPerson | VARCHAR(100) | Contact person's name |
| Phone | VARCHAR(20) | Mobile number |
| WhatsApp | VARCHAR(20) | WhatsApp number |
| Address | TEXT | Supplier address |
| GSTNumber | VARCHAR(30) | GST registration number |
| CreatedDate | DATE | Date supplier was added |
| Status | ENUM | Active / Inactive |

---

# Business Relationship

Supplier

1

↓

Many

Purchase

1

↓

Many

Purchase Item

---

# Business Event

Example

ABC Cement Supplier

↓

Purchase Invoice INV-1025

↓

Purchase Header Created

↓

Multiple Purchase Items

↓

Raw Materials Purchased

A supplier can have many purchase transactions over time.

---

# What Does NOT Belong Here

The following information belongs elsewhere:

Purchase

- Purchase Date
- Invoice Number
- Payment Status
- Remarks

Purchase Item

- Raw Material
- Quantity
- Purchase Unit
- Unit Price
- Line Amount

Inventory

- Current Stock
- Available Stock

Supplier stores only supplier master information.

---

# Architect Decision

Supplier is Master Data.

The supplier is created once and reused across every purchase transaction.

This avoids duplication of supplier information in every purchase record.

---

# Interview Takeaway

Supplier is a Master Data entity.

Master tables should contain only relatively stable information.

Transaction tables reference the Supplier using a Foreign Key instead of storing supplier details repeatedly.

---

# Beautiful Symmetry

| Sales Domain | Purchase Domain |
|--------------|-----------------|
| Customer | Supplier |
| Order | Purchase |
| Order Item | Purchase Item |
| Product | Raw Material |

The purchasing module mirrors the sales module using the same normalized design principles.

---

# Architect Lesson

A Supplier table should answer only one question:

**"Who supplies materials to the factory?"**

It should never answer:

- What was purchased?
- When was it purchased?
- How much was purchased?
- What was the invoice amount?

Those belong to Purchase and Purchase Item.

Separating responsibilities keeps the database normalized and scalable.

---

# Status
**Date:** 30th July 2026

**Status:** ✅ Frozen

**Domain:** Master Data

**Owner:** Procurement Domain

**Related Tables:**

- Purchase
- Purchase Item


---

## Purpose

The **Supplier** table stores the permanent list of suppliers who provide raw materials to SKCP.

It answers the business question:

> **"Who supplies our raw materials?"**

This is **Master Data**, meaning supplier information changes infrequently.

This table **does not** store purchase history, purchase prices, supplied quantities, or payment information.

---

## Business Questions Answered

This table helps answer:

- Who are SKCP's suppliers?
- How can we contact them?
- Where is the supplier located?
- Is the supplier currently active?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| SupplierID (PK) | Unique supplier identifier | Identifies each supplier |
| SupplierName | Supplier name | Business identification |
| MobileNumber | Contact number | Communication |
| AlternateMobile | Optional second contact | Backup communication |
| Address | Supplier address | Business information |
| Village | Village / Area | Supplier location |
| City | City | Supplier location |
| Pincode | Postal code | Address information |
| GSTNumber | GST registration (Optional) | Business identification |
| Remarks | Optional notes | Additional supplier information |
| Status | Active / Inactive | Indicates whether supplier is currently active |

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
                      │
                      ▼
                Raw Material
```

A single Supplier can have:

- Multiple Purchases

A single Purchase can contain:

- Multiple Raw Materials

---

## Business Rules

- Every supplier must have a unique SupplierID.
- One supplier can supply many purchases.
- A supplier is never directly linked to Raw Material.
- Supplier information is Master Data.
- Suppliers are marked Inactive instead of being deleted.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Purchase Date | Purchase | Transaction information |
| Purchase Price | Purchase Item | Price changes every purchase |
| Quantity Purchased | Purchase Item | Transaction detail |
| Current Stock | Raw Material Stock | Inventory information |
| Raw Material List | Purchase Item | One supplier can supply many materials over time |

---

## Architect Discoveries

During architecture discussions, we discovered an important business principle:

A supplier should **not** be directly connected to Raw Material.

Instead, the relationship is naturally discovered through transactions.

```text
Supplier

↓

Purchase

↓

Purchase Item

↓

Raw Material
```

This makes the system flexible because:

- One supplier can supply many raw materials.
- One raw material can be purchased from many suppliers.

---

## Architect Decisions

- Supplier is a Master Data table.
- Supplier owns only permanent information.
- Supplier and Raw Material have **no direct relationship**.
- Purchase acts as the bridge between Supplier and Raw Material.

---

## Future Enhancements

Possible future additions:

- Supplier Rating
- Bank Account Details
- PAN Number
- Email Address
- Preferred Payment Terms
- Lead Time

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