# 📦 Delivery Item

# Delivery Item (Transaction Table)

---

# Purpose

The Delivery Item table records the individual products delivered as part of a Delivery.

A Delivery may contain one or more products, and each product delivered is stored as a separate Delivery Item.

---

# Business Responsibility

The Delivery Item table answers:

- Which products were delivered?
- How many units of each product were delivered?
- Which delivery trip carried those products?

---

# Table Structure

| Column | Type | Description |
|----------|------|-------------|
| DeliveryItemID (PK) | UUID / INT | Unique delivery item |
| DeliveryID (FK) | FK | Delivery reference |
| ProductID (FK) | FK | Product delivered |
| DeliveredQuantity | INT | Quantity delivered |
| Remarks | TEXT | Additional notes |

---

# Primary Key

DeliveryItemID

---

# Foreign Keys

DeliveryID → Delivery(DeliveryID)

ProductID → Product(ProductID)

Relationships:

One Delivery

↓

Many Delivery Items

↓

One Product

---

# Business Rules

## Rule 1

Every Delivery Item belongs to exactly one Delivery.

---

## Rule 2

Every Delivery Item references exactly one Product.

---

## Rule 3

A Delivery may contain multiple Delivery Items.

Example:

Delivery

↓

4" Block → 100

↓

6" Block → 50

---

## Rule 4

DeliveredQuantity represents only the quantity physically delivered during that trip.

It does not represent:

- Ordered Quantity
- Remaining Quantity
- Reserved Quantity

---

## Rule 5

Selling Price is NOT stored in Delivery Item.

The agreed selling price already belongs to Order Item.

Delivery Item records only the physical movement of products.

---

## Rule 6

Customer information is NOT stored in Delivery Item.

Customer information is available through:

Delivery

↓

Order

↓

Customer

This prevents duplicate information.

---

# Business Workflow

Order

↓

Delivery

↓

Delivery Item

↓

Finished Goods Stock Updated

↓

Payment Collection

---

# Example

| Delivery | Product | Delivered Quantity |
|-----------|----------|-------------------:|
| D001 | 4" Block | 100 |
| D001 | 6" Block | 50 |
| D002 | 8" Block | 200 |

---

# Why This Design?

This design separates:

- Delivery information
- Product information

following the same normalized pattern used by:

Order

↓

Order Item

This keeps the database simple, scalable, and free from duplicated information.

---

# Future Scope

Future versions may include:

- Damaged Quantity
- Returned Quantity
- Batch Tracking
- Quality Inspection
- Delivery Verification

---

## Status

**Status:** ✅ Frozen

**Domain:** Sales

**Data Classification:** Transaction Data

**Owner:** Logistics & Dispatch

**Related Tables:**

- Delivery
- Product
- Finished Goods Stock

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |