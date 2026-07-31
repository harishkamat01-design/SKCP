# SKCP System Architecture

---

# 1. Document Header

| Field | Value |
|--------|-------|
| Project | SKCP – Shree Kundodari Cement Products |
| Document | System Architecture |
| Version | 1.1 |
| Status | Draft |
| Author | Harish Kamat |
| Reviewer | Architect |
| Created On | 2026-07-24 |
| Last Updated | 2026-07-30 |

---

# 2. Purpose

To define the overall architecture of the **SKCP Management System** and ensure that the software is scalable, maintainable, and aligned with the business needs of **Shree Kundodari Cement Products**.

This document provides the high-level architectural blueprint that guides all implementation activities throughout the project lifecycle.

---

# 3. Scope

This document covers the overall software architecture for the SKCP Management System.

It includes:

- Frontend Application
- Backend Services
- Database Architecture
- AI Components
- External Integrations
- High-Level Communication between Modules

Detailed database schemas, API specifications, business rules, and implementation details are maintained in their respective architecture documents.

---

# 4. High-Level Components

| Component | Responsibility |
|------------|----------------|
| Frontend | User Interface for Admin |
| Backend | Business Logic, REST APIs, Authentication |
| Database | Stores all business data and relationships |
| AI Engine | Business Insights, Stock Prediction, Pending Payment Analysis (Future) |
| External Services | Vercel, PostgreSQL, Email, WhatsApp (Future) |

---

# 5. Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React |
| Backend | Spring Boot *(Planned)* |
| Database | PostgreSQL |
| AI | OpenAI APIs *(Future)* |
| Hosting | Vercel |
| Version Control | GitHub |

---

# 6. Primary Users

| User | Responsibilities |
|------|------------------|
| Admin | Manage raw materials, production, inventory, customers, sales, payments, reports and AI insights |
| Customer | View quotations, orders and payment status *(Future)* |
| Transport Provider | Receive delivery information *(Future)* |

---

# 7. High-Level Business Domains

The SKCP ERP system is organized into six core business domains.

| Domain | Description |
|---------|-------------|
| Master Data | Stores business master information |
| Procurement | Raw material purchasing process |
| Production | Manufacturing operations |
| Inventory | Stock management throughout production lifecycle |
| Sales | Customer orders and deliveries |
| Finance | Customer payments and outstanding balances |

---

# 8. High-Level System Flow

```text
Admin

↓

React Frontend

↓

Spring Boot Backend

↓

PostgreSQL Database

↓

AI Services (Future)
```

---

# 9. Current Architecture Status

| Module | Status |
|---------|--------|
| Module 0 – Environment Setup | ✅ Completed |
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Logical Database Design | 🟡 Final Review Pending |
| Module 4 – Backend Development | ⏳ Not Started |
| Module 5 – Frontend Integration | ⏳ Not Started |
| Module 6 – AI Features | ⏳ Not Started |
| Module 7 – Deployment | ⏳ Not Started |

---

# 10. Architecture Principles

The SKCP system is designed around the following principles:

- Business-first architecture
- Separation of concerns
- Single responsibility for every database table
- Current Position + Historical Transactions inventory model
- Scalable modular design
- Future AI readiness
- Minimal data duplication
- Maintainable and extensible architecture

---

# Review Checklist

- [x] Purpose defined
- [x] Scope defined
- [x] Components identified
- [x] Technology Stack documented
- [x] Business Domains identified
- [x] High-Level System Flow documented
- [ ] Reviewed after Module 3
- [ ] Approved for implementation