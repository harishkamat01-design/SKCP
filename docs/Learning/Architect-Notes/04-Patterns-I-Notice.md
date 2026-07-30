# Patterns I Notice

---

Pattern 1

Every business event becomes a transaction table.

Examples:

Order

↓

Payment

↓

Delivery

↓

Production

---

Pattern 2

Every transaction references Master Data.

Customer

↓

Order

↓

Order Item

↓

Product

---

Pattern 3

Whenever duplicate information appears,

Normalization is required.

Whenever ownership is unclear,

Data Ownership must be reconsidered.

---

Pattern 4

# Business Flow Pattern

Supplier

↓

Purchase

↓

Purchase Item

↓

Raw Material


Customer

↓

Order

↓

Order Item

↓

Product

----

Pattern 5
