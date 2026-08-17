# Decision Log

**Period:** 07 August 2026 – 10 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Modules:** Supplier & Product – Master Entity Backend Refinement

**Status:** ✅ Supplier Module Completed | ✅ Product Module Completed

---

# Decisions Made

---

## Decision 1 — Supplier Module Completed

### Decision

The Supplier Master module is considered successfully completed.

The module follows the standardized Spring Boot architecture:

```text
Supplier Entity
      ↓
Supplier Repository
      ↓
Supplier Service
      ↓
Supplier Controller
      ↓
REST API
      ↓
Postman Testing
```
## Completed Components


- Supplier Entity
- Supplier Repository
- Supplier Service
- Supplier Controller
- Request DTOs
- Response DTOs
- Mapper
- API Response wrapper
- Validation
- Global Exception Handling
- CRUD APIs
- Postman Testing

---

## Reason

Supplier is a core SKCP Master Entity and provides the foundation for future procurement workflows.

Decision 2 — Product Module Will Follow the Same Master-Entity Pattern

Decision

The Product module will follow the same architecture and coding standards established during the Supplier module.

The Product module will not introduce a different architectural pattern.

Product
   ↓
Repository
   ↓
Service
   ↓
Mapper
   ↓
Controller
   ↓
REST API

## Reason
All SKCP Master Entities should behave consistently.
This reduces:
- Learning complexity
- Maintenance effort
- Code duplication
- Future frontend integration complexity

---

## Decision 3 — Common SKCP Master-Entity Pattern

### Decision
A common Master-Entity pattern is adopted for all SKCP Master Entities.

The pattern will apply to:
- Customer
- Supplier
- Product
- Raw Material
- Labour
- Asset

Each Master Entity should follow:


        Entity
        ↓
        Repository
        ↓
        Request DTO
        ↓
        Response DTO
        ↓
        Mapper
        ↓
        Service
        ↓
        Controller
        ↓
        ApiResponse
        ↓
        Global Exception Handler

## Reason
These entities represent relatively stable master data and should expose consistent CRUD behavior.

---

## Decision 4 — Entity Remains the Database Foundation

### Decision
Entities will continue to be used internally even though DTOs are introduced.

The frontend/API layer will not directly expose Entity classes.

### Architecture

        Database
        ↓
        Entity
        ↓
        Repository
        ↓
        Service
        ↓
        Mapper
        ↓
        DTO
        ↓
        Controller
        ↓
        API

## Reason
The Entity represents the database structure and JPA persistence model.
DTOs represent the API contract.
They serve different responsibilities.

---

## Principle
**Entity = Database Model**  
**DTO = API Model**

The Entity therefore remains the foundation of the backend.

## Decision 5 — DTOs Become the Public API Contract

### Decision
The SKCP REST APIs will communicate using Request and Response DTOs instead of exposing Entity classes directly.

### Request Flow

        Frontend
        ↓
        Request DTO
        ↓
        Validation
        ↓
        Service
        ↓
        Mapper
        ↓
        Entity
        ↓
        Repository
        ↓
        Database


### Response Flow

        Database
        ↓
        Entity
        ↓
        Repository
        ↓
        Service
        ↓
        Mapper
        ↓
        Response DTO
        ↓
        ApiResponse
        ↓
        Controller
        ↓
        Frontend


### Reason
This provides:
- API stability
- Better security
- Cleaner responses
- Separation of concerns
- Easier API versioning
- Prevention of accidental entity exposure

---

## Decision 6 — Separate Create and Update Request DTOs

### Decision
Create and Update operations will use separate Request DTOs.

Example:

        ProductCreateRequest
        ProductUpdateRequest
        ProductResponse
        ProductSummaryResponse


### Reason
Create and Update operations may have different business rules.
This allows validation and API contracts to evolve independently.

---

## Decision 7 — Product Create Request Will Not Require Status

### Decision
The Product Create API should not require the client to send status.

For a newly created Product, the system will default the status to:

ACTIVE


### Example
Client sends:

        {
        "productCode": "SB-005",
        "productName": "Solid Block",
        "size": "6x3x16",
        "length": 16.00,
        "width": 3.00,
        "height": 6.00,
        "unit": "INCH",
        "description": "Standard 3 inch cement solid block"
        }

The backend assigns:

> status = ACTIVE

## Reason
The system should control the initial lifecycle state rather than relying on the client.
This prevents clients from accidentally creating a Master Entity with an inappropriate status.

---

## Decision 8 — Product Update Request Will Not Require Status

### Decision
The Product Update API will not require status in the normal update request.

