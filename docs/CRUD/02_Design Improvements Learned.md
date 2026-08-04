# Design Improvements Learned Today – REST Controller Best Practices

**Date:** 02 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Topic:** Production-Ready REST Controller Design

---

# Overview

Today I upgraded the `CustomerController` to follow enterprise REST API development practices instead of using a basic CRUD implementation.

Although the original controller worked correctly, I learned that production software should communicate clearly with API consumers by returning proper HTTP responses and handling errors gracefully.

---

# 1. Returning ResponseEntity

## Previous Approach

```java
public Customer createCustomer(...)
```

## Improved Approach

```java
public ResponseEntity<Customer> createCustomer(...)
```

### Why?

`ResponseEntity` allows complete control over the HTTP response, including:

- Response body
- HTTP Status Code
- HTTP Headers

Instead of returning only data, the API now returns meaningful HTTP responses.

### Lesson Learned

A REST API should return both the requested data and the correct HTTP status.

---

# 2. Using Proper HTTP Status Codes

Instead of always returning **200 OK**, different operations now return the most appropriate HTTP status.

| Operation | HTTP Status |
|-----------|-------------|
| Get Success | 200 OK |
| Create Success | 201 Created |
| Delete Success | 204 No Content |
| Resource Not Found | 404 Not Found |
| Invalid Request | 400 Bad Request |

### Why?

HTTP status codes help API consumers immediately understand the result of an operation.

### Lesson Learned

Correct status codes improve API usability and follow REST standards.

---

# 3. Handling Missing Resources

## Previous Approach

```java
return customerService.getCustomerById(id);
```

If the customer did not exist, the API returned `null`.

## Improved Approach

```java
if (customer == null) {
    return ResponseEntity.notFound().build();
}
```

### Why?

Returning **404 Not Found** is much clearer than returning `null`.

### Lesson Learned

APIs should communicate missing resources explicitly using HTTP status codes.

---

# 4. Returning 204 No Content for Delete

## Previous Approach

```java
public void deleteCustomer(...)
```

## Improved Approach

```java
return ResponseEntity.noContent().build();
```

### Why?

A successful delete operation usually returns:

```
204 No Content
```

This indicates that:

- The operation succeeded
- No response body is required

### Lesson Learned

REST APIs should follow standard HTTP semantics for delete operations.

---

# 5. Preparing for Exception Handling

The controller is now structured to easily support centralized exception handling using:

- `@ControllerAdvice`
- `@ExceptionHandler`

instead of placing `try-catch` blocks inside every controller method.

### Why?

Centralized exception handling:

- Keeps controllers clean
- Avoids duplicate code
- Produces consistent error responses

### Lesson Learned

Business logic should not be cluttered with repetitive error handling.

---

# 6. Preparing for Validation

The upgraded controller is ready for request validation using:

```java
@Valid
```

along with validation annotations in Entity or DTO classes.

Examples include:

- `@NotBlank`
- `@Size`
- `@Pattern`
- `@Email`

### Why?

Validation prevents invalid data from entering the application before reaching the service layer.

### Lesson Learned

Input validation should happen at the API boundary.

---

# 7. Better API Design

The controller now has a clearer separation of responsibilities.

The controller focuses on:

- Receiving HTTP requests
- Calling the Service Layer
- Returning HTTP responses

Business logic remains inside the Service Layer.

### Lesson Learned

Controllers should coordinate requests rather than implement business rules.

---

# Skills Improved

- REST API Design
- HTTP Status Codes
- ResponseEntity Usage
- Resource Validation
- Error Handling Preparation
- Clean Controller Architecture
- Spring Boot REST Best Practices

---

# Biggest Takeaway

A production-ready REST controller is not defined by its CRUD functionality alone, but by how clearly and correctly it communicates with API consumers through standard HTTP responses and clean architecture.

---

# Next Learning Goals

- Global Exception Handling (`@ControllerAdvice`)
- Request Validation (`@Valid`)
- DTO Pattern
- Custom API Response Objects
- Logging
- Swagger / OpenAPI Documentation

---

# One-Line Learning

**Professional REST APIs communicate success and failure through proper HTTP responses, making them predictable, maintainable, and easy to consume.**

---

**Prepared By**

Harish Kamat

with ChatGPT