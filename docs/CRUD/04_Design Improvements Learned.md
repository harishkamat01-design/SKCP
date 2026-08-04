# Design Improvements Learned Today

**Date:** 02 August 2026

## Module 4 – Backend Development

Today I completed the complete Supplier CRUD module and, more importantly, learned several enterprise software engineering practices that will be reused throughout the SKCP project.

---

# 1. Consistency Across Modules

Initially, the Customer module and Supplier module had different structures.

Instead of maintaining different coding styles, I standardized both modules.

Now both follow the same architecture:

```
Entity
    ↓
Repository
    ↓
Service
    ↓
Controller
```

### Lesson Learned

Consistency is more important than writing code quickly.

A consistent project is easier to maintain, debug, and extend.

---

# 2. Production-Ready Update Pattern

Originally, the update API simply saved the incoming object.

```
Request Body
      ↓
Repository.save()
```

This caused immutable fields like `createdAt` to become `null`.

The improved approach is:

```
Fetch Existing Record
        ↓
Update Editable Fields Only
        ↓
Save Existing Entity
```

Example:

```java
Customer existingCustomer = customerService.getCustomerById(id);

existingCustomer.setCustomerName(customer.getCustomerName());
// Update remaining editable fields

customerService.saveCustomer(existingCustomer);
```

### Lesson Learned

Never overwrite an entire entity during updates.

Only update the fields that are allowed to change.

This preserves:

- Primary Keys
- Audit Fields
- Creation Timestamp
- Future Version Numbers

---

# 3. Immutable Audit Fields

The `createdAt` field should never change after the record is created.

Using:

```java
@Column(updatable = false)
private LocalDateTime createdAt;
```

combined with the production update pattern ensures the original creation timestamp is preserved.

### Lesson Learned

Audit fields represent historical information and should remain immutable.

---

# 4. Proper REST API Status Codes

I implemented proper HTTP status codes for every CRUD operation.

| Operation | Status Code |
|-----------|------------:|
| GET | 200 OK |
| POST | 201 Created |
| PUT | 200 OK |
| DELETE | 204 No Content |
| Invalid ID | 404 Not Found |

### Lesson Learned

HTTP status codes communicate the result of an API operation clearly and consistently.

---

# 5. DELETE Response Behavior

For successful deletion:

```
204 No Content
```

with an empty response body.

For an invalid supplier ID:

```
404 Not Found
```

also with an empty response body.

Current implementation:

```java
return ResponseEntity.notFound().build();
```

### Lesson Learned

An empty response body is completely acceptable in REST APIs.

More detailed JSON error responses are typically added later using Global Exception Handling.

---

# 6. ResponseEntity Usage

Instead of returning plain Java objects, the controllers now return:

```java
ResponseEntity<T>
```

Benefits:

- Explicit HTTP status codes
- Better API design
- Enterprise-standard implementation
- Easier future enhancements

### Lesson Learned

ResponseEntity gives complete control over HTTP responses.

---

# 7. Reusable CRUD Architecture

The Supplier module became the blueprint for all future master modules.

The same implementation pattern will now be reused for:

- Product
- Labour
- Asset
- Raw Material
- Customer (already upgraded)
- Future master entities

### Lesson Learned

Good software engineering creates reusable patterns instead of solving the same problem repeatedly.

---

# Overall Learning

Today's work demonstrated that enterprise backend development is not only about making CRUD operations work.

It is about:

- Writing consistent code
- Preserving business data
- Protecting immutable fields
- Following REST standards
- Building reusable architecture
- Preparing the codebase for future scalability

These small design decisions significantly improve long-term maintainability and software quality.

---

# Key Takeaway

> **"Enterprise software is not built by writing more code—it is built by writing code that remains correct, consistent, and maintainable as the project grows."**