# 🏆 Architect Observation 027

# Validate Every Assumption with the Business

---

## Business Situation

During Sprint 2, many moments occurred where we could have assumed the answer.

Instead, we paused and asked the business.

Examples included:

- Does one delivery always equal one order?
- Does the customer pay in installments?
- Is BatchID required today?
- How is delivery actually confirmed?
- How does your father remember pending payments?
- Can one vehicle carry multiple products?

Every answer came directly from the business owner.

---

## Problem

One of the biggest causes of software failure is assumption.

Developers often assume:

- Business processes
- User behaviour
- Workflows
- Terminology
- Future requirements

Incorrect assumptions become incorrect software.

---

## Discovery

The business always knows more than the software team.

Architecture should therefore be based on verified business facts instead of developer assumptions.

Questions are cheaper than redesign.

---

## Why It Matters

Every validated assumption provides:

- Better requirements
- Better database design
- Better user experience
- Better architecture
- Fewer production issues

An architect should never guess when the business can answer.

---

## Impact on SKCP

Many important design decisions were discovered only because assumptions were validated.

Examples include:

### Delivery Confirmation

Assumption:

Digital proof required.

Reality:

Simple phone call.

---

### BatchID

Assumption:

Not required.

Reality:

Not required today.

Useful tomorrow.

---

### Payment

Assumption:

Every payment belongs to one order.

Reality:

One payment may settle multiple pending orders.

---

### Delivery

Assumption:

One vehicle carries one product.

Reality:

One vehicle carries multiple products.

---

## Real Business Example

Wrong Approach

Developer

↓

Assumes requirement

↓

Writes code

↓

Business rejects feature

Correct Approach

Business

↓

Explains process

↓

Architect validates

↓

Developer implements

The second approach minimizes rework.

---

## Final Architect Principle

> **Never replace a business conversation with a technical assumption.**

Ask.

Validate.

Then design.

---

## Future Impact

This principle should apply before every future feature.

Before implementing:

- AI
- Expenses
- Payroll
- Machinery
- Reports
- Mobile App

The first step should always be:

"Let's verify this with the business."

---

## Status

| Item | Status |
|------|--------|
| Observation ID | 027 |
| Category | Requirements Engineering |
| Priority | ⭐⭐⭐⭐⭐ |
| Sprint | Sprint 3 |
| Status | ✅ Approved |
| Architect | Harish Kamat & ChatGPT |

---

## Related Tables

- Delivery
- Delivery Item
- Payment
- Payment Allocation
- Finished Goods Stock

---

## Related Observations

- Observation-015 — Keep Asking "Why?" Until the Business Cannot Answer Further
- Observation-020 — Understand the Business Before Writing the First Line of Code
- Observation-023 — Every Table Exists to Answer One Business Question