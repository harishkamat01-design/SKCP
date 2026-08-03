# 01 – System Architecture

# Project

**SKCP ERP System**

Shree Kundodari Cement Products

---

# Module

Module 2 – Software Architecture

(Updated after Module 3 Completion)

---

# Document

System Architecture

---

# Version

3.0

---

# Status

✅ Approved

✅ Module 3 Completed

---

# Author

Harish Kamat

---

# Last Updated

31 July 2026

---

# Purpose

This document describes the complete high-level architecture of the SKCP ERP System.

It serves as the foundation for:

- Database Design
- Backend Development
- Frontend Integration
- AI Features
- Future Scalability

---

# Project Overview

SKCP ERP is an Admin-only business management system designed for Shree Kundodari Cement Products.

The system digitizes the complete business workflow including:

- Procurement
- Production
- Inventory
- Sales
- Finance
- Reporting

The architecture is designed using a Business-First approach, ensuring every component directly supports real-world business operations.

---

# High-Level Architecture

```
                +----------------------+
                |      Admin User      |
                +----------+-----------+
                           |
                           |
                    React Frontend
                           |
                           |
                 REST API (Spring Boot)
                           |
                           |
               Business Service Layer
                           |
                           |
                  Spring Data JPA
                           |
                           |
                    PostgreSQL Database
```

---

# Architecture Layers

## Presentation Layer

Technology

- React
- HTML
- CSS
- JavaScript

Responsibilities

- Dashboard
- Data Entry
- Reports
- User Interaction
- Authentication Screens

---

## API Layer

Technology

- Spring Boot
- REST Controllers

Responsibilities

- Expose REST APIs
- Input Validation
- Authentication
- Authorization
- API Documentation

---

## Business Layer

Technology

- Spring Services

Responsibilities

- Business Rules
- Inventory Logic
- Payment Allocation
- Production Logic
- Sales Workflow
- Report Generation

---

## Data Access Layer

Technology

- Spring Data JPA
- Hibernate

Responsibilities

- CRUD Operations
- Entity Mapping
- Transactions
- Repository Layer

---

## Database Layer

Technology

- PostgreSQL

Responsibilities

- Data Persistence
- Relationship Management
- Constraints
- Referential Integrity

---

# Business Modules

## 1. Master Data

Stores permanent business information.

Tables

- Asset
- Customer
- Labour
- Product
- RawMaterial
- Supplier

---

## 2. Procurement

Manages purchasing of raw materials.

Tables

- Purchase
- PurchaseItem

---

## 3. Production

Manages daily manufacturing operations.

Tables

- Production
- Attendance

---

## 4. Inventory

Maintains current inventory positions.

Tables

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

---

## 5. Sales

Handles customer orders and deliveries.

Tables

- Order
- OrderItem
- Delivery
- DeliveryItem

---

## 6. Finance

Handles payments and allocations.

Tables

- Payment
- PaymentAllocation

---

# Database Overview

Database Engine

PostgreSQL

Database Name

skcp_db

Schema

skcp

Database Statistics

| Category | Count |
|----------|------:|
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| Total Tables | 19 |

---

# Relationship Overview

Relationship Statistics

| Relationship | Count |
|-------------|------:|
| One-to-One | 3 |
| One-to-Many | 16 |
| Total Relationships | 19 |

The database follows:

- Third Normal Form (3NF)
- Business-First Design
- Header–Detail Pattern
- Master–Transaction Separation
- Current Inventory Model

---

# System Workflow

```
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
Customer Order
      │
      ▼
Delivery
      │
      ▼
Payment
      │
      ▼
Payment Allocation
```

---

# Technology Stack

## Frontend

- React

---

## Backend

- Java 21
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate

---

## Database

- PostgreSQL

---

## Authentication

- JWT

---

## Deployment

Frontend

- Vercel

Backend

- Render / Railway / Docker (Future)

Database

- PostgreSQL

---

# Architecture Decision Records (ADR)

Major architecture decisions are documented separately.

Current ADRs

- ADR-DB-001 – Header–Detail Pattern
- ADR-DB-002 – Payment Allocation Bridge
- ADR-DB-003 – Current Inventory Model
- ADR-DB-004 – Master vs Transaction Separation

These ADRs preserve architectural reasoning and improve future maintainability.

---

# Design Principles

The SKCP architecture follows:

- Business-First Design
- Single Source of Truth
- Layered Architecture
- Separation of Concerns
- High Cohesion
- Low Coupling
- Database Normalization
- Future Scalability
- Clean Code Principles

---

# Current Progress

| Module | Status |
|---------|--------|
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Database Design | ✅ Completed |
| Module 4 – Backend Development | ⏳ Next |

---

# Next Phase

Module 4 – Backend Development

The completed architecture and PostgreSQL schema will now be implemented using:

- Spring Boot
- JPA
- Hibernate
- PostgreSQL
- REST APIs
- JWT Authentication

---

# Document Status

Version

3.0

Status

✅ Approved

Owner

Harish Kamat

Last Updated

31 July 2026