# Database Naming Standards

---

# Purpose

This document defines the naming conventions used throughout the SKCP database.

Following consistent naming standards improves readability, maintainability, and reduces ambiguity across the database, backend APIs, and frontend application.

---

# Table Naming

## Rules

- Use **Singular** table names.
- Use **PascalCase**.
- Use meaningful business terminology.
- Avoid abbreviations.

### Examples

```
Customer
Supplier
RawMaterial
Purchase
PurchaseItem
Production
Attendance
FinishedGoodsStock
```

---

# Database Object Naming

## Primary Key Constraint

PK_<TableName>

Example

PK_Customer
PK_Order

---

## Foreign Key Constraint

FK_<ChildTable>_<ParentTable>

Examples

FK_Order_Customer
FK_Purchase_Supplier
FK_OrderItem_Product

---

## Unique Constraint

UQ_<TableName>_<Column>

Example

UQ_Customer_Phone
UQ_Supplier_GSTNumber

---

## Index

IX_<TableName>_<Column>

Examples

IX_Order_OrderDate
IX_Customer_CustomerName
IX_Payment_PaymentDate

---

# ENUM Naming

Use meaningful business values.

Examples

OrderStatus

Pending
Partially Delivered
Completed
Cancelled

DeliveryStatus

Pending
In Transit
Delivered

PaymentMode

Cash
UPI
Bank Transfer
Cheque

TransportMode

Customer Arranged
Factory Arranged
Third Party

---

# NULL Standards

Business-critical fields

NOT NULL

Examples

CustomerName
OrderDate
CurrentQuantity

Optional fields

NULL

Examples

Remarks
ReferenceNumber
MinimumQuantity
Notes

---


# Reserved Words

Avoid SQL reserved keywords.

Avoid names like

User
Group
Date
Order

Instead use

Customer
CustomerOrder
OrderDate
CreatedDate

---

# Documentation Rule

Every table must have:

- Purpose
- Business Responsibility
- Primary Key
- Foreign Keys
- Business Rules
- Example
- Future Scope
- Version History

This keeps documentation consistent across all database objects.
---



---

# Primary Keys

## Rule

Every table has a single primary key.

Format:

```
<TableName>ID
```

### Examples

```
CustomerID
SupplierID
ProductID
PurchaseID
PaymentID
AttendanceID
AssetID
```

---

# Foreign Keys

## Rule

Foreign Keys use the referenced table name followed by **ID**.

Format:

```
ReferencedTableID
```

### Examples

```
CustomerID
SupplierID
ProductID
OrderID
DeliveryID
RawMaterialID
LabourID
```

---

# Boolean Fields

## Rule

Boolean fields begin with **Is**.

### Examples

```
IsActive
IsAvailable
IsCompleted
```

---

# Date Fields

## Rule

Date columns end with **Date**.

### Examples

```
OrderDate
PurchaseDate
DeliveryDate
JoiningDate
AttendanceDate
MaintenanceDate
NextMaintenanceDate
CreatedDate
```

---

# Quantity Fields

## Rule

Physical quantities end with **Quantity**.

### Examples

```
OrderedQuantity
PurchasedQuantity
ProducedQuantity
DeliveredQuantity
CurrentQuantity
MinimumQuantity
```

---

# Amount Fields

## Rule

Financial values end with **Amount**.

### Examples

```
TotalAmount
PaidAmount
RemainingAmount
AllocatedAmount
TransportAmount
```

> **Note**
>
> Derived values (for example, Pending Amount) should not be stored unless there is a business requirement. They should be calculated whenever possible.

---

# Status Fields

## Rule

Status fields end with **Status**.

### Examples

```
OrderStatus
DeliveryStatus
PaymentStatus
ConfirmationStatus
AssetStatus
```

---

# Text Fields

## Rule

Use descriptive names.

### Examples

```
CustomerName
SupplierName
ProductName
SkillType
Remarks
Address
Phone
GSTNumber
```

---

# Audit Fields

Every master and transaction table should include:

```
CreatedDate
UpdatedDate
```

Future versions may introduce:

```
CreatedBy
UpdatedBy
DeletedDate
DeletedBy
```

---

# General Principles

- Use business terminology.
- Use full words instead of abbreviations.
- Avoid duplicate information.
- Every attribute has exactly one owner.
- Store facts, calculate derived values.
- Design tables around real business processes.
- Follow Business-First Database Design.

---

# Naming Philosophy

Business

↓

Business Objects

↓

Database Tables

↓

Backend Entities

↓

REST APIs

↓

Frontend Screens

The same terminology should be used across every layer of the application.

---

# Status

| Item | Status |
|------|--------|
| Module | Module 3 – Database Design |
| Version | 1.0 |
| Status | ✅ Frozen (Version 1) |
| Last Updated | 30-Jul-2026 |
| Author | Harish Kamat |