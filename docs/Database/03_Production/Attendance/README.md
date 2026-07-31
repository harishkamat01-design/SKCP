
# Attendance (Transaction Table)

---

# Purpose

The Attendance table records the daily attendance of every labour working in the factory.

It captures the daily business event of whether a labourer was present, absent, or on a factory holiday.

This information becomes the foundation for calculating weekly salary, monthly salary, attendance reports, and future workforce analytics.

---

# Table Structure

| Column | Type | Description |
|---------|------|-------------|
| AttendanceID (PK) | UUID / INT | Unique attendance record |
| LabourID (FK) | UUID / INT | References the Labour table |
| AttendanceDate | DATE | Working date |
| AttendanceStatus | ENUM | Present / Absent / Holiday |
| LeaveReason | VARCHAR(100) | Personal Leave, Sick Leave, Festival Leave (NULL if Present/Holiday) |
| DailyRate | DECIMAL(10,2) | Daily salary rate applicable on that day |
| DailyAmount | DECIMAL(10,2) | Salary earned for that day |
| Remarks | TEXT | Optional notes |

---

# Relationships

```
Labour (1)

↓

Attendance (Many)
```

One labour can have multiple attendance records throughout their employment.

---

# Business Rules

## Rule 1

One labour can have only one attendance record per working day.

---

## Rule 2

Attendance cannot exist before the labour's Joining Date.

---

## Rule 3

Sunday is always recorded as **Holiday**.

---

## Rule 4

If Attendance Status = Present

```
Daily Amount = Daily Rate
```

---

## Rule 5

If Attendance Status = Absent

```
Daily Amount = 0
```

Leave Reason becomes mandatory.

---

## Rule 6

If Attendance Status = Holiday

```
Daily Amount = 0
```

Leave Reason remains NULL.

---

## Rule 7

Weekly Salary is **calculated**, not stored.

```
Weekly Salary

=

SUM(Daily Amount)

(Monday → Saturday)
```

---

## Rule 8

Monthly Salary is also calculated.

```
Monthly Salary

=

SUM(Daily Amount)
```

---

# Business Event

Example

Ramesh joins the factory.

↓

Attendance starts from his Joining Date.

↓

Every working day creates one Attendance record.

↓

At the end of the week,

the system calculates the Weekly Salary.

---

# Example

| Date | Status | Leave Reason | Daily Amount |
|------|---------|--------------|-------------:|
| Monday | Present | — | 400 |
| Tuesday | Present | — | 400 |
| Wednesday | Present | — | 400 |
| Thursday | Sick Leave | Sick Leave | 0 |
| Friday | Personal Leave | Personal Leave | 0 |
| Saturday | Present | — | 400 |

Weekly Salary

```
400 + 400 + 400 + 0 + 0 + 400

=

₹1600
```

This exactly matches the current manual salary calculation process followed by the factory.

---

# What Does NOT Belong Here

The following information belongs elsewhere.

## Labour

- Labour Name
- Phone
- Joining Date
- Skill Type
- Status

## Weekly Salary

Weekly Salary is calculated from Attendance.

It should never be stored.

## Monthly Salary

Monthly Salary is calculated from Attendance.

It should never be stored.

---

# Architect Decision

Attendance is a **Transaction Table**.

Every working day generates a new attendance transaction.

This design preserves attendance history while supporting future payroll reports and workforce analytics.

---

# Interview Takeaway

Attendance is a classic Transaction Table.

It records a recurring business event that occurs daily.

Rather than storing weekly or monthly salary, modern ERP systems calculate salary from attendance transactions, ensuring accuracy and eliminating redundant data.

---

# Beautiful Symmetry

| Purchase Domain | Labour Domain |
|-----------------|---------------|
| Purchase | Attendance |
| Purchase Item | Daily Attendance |
| Purchase Amount | Daily Amount |
| Purchase Report | Salary Report |

Both modules use transaction tables to record business events and calculate business outcomes.

---

# Architect Lesson

Attendance records what happened each day.

Salary is derived from attendance.

Storing salary would duplicate information and introduce inconsistency.

The database should always store business facts and calculate business results.

---

## Status

Domain:
Production

Data Classification:
Transaction Data

Owner:
Workforce Management

Status:
✅ Frozen

Date:
30th July 2026

**Related Tables**

- Labour
- Weekly Salary (Calculated)
- Monthly Salary (Calculated)
- Future Payroll Reports

---