# 04 — Exception Handling

## 1. What is Exception Handling?

Exception handling is the mechanism used by the backend to recognize, handle, and communicate unexpected or invalid situations in a controlled way.

In SKCP, many things can go wrong during an API request.

Examples:

- Requested customer does not exist.
- A duplicate customer is being created.
- Invalid input is received.
- A database operation fails.
- An unexpected server problem occurs.
- An operation cannot be completed.

Instead of exposing raw technical errors to the client, SKCP should convert these situations into meaningful and controlled API responses.

---

## 2. What is an Exception?

An exception represents a problem that occurs during program execution.

For example:

A client requests:

> GET /api/customers/999

If customer 999 does not exist, the backend encounters a situation that prevents the requested operation from being completed normally.

Conceptually:

    CustomerService
        ↓
    Customer 999 does not exist
        ↓
    Exception


In SKCP, this can eventually be represented by:

> ResourceNotFoundException

---

## 3. Exception and API Response Are Different

```text
An exception is an internal backend mechanism.

An API response is the information sent back to the client.
```
Therefore:

```text
Exception
→ Internal backend problem/signal

Exception Handler
→ Decides how the exception should be handled

ApiResponse
→ Standard structure used to communicate the result to the client
```

The flow is:

                    CustomerService
                        ↓
                    Exception
                        ↓
                    GlobalExceptionHandler
                        ↓
                    ApiResponse
                        ↓
                    HTTP Response
                        ↓
                    Postman / React

---

## 4. Why Do We Need Exception Handling?

Without proper exception handling, the backend may expose technical information such as:

    - NullPointerException
    - SQLException
    - Hibernate exceptions
    - Stack traces
    - Other internal implementation details

These are useful for developers while debugging, but they are not appropriate API responses for the frontend or API consumer.

Instead, the client should receive a meaningful response.

```text
Example:

{
    "success": false,
    "message": "Customer not found",
    "data": null,
    "timestamp": "2026-08-09T07:00:00"
}
```
This is much easier for Postman, React, or another API consumer to understand.

---

## 5. Why Should Exception Handling Be Centralized?

SKCP will eventually contain multiple `controllers`, such as:

        CustomerController
        OrderController
        PaymentController
        InventoryController
        ProductionController

If every controller individually handles every possible exception, the application will contain repeated error-handling code.

For example:

```text
CustomerController
    ├── Not Found
    ├── Duplicate
    ├── Validation Error
    └── Server Error

OrderController
    ├── Not Found
    ├── Duplicate
    ├── Validation Error
    └── Server Error

PaymentController
    ├── Not Found
    ├── Duplicate
    ├── Validation Error
    └── Server Error
```
This creates duplication and makes maintenance difficult.

Instead, SKCP uses a centralized exception-handling approach.

The architecture is:

```text
CustomerController ─┐
OrderController ────┤
PaymentController ──┤
InventoryController ┤
ProductionController┤
                    ↓
        GlobalExceptionHandler
                    ↓
                ApiResponse
                    ↓
                 Client

```
This allows common exception-handling rules to be maintained in one place.

---

## 6. First SKCP Example — Resource Not Found

Suppose the client requests:

> GET /api/customers/999

The service searches for customer 999.

    Repository
        ↓
    Customer 999?
        ↓
    No

This represents a **resource-not-found** situation.

Instead of simply returning an unclear technical result, the service can raise:

> ResourceNotFoundException

The conceptual flow becomes:

```text
CustomerService
      ↓
Customer not found
      ↓
ResourceNotFoundException
      ↓
GlobalExceptionHandler
      ↓
ApiResponse
      ↓
HTTP 404 NOT FOUND
      ↓
Client
```
---

## 7. Second SKCP Example — Duplicate Resource

Suppose SKCP requires customer mobile numbers to be unique.

A client attempts to create a customer using a mobile number that already exists.

```text
The conceptual flow becomes:

Create Customer
      ↓
Check existing customer
      ↓
Customer already exists
      ↓
DuplicateResourceException
      ↓
GlobalExceptionHandler
      ↓
ApiResponse
      ↓
HTTP 409 CONFLICT
      ↓
Client
```
The purpose is to communicate that the request conflicts with an existing resource.

---

## 8. Relationship Between Exception Handling and HTTP Status Codes

Exception handling also helps SKCP return meaningful HTTP status codes.

### 2xx — Success

The request was successfully processed.

Examples:

    200 OK
    201 CREATED
    204 NO CONTENT

---

### 4xx — Client / Request Related Problems

The request cannot be fulfilled because of a problem with the **request or requested resource**.
Examples:

    400 BAD REQUEST
    404 NOT FOUND
    409 CONFLICT

