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
```

Future versions may introduce:

```
UpdatedDate
CreatedBy
UpdatedBy
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
| Status | ✅ Approved |
| Last Updated | 30-Jul-2026 |
| Author | Harish Kamat |