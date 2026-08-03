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
| BR-001 | Manage Customers | Customer | Customer | ✅ CRUD Completed | ⏳ Planned | ✅ API Tested | ✅ Implemented |
| BR-002 | Manage Products | Product | Product | ⏳ Planned | ⏳ Planned | ⏳ Planned | ✅ Designed |
| BR-003 | Manage Inventory | Inventory | Inventory | ⏳ Planned | ⏳ Planned | ⏳ Planned | ✅ Designed |
| BR-004 | Create Customer Orders | Order | Order | ⏳ Planned | ⏳ Planned | ⏳ Planned | ✅ Designed |
| BR-005 | Multiple Products per Order | Order Item | Order Item | ⏳ Planned | ⏳ Planned | ⏳ Planned | ✅ Designed |
| BR-006 | Track Customer Payments | Payment | Payment | ⏳ Planned | ⏳ Planned | ⏳ Planned | ✅ Designed |
| BR-007 | Manage Deliveries | Delivery | Delivery | ⏳ Planned | ⏳ Planned | ⏳ Planned | ⏳ Pending Design |
| BR-008 | Track Production | Production | Production | ⏳ Planned | ⏳ Planned | ⏳ Planned | ⏳ Pending Design |
| BR-009 | Manage Suppliers | Supplier | Supplier | ⏳ Planned | ⏳ Planned | ⏳ Planned | ⏳ Pending Design |
| BR-010 | Manage Raw Materials | Raw Material | Raw Material | ⏳ Planned | ⏳ Planned | ⏳ Planned | ⏳ Pending Design |
| BR-011 | Manage Labour | Labour | Labour | ⏳ Planned | ⏳ Planned | ⏳ Planned | ⏳ Pending Design |
| BR-012 | Manage Machines | Machine | Machine | ⏳ Planned | ⏳ Planned | ⏳ Planned | ⏳ Pending Design |
| BR-013 | Business Reports | Multiple | Multiple | ⏳ Planned | ⏳ Planned | ⏳ Planned | ⏳ Future |
| BR-014 | AI Decision Support | Multiple | Multiple | ⏳ Future | ⏳ Future | ⏳ Future | ⏳ Module 6 |
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

### Database Foundation Completed

- Business Objects vs Database Entities
- Master Data vs Transaction Data
- Primary Keys
- Foreign Keys
- One-to-Many Relationships
- Many-to-Many Relationships
- Junction Tables
- Data Ownership
- Database Normalization
- Business Rules
- Business Principles
- Business Workflows
- Database Learning Repository

### Database Tables Designed

- Customer
- Product
- Inventory
- Order
- Order Item
- Payment

### Remaining Tables

- Supplier
- Purchase
- Purchase Item
- Raw Material
- Production
- Labour
- Machine

### Remaining Module Work

- Complete ER Diagram
- PostgreSQL Physical Database Design
- Final Database Review

---

## 🚧 Module 4 – Backend Development

### Backend Foundation Completed

Implemented the first production-ready backend module using Spring Boot.

### Customer Module Completed

Implemented complete CRUD operations.

#### APIs Completed

- POST Create Customer
- GET All Customers
- GET Customer By ID
- PUT Update Customer
- DELETE Customer

### Backend Architecture Implemented

- Customer Entity
- Customer Repository
- Customer Service
- Customer Controller

### Features Implemented

- JPA Entity Mapping
- Repository Pattern
- Service Layer
- REST Controller
- Auto-generated Primary Key
- createdAt timestamp
- Entity lifecycle using `@PrePersist`

### Testing Completed

Verified using Postman:

- Create Customer
- Read Customer
- Update Customer
- Delete Customer

### Database Validation

Verified with PostgreSQL:

- Customer table
- Data persistence
- CRUD synchronization
- Timestamp generation

### Next Module

Product Management CRUD

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

## Current Traceability Coverage

| Layer | Status |
|--------|--------|
| Business Analysis | ✅ |
| Software Architecture | ✅ |
| Database Design | 🚧 |
| Customer Backend CRUD | ✅ |
| Frontend | ⏳ |
| AI | ⏳ |
| Deployment | ⏳ |

---

## Current Project Status

| Module | Status |
|---------|--------|
| Module 0 – Environment Setup | ✅ Completed |
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Database Design | 🚧 90% Complete (Core Database Completed) |
| Module 4 – Backend Development | 🚧 Customer CRUD Completed |
| Module 5 – Frontend Development | ⏳ Planned |
| Module 6 – AI Integration | ⏳ Planned |
| Module 7 – Deployment & Production | ⏳ Planned |

---

## One-Line Memory

Every business requirement must remain traceable from business analysis through architecture, database design, backend implementation, frontend development, testing, and deployment so that no requirement is ever lost during the software development lifecycle.