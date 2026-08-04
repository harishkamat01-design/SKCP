# GET Supplier by ID – Learning

Today I tested the **GET Supplier by ID** API.

## Endpoint

```
GET /api/suppliers/{id}
```

Example:

```
GET /api/suppliers/1
```

## Purpose

This endpoint retrieves a single supplier using its unique `supplierId`.

## Internal Flow

```
Client
    ↓
SupplierController
    ↓
SupplierService
    ↓
SupplierRepository
    ↓
Hibernate
    ↓
PostgreSQL
```

Hibernate generates a SQL query similar to:

```sql
SELECT *
FROM supplier
WHERE supplier_id = 1;
```

## Successful Response

Status:

```
200 OK
```

Returns the supplier as a JSON object.

## Invalid ID

If the supplier does not exist:

```
GET /api/suppliers/999
```

The API returns:

```
404 Not Found
```

This improves API reliability by clearly indicating that the requested resource does not exist.

## Key Learning

The GET by ID endpoint demonstrates how Spring Boot retrieves a single database record using the primary key and returns an appropriate HTTP status based on whether the record exists.