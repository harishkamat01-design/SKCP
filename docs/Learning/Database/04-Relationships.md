---

# Relationship Types

## One-to-One (1:1)

One record is associated with exactly one other record.

### SKCP Example

One Labour → One Aadhaar Number

---

## One-to-Many (1:N)

One record is associated with many records.

### SKCP Examples

- One Customer → Many Orders
- One Supplier → Many Deliveries
- One Machine → Many Production Batches
- One Labour → Many Attendance Records

---

## Many-to-Many (M:N)

Many records are associated with many records.

### SKCP Example

One Order contains many Products.

One Product appears in many Orders.

---

# Junction (Bridge) Table

A relational database cannot directly store a Many-to-Many relationship.

A Junction Table is introduced to connect the two entities.

### SKCP Example

Orders

↓

Order Items

↓

Products

---

# Why Quantity belongs to Order Items

Quantity does not belong to the Product.

Quantity does not belong to the Order.

Quantity belongs to the relationship between an Order and a Product.

Therefore, it is stored in the Order Items table.

Example:

| OrderID | Product | Quantity |
|---------|---------|----------|
|101|4" Block|150|
|101|6" Block|250|
|101|8" Block|50|

---

# Data Ownership Principle

Always store data where the business logically owns it.

Examples:

Product

- Product Name
- Product Size

Order

- Customer
- Order Date

Order Item

- Quantity
- Price
- Discount

---

# SKCP Learning Bridge™

Factory

↓

Business Relationship

↓

Database Relationship

↓

Interview Answer

---

# Key Takeaways

- Relationships are discovered from business analysis.
- One-to-Many is the most common relationship.
- Many-to-Many requires a Junction Table.
- Good database design mirrors real business operations.
- Data belongs where the business says it belongs.

One-to-One
One-to-Many
Many-to-Many
Foreign Keys
Customer → Order
Order → Order Item
Product → Order Item
Order → Payment
Why Order Item exists.
Relationship flow.

Customer

↓

Order

↓

Order Item

↑

Product

↓

Payment