---

### 5xx — Server Problems

The server encountered an unexpected problem while **processing the request**.

Examples:

    500 INTERNAL SERVER ERROR
    503 SERVICE UNAVAILABLE

---

## 9. Complete Exception Handling Mental Model

The SKCP architecture can be visualized as:

                SKCP BACKEND
                     │
                     ▼
              Something fails
                     │
                     ▼
                 Exception
                     │
                     ▼
          GlobalExceptionHandler
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       404 NOT    409 CONFLICT 500
       FOUND
          │          │          │
          └──────────┼──────────┘
                     ▼
                ApiResponse
                     │
                     ▼
              Postman / React

---

## 10. Important SKCP Principle

Exception handling is not simply about "catching errors".

It is about:

1. Recognizing an exceptional situation.
2. Representing that situation appropriately.
3. Handling it centrally.
4. Selecting a meaningful HTTP status code.
5. Returning a consistent API response.
6. Hiding unnecessary internal technical details from the client.

Therefore:

```text
Exception
→ Internal problem

GlobalExceptionHandler
→ Central handling mechanism

ApiResponse
→ Standard response envelope

HTTP Status
→ Communicates the type of result to the client
```
---

## 11. Current Learning Boundary

At this stage, we are only understanding **WHY** exception handling exists.

We have not yet changed:

    CustomerService.java
    GlobalExceptionHandler.java
    ApiResponse.java
    or any other code.

The next concept will be:

> throw vs return null

This is important because the current CustomerService contains logic such as:

    if (customer == null) {
        return null;
    }

We will understand why exception-based handling is a better approach for certain situations before changing the code.

---

## Pointer 2 — `throw` vs `return null`

### 1. The Current Approach

In the current `CustomerService.java`, we have logic such as:

```java
if (customer == null) {
    return null;
}
```
This means that when a customer is not found, the service simply returns null.

The flow is:

```text
CustomerService
      ↓
Customer not found
      ↓
return null
      ↓
CustomerController
      ↓
Controller checks for null
      ↓
HTTP 404 response

```
This approach can work, but the problem is that the exceptional situation is represented only by the absence of a value.

# 2. What Does return null Mean?

~return null~ essentially means:

> "There is no value to return."

For example:
```text
Customer customer = customerRepository.findById(id).orElse(null);
```
If the customer does not exist:
```text
customer = null
```

The caller must then understand what null means and decide what to do.

For example:

```text
if (customer == null) {
    return null;
}
```
The controller may then have to check:

```text
if (customer == null) {
    return ResponseEntity.notFound().build();
}

```
---

# 3. What Does throw Mean?

`throw` explicitly tells the application:

> "An exceptional situation has occurred."

For example, conceptually:

    throw new ResourceNotFoundException("Customer not found");

The flow becomes:

```text
CustomerService
      ↓
Customer not found
      ↓
throw ResourceNotFoundException
      ↓
GlobalExceptionHandler
      ↓
ApiResponse
      ↓
HTTP 404 NOT FOUND
      ↓
Postman / React
```
The problem is now explicitly represented as an exception.

---

# 4. SKCP Business Analogy

Imagine asking an employee in the SKCP office:

> "Find Customer #999."

### Using return null

The employee says:

> "Here... nothing."

The caller now has to figure out what "nothing" means.

It could mean:
* Customer does not exist.
* The search was not performed.
* Something went wrong.
* No result was available.

### Using throw

The employee clearly says:

> "Customer #999 does not exist."

The situation is explicit and can be handled by the appropriate process.

This is similar to the difference between returning null and throwing an exception.

---

# 5. return null Is Not Always Wrong

It is important not to misunderstand this concept.

`return null` is not automatically bad code.

There are situations where null can be a valid result.

However, when the business meaning is:

> "The requested resource should exist, but it does not exist."

then throwing an appropriate exception is generally clearer.

For SKCP:

```text
Requested Customer
       ↓
Does Customer exist?
       │
   ┌───┴───┐
  YES      NO
   ↓        ↓
continue   throw
           ResourceNotFoundException

```

# 6. Why Exception Handling Makes the Architecture Cleaner

With `return null`, the controller often needs to know about the failure:

```text
CustomerService
      ↓
return null
      ↓
CustomerController
      ↓
if (customer == null)
      ↓
404 NOT FOUND
```

With exception handling:

```text
CustomerService
      ↓
throw ResourceNotFoundException
      ↓
GlobalExceptionHandler
      ↓
404 NOT FOUND

```
This separates responsibilities more clearly.

---
### CustomerService

Responsible for identifying the business problem.

Example:

> Customer does not exist.

