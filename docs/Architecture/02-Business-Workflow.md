# SKCP Business Workflow

## Business Goal

The primary objective of SKCP is to digitize the complete business operations of **Shree Kundodari Cement Products** by replacing manual notebook-based processes with an integrated ERP system.

The application manages:

- Procurement
- Production
- Inventory
- Sales
- Finance
- Reporting

The architecture follows a **Business-First Design** approach and provides a strong foundation for future AI-driven business insights.

---

# 1. Document Header

| Field | Value |
|-------|-------|
| Project | SKCP – Shree Kundodari Cement Products |
| Document | Business Workflow |
| Version | 2.0 |
| Status | ✅ Module 3 Synchronized |
| Author | Harish Kamat |
| Reviewer | Architect |
| Created On | 2026-07-24 |
| Last Updated | 31 July 2026 |

---

# 2. Purpose

To describe how the SKCP business operates from manufacturing to payment collection.

To provide a clear understanding of business processes before designing the software.

This document helps developers, architects, and future contributors understand the complete business process before software development begins.

Although this document is business-oriented, it is fully synchronized with the finalized Module 3 database architecture.

---

# 3. Scope

This document covers the complete business workflow of SKCP.

It includes:

- Manufacturing
- Procurement
- Inventory
- Sales
- Finance
- Reporting
- Future AI Features

This document intentionally avoids technical implementation details while remaining fully aligned with the finalized logical database design.

---

# 4. Business Overview

SKCP (Shree Kundodari Cement Products) manufactures and sells cement solid blocks.

The business currently manufactures three product variants:

- Solid Block 4" × 8" × 16"
- Solid Block 6" × 8" × 16"
- Solid Block 8" × 8" × 16"

Manufacturing is performed daily and products pass through a curing process before becoming available for sale.

The business inventory lifecycle consists of:

- Raw Material Stock
- Production
- Curing Stock
- Finished Goods Stock
- Customer Delivery

The finalized ERP architecture organizes the business into six domains:

- Master Data
- Procurement
- Production
- Inventory
- Sales
- Finance

These domains are implemented using 19 normalized database tables connected through validated business relationships.

---

# 5. Stakeholders

| Stakeholder | Responsibility |
|-------------|----------------|
| Business Owner (Admin) | Complete business management |
| Customer | Purchase products and make payments |
| Supplier | Supply raw materials |
| Labour | Manufacturing operations |
| Transport Provider | Deliver products |
| Future AI Assistant | Business insights and forecasting |

---

# 6. Manufacturing Workflow

## Workflow

Raw Material Available
        ↓
Production Planned
        ↓
Machine Selected
        ↓
Blocks Manufactured
        ↓
Production Recorded
        ↓
Curing Batch Created
        ↓
Blocks Remain Under Curing
        ↓
Quality Approved
        ↓
Finished Goods Stock Updated

### Current Process

- Manufacturing is performed daily.
- Production is recorded manually.
- Cement consumption is tracked manually.
- Labour attendance is maintained separately.
- Products remain under curing before sale.

### Future SKCP System

The system will record:

- Daily production
- Product manufactured
- Machine (Asset) used
- Cement consumption
- Production history

Every production record will:

- Reference exactly one Product
- Reference exactly one Production Asset
- Automatically create one initial Curing Stock batch

The curing batch may later be transferred fully or partially into Finished Goods Stock after curing is complete.

---

# 7. Customer Order Workflow

Customer Enquiry
        ↓
Stock Verified
        ↓
Quotation Prepared
        ↓
Customer Confirms
        ↓
Sales Order Created
        ↓
Delivery Planned
        ↓
Transport Arranged
        ↓
Delivery
        ↓
Payment

---

# 8. Payment Workflow

Order Created
        ↓
Customer Payment
        ↓
Payment Recorded
        ↓
Payment Allocation
        ↓
Outstanding Balance Updated

One payment may settle multiple orders.

One order may receive multiple installment payments.

The system manages this using the Payment Allocation bridge table.

---

# 9. Delivery Workflow

Customer Order
        ↓
