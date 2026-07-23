# Architecture Decision Log

## Decision 001

SKCP will be designed as a Business Operating System (BOS) focused on solving the operational challenges of Shree Kundodari Cement Products.

## Decision 002

PostgreSQL will be the single source of truth for all business data.

## Decision 003

Inventory will increase through daily production and decrease through sales.

## Decision 004

The application will calculate pricing automatically using:

Final Amount =
(Product Price × Quantity)
− Discount
+ Transport Charges

## Decision 005

One Sales record can contain multiple products.

## Decision 006

Payments will be tracked against each Sale, enabling accurate pending balance calculations.

### ADR-002

Business documentation will follow a consistent structure:

- Description
- Workflow
- Current Process
- Future SKCP System

This format improves readability and makes future maintenance easier.

---

### ADR-003

Every completed module must update:

- README.md
- CHANGELOG.md
- Daily Journal
- Milestones
- GitHub Repository

This establishes a professional development workflow.

---

### ADR-004

A Software Engineering Glossary will be maintained throughout the project to document important engineering terminology.
### ADR-005

Added a `.gitattributes` file to standardize line endings across operating systems.

Reason:

- Ensure consistent line endings (LF/CRLF).
- Avoid unnecessary Git diffs.
- Improve cross-platform collaboration.
- Follow professional Git repository standards.