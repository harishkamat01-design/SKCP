# Table Review 10 — Attendance

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Attendance

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Attendance table stores the daily attendance records of labour working in the factory.

This is a **Transaction Table**.

It references:

- Labour

It is used for:

- Daily attendance tracking
- Weekly salary calculation
- Labour reporting
- Payroll history

Attendance records represent a **business event** that occurs every working day.

---

## Business Owner

Production Domain

---

## Table Type

Transaction Table

---

## Primary Key

AttendanceID

### Purpose

Uniquely identifies every attendance record.

No two attendance records can share the same AttendanceID.

---

## Foreign Keys

### LabourID

References the Labour table.

Each attendance record belongs to one labour.

Relationship:

Labour

↓

Attendance

---

## Architecture Validation

| Check | Status |
|--------|--------|
| Business Driven | ✅ |
| Single Responsibility | ✅ |
| Normalized | ✅ |
| Future Ready | ✅ |
| Business Rules Covered | ✅ |

---

## Architect Verdict

Approved without structural changes.

---

# Step 2 — PostgreSQL Physical Table

```sql
-- ==========================================================
-- Table : attendance
-- Domain: Production
-- Purpose: Stores daily labour attendance records
-- ==========================================================

CREATE TABLE attendance
(
    attendance_id SERIAL PRIMARY KEY,

    labour_id INT NOT NULL,

    attendance_date DATE NOT NULL,

    attendance_status VARCHAR(10)
        NOT NULL
        CHECK (attendance_status IN ('PRESENT', 'ABSENT', 'HOLIDAY')),

    leave_reason VARCHAR(100),

    daily_rate DECIMAL(10,2) NOT NULL,

    daily_amount DECIMAL(10,2) NOT NULL,

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attendance_labour
        FOREIGN KEY (labour_id)
        REFERENCES labour(labour_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE attendance
```

### SQL Syntax

Creates a new table named **attendance**.

### Database Concept

Stores daily attendance transactions.

### SKCP Context

Every labour attendance for every working day is stored here.

---

## Line 2

```sql
attendance_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates Attendance IDs.

### Database Concept

Primary Key uniquely identifies each attendance record.

### SKCP Context

Each attendance entry receives its own unique ID.

---

## Line 3

```sql
labour_id INT NOT NULL
```

### SQL Syntax

Stores the Labour ID.

### Database Concept

Foreign Key reference to Labour.

### SKCP Context

Identifies which labour attended work.

---

## Line 4

```sql
attendance_date DATE NOT NULL
```

### SQL Syntax

Stores the working date.

### Database Concept

Every attendance record belongs to one specific day.

### SKCP Context

Example:

2026-07-31

---

## Line 5

```sql
attendance_status VARCHAR(10)
CHECK (...)
```

### SQL Syntax

Allows only:

- PRESENT
- ABSENT
- HOLIDAY

### Database Concept

CHECK constraint protects data integrity.

### SKCP Context

Only valid attendance statuses can be stored.

---

## Line 6

```sql
leave_reason VARCHAR(100)
```

### SQL Syntax

Optional leave reason.

### Database Concept

NULL when labour is Present or Holiday.

### SKCP Context

Examples:

- Sick Leave
- Personal Leave
- Festival Leave

---

## Line 7

```sql
daily_rate DECIMAL(10,2)
```

### SQL Syntax

Stores the salary rate applicable that day.

### Database Concept

Historical value.

Even if Labour's salary changes later, old attendance records remain unchanged.

### SKCP Context

Example:

₹450/day

---

## Line 8

```sql
daily_amount DECIMAL(10,2)
```

### SQL Syntax

Stores the salary earned for that day.

### Database Concept

Historical transaction amount.

### SKCP Context

Example:

Present → ₹450

Absent → ₹0

Holiday → ₹0 (or business rule)

---

## Line 9

```sql
remarks TEXT
```

### SQL Syntax

Optional notes.

### Database Concept

Stores exceptional situations.

### SKCP Context

Examples:

- Half Day
- Worked Overtime
- Late Arrival

---

## Line 10

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores record creation date and time.

### Database Concept

Audit field.

### SKCP Context

Useful for reports and debugging.

---

## Line 11

```sql
FOREIGN KEY (labour_id)
REFERENCES labour(labour_id)
```

### SQL Syntax

Creates the relationship with Labour.

### Database Concept

Each attendance belongs to one labour.

### SKCP Context

Without a valid labour, attendance cannot exist.

---

# Step 4 — Architect Notes

### Why store DailyRate here?

Salary may change in the future.

Old attendance must preserve historical salary.

---

### Why store DailyAmount?

Payroll reports become much faster.

Historical salary remains unchanged.

---

### Why Attendance is a Transaction Table?

Attendance is an event.

It happens every day.

It records business history.

---

### Why Attendance references Labour?

Labour information belongs only in Labour.

Attendance should not duplicate labour data.

---

# Step 5 — Validation Checklist

| Validation | Status |
|------------|--------|
| Business Rule Verified | ✅ |
| Naming Convention | ✅ |
| PostgreSQL Compatible | ✅ |
| Normalized | ✅ |
| Data Integrity | ✅ |
| Future Ready | ✅ |
| Spring Boot Friendly | ✅ |

---

# Step 6 — Architect Approval

## Attendance Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (Attendance.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Weekly Salary Calculation

---

# 📘 Lesson Summary

Today you additionally learned:

- Transaction Tables represent business events.
- Foreign Keys connect transactions to Master Data.
- Historical salary should be preserved.
- Daily attendance becomes the foundation for payroll.
- Transaction tables often store historical values intentionally.

---

## Architect Verdict

Excellent.

The Attendance table follows ERP best practices by separating Labour Master information from daily attendance transactions.

It provides a solid foundation for payroll, reporting, and future HR analytics.