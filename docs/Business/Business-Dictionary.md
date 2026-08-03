# SKCP Business Dictionary

This document contains the real words, phrases, and terminology used in the day-to-day operations of Shree Kundodari Cement Products.

It serves as the common business language for developers, architects, testers, and future AI components.

# SKCP Business Dictionary

**Project:** SKCP – Shree Kundodari Cement Products

**Document:** Business Dictionary

**Module:** 1 – Business Analysis

**Version:** 2.0

**Status:** Module 1 Frozen

**Author:** Harish Kamat

**Reviewer:** Architect

**Created On:** 24-Jul-2026

**Last Updated:** 31-Jul-2026
---

# Purpose

This document defines the standard business vocabulary used throughout the SKCP project.

It establishes a single source of truth for business terminology across:

- Business Analysis
- Architecture
- Database Design
- Backend Development
- Frontend Development
- Reports
- Future AI Features

Using consistent terminology ensures that developers, architects, testers, and business users communicate using the same language.
---

# Scope

This dictionary contains only business terms used in the daily operations of Shree Kundodari Cement Products.

Technical terms such as API, Repository, DTO, SQL, or REST are intentionally excluded and documented separately in technical documentation.

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
## Purchase

A transaction used to procure raw materials from suppliers.

A Purchase may contain multiple Purchase Items.

---

## Purchase Item

An individual raw material line within a Purchase transaction.

Each Purchase Item records:

- Raw Material
- Quantity
- Purchase Rate
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

The complete physical stock maintained by the factory.

Inventory exists in three stages:

- Raw Material Stock
- Curing Stock
- Finished Goods Stock

Inventory is automatically updated by business transactions and represents the current business position.
---

## Reserved Stock

Blocks that have already been committed to confirmed customer orders but have not yet been delivered.

Reserved Stock is not available for new customer orders.

> **Note:** Reserved Stock is planned for a future version and is **not implemented in Version 1**.

---

## Minimum Stock

The minimum quantity of finished blocks that should always be available.

When stock falls below this level, production should be scheduled.

---
## Order Item

One product line within a customer order.

Each Order Item stores:

- Product
- Quantity
- Unit Price

---

## Delivery Item

One product line delivered during a customer delivery.

---

## Production

The business event of manufacturing cement blocks.

Each Production record stores:

- Product
- Quantity Produced
- Asset Used
- Production Date


## Production Batch

One completed manufacturing cycle producing blocks of a specific product.

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

Finished goods that are ready for immediate customer delivery.

In Version 1, all Finished Goods are considered available because Reserved Stock is not yet implemented.

Future versions may distinguish between:

- Available Stock
- Reserved Stock
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

# Module 3 Database Terms

## Raw Material Stock

Represents the current quantity of each raw material available for production.

It increases through purchases and decreases through production.

---

## Curing Stock

Represents blocks that have been produced but are still undergoing curing.

These blocks are **not ready for sale**.

Blocks remain in Curing Stock until the business owner confirms that curing is complete.

Only after confirmation are they transferred to Finished Goods Stock.

---

## Finished Goods Stock

Represents blocks that are fully cured and available for sale.

This stock is maintained as a single combined quantity for each product variant.

When dispatching products, the business follows a practical **FIFO (First Cured, First Sold)** approach even though individual production batches are not tracked in Version 1.

--
## Finished Goods

Cement blocks that have successfully completed curing and are available for customer sale.

Finished Goods represent sale-ready inventory.



---

## Production / Curing Yard

The covered shed where newly manufactured blocks remain for approximately 3–5 days while curing.

---

## Sales Yard

The open storage area where cured blocks are transferred after the curing period and become available for customer orders.

---

## Trip Number

Identifies the sequence of deliveries for a customer order.

Examples:

- Trip 1 of 3
- Trip 2 of 3
- Trip 3 of 3

This helps track partial deliveries for large orders.

---

## Asset

A production resource owned by the factory.

Examples:

- Block Making Machine
- Mixer
- Vibrator
- Water Tank

Assets support production operations and maintenance planning.

---

## Attendance

Daily record showing whether each labourer was present or absent for work.

Attendance supports labour management and future productivity reporting.

---

## Payment Allocation

The process of distributing one customer payment across one or more outstanding customer orders.
Payment Allocation is automatically created by the system.

Users never create allocation records manually.

This enables:

- Partial payments
- Installment payments
- Multiple orders paid using one payment

---

## Current Position Table

A table that always stores only the latest business state.

Examples:

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

Historical movements are recorded in transaction tables.

---

## Transaction Table

A table that records a business event.

Examples:

- Purchase
- Production
- Order
- Delivery
- Payment

Transaction tables preserve business history.

---
## Business Insight

Information generated from operational data that helps the business owner make better decisions.

Future examples include:

- Production recommendations
- Low stock alerts
- Pending payment reminders
- Sales trends

---

## Header–Detail Pattern

A standard ERP design where one business transaction contains multiple detail records.

Examples:

Purchase
→ PurchaseItem

Order
→ OrderItem

Delivery
→ DeliveryItem

Payment
→ PaymentAllocation

---

## Business Domain

A logical grouping of related business operations.

The SKCP ERP consists of six business domains:

- Master Data
- Procurement
- Production
- Inventory
- Sales
- Finance

---

## Master Data

Business entities that change infrequently and are referenced by transactions.

Examples:

- Customer
- Product
- Supplier
- Labour
- Asset

---

## Transaction Data

Business events that occur over time.

Examples:

- Purchase
- Production
- Order
- Delivery
- Payment

---

## Current Inventory

Tables that always represent the latest inventory position.

Examples:

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

---

# One-Line Memory

If someone uses these words inside the factory, SKCP should understand exactly what they mean.

---

---

# Version Information

**Version:** 2.0

**Status:** Module 1 Frozen

**Created On:** 24-Jul-2026

**Last Updated:** 31-Jul-2026