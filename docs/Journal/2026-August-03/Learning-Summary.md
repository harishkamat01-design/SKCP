# Learning Summary

**Date:** 03 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Topic:** Spring Boot Backend Development – Customer CRUD

---

# What I Learned Today

Today was one of the biggest learning days of the project.

For the first time, I built a complete backend business module using Spring Boot, PostgreSQL, JPA, Hibernate, REST APIs, and Postman.

I learned how every layer of a backend application works together to process business data from the client to the database and back.

---

# Key Learnings

## 1. Spring Boot Layered Architecture

I learned that a professional Spring Boot application is divided into layers.

```
Client

↓

Controller

↓

Service

↓

Repository

↓

Hibernate / JPA

↓

PostgreSQL
```

Each layer has a single responsibility, making the application easier to maintain and scale.

---

## 2. Responsibilities of Each Layer

### Entity

Represents a database table.

Maps Java objects to PostgreSQL tables using JPA annotations.

---

### Repository

Responsible only for database access.

Uses Spring Data JPA to perform CRUD operations without writing SQL.

---

### Service

Contains business logic.

Acts as the bridge between Controller and Repository.

---

### Controller

Receives HTTP requests.

Calls the Service layer.

Returns JSON responses to the client.

---

## 3. JPA and Hibernate

I learned the difference between JPA and Hibernate.

- **JPA** is a specification (rules and interfaces).
- **Hibernate** is the implementation of JPA.

Hibernate converts Java objects into SQL statements automatically.

This allows developers to work with Java objects instead of writing SQL for every operation.

---

## 4. Complete CRUD Workflow

I implemented and tested the complete CRUD cycle.

- Create
- Read
- Update
- Delete

Understanding CRUD helped me see how business operations translate into backend APIs.

---

## 5. REST APIs

I learned how REST endpoints are created using Spring Boot annotations.

Examples:

- `@GetMapping`
- `@PostMapping`
- `@PutMapping`
- `@DeleteMapping`

Each endpoint represents a business operation.

---

## 6. Postman API Testing

I learned how to validate APIs independently of the frontend.

Using Postman, I tested:

- Request body
- Response body
- HTTP methods
- CRUD operations

This confirmed that the backend was functioning correctly before any frontend integration.

---

## 7. PostgreSQL Integration

I verified that every API operation correctly interacted with PostgreSQL.

Observed operations:

- Data insertion
- Data retrieval
- Data update
- Data deletion

This reinforced the understanding that PostgreSQL is the permanent data store while Spring Boot acts as the application layer.

---

## 8. Automatic Timestamp Generation

I learned how JPA lifecycle methods work.

Using `@PrePersist`, the `createdAt` field is automatically populated before saving a new customer.

This removes repetitive coding and improves data consistency.

---

## 9. Reading Error Messages

One important lesson was learning to debug backend errors.

Example:

```
created_at violates not-null constraint
```

Instead of guessing, I traced the problem back to the entity configuration and fixed it by implementing automatic timestamp handling.

This demonstrated the importance of reading error messages carefully rather than treating them as failures.

---

## 10. Repository Hygiene

I learned why `.gitignore` and `.gitattributes` are important.

They help:

- Keep repositories clean
- Prevent unnecessary files from being committed
- Standardize line endings across operating systems
- Improve collaboration

Professional software development includes repository management as part of engineering quality.

---

# Skills Improved

- Spring Boot
- REST API Development
- Spring Data JPA
- Hibernate
- PostgreSQL Integration
- Layered Architecture
- CRUD Development
- Postman Testing
- Debugging
- Git Repository Management

---

# Challenges Faced

- Understanding the relationship between Spring Boot, JPA, Hibernate, and PostgreSQL.
- Fixing the `created_at` NOT NULL constraint error.
- Understanding the purpose of each backend layer.
- Learning how API requests travel through the application.

---

# How I Solved Them

- Followed the layered architecture step by step.
- Used PostgreSQL to verify actual database changes.
- Used Postman to validate every endpoint independently.
- Carefully analyzed Spring Boot error messages before making changes.
- Updated the entity using `@PrePersist` for automatic timestamps.

---

# Biggest Takeaway

Today I realized that backend development is not simply writing APIs.

It is about designing a structured flow where every layer has a clear responsibility, allowing business requests to move safely and efficiently from the client to the database and back.

---

# Next Learning Goals

- Product CRUD Module
- Service Reusability
- Exception Handling
- Validation
- DTOs
- Global Exception Handler
- Pagination
- Searching
- Backend Best Practices

---

# One-Line Learning

**A well-designed backend is a chain of specialized layers working together, where each layer performs one responsibility and trusts the next layer to do its job.**

---

**Learning Summary Prepared By**

Harish Kamat

with ChatGPT