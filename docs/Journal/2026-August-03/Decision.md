# Decision Log

**Date:** 03 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Status:** Customer CRUD Module Completed

---

# Decisions Made Today

## Decision 1 — Complete One Business Module End-to-End First

### Decision

The Customer module was completed fully before starting any other business modules.

### Reason

Completing one module end-to-end establishes a reusable development pattern for all future modules.

This reduces implementation mistakes and improves consistency across the project.

---

## Decision 2 — Follow Layered Spring Boot Architecture

### Decision

The Customer module follows the standard Spring Boot layered architecture.

Layers implemented:

- Controller
- Service
- Repository
- Entity

### Reason

Separating responsibilities improves maintainability, readability, scalability, and testing.

---

## Decision 3 — Complete Full CRUD Before Moving Forward

### Decision

All CRUD operations were implemented for the Customer module.

Completed APIs:

- POST Create Customer
- GET All Customers
- GET Customer By ID
- PUT Update Customer
- DELETE Customer

### Reason

A complete CRUD implementation validates the entire backend workflow before additional modules are developed.

---

## Decision 4 — Preserve Real Business Data During DELETE Testing

### Decision

DELETE API testing was performed using a temporary demo customer instead of deleting real business data.

### Reason

Business data should never be removed during API validation.

Temporary records provide a safe testing approach while protecting actual customer information.

---

## Decision 5 — Automate Customer Creation Timestamp

### Decision

The `createdAt` field is automatically populated using the JPA lifecycle callback (`@PrePersist`).

### Reason

Automatic timestamp generation ensures consistency and removes the need for manual timestamp handling.

---

## Decision 6 — Validate Every API Using Multiple Methods

### Decision

Every endpoint was tested using both:

- Postman
- Web Browser (GET endpoints)

### Reason

Testing through multiple tools increases confidence that APIs behave correctly under different clients.

---

## Decision 7 — Keep PostgreSQL as the Single Source of Truth

### Decision

Every API operation was verified directly against PostgreSQL.

Verified operations:

- Insert
- Read
- Update
- Delete

### Reason

Successful API responses alone are insufficient; database validation confirms actual data persistence and integrity.

---

## Decision 8 — Standardize Git Configuration

### Decision

Updated Git configuration files:

### Backend

- `.gitignore`
- `.gitattributes`

### Project Root

- `.gitignore`
- `.gitattributes`

### Reason

Standardizing Git settings prevents accidental commits of generated files and ensures consistent line endings across development environments.

---

## Decision 9 — Learn the Database Before Expanding Development

### Decision

Invested time in understanding PostgreSQL using pgAdmin before proceeding with additional backend modules.

### Reason

Understanding the physical database structure improves debugging, data validation, and future development efficiency.

---

## Decision 10 — Reuse the Customer Module as the Backend Template

### Decision

The completed Customer module will serve as the reference implementation for future business modules.

Upcoming modules will follow the same architecture:

- Product
- Supplier
- Inventory
- Orders
- Payments
- Production

### Reason

Using a proven template accelerates development while maintaining consistency across the backend.

---

# Summary

Today's work successfully completed the first fully functional backend business module.

Major achievements include:

- Customer CRUD Completed
- Layered Spring Boot Architecture Implemented
- PostgreSQL Integration Validated
- REST APIs Fully Tested
- Automatic Timestamp Handling Added
- Git Configuration Standardized
- Safe DELETE Testing Strategy Established

The Customer module now serves as the reference architecture for all future backend development.

---

**Decision Recorded By**

Harish Kamat

with ChatGPT