# 📘 SKCP Backend Development Journal
# Module 10 – Purchase Item
## Parent–Child Transaction Module

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Procurement

**Entity:** Purchase Item

**Status:** ✅ CRUD Completed Successfully

**Date Completed:** 05-Aug-2026

---

# 🎯 Objective

Purchase Item stores the individual raw materials purchased within a Purchase.

It is the **Child Transaction** of Purchase.

---

# Business Requirement

One Purchase may contain multiple Raw Materials.

Example

```
Supplier

↓

Purchase

Invoice INV-1001

↓

Purchase Items

------------------------------------
Cement
Sand
Blue Metal
Fly Ash
------------------------------------
```

Without Purchase Item,

the Purchase table cannot identify

- Which material was purchased
- Quantity
- Unit Price
- Line Amount

Therefore Purchase Item becomes mandatory.

---

# Database Table

```sql
purchase_item
```

Primary Key

```
purchase_item_id
```

Foreign Keys

```
purchase_id

raw_material_id
```

---

# Parent–Child Relationship

```
Supplier
        │
        ▼
Purchase
        │
        ▼
Purchase Item
        ▲
        │
Raw Material
```

Purchase Item references

- Purchase
- Raw Material

simultaneously.

---

# Entity Relationship

Purchase

```
One Purchase

↓

Many Purchase Items
```

Raw Material

```
One Raw Material

↓

Many Purchase Items
```

Therefore Purchase Item contains

```java
@ManyToOne
Purchase purchase;

@ManyToOne
RawMaterial rawMaterial;
```

---

# Files Created

```
PurchaseItem.java

PurchaseItemRepository.java

PurchaseItemService.java

PurchaseItemController.java
```

---

# Spring Boot Layer

```
Frontend

↓

Controller

↓

Service

↓

Repository

↓

Hibernate

↓

PostgreSQL
```

---

# CRUD APIs

---

## Create Purchase Item

```
POST

/api/purchase-items
```

Status

```
201 CREATED
```

---

## Get All Purchase Items

```
GET

/api/purchase-items
```

Status

```
200 OK
```

---

## Get Purchase Item By ID

```
GET

/api/purchase-items/{id}
```

Status

```
200 OK

404 NOT FOUND
```

---

## Update Purchase Item

```
PUT

/api/purchase-items/{id}
```

Status

```
200 OK

404 NOT FOUND
```

---

## Delete Purchase Item

```
DELETE

/api/purchase-items/{id}
```

Status

```
204 NO CONTENT

404 NOT FOUND
```

---

# CRUD Testing

Completed Successfully

✔ GET

✔ POST

✔ PUT

✔ DELETE

✔ Verified in PostgreSQL

---

# Sample POST Request

```json
{
    "purchase": {
        "purchaseId": 1
    },
    "rawMaterial": {
        "rawMaterialId": 1
    },
    "quantity": 50,
    "unit": "BAG",
    "unitPrice": 400.00,
    "lineAmount": 20000.00,
    "remarks": "ACC Portland Cement"
}
```

---

# Why Purchase and Raw Material contain NULL values in POST Response?

Example

```json
"purchase": {
    "purchaseId": 1,
    "invoiceNumber": null,
    "purchaseDate": null,
    ...
}
```

This is expected.

Reason

The frontend sends only

```json
{
   "purchaseId":1
}
```

Spring creates

```java
Purchase purchase = new Purchase();

purchase.setPurchaseId(1);
```

Hibernate only needs

```
purchase_id = 1
```

to save the record.

It does NOT automatically fetch

- Invoice Number
- Purchase Date
- Supplier
- Remarks

Similarly

Raw Material

contains only

```
rawMaterialId
```

during POST.

---

# Why GET by ID returns complete data?

GET fetches

```
Purchase Item

↓

Purchase

↓

Raw Material
```

from PostgreSQL.

Therefore

the complete objects are returned.

---

# Difference Between POST and GET

POST

```
Returns

The same object
that was submitted
```

GET

```
Returns

Fresh object

loaded from Database
```

Hence GET displays

complete Purchase

and complete Raw Material.

---

# Current Business Logic

Currently

Frontend sends

```
Line Amount
```

Backend simply stores it.

Current Flow

```
Frontend

↓

Quantity

↓

Unit Price

↓

Line Amount

↓

Backend
```

---

# Future Enterprise Logic

This will change.

Future Flow

```
Frontend

↓

Quantity

↓

Unit Price

↓

Backend Service

↓

Line Amount

↓

Database
```

Formula

```
Line Amount

=

Quantity

×

Unit Price
```

The frontend will never send

```
lineAmount
```

again.

The Service Layer becomes the single source of truth.

---

# Purchase Total Observation

Current

Purchase

contains

```
Total Amount = 15000
```

Purchase Item

contains

```
Line Amount = 45500
```

This mismatch is currently expected because

Purchase Total

is still manually maintained.

---

# Future Business Rule

Purchase Total

will become

```
READ ONLY
```

Formula

```
Purchase Total

=

SUM

(All Purchase Item Line Amounts)
```

Whenever

- Purchase Item Created
- Purchase Item Updated
- Purchase Item Deleted

Backend will automatically

recalculate Purchase Total.

Frontend will never send

```
totalAmount
```

again.

---

# Lessons Learned

## 1

Purchase Item is the first SKCP entity

that references

TWO Parent Tables.

```
Purchase

Raw Material

↓

Purchase Item
```

---

## 2

Foreign Keys only require

```
Primary Key

ID
```

Complete Parent Object

is NOT required.

---

## 3

POST Response

returns

the submitted object.

GET Response

returns

fresh object from Database.

---

## 4

Business Logic belongs

inside

Service Layer.

Never trust

calculated values

coming from Frontend.

---

## 5

Purchase Total

must always be

derived

from Purchase Items.

---

# Procurement Module Status

Completed

```
Supplier

↓

Purchase

↓

Purchase Item
```

Next Phase

```
Raw Material Inventory

↓

Automatic Stock Increase

↓

Automatic Purchase Total Calculation
```

---

# Current Project Progress

```
Master Data

✔ Customer

✔ Supplier

✔ Product

✔ Raw Material

✔ Labour

-----------------------------------

Transactions

✔ Attendance

✔ Purchase

✔ Purchase Item
```

---

# Next Module

➡ Raw Material Inventory Enhancement

followed by

automatic stock update

and

automatic Purchase Total calculation.

---

**Prepared By**

Harish Kamat

with ChatGPT