Status is treated as a lifecycle/state field rather than normal product information.

### Reason
A normal Product update should modify product information such as:
- Product Name
- Size
- Dimensions
- Unit
- Description

without unintentionally changing the lifecycle state.

If future business requirements require activation/deactivation, a dedicated operation can be introduced.

### Example future API:

        PATCH /api/products/{id}/activate

        PATCH /api/products/{id}/deactivate


### Principle
Status should be managed through dedicated lifecycle operations, not through general update endpoints.


        Normal Update
        ↓
        Business Data

        Lifecycle Operation
        ↓
        Status

## Decision 9 — Product Status Is Controlled by the Backend

### Decision
Product status remains part of the Entity/database model but is not treated as a normal client-controlled field during Create/Update.

The Entity retains:
```java
private String status = "ACTIVE";
```
and:

        @PrePersist
        protected void onCreate() {
        ...
        }

## Reason
The backend should protect important lifecycle state.
This provides a safer foundation for future:
- Active Products
- Inactive Products
- Archived Products
- Discontinued Products

---

## Decision 10 — Soft Delete Pattern for Master Entities

### Decision
Master Entities will use a logical/soft-delete approach rather than physically deleting the database record.

For example:
```text

        ACTIVE
        ↓
        Delete Request
        ↓
        INVALID
```
The database record remains available but its status becomes:

> INVALID

### Reason
Master data may already be referenced by transactional records.
Physical deletion could cause:
- Foreign-key problems
- Historical data loss
- Broken references
- Loss of audit information

Soft deletion preserves historical integrity.

## Decision 11 — Common Delete Behavior Across Master Entities

### Decision
The following Master Entities will follow the same delete pattern:
- Customer
- Supplier
- Product
- Raw Material
- Labour
- Asset

        Customer
        Supplier
        Product
        Raw Material
        Labour
        Asset

```text
        Delete operation:

        DELETE /api/{masters}/{id}
                ↓
        Find Entity
                ↓
        Set status = INVALID
                ↓
        Save Entity
                ↓
        Return success response
```
### Reason
A common Master Entity lifecycle makes the SKCP backend predictable.

All Master Entities should behave consistently unless a specific business requirement requires otherwise.

## Decision 12 — Delete API Will Return HTTP 200 OK

### Decision
SKCP Master Entity DELETE APIs will return:

> HTTP 200 OK

instaed of:

> HTTP 204 No Content


### Reason
SKCP intentionally returns a meaningful JSON response after a successful delete operation.

Example:
```json
{
    "success": true,
    "message": "Supplier deleted successfully",
    "data": null,
    "timestamp": "2026-08-10T15:12:04.3542255"
}
```

### Principle

```text
HTTP 200
   +
ApiResponse
   +
message
   +
success
   +
timestamp
```

This provides useful confirmation to the frontend.

---


## Decision 13 — Do Not Use HTTP 204 With a Response Body

### Decision
The previous approach of returning:

> HTTP 204 No Content

together with:

```json
{
    "data": null,
    "message": "Product deleted successfully",
    "success": true
}
```

### Reason
HTTP 204 means the response has no content.
Therefore, if SKCP wants to return a JSON response body, HTTP 200 is the correct choice.

### Final SKCP Standard

        Successful Delete
                ↓
        HTTP 200 OK
                ↓
        JSON ApiResponse

## Decision 14 — ApiResponse Will Be Used for Successful APIs

### Decision
SKCP APIs will use the common:

> ApiResponse<T>

wrapper.

Example:
> ApiResponse<ProductResponse>

or:
> ApiResponse<List<ProductSummaryResponse>>

### Standard Structure

```json
{
    "success": true,
    "message": "Product retrieved successfully",
    "data": {},
    "timestamp": "..."
}
```
### Reason
Provides a consistent API contract across all modules.

---

## Decision 15 — Delete Response Uses ApiResponse<Void>

### Decision
Delete operations will use:

> ApiResponse<Void>

when there is no business object to return.

Example:

```java
ApiResponse.<Void>success(
    "Product deleted successfully",
    null
)
```

### Response
```json
{
    "success": true,
    "message": "Product deleted successfully",
    "data": null,
    "timestamp": "..."
}
```

### Reason
The operation succeeds but does not need to return the deleted entity.

---

## Decision 16 — Controller Owns HTTP Status Codes

### Decision
HTTP response status codes remain the responsibility of the Controller layer.

Examples:

```text
GET     → 200 OK

POST    → 201 CREATED

PUT     → 200 OK

DELETE  → 200 OK
```
### Reason
The Service layer should focus on business logic.
The Controller layer is responsible for translating successful business operations into HTTP responses.

