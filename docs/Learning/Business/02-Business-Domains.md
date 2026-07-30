# Business Domains

## Raw Materials

- Cement
- Sand
- Jelly
- Water
- Suppliers
- Purchase
- Stock

---

## Production

- Planning
- Machine
- Mould
- Labour
- Curing
- Inventory
- Quality

---

## Sales

- Customer
- Order
- Dispatch
- Vehicle
- Receipt
- Payment
- Reports

---
---

# Business Domain Relationships

Although each business domain has its own responsibility, no domain operates independently.

Every business operation flows across multiple domains.

Example:

Raw Materials

↓

Production

↓

Sales

↓

Customer

This continuous flow forms the operational backbone of SKCP.

---

# Raw Materials Domain

## Purpose

Provide all resources required for manufacturing cement blocks.

## Inputs

- Suppliers
- Cement
- Sand (Reti)
- Jelly
- Water

## Outputs

- Materials available for Production

## Business Goal

Ensure uninterrupted production through timely availability of quality raw materials.

---

# Production Domain

## Purpose

Convert raw materials into finished cement blocks.

## Inputs

- Raw Materials
- Machines
- Moulds
- Labour

## Outputs

- Finished Products
- Inventory

## Business Goal

Produce high-quality blocks while maintaining proper curing and stock availability.

---

# Inventory Ownership Model

SKCP has two primary inventory states.

## 1. Raw Material Stock

Owned by:

Raw Materials Domain

Purpose:

Track available production inputs.

Examples:

- Cement
- Sand
- Jelly
- Water


---

## 2. Finished Goods Stock

Owned by:

Production Domain

Purpose:

Track manufactured products available for sale.

Examples:

- Solid Blocks


---

# Production Transformation Principle

Production creates movement between inventory states.

Raw Material Stock
    ↓

 Production

    ↓
Finished Goods Stock

Production is the transformation process, not the inventory owner.


# Sales Domain


## Purpose

Sell finished products and manage customer relationships.

## Inputs

- Customers
- Finished Inventory

## Outputs

- Customer Relationship
- Product Offering
- Order Management
- Delivery Coordination
- Payment Collection
- Business Reporting

## Business Goal

Deliver products accurately, collect payments efficiently, and maintain customer trust.

---

# Information Flow Across Domains

Business information moves between domains.

```
Customer Order

↓

Sales Domain

↓

Inventory Check

↓

Production (if required)

↓

Delivery

↓

Payment

↓

Reports
```

Each domain both consumes and produces information for the next domain.

---

# Domain Responsibilities

| Domain | Primary Responsibility |
|----------|------------------------|
| Raw Materials | Material availability |
| Production | Product manufacturing |
| Sales | Customer satisfaction and revenue generation |

Each domain owns its own business processes while collaborating with the others.

---

# Domain Boundary Principle

Each business domain should own its own responsibilities.

A domain can share information with other domains, but it should not control another domain's internal decisions.

Example:

Production can consume Raw Material Stock.

Production cannot own Raw Material Stock.

Sales can request Finished Goods.

Sales cannot directly modify Production data.

Clear boundaries prevent tightly coupled systems.

---

# Business Domain to Database Mapping

Business domains become the foundation for database modules.

| Business Domain | Database Entities |
|----------------|------------------|
| Raw Materials | Supplier, Purchase, Purchase Item, Raw Material |
| Production | Production, Production Item, Curing, Finished Goods Stock |
| Sales | Customer, Product, Order, Order Item, Delivery, Payment |

This mapping ensures database design follows business structure.


---
# Future Expansion

The current three-domain architecture is designed to support future growth.

Potential future domains include:

- Purchase Management
- Human Resources
- Finance
- Equipment Maintenance
- Quality Assurance
- Business Intelligence
- Artificial Intelligence

The current architecture can accommodate these domains without requiring major redesign.

---

# Business Domain Principle

Every new feature developed for SKCP should belong to one clearly defined business domain.

If a feature spans multiple domains, its responsibilities should be carefully separated to preserve modularity and maintainability.
---

# Future ERP Domain Vision

As SKCP grows, additional domains can be introduced:

- Procurement Management
- Finance Management
- Human Resource Management
- Equipment Maintenance
- Quality Management
- Analytics
- AI Decision Support

New domains should be added only when business complexity requires them.

---


# Updated One-Line Memory

Business Domains divide the business into responsibilities, but they work together as one integrated Business Operating System.

## One-Line Memory

Every feature in SKCP belongs to exactly one business domain.