# SKCP – Concept 03: Generic API Response

**Project:** Shree Kundodari Cement Products (SKCP)

**Concept:** Generic API Response / ApiResponse<T>

**Status:** Completed / Understood

---

# 1. What is a Generic API Response?

A **Generic API Response** is a common response structure that the backend uses for different API operations.

Instead of every API returning a completely different JSON structure, SKCP can use one standard response format.

For example, without a common response structure, one API might return:

```text
{
    "customerId": 16,
    "customerName": "Ganesh Shanbhag"
}
```
Another API might return:

```text
{
    "orderId": 101,
    "orderNumber": "ORD-101"
}
```
Another API might return:

```text
{
    "message": "Order deleted successfully"
}
```
There is no consistent structure.

With a Generic API Response, SKCP can standardize the outer structure:

```text
{
    "success": true,
    "message": "Customer created successfully",
    "data": {
        "customerId": 16,
        "customerName": "Ganesh Shanbhag"
    },
    "timestamp": "2026-08-09T06:59:00.6960498"
}
```
The important idea is:

> The DATA can change, but the **RESPONSE** structure remains consistent.

In SKCP, this **common wrapper** is implemented using:

**ApiResponse<T>**

---

# 2. Why do we need ApiResponse<T>?

As SKCP grows, there will be many APIs:

    Customer APIs
    Order APIs
    Product APIs
    Payment APIs
    Inventory APIs
    Production APIs

If every `controller` creates its own response structure, the frontend will have to handle many different formats.

For example:
```text
Customer API:

{
    "success": true,
    "message": "Customer created successfully",
    "data": {
        "customerId": 16,
        "customerName": "Ganesh Shanbhag"
    },
    "timestamp": "2026-08-09T06:59:00.6960498"
}
```

```text
Order API:

{
    "success": true,
    "message": "Order created successfully",
    "data": {
        "orderId": 101,
        "orderNumber": "ORD-101"
    },
    "timestamp": "2026-08-09T07:10:00.123456"
}
```
The DATA is different, but the outer response structure is the same.

This gives the frontend a predictable contract:
```text
success
message
data
timestamp
```

Therefore, ApiResponse<T> provides consistency across the SKCP backend.

The architecture becomes:

    Controller
        ↓
    ApiResponse<T>
        ↓
    Frontend / Postman

The main benefit is:

> One standard response structure can be reused across the entire application.
---

# 3. What does `<T>` mean in ApiResponse<T>?

The `<T>` represents a generic type.

It means that `ApiResponse` is not restricted to one particular type of data.

The same `ApiResponse` class can wrap different kinds of data.

For example:
```text
ApiResponse<CustomerResponse>
```
means:   ApiResponse containing one CustomerResponse object.

```text
ApiResponse<List<CustomerSummaryResponse>>
```
means:    ApiResponse containing a list of CustomerSummaryResponse objects.

```text
ApiResponse<Void>
```
means:   ApiResponse where there is no actual data being returned.

Therefore: 

`ApiResponse<T>`  can be understood as:

"Create a standard API response wrapper around whatever type of data is required."

The structure remains the same:

    ApiResponse<T>
        ├── success
        ├── message
        ├── data → T
        └── timestamp

Only the type of `data` changes.

For example:

```text
ApiResponse<CustomerResponse>
        data
         ↓
CustomerResponse
```

    >       ApiResponse <List < CustomerSummaryResponse> >
    >      
    >              data
    >               ↓
    >       List<CustomerSummaryResponse>



```text
   ApiResponse<Void>
        data
         ↓
       null
```
This is why `<T>` makes ApiResponse reusable throughout SKCP.

The important principle is:

> Generic programming allows one reusable class to work with different data types while maintaining type safety.
---

# 4. SKCP ApiResponse.java

SKCP uses a common **class** called:

`ApiResponse<T>`

Package:

    com.skcp.common

File:

    ApiResponse.java

The current structure is:

    ApiResponse<T>
    │
    ├── success
    ├── message
    ├── data
    └── timestamp

The implementation is:

    public class ApiResponse<T>
    {
        private boolean success;
        private String message;
        private T data;
        private LocalDateTime timestamp;
    }

Meaning:

    success
    → tells whether the API operation was successful.

    message
    → provides a human-readable description of the result.

    data
    → contains the actual response data.

    timestamp
    → records when the response was generated.

The important field is:

    private T data;

