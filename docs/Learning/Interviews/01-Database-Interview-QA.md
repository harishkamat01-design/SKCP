# Module 3 – Database Interview Questions

---

## Q1. What is a Database?

### Answer

A database is an organized collection of related information that allows data to be stored, managed, and retrieved efficiently.

**SKCP Example:**

Instead of maintaining multiple notebooks for customers, orders, payments, inventory, and production, SKCP stores all business information in a structured database.

---

## Q2. What is a Relational Database?

### Answer

A Relational Database stores data in tables that are connected through relationships.

Examples include PostgreSQL, MySQL, Oracle, and SQL Server.

**SKCP Example:**

Customer, Orders, Products, Payments, and Inventory are stored in separate tables but connected through relationships.

---

## Q3. What is an Entity?

### Answer

An Entity is a real-world business object about which information is stored.

**SKCP Examples:**

- Customer
- Product
- Order
- Supplier
- Labour
- Machine

---

## Q4. What is a Relationship?

### Answer

A Relationship describes how two business entities are connected.

**SKCP Example:**

One Customer places many Orders.

---

## Q5. What is a One-to-Many Relationship?

### Answer

A One-to-Many relationship exists when one record in one table is associated with multiple records in another table.

**SKCP Examples:**

- One Customer → Many Orders
- One Supplier → Many Deliveries
- One Machine → Many Production Batches

---

## Q6. What is a Many-to-Many Relationship?

### Answer

A Many-to-Many relationship exists when multiple records from one table are related to multiple records from another table.

**SKCP Example:**

One Order contains many Products.

One Product appears in many Orders.

---

## Q7. Why do we use a Junction Table?

### Answer

A Junction Table is used to resolve a Many-to-Many relationship because relational databases cannot directly represent this relationship.

**SKCP Example:**

Orders

↓

Order Items

↓

Products

The Order Items table connects Orders and Products.

---

## Q8. Why is Quantity stored in Order Items instead of Products?

### Answer

Quantity does not belong to the Product.

Quantity does not belong to the Order.

It belongs to the relationship between an Order and a Product.

Therefore, Quantity is stored in the Order Items table.

**SKCP Example:**

Order #101

- 4" Block → 150
- 6" Block → 250
- 8" Block → 50

The Product remains the same, but the quantity changes for every order.

---

## Q9. What is Data Ownership?

### Answer

Data Ownership means every piece of information should be stored with the business object that logically owns it.

**Examples**

Product owns:

- Product Name
- Product Size

Order owns:

- Customer
- Order Date

Order Item owns:

- Quantity
- Price
- Discount

---

## Q10. How do you identify database relationships?

### Answer

Relationships are identified by understanding the business process before designing the database.

**SKCP Approach**

Business Analysis

↓

Business Objects

↓

Business Relationships

↓

Database Relationships

↓

Relational Database Design

---
## Q11. What is an Attribute?

Answer:
An Attribute describes an Entity.

SKCP Example:

Customer

Name

Phone Number

Address

WhatsApp Number

---

Section 1
Database Fundamentals

Q1
What is a database?

Q2
Why do we need a database?

...

Section 2
Business Objects

...

Section 3
Primary Keys

...

Section 4
Relationships

...

Section 5
Normalization

...

Section 6
SKCP Case Study

...

Section 7
Real Interview Questions
