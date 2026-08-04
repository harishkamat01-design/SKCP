# Daily Journal

**Date:** 04 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Status:** Supplier CRUD Module Completed ✅

---

# Objective

Continue backend development by implementing the complete Supplier CRUD module while improving both Customer and Supplier modules using production-ready REST API practices.

The goal was to establish a reusable backend architecture that can be followed for every remaining business module.

---

# Work Completed Today

## 1. Completed Supplier CRUD Module

Successfully implemented all Supplier REST APIs.

Completed endpoints:

- POST Create Supplier
- GET All Suppliers
- GET Supplier By ID
- PUT Update Supplier
- DELETE Supplier

The Supplier module is now fully functional.

---

## 2. Implemented Layered Backend Architecture

Completed all layers for the Supplier module.

### Controller Layer

- SupplierController
- REST endpoint mappings
- HTTP status handling

### Service Layer

- SupplierService
- Business logic implementation
- CRUD operations

### Repository Layer

- SupplierRepository
- Spring Data JPA integration

### Entity Layer

- Supplier entity
- JPA annotations
- PostgreSQL table mapping

---

## 3. Upgraded Customer Module

Refactored the Customer module to match the Supplier implementation.

Improvements included:

- ResponseEntity
- HTTP Status Codes
- Better REST responses
- Immutable createdAt handling
- Cleaner Controller implementation

Customer and Supplier now follow the same architecture and coding standards.

---

## 4. Improved Supplier Entity Design

Implemented several production-quality improvements.

Completed:

- Default status initialized as "ACTIVE"
- Immutable createdAt field
- Automatic timestamp generation
- Defensive validation for status
- Improved lifecycle callback naming

These improvements make the entity more reliable and maintainable.

---

## 5. Verified PostgreSQL Integration

Validated complete synchronization between Spring Boot and PostgreSQL.

Verified:

- Supplier insertion
- Supplier retrieval
- Supplier update
- Supplier deletion

The Supplier module communicates correctly with the physical database.

---

## 6. API Testing Using Postman

Successfully tested every Supplier endpoint.

### Create Supplier

- Request validated
- Response validated
- Database record created

### Get All Suppliers

- Supplier list returned successfully

### Get Supplier By ID

- Individual supplier retrieval validated

### Update Supplier

Initially discovered that:

- createdAt became NULL during updates.

Root Cause:

Updating the incoming Supplier object directly replaced immutable fields.

Solution:

Implemented the Fetch → Modify → Save approach.

The existing Supplier is now loaded first, editable fields are updated, immutable fields are preserved, and the existing entity is saved back to PostgreSQL.

Result:

createdAt is now preserved correctly.

### Delete Supplier

- Created a temporary demo supplier
- Successfully deleted the demo record
- Preserved actual business data

### Invalid Delete

Tested deletion using a non-existing Supplier ID.

Verified:

- HTTP 404 Not Found returned correctly
- REST API behaves as expected for missing resources

---

## 7. Learned Production REST API Practices

Today's implementation introduced several enterprise-level backend practices.

Implemented:

- ResponseEntity
- Proper HTTP Status Codes
- 200 OK
- 201 Created
- 204 No Content
- 404 Not Found

These standards will now be reused throughout the project.

---

## 8. Backend Design Improvements

Documented several software engineering improvements including:

- Java-side default values
- Immutable audit fields
- Defensive programming
- Better lifecycle method naming
- Enterprise REST API responses
- Standard CRUD implementation pattern

These learnings have been added to the project documentation for future reference.

---

# Major Achievement

Today marks the completion of the second fully working backend business module.

The Supplier module now supports complete Create, Read, Update, and Delete operations using the same production-ready architecture established by the Customer module.

The project now has two reusable backend reference implementations that will significantly accelerate future module development.

---

# Reflection

Today's work reinforced an important software engineering lesson.

Building production-ready software is not only about implementing CRUD operations.

It is equally important to:

- Protect business data
- Preserve immutable audit information
- Return meaningful HTTP responses
- Write maintainable and reusable code

By upgrading both Customer and Supplier modules to follow the same standards, the backend architecture has become cleaner, more consistent, and easier to extend.

---

# End of Day Status

| Module | Status |
|---------|--------|
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Database Design | ✅ Completed |
| Module 4 – Backend Development | 🚧 Customer & Supplier Modules Completed |

---

# Tomorrow's Focus

Continue Module 4 by implementing:

- Product Entity
- Product Repository
- Product Service
- Product Controller
- Product CRUD APIs
- Product API Testing

Continue following the same architecture established by the Customer and Supplier modules.

---

**Journal Completed By**

Harish Kamat

with ChatGPT