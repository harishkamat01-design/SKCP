# Lesson Learned – REST API Naming Convention

**Date:** 05 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

---

# Topic

Understanding the difference between **Database Table Names**, **Java Entity Names**, and **REST API Endpoint Names**.

---

# The Question

While implementing the Labour module, I observed that:

Database tables are named in singular form:

```text
customer
supplier
product
labour
raw_material
```

But the REST API endpoints are written in plural form:

```text
/api/customers
/api/suppliers
/api/products
/api/labours
/api/raw-materials
```

Initially, this looked inconsistent, so I wanted to understand the reason.

---

# Key Learning

These names belong to **different layers of the application**, and each layer follows its own naming convention.

---

# Layer 1 – Database

The database stores one record per row.

Therefore, table names are usually singular.

Examples:

```text
customer
supplier
product
labour
raw_material
```

Each row represents one customer, one supplier, one product, etc.

---

# Layer 2 – Java Entity

A Java Entity class represents **one object**.

Therefore, Entity names are also singular.

Examples:

```java
Customer
Supplier
Product
Labour
RawMaterial
```

Each Java object represents one database record.

---

# Layer 3 – REST API

REST APIs expose **collections of resources**.

Therefore, endpoints are generally plural.

Examples:

```text
GET /customers
GET /suppliers
GET /products
GET /labours
GET /raw-materials
```

The endpoint represents an entire collection.

Example:

```text
GET /customers
```

means:

> Return the collection of customers.

Whereas

```text
GET /customers/5
```

means:

> Return customer with ID = 5.

---

# How Spring Boot Connects Everything

```
REST URL

/api/customers

        │

        ▼

CustomerController

        │

        ▼

CustomerService

        │

        ▼

CustomerRepository

        │

        ▼

Customer Entity

        │

        ▼

customer Table (PostgreSQL)
```

Notice:

```
customers   → REST Endpoint

Customer    → Java Entity

customer    → PostgreSQL Table
```

All three names are intentionally different.

---

# Why This Is Good Design

Each layer has a different responsibility.

### Database

Represents data storage.

Uses singular table names.

---

### Entity

Represents one Java object.

Uses singular class names.

---

### REST API

Represents a collection of business resources.

Uses plural endpoint names.

---

# Industry Standard

Most enterprise applications follow this convention.

Examples:

| REST Endpoint | Database Table |
|--------------|----------------|
| /users | user |
| /customers | customer |
| /products | product |
| /orders | order |
| /payments | payment |

This is the standard used by most RESTful APIs.

---

# Observation About Labour

The word **Labour** is technically an uncountable noun in English.

In many enterprise applications, APIs may use:

```text
/workers
```

or

```text
/employees
```

instead of

```text
/labours
```

However, because the SKCP project consistently uses the business term **Labour**, keeping:

```text
/api/labours
```

is acceptable and maintains consistency across the project.

Changing it now would introduce unnecessary inconsistency.

---

# Naming Standard Adopted for SKCP

| Layer | Naming Convention |
|--------|-------------------|
| Database Table | Singular (`customer`, `supplier`, `product`, `labour`) |
| Entity Class | Singular (`Customer`, `Supplier`, `Product`, `Labour`) |
| Repository | Singular (`CustomerRepository`) |
| Service | Singular (`CustomerService`) |
| Controller | Singular (`CustomerController`) |
| REST API | Plural (`/customers`, `/suppliers`, `/products`, `/labours`, `/raw-materials`) |

---

# Key Takeaway

The same business object can have **different names across different architectural layers**, and this is intentional.

- Database focuses on **data storage**
- Entity focuses on **one business object**
- REST API focuses on **collections of resources**

Following these conventions improves readability, maintainability, and aligns the application with industry-standard REST API design.

---

# One-Line Learning

**Database tables represent one entity, Java entities represent one object, and REST endpoints represent collections of resources—therefore singular names are used for tables/entities, while plural names are used for REST APIs.**

---

**Prepared By**

Harish Kamat

with ChatGPT