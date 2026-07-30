---

# Business Objects Identified During Module 3

During database design, the SKCP business objects became much clearer.

Each business object represents something important to the business and later becomes a database entity.

---

# Master Business Objects

These objects define the business.

| Business Object | Primary Responsibility |
|-----------------|------------------------|
| Customer | Places orders and makes payments |
| Product | Defines the cement block variants |
| Supplier | Supplies raw materials |
| Inventory | Tracks available finished stock |
| Labour | Performs production activities |
| Machine | Manufactures cement blocks |

Master Business Objects change rarely.


# Inventory Business Object Clarification

Inventory represents the current truth of the business.

SKCP has two important inventory states:

## Raw Material Stock

Purpose:

Tracks available production materials.

Examples:

- Cement
- Sand
- Jelly
- Water


## Finished Goods Stock

Purpose:

Tracks manufactured products ready for sale.

Examples:

- 4 inch Solid Blocks
- 6 inch Solid Blocks
- 8 inch Solid Blocks


Production transforms one inventory state into another.
---

# Transaction Business Objects

These objects represent business activities.

| Business Object | Business Event |
|-----------------|----------------|
| Order | Customer places an order |
| Order Item | Products included in an order |
| Payment | Customer pays for an order |
| Delivery | Products delivered to customer |
| Production Batch | Blocks manufactured during production |

Transaction Business Objects change every day.

---

# Business Objects by Domain

Business objects naturally belong to business domains.

| Domain | Business Objects |
|--------|------------------|
| Raw Materials | Supplier, Purchase, Purchase Item, Raw Material |
| Production | Production, Production Item, Curing, Machine, Labour |
| Sales | Customer, Product, Order, Order Item, Delivery |
| Finance | Payment, Payment Allocation |

This domain ownership helps create clear software boundaries.

---

# Business Object Relationships

Business objects are connected through real business operations.

```
Customer

↓

Order

↓

Order Item

↓

Product

↓

Inventory

↓

Delivery

↓

Payment
```

Each relationship reflects an actual factory process.

---

# Business Object Ownership

Every business object owns specific information.

| Business Object | Owns |
|-----------------|------|
| Customer | Name, Phone, Address, WhatsApp |
| Product | SKU, Size, Unit Price |
| Inventory | Current Stock, Reserved Stock, Minimum Stock |
| Order | Order Date, Customer, Delivery Address |
| Order Item | Quantity, Unit Price, Discount |
| Payment | Amount Paid, Payment Method, Transaction Reference |

No information should belong to more than one business object.

# Ownership and Calculation Principle

Not every value should be stored.

Some values should be calculated from business events.

Example:

Pending Amount

Should be:

Total Order Amount

-

Payments Received


Instead of storing a separate Pending Amount field.

This prevents data inconsistency.
---

# Business Objects vs Business Processes

A business object represents "what exists".

A business process represents "what happens".

Examples:

## Business Objects

- Customer
- Product
- Inventory
- Order


## Business Processes

- Purchasing
- Production
- Delivery
- Payment Collection


Processes create changes in business objects.

Objects store the current business truth.

---

# Business Objects Become Database Tables

One of the biggest discoveries during Module 3 was that business objects naturally become database tables.

```
# Complete Transformation Flow

Business Object
    ↓
Database Entity
    ↓
Backend Entity Class
    ↓
API Model
    ↓
Frontend Representation 


The same business concept travels through the complete software system.

Examples:

Customer → Customer Table

Product → Product Table

Order → Order Table

Payment → Payment Table

This makes database design much easier because the business already defines the structure.

---

# Business Object Principle

Before creating any database table, identify the corresponding business object.

Then ask:

- What is its responsibility?
- What information does it own?
- How does it interact with other business objects?

Only then should the database table be designed.

---

# Architect Lesson

The quality of software design depends on the quality of business object identification.

If business objects are unclear:

- Database becomes confusing
- APIs become inconsistent
- Business logic becomes difficult to maintain

Clear business objects create clear software architecture.

---

# Updated One-Line Memory

Business Objects represent real-world business responsibilities, and each Business Object naturally becomes a database entity with clearly defined ownership.