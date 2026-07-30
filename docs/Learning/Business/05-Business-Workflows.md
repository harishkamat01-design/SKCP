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
Raw Material Received
↓
Raw Material Stock Increased
↓
Production Consumes Materials
↓
Finished Goods Created
↓
Finished Goods Stock Increased
↓
Customer Order
↓
Stock Reserved
↓
Delivery Completed
↓
Stock Reduced
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

# Workflow Ownership

Every workflow has a primary business owner.

| Workflow | Primary Owner |
|----------|---------------|
| Customer Order | Sales Domain |
| Payment Collection | Sales / Finance Domain |
| Product Delivery | Sales Domain |
| Production | Production Domain |
| Inventory Management | Inventory Responsibility |

Ownership helps define:

- Database responsibility
- Backend service boundaries
- API ownership
- Future scalability

---

# Workflow State Transition Thinking

Business workflows change the state of business objects.

Example:

## Order Lifecycle

Order Created
↓
Order Confirmed
↓
Production Planned
↓
Ready For Delivery
↓
Delivered
↓
Payment Completed

Each state change represents a business event.

Future backend services should manage these transitions.


---

# Business Workflow Principles

Every workflow should answer:

- Who starts the workflow?
- What business event occurs?
- Which business objects participate?
- Which database tables change?
- What business value is created?

---

# Workflow Exception Scenarios

Real businesses also contain exceptions.

Examples:

## Order Workflow

Normal:

Customer Order

↓

Stock Available

↓

Delivery


Exception:

Customer Order

↓

Stock Shortage

↓

Production Required


---

## Payment Workflow

Normal:

Payment Received

↓

Payment Recorded


Exception:

Payment Pending

↓

Follow-up Required


---

## Production Workflow

Normal:

Raw Material Available

↓

Production


Exception:

Material Shortage

↓

Purchase Required


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

# Architect Lesson

A workflow represents business behavior.

Tables store the result of business behavior.

Backend services execute workflow rules.

Therefore:

Workflow understanding should come before API design.

---

# Key Lesson

A workflow is not a screen.

A workflow is a complete business process that may involve multiple screens, multiple database tables, and multiple backend APIs.

---

# Updated One-Line Memory

Business workflows describe how work moves through the organization, and each workflow eventually becomes database transactions, backend APIs, and frontend features.