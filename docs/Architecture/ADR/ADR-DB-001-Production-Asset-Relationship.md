# ADR-DB-001
# Production → Asset Relationship

---

## Status

✅ Accepted

---

## Date

31-Jul-2026

---

## Module

Module 3 – Database Design

---

## Context

The Production module records the daily manufacturing of cement blocks.

Initially, production was designed using only:

- Product
- Quantity Produced
- Production Date

However, during architecture review it was identified that the machine used for production is an important business resource.

Although the current manual notebook does not record the machine, future reporting and analytics require production to be associated with the equipment used.

---

## Decision

Every Production record shall reference exactly one Asset.

Relationship:

Asset (1)
        │
        │
        ▼
Production (N)

Foreign Key:

AssetID

---

## Rationale

This relationship enables:

- Machine-wise production reports
- Machine utilization tracking
- Maintenance planning
- Production traceability
- Future Overall Equipment Effectiveness (OEE)
- AI-based productivity analysis

Without this relationship, production data cannot be analyzed by machine.

---

## Consequences

### Advantages

- Better production analytics
- Supports preventive maintenance
- Scalable architecture
- No database redesign required in future

### Trade-offs

Current business users must select the machine while recording production.

Since only one block-making machine is currently used, this introduces minimal operational overhead while greatly improving future scalability.

---

## Alternatives Considered

### Option 1

No Asset relationship.

Rejected because machine-level reporting would become impossible.

---

### Option 2

Store machine name as text.

Rejected because it violates database normalization and causes data duplication.

---

### Option 3 (Selected)

Reference Asset using AssetID.

Accepted.

---

## Implementation

Relationship

Asset (1)

↓

Production (N)

Foreign Key

Production.AssetID

↓

Asset.AssetID

---

## Impact

Affected Modules

- Database Design
- PostgreSQL Schema
- Spring Boot Entity Design
- Reporting
- AI Analytics

---

## References

- Database Relationship Summary
- Master ER Diagram
- PostgreSQL Schema
- Module 3 Documentation

---

Author : Harish Kamat
Status : Accepted
Version : 1.0