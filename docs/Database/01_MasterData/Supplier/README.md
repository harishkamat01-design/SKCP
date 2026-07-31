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
   │
   └── 1 : Many Purchases
               │
               └── 1 : Many Purchase Items

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

**Domain:** Procurement

**Owner:** Procurement Management

**Related Tables:**

- Purchase
- Purchase Item


---

