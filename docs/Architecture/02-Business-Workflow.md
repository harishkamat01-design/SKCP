# SKCP Business Workflow

## Business Goal

The primary objective of SKCP is to digitize the daily operations of Shree Kundodari Cement Products by replacing manual notebook-based processes with a centralized software system. The application aims to improve operational efficiency, payment tracking, stock management, and business reporting while providing a foundation for future AI-driven features.

## 1. Document Header

| Field | Value |
|-------|-------|
| Project | SKCP – Shree Kundodari Cement Products |
| Document | Business Workflow |
| Version | 1.0 |
| Status | Draft |
| Author | Harish Kamat |
| Reviewer | Architect |
| Created On | 2026-07-24 |
| Last Updated | 2026-07-24 |

---

## 2. Purpose

To describe how the SKCP business operates from manufacturing to payment collection.
To provide a clear understanding of business processes before designing the software.
This document helps developers, architects and future contributors understand the complete business process before software development begins.

---

## 3. Scope

This document covers the complete business workflow of SKCP.

It includes:

- Manufacturing process
- Stock management
- Customer orders
- Quotations
- Payments
- Delivery
- Business reporting
- Future AI features

This document does not include technical implementation, database design or API specifications.

---

## 4. Business Overview

SKCP (Shree Kundodari Cement Products) manufactures and sells cement solid blocks.

The business currently offers one product category with three block size variants:

- Solid Block 4" × 8" × 16"
- Solid Block 6" × 8" × 16"
- Solid Block 8" × 8" × 16"

Products are manufactured daily and stored as inventory before customer orders are received.

The business is currently managed manually using notebooks.

---

## 5. Stakeholders

| Stakeholder | Responsibility |
|-------------|----------------|
| Business Owner (Admin) | Manage products, customers, quotations, orders, stock and reports |
| Customer | Purchase products and make payments |
| Transport Provider | Deliver products to customer locations |
| Future AI Assistant | Generate insights, payment reminders and business predictions |


## 6. Manufacturing Workflow

The manufacturing process is carried out every day to maintain sufficient stock for customer demand.

### Workflow

1. Cement blocks are manufactured daily, irrespective of customer orders.
2. The quantity of manufactured blocks is recorded manually in the business notebook.
3. Each batch undergoes a quality check before being added to stock.
4. Approved blocks are categorized by block size.
5. Available stock is updated manually.
6. The updated stock is used to fulfill future customer orders.

### Current Process

- Manufacturing is performed every day.
- Production records are maintained in a notebook.
- Stock counting is done manually.
- Quality is verified before stock is updated.

### Future SKCP System

The SKCP application will digitally record:
- Daily production quantity
- Product variants
- Available stock
- Production history
- Quality status (if required)

## 7. Customer Order Workflow

The customer order workflow describes the process from customer enquiry to payment completion.

### Workflow

Customer Enquiry
        ↓
Initial Stock Verification
        ↓
Quotation Prepared
        ↓
Customer Confirms Order
        ↓
Final Stock Confirmation
        ↓
Transport Arranged
        ↓
Products Delivered
        ↓
Payment Received
        ↓
Pending Balance Updated

### Current Process

- Customer contacts the business for product availability.
- Stock is verified manually.
- A quotation is prepared based on available stock.
- Once confirmed, products are prepared for delivery.
- Delivery is arranged using an external transport provider.
- Payments are recorded manually in a notebook.

### Future SKCP System

The SKCP application will:

- Maintain customer records.
- Generate digital quotations.
- Record customer orders.
- Track order status.
- Calculate pending balances automatically.

## 8. Payment Workflow

The payment workflow manages customer payments and outstanding balances.

### Workflow

Order Created
        ↓
Invoice Generated
        ↓
Customer Pays

        ├── Full Payment
        │       ↓
        │   Order Closed
        │
        └── Partial Payment
                ↓
        Pending Balance Updated
                ↓
        Future Reminder

### Current Process

- Payments are recorded manually.
- Pending balances are calculated manually.
- Follow-up depends on manual records.

### Future SKCP System

The application will:

- Record every payment.
- Calculate pending balances automatically.
- Maintain complete payment history.
- Generate payment reminders.

## 9. Delivery Workflow

The delivery workflow describes how products reach customers after order confirmation.

### Workflow

Customer Confirms Order
        ↓
Transport Vehicle Contacted
        ↓
Products Loaded
        ↓
Products Delivered
        ↓
Delivery Completed

### Current Process

- Transport is arranged using external vehicle owners.
- Delivery charges are calculated separately.
- Delivery details are maintained manually.

### Future SKCP System

The application will:

- Record transport details.
- Record delivery charges.
- Maintain delivery history.
- Track delivery status.

## 10. Stock Management Workflow

Stock management ensures sufficient inventory is available before accepting customer orders.

### Workflow

Daily Manufacturing
        ↓
Quality Verification
        ↓
Stock Updated
        ↓
Customer Order
        ↓
Stock Reduced
        ↓
Remaining Stock Updated

### Current Process

- Stock counting is performed manually.
- Daily production is added to available stock.
- Stock is reduced after product delivery.

### Future SKCP System

The application will:

- Maintain real-time stock.
- Track stock movement.
- Generate stock reports.
- Notify low stock levels (Future Enhancement).

## 11. Business Rules

### Description

