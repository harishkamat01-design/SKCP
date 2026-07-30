# 🏆 Architect Observation 015

# Keep Asking "Why?" Until the Business Cannot Answer Further

---

## Business Situation

Throughout the SKCP project, almost every design decision began with another question.

Examples:

- Why do we need Curing Stock?
- Why should BatchID remain?
- Why separate Payment and Payment Allocation?
- Why is Delivery different from Order?
- Why not store Pending Amount?

Instead of accepting the first answer, we kept asking "Why?"

Each answer revealed another layer of business understanding.

---

## Problem

Many software projects stop questioning too early.

They hear a requirement and immediately begin coding.

As a result:

- Wrong assumptions become software.
- Hidden business rules remain undiscovered.
- Redesign becomes inevitable.

---

## Discovery

The first answer is rarely the real answer.

The fifth answer often reveals the true business requirement.

Architects discover requirements.

Developers often receive them.

---

## Why It Matters

Every "Why?" removes one incorrect assumption.

Every removed assumption produces:

- Better design
- Cleaner database
- Simpler software
- Fewer future changes

Good architecture is built from understanding—not guessing.

---

## Impact on Database Design

Many tables exist today because we continued asking "Why?"

Examples:

### Curing Stock

Initially:

Production → Finished Goods

Question:

"Why can't we sell immediately?"

Answer:

Because curing takes three days.

Result:

Curing Stock was created.

---

### Payment Allocation

Initially:

Payment linked directly to Order.

Question:

"What happens if one payment covers multiple orders?"

Result:

Payment Allocation was created.

---

### Delivery Confirmation

Question:

"How does the business know delivery actually happened?"

Answer:

Phone call.

Result:

Delivery Confirmation table was created.

---

## Real Business Example

Instead of asking:

"What table should we create?"

We asked:

"What happens after production?"

↓

"Curing."

↓

"What happens after curing?"

↓

"Finished Goods."

↓

"What happens after Finished Goods?"

↓

"Delivery."

The workflow appeared naturally.

The tables followed.

---

## Final Architect Principle

> **Never stop at the first answer.**

> **Keep asking "Why?" until the business has nothing more to explain.**

That final answer is usually the real requirement.

---

## Future Impact

This principle should be used in every future module.

Whether designing:

- Payroll
- Expenses
- Maintenance
- AI
- Reports

Always begin with:

"Why?"

Instead of:

"What table?"

---

## Status

| Item | Status |
|------|--------|
| Observation ID | 015 |
| Category | Requirements Engineering |
| Priority | ⭐⭐⭐⭐⭐ |
| Sprint | Sprint 2 |
| Status | ✅ Approved |
| Architect | Harish Kamat & ChatGPT |

---

## Related Tables

- All Database Tables

---

## Related Observations

- Observation-009 — Design Business Flow Before Designing Tables
- Observation-012 — A Strong Foundation Reduces Future Rework
- Observation-014 — The Business Records Events, Not Data