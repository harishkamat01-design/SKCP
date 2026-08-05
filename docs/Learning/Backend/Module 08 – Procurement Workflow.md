# 📘 SKCP Development Journal
# Module 08 – Procurement Workflow
## Purchase → Purchase Item → Raw Material
**Project:** SKCP (Shree Kundodari Cement Products)  
**Module:** Procurement Management  
**Status:** Planning Completed  
**Date:** 05-Aug-2026

---

# 🎯 Objective

Build the complete procurement workflow of SKCP using a proper Parent → Child relationship.

This module represents how raw materials are purchased from suppliers and added into inventory.

---

# 🏗 Procurement Architecture

Supplier supplies Raw Materials.

A supplier invoice is represented as a Purchase.

Each Purchase contains multiple Purchase Items.

Each Purchase Item represents one Raw Material purchased.

Finally, the purchased quantity updates the Raw Material stock.

---

# Overall Relationship

```text
Supplier
    │
    │ 1
    ▼
Purchase
    │
    │ 1
    ▼
Purchase Item
    │
    │ Many
    ▼
Raw Material
```

---

# Real Business Example

Supplier

```
ABC Cement Suppliers
```

↓

Purchase

```
Invoice No:
INV-1001
```

↓

Purchase Items

| Raw Material | Quantity |
|--------------|----------|
| Cement | 100 Bags |
| Sand | 20 Tons |
| Blue Metal | 15 Tons |
| Fly Ash | 5 Tons |

---

# Why Purchase Item Exists

Without Purchase Item,

Purchase only stores

- Invoice Number
- Supplier
- Purchase Date
- Total Amount

But it does **NOT** know

- Which material was purchased
- Quantity
- Rate
- Individual amount

Therefore,

ERP systems always separate

```
Purchase
        │
        ▼
Purchase Item
```

---

# Relationship Understanding

This is another Parent → Child relationship.

Exactly like

```
Labour
      │
      ▼
Attendance
```

Now we are implementing

```
Purchase
      │
      ▼
Purchase Item
```

The only difference is that Purchase Item references **two parent tables**.

```
Purchase Item
        │
        ├────────► Purchase
        │
        └────────► Raw Material
```

---

# Development Plan

We will build Purchase Item using the same standard Spring Boot architecture.

## Step 1

Database Table

↓

## Step 2

Entity

Purchase Item will contain

```java
@ManyToOne
Purchase purchase;

@ManyToOne
RawMaterial rawMaterial;
```

↓

## Step 3

Repository

↓

## Step 4

Service

↓

## Step 5

Controller

↓

## Step 6

CRUD Testing

↓

## Step 7

Architecture Notes

---

# Inventory Integration

Once Purchase Item is completed,

Raw Material stock will automatically increase.

Example

Purchase Item

```
Material:
Cement

Quantity:
100 Bags
```

Current Stock

```
500 Bags
```

Updated Stock

```
600 Bags
```

This is where SKCP starts becoming an intelligent inventory system.

---

# Final Procurement Flow

```
Supplier
        │
        ▼
Purchase
        │
        ▼
Purchase Item
        │
        ▼
Raw Material Stock
```

---

# What This Module Achieves

After completing this workflow,

SKCP will support

- Supplier Management
- Purchase Transactions
- Multiple Items per Purchase
- Raw Material Linking
- Inventory Stock Updates
- Proper ERP Procurement Design

---

# Key Learning

Every real-world business transaction should be broken into two parts:

- **Header (Parent)** → Represents the transaction itself.
- **Details (Child)** → Represents the individual items involved in that transaction.

Examples in SKCP:

| Parent | Child |
|---------|-------|
| Labour | Attendance |
| Purchase | Purchase Item |
| Customer | Order *(future)* |
| Order | Order Item *(future)* |

Once you understand one Parent → Child relationship, the same architecture can be reused throughout the entire SKCP project.

---

# Next Module

➡️ Purchase Item (Implementation)

- Database Table
- Entity
- Repository
- Service
- Controller
- CRUD Testing
- Stock Update Logic