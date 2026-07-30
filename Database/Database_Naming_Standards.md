# Database Naming Standards

---

# Table Naming

- Singular Names
- Pascal Case

Example

Customer

Purchase

OrderItem

---

# Primary Key

<Table>NameID

Examples

CustomerID

ProductID

PaymentID

---

# Foreign Key

Referenced Table + ID

Examples

CustomerID

OrderID

ProductID

---

# Boolean Fields

Prefix

Is

Examples

IsActive

IsDeleted

IsPaid

---

# Date Fields

Suffix

Date

Examples

OrderDate

PaymentDate

DeliveryDate

---

# Quantity Fields

Suffix

Quantity

Examples

OrderedQuantity

DeliveredQuantity

ProducedQuantity

---

# Amount Fields

Suffix

Amount

Examples

TotalAmount

PendingAmount

PaidAmount

---

# Status Fields

Suffix

Status

Examples

OrderStatus

PaymentStatus

DeliveryStatus

---

# Audit Fields

CreatedAt

UpdatedAt

CreatedBy

UpdatedBy

---

# General Principles

- No abbreviations
- Meaningful names
- Business terminology only
- Consistent naming across modules

---

Status

Approved