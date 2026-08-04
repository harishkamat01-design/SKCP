# Repository Layer

Since the **Supplier Entity** has been completed, the next layer in the Spring Boot architecture is the **Repository Layer**.

---

# Spring Boot Architecture Flow

```text
PostgreSQL Table
        ↓
JPA Entity ✅
        ↓
Repository
        ↓
Service
        ↓
Controller
        ↓
REST API
```

---

# What is a Repository?

A **Repository** is the **Data Access Layer (DAL)** of a Spring Boot application.

Its primary responsibility is to communicate with the database.

Instead of writing SQL queries manually, Spring Data JPA automatically generates the required database operations.

Think of the Repository as the bridge between the Service Layer and the Database.

```text
Service
   │
   ▼
Repository
   │
   ▼
Database
```

The Service layer should never communicate directly with PostgreSQL.

---

# Responsibilities of a Repository

A Repository is responsible for:

- Saving records
- Retrieving records
- Updating records
- Deleting records
- Executing database queries

A Repository **should not contain business logic**.

Business logic belongs in the Service Layer.

---

# Folder Structure

```text
backend
└── src
    └── main
        └── java
            └── com
                └── skcp
                    └── repository
                        ├── CustomerRepository.java
                        └── SupplierRepository.java
```

---

# SupplierRepository.java

```java
package com.skcp.repository;

import com.skcp.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {

}
```

---

# Line-by-Line Explanation

## 1. Package Declaration

```java
package com.skcp.repository;
```

Defines the package where the repository belongs.

This helps organize the project into logical layers.

---

## 2. Import Entity

```java
import com.skcp.entity.Supplier;
```

Imports the `Supplier` entity.

The repository will perform database operations on Supplier objects.

---

## 3. Import JpaRepository

```java
import org.springframework.data.jpa.repository.JpaRepository;
```

`JpaRepository` is provided by Spring Data JPA.

It automatically generates standard CRUD operations, eliminating the need to write SQL queries manually.

---

## 4. Import Repository Annotation

```java
import org.springframework.stereotype.Repository;
```

Imports the `@Repository` annotation.

This tells Spring that this interface belongs to the Repository Layer.

---

## 5. Repository Annotation

```java
@Repository
```

Marks this interface as a Spring Repository Bean.

Spring Boot automatically detects and manages it during application startup.

---

## 6. Repository Interface

```java
public interface SupplierRepository
```

Repositories are created as **interfaces**, not classes.

Spring Boot automatically creates the implementation during runtime.

There is no need to manually write:

```java
class SupplierRepositoryImpl
```

Spring handles it automatically.

---

## 7. Extending JpaRepository

```java
extends JpaRepository<Supplier, Integer>
```

This tells Spring Boot:

- The Repository manages the **Supplier** entity.
- The Primary Key type of Supplier is **Integer**.

This is equivalent to saying:

```text
Entity
Supplier

Primary Key
Integer
```

Spring Boot now automatically generates all CRUD methods.

---

# CRUD Methods Available Automatically

Without writing any additional code, the following methods become available:

```java
save()

findAll()

findById()

delete()

deleteById()

count()

existsById()

saveAll()
```

No SQL queries are required.

Spring Data JPA generates them automatically.

---

# Repository in Overall Architecture

```text
Database
      ▲
      │
Repository
      ▲
      │
Service
      ▲
      │
Controller
      ▲
      │
Frontend
```

The Repository acts as the communication layer between the Service Layer and the Database.

---

# Learning Summary

Today I learned:

- What a Repository is
- Why Spring Boot uses Repository Interfaces
- How `JpaRepository` automatically provides CRUD operations
- The purpose of the `@Repository` annotation
- The role of the Repository in the layered architecture
- Why business logic should never be written inside the Repository

---

# Key Takeaway

The Repository Layer is responsible **only for database access**.

It should not contain any business rules or business logic.

Spring Data JPA significantly reduces boilerplate code by automatically generating standard database operations.

---

# Next Step

After completing the Repository Layer, the next component is:

**Supplier Service**

The Service Layer will contain the business logic and use the Repository to interact with the database.