Because `T` is generic, the same ApiResponse class can contain different DTOs.

For example:

    ApiResponse<CustomerResponse>

or:

    ApiResponse<List<CustomerSummaryResponse>>

or:

    ApiResponse<Void>


## SKCP Example

When creating a customer:

    CustomerController
            ↓
    CustomerResponse
            ↓
    ApiResponse<CustomerResponse>
            ↓
    Postman / Frontend


The resulting JSON looks like:

```text
    "success": true,
    "message": "Customer created successfully",
    "data": {
        "customerId": 16,
        "customerName": "Ganesh Shanbhag",
        "mobileNumber": "9000000001",
        "status": "ACTIVE"
    },
    "timestamp": "2026-08-09T06:59:00.6960498"
}
```
Notice the important separation:

    ApiResponse
    → provides the common outer structure.

```text
CustomerResponse
→ provides the customer-specific data inside `data`.
```
Therefore:

    ApiResponse = common response envelope

    CustomerResponse = actual customer data

This separation allows the same response architecture to be reused by every SKCP module.

---

# 5. success() and failure() Methods

Our ApiResponse class provides two static methods:

success()

and

failure()

These methods make it easier for controllers to create a standard API response.

---

## 5.1 success()

The method is:

public static <T> ApiResponse<T> success(String message, T data) {
    return new ApiResponse<>(true, message, data);
}

It creates a successful API response.

For example:

ApiResponse.success(
    "Customer created successfully",
    customerResponse
);

The values become:

success
→ true

message
→ "Customer created successfully"

data
→ customerResponse

timestamp
→ automatically generated by ApiResponse

The flow is:

CustomerResponse
       ↓
ApiResponse.success(message, data)
       ↓
ApiResponse<CustomerResponse>
       ↓
JSON Response

---

## 5.2 failure()

The method is:

public static <T> ApiResponse<T> failure(String message) {
    return new ApiResponse<>(false, message, null);
}

It creates a failed API response.

For example:

ApiResponse.failure(
    "Customer could not be created"
);

The values become:

success
→ false

message
→ "Customer could not be created"

data
→ null

timestamp
→ automatically generated by ApiResponse

The flow is:

Error condition
       ↓
ApiResponse.failure(message)
       ↓
ApiResponse<T>
       ↓
JSON Error Response

---

## 5.3 Why use these methods?

Instead of repeatedly writing:

```text
new ApiResponse<>(
    true,
    "Customer created successfully",
    customerResponse
);
```

the controller can simply write:

    ApiResponse.success(
        "Customer created successfully",
        customerResponse
    );

This makes controller code:

- shorter
- easier to read
- consistent
- less error-prone

The methods also ensure that the `success` flag is set correctly.

For success():

    success = true

For failure():

    success = false

Therefore, these methods act as convenient factory methods for creating standard ApiResponse objects.

---

## Important SKCP Principle

The controller should not manually construct different response formats for every API.

Instead, it uses the common ApiResponse factory methods:

    ApiResponse.success(...)
    ApiResponse.failure(...)

This keeps the API response structur    e consistent across SKCP.

---
# 6. ApiResponse<T> in CustomerController

The `CustomerController` uses `ApiResponse<T>` to provide a consistent response structure for every Customer API.

The `controller` does not directly return the DTO.

Instead:

    CustomerService
        ↓
    CustomerResponse / CustomerSummaryResponse
        ↓
    ApiResponse<T>
        ↓
    ResponseEntity
        ↓
    Postman / Frontend


## Get All Customers

The method returns:
```text
   ResponseEntity
                <ApiResponse    
                            <List
                                <CustomerSummaryResponse>   
                            >
                 >  
```
This means:

    ResponseEntity
        contains
    ApiResponse
        contains
    List<CustomerSummaryResponse>


The `controller` uses:

    ApiResponse.success(
        "Customers retrieved successfully",
        customers
    )

Therefore:

    data
    → List<CustomerSummaryResponse>


The response represents:

    {
        "success": true,
        "message": "Customers retrieved successfully",
        "data": [
            {
                "customerId": 1,
                "customerName": "Customer A",
                "mobileNumber": "9000000001",
                "village": "Chitragi",
                "city": "Kumta",
                "status": "ACTIVE"
            }
        ],
        "timestamp": "..."
    }


## Get Customer By ID

The method returns:

    ResponseEntity<ApiResponse<CustomerResponse>>

