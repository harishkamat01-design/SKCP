# Architecture Summary

**Project:** SKCP – Shree Kundodari Cement Products

**Module:** 2 – Software Architecture

**Version:** 1.2

**Status:** Updated

**Latest Updated:** 2026-07-31

**Last Updated:** 2026-07-26

**Status:** Completed

---

# Purpose

This document provides a consolidated architectural overview of the SKCP Management System.

It summarizes:

- Business Understanding
- Software Architecture
- Database Architecture
- Architectural Decisions
- Business Domains
- Long-Term Vision

This document evolves throughout the project and serves as the central architectural reference.

---

# What is SKCP?

SKCP is an Admin-only Business Management System developed for Shree Kundodari Cement Products.

Its purpose is to digitally manage and optimize the complete operation of the cement block manufacturing business while preserving the founder's years of business knowledge.

The system is designed around the real business workflow instead of forcing the business to adapt to software.

---

# Architecture Philosophy

The architecture follows a **Business-First** approach.

### Guiding Principle

> Software should mirror the business, not force the business to mirror the software.

Every technical decision must support the actual factory operations.

---

# Architecture Layers

Business

↓

System

↓

Application

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

↓

Raw Material Purchase

↓

Raw Material Stock

↓

Production

↓

Curing Yard

↓

Finished Goods (Sales Yard)

↓

Customer Order

↓

Delivery

↓

Payment

↓

Reports

↓

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

Before confirming any order, the business evaluates:

- Customer Trust
- Order Quantity
- Current Inventory
- Production Capacity
- Delivery Commitment
- Payment Confidence

Only after successful evaluation does the order become a confirmed business commitment.

---

# Business Rules

Examples include:

- Products must complete curing before sale.
- Finished goods reduce immediately after delivery.
- One customer can have multiple orders.
- One order can contain multiple products.
- One delivery can contain multiple products.
- Weekly labour salary is calculated from attendance.
- Production is associated with the machine used.
- Outstanding payment is calculated automatically.
- Quality is never compromised.

---

# Business Principles

- Business First
- Simplicity Before Complexity
- Quality Before Quantity
- Customer Trust
- Preserve Founder Knowledge
- Adapt to Business Constraints

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

while preserving the same business rules and architectural principles.

---

# Module Outcome

## Module 1

- Business Analysis Completed

## Module 2

- Software Architecture Completed

## Module 3

Completed:

- Logical Database Design
- Database Data Dictionary
- Database Naming Standards
- Database Relationship Summary
- Master Entity Relationship Diagram
- 19 Version 1 Database Tables
- 19 Validated Relationships
- Business Domains Documentation
- Architecture Decision Records (ADR)

Remaining:

- PostgreSQL Physical Database Schema

After completing the PostgreSQL schema, the project will begin:

**Module 4 – Backend Development (Spring Boot + PostgreSQL)**.
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

The business architecture has been transformed into a fully documented logical database architecture.

Completed deliverables include:

- Database Data Dictionary
- Database Master Index
- Database Naming Standards
- Database Relationship Summary
- Master Entity Relationship Diagram
- Architecture Decision Records (ADR)

The Version 1 database consists of:

- 19 Database Tables
- 6 Business Domains
- 19 Validated Relationships

The architecture follows:

- Business-First Design
- Normalized Relational Model
- Master–Transaction Separation
- Current Position + Historical Transactions Inventory Model
- Header–Detail Design Pattern

Only the PostgreSQL physical implementation remains before backend development begins.

---
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

### Remaining

- PostgreSQL Physical Database Schema

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