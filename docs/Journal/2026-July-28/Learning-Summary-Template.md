# Learning Summary

**Date:** 2026-07-29

---

# Module

Module 3 – Database Design

---

# Major Concepts Learned

## 1. Data Ownership

Every piece of information belongs to one business entity.

Before adding a column to any table, ask:

- Who owns this information?
- Which business object is responsible for maintaining it?

This became the primary design principle while creating the SKCP database.

---

## 2. Normalization in Practice

Normalization means eliminating duplicate information by storing the source of truth only once.

Instead of memorizing normalization rules, I learned to apply them through the SKCP business.

Examples:

- Customer Address belongs to Customer.
- Product Size belongs to Product.
- Delivery Address belongs to Order.
- Amount Paid belongs to Payment.

---

## 3. Master Data vs Transaction Data

Master Data changes rarely.

Examples:

- Customer
- Product
- Supplier
- Machine
- Labour

Transaction Data changes every day.

Examples:

- Order
- Order Item
- Payment
- Delivery
- Production

Understanding this distinction makes database design much easier.

---

## 4. Business Events Become Database Tables

A relational database stores business events rather than just information.

Examples:

- Customer places an Order.
- Order contains multiple Products.
- Customer makes a Payment.
- Factory completes Production.
- Products are Delivered.

Each business event naturally becomes a transaction table.

---

## 5. Foreign Keys Connect Business

Foreign Keys do not duplicate information.

They create relationships between business entities.

Examples:

- CustomerID moves from Customer to Order.
- OrderID moves from Order to Order Item.
- ProductID moves from Product to Order Item.
- OrderID moves from Order to Payment.

This allows every business event to remain connected.

---

## 6. Order Item Solves Many-to-Many Relationships

One Order can contain many Products.

One Product can appear in many Orders.

The Order Item table acts as the bridge between them.

It stores:

- OrderID
- ProductID
- Quantity

This is one of the most important concepts used in ERP systems.

---

## 7. Derived Fields Should Not Be Stored

Some information can always be calculated.

Example:

Pending Amount

=

Order Total

−

Sum(Payments)

Since Pending Amount is derived from existing information, it should not be stored.

This follows both:

- Data Ownership
- Normalization

---

# Today's Biggest Realization

I no longer think:

"What column should I add?"

Instead, I think:

- Who owns this information?
- Can it be calculated?
- Should it be stored?

This is the mindset of a Software Architect rather than simply a database designer.

---

# Interview Learning

I can now confidently explain:

- Why Pending Amount should not be stored.
- Difference between Master Data and Transaction Data.
- Why Foreign Keys exist.
- Why Order Item is necessary.
- How Data Ownership supports Normalization.

These answers are based on understanding the SKCP business rather than memorizing textbook definitions.

---

# Architect's Reflection

Today's learning demonstrated that database design begins with understanding the business.

The correct sequence is:

Business Rule

↓

Data Ownership

↓

Normalization

↓

Database Table

↓

Backend API

↓

Frontend Screen

This approach will continue to guide the design of every remaining module in the SKCP project.