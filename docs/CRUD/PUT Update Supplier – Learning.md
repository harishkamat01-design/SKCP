# PUT Update Supplier – Learning

Today I tested the **PUT Update Supplier** API.

## Endpoint

```
PUT /api/suppliers/{id}
```

Example:

```
PUT /api/suppliers/1
```

## Purpose

The PUT endpoint updates an existing supplier using its primary key.

## Important Observation

The request URL identifies which supplier will be updated:

```
/api/suppliers/1
```

Inside the controller:

```java
supplier.setSupplierId(id);
```

This ensures that the supplier ID always comes from the URL rather than trusting the client request body.

## Why is this important?

It prevents clients from accidentally or intentionally changing the primary key.

The server always controls the identity of the record being updated.

## Audit Protection

The field:

```java
@Column(updatable = false)
private LocalDateTime createdAt;
```

ensures that the original creation timestamp never changes during updates.

This preserves accurate audit history.

## Internal Flow

```
Client
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Hibernate
    ↓
PostgreSQL UPDATE
```

## Key Learning

The primary key should come from the URL, while business data comes from the request body.

Audit fields such as `createdAt` should remain immutable to preserve data integrity.