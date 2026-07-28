# SKCP Business Dictionary

This document contains the real words, phrases, and terminology used in the day-to-day operations of Shree Kundodari Cement Products.

It serves as the common business language for developers, architects, testers, and future AI components.

---

# Products

## Ettangi Kallu

Solid Cement Block.

Variants:

- 4 inch
- 6 inch
- 8 inch

Also called:

- Cement Block
- Block

---

# Raw Materials

## Reti

Sand used in manufacturing.

---

## Cement Cheela

One cement bag used during production.

---

## Jelly

Stone aggregate used in the manufacturing process.

---

## Water

Water used for mixing raw materials and curing blocks.

---

# Production

## Mould

Machine attachment used to manufacture a specific block size.

Examples:

- 4" mould
- 6" mould
- 8" mould

---

## Curing

The process of allowing cement blocks to gain strength over several days.

Proper curing ensures product quality.

---

## Half Curing

Blocks that have not completed the required curing period.

These should never be supplied to customers.

---

## Production Area

Area where fresh blocks are manufactured.

---

## Selling Area

Area where cured blocks are stored and kept ready for dispatch.

---

# Sales

## Order

Customer request for one or more cement block variants.

---

## Dispatch

Loading finished blocks into a vehicle for delivery.

---

## Receipt

Official receipt issued after receiving payment.

A receipt contains:

- Receipt Number
- Date
- Particulars (4", 6", or 8")
- Amount
- Signature

---

## Pending Payment

Amount yet to be collected from the customer after completed deliveries.

---

# Transportation

## Trip

One vehicle journey between the factory and the customer site.

Example:

One Bajaj Ace carrying 200 blocks equals one trip.

---

## Customer Vehicle

Vehicle arranged by the customer for collecting materials.

---

## Factory Vehicle

Vehicle arranged by SKCP when requested by the customer.

---

# Factory Operations

## Current Gone

Electricity outage.

Production stops until electricity returns.

---

## Wednesday Maintenance

Every Wednesday (10 AM – 4 PM), scheduled electricity shutdown is used for:

- Machine servicing
- Mould replacement
- Factory maintenance
- Customer vehicle loading

---

# Labour

## Labour

Workers involved in manufacturing operations.

---

## Absent Labour

Workers who do not report for duty on a given day.

---

# Time

## Dina

Days.

---

# Business

## Stock

Total finished blocks available for sale.

---

## Production Planning

Daily planning of manufacturing based on:

- Customer demand
- Stock availability
- Raw materials
- Labour availability

---

## Founder Knowledge

Business decisions based on more than 12 years of practical experience in cement block manufacturing.

This knowledge forms the foundation of future AI recommendations.

---

# Database & Operations

## SKU (Stock Keeping Unit)

A unique code used to identify each product variant.

Examples:

- SB-4816 (4-inch Solid Block)
- SB-6816 (6-inch Solid Block)
- SB-8816 (8-inch Solid Block)

SKU uniquely identifies a product throughout inventory, sales, and reporting.

---

## Inventory

The current quantity of finished cement blocks available for sale.

Inventory increases through production and decreases through customer sales.

---

## Reserved Stock

Blocks that have already been committed to confirmed customer orders but have not yet been delivered.

Reserved Stock is not available for new customer orders.

---

## Minimum Stock

The minimum quantity of finished blocks that should always be available.

When stock falls below this level, production should be scheduled.

---

# Sales & Payments

## Advance Payment

A payment received before the complete order amount is settled.

Advance payments reduce the customer's pending balance.

---

## Partial Payment

A payment received for only part of the total order value.

Customers may make multiple partial payments until the order is fully paid.

---

## Final Settlement

The payment that clears the remaining outstanding balance of an order.

After the final settlement, the customer's pending payment becomes zero.

---

# Production Planning

## Available Stock

Finished blocks currently ready for immediate sale and delivery.

Available Stock excludes blocks that are reserved for existing customer orders.

---

## Production Batch

A group of cement blocks manufactured together during one production cycle.

Each production batch uses the same raw materials, mould, labour, and production date.

---

# Business Intelligence

## Business Event

An activity that changes the business state.

Examples:

- Customer places an Order
- Factory completes Production
- Customer makes a Payment
- Products are Delivered

These events become transaction records in the software system while accurately reflecting real factory operations.

---

# One-Line Memory

If someone uses these words inside the factory, SKCP should understand exactly what they mean.