# Database Relationship Summary

# Module
**Module 3 – Database Design**
**Document:** Database Relationship Summary
**Version:** 1.0
**Status:** 🚧 In Progress

---

# Purpose

This document defines every relationship between the SKCP database tables.

It serves as the single source of truth for:

- Foreign Key relationships
- Cardinality (1:1, 1:N)
- Business ownership
- Relationship justification

This document is used to build:

- Master ER Diagram
- PostgreSQL Schema
- Spring Boot JPA Entities
- Backend APIs

---

# Relationship Philosophy

SKCP follows **Business-First Database Design**.

Relationships are created only when a real business relationship exists.

Every relationship answers a business question.

Example:

> "Which customer placed this order?"

becomes

```
Order.CustomerID
        ↓
Customer.CustomerID
```

No relationship exists unless the business actually requires it.

---
# Relationship Categories

The SKCP database is organized into six business domains.

Each domain owns a specific set of tables.

---

                                                        # 1. Master Data


## Purpose

The **Master Data** domain stores stable business information used across the entire SKCP application.

These tables rarely change compared to transaction tables and act as the foundation for all other business modules.

---

## Tables

| Table | Purpose |
|---------|----------|
| Asset | Stores factory assets, machines, vehicles, utilities and equipment |
| Customer | Stores customer master information |
| Labour | Stores permanent labour master information |
| Product | Stores finished product master information |
| RawMaterial | Stores raw material master information |
| Supplier | Stores supplier master information |

---

## Relationships

| Parent Table | Child Table | Cardinality | Foreign Key | Business Reason |
|---------------|-------------|-------------|-------------|-----------------|
| Supplier | Purchase | 1 : Many | SupplierID | One supplier can provide many purchase invoices. Every purchase belongs to exactly one supplier. |
| RawMaterial | PurchaseItem | 1 : Many | RawMaterialID | One raw material can appear in many purchase transactions. |
| RawMaterial | RawMaterialStock | 1 : 1 | RawMaterialID | Every raw material maintains one current stock position. |
| Product | Production | 1 : Many | ProductID | One product can be produced many times over different production dates. |
| **Asset** | **Production** | **1 : Many** | **AssetID** | One block-making machine can produce many production records. Every production record is associated with exactly one machine. |
| Product | CuringStock | 1 : Many | ProductID | One product can have multiple curing batches over time. |
| Product | FinishedGoodsStock | 1 : 1 | ProductID | Every finished product maintains one current stock position. |
| Product | OrderItem | 1 : Many | ProductID | Customers can order the same product many times. |
| Product | DeliveryItem | 1 : Many | ProductID | The same product can appear in multiple deliveries. |
| Customer | Order | 1 : Many | CustomerID | One customer can place many orders. Every order belongs to exactly one customer. |
| Labour | Attendance | 1 : Many | LabourID | One labour can have attendance records for many working days. |

---

## Business Rules

- Every customer must exist before an order can be created.
- Every supplier must exist before a purchase can be recorded.
- Every product must exist before production, ordering or delivery.
- Every raw material must exist before purchasing or inventory tracking.
- Attendance cannot exist without a registered labour.
- Production cannot exist without a registered product.
- Production is linked only to the block-making machine used for manufacturing.

---

## Architect Notes

Master Data tables are the owners of business identities.

No transaction table should duplicate master information.

Instead, transaction tables reference Master Data using foreign keys.

An important architectural decision in Version 1 is linking the **Production** table with the **Asset** table.

Although the current notebook does not explicitly record the machine used for production, capturing the machine enables:

- Machine-wise production reports
- Machine utilization analysis
- Maintenance planning
- Production traceability
- Future AI insights

This small addition significantly improves the long-term scalability of the database without increasing business complexity.

This design minimizes redundancy and maintains data consistency throughout the system.
---

                                                        # 2. Procurement

## Purpose

The **Procurement** domain manages the purchasing of raw materials from suppliers.

It records supplier invoices and the individual raw materials purchased in each invoice.

This domain ensures that every purchase updates inventory while maintaining a complete purchase history.

---

## Tables

| Table | Purpose |
|---------|----------|
| Purchase | Stores purchase invoice/header information |
| PurchaseItem | Stores individual raw materials purchased in each invoice |

---

## Relationships

| Parent Table | Child Table | Cardinality | Foreign Key | Business Reason |
|---------------|-------------|-------------|-------------|-----------------|
| Supplier | Purchase | 1 : Many | SupplierID | One supplier can issue many purchase invoices. Every purchase belongs to exactly one supplier. |
| Purchase | PurchaseItem | 1 : Many | PurchaseID | One purchase invoice can contain multiple raw materials. Every purchase item belongs to exactly one purchase invoice. |
| RawMaterial | PurchaseItem | 1 : Many | RawMaterialID | One raw material can appear in many purchase transactions over time. |

