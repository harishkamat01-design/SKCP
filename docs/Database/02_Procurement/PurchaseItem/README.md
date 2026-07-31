# 📦 Purchase Item

# Purchase Item

## Purpose

Stores each individual raw material purchased as part of a Purchase invoice.

Purchase Item represents one line item inside a supplier invoice.

---

# Purchase Item Table

| Column | Type | Description |
|---------|------|-------------|
| PurchaseItemID (PK) | UUID / INT | Unique purchase item |
| PurchaseID (FK) | UUID / INT | Parent Purchase |
| RawMaterialID (FK) | UUID / INT | Purchased raw material |
| Quantity | DECIMAL(10,2) | Purchased quantity |
| Unit | VARCHAR(30) | Purchase unit (Bag, Tractor, Truck, Goods Vehicle, etc.) |
| UnitPrice | DECIMAL(12,2) | Price per purchase unit |
| LineAmount | DECIMAL(12,2) | Quantity × Unit Price |
| Remarks | TEXT | Optional notes |

---

# Business Relationship

Purchase

1

↓

Many

Purchase Item

Many

↓

1

Raw Material

---

# Business Event

Example

Purchase #P001

↓

Purchase Item

↓

Raw Material = Cement

Quantity = 400

Unit = Bags

Unit Price = ₹420

Line Amount = ₹168,000

Another row within the same purchase:

Purchase #P001

↓

Purchase Item

↓

Raw Material = Sand

Quantity = 2

Unit = Tractor

Unit Price = ₹7,000

Line Amount = ₹14,000

---

# What Does NOT Belong Here

The following information belongs to the Purchase table, not Purchase Item:

- Supplier
- Purchase Date
- Invoice Number
- Payment Status

Purchase Item stores only the details of one purchased material.

---

# Architect Decision

Purchase Item represents one material line inside a Purchase invoice.

Each row records:

- Which raw material was purchased
- Quantity purchased
- Purchase unit
- Price per unit
- Total amount for that line

This design follows normalization and allows one Purchase to contain multiple raw materials.

---

# Interview Takeaway

Purchase Item is a classic Header–Detail (Master–Detail) design.

Purchase acts as the Header.

Purchase Item acts as the Detail.

This pattern is widely used in ERP systems for purchases, sales, invoices, quotations, and deliveries.

---

# Beautiful Symmetry

| Sales Domain | Purchase Domain |
|--------------|-----------------|
| Customer | Supplier |
| Order | Purchase |
| Order Item | Purchase Item |
| Product | Raw Material |
| Quantity | Quantity |
| Unit Price | Unit Price |
| Line Amount | Line Amount |

Both Sales and Purchase follow the same normalized design.

---

# Architect Lesson

Raw Material identifies **what** the material is.

Purchase Item records **how it was purchased**:

- Quantity
- Unit
- Unit Price
- Line Amount

Separating master data from transaction data creates a scalable and maintainable ERP database.

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

Date:
30th July 2026