### GlobalExceptionHandler

Responsible for converting that problem into an appropriate API response.

Example:

> HTTP 404 NOT FOUND + ApiResponse

### Controller

Responsible mainly for receiving the request and returning the normal successful response.

---

# 7. SKCP Architecture
The preferred exception-handling architecture is:

```text
CustomerController
        ↓
CustomerService
        ↓
Business problem detected
        ↓
ResourceNotFoundException
        ↓
GlobalExceptionHandler      
        ↓
ApiResponse
        ↓
HTTP Response
        ↓
Postman / React
```
This keeps exception-handling logic centralized.

---

## 8. `return null` vs `throw`


| Approach | Meaning | Handling |
|---|---|---|
| `return null` | No value was returned | Caller must check for `null` |
| `throw` | An exceptional situation occurred | Exception handler handles it |
| `return null` | Failure can be hidden inside normal flow | Can lead to repeated null checks |
| `throw` | Failure is explicitly represented | Centralized handling is possible |

---

# 9. Important SKCP Principle

For SKCP, we should distinguish between:

### Normal result

```text
Customer exists
      ↓
Return CustomerResponse
```

### Exceptional result
```text
Customer does not exist
      ↓
throw ResourceNotFoundException
```
The service should not silently treat every exceptional business situation as a normal `null` result.

---

# 10. Key Takeaway

Remember this sentence:

> `return null` communicates **"there is no value"**; `throw` communicates **"an exceptional situation occurred and must be handled."**

For the SKCP `getCustomerById()` case:


```text
Customer exists
      ↓
Return CustomerResponse

Customer does not exist
      ↓
throw ResourceNotFoundException
```

This will allow:


```text
CustomerService
      ↓
ResourceNotFoundException
      ↓
GlobalExceptionHandler
      ↓
ApiResponse
      ↓
HTTP 404
```
---

# 11. Current Learning Boundary

At this stage, we are only learning the difference between:
* `return null`
* `throw`

We have NOT yet changed `CustomerService.java`.


The next concept will be:
What is `ResourceNotFoundException`, and why do we create our own custom exception?
Only after understanding that concept will we modify the code.

---


# Pointer 3 — What is ResourceNotFoundException?

Before touching `GlobalExceptionHandler.java`, we need to understand what this exception actually is and why SKCP creates its own custom exception.

### The basic idea

`ResourceNotFoundException` is a custom exception created by our application to represent one specific business situation:

> The requested resource does not exist.

For SKCP:

```text
GET /api/customers/999
            ↓
CustomerService
            ↓
Customer does not exist
            ↓
ResourceNotFoundException
```
Instead of using a generic exception like:

```text
Exception
```
we create something meaningful:
```text
ResourceNotFoundException
```
That gives the exception a clear business meaning.


### Why "Resource"?

Because later SKCP won't have only customers.

We may have:

```text
Customer
Order
Payment
Product
Inventory
Production
```
So the same exception can represent:


```text
Customer not found
Order not found
Payment not found
Product not found
```
For example:
```text
throw new ResourceNotFoundException("Customer not found");
```

or later:
```text
throw new ResourceNotFoundException("Order not found");
```
The exception type remains the same, while the message changes.


**Why not create `CustomerNotFoundException`**?

We *could* create:
```text
CustomerNotFoundException
OrderNotFoundException
PaymentNotFoundException
```
But that could create many unnecessary exception classes.


Instead, a generic business exception:

```text
ResourceNotFoundException
```
can represent the common **404 Not Found404 Not Found** situation across the application.

### The important architecture

```text
CustomerService
      │
      │ customer does not exist
      ▼
ResourceNotFoundException
      │
      ▼
GlobalExceptionHandler
      │
      ▼
HTTP 404 NOT FOUND
      │
      ▼
ApiResponse
      │
      ▼
Postman / React
```
Notice something important:

**`ResourceNotFoundException` does NOT itself create the HTTP response.**

Its job is simply to **represent the problem.**

The later responsibility of `GlobalExceptionHandler` will be:

> "I received a ResourceNotFoundException, therefore I know this should become HTTP 404."

That separation is very important.

### One-line mental model 

> ResourceNotFoundException = a named signal from the service saying "the requested resource does not exist."

---

# Pointer 4 — What is a Custom Exception?

Before we create `ResourceNotFoundException.java`, we need to understand what "**custom exception**" actually means.

---
### The basic idea
Java already provides many built-in exceptions:


```text
NullPointerException
IllegalArgumentException
IllegalStateException
RuntimeException
```
These are generic programming exceptions.

But SKCP has business-specific situations.

For example:


