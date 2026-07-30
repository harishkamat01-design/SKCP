# 🚚 Supplier

---

## Purpose

The **Supplier** table stores the permanent list of suppliers who provide raw materials to SKCP.

It answers the business question:

> **"Who supplies our raw materials?"**

This is **Master Data**, meaning supplier information changes infrequently.

This table **does not** store purchase history, purchase prices, supplied quantities, or payment information.

---

## Business Questions Answered

This table helps answer:

- Who are SKCP's suppliers?
- How can we contact them?
- Where is the supplier located?
- Is the supplier currently active?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| SupplierID (PK) | Unique supplier identifier | Identifies each supplier |
| SupplierName | Supplier name | Business identification |
| MobileNumber | Contact number | Communication |
| AlternateMobile | Optional second contact | Backup communication |
| Address | Supplier address | Business information |
| Village | Village / Area | Supplier location |
| City | City | Supplier location |
| Pincode | Postal code | Address information |
| GSTNumber | GST registration (Optional) | Business identification |
| Remarks | Optional notes | Additional supplier information |
| Status | Active / Inactive | Indicates whether supplier is currently active |

---

## Business Relationship

```text
                  Supplier
                      │
                      ▼
                 Purchase
                      │
                      ▼
                Purchase Item
                      │
                      ▼
                Raw Material
```

A single Supplier can have:

- Multiple Purchases

A single Purchase can contain:

- Multiple Raw Materials

---

## Business Rules

- Every supplier must have a unique SupplierID.
- One supplier can supply many purchases.
- A supplier is never directly linked to Raw Material.
- Supplier information is Master Data.
- Suppliers are marked Inactive instead of being deleted.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Purchase Date | Purchase | Transaction information |
| Purchase Price | Purchase Item | Price changes every purchase |
| Quantity Purchased | Purchase Item | Transaction detail |
| Current Stock | Raw Material Stock | Inventory information |
| Raw Material List | Purchase Item | One supplier can supply many materials over time |

---

## Architect Discoveries

During architecture discussions, we discovered an important business principle:

A supplier should **not** be directly connected to Raw Material.

Instead, the relationship is naturally discovered through transactions.

```text
Supplier

↓

Purchase

↓

Purchase Item

↓

Raw Material
```

This makes the system flexible because:

- One supplier can supply many raw materials.
- One raw material can be purchased from many suppliers.

---

## Architect Decisions

- Supplier is a Master Data table.
- Supplier owns only permanent information.
- Supplier and Raw Material have **no direct relationship**.
- Purchase acts as the bridge between Supplier and Raw Material.

---

## Future Enhancements

Possible future additions:

- Supplier Rating
- Bank Account Details
- PAN Number
- Email Address
- Preferred Payment Terms
- Lead Time

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Master Data |
| Table Status | ✅ Approved |
| Sprint | Sprint 2 – Business Domain & Database Design |
| Last Updated | 29 July 2026 |
| Architect | Harish Kamat & ChatGPT |

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |