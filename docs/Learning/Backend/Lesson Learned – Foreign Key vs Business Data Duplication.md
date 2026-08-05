# Lesson Learned – Foreign Key vs Business Data Duplication

**Date:** 05 August 2026

**Module:** Attendance Module

**Topic:** Foreign Key Relationships and Business Data Integrity

---

# Situation

While implementing the Attendance module, I noticed an important issue.

The Attendance table contains the following fields:

- labour_id (Foreign Key)
- daily_rate
- daily_amount

Example Labour record:

```json
{
    "labourId": 1,
    "labourName": "Ramesh B Naik",
    "dailyRate": 455.00
}
```

However, while creating Attendance, I was able to send:

```json
{
    "labour": {
        "labourId": 1
    },
    "dailyRate": 750.00
}
```

Spring Boot accepted it because **dailyRate is not part of the foreign key relationship**.

---

# What I Initially Thought

I assumed that because Attendance references Labour through:

```sql
FOREIGN KEY (labour_id)
REFERENCES labour(labour_id)
```

the `dailyRate` would automatically come from the Labour table.

This assumption was incorrect.

---

# What Actually Happens

A Foreign Key only guarantees that:

```
attendance.labour_id
        ↓
must exist in
labour.labour_id
```

Nothing else is synchronized automatically.

The database only checks the ID.

It does **not** copy:

- labour_name
- phone
- skill_type
- daily_rate

These remain independent columns.

---

# Why This Is Important

If the client manually sends:

```
dailyRate = 750
```

while Labour actually has:

```
dailyRate = 455
```

the Attendance table may store incorrect payroll information.

This leads to inconsistent business data.

---

# Correct Enterprise Design

The backend should become the single source of truth.

Instead of trusting the client, the backend should:

1. Receive only the Labour ID.
2. Retrieve the Labour record from the database.
3. Read the Labour's dailyRate.
4. Automatically populate Attendance.dailyRate.
5. Calculate Attendance.dailyAmount.
6. Save the Attendance record.

The frontend should **never** send payroll values.

---

# Correct Flow

```
Frontend
     │
     │ Sends only labourId
     ▼

Attendance Controller
     │
     ▼

Attendance Service
     │
     ├── Find Labour by ID
     │
     ├── Read Labour.dailyRate
     │
     ├── Set Attendance.dailyRate
     │
     ├── Calculate Attendance.dailyAmount
     │
     ▼

Attendance Repository
     │
     ▼

PostgreSQL
```

---

# Principle Learned

**Foreign Keys establish relationships, not automatic data synchronization.**

Only the referenced key is validated.

All other business data must be handled explicitly by the application logic.

---

# Enterprise Rule

A client should only send data that users are allowed to enter.

System-generated or master data (such as rates, prices, taxes, salaries, etc.) should always be fetched by the backend from authoritative tables.

---

# Key Takeaway

**The database ensures referential integrity through foreign keys, while the backend ensures business integrity through service-layer logic.**

Both are equally important for building reliable enterprise applications.

---

**Prepared By**

Harish Kamat

with ChatGPT