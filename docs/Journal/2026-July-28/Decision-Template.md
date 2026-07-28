# Decision

**Date:** 2026-07-29

---

# Decision 1

## Title

Business Rules Must Drive Database Design

### Decision

Every database table in SKCP will be designed only after understanding the corresponding business process.

### Reason

This ensures that the database reflects real factory operations instead of becoming a collection of unrelated tables.

### Impact

- Easier maintenance
- Better scalability
- Easier backend development
- Business-first architecture

---

# Decision 2

## Title

Data Ownership Before Adding Columns

### Decision

Before adding any column to a table, always ask:

- Who owns this information?
- Does this table have the responsibility for maintaining this data?

### Reason

This prevents duplicate information and keeps each table focused on its own responsibility.

### Impact

Improves normalization and simplifies future development.

---

# Decision 3

## Title

Derived Values Will Not Be Stored

### Decision

Calculated values such as Pending Amount will not be stored in database tables.

Instead, they will be calculated whenever required.

Example:

Pending Amount

=

Order Total

-

Sum(Payments)

### Reason

Storing calculated values increases the risk of inconsistent data.

### Impact

Keeps the database normalized and reduces maintenance effort.

---

# Decision 4

## Title

Business Events Become Transaction Tables

### Decision

Transaction tables represent events that happen in the business.

Examples:

- Order Created
- Payment Received
- Delivery Completed
- Production Completed

### Reason

Thinking in business events naturally leads to a clean database design.

### Impact

This approach mirrors how modern ERP systems are designed.