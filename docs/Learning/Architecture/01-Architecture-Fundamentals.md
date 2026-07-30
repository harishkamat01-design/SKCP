# Architecture Fundamentals

## Definition

System Architecture is the blueprint of a software system that defines its major components, responsibilities, and interactions.

## Why Architecture?

- Provides structure
- Improves scalability
- Enhances maintainability
- Increases security
- Improves performance
- Makes development easier

## Key Principle

Architecture decides **how** the system will be built before coding begins.
Design for today's requirements, but architect for tomorrow's growth.

---

# Architecture Thinking Developed During Module 2 & Module 3

Over the last four days, the understanding of software architecture evolved from generic system design concepts to business-driven architecture.

The following principles now guide the SKCP project.

---

# Architecture Begins with the Business

Software architecture should not begin with databases, APIs, or user interfaces.

It should begin with understanding:

- The business
- The business workflow
- The business rules
- The people using the system
- The decisions made every day

Only after understanding these should software components be designed.

Architecture Flow:

Business

↓

Business Rules

↓

Business Processes

↓

Data Ownership

↓

Normalization

↓

Database

↓

Backend APIs

↓

Frontend

↓

AI

---

# Business-First Architecture

The software should adapt to the business.

The business should never be forced to adapt to poorly designed software.

The SKCP architecture follows the real factory workflow rather than creating artificial software processes.

---

# Data Ownership

Every piece of business information must have exactly one owner.

Examples:

| Information | Owner |
|-------------|-------|
| Customer Name | Customer |
| Product Size | Product |
| Delivery Address | Order |
| Quantity Ordered | Order Item |
| Amount Paid | Payment |

This principle prevents duplicate data and simplifies future maintenance.

---

# Normalization as an Architectural Principle

Normalization is not only a database concept.

It is an architectural principle that ensures:

- One source of truth
- Elimination of duplicate information
- Clear ownership of data
- Easier scalability

Instead of asking:

"What column should I add?"

An architect asks:

- Who owns this information?
- Can it be calculated?
- Should it be stored?

---

# Master Data vs Transaction Data

A scalable architecture separates information into two categories.

## Master Data

Defines the business.

Examples:

- Customer
- Product
- Supplier
- Machine
- Labour

Master Data changes rarely.

---

## Transaction Data

Represents business events.

Examples:

- Order
- Order Item
- Payment
- Delivery
- Production

Transaction Data changes continuously.

---

# Business Events Drive the Architecture

Modern business systems are built around business events.

Examples:

Customer

↓

Places Order

↓

Order Contains Products

↓

Factory Produces Blocks

↓

Customer Makes Payment

↓

Products are Delivered

Each of these events becomes an independent transaction table.

This approach improves traceability and keeps the database normalized.

---

# Architectural Layers of SKCP

Business Layer

↓

Architecture Layer

↓

Database Layer

↓

Backend Layer

↓

Frontend Layer

↓

AI Layer

Each layer builds upon the previous one.

Skipping a layer creates technical debt.

---

# Software Architect Mindset

During Module 3, the thinking process changed significantly.

Earlier:

"What table should I create?"

Now:

- What business object am I modelling?
- What business event is occurring?
- Who owns this information?
- Can this value be calculated?
- Should this value be stored?

This shift represents the transition from learning database design to thinking like a software architect.

---

# Key Architectural Lessons

- Business drives architecture.
- Business Rules are permanent.
- Data Ownership determines table design.
- Normalization protects business truth.
- Master Data defines the business.
- Transaction Data records business events.
- Good architecture mirrors real business operations.
- Backend APIs and Frontend screens should always be built on top of a well-designed architecture.

---

# Updated One-Line Memory

Good architecture does not begin with code.

Good architecture begins with understanding the business.

## One-Line Memory

Good architecture makes coding easier.

# SKCP Architecture Learning

Architecture starts from:

Business

↓

Processes

↓

Responsibilities

↓

Data

↓

Technology


The architect does not start with frameworks.

The architect starts with understanding the business.