```text
Customer does not exist
Duplicate customer
Order does not exist
Payment already recorded
Insufficient stock
```
These situations have business meaning.

So we can create our own exception classes.

That is called a:

> Custom Exception

---

### Simple analogy

Think of a hospital.

A generic message might be:
> "Something went wrong."

But a useful message is:
> "Patient record not found."

The second message tells the staff **what actually happened.**


###  Similarly, in SKCP:

> RuntimeException

is generic.

While:
> ResourceNotFoundException

has a specific business meaning.

---

### How the hierarchy works
Our custom exception will ultimately be part of Java's exception hierarchy:

```text
Throwable
   ↓
Exception
   ↓
RuntimeException
   ↓
ResourceNotFoundException
```
This means `ResourceNotFoundException` is still a normal Java exception.

We are simply giving it a **S**

---

## Why extend `RuntimeException`?

For our SKCP business exceptions, we will use

> extends RuntimeException

This makes the exception an **unchecked exception.**

That means Java does not force every method to declare:

> throws ResourceNotFoundException

everywhere.

This keeps our service code cleaner.

For example, conceptually:

```text
public CustomerResponse getCustomerById(Integer id) {

    Customer customer = ...;

    if (customer == null) {
        throw new ResourceNotFoundException("Customer not found");
    }

    ...
}
```
We don't need to add `throws` to the method signature.

---

## Why not use Exception directly?
We could technically create:

```text
public class ResourceNotFoundException extends Exception
```

But that would create a checked exception.

Then Java would force us to explicitly handle or declare it.

For our service-layer business exceptions, that would add unnecessary boilerplate.

Therefore, our SKCP approach is:

```text
Business Exception
       ↓
RuntimeException
       ↓
Custom Exception
```

---
## Custom Exception does NOT handle the error

This is very important.

Creating:
> ResourceNotFoundException

does not mean that the exception is handled.

It only gives the problem a meaningful identity.

Think:
```Text
ResourceNotFoundException
        =
"Customer was not found"
```
Then:

```text
GlobalExceptionHandler
        =
"What should we send to the client?"
```
So:

```text
Custom Exception
      ↓
represents the problem

Global Exception Handler
      ↓
handles the problem
```
---

## SKCP example

Suppose:

> GET /api/customers/999

Customer 999 doesn't exist.

The service will eventually do:


```text
CustomerService
      ↓
Customer not found
      ↓
throw ResourceNotFoundException
```

The exception travels out of the normal execution flow.

Then later:

```text
GlobalExceptionHandler
      ↓
recognizes ResourceNotFoundException
      ↓
HTTP 404 NOT FOUND
      ↓
ApiResponse
```

---

## Why this architecture is useful

We can create different custom exceptions for different business situations.

For example:

```text
exceptions/
│
├── ResourceNotFoundException
├── DuplicateResourceException
└── ...
```
Then each exception has a clear meaning.

Example:
```text
ResourceNotFoundException
        ↓
404 NOT FOUND

DuplicateResourceException
        ↓
409 CONFLICT
```
This is much cleaner than having the entire application throw generic exceptions and trying to guess what went wrong later.

---

## Key takeaway

Remember this:

> A custom exception is a developer-defined exception that gives a specific business or application problem a meaningful name.


For SKCP:
```text
RuntimeException
      ↓
ResourceNotFoundException
      ↓
"Requested resource does not exist"
```
And remember the distinction:

```text
Custom Exception
      ↓
Names / represents the problem



GlobalExceptionHandler
      ↓
Handles the problem



ApiResponse
      ↓
Communicates the result to the client
```
---


# # GlobalExceptionHandler

## 1. What is GlobalExceptionHandler?

`GlobalExceptionHandler` is the central component responsible for handling exceptions thrown by the SKCP backend.

Instead of writing `try-catch` blocks inside every controller, we allow exceptions to travel upward and handle them in one centralized location.

This gives the application a consistent way to convert Java exceptions into meaningful HTTP API error responses.

---

## 2. Why do we need GlobalExceptionHandler?

Without centralized exception handling, every controller may need to handle errors separately.

For example:

```text
CustomerController
    ↓
try-catch
    ↓
return error response

```
Another controller may implement different logic:

```text
SupplierController
    ↓
try-catch
    ↓
different error response

```

This creates:

duplicated code

inconsistent error responses

difficult maintenance

more complicated controllers

inconsistent frontend handling

With `GlobalExceptionHandler`:

```text

Controller
    ↓
Service
    ↓
Exception occurs
    ↓
GlobalExceptionHandler
    ↓
ApiErrorResponse
    ↓
Client
```
The exception-handling responsibility is centralized.

---





















```text


```







































