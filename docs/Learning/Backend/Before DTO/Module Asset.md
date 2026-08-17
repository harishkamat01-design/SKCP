# SKCP Backend Development Journal
# Module: Asset
**Version:** 1.0  
**Status:** ✅ Completed  
**Author:** Harish Kamat  
**Project:** SKCP – Shree Kundodari Cement Products ERP

---

# Module Overview

The **Asset Module** is the final Master Data module in SKCP.

It stores all factory assets such as:

- Block Making Machines
- Hydraulic Machines
- Vibrator Machines
- Concrete Mixers
- Generators
- Water Pumps
- Forklifts
- Office Equipment

The Asset module acts as the foundation for future:

- Maintenance
- Repairs
- Breakdowns
- Depreciation
- Asset History
- Asset Costing

---

# Database Table

Table Name

```text
asset
```

Primary Key

```text
asset_id
```

Columns

| Column | Description |
|----------|-------------|
| asset_id | Primary Key |
| asset_name | Name of Asset |
| asset_category | Machine / Vehicle / Equipment |
| manufacturer | Manufacturer Name |
| model_number | Model Number |
| serial_number | Manufacturer Serial Number |
| purchase_date | Purchase Date |
| installation_date | Installation Date |
| location | Factory Location |
| status | ACTIVE / MAINTENANCE / OUT_OF_SERVICE |
| last_maintenance_date | Last Maintenance |
| next_maintenance_date | Next Scheduled Maintenance |
| notes | Additional Notes |
| created_at | Auto Generated Timestamp |

---

# Backend Files Created

```
Asset.java

AssetRepository.java

AssetService.java

AssetController.java
```

---

# Layer Architecture

```
Client

↓

AssetController

↓

AssetService

↓

AssetRepository

↓

PostgreSQL
```

---

# CRUD APIs

Base URL

```
/api/assets
```

---

## 1 GET All Assets

```
GET /api/assets
```

Response

```
200 OK
```

---

## 2 GET Asset By ID

```
GET /api/assets/{id}
```

Example

```
GET /api/assets/1
```

Response

```
200 OK
```

or

```
404 NOT FOUND
```

---

## 3 Create Asset

```
POST /api/assets
```

Sample Body

```json
{
    "assetName": "Hydraulic Block Machine",
    "assetCategory": "Production Machine",
    "manufacturer": "HydroTech Industries",
    "modelNumber": "HBM-500",
    "serialNumber": "HBM500-2026-001",
    "purchaseDate": "2026-08-05",
    "installationDate": "2026-08-06",
    "location": "Production Shed 1",
    "status": "ACTIVE",
    "lastMaintenanceDate": "2026-08-06",
    "nextMaintenanceDate": "2027-02-06",
    "notes": "Main hydraulic block manufacturing machine"
}
```

Response

```
201 CREATED
```

---

## 4 Update Asset

```
PUT /api/assets/{id}
```

Response

```
200 OK
```

---

## 5 Delete Asset

```
DELETE /api/assets/{id}
```

Response

```
204 NO CONTENT
```

---

# PostgreSQL Verification

Verified using

```sql
SELECT * FROM asset;
```

Observed

- Records inserted successfully
- Updates reflected correctly
- Deletes executed successfully

---

# Entity Design

Asset is a **Standalone Master Entity**

Unlike Attendance or PurchaseItem,

Asset

- has NO parent
- has NO child (currently)
- has NO foreign keys

Current Design

```
Asset
```

Future Design

```
Asset
     │
     ├──────── Maintenance
     │
     ├──────── Repair History
     │
     ├──────── Breakdown Log
     │
     └──────── Asset Expenses
```

---

# Controller Pattern

Standard SKCP CRUD Controller

```
GET

GET BY ID

POST

PUT

DELETE
```

All endpoints return

```
ResponseEntity
```

with proper HTTP status codes.

---

# Service Pattern

Standard CRUD Service

```
findAll()

findById()

save()

deleteById()
```

Currently

No Business Logic

Future

Business Logic such as

- Maintenance Reminder
- Asset Health
- Asset Utilization
- Depreciation
- Machine Availability

will be added inside Service Layer.

---

# Lessons Learned

## Lesson 1

Not every entity requires relationships.

Asset is an independent Master Data table.

---

## Lesson 2

Master Data tables are intentionally simple.

Complex business rules should never be stored in the entity.

They belong inside the Service layer.

---

## Lesson 3

Always update only editable fields.

Never overwrite

```
asset_id

created_at
```

during PUT.

---

## Lesson 4

Using ResponseEntity provides

- proper HTTP responses
- production-ready APIs
- better frontend integration

---

# Testing Completed

| Test | Status |
|------|--------|
| GET All | ✅ |
| GET By ID | ✅ |
| POST | ✅ |
| PUT | ✅ |
| DELETE | ✅ |
| PostgreSQL Verification | ✅ |

---

# Asset Module Status

```
Database
        ✅

Entity
        ✅

Repository
        ✅

Service
        ✅

Controller
        ✅

CRUD
        ✅

Documentation
        ✅
```

---

# Master Data Completion Status

```
Customer          ✅

Supplier          ✅

Product           ✅

Raw Material      ✅

Labour            ✅

Asset             ✅
```

---

# Project Milestone

🎉 **Master Data Layer of SKCP ERP is now 100% Complete.**

This provides a solid foundation for all future transactional and business logic modules.

---

# Next Module

```
Inventory Management

↓

Production

↓

Sales

↓

Payments

↓

Reports & Dashboard
```

The next phase transitions from **Master Data** to **Business Logic**, where modules begin interacting and automating real-world operations.