### Architecture

```text
Service
   ↓
Business Result
   ↓
Controller
   ↓
HTTP Status + ApiResponsetext

```
## Decision 17 — Service Owns Business Logic

### Decision
The Service layer will remain responsible for business operations.

For Product:
- Create
- Get
- Update
- Delete / Inactivate


```text
Create
Get
Update
Delete / Inactivate
```

The Controller should not contain business logic.

### Controller Responsibilities
- Receive HTTP request
- Validate request using @Valid
- Call Service
- Build HTTP response
- Return ApiResponse

### Service Responsibilities
- Find Entity
- Apply business rules
- Save Entity
- Update status
- Throw business exceptions
- Return DTO/business result

---

## Decision 18 — Jakarta Validation Will Be Used

### Decision
Request DTO validation will use Jakarta Bean Validation.

Examples:
```java
@NotBlank
@NotNull
@Positive
@Size
```

and Controller methods will use:

> @Valid

### Flow

```text
HTTP Request
      ↓
Request DTO
      ↓
@Valid
      ↓
Bean Validation
      ↓
Valid?
   ↙       ↘
 YES        NO
 ↓           ↓
Service    Exception
             ↓
      GlobalExceptionHandler
```

### Reason
Invalid client data should be rejected before reaching the Service layer.

---

## Decision 19 — Validation Belongs on Request DTOs

### Decision
Validation annotations will primarily be placed on Request DTOs rather than directly relying on database constraints.

Example:
```java
@NotBlank
private String productCode;
```

### Reason
Database constraints protect persistence.  

DTO validation protects the API boundary.  

Both layers serve different purposes.

```text
API Boundary
     ↓
DTO Validation

Database Boundary
     ↓
Database Constraints

```
---
## Decision 20 — Global Exception Handling

### Decision
Validation and business exceptions will be handled centrally through the Global Exception Handler.

The Controller should not contain repetitive try/catch blocks.

### Flow

```text
Controller
↓
Service
↓
Exception
↓
GlobalExceptionHandler
↓
ApiResponse Failure

```
### Reason
Provides consistent error responses across the entire SKCP backend.

---

## Decision 21 — ApiResponse Failure Format

### Decision
Failures will use:
```java
ApiResponse.failure(...)

Example:
```json
{
    "success": false,
    "message": "Product not found with id: 5",
    "data": null,
    "timestamp": "..."
}
```

### Reason
Both successful and failed APIs should follow the same outer response structure.

---

## Decision 22 — Product Mapper Separates Entity and DTO

### Decision
ProductMapper will be responsible for:
- Request DTO → Entity
- Entity → ProductResponse
- Entity → ProductSummaryResponse
- Update DTO → Existing Entity


and:

```text
Product Entity
     ↓
ProductMapper
     ↓
Response DTO
```

## Decision 23 — Product Summary Response for List APIs

### Decision
The Product list API will return:

> ProductSummaryResponse

instead of the complete ProductResponse.        

### Reason
List APIs generally do not need every field.
This reduces payload size and provides a cleaner frontend contract.

Detailed information can be returned through:

> GET /api/products/{id}


## Decision 24 — Product Detail Response for Individual Product

### Decision
The Product detail API will return:

> ProductResponse

### API

> GET /api/products/{id}


### Reason
Individual resource retrieval can expose the complete required product information.

---

## Decision 25 — Product Module File Order

### Decision
The Product module was developed in a fixed learning and implementation order.
```text
1. Product.java
        ↓
2. ProductRepository.java
        ↓
3. ProductCreateRequest.java
        ↓
4. ProductUpdateRequest.java
        ↓
5. ProductResponse.java
        ↓
6. ProductSummaryResponse.java
        ↓
7. ProductMapper.java
        ↓
8. ProductService.java
        ↓
9. ProductController.java
        ↓
10. Validation + Exception Handling
        ↓
11. Postman Testing
```

### Reason
This order builds the module from the database foundation upward to the API layer.

It also makes the architecture easier to understand and debug.

---

## Decision 26 — Product Module Is Successfully Completed

### Decision
Product Master module is officially considered complete.

### Completed
- Product Entity
- Product Repository
- Product Create DTO
- Product Update DTO
- Product Response DTO
- Product Summary Response DTO
- Product Mapper
- Product Service
- Product Controller
- Validation
- Global Exception Handling
- CRUD APIs
- Postman Testing

### Status
```text
Product Module
      ↓
