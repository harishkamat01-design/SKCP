# Architecture Summary

**Project:** SKCP – Shree Kundodari Cement Products

**Module:** Architecture Summary

**Version:** 2.0

**Status:** ✅ Module 3 Frozen

**Latest Updated:** 2026-07-31

**Last Updated:** 2026-07-26

---

# Purpose

This document provides the consolidated architectural overview of the SKCP ERP System.

It summarizes:

- Business Architecture
- Software Architecture
- Database Architecture
- Architecture Decision Records (ADR)
- Business Domains
- System Principles
- Long-Term Vision

This document serves as the master architecture reference for the entire SKCP project.

---

# What is SKCP?

SKCP (Shree Kundodari Cement Products) is an Admin-only ERP system developed to digitize the complete operations of a cement block manufacturing business.

The system supports:

- Procurement
- Production
- Inventory
- Sales
- Finance
- Reporting

The architecture mirrors the real-world business workflow instead of forcing the business to adapt to software.

---

# Architecture Philosophy

The SKCP architecture follows five guiding principles:

- Business First
- Simplicity Before Complexity
- Master–Transaction Separation
- Current Position + Historical Transactions
- AI-Ready Design

> Software should mirror the business, not force the business to mirror the software.

Every technical decision must support the actual factory operations.

---

# Architecture Layers

    Business
        ↓
    Business Workflow
        ↓
    Software Architecture
        ↓
    Database Architecture
        ↓
    Backend APIs
        ↓
    Frontend
        ↓
    AI Features

Business defines **WHY**.

System defines **WHAT**.

Application defines **HOW**.

---

# Core Business Domains

The SKCP ERP system is organized into six core business domains.

## 1. Master Data

Stores all permanent business entities.

- Customer
- Supplier
- Product
- Raw Material
- Labour
- Asset

---

## 2. Procurement

Manages raw material purchasing.

- Purchase
- Purchase Item

---

## 3. Production

Manages manufacturing activities.

- Production
- Attendance

---

## 4. Inventory

Tracks inventory throughout its lifecycle.

- Raw Material Stock
- Curing Stock
- Finished Goods Stock

---

## 5. Sales

Manages customer fulfilment.

- Order
- Order Item
- Delivery
- Delivery Item

---

## 6. Finance

Manages customer payments.

- Payment
- Payment Allocation

---

# Business Value Stream

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
      │
      ▼
Reports
      │
      ▼
Business Growth
---

# Information Flow

Customer Enquiry

↓

Quotation

↓

Order

↓

Stock Verification

↓

Production (If Required)

↓

Curing

↓

Finished Goods

↓

Delivery

↓

Payment

↓

Business Reports

↓

AI Insights (Future)

---

# Business Decision Layer

The ERP now supports these business decisions through validated business data:

- Current Inventory
- Pending Payments
- Production Capacity
- Customer History
- Delivery Status
- Labour Availability
- Machine Utilization       
- Payment Confidence

Only after successful evaluation does the order become a confirmed business commitment.

---

# Business Rules

Examples include:

- Every Production belongs to one Product.
- Every Production uses one Asset.
- Every Production creates one Curing Batch.
- One Product maintains one Finished Goods Stock.
- One Raw Material maintains one Current Stock.
- Products must complete curing before sale.
- Finished Goods reduce immediately after delivery.
- Customer payments are allocated through Payment Allocation.
- Historical transactions are never modified.
- Current Inventory is maintained separately from transaction history.

---

# Business Principles

- Business First
- Single Source of Truth
- Third Normal Form (3NF)
- Master–Transaction Separation
- Current Inventory Model
- Auditability
- Future AI Ready

---

# Decision Support Vision

The future vision of SKCP is to assist business decisions.

Information

↓

Reports

↓

Insights

↓

Recommendations

↓

Business Decisions

Examples:

- Production Suggestions
- Inventory Alerts
- Payment Collection Priorities
- Purchase Reminders
- Maintenance Scheduling


Future AI modules will support:

- Production Forecasting
- Inventory Forecasting
- Payment Prediction
- Purchase Planning
- Labour Analytics
- Machine Utilization Analysis

---

# Scalability

The architecture is designed to support future growth, including:

- Multiple production machines
- Multiple moulds
- Multiple factory locations
- Additional products
- More suppliers
- More labour
- Higher order volumes
- Machine maintenance management
- AI-assisted production planning
- AI payment reminders
- Predictive inventory management


The architecture supports future expansion including:

- Multiple Factories
- Multiple Warehouses
- Multiple Products
- Multiple Production Machines
- GST Integration
- Invoice Management
- Mobile Application
- AI Decision Support

while preserving the same business rules and architectural principles.

---

## Module 1

✅ Business Analysis Completed

## Module 2

✅ Software Architecture Completed

## Module 3

✅ Database Design Completed

Completed Deliverables

- Database Data Dictionary
- Database Master Index
- Naming Standards
- Relationship Summary
- Master ER Diagram
- PostgreSQL Physical Schema
- Architecture Decision Records
- 19 Tables
- 19 Validated Relationships

Next Module

➡ Module 4 – Backend Development

Technology

- Spring Boot
- PostgreSQL
- Spring Data JPA
- Hibernate
- REST APIs
- JWT Authentication
---

# One-Line Memory

Good architecture begins by understanding the business and ends by enabling the business to grow.
---

# Module Completion Summary

Module 2 established the architectural foundation of SKCP.

The business has been analyzed, workflows documented, principles defined, and the overall system architecture completed.

This architecture will serve as the blueprint for all future modules, beginning with Module 3 – Database Design.

The logical architecture of SKCP is now complete.

The next milestone is implementing the PostgreSQL physical database schema, after which development will move into Module 4 — Backend Development using Spring Boot, PostgreSQL, Spring Data JPA, and REST APIs.

---

# Architecture Evolution

The architecture has evolved through three major phases.

### Phase 1 — Business Understanding

The real business workflow was documented before any technical design began.

### Phase 2 — Software Architecture

Business workflows were converted into a modular software architecture following a Business-First philosophy.

### Phase 3 — Database Architecture

The finalized database architecture contains:

- 19 Database Tables
- 19 Validated Relationships
- 3 One-to-One Relationships
- 16 One-to-Many Relationships

The architecture follows:

- Third Normal Form (3NF)
- Business First
- Master–Transaction Separation
- Current Inventory Model
- Header–Detail Pattern
- Payment Allocation Bridge Pattern
---

# Current Documentation Snapshot

### Business Documentation

- Business Analysis
- Business Workflow
- Business Rules
- Business Principles

### Architecture Documentation

- System Architecture
- Architecture Principles
- Architecture Summary
- Architecture Roadmap
- ADR Documents

### Database Documentation

- Database Master Index
- Database Data Dictionary
- Database Naming Standards
- Database Relationship Summary
- Master Entity Relationship Diagram
- PostgreSQL Schema
- ADR Documents

---

# Current Project Status

| Module | Status |
|---------|--------|
| Module 0 – Environment Setup | ✅ Completed |
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Database Design | 🟢 Logical Design Completed (Physical Schema Pending) |
| Module 4 – Backend Development | ⏳ Not Started |
| Module 5 – Frontend Integration | ⏳ Not Started |
| Module 6 – AI Features | ⏳ Not Started |
| Module 7 – Deployment | ⏳ Not Started |