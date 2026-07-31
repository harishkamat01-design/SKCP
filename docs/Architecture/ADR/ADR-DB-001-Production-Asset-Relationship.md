# ADR-DB-001

# Title

Link Production to Asset using `AssetID`

---

## Status

✅ Accepted

---

## Date

30-Jul-2026

---

## Context

The Production module records the daily manufacturing activity for finished products.

Although the current manual process does not explicitly record which block-making machine was used, the business owns multiple production assets with different capacities.

The database design needed to decide whether Production should remain independent or reference the machine used.

---

## Decision

The `Production` table shall contain `AssetID` as a foreign key referencing the `Asset` table.

Relationship:

```
Asset (1)
     │
     │
     ▼
Production (Many)
```

---

## Rationale

Adding `AssetID` introduces minimal implementation complexity while significantly improving the long-term value of the system.

This relationship enables:

- Machine-wise production reports
- Production traceability
- Equipment utilization analysis
- Maintenance planning
- Historical production analysis
- Future AI-driven production optimization
- Future Overall Equipment Effectiveness (OEE) calculations

Without this relationship, these capabilities would require future database redesign.

---

## Consequences

### Positive

- Improves production traceability
- Supports future reporting
- Supports AI and analytics
- Enables machine utilization metrics
- No impact on existing business workflow

### Negative

- One additional foreign key in the Production table
- Requires selecting the production asset when recording production

---

## Alternatives Considered

### Option 1

Do not store machine information.

**Rejected**

Reason:
Future reporting and analytics would not be possible without redesigning the schema.

---

### Option 2

Store machine name as text.

**Rejected**

Reason:
Violates normalization and creates duplicate master data.

---

### Option 3

Reference the Asset table using `AssetID`.

**Accepted**

Reason:
Maintains normalization while enabling future scalability.

---

## Impact

Affected Tables:

- Asset
- Production

Affected Documents:

- Database Relationship Summary
- Master ER Diagram
- PostgreSQL Physical Schema
- Spring Boot Entity Model

---

## Decision Owner

Harish Kamat

---

## Review Status

✅ Approved

---

## Related Documents

- Database_Relationship_Summary.md
- Master_ER_Diagram.md
- PostgreSQL_Schema.sql