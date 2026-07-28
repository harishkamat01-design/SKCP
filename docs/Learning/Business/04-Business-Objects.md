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

---

# Business Objects Become Database Tables

One of the biggest discoveries during Module 3 was that business objects naturally become database tables.

```
Business Object

↓

Database Entity

↓

Database Table
```

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

# Updated One-Line Memory

Business Objects represent real-world business responsibilities, and each Business Object naturally becomes a database entity with clearly defined ownership.