# Labour (Master Table)

---

# Purpose

The Labour table stores permanent information about every worker employed in the factory.

It answers the business question:

> "Who works in the factory?"

This table does **not** store attendance or salary calculations.

Those belong to the Attendance transaction table.

---

# Table Structure

| Column | Type | Description |
|---------|------|-------------|
| LabourID (PK) | UUID / INT | Unique labour identifier |
| LabourName | VARCHAR(100) | Full name of the worker |
| Phone | VARCHAR(20) | Mobile number |
| Address | TEXT | Residential address |
| JoiningDate | DATE | Date of joining the factory |
| SkillType | ENUM / VARCHAR | Assigned role (Machine Operator, Mixer, Loader, etc.) |
| DailyRate | DECIMAL(10,2) | Standard daily salary rate (e.g., ₹400) |
| Status | ENUM | Active / Inactive |

---

# Relationships

```
Labour (1)

↓

Attendance (Many)
```

One labour can have many attendance records.

---

# Business Rules

- Every labour has one primary skill.
- Every labour has one standard daily rate.
- Labour records are never deleted.
- A labour can become Inactive.
- Labour information changes rarely.

Therefore, Labour is classified as **Master Data**.

---

# Ownership

| Information | Owner |
|-------------|-------|
| Name | Labour |
| Phone | Labour |
| Address | Labour |
| Joining Date | Labour |
| Skill Type | Labour |
| Daily Rate | Labour |

---

# Example Record

| LabourID | LabourName | SkillType | DailyRate | Status |
|----------|------------|-----------|-----------:|--------|
| LAB001 | Ramesh | Machine Operator | 400.00 | Active |

---

# Design Decisions

- DailyRate belongs to Labour because it represents the worker's standard agreed rate.
- Attendance is not stored here because attendance changes daily.
- Salary is not stored here because it is calculated from attendance.
- This table serves as the master reference for all labour-related transactions.

---

# Future Relationships

```
Labour

↓

Attendance

↓

Weekly Salary (Calculated)

↓

Monthly Salary (Calculated)

↓

Reports
```

---

# Current Status

**Status:** ✅ Frozen

This table is finalized and should not change unless the business introduces new permanent information about labour.