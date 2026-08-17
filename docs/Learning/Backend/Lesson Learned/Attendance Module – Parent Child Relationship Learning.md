# Attendance Module – Parent Child Relationship Learning

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Entity:** Attendance

**Relationship Type:** Parent → Child (Many-to-One)

**Date:** 05 August 2026

---

# Objective

Implement the Attendance module while learning how Spring Boot, JPA, and Hibernate manage relationships between two database tables.

This is the first module in SKCP where one entity depends on another entity through a Foreign Key.

---

# Database Relationship

## Parent Table

```text
Labour
```

Primary Key

```text
labour_id
```

---

## Child Table

```text
Attendance
```

Contains Foreign Key

```text
labour_id
```

Relationship

```text
One Labour

        │

        │

        ├──────────────► Many Attendance Records
```

Example

```text
Labour

ID  Name

1   Ramesh

2   Suresh
```

Attendance

```text
AttendanceID   LabourID

1              1

2              1

3              2

4              1
```

One labour can have many attendance records.

Each attendance belongs to only one labour.

---

# Java Relationship

Instead of writing

```java
private Integer labourId;
```

we wrote

```java
@ManyToOne
@JoinColumn(name = "labour_id")
private Labour labour;
```

This is the biggest conceptual change.

Instead of storing only the Foreign Key,

we store the entire Parent Object.

---

# Why?

Because Attendance belongs to Labour.

An Attendance record should know everything about its Labour whenever required.

Instead of

```text
Attendance

↓

labour_id

↓

Query Labour Table

↓

Get Labour Details
```

Hibernate automatically performs

```text
Attendance

↓

Labour Object

↓

Labour Details Available
```

---

# What Hibernate Does

Hibernate automatically converts

```java
private Labour labour;
```

into

```sql
labour_id
```

inside PostgreSQL.

Developer works with

```java
Labour
```

Database stores

```text
labour_id
```

This is called

Object Relational Mapping (ORM)

---

# Attendance Entity

Contains

```java
@ManyToOne

@JoinColumn(name="labour_id")

private Labour labour;
```

Meaning

Many Attendance

↓

One Labour

---

# Repository Layer

Repository remains exactly the same.

```java
public interface AttendanceRepository
        extends JpaRepository<Attendance, Integer>
{

}
```

No extra SQL required.

Spring Data JPA understands the relationship automatically.

---

# Service Layer

CRUD methods remain simple.

```java
saveAttendance()

getAttendanceById()

getAllAttendance()

deleteAttendance()
```

The Service never manually updates

```text
labour_id
```

Hibernate manages the relationship.

---

# Controller Layer

The Controller accepts an Attendance object.

Example

```java
@PostMapping
```

```java
public ResponseEntity<Attendance>
createAttendance(
@RequestBody Attendance attendance)
```

The request contains the Parent object.

Not just the Foreign Key.

---

# Update Logic

Instead of

```java
setLabourId()
```

we update

```java
existingAttendance.setLabour(attendance.getLabour());
```

This means

Update the Parent Object.

Hibernate automatically updates

```text
labour_id
```

inside PostgreSQL.

---

# Request Flow

```text
Postman

        │

        ▼

AttendanceController

        │

        ▼

AttendanceService

        │

        ▼

AttendanceRepository

        │

        ▼

Hibernate

        │

        ▼

Attendance Entity

        │

        ▼

Labour Entity

        │

        ▼

PostgreSQL
```

---

# Database Flow

Java Object

```java
Attendance

↓

Labour Object
```

Hibernate converts

↓

SQL

```sql
labour_id
```

↓

Database

Attendance Table

---

# Learning Comparison

## Previous Modules

Customer

Supplier

Product

Raw Material

used

```java
private Integer id;
```

No parent relationship.

Independent tables.

---

Attendance is different.

Attendance depends on Labour.

So we use

```java
private Labour labour;
```

instead of

```java
private Integer labourId;
```

---

# Why This Design Is Better

Instead of writing

```java
attendance.getLabourId()
```

and querying again,

we simply use

```java
attendance.getLabour().getLabourName()

attendance.getLabour().getPhone()

attendance.getLabour().getDailyRate()
```

Everything becomes available through one object.

---

# Real World Example

Imagine an Attendance register.

Every attendance belongs to one employee.

Instead of writing only

```text
Employee ID = 5
```

your software already knows

```text
Employee Name

Phone

Daily Rate

Joining Date

Skill Type

Status
```

through the Labour object.

---

# SQL Equivalent

Database stores

```sql
labour_id
```

Java works with

```java
Labour labour;
```

Hibernate connects both automatically.

---

# Biggest Lesson Learned

**In Spring Boot and JPA, relationships are represented using Java Objects, not primitive Foreign Key values.**

The developer works with objects like `Labour`, while Hibernate transparently stores and retrieves the corresponding `labour_id` in PostgreSQL.

---

# Key Concepts Learned

- Parent Table
- Child Table
- Foreign Key
- One-to-Many Relationship
- Many-to-One Mapping
- `@ManyToOne`
- `@JoinColumn`
- Object Relational Mapping (ORM)
- Hibernate Relationship Management
- Parent Object Injection
- Automatic Foreign Key Handling

---

# Confidence Level

⭐⭐⭐⭐⭐

This was the first Parent–Child relationship implemented in the SKCP backend and forms the foundation for future modules such as:

- Purchase → Supplier
- PurchaseItem → Purchase
- Order → Customer
- OrderItem → Order
- Delivery → Order
- Payment → Customer

Understanding this relationship model is a major milestone in mastering Spring Boot backend development.

---

**Prepared By**

Harish Kamat

with ChatGPT