Business Rules define the policies and conditions that govern how the SKCP business operates. These rules ensure that business processes are performed consistently and correctly.

### Current Process

The business currently follows these rules based on experience and manual decision-making:

- Only quality-approved blocks are added to stock.
- Stock availability is verified before accepting customer orders.
- Transport charges are calculated separately from product costs.
- Customers may have pending payments.
- Discounts may be provided for large quantity orders.
- Daily production is recorded manually.

### Future SKCP System

The SKCP application will enforce the following business rules automatically:

| Rule ID | Business Rule |
|----------|---------------|
| BR-001 | Only quality-approved blocks can be added to stock. |
| BR-002 | Stock must be available before confirming an order. |
| BR-003 | Transport charges are added separately. |
| BR-004 | Customers may have pending payments. |
| BR-005 | One customer can place multiple orders. |
| BR-006 | One order can contain multiple block size variants. |
| BR-007 | Discounts may be provided for large quantity orders. |
| BR-008 | Daily production records shall be maintained. |ty orders. |
| BR-008 | Daily production is recorded manually. |

## 12. Business Constraints

### Description

Business Constraints define the limitations and conditions within which the SKCP business currently operates. These constraints influence how the software must be designed.

### Current Process

The business currently operates with the following constraints:

- Business operations are managed by a single Admin.
- Manufacturing is performed at one location.
- Transport is arranged through external vehicle providers.
- Business records are maintained in physical notebooks.
- Most calculations and reports are prepared manually.

### Future SKCP System

The SKCP application will be designed considering the following constraints:

| ID | Business Constraint |
|----|---------------------|
| BC-001 | The business operates from a single manufacturing location. |
| BC-002 | Version 1 supports one Admin user. |
| BC-003 | Production is performed daily. |
| BC-004 | Transport is arranged using external transport providers. |
| BC-005 | Business data will be migrated from manual records to a digital system. |

## 13. Business Risks

### Description

Business Risks identify potential issues that could negatively impact daily operations. Understanding these risks helps design features that reduce or eliminate them.

### Current Process

The current manual process introduces several operational risks:

- Stock quantities may be miscalculated.
- Pending customer payments may be forgotten.
- Business notebooks may be damaged or lost.
- Manual calculations may result in errors.
- Business reports require significant manual effort.

### Future SKCP System

The SKCP application will reduce these risks through the following measures:

| Risk ID | Business Risk | Mitigation |
|----------|---------------|------------|
| BRISK-001 | Manual stock calculation errors | Digital stock management |
| BRISK-002 | Pending payments forgotten | Automatic payment tracking |
| BRISK-003 | Notebook damage or loss | Secure database storage and backups |
| BRISK-004 | Manual calculation mistakes | Automated calculations |
| BRISK-005 | Delayed business reporting | Automatic report generation |


## 14. Functional Requirements

Functional Requirements describe what the SKCP application must do to support the business operations.

| ID | Requirement |
|----|-------------|
| FR-001 | The system shall manage customers. |
| FR-002 | The system shall manage cement block products. |
| FR-003 | The system shall maintain stock for all product variants. |
| FR-004 | The system shall create quotations for customers. |
| FR-005 | The system shall create customer orders. |
| FR-006 | The system shall record deliveries. |
| FR-007 | The system shall record customer payments. |
| FR-008 | The system shall calculate pending balances automatically. |
| FR-009 | The system shall generate monthly and yearly business reports. |
| FR-010 | The system shall maintain daily production records. |

### Current Process

- Customer information is maintained manually.
- Product details are recorded in notebooks.
- Stock quantities are counted manually.
- Quotations are prepared manually.
- Orders are recorded manually.
- Deliveries are tracked manually.
- Payments are recorded manually.
- Pending balances are calculated manually.
- Monthly and yearly reports are prepared manually.
- Daily production records are maintained in notebooks.

### Future SKCP System

The SKCP application will:

- Manage customer information digitally.
- Maintain product and pricing information.
- Track stock automatically.
- Generate quotations digitally.
- Record customer orders.
- Maintain delivery history.
- Record all customer payments.
- Calculate pending balances automatically.
- Generate monthly and yearly reports.
- Maintain complete production history.

## 15. Non-Functional Requirements

Non-Functional Requirements describe how well the SKCP application should perform and the quality standards it should maintain.

| ID | Requirement |
|----|-------------|
| NFR-001 | The application shall provide a simple and user-friendly interface. |
| NFR-002 | The application shall be accessible through a web browser. |
| NFR-003 | Business data shall be stored securely. |
| NFR-004 | The application shall support future AI features. |
| NFR-005 | The application shall provide fast response during daily operations. |
| NFR-006 | The application shall be designed for future business growth. |

### Current Process

- Business records are maintained in physical notebooks.
- Information retrieval is time-consuming.
- Business calculations are performed manually.
- Reports require manual effort.
- There is no centralized digital storage.
- Future expansion is difficult using manual processes.

### Future SKCP System

The SKCP application will:

- Provide a simple and easy-to-use interface for the Admin.
- Be accessible from any supported web browser.
- Store business information securely in a database.
- Be designed to integrate future AI capabilities.
- Respond quickly during everyday operations.
- Support additional features and business growth without major redesign.



## Architecture Quality Checklist

- [ ] A new developer can understand this document without asking questions.
- [ ] The document describes the business, not the implementation.
- [ ] The document can be easily updated if the business changes.