---

## Business Rules

- Every purchase must belong to exactly one supplier.
- Every purchase invoice must contain at least one purchase item.
- One purchase invoice can contain multiple different raw materials.
- Unit Price is recorded per purchasing unit (Bag, Tractor Load, Truck, etc.).
- PurchaseItem stores the purchased quantity for each raw material.
- Total invoice amount is calculated from all PurchaseItem records.
- Purchase history is never deleted because it forms the inventory audit trail.

---

## Architect Notes

The Procurement module follows the standard **Header–Detail** design used in ERP systems.

Purchase acts as the invoice header, while PurchaseItem stores the detailed list of raw materials purchased.

This design eliminates duplication of supplier and invoice information while supporting invoices containing multiple raw materials.

Separating Purchase and PurchaseItem also simplifies reporting, inventory updates, and future financial integrations.

---

# 3. Production

## Purpose

The **Production** domain manages the manufacturing activities of SKCP.

It records daily block production, labour attendance, and the machine (Asset) used for production.

This domain forms the foundation for inventory updates, curing management, machine utilization analysis, and future AI-driven production insights.

---

## Tables

| Table | Purpose |
|---------|----------|
| Production | Stores one day's production for one product |
| Attendance | Stores daily attendance of labour |
| Labour | Master table containing labour information |
| Asset | Master table containing production machine information |

---

## Relationships

| Parent Table | Child Table | Cardinality | Foreign Key | Business Reason |
|---------------|-------------|-------------|-------------|-----------------|
| Product | Production | 1 : Many | ProductID | One product can be produced many times over different production dates. |
| Asset | Production | 1 : Many | AssetID | One block-making machine can produce many production records. Every production record belongs to exactly one machine. |
| Labour | Attendance | 1 : Many | LabourID | One labour can have attendance records for many working days. |

---

## Business Rules

- One Production record represents one day's production for one product.
- One Production record belongs to exactly one Product.
- One Production record records the machine (Asset) used.
- One machine can produce many production records.
- Attendance is recorded separately from Production.
- Every attendance record belongs to exactly one labour.
- Sunday is always Factory Holiday.
- Labour salary is calculated weekly from attendance records.
- Production is completed before blocks enter the curing yard.
- Cement consumption is recorded daily and supports production tracking.

---

## Architect Notes

The Production module was intentionally designed to separate **production activities** from **labour attendance**.

Although labour participates in production, attendance and salary calculations are independent business processes.

A key architectural decision in Version 1 is linking **Production** with **Asset**.

Although the current notebook does not record the production machine, storing the machine enables:

- Machine-wise production reports
- Machine utilization analysis
- Maintenance planning
- Production traceability
- Future AI insights
- Future Overall Equipment Effectiveness (OEE) calculations

This design prepares SKCP for future manufacturing analytics without increasing today's business complexity.

---

                                                        # 4. Inventory

## Purpose

The **Inventory** domain manages the current stock position of raw materials and finished products throughout the manufacturing lifecycle.

It tracks:

- Raw Material availability
- Products under curing
- Finished goods ready for sale

This domain provides real-time inventory visibility while preserving historical movements through Procurement, Production, and Delivery transactions.

---

## Tables

| Table | Purpose |
|---------|----------|
| RawMaterialStock | Stores the current available stock of each raw material |
| CuringStock | Stores production batches currently under curing |
| FinishedGoodsStock | Stores finished products available in the sales yard |

---

## Relationships

| Parent Table | Child Table | Cardinality | Foreign Key | Business Reason |
|---------------|-------------|-------------|-------------|-----------------|
| RawMaterial | RawMaterialStock | 1 : 1 | RawMaterialID | Every raw material maintains one current stock record. |
| Product | CuringStock | 1 : Many | ProductID | One product can have multiple curing batches over time. |
| Production | CuringStock | 1 : Many | ProductionID | Every production record creates one curing batch. |
| Product | FinishedGoodsStock | 1 : 1 | ProductID | Every finished product maintains one current stock record. |

---

## Business Rules

- Every raw material maintains exactly one current stock position.
- RawMaterialStock stores only the latest available quantity.
- Purchase history is maintained in Purchase and PurchaseItem.
- Production reduces RawMaterialStock through business processing.
- Every Production record creates one curing batch.
- Products remain in CuringStock until the father confirms they are ready.
- Partial transfer from CuringStock to FinishedGoodsStock is allowed.
- FinishedGoodsStock stores only the current available quantity in the sales yard.
- FinishedGoodsStock reduces immediately after product delivery.
- Minimum Stock alerts are maintained for:
  - Cement (Raw Material)
  - Finished Products

---

## Inventory Flow

Raw Material Purchase

↓

RawMaterialStock

↓

Production

↓

CuringStock

↓

FinishedGoodsStock

↓

Delivery

---

## Architect Notes