Here:

    data
    → CustomerResponse

Flow:

        CustomerService
            ↓
        CustomerResponse
            ↓
        ApiResponse<CustomerResponse>
            ↓
        Controller
            ↓
        Postman


## Create Customer

The method returns:

    ResponseEntity<ApiResponse<CustomerResponse>>

The service creates and returns:

`CustomerResponse`

The controller wraps it using:

        ApiResponse.success(
            "Customer created successfully",
            savedCustomer
        )

Therefore:

    data
    → CustomerResponse


## Update Customer

The method returns:

    ResponseEntity<ApiResponse<CustomerResponse>>

The updated customer is returned as:

`CustomerResponse`

and then wrapped:

    ApiResponse.success(
        "Customer updated successfully",
        updatedCustomer
    )


## Delete Customer

Delete is slightly different.

The method returns:

    ResponseEntity<ApiResponse<Void>>

There is no customer object to return after deletion.

Therefore:

    data
    → null

The controller uses:

    ApiResponse.<Void>success(
        "Customer deleted successfully",
        null
    )


## Overall Customer API Pattern

All Customer APIs now follow the same outer structure:

    GET all
    → ApiResponse<List<CustomerSummaryResponse>>

        GET by ID
        → ApiResponse<CustomerResponse>>

            POST
            → ApiResponse<CustomerResponse>>

                PUT
                → ApiResponse<CustomerResponse>>

                    DELETE
                    → ApiResponse<Void>


This gives SKCP a predictable API contract.

The **DTO** determines **WHAT** data is returned.

`ApiResponse<T>` determines **HOW** that data is packaged.

This distinction is important:

    CustomerResponse
    → customer-specific response data

    ApiResponse<T>
    → common response envelope

    ResponseEntity
    → HTTP response control such as status code and headers

---
We have now covered:

```text
ApiResponse<T>
      │
      ├── success()
      ├── failure()
      │
      └── CustomerController
              │
              ├── CustomerSummaryResponse
              ├── CustomerResponse
              └── Void


```
---

# 7. Complete SKCP Response Architecture

The complete SKCP request-response flow now looks like this:
```text
Client / Postman
       │
       │ JSON Request
       ▼
Request DTO
       │
       ▼
CustomerController
       │
       ▼
CustomerService
       │
       ▼
CustomerMapper
       │
       ▼
Customer Entity
       │
       ▼
CustomerRepository
       │
       ▼
Database
```

The response travels back in the opposite direction:

```text
Database
       │
       ▼
Customer Entity
       │
       ▼
CustomerMapper
       │
       ▼
Response DTO
       │
       ▼
CustomerController
       │
       ▼
ApiResponse<T>
       │
       ▼
ResponseEntity
       │
       ▼
Client / Postman
```

## Complete Example

For a successful customer creation:

```text
Postman
   │
   │ Customer JSON
   ▼
CustomerCreateRequest
   │
   ▼
CustomerController
   │
   ▼
CustomerService
   │
   ▼
CustomerMapper
   │
   ▼
Customer Entity
   │
   ▼
CustomerRepository
   │
   ▼
Database
   │
   │ saved Customer
   ▼
CustomerMapper
   │
   ▼
CustomerResponse
   │
   ▼
ApiResponse<CustomerResponse>
   │
   ▼
ResponseEntity
   │
   │ HTTP 201 CREATED
   ▼
Postman
```

## Responsibility of Each Layer

> Request DTO
→ Controls what data the client is allowed to send.

> Controller
→ Receives HTTP requests and returns HTTP responses.

> Service
→ Contains business logic.

> Mapper
→ Converts between DTOs and entities.

> Entity
→ Represents the database record.

> Repository
→ Communicates with the database.

> Response DTO
→ Controls what data the backend exposes to the client.

> ApiResponse<T>
→ Provides a common response structure.

> ResponseEntity
→ Controls HTTP-level information such as status codes.
---
## Important Architectural Principle

DTO and ApiResponse solve two different problems.

DTO answers:

> "What data should cross the API boundary?"

ApiResponse<T> answers:

> "How should that data be packaged consistently?"

Therefore:

>Request DTO
→ controls incoming data.

>Response DTO
→ controls outgoing data.

>ApiResponse<T>
→ **wraps** the outgoing data in a standard structure.


**This gives SKCP a clean separation between:**

    Database Model
            ≠
    API Model
            ≠
    Response Envelope

