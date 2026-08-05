# Labour Module

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Status:** ✅ Completed

---

# Overview

The Labour module manages all labour information for the SKCP factory.

It stores worker details such as:

- Labour Name
- Phone Number
- Address
- Joining Date
- Skill Type
- Daily Wage
- Status

This module serves as the master data source for the Attendance module.

---

# Business Purpose

The Labour table maintains the list of workers employed in the factory.

Each labour record represents one worker.

The Attendance module will reference this table using the Labour ID.

Relationship:

Labour (1)

↓

Attendance (Many)

---

# Database Table

Table Name

labour

Primary Key

labour_id

---

# Entity

Labour.java

Implemented using:

- @Entity
- @Table
- @Id
- @GeneratedValue
- @Column
- @PrePersist

Automatic timestamp generation:

```java
@PrePersist
public void prePersist() {
    this.createdAt = LocalDateTime.now();
}
```

---

# Repository

LabourRepository.java

```java
@Repository
public interface LabourRepository extends JpaRepository<Labour, Integer> {

}
```

Responsibilities:

- Save Labour
- Find Labour
- Update Labour
- Delete Labour

---

# Service

LabourService.java

Business methods:

- getAllLabours()
- getLabourById()
- saveLabour()
- deleteLabour()

Acts as the Business Logic layer between Controller and Repository.

---

# Controller

LabourController.java

Base URL

```
/api/labours
```

Implemented APIs

| Method | Endpoint | Purpose |
|---------|----------|---------|
| GET | /api/labours | Get all labour records |
| GET | /api/labours/{id} | Get labour by ID |
| POST | /api/labours | Create labour |
| PUT | /api/labours/{id} | Update labour |
| DELETE | /api/labours/{id} | Delete labour |

---

# CRUD Verification

Successfully tested:

## Create

POST

```
/api/labours
```

Result

✔ Labour inserted into PostgreSQL

---

## Read All

GET

```
/api/labours
```

Result

✔ Returns all labour records

---

## Read By ID

GET

```
/api/labours/{id}
```

Result

✔ Returns specific labour

---

## Update

PUT

```
/api/labours/{id}
```

Result

✔ Existing labour updated successfully

Important implementation:

Only editable fields are updated.

createdAt remains unchanged.

---

## Delete

DELETE

```
/api/labours/{id}
```

Result

✔ Labour deleted successfully

(Delete tested using temporary demo records.)

---

# PostgreSQL Verification

Verified using pgAdmin.

Confirmed:

- Record creation
- Record update
- Record deletion
- Timestamp generation
- Primary Key generation

The Labour table is synchronized correctly with Spring Boot.

---

# Architecture

```
Postman

↓

LabourController

↓

LabourService

↓

LabourRepository

↓

Hibernate / JPA

↓

PostgreSQL
```

---

# Learning Highlights

Through the Labour module, the following concepts became repetitive and intuitive:

- Spring Boot Layered Architecture
- CRUD Development
- REST API Design
- JPA Entity Mapping
- PostgreSQL Integration
- Constructor Dependency Injection
- ResponseEntity
- HTTP Status Codes
- Postman Testing
- pgAdmin Verification

---

# Business Relationship

The Labour module is the parent entity for Attendance.

Relationship:

```
Labour

1

↓

Attendance

Many
```

Attendance records cannot exist without a valid Labour.

---

# Module Completion

Status

✅ Entity Completed

✅ Repository Completed

✅ Service Completed

✅ Controller Completed

✅ PostgreSQL Verified

✅ CRUD Verified

✅ pgAdmin Verified

---

# Next Module

Module 4

Attendance

Upcoming implementation:

- Attendance Entity
- Attendance Repository
- Attendance Service
- Attendance Controller
- Labour Foreign Key Mapping
- Attendance CRUD
- Foreign Key Validation

---

## Architect's Note

The Labour module establishes the workforce master data for SKCP.

With Labour completed, the project is ready to implement Attendance, which introduces the first parent–child relationship using a foreign key. This marks the transition from standalone master modules to interconnected business modules.