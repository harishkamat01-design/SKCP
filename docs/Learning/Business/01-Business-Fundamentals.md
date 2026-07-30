# Business Fundamentals

## Definition

A business exists to create value for customers by providing products or services while generating sustainable profit.

---

## Why Business Understanding Matters?

Software should solve business problems, not just technical problems.

A developer who understands the business builds better software.

---

## Core Business Objectives

- Deliver value to customers
- Maintain product quality
- Build customer trust
- Generate sustainable profit
- Ensure business continuity
- Improve operational efficiency

---

## Business Components

Every business typically consists of:

- Customers
- Products
- Suppliers
- Operations
- Finance
- Inventory
- Employees
- Sales

---

## Business Value Stream

Every successful business follows a value stream.

Supplier

↓

Purchase

↓

Raw Material Stock

↓

Production Process

↓

Finished Goods Stock

↓

Customer Order

↓

Delivery

↓

Payment Collection

---

## Business vs Software

Business defines **what** should happen.

Software defines **how** it can happen efficiently.

---

## Key Principle

Always understand the business before designing the software.

---

---

# Business Thinking Developed During Module 3

Over the last four days, the understanding of the SKCP business has evolved from identifying business activities to understanding how those activities generate information.

The business is now viewed as a collection of events, responsibilities, and decisions rather than isolated records.

---

# A Business Exists Before Software

The business already operates successfully without software.

The purpose of software is not to change the business.

Its purpose is to:

- Support business operations
- Improve information flow
- Reduce repetitive work
- Preserve business knowledge
- Help the owner make better decisions

---

# Business Objects

Every business is made up of Business Objects.

Examples within SKCP include:

- Customer
- Product
- Supplier
- Inventory
- Labour
- Machine
- Order
- Payment
- Delivery
- Production

These business objects later become software entities.

---

# Business Responsibilities

Every business object has a clear responsibility.

Examples:

| Business Object | Responsibility |
|-----------------|----------------|
| Customer | Places orders and makes payments |
| Product | Defines the items sold by the factory |
| Order | Records a customer's purchase request |
| Order Item | Records products and quantities within an order |
| Payment | Records money received from customers |
| Inventory | Tracks available finished stock |

Understanding responsibilities makes software design much easier.

---

# Business Events

Businesses operate through events.

Examples:

- Customer places an Order
- Factory manufactures Products
- Customer makes a Payment
- Products are Delivered

Each event changes the state of the business.

These events later become transaction records within the software system.

---

# Master Information vs Daily Operations

Business information naturally falls into two categories.

## Master Information

Information that rarely changes.

Examples:

- Customer
- Product
- Supplier
- Machine
- Labour

---

## Daily Operations

Information generated every day.

Examples:

- Orders
- Order Items
- Payments
- Deliveries
- Production

Recognizing this distinction improves both business understanding and software design.

---

# Inventory Is Business Truth

In manufacturing systems, inventory represents the current truth of the factory.

SKCP has two important inventory states:

## Raw Material Stock

Represents available production inputs.

Example:

- Cement
- Sand
- Stone dust

---

## Finished Goods Stock

Represents products ready for customers.

Example:

- Solid Blocks

---

# Production Role

Production does not own inventory.

Production transforms inventory.

# Information Is a Business Asset

Products generate revenue.

Information generates better decisions.

The software should collect accurate business information so that it can later be transformed into meaningful reports and future AI recommendations.

---

# Business Before Technology

The correct sequence is:

Business

↓

Business Rules

↓

Business Processes

↓

Software Design

↓

Technology

Technology should always support the business rather than drive it.

---
# Business Ownership Principle

Every piece of business information must have a clear owner.

Examples:

| Business Information | Owner |
|----------------------|-------|
| Supplier relationship | Supplier |
| Purchase activity | Purchase |
| Raw material availability | Raw Material Stock |
| Manufacturing activity | Production |
| Finished goods availability | Finished Goods Stock |
| Customer commitment | Order |
| Money received | Payment |

---

A clear ownership model prevents incorrect database design.

Before creating a table, always ask:

"Who owns this information?"

---

# Business Rules Drive Software Design

Software should not invent business behavior.

Business rules should define:

- Valid operations
- Data relationships
- Calculations
- Restrictions
- Decision-making

Examples from SKCP:

- Pending payment should be calculated, not manually stored.
- Quality of curing is more important than production speed.
- Customer trust is more important than short-term profit.
- Transport cost is separate from product pricing.

---


# One-Line Memory

A successful software system begins by understanding how the business actually works before designing how the software will work.

## Architect Memory

Business understanding is the first database design activity.

Tables come later.

Understanding comes first.