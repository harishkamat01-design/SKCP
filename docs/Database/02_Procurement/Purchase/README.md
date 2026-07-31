# 🛒 Purchase

## Purpose

The Purchase table records every purchase transaction made from a supplier.

A Purchase represents the **invoice/header** of a procurement transaction.

It stores information that is common to the entire purchase, while the individual raw materials purchased are stored separately in the Purchase Item table.

---

# Purchase Table

| Column | Type | Description |
|---------|------|-------------|
| PurchaseID (PK) | UUID / INT | Unique purchase transaction |
| SupplierID (FK) | UUID / INT | Supplier from whom materials were purchased |
| PurchaseDate | DATE | Date of purchase |
| InvoiceNumber | VARCHAR(50) | Supplier invoice number |
| PaymentStatus | ENUM | Pending / Partial / Paid |
| Remarks | TEXT | Optional notes |

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

Supplier ABC Cement

↓

Purchase Invoice INV-1025

↓

Purchase Date

↓

Multiple Raw Materials Purchased

↓

Purchase Items Created

---

# What Does NOT Belong Here

The following information belongs in **Purchase Item**, not Purchase:

- Raw Material
- Quantity
- Unit
- Unit Price
- Line Amount

Purchase stores only invoice-level information.

---

# Architect Decision

Purchase follows the **Header–Detail** design pattern.

The Purchase table acts as the **Header**, while Purchase Item stores the detailed material lines.

This avoids duplication of supplier and invoice information.

---

# Interview Takeaway

A Purchase table is a **transaction header**.

Whenever one business transaction contains multiple line items, split the design into:

- Header Table
- Detail Table

This is a common ERP design pattern.

Examples:

- Purchase → Purchase Item
- Order → Order Item
- Invoice → Invoice Item
- Quotation → Quotation Item

---

# Beautiful Symmetry

| Sales | Purchase |
|--------|----------|
| Customer | Supplier |
| Order | Purchase |
| Order Item | Purchase Item |
| Product | Raw Material |

Both modules follow the same normalized database design.

---

# Architect Lesson

Purchase records **when** a purchase happened.

Purchase Item records **what** was purchased.

Separating these responsibilities creates a scalable, normalized database.

---

## Status

Domain:
Procurement

Data Classification:
Transaction Data

Owner:
Procurement Management

Status:
✅ Frozen
---