The Inventory module follows the **Current Position + Historical Transactions** design philosophy.

Historical movements are stored in:

- Purchase
- PurchaseItem
- Production
- Delivery
- DeliveryItem

Inventory tables store only the **latest stock position**, making stock lookup extremely fast while keeping historical audit information separate.

This design avoids duplication and supports efficient reporting and future automation.

---

                                                        # 5. Sales

## Purpose

The **Sales** domain manages the complete customer sales lifecycle.

It records:

- Customer Orders
- Ordered Products
- Product Deliveries

This domain ensures that every customer order can be fulfilled through one or multiple deliveries while maintaining inventory accuracy.

---

## Tables

| Table | Purpose |
|---------|----------|
| Order | Stores customer order header information |
| OrderItem | Stores products ordered by the customer |
| Delivery | Stores delivery header information |
| DeliveryItem | Stores products delivered to the customer |

---

## Relationships

| Parent Table | Child Table | Cardinality | Foreign Key | Business Reason |
|---------------|-------------|-------------|-------------|-----------------|
| Customer | Order | 1 : Many | CustomerID | One customer can place many orders. Every order belongs to exactly one customer. |
| Order | OrderItem | 1 : Many | OrderID | One customer order can contain multiple products. |
| Product | OrderItem | 1 : Many | ProductID | One product can appear in many customer orders. |
| Order | Delivery | 1 : Many | OrderID | One customer order can be delivered in one or multiple trips. |
| Delivery | DeliveryItem | 1 : Many | DeliveryID | One delivery can contain multiple products. |
| Product | DeliveryItem | 1 : Many | ProductID | One product can appear in many deliveries. |

---

## Business Rules

- Every order belongs to exactly one customer.
- Every order must contain at least one OrderItem.
- One order can contain multiple products.
- One order may require one or multiple deliveries.
- Every delivery belongs to exactly one order.
- Every delivery must contain at least one DeliveryItem.
- One delivery can contain multiple block sizes.
- One DeliveryItem stores only the delivered quantity.
- Selling price is maintained in OrderItem, not DeliveryItem.
- FinishedGoodsStock reduces immediately after delivery.
- Trip Number is maintained in Delivery for multi-trip deliveries.
- Transport charges are recorded in Delivery.

---

## Sales Flow

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

FinishedGoodsStock Updated

↓

Payment

---

## Architect Notes

The Sales module follows the **Header–Detail** design pattern used in ERP systems.

Orders and Deliveries are intentionally separated because:

- One order may require multiple deliveries.
- Delivery represents the physical movement of goods.
- Order represents the commercial agreement with the customer.

Although Version 1 does not track batch-wise deliveries, the design supports future batch traceability without database redesign.

Transport charges are maintained at the Delivery level because they belong to the logistics process rather than the sales negotiation.

---

                                                        # 6. Finance

## Purpose

The **Finance** domain manages customer payment transactions and payment allocation against customer orders.

It ensures complete visibility of:

- Customer payments
- Partial payments
- Outstanding balances
- Order-wise payment allocation

This design supports flexible payment methods while maintaining complete financial traceability.

---

## Tables

| Table | Purpose |
|---------|----------|
| Payment | Stores customer payment transactions |
| PaymentAllocation | Allocates payments against customer orders |

---

## Relationships

| Parent Table | Child Table | Cardinality | Foreign Key | Business Reason |
|---------------|-------------|-------------|-------------|-----------------|
| Customer | Payment | 1 : Many | CustomerID | One customer can make multiple payments over time. |
| Payment | PaymentAllocation | 1 : Many | PaymentID | One payment can be allocated to one or multiple customer orders. |
| Order | PaymentAllocation | 1 : Many | OrderID | One customer order can receive multiple payments until fully settled. |

---

## Business Rules

- Every payment belongs to exactly one customer.
- One customer can make multiple payments.
- Every payment must contain at least one payment allocation.
- One payment can be allocated across multiple customer orders.
- One customer order can receive multiple payments.
- Outstanding balance is calculated from Order Amount minus Allocated Payments.
- PaymentAllocation stores only the allocated amount, not the total payment amount.
- Payment history is never deleted because it forms the financial audit trail.

---

## Payment Flow

Customer

↓

Payment

↓

PaymentAllocation

↓

Order

↓

Outstanding Balance Updated

---

## Architect Notes

The Finance module separates **Payment** from **PaymentAllocation** to support installment-based payments.

This design allows:

- One payment to settle multiple orders.
- One order to be paid through multiple installments.
- Accurate outstanding balance calculation without data duplication.

PaymentAllocation acts as the bridge between commercial transactions (Orders) and financial transactions (Payments), ensuring flexibility while maintaining a complete audit trail.

This structure follows the same **Header–Detail** design philosophy used throughout the SKCP database.

---


                        **Each domain is connected through carefully designed foreign key relationships.**

---