* The database entity belongs to the persistence layer.

* DTOs belong to the API boundary.

* ApiResponse<T> belongs to the common API response architecture.

This separation makes the application easier to maintain, extend, test and integrate with the future SKCP frontend.

---

# Topic:  ApiErrorResponse

# ApiErrorResponse

## 1. What is ApiErrorResponse?

`ApiErrorResponse` is a dedicated response structure used when an API request fails.

It provides a consistent format for communicating errors from the backend to the client.

Instead of returning different error structures for different failures, SKCP uses a common error-response structure.

---

## 2. Why do we need a separate error response?

A successful API response and a failed API response have different responsibilities.

### Successful response

A successful response communicates:

- The operation succeeded
- A human-readable success message
- The requested data

Example:

```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "customerId": 16,
    "customerName": "Ganesh Shanbhag"
  },
  "timestamp": "2026-08-09T06:59:00.6960498"
}
```
### Error response

An error response communicates:

* The operation failed
* What went wrong
* What type of error occurred
* When the error occurred

Example:

```text
{
  "success": false,
  "message": "Customer with mobile number 9000000001 already exists",
  "error": "DUPLICATE_RESOURCE",
  "timestamp": "2026-08-10T07:31:10"
}
```
The two responses have different purposes, so they should not be forced into exactly the same structure.
---

## 3. Why not use ApiResponse for errors?
`ApiResponse<T>` is primarily designed for successful business responses.

For example:

```text

CustomerService
      ↓
Customer created successfully
      ↓
CustomerResponse
      ↓
ApiResponse<CustomerResponse>
      ↓
Controller
      ↓
Client
```
An error is different:

```text
CustomerService
      ↓
Business error occurs
      ↓
Exception
      ↓
GlobalExceptionHandler
      ↓
ApiErrorResponse
      ↓
Client

```
Therefore:


```text
Success
   ↓
ApiResponse<T>

Failure
   ↓
ApiErrorResponse

```
This separation makes the API easier to understand and maintain.

---
## 4. ApiErrorResponse fields
SKCP ApiErrorResponse contains the following fields:
```text

success
message
error
timestamp
```

---

## 5. Field: success

`success` indicates whether the API operation succeeded.

For `ApiErrorResponse`, the value is always:

> false

Example

> "success": false

The client can immediately determine that the operation failed.

---

## 6. Field: message
`message` contains a human-readable explanation of the problem.

Example:

> "message": "Customer with mobile number 9000000001 already exists"

The message is primarily intended for humans.

It should explain the problem clearly.

The frontend should not depend on the exact wording of the message for business logic.

For example, this is not recommended:

> if message == "Customer already exists"

Instead, the frontend should use the structured error field.

---

## 7. Field: error

error contains a machine-readable error type.

Example:
> "error": "DUPLICATE_RESOURCE"

This field is intended for application logic.

Examples of SKCP error types include:

```text
RESOURCE_NOT_FOUND
DUPLICATE_RESOURCE
VALIDATION_ERROR
```


This allows the frontend to understand the category of the failure without depending on the human-readable message.

---

## 8. Field: timestamp
timestamp records when the error response was generated.

Example:
> "timestamp": "2026-08-10T07:31:10"

This is useful for:

* Debugging
* Logging
* Troubleshooting
* Tracking API failures
* Understanding when an error occurred

---

## 9. Example: Duplicate Customer
Suppose we try to create a customer using a mobile number that already exists.

The backend detects the duplicate and throws:
> DuplicateResourceException

The flow becomes:

```text
Postman / Frontend
        ↓
CustomerController
        ↓
CustomerService
        ↓
DuplicateResourceException
        ↓
GlobalExceptionHandler
        ↓
ApiErrorResponse
        ↓
Client

``` 
The client receives:


```text
{
  "success": false,
  "message": "Customer with mobile number 9000000001 already exists",
  "error": "DUPLICATE_RESOURCE",
  "timestamp": "2026-08-10T07:31:10"
}

```
## 10. Example: Resource Not Found
Suppose the client requests:
> GET /api/customers/999

but customer ID 999 does not exist.

The backend throws:

> ResourceNotFoundException

The `GlobalExceptionHandler` converts the exception into:

```text
{
  "success": false,
  "message": "Customer with ID 999 not found",
  "error": "RESOURCE_NOT_FOUND",
  "timestamp": "2026-08-10T07:35:20"
}

```
The client receives a predictable error structure.

