# Architecture Summary

**Project:** SKCP – Shree Kundodari Cement Products

**Module:** 2 – Software Architecture

**Version:** 1.0

**Status:** Completed

---

# Purpose

This document provides a high-level overview of the complete software architecture for SKCP.

It summarizes the business understanding, architectural decisions, system structure, and long-term vision established during Module 2.

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

The complete business is divided into three primary domains.

## Raw Materials

- Cement
- Sand
- Jelly
- Water
- Suppliers
- Purchase
- Stock

---

## Production

- Production Planning
- Machine
- Mould
- Labour
- Curing
- Inventory
- Quality

---

## Sales

- Customer
- Orders
- Dispatch
- Vehicle
- Receipt
- Payment
- Reports

---

# Business Value Stream

Supplier

↓

Raw Materials

↓

Production

↓

Curing

↓

Inventory

↓

Sales

↓

Dispatch

↓

Receipt

↓

Payment

↓

Business Growth

---

# Information Flow

Customer Enquiry

↓

Customer Details

↓

Requirement

↓

Business Evaluation

↓

Business Commitment

↓

Order Confirmation

↓

Stock Check

↓

Production Planning

↓

Dispatch Planning

↓

Receipt

↓

Payment

↓

Reports

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
- Inventory reduces only after dispatch.
- One receipt is generated for each delivery.
- Payments correspond to delivered quantity.
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

The architecture should support future growth including:

- Multiple production machines
- Multiple factory locations
- Additional products
- More suppliers
- More labour
- Higher order volumes

while preserving the same business rules and principles.

---

# Module Outcome

At the completion of Module 2:

- Business Architecture defined
- System Architecture established
- Core Business Domains identified
- Business Rules documented
- Business Principles documented
- Information Flow documented
- Decision Support vision established

The project is now ready to transition into **Module 3 – Database Design**.

---

# One-Line Memory

Good architecture begins by understanding the business and ends by enabling the business to grow.
---

# Module Completion Summary

Module 2 established the architectural foundation of SKCP.

The business has been analyzed, workflows documented, principles defined, and the overall system architecture completed.

This architecture will serve as the blueprint for all future modules, beginning with Module 3 – Database Design.

The next phase focuses on converting business objects into database entities while preserving the business-first philosophy established during Module 2.

---

# Architecture Evolution (2026-07-27 & 2026-07-28)

The architecture has evolved from identifying business entities to designing a normalized relational database.

The following architectural principles were applied while designing the database:

- Business Rules drive database design.
- Data Ownership determines where information belongs.
- Normalization eliminates duplicate information.
- Master Data and Transaction Data are separated.
- Transaction tables represent business events.
- Foreign Keys connect business entities while preserving normalization.
- Derived values are calculated rather than stored.

Core transactional entities designed:

- Order
- Order Item
- Payment

These entities establish the foundation for the upcoming PostgreSQL implementation and Backend API development.
