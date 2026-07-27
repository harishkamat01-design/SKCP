# Learning Summary

**Date:** 2026-07-27

---

# Module Covered

## Module 3 – Database Design (Started)

Today's learning marked the beginning of Module 3 by shifting from software architecture to database thinking.

Instead of starting with tables, columns, or SQL, the focus was on understanding how a database represents the real business.

The SKCP factory became the primary learning model for every database concept.

---

## Major Concepts Learned

### Relational Database

A relational database stores business information inside tables connected through relationships.

Relationships are discovered by understanding the business rather than the technology.

---

### One-to-Many Relationships

Studied how one business object can relate to multiple instances of another.

SKCP examples include Customers, Suppliers, Machines and Labour.

---

### Many-to-Many Relationships

Discovered that Orders and Products naturally create a Many-to-Many relationship.

This relationship cannot be stored directly.

---

### Junction Tables

Learned that Junction Tables resolve Many-to-Many relationships.

SKCP example:

Orders

↓

Order Items

↓

Products

---

### Data Ownership

One of today's biggest learnings.

Every piece of information belongs to the business object that owns it.

Examples:

Product → Product Details

Order → Customer

Order Item → Quantity

This principle will guide all future database design decisions.