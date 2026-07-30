# Master Entity Relationship Diagram

---

# Procurement

Supplier

↓

Purchase

↓

PurchaseItem

↓

RawMaterial

---

# Manufacturing

RawMaterial

↓

Production

↓

ProductionItem

↓

Curing

↓

FinishedGoodsStock

---

# Sales

Customer

↓

Order

↓

OrderItem

↓

Delivery

↓

DeliveryItem

↓

DeliveryConfirmation

---

# Finance

Customer

↓

Payment

↓

PaymentAllocation

↓

Order

---

# Complete Business Workflow

Supplier

↓

Purchase

↓

Raw Material

↓

Production

↓

Curing

↓

Finished Goods Stock

↓

Customer

↓

Order

↓

Delivery

↓

Payment

---

# Database Statistics

Master Tables

4

Transaction Tables

12

Total Tables

16

---

# Architecture Status

Database Design

✅ Completed

Ready for Backend Implementation