package com.skcp.exception;

public class ResourceNotFoundException extends RuntimeException 
{

    public ResourceNotFoundException(String message) 
    {
        super(message);
    }
}




/*
1. What is ResourceNotFoundException?
It is a custom Java exception that we create for situations where the requested business resource doesn't exist.

For SKCP:
Customer not found
Supplier not found
Labour not found
Purchase not found
Raw Material not found
Asset not found

All of these are the same type of problem:
The requested resource does not exist.

So instead of creating completely different logic everywhere, we create one reusable exception:   ResourceNotFoundException
---

2. Why RuntimeException?
This is an important interview question.
RuntimeException is an unchecked exception.
That means Java doesn't force us to write:
try {
    ...
} catch (...) {
    ...
}
around every service method.

That's useful because our exception will eventually be handled centrally by:
GlobalExceptionHandler
rather than every Controller having its own try/catch.

---
3. The architecture we are building:
GET /api/customers/999
          │
          ▼
CustomerController
          │
          ▼
CustomerService
          │
          ▼
Repository
          │
          ▼
Customer doesn't exist
          │
          ▼
ResourceNotFoundException
          │
          ▼
GlobalExceptionHandler
          │
          ▼
HTTP 404



*/