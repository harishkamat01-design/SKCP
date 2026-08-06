# Decision Log

**Date:** 06 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Spring Boot Backend Development

**Status:** ✅ Module 4 Completed

---

# Decisions Made Today

---

## Decision 1 — Module 4 Officially Completed

### Decision

Module 4 is officially considered complete after implementing all planned Version 1 backend business modules.

### Reason

The backend now contains all business domains required for Version 1.

Completed:

- Master Data
- Procurement
- Production
- Inventory
- Sales
- Finance

No additional business entities remain for Version 1.

---

## Decision 2 — Freeze Backend Architecture

### Decision

The Spring Boot backend architecture is now frozen.

Every module follows:

```
Database
      ↓
Entity
      ↓
Repository
      ↓
Service
      ↓
Controller
      ↓
REST API
```

### Reason

Maintaining one consistent architecture across all modules improves maintainability and future enhancements.

---

## Decision 3 — Freeze Entity Design

### Decision

No further structural modifications will be made to Entity classes before introducing DTOs.

### Reason

The entity model is now stable.

Changing entities during frontend development would create unnecessary rework.

Future enhancements will occur through DTOs instead.

---

## Decision 4 — Freeze Parent–Child Relationships

### Decision

All Parent–Child relationships are finalized.

Implemented relationships include:

```
Customer
        │
        ▼
Orders

Orders
        │
        ▼
Order Item

Orders
        │
        ▼
Delivery

Delivery
        │
        ▼
Delivery Item

Customer
        │
        ▼
Payment

Payment
        │
        ▼
Payment Allocation
        ▲
        │
Orders

Supplier
        │
        ▼
Purchase

Purchase
        │
        ▼
Purchase Item

Raw Material
        │
        ▼
Purchase Item

Labour
        │
        ▼
Attendance
```

### Reason

These relationships accurately represent the business workflow and will remain unchanged for Version 1.

---

## Decision 5 — Documentation is Mandatory for Every Module

### Decision

Every completed backend module must have dedicated technical documentation.

Each module documentation contains:

- Architect Review
- Business Explanation
- Database Explanation
- Entity Explanation
- Repository Explanation
- Service Explanation
- Controller Explanation
- CRUD APIs
- Design Decisions
- Future Enhancements
- Enterprise Observations

### Reason

Documentation preserves architectural knowledge and simplifies future maintenance.

---

## Decision 6 — Backend Refinement Before Frontend

### Decision

The next development phase will focus on backend refinement before starting React integration.

### Scope

- DTO Layer
- ModelMapper
- Response Models
- Validation
- Global Exception Handling
- Logging
- Swagger Documentation

### Reason

A refined backend produces cleaner APIs and simplifies frontend development.

---

## Decision 7 — DTOs Will Become the Public API Contract

### Decision

Frontend applications will communicate only through DTOs.

Entities will remain internal to the backend.

### Reason

Benefits include:

- Cleaner API responses
- Better security
- Reduced payload size
- Prevent recursive serialization
- Better versioning support

---

## Decision 8 — Introduce ModelMapper

### Decision

ModelMapper will be adopted for Entity ↔ DTO conversion.

### Reason

Avoids repetitive manual mapping and keeps Service classes cleaner.

Future pattern:

```
Request DTO
        ↓
ModelMapper
        ↓
Entity
        ↓
Repository

Repository
        ↓
Entity
        ↓
ModelMapper
        ↓
Response DTO
```

---

## Decision 9 — Standardize API Responses

### Decision

Future APIs will return Response DTOs instead of Entities.

Example:

Instead of

```java
return customer;
```

use

```java
return CustomerResponseDTO;
```

### Reason

Improves API consistency and protects internal entity structure.

---

## Decision 10 — Global Exception Handling

### Decision

Replace local exception handling with centralized exception management using `@ControllerAdvice`.

### Reason

Provides:

- Uniform error responses
- Cleaner controllers
- Easier maintenance
- Enterprise-grade API behavior

---

## Decision 11 — Validation Layer

### Decision

All request validation will use Jakarta Bean Validation annotations.

Examples:

```java
@NotBlank

@NotNull

@Positive

@Email
```

### Reason

Prevents invalid data from reaching the Service layer and improves API reliability.

---

## Decision 12 — Swagger API Documentation

### Decision

Swagger/OpenAPI documentation will be introduced after backend refinement.

### Reason

Provides:

- Interactive API documentation
- Easier testing
- Better developer experience
- Professional API specification

---

## Decision 13 — Frontend Starts Only After Backend Refinement

### Decision

React frontend integration begins only after the backend exposes stable DTO-based APIs.

### Reason

This minimizes frontend rework and ensures a stable integration layer.

---

# Summary

Today's decisions officially conclude Module 4 and define the roadmap for the next phase.

Major architectural decisions include:

- Module 4 frozen
- Backend architecture frozen
- Entity design frozen
- Parent–Child relationships frozen
- Documentation mandatory
- DTO-first API strategy
- ModelMapper adoption
- Standardized Response DTOs
- Global Exception Handling
- Validation framework
- Swagger integration
- Backend refinement before frontend

These decisions prepare the SKCP project for enterprise-quality backend APIs and seamless React frontend integration.

---

**Decision Recorded By**

**Harish Kamat**

with ChatGPT