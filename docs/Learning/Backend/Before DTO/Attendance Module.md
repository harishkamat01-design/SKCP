# Attendance Module – Backend Documentation

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Entity:** Attendance

**Status:** ✅ CRUD Completed

---

# Objective

The Attendance module is responsible for recording the daily attendance of labourers working in the factory.

Each attendance record belongs to one labour and stores a historical snapshot of the labour's daily wage at the time of attendance.

---

# Database Table

```sql
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

# Business Relationship

```
Labour (Parent)

        1
        │
        │
        ▼

Attendance (Child)

        Many
```

One Labour can have many Attendance records.

Every Attendance record belongs to exactly one Labour.

---

# Spring Boot Architecture

```
AttendanceController

        │

        ▼

AttendanceService

        │

        ▼

AttendanceRepository

        │

        ▼

Hibernate / JPA

        │

        ▼

PostgreSQL
```

---

# Entity Created

```
Attendance.java
```

Implemented:

- @Entity
- @Table
- @Id
- @GeneratedValue
- @ManyToOne
- @JoinColumn
- @PrePersist
- Getters
- Setters
- Default Constructor

---

# Repository Created

```
AttendanceRepository.java
```

Extends

```java
JpaRepository<Attendance, Integer>
```

Spring automatically provides:

- findAll()
- findById()
- save()
- deleteById()

---

# Service Created

```
AttendanceService.java
```

Implemented:

- getAllAttendance()
- getAttendanceById()
- saveAttendance()
- deleteAttendance()

---

# Business Logic Added

Unlike previous modules, Attendance includes business logic.

When saving attendance:

1. Read Labour ID.
2. Fetch Labour from database.
3. Read Labour Daily Rate.
4. Copy Daily Rate into Attendance.
5. Calculate Daily Amount.
6. Save Attendance.

Example:

```java
Labour labour =
labourRepository.findById(
attendance.getLabour().getLabourId()
).orElseThrow(...);

attendance.setDailyRate(labour.getDailyRate());

attendance.setDailyAmount(labour.getDailyRate());
```

---

# Why Daily Rate Is Copied

Although Attendance references Labour through a Foreign Key, the Daily Rate is intentionally copied into Attendance.

Reason:

If Labour daily rate changes in the future:

```
Today

Labour Daily Rate = ₹455

↓

Attendance stores ₹455
```

Later:

```
Labour Daily Rate = ₹500
```

Old attendance records should continue showing ₹455.

Attendance stores historical business data.

---

# Controller Created

```
AttendanceController.java
```

Implemented REST APIs:

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/attendance | Get all attendance |
| GET | /api/attendance/{id} | Get attendance by ID |
| POST | /api/attendance | Create attendance |
| PUT | /api/attendance/{id} | Update attendance |
| DELETE | /api/attendance/{id} | Delete attendance |

---

# CRUD Testing

Successfully tested using Postman.

## GET All

```
GET

/api/attendance
```

Result

```
200 OK
```

---

## GET By ID

```
GET

/api/attendance/{id}
```

Verified valid and invalid IDs.

---

## POST

Client sends:

```json
{
    "labour": {
        "labourId": 1
    },
    "attendanceDate": "2026-08-05",
    "attendanceStatus": "PRESENT",
    "remarks": "Regular attendance"
}
```

Backend automatically:

- Fetches Labour
- Reads Daily Rate
- Calculates Daily Amount
- Saves Attendance

---

## PUT

Successfully updated:

- Attendance Status
- Attendance Date
- Leave Reason
- Remarks

Business values (Daily Rate & Daily Amount) are recalculated by the Service layer.

---

## DELETE

Successfully deleted demo attendance records.

Verified in PostgreSQL.

---

# PostgreSQL Verification

Every CRUD operation verified in pgAdmin.

Validated:

- Insert
- Update
- Delete
- Foreign Key Relationship

---

# Business Rules

- Attendance must belong to a valid Labour.
- Daily Rate comes from Labour.
- Daily Amount is calculated by backend.
- Client cannot manipulate payroll values.
- Historical Daily Rate is preserved.

---

# Lessons Learned

## Parent–Child Relationship

```
Labour

      │

      ▼

Attendance
```

Attendance is a Child Transaction Table.

Labour is the Parent Master Table.

---

## Foreign Key

Foreign Keys only validate the relationship.

They do NOT automatically copy business data.

Business values must be copied inside the Service layer.

---

## Backend Responsibility

Frontend sends:

- Labour ID
- Attendance Date
- Attendance Status
- Remarks

Backend determines:

- Daily Rate
- Daily Amount

This protects business integrity.

---

# Module Outcome

Attendance module now supports:

- Parent–Child Mapping
- Foreign Key Validation
- Business Logic
- Historical Data Preservation
- Automatic Rate Calculation
- Production-ready CRUD APIs

---

# Current Backend Progress

Completed Modules:

- Customer ✅
- Supplier ✅
- Product ✅
- Raw Material ✅
- Labour ✅
- Attendance ✅

---

# Next Module

Continue Backend Development with:

- Asset
- Purchase
- Purchase Item
- Inventory
- Production
- Orders
- Delivery
- Payment

---

# Architect Verdict

The Attendance module is the first module that combines:

- Entity Relationships
- Foreign Keys
- Business Rules
- Automatic Data Population
- Historical Snapshot Storage

This represents a major transition from simple CRUD development to enterprise backend development.

Attendance now serves as the reference implementation for all future Parent–Child transaction modules in SKCP.

---

**Prepared By**

Harish Kamat

with ChatGPT 