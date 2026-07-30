# 🏆 Architect Observation 023

# Every Table Exists to Answer One Business Question

---

## Business Situation

During Sprint 2, we noticed something interesting.

Whenever a new table was proposed, the discussion always started with a business question rather than a technical requirement.

Examples:

Product

↓

"What products do we manufacture?"

Order

↓

"What did the customer order?"

Delivery

↓

"What has actually been delivered?"

Payment

↓

"How much money has been received?"

Payment Allocation

↓

"Which orders were settled by this payment?"

Every table naturally emerged from a business question.

---

## Problem

Many databases are designed around entities instead of business questions.

Developers create tables because:

- Every object needs a table.
- Every screen needs a table.
- Every module needs a table.

Over time, tables lose their purpose and begin storing unrelated information.

---

## Discovery

A table should exist only if it answers one important business question.

If a table cannot clearly answer that question, it probably should not exist.

Likewise, if one table answers multiple unrelated questions, it probably needs to be split.

---

## Why It Matters

Business questions define business value.

Tables exist to answer those questions.

This approach produces:

- Cleaner architecture
- Better reporting
- Easier maintenance
- Simpler relationships

Because every table has a clear purpose.

---

## Impact on SKCP

Every table was designed using this principle.

Examples:

Product

Question:

"What products do we manufacture?"

---

Finished Goods Stock

Question:

"What products are available for sale today?"

---

Order

Question:

"What has the customer requested?"

---

Delivery

Question:

"What has actually left the factory?"

---

Payment

Question:

"What money has been received?"

---

Payment Allocation

Question:

"How should this payment reduce outstanding balances?"

Each table answers exactly one business question.

---

## Real Business Example

Instead of asking:

"What columns should this table have?"

We asked:

"What business question should this table answer?"

The columns naturally followed.

---

## Final Architect Principle

> **Never create a table first.**

> **Create a business question first.**

The table is simply the answer.

---

## Future Impact

Whenever a new module is proposed:

- Machinery
- Expenses
- Payroll
- Employees
- AI
- Maintenance

The first step should always be:

"What business question are we trying to answer?"

Only then should database design begin.

---

## Status

| Item | Status |
|------|--------|
| Observation ID | 023 |
| Category | Database Design Philosophy |
| Priority | ⭐⭐⭐⭐⭐ |
| Sprint | Sprint 3 Preparation |
| Status | ✅ Approved |
| Architect | Harish Kamat & ChatGPT |

---

## Related Tables

- Entire Database

---

## Related Observations

- Observation-007 — Every Table Owns Exactly One Responsibility
- Observation-009 — Design Business Flow Before Designing Tables
- Observation-013 — Data Must Live Where It Is Owned
- Observation-020 — Understand the Business Before Writing the First Line of Code