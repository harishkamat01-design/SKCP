# Why should this exist?
A Business Rule is something that must always be true, regardless of who is working in the factory.

It is different from a workflow.

Example

Workflow: Customer → Order → Dispatch → Payment

Rule:  A product cannot be sold before curing is completed.

The workflow tells you what happens.
The rule tells you what is allowed.

# Based on SKCP, I already know these rules

## Business Rules

Business Rules define the mandatory conditions that govern how SKCP operates.

---

## Rule 1 – Curing Before Sale

Cement blocks must complete the required curing period before they are marked as Ready Stock.

---

## Rule 2 – Inventory Reduces After Dispatch

Finished inventory should decrease only after products leave the factory.

---

## Rule 3 – One Receipt Per Delivery

Every completed delivery generates a separate receipt.

Partial deliveries generate separate receipts.

---

## Rule 4 – Payment Belongs to Delivery

Payment is collected only for the quantity delivered.

If 600 blocks are delivered today and 400 later:

- Receipt 1 → 600 blocks
- Receipt 2 → 400 blocks

---

## Rule 5 – Machine Can Produce One Variant At A Time

The production machine can only produce one mould size at a time.

Changing the mould requires setup time.

---

## Rule 6 – Customer Trust Overrides Speed

Products are never dispatched before they meet quality standards.

Quality takes priority over delivery speed.

---

---

## Rule 7 – Every Business Information Has One Owner

Every piece of business information must belong to exactly one business object.

Examples:

- Customer Name belongs to Customer.
- Product Size belongs to Product.
- Delivery Address belongs to Order.
- Quantity belongs to Order Item.
- Amount Paid belongs to Payment.

This prevents duplicate information and ensures a single source of truth.

---

## Rule 8 – Pending Amount Is Never Stored

Pending Amount should never be stored as a database column.

It must always be calculated as:

Pending Amount = Order Total − Total Payments Received

This guarantees accurate financial information at all times.

---

## Rule 9 – Every Order Must Belong to One Customer

An Order cannot exist without a Customer.

Every Order must reference exactly one Customer.

However, one Customer may place multiple Orders over time.

Relationship:

One Customer → Many Orders

---

## Rule 10 – Every Order Must Contain At Least One Product

An Order without products has no business meaning.

Every Order must contain one or more Order Items.

Relationship:

One Order → Many Order Items

---

## Rule 11 – Products Are Shared Across Multiple Orders

A Product is created once and reused.

The same Product may appear in many different Orders.

Relationship:

One Product → Many Order Items

---

## Rule 12 – Order Items Own Quantity

Quantity does not belong to:

- Customer
- Product
- Order

Quantity belongs only to the Order Item because it describes the relationship between an Order and a Product.

---

## Rule 13 – Master Data Changes Rarely

The following information changes infrequently:

- Customer
- Product
- Supplier
- Machine
- Labour

These are Master Data.

Master Data should not be duplicated inside transaction tables.

---

## Rule 14 – Transaction Data Records Business Events

Business activities create Transaction Data.

Examples:

- Order Created
- Payment Received
- Delivery Completed
- Production Completed

Each business event should create its own transaction record.

---

## Rule 15 – Foreign Keys Preserve Business Relationships

Relationships between business objects must always be maintained using Primary Keys and Foreign Keys.

Examples:

CustomerID → Order

OrderID → Order Item

ProductID → Order Item

OrderID → Payment

This preserves referential integrity throughout the system.

---

## Rule 16 – Inventory Represents Available Stock

Inventory stores only stock-related information.

It should not store:

- Customer information
- Order information
- Payment information

Inventory is responsible only for:

- Current Stock
- Reserved Stock
- Minimum Stock
- Stock Status

---

## Rule 17 – Reserved Stock Cannot Be Sold Again

Once products are reserved for a confirmed customer order, they are no longer available for new customer orders.

Available Stock = Current Stock − Reserved Stock

---

## Rule 18 – Every Business Event Must Be Traceable

Every important business event should leave a permanent record.

Examples:

- Order
- Payment
- Delivery
- Production

The business should always be able to answer:

"What happened?"

"When did it happen?"

"Who was involved?"

---

## Rule 19 – Business Rules Come Before Software Rules

The software should enforce existing business rules.

The software should not create new business rules unless the business decides to change its operations.

Business always owns the rules.

Software enforces them.

---

## Rule 20 – Business Rules Are Permanent

Business workflows may change.

Technology may change.

Programming languages may change.

However, core business rules remain stable and should guide every future database design, backend validation, frontend workflow, and AI recommendation.

## Rule 21 – Production Transforms Inventory, It Does Not Own Inventory

Production is a business process.

It consumes raw material inventory and creates finished goods inventory.

Production should not directly own inventory records.

Relationship:

Raw Material Stock
↓
Production Process
↓
Finished Goods Stock

This separation keeps inventory ownership clear.

## Rule 22 – Inventory Moves Through Business States

Inventory is not just a number.

It represents the current state of business assets.

Example:

Raw Material Available
↓
Consumed in Production
↓
Fresh Product
↓
Curing
↓
Ready Stock
↓
Reserved
↓
Delivered

Each state transition represents a business event.

## Rule 23 – Quality Gates Cannot Be Skipped

Business processes must respect quality checkpoints.

Example:

Production Complete
↓
Curing Complete
↓
Quality Approved
↓
Available For Sale

No workflow should bypass quality validation.

Quality has higher priority than speed.

## Rule 24 – Business History Should Be Preserved

Completed business events should maintain historical accuracy.

Examples:

- Completed Orders
- Completed Payments
- Completed Deliveries
- Completed Production Records

Corrections should be recorded as new events instead of deleting history.

This maintains business trust.

## Rule 25 – Business Events Create Transaction Records

Every important business event should create a permanent transaction record.

Examples:

Customer places order:

↓

Order Transaction


Customer pays:

↓

Payment Transaction


Factory produces blocks:

↓

Production Transaction


Transactions represent business history.


# Architect Summary

Business rules are the foundation of:

- Database constraints
- Backend validations
- API behavior
- Frontend workflows
- AI recommendations

If business rules are unclear, software design will also become unclear.
