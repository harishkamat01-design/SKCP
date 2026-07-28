# Software Engineering Glossary

| Field | Value |
|-------|-------|
| Project | SKCP – Shree Kundodari Cement Products |
| Document | Software Engineering Glossary |
| Version | 1.0 |
| Status | Living Document |
| Author | Harish Kamat |
| Reviewer | Architect |
| Created On | 2026-07-24 |
| Last Updated | 2026-07-24 |

---

## About this Document

This glossary contains software engineering and architecture terminology learned during the development of the SKCP project.

Each term includes:
- Definition
- SKCP Example
- Industry Example
- Notes (if applicable)

The document will be updated continuously throughout the project.

## 🎓 Stakeholder

### Definition

A stakeholder is any person, group, or organization that has an interest in or is affected by the software system.

### SKCP Example

- Business Owner (Harish's Father)
- Customers
- Transport Provider
- Future Accountant
- Future Employees
- AI Assistant

### Industry Example

For an online banking system:

- Bank Customers
- Bank Employees
- RBI
- Auditors
- Developers
- Security Team

### Notes

A client is usually a stakeholder, but not every stakeholder is the client.

## 🎓 Workflow

### Definition

A workflow is the sequence of business activities performed to complete a specific business process.

### SKCP Example

```text
Customer Enquiry
        ↓
Quotation
        ↓
Order Confirmation
        ↓
Stock Verification
        ↓
Delivery
        ↓
Payment
        ↓
Pending Balance Update (if applicable)
```

### Industry Example

For Amazon:

```text
Browse Product
        ↓
Add to Cart
        ↓
Checkout
        ↓
Payment
        ↓
Shipment
        ↓
Delivery
```

### Notes

A workflow focuses on **how a business process is performed**, not on how the software is implemented. During software development, workflows help architects, developers, and testers understand the sequence of business activities before designing the system.

## 🎓 Business Rule

### Definition

A business rule is a condition or policy that defines how a business operates. These rules ensure that business processes are followed consistently.

### SKCP Example

- Stock must be available before confirming an order.
- Transport charges are calculated separately.
- Customers can have pending payments.
- Quality-approved blocks are added to stock.

### Industry Example

For an airline:

- A passenger cannot board without a valid ticket.
- A flight cannot depart until all safety checks are completed.

### Notes

Business rules describe **what the business requires**. During development, these rules are implemented through software validations and logic.

## 🎓 Business Analyst (BA)

### Definition

A Business Analyst (BA) is a professional who understands the business, gathers requirements, identifies business problems, and translates business needs into clear requirements for the development team.

### SKCP Example

For the SKCP project, Harish acts as the Business Analyst by:

- Understanding his father's business operations.
- Identifying manual challenges.
- Gathering business requirements.
- Documenting business workflows.
- Explaining how the business should operate before development begins.

### Industry Example

In an e-commerce company, a Business Analyst works with business teams to understand requirements such as online ordering, payment processing, inventory management, and delivery tracking. These requirements are then documented for architects and developers.

### Notes

A Business Analyst focuses on understanding **what the business needs**, not **how the software will be built**.

## 🎓 Product Owner (PO)

### Definition

A Product Owner (PO) is responsible for defining the product vision, prioritizing features, and ensuring that the software delivers maximum value to its users.

### SKCP Example

For the SKCP project, Harish's father is the Product Owner because he:

- Owns the business.
- Defines business priorities.
- Explains the business problems.
- Decides which features are most valuable.

Harish also contributes as a Product Owner by transforming these business needs into a software product.

### Industry Example

For Amazon Shopping, the Product Owner decides:

- Which new features should be developed.
- What improvements should be prioritized.
- Which customer problems should be solved first.

### Notes

The Product Owner decides **what should be built and in what priority**, while the development team decides **how it will be built**.

## 🎓 Functional Requirement (FR)

### Definition

A Functional Requirement describes what a software system must do. It defines the features and functions that the application should provide.

### SKCP Example

- Manage Customers
- Create Orders
- Record Payments
- Update Stock
- Generate Reports

### Industry Example

For an online banking application:

- Transfer Money
- View Account Balance
- Download Statements

### Notes

Functional Requirements describe the system's behavior and capabilities.

### Related Terms

- Non-Functional Requirement
- Business Requirement
- Use Case

## 🎓 Non-Functional Requirement (NFR)

### Definition

A Non-Functional Requirement defines how well the software should perform rather than what it should do. It specifies quality attributes such as performance, security, usability, and scalability.

### SKCP Example

- Easy for the Admin to use.
- Secure storage of customer data.
- Fast response during daily operations.
- Support future AI enhancements.

### Industry Example

For an airline reservation system:

- Support thousands of users simultaneously.
- Complete booking within a few seconds.
- Ensure high system availability.

### Notes

Non-Functional Requirements define the quality of the software and influence its overall user experience.

### Related Terms

- Functional Requirement
- Performance
- Security
- Scalability

---

# Database

A structured collection of organized information used to store, retrieve, and manage business data.

SKCP Example:
Stores customers, products, orders, inventory, payments, suppliers, and production records.

---

# Entity

A real-world business object represented as a database table.

SKCP Examples:

- Customer
- Product
- Order
- Payment

---

# Attribute

A property that belongs to an entity.

SKCP Example:

Customer

- Name
- Phone
- Address

---

# Primary Key (PK)

A unique identifier for every record in a table.

Example:

CustomerID

---

# Foreign Key (FK)

A reference to the Primary Key of another table.

Example:

CustomerID inside the Order table.

---

# Relationship

A connection between two entities.

Examples:

Customer → Order

Order → Order Item

Product → Order Item

---

# Business Object

A real-world object that exists in the business before software is built.

Examples:

Customer

Product

Order

Supplier

---

# Master Data

Business information that changes very rarely.

Examples:

Customer

Product

Supplier

---

# Transaction Data

Business information created whenever a business event occurs.

Examples:

Order

Payment

Delivery

Production

---

# Data Ownership

The principle that every piece of information has exactly one owner.

Example:

Customer owns customer details.

Order Item owns Quantity.

Payment owns Amount Paid.

---

# Normalization

The process of organizing data so every table stores only the information it owns.

Goal:

Reduce duplication.

Improve consistency.

---

# Derived Data

Information calculated from existing data instead of stored.

Example:

Pending Amount

= Order Total − Total Payments

---

# Business Event

An action that occurs during business operations.

Examples:

Customer places an Order.

Payment received.

Goods delivered.

Production completed.


