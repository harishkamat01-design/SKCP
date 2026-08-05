# Lesson Learned – Understanding Parent–Child Relationships in JPA

**Date:** 05 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Topic:** First Parent–Child Relationship using JPA (`@ManyToOne`)

---

# Background

While creating the **Attendance** entity, I noticed that instead of declaring:

```java
private Integer labourId;
```

the entity was designed as:

```java
private Labour labour;
```

Initially, it seemed like we were storing the entire Labour table inside the Attendance table.

This led to an important learning about how JPA and Hibernate manage relationships.

---

# Traditional Database Thinking

In a relational database, the Attendance table stores only the foreign key.

Example:

```text
Attendance Table

attendance_id
labour_id
attendance_date
status
```

Here, `labour_id` is simply an integer that points to a record in the Labour table.

---

# JPA Thinking

Instead of working directly with foreign keys, JPA works with **objects**.

Therefore, in Java we write:

```java
private Labour labour;
```

instead of:

```java
private Integer labourId;
```

---

# Why?

Because Hibernate automatically manages the relationship.

Internally, PostgreSQL still stores only:

```text
labour_id
```

But inside Java, Hibernate converts that foreign key into a complete Labour object.

---

# What This Gives Us

Instead of only knowing:

```java
attendance.getLabourId();
```

we can directly access all information about the related labour.

Example:

```java
attendance.getLabour().getLabourName();

attendance.getLabour().getPhone();

attendance.getLabour().getDailyRate();

attendance.getLabour().getSkillType();

attendance.getLabour().getStatus();
```

No additional SQL query needs to be written manually.

Hibernate performs the relationship mapping automatically.

---

# Visual Understanding

## Database

```
Labour
-------

labour_id (PK)

labour_name

phone

daily_rate

...


          1
          │
          │
          ▼

Attendance
-----------

attendance_id (PK)

labour_id (FK)

attendance_date

status
```

Only the **Foreign Key** is stored.

---

## Java Objects

```
Attendance Object

attendanceId

attendanceDate

labour
        │
        ▼

Labour Object

labourId

labourName

phone

dailyRate

skillType

status
```

The Attendance object contains a reference to a Labour object.

---

# Important Clarification

We are **NOT storing the entire Labour table inside the Attendance table.**

Only the foreign key (`labour_id`) is stored in PostgreSQL.

The statement:

```java
private Labour labour;
```

is only a Java object reference.

Hibernate uses the foreign key to automatically retrieve the related Labour record whenever needed.

---

# Relationship Annotation

The relationship is defined using:

```java
@ManyToOne
@JoinColumn(name = "labour_id")
private Labour labour;
```

Meaning:

- Many Attendance records belong to one Labour.
- `labour_id` is the foreign key connecting both tables.

---

# Comparison

## Without JPA Relationship

```java
private Integer labourId;
```

Need to manually query the Labour table to retrieve additional information.

---

## With JPA Relationship

```java
private Labour labour;
```

Can directly access all Labour properties through the object.

---

# Real-World Analogy

Imagine an Attendance Register.

Instead of writing only:

```
Labour ID: 5
```

the system now understands:

```
Labour:
    Name : Ramesh Naik
    Phone : 9876543210
    Daily Rate : ₹455
    Skill : Block Moulding
```

The register still stores only the Labour ID, but the software can automatically retrieve all related information whenever required.

---

# Why This Is Better

- Cleaner code
- Object-Oriented Design
- Less manual SQL
- Automatic relationship management
- Easier navigation between entities
- Industry-standard JPA development

---

# Biggest Takeaway

A relational database stores only the foreign key, but JPA represents that foreign key as a complete Java object, allowing developers to navigate relationships naturally without manually writing SQL joins.

---

# One-Line Learning

**In JPA, we don't work with foreign key IDs directly—we work with related objects, while Hibernate transparently manages the underlying foreign key relationship in the database.**

---

**Prepared By**

Harish Kamat

with ChatGPT