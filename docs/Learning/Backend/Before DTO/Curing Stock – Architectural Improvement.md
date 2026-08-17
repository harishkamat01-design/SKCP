# Curing Stock – Architectural Improvement
**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Inventory

**Sub-Module:** Curing Stock

**Date:** 06 August 2026

**Author:** Harish Kamat

**Reviewed with:** ChatGPT (Architect)

---

# Objective

During the implementation of the **Curing Stock** module, we revisited the database design to ensure that business rules are placed in the correct architectural layer.

The focus was on the field:

```text
expected_ready_date
```

Initially, it appeared that PostgreSQL could calculate this value automatically.

After architectural review, a better enterprise approach was adopted.

---

# Original Database Design

```sql
expected_ready_date DATE NOT NULL
```

A comment suggested:

```sql
GENERATED ALWAYS AS
(
    production_date + INTERVAL '3 days'
)
```

At first glance, this looked similar to the generated column used in the Production module:

```sql
total_cement_bags
```

---

# Architectural Observation

Although both fields involve calculations, they are **fundamentally different**.

---

## Case 1 – Mathematical Calculation

Example:

```text
Morning Cement Bags

+

Afternoon Cement Bags

=

Total Cement Bags
```

This is a pure mathematical calculation.

There is no business decision involved.

Therefore PostgreSQL is the correct owner.

Example:

```sql
GENERATED ALWAYS AS
(
morning_cement_bags
+
afternoon_cement_bags
)
STORED
```

The database becomes the Single Source of Truth.

---

## Case 2 – Business Rule

Example:

```text
Expected Ready Date

=

Production Date

+

3 Days
```

This is **not** a mathematical rule.

It is a **business rule**.

Today the curing period is:

```
3 Days
```

Tomorrow the business may decide:

- Summer → 2 Days
- Winter → 4 Days
- Premium Blocks → 5 Days
- Rainy Season → 6 Days
- Machine-specific curing
- Product-specific curing

Therefore this rule belongs to the Business Layer.

---

# Final Decision

The database table remains:

```sql
expected_ready_date DATE NOT NULL
```

However,

the value will **NOT** be supplied by the frontend.

Instead,

Spring Boot Service will automatically calculate it.

---

# Service Layer Implementation

```java
expectedReadyDate =
productionDate.plusDays(3);
```

This value is assigned before saving the record.

The user never enters it manually.

---

# Updated Database Table

```sql
CREATE TABLE curing_stock
(
    curing_stock_id SERIAL PRIMARY KEY,

    -- One Production Batch → One Curing Batch
    production_id INT NOT NULL UNIQUE,

    -- Product being cured
    product_id INT NOT NULL,

    -- Quantity currently under curing
    quantity INT NOT NULL
        CHECK (quantity >= 0),

    -- Production completion date
    production_date DATE NOT NULL,

    -- Calculated in Spring Boot Service
    expected_ready_date DATE NOT NULL,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'CURING'
        CHECK (status IN ('CURING', 'READY', 'MOVED')),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_curing_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id),

    CONSTRAINT fk_curing_production
        FOREIGN KEY (production_id)
        REFERENCES production(production_id)
);
```

---

# Why This Design Is Better

## Advantages

### 1. User Simplicity

The frontend never asks the user for the expected ready date.

The system calculates it automatically.

---

### 2. Centralized Business Logic

All curing rules exist in one location:

```
Service Layer
```

instead of being scattered across:

- Frontend
- Database
- Backend

---

### 3. Easier Maintenance

If the curing duration changes:

```
3 Days

↓

5 Days
```

Only one line changes.

```java
productionDate.plusDays(5)
```

No database migration is required.

---

### 4. Future Scalability

Future enhancements become easy.

Example:

```text
If Product = Solid Block 8"

↓

Curing = 5 Days

Else

↓

3 Days
```

or

```text
If Weather = Rainy

↓

Add 2 Extra Days
```

These rules are much easier to implement inside Java than inside SQL.

---

### 5. Better Testing

Business rules inside the Service Layer can be unit tested.

Generated SQL expressions cannot be tested as easily.

---

# Enterprise Design Principle

## Database Owns

- Mathematical calculations
- Generated columns
- Constraints
- Referential integrity

Examples:

```
total_cement_bags

CHECK Constraints

Foreign Keys

NOT NULL
```

---

## Service Layer Owns

Business Rules

Examples:

```
expectedReadyDate

Attendance Daily Rate Lookup

Purchase Total Recalculation

Inventory Movement

Payment Allocation

Workflow Decisions
```

---

# Single Source of Truth

The Service Layer becomes the authoritative owner of business logic.

The database remains responsible only for storing validated business data.

---

# Comparison

## Production Module

Database calculates:

```
Morning Cement

+

Afternoon Cement

=

Total Cement
```

Reason:

Pure arithmetic.

---

## Curing Module

Service calculates:

```
Production Date

+

3 Days

=

Expected Ready Date
```

Reason:

Business Rule.

---

# Architectural Observation

One of the most important software engineering lessons learned during the SKCP project is:

> **Not every calculation belongs in the database.**

A calculation should only be implemented as a PostgreSQL generated column if it is:

- deterministic,
- mathematical,
- and independent of business policy.

If a calculation depends on business decisions or may evolve over time, it belongs in the Service Layer.

---

# Key Takeaways

- Generated columns are ideal for mathematical formulas.
- Business rules belong in the Service Layer.
- The frontend should never ask users for system-derived values.
- Keeping business logic centralized makes the application easier to maintain, extend, and test.
- This design follows enterprise software engineering principles and keeps SKCP flexible for future business changes.

---

# Final Architect Verdict

Keeping `expected_ready_date` as a normal database column while calculating its value in the **Spring Boot Service Layer** is the correct enterprise architecture decision.

It ensures:

- Cleaner separation of responsibilities
- Easier future enhancements
- Better maintainability
- Business-first design
- Long-term scalability

This pattern will be reused throughout the SKCP project whenever business rules determine derived values.

---

**Prepared By**

**Harish Kamat**

with ChatGPT (Architect)