# SKCP System Architecture

## 1. Document Header

| Field | Value |
|--------|-------|
| Project | SKCP – Shree Kundodari Cement Products |
| Document | System Architecture |
| Version | 1.0 |
| Status | Draft |
| Author | Harish Kamat |
| Reviewer | Architect |
| Created On | 2026-07-24 |
| Last Updated | 2026-07-24 |

## 2. Purpose

To define the overall architecture of the SKCP Management System and ensure that the software is scalable, maintainable, and aligned with the business needs of Shree Kundodari Cement Products.

## 3. Scope

This document covers the high-level software architecture for the SKCP Management System.

It includes:

- Frontend application
- Backend services
- Database
- AI components
- External integrations
- High-level communication between modules

Detailed database schemas and API specifications are covered in separate architecture documents.

## 4. High-Level Components
| Component | Responsibility |
|------------|----------------|
| Frontend | User Interface for Admin and Customers |
| Backend | Business Logic, APIs and Authentication |
| Database | Stores Customers, Orders, Products and Payments |
| AI Engine | Business Insights, Stock Prediction and Pending Payment Analysis |
| External Services | Vercel, PostgreSQL, Authentication, Email, WhatsApp (future) |

## 5. Primary Users

| User | Responsibilities |
|------|------------------|
| Admin | Manage products, customers, orders, stock and reports |
| Customer | View quotations, orders and payment status |
| Transport Provider | Receive delivery information (Future) |




## Review Checklist

- [x] Purpose defined
- [x] Scope defined
- [x] Components identified
- [ ] Reviewed after Module 2
- [ ] Approved for implementation