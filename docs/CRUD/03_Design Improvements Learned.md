## HTTP Header Learned Today: Content-Type

### What is Content-Type?

The `Content-Type` HTTP header tells the server what format the request body is in.

For Spring Boot REST APIs, the most common value is:

```
Content-Type: application/json
```

This tells Spring Boot that the incoming request body contains JSON data.

### Why is it important?

When using:

```java
@RequestBody Supplier supplier
```

Spring Boot reads the `Content-Type` header to determine how to convert the request body into a Java object.

If the header is missing or incorrect, the server may return errors such as:

- 400 Bad Request
- 415 Unsupported Media Type

### Postman Tip

When selecting:

Body → raw → JSON

Postman automatically adds:

| Key | Value |
|------|-------|
| Content-Type | application/json |

### Key Learning

The request body contains the data, while HTTP headers describe the data.

The `Content-Type` header acts as a label that tells Spring Boot how to interpret the incoming request.