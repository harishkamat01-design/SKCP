---

# Business Workflows Discovered During Module 3

A business workflow is a sequence of business activities performed to achieve a specific business goal.

During Module 3, these workflows were analyzed and translated into future database transactions.

---

# Workflow 1 : Customer Places an Order

## Business Flow

```
Customer

↓

Order Received

↓

Select Products

↓

Enter Quantities

↓

Calculate Amount

↓

Create Order

↓

Update Inventory (Reserved)

↓

Await Delivery
```

## Database Tables Involved

- Customer
- Order
- Order Item
- Product
- Inventory

---

# Workflow 2 : Customer Makes Payment

## Business Flow

```
Customer

↓

Payment Received

↓

Record Payment

↓

Update Payment History

↓

Recalculate Pending Amount

↓

Generate Receipt
```

## Database Tables Involved

- Payment
- Order

> **Note:** Pending Amount is calculated, not stored.

---

# Workflow 3 : Product Delivery

## Business Flow

```
Customer Order

↓

Check Inventory

↓

Load Vehicle

↓

Deliver Products

↓

Confirm Delivery

↓

Update Delivery Record
```

## Database Tables Involved

- Order
- Order Item
- Inventory
- Delivery

---

# Workflow 4 : Production

## Business Flow

```
Raw Materials Available

↓

Production Planning

↓

Machine Setup

↓

Manufacture Blocks

↓

Curing

↓

Move to Finished Inventory
```

## Database Tables Involved

- Production Batch
- Inventory
- Machine
- Labour

---

# Workflow 5 : Inventory Management

## Business Flow

```
Production Completed

↓

Increase Stock

↓

Customer Order

↓

Reduce Available Stock

↓

Update Inventory Status
```

## Database Tables Involved

- Inventory
- Production Batch
- Order Item

---

# Workflow Relationships

The workflows are connected.

```
Customer

↓

Order

↓

Order Item

↓

Inventory

↓

Delivery

↓

Payment

↓

Reports
```

Each completed workflow becomes the input for the next workflow.

---

# Business Workflow Principles

Every workflow should answer:

- Who starts the workflow?
- What business event occurs?
- Which business objects participate?
- Which database tables change?
- What business value is created?

---

# Software Mapping

Every business workflow eventually becomes software.

```
Business Workflow

↓

Database Transactions

↓

Backend APIs

↓

Frontend Screens

↓

Business Reports
```

This ensures that the software reflects the actual business operations.

---

# Key Lesson

A workflow is not a screen.

A workflow is a complete business process that may involve multiple screens, multiple database tables, and multiple backend APIs.

---

# Updated One-Line Memory

Business workflows describe how work moves through the organization, and each workflow eventually becomes database transactions, backend APIs, and frontend features.