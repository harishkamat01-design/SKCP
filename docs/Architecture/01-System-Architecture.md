# SKCP System Architecture

---

# 1. Document Header

| Field | Value |
|--------|-------|
| Project | SKCP – Shree Kundodari Cement Products |
| Document | System Architecture |
| Version | 2.0 |
| Status | Approved |
| Author | Harish Kamat |
| Reviewer | Architect |
| Created On | 2026-07-24 |
| Last Updated | 2026-07-31 |

---

# 2. Purpose

To define the overall architecture of the **SKCP Management System** and ensure that the software is scalable, maintainable, and aligned with the business needs of **Shree Kundodari Cement Products**.

This document acts as the master architectural blueprint for the entire project and guides all future implementation activities.

---

# 3. Scope

This document defines the complete software architecture of the SKCP ERP system.

It includes:

- Business Architecture
- Software Architecture
- Database Architecture
- Backend Architecture
- Frontend Architecture
- AI Architecture
- Deployment Architecture
- External Integrations

Detailed implementation specifications are maintained in their respective documents.

---

# 4. System Overview

SKCP is designed as a Business-First Manufacturing ERP.

The architecture mirrors the real business workflow rather than technical layers.

Business

↓

Business Domains

↓

Database

↓

Backend APIs

↓

Frontend

↓

AI Decision Support

---

# 5. High-Level Components

| Component | Responsibility |
|------------|----------------|
| React Frontend | User Interface for Admin |
| Spring Boot Backend | Business Logic, Authentication, REST APIs |
| PostgreSQL Database | Stores business master data, transactions and inventory |
| AI Layer (Future) | Business insights, forecasting, decision support |
| External Services | Vercel, Neon PostgreSQL, Email, WhatsApp (Future) |

---

# 6. Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + Vite |
| Backend | Spring Boot |
| Database | PostgreSQL |
| ORM | Spring Data JPA |
| Authentication | JWT |
| AI | OpenAI APIs *(Future)* |
| Hosting | Vercel + Render |
| Database Hosting | Neon PostgreSQL |
| Version Control | GitHub |

---

# 7. Primary Users

| User | Responsibilities |
|------|------------------|
| Admin | Manage complete business operations |
| Customer *(Future)* | View quotations, orders and payment status |
| Transport Provider *(Future)* | Receive delivery details |

---

# 8. Business Domains

The entire ERP is organized into six core business domains.

| Domain | Description |
|---------|-------------|
| Master Data | Business master information |
| Procurement | Supplier purchases and raw materials |
| Production | Manufacturing operations |
| Inventory | Raw material, curing and finished goods stock |
| Sales | Orders and deliveries |
| Finance | Payments and outstanding balances |

---

# 9. High-Level System Architecture

```text
                    Admin

                      │

                      ▼

             React Frontend (Vite)

                      │

                REST API (HTTPS)

                      │

                      ▼

          Spring Boot Backend (Java)

                      │

         Business Services & Validation

                      │

                      ▼

            PostgreSQL Database

        (19 Business Tables / 19 Relationships)

                      │

        ┌─────────────┴─────────────┐

        ▼                           ▼

 Reports & Dashboard          AI Layer (Future)

                               │

                      Business Insights

                      Stock Forecasting

                      Payment Prediction

                      Demand Forecast
```

---

# 10. Database Architecture

The database follows a Business-First normalized design.

### Current Statistics

| Item | Count |
|------|------:|
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| Total Tables | **19** |
| Validated Relationships | **19** |

Database artifacts completed:

- Database Data Dictionary
- Database Naming Standards
- Database Relationship Summary
- Master ER Diagram
- Architecture Decision Records (ADR)

---

# 11. Architecture Principles

The SKCP system follows these principles:

- Business-First Design
- Architecture-First Development
- Separation of Concerns
- Single Responsibility Principle
- Master–Transaction Separation
- Current Position + Historical Transactions Inventory Model
- Header–Detail Pattern
- Database Normalization
- Low Coupling
- High Cohesion
- AI-Ready Architecture
- Future Scalability

---

# 12. Current Project Status

| Module | Status |
|---------|--------|
| Module 0 – Environment Setup | ✅ Completed |
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Database Design | ✅ Completed |
| Module 4 – Backend Development | 🚀 Next Phase |
| Module 5 – Frontend Integration | ⏳ Planned |
| Module 6 – AI Features | ⏳ Planned |
| Module 7 – Deployment | ⏳ Planned |

---

# 13. Next Phase

With the completion of Module 3, the project is now ready to begin:

## Phase 5 – PostgreSQL Physical Database Schema

Followed by

## Module 4 – Backend Development

Planned deliverables:

- PostgreSQL Physical Schema
- Spring Boot Project Setup
- JPA Entity Classes
- Repository Layer
- Service Layer
- REST APIs
- Authentication
- Database Integration

---

# Review Checklist

- [x] Purpose defined
- [x] Scope defined
- [x] System Overview completed
- [x] High-Level Components identified
- [x] Technology Stack documented
- [x] Business Domains finalized
- [x] High-Level Architecture completed
- [x] Database Architecture documented
- [x] Architecture Principles finalized
- [x] Module 3 completed
- [ ] Backend implementation review pending
- [ ] Final architecture approval