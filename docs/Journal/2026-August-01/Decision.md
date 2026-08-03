# Decision Log

**Date:** 01 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Status:** PostgreSQL Physical Schema Development Started

---

# Decisions Made Today

## Decision 1 — Begin Physical Database Implementation

### Decision

Module 4 officially begins with the implementation of the PostgreSQL physical database schema.

### Reason

Module 3 (Logical Database Design) was completed and frozen.

The next logical step is to transform the approved logical design into an executable PostgreSQL database.

---

## Decision 2 — Create a Dedicated PostgreSQL Database

### Decision

A dedicated PostgreSQL database was created for the SKCP ERP system.

### Reason

Separating the project into its own database improves maintainability, security, and deployment readiness.

---

## Decision 3 — Use a Dedicated Schema

### Decision

All Version 1 business tables will be created inside a dedicated PostgreSQL schema.

### Reason

Using a schema provides logical separation of business objects and simplifies future database administration.

---

## Decision 4 — Implement All Version 1 Tables First

### Decision

All **19 Version 1 database tables** were created before starting backend coding.

### Reason

Completing the database structure first ensures that backend development is built on a stable and validated foundation.

---

## Decision 5 — Preserve the Logical Database Design

### Decision

The PostgreSQL implementation must exactly match the approved Module 3 logical database design.

### Reason

This guarantees consistency between:

- Business Analysis
- Software Architecture
- Database Design
- Backend Development

---

## Decision 6 — Implement Primary Keys During Table Creation

### Decision

Every table includes its primary key as part of the initial SQL definition.

### Reason

Primary keys uniquely identify business records and are required for future JPA entity mapping.

---

## Decision 7 — Implement Foreign Keys in the Physical Schema

### Decision

Foreign key constraints were created according to the approved Entity Relationship Diagram.

### Reason

Foreign keys enforce business relationships and maintain referential integrity.

---

## Decision 8 — Apply Data Integrity Constraints Early

### Decision

NOT NULL and other required constraints were included while creating the tables.

### Reason

Applying constraints during schema creation prevents invalid business data from entering the system.

---

## Decision 9 — Keep SQL Scripts Modular

### Decision

The PostgreSQL schema is organized into reusable SQL scripts instead of one large script.

### Reason

Modular SQL files improve readability, maintenance, testing, and future enhancements.

---

## Decision 10 — Prepare for Spring Boot Integration

### Decision

The PostgreSQL schema has been designed to integrate directly with Spring Boot, Spring Data JPA, and Hibernate.

### Reason

This minimizes future changes when creating:

- Entity Classes
- Repository Layer
- Service Layer
- REST APIs

---

# Summary

Today's work successfully transformed the approved logical database architecture into a physical PostgreSQL implementation.

Major achievements include:

- PostgreSQL Database Created
- Project Schema Created
- All 19 Version 1 Tables Implemented
- Primary Keys Defined
- Foreign Keys Applied
- Data Integrity Constraints Added

This completes the first implementation milestone of Module 4 and provides the foundation for backend development.

---

**Decision Recorded By**

Harish Kamat

with ChatGPT