---
## 11. Why error types are important
Consider these two messages:
> Customer not found

and 
> Customer with ID 999 not found

The message may change over time.

However, the error type remains:

> RESOURCE_NOT_FOUND

Therefore:
```text

message
   ↓
Human-readable information

error
   ↓
Machine-readable information
```
This separation is an important API design principle.

---

## 12. ApiErrorResponse vs ApiResponse
ApiResponse

Used for successful operations.


```text
ApiResponse<T>

success
message
data
timestamp

```
Example:

```text
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "customerId": 16,
    "customerName": "Ganesh Shanbhag"
  },
  "timestamp": "2026-08-09T06:59:00"
}

```
### ApiErrorResponse

Used for failed operations.


```text
ApiErrorResponse

success
message
error
timestamp

```

Example:

```text

{
  "success": false,
  "message": "Customer with mobile number 9000000001 already exists",
  "error": "DUPLICATE_RESOURCE",
  "timestamp": "2026-08-10T07:31:10"
}
```
---

## 13. Important architectural principle

The backend should provide predictable API contracts.

Therefore SKCP follows:
```text

SUCCESS
   ↓
ApiResponse<T>

FAILURE
   ↓
ApiErrorResponse
```
The client should not need to understand Java exceptions.

For example, the frontend should never need to know that the backend internally used:

> DuplicateResourceException

Instead, it receives:

> DUPLICATE_RESOURCE

This creates a clean boundary between backend implementation and API contract.

---

## 14. Exception vs ApiErrorResponse

These are two different concepts.

Exception

An exception is an internal backend mechanism.

Example:

```text
DuplicateResourceException
ResourceNotFoundException

```

ApiErrorResponse

An API error response is the external representation sent to the client.

Example:


```text
{
  "success": false,
  "message": "Customer already exists",
  "error": "DUPLICATE_RESOURCE",
  "timestamp": "2026-08-10T07:31:10"
}

```
---

## 15. Key Software Engineering Principle

Request and response structures should be designed according to their responsibility.

Successful responses communicate successful business operations.

Error responses communicate failure information.

Keeping these responsibilities separate makes the API:

* Easier to understand
* Easier to maintain
* Easier to debug
* Easier for frontend developers to consume
* More predictable for future integrations*

---

## 16. SKCP Architecture

The current SKCP error-handling architecture is:

```text
Controller
    ↓
Service
    ↓
Business operation
    ↓
Exception occurs
    ↓
GlobalExceptionHandler
    ↓
ApiErrorResponse
    ↓
HTTP Response
    ↓
Frontend / Postman

```

The `GlobalExceptionHandler` is responsible for converting backend exceptions into the appropriate `ApiErrorResponse`.

---

## 17. Current ApiErrorResponse Design

Current intended structure:

```text
ApiErrorResponse
│
├── success
├── message
├── error
└── timestamp
```


Example:

```text
{
  "success": false,
  "message": "Customer with mobile number 9000000001 already exists",
  "error": "DUPLICATE_RESOURCE",
  "timestamp": "2026-08-10T07:31:10"
}

```
---

## 18. Important distinction

Do not confuse:

> message

with:
>error

They have different responsibilities.
```text
message
→ Human-readable explanation

error
→ Machine-readable error category
```
This distinction is important for clean API design.

---

## 19. Interview Question

Why do we use a separate ApiErrorResponse?

A good answer:

> `ApiErrorResponse` provides a consistent and structured contract for failed API operations. It separates error information from successful business responses and provides both a human-readable message and a machine-readable error type. This allows clients to handle errors reliably without depending on backend exception classes or message text.

---

## 20. Interview Question

### Why should the frontend not depend on the error message?

Because error messages are intended for humans and may change.

The frontend should use a stable machine-readable error code/type such as:

```text
RESOURCE_NOT_FOUND
DUPLICATE_RESOURCE
VALIDATION_ERROR
```
This keeps frontend logic independent of message wording.

---

## 21. Final Concept Summary

```text

Exception
   ↓
Internal backend problem

GlobalExceptionHandler
   ↓
Converts exception into API-level error response

ApiErrorResponse
   ↓
Standard external error contract

Client
   ↓
Receives predictable error information
``` 
The most important idea is:

```text
Exception = internal backend mechanism

ApiErrorResponse = external API contract

```
---























```text


```