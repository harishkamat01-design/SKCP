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