Finished Goods Stock Verified
        ↓
Products Issued
        ↓
Transport Arranged
        ↓
Customer Delivery
        ↓
Finished Goods Stock Updated

---

# 10. Stock Management Workflow

Supplier
      │
      ▼
Purchase
      │
      ▼
PurchaseItem
      │
      ▼
RawMaterialStock
      │
      ▼
Production
      │
      ▼
CuringStock
      │
      ▼
FinishedGoodsStock
      │
      ▼
Delivery

Inventory tables always store the **current stock position**.

Historical movement is preserved in Procurement, Production and Delivery transactions.

---

# 11. Business Rules

| Rule | Description |
|------|-------------|
| BR-001 | Customer must exist before Order creation. |
| BR-002 | Supplier must exist before Purchase creation. |
| BR-003 | Product must exist before Production. |
| BR-004 | Raw Material must exist before Purchase. |
| BR-005 | Labour attendance is independent of production. |
| BR-006 | Every production record references exactly one Product. |
| BR-007 | Every production record references exactly one Production Asset. |
| BR-008 | Every production record creates exactly one initial Curing Stock batch. |
| BR-009 | Curing batches may be partially transferred to Finished Goods Stock. |
| BR-010 | Finished Goods Stock reduces immediately after Delivery. |
| BR-011 | Every customer payment belongs to exactly one customer. |
| BR-012 | Customer payments are allocated using Payment Allocation. |
| BR-013 | One payment may settle multiple orders. |
| BR-014 | One order may receive multiple payments. |

---

# 12. Business Constraints

| Constraint | Description |
|------------|-------------|
| BC-001 | Single manufacturing location |
| BC-002 | Single Admin user |
| BC-003 | Daily production |
| BC-004 | External transport providers |
| BC-005 | Inventory maintained digitally |
| BC-006 | Current Inventory maintained separately from historical transactions |

---

# 13. Business Risks

| Risk | Mitigation |
|------|------------|
| Manual stock errors | Automated inventory |
| Forgotten payments | Payment tracking |
| Notebook loss | Database storage |
| Incorrect calculations | Automated calculations |
| Slow reporting | Automated reports |
| Inventory inconsistency | Transaction-controlled stock updates |

---

# 14. Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-001 | Manage Customers |
| FR-002 | Manage Suppliers |
| FR-003 | Manage Products |
| FR-004 | Manage Raw Materials |
| FR-005 | Manage Assets |
| FR-006 | Record Purchases |
| FR-007 | Record Production |
| FR-008 | Maintain Labour Attendance |
| FR-009 | Maintain Raw Material Stock |
| FR-010 | Maintain Curing Stock |
| FR-011 | Maintain Finished Goods Stock |
| FR-012 | Manage Customer Orders |
| FR-013 | Manage Deliveries |
| FR-014 | Manage Customer Payments |
| FR-015 | Allocate Payments to Orders |
| FR-016 | Generate Business Reports |
| FR-017 | Associate every Production with exactly one Asset |
| FR-018 | Automatically create one Curing Batch for every Production |
| FR-019 | Maintain Current Inventory separately from Transaction History |
| FR-020 | Support Future AI Analytics |

---

# 15. Non Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-001 | Business-first architecture |
| NFR-002 | Third Normal Form (3NF) |
| NFR-003 | Secure business data |
| NFR-004 | High maintainability |
| NFR-005 | Fast inventory lookup |
| NFR-006 | Preserve historical transactions |
| NFR-007 | Scalable architecture |
| NFR-008 | Future AI-ready |

---

# Architecture Quality Checklist

- [x] Business workflow documented
- [x] Procurement workflow documented
- [x] Production workflow documented
- [x] Production Asset workflow documented
- [x] Inventory lifecycle documented
- [x] Curing Stock documented
- [x] Finished Goods documented
- [x] Customer Order workflow documented
- [x] Delivery workflow documented
- [x] Payment Allocation workflow documented
- [x] Current Inventory model documented
- [x] Master–Transaction separation documented
- [x] Database architecture synchronized
- [x] Module 3 completely aligned