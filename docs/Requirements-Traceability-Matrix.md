# SKCP Requirements Traceability Matrix (RTM)

## Purpose

The Requirements Traceability Matrix (RTM) ensures that every business requirement can be traced throughout the Software Development Life Cycle (SDLC).

Each requirement should eventually map to:

Business Requirement

↓

Business Rule

↓

Business Object

↓

Database Table

↓

Backend API

↓

Frontend Screen

↓

Test Case

↓

Deployment

This guarantees that no requirement is forgotten during development.

---

# Requirements Traceability Matrix

| Requirement ID | Business Requirement | Business Object | Database Table | Backend API | Frontend Screen | Test Case | Status |
|----------------|----------------------|-----------------|----------------|-------------|-----------------|-----------|--------|
| BR-001 | Manage Customers | Customer | Customer | Pending | Pending | Pending | ✅ Database Designed |
| BR-002 | Manage Products | Product | Product | Pending | Pending | Pending | ✅ Database Designed |
| BR-003 | Manage Inventory | Inventory | Inventory | Pending | Pending | Pending | ✅ Database Designed |
| BR-004 | Create Customer Orders | Order | Order | Pending | Pending | Pending | ✅ Database Designed |
| BR-005 | Support Multiple Products in One Order | Order Item | Order Item | Pending | Pending | Pending | ✅ Database Designed |
| BR-006 | Track Customer Payments | Payment | Payment | Pending | Pending | Pending | ✅ Database Designed |
| BR-007 | Manage Deliveries | Delivery | Delivery | Pending | Pending | Pending | ⏳ Planned |
| BR-008 | Track Production | Production | Production | Pending | Pending | Pending | ⏳ Planned |
| BR-009 | Manage Suppliers | Supplier | Supplier | Pending | Pending | Pending | ⏳ Planned |
| BR-010 | Manage Raw Materials | Raw Material | Raw Material | Pending | Pending | Pending | ⏳ Planned |
| BR-011 | Manage Labour | Labour | Labour | Pending | Pending | Pending | ⏳ Planned |
| BR-012 | Manage Machines | Machine | Machine | Pending | Pending | Pending | ⏳ Planned |
| BR-013 | Generate Reports | Reports | Multiple Tables | Pending | Pending | Pending | ⏳ Planned |
| BR-014 | AI Decision Support | AI | Multiple Tables | Future | Future | Future | ⏳ Future Module |

---

# Module Progress Mapping

## ✅ Module 1 – Business Analysis

Completed

- Business Requirements
- Functional Requirements
- Non-Functional Requirements
- Business Rules
- Business Principles
- Business Objects
- Business Workflows
- Business Dictionary

---

## ✅ Module 2 – Software Architecture

Completed

- Business-First Architecture
- System Architecture
- Architecture Principles
- Architecture Decisions (ADR)
- Future Scalability Planning

---

## 🚧 Module 3 – Database Design

Completed

- Database Fundamentals
- Business Objects → Entities
- Entity Attributes
- Primary Keys
- Foreign Keys
- Relationships
- Normalization
- Data Ownership
- Master Data vs Transaction Data

Database Tables Designed

- Customer
- Product
- Inventory
- Order
- Order Item
- Payment

Remaining Database Tables

- Delivery
- Production
- Supplier
- Raw Material
- Labour
- Machine

---

## ⏭️ Module 4 – Backend Development

This module will map every database table to REST APIs.

Example

Customer Table

↓

Customer Entity

↓

Customer Repository

↓

Customer Service

↓

Customer Controller

↓

Customer API

---

## ⏭️ Module 5 – Frontend Development

Each business module will consume the corresponding backend APIs.

Example

Customer API

↓

Customer Management Screen

---

## ⏭️ Module 6 – AI Integration

The AI engine will use business data from:

- Customer
- Product
- Inventory
- Order
- Payment
- Production
- Delivery

to generate:

- Insights
- Recommendations
- Business Decisions

---

## ⏭️ Module 7 – Deployment & Production

Final deployment will ensure every traced requirement is:

- Implemented
- Tested
- Deployed
- Operational

---

# Traceability Philosophy

Every business requirement should be traceable from the original business need to the final deployed feature.

Business Requirement

↓

Business Rule

↓

Business Object

↓

Database

↓

Backend

↓

Frontend

↓

Testing

↓

Deployment

No requirement should ever be lost during development.

---

# Current Project Status

| Module | Status |
|---------|--------|
| Module 0 – Environment Setup | ✅ Completed |
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Database Design | 🚧 Approximately 90% Complete |
| Module 4 – Backend Development | ⏳ Planned |
| Module 5 – Frontend Development | ⏳ Planned |
| Module 6 – AI Integration | ⏳ Planned |
| Module 7 – Deployment & Production | ⏳ Planned |

---

## One-Line Memory

A Requirement Traceability Matrix ensures that every business requirement can be followed from business analysis all the way to the deployed software, ensuring nothing is forgotten during development.