✅ COMPLETED
```


## Decision 27 — Postman Is the API Validation Tool

### Decision
Postman will continue to be used to validate every backend API before considering a module complete.

Testing includes:
- POST
- GET ALL
- GET BY ID
- PUT
- DELETE

### Reason
This ensures backend APIs are independently validated before frontend integration.


## Decision 28 — Database Remains the Source of Persistence Truth

### Decision
PostgreSQL remains the persistence source of truth.

Spring Boot communicates with PostgreSQL through:


```text
Spring Data JPA
        ↓
Hibernate
        ↓
JDBC
        ↓
PostgreSQL

```
### Reason
The database remains responsible for persistent business data while the application layer manages business behavior.

---

## Decision 29 — Temporary Runtime Issues Are Treated Separately From Architecture

### Decision
Local environment/runtime issues such as PostgreSQL connection failures will not result in unnecessary architectural changes.

Example:

> Connection to localhost:5432 refused



is treated as an environment/database availability issue unless configuration is proven incorrect.

### Reason
Infrastructure/runtime problems should be diagnosed independently from application architecture.

---

## Decision 30 — Maven Dependency Warnings Must Be Cleaned

### Decision
Duplicate Maven dependencies should be removed from pom.xml.

Example warning observed:

> 'dependencies.dependency.(groupId:artifactId:type:classifier)'
must be unique

Specifically:

> spring-boot-starter-validation

was declared more than once.

### Reason
Duplicate dependencies can cause:
- Build confusion
- Dependency management problems
- Future Maven compatibility issues

The project should maintain a clean dependency configuration.

---

## Final SKCP Master-Entity Standard

All Master Entities should ultimately follow this pattern:


```text

                    ┌──────────────────┐
                    │     Frontend     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Request DTO    │
                    └────────┬─────────┘
                             │
                          @Valid
                             │
                             ▼
                    ┌──────────────────┐
                    │    Controller    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Service      │
                    │ Business Logic   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      Mapper      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      Entity      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Repository    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    PostgreSQL    │
                    └──────────────────┘
```

## Master Entity Lifecycle Standard

For:
- Customer
- Supplier
- Product
- Raw Material
- Labour
- Asset

the standard lifecycle is:


```text
CREATE
  ↓
ACTIVE
  ↓
UPDATE
  ↓
ACTIVE
  ↓
DELETE REQUEST
  ↓
INVALID

```
The database record is retained.

---

## Standard HTTP Contract

| Operation | HTTP Status | Response |
|-----------|-------------|----------|
| GET All | 200 OK | ApiResponse<List<...>> |
| GET By ID | 200 OK | ApiResponse<...> |
| POST | 201 CREATED | ApiResponse<...> |
| PUT | 200 OK | ApiResponse<...> |
| DELETE | 200 OK | ApiResponse<Void> |

## Standard Delete Response

```json
{
    "success": true,
    "message": "Product deleted successfully",
    "data": null,
    "timestamp": "2026-08-10T15:12:04.3542255"
}
```

Database:

> Product.status = INVALID

## Summary of Major Decisions

The SKCP backend has now established the following standards:

- Supplier module completed
- Product module completed
- Common Master-Entity pattern adopted
- Entity remains the database foundation
- DTOs become the public API contract
- Separate Create and Update DTOs
- Status controlled by backend
- New Master Entities default to ACTIVE
- Master Entity delete uses soft delete
- DELETE returns HTTP 200 OK
- DELETE returns ApiResponse<Void>
- data is null for delete responses
- Controller owns HTTP status codes
- Service owns business logic
- Mapper owns Entity ↔ DTO conversion
- @Valid triggers DTO validation
- Global Exception Handler handles validation/business errors
- ApiResponse standardizes API responses
- Product Summary DTO used for list APIs
- Product Response DTO used for detail APIs
- Postman remains the API validation tool
- PostgreSQL remains the persistence source of truth
- Runtime/environment issues are handled separately from architecture
- Maven dependencies must remain clean

---

## Current Master Entity Status

| Master Entity | Status |
|---------------|--------|
| Customer | ✅ Completed |
| Supplier | ✅ Completed |
| Product | ✅ Completed |
| Raw Material | 🚧 Pending |
| Labour | 🚧 Pending |
| Asset | 🚧 Pending |

---

## Architectural Principle

The most important decision from this phase is:

> **All SKCP Master Entities should behave consistently unless a genuine business requirement requires a different behavior.**

This provides a predictable, maintainable and scalable backend architecture.

---

**Decision Recorded By**  
Harish Kamat  
with ChatGPT

























