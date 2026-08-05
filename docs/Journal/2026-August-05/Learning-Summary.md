# Learning Summary

**Date:** 05 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Topic:** Enterprise Backend Architecture, Parent–Child Relationships & Business Logic

---

# What I Learned Today

Today's learning was one of the most important milestones in my Software Engineering journey.

Instead of only creating CRUD APIs, I learned how real enterprise backend systems are designed using layered architecture, parent–child relationships, business rules, and clean object-oriented design.

The backend is no longer just a collection of APIs—it is now becoming a real ERP system.

---

# Key Learnings

## 1. Parent–Child Relationships in JPA

One of the biggest learnings was understanding how business relationships are represented in Java.

Instead of storing only the foreign key:

```java
private Integer labourId;
```

I learned to store the complete parent entity:

```java
@ManyToOne
@JoinColumn(name = "labour_id")
private Labour labour;
```

This allows Hibernate to automatically manage relationships between tables.

---

## 2. Business Objects Are More Important Than Database Keys

The database stores foreign keys.

Java should work with business objects.

For example:

Instead of thinking

```
Attendance has LabourID
```

I now think

```
Attendance belongs to Labour
```

This mindset makes the object model much closer to the real business.

---

## 3. Service Layer Owns Business Logic

A major realization was that business rules should never come from the frontend.

Example:

Attendance

Instead of sending

```
Daily Rate

Daily Amount
```

from Postman,

the backend now calculates them automatically.

Workflow:

```
Labour
      │
      ▼
Daily Rate
      │
      ▼
Daily Amount
```

The Service layer becomes the owner of business rules.

---

## 4. Controllers Should Remain Thin

I learned that Controllers are not responsible for business decisions.

Their responsibilities are limited to:

- Receive Request
- Validate Resource
- Call Service
- Return ResponseEntity

Everything else belongs to the Service layer.

---

## 5. Master Data Is the Single Source of Truth

Another important concept was avoiding duplicate business data.

Example:

Labour already stores

```
Daily Rate
```

Attendance should not allow the frontend to decide the Daily Rate.

Instead:

Attendance reads the value from Labour.

This ensures business consistency.

---

## 6. Parent–Child Relationships Will Repeat Everywhere

I realized that the same architecture pattern will appear throughout the ERP.

Examples:

```
Customer
      │
      ▼
Order

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

Once I understand one Parent–Child relationship, the rest become much easier.

---

## 7. DTOs Solve API Response Problems

While testing CRUD APIs, I observed that POST responses sometimes returned partially populated parent objects.

Example:

```
Supplier

Purchase

Raw Material
```

I learned that this is expected because the Entity only contains the foreign key reference.

Future DTO implementation will:

- Reduce response size
- Prevent recursive object graphs
- Improve frontend performance
- Improve API clarity

---

## 8. Entity Relationships Improve Readability

Instead of writing

```java
purchaseId

rawMaterialId
```

the Entity becomes

```java
private Purchase purchase;

private RawMaterial rawMaterial;
```

This makes the code easier to understand and closer to the business language.

---

## 9. CRUD Pattern Has Become Reusable

Every module now follows the same architecture.

```
Entity

↓

Repository

↓

Service

↓

Controller

↓

Postman

↓

PostgreSQL
```

This reusable pattern significantly speeds up development.

---

## 10. Documentation Is Part of Development

Every module now includes:

- CRUD APIs
- Lessons Learned
- Architecture Notes
- Business Rules
- PostgreSQL Validation

I realized that documentation is not an afterthought—it is an essential part of professional software engineering.

---

# Skills Improved

- Spring Boot
- Spring Data JPA
- Hibernate Relationships
- @ManyToOne Mapping
- Layered Architecture
- Repository Pattern
- Service Layer Design
- REST API Design
- CRUD Development
- PostgreSQL Validation
- Business Rule Implementation

---

# Challenges Faced

- Understanding Parent–Child relationships for the first time.
- Deciding where business rules should be implemented.
- Understanding why POST responses contained partially populated parent objects.
- Understanding the difference between Entity design and future DTO design.

---

# How I Solved Them

- Studied the business workflow before writing code.
- Implemented relationships using JPA instead of integer foreign keys.
- Shifted business calculations into the Service layer.
- Validated every CRUD operation using both Postman and pgAdmin.
- Documented every architectural lesson immediately after implementation.

---

# Biggest Takeaway

Building enterprise software is not about creating CRUD APIs.

It is about modeling real business relationships and placing business rules in the correct architectural layer.

Once the architecture is correct, adding new modules becomes predictable and much easier.

---

# Next Learning Goals

- Inventory Module
- Production Module
- Sales Module
- DTO Layer
- Exception Handling
- Validation
- Frontend Integration
- Authentication
- Reporting & Dashboard

---

# One-Line Learning

**Real enterprise software is built by modeling business relationships, not by passing IDs between tables.**

---

**Learning Summary Prepared By**

**Harish Kamat**

with ChatGPT