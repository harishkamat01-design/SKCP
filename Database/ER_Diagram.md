## This file should contain the final visual Entity Relationship Diagram (ERD) for SKCP Version 1.


## Do not create it from scratch manually. Instead, generate it from your finalized database design using a diagramming tool.

## What should ER_Diagram.png contain?
It should visually show:
All 19 Version 1 tables
Primary Keys (PK)
Foreign Keys (FK)
One-to-One (1:1) relationships
One-to-Many (1:N) relationships
Tables grouped by business domain:Master Data
Procurement
Production
Inventory
Sales
Finance

It should be a clean, professional ERD suitable for documentation.

## Recommended layout

                            MASTER DATA
        +-----------+  +-----------+  +-----------+
        | Customer  |  | Supplier  |  | Product   |
        +-----------+  +-----------+  +-----------+
        | Labour    |  | Asset     |  | RawMaterial|
        +-----------+  +-----------+  +-----------+

                PROCUREMENT
        Supplier ───────< Purchase ───────< PurchaseItem >────── RawMaterial

                PRODUCTION
        Product ───────< Production >────── Asset
        Labour ───────< Attendance
        Production ────||──── CuringStock >──── Product

                INVENTORY
        RawMaterial ───||──── RawMaterialStock
        Product ───────||──── FinishedGoodsStock

                SALES
        Customer ───────< Order ───────< OrderItem >────── Product
        Order ──────────< Delivery ─────< DeliveryItem >── Product

                FINANCE
        Customer ───────< Payment ──────< PaymentAllocation >──── Order

## Status
Item	Status
File Name	ER_Diagram.png
Version	2.0
Status	✅ To Be Generated
Module	Module 3 – Database Design


## Recommendation
Generate the ER diagram in a tool such as dbdiagram.io, Draw.io (diagrams.net), or DBeaver/DataGrip from your finalized schema, then export it as PNG and save it as:

docs/Database/ER_Diagram.png

This will become the official ER diagram referenced by your README, data dictionary, relationship summary, and future backend documentation.