# ADR-DB-001

## Title

Production shall reference Asset.

## Status

Approved

## Date

30-Jul-2026

## Decision

The Production table will contain AssetID as a foreign key.

## Reason

Although the current business process does not explicitly record the machine used, multiple block-making machines exist with different production capacities.

Capturing the machine enables:

- Machine-wise production reports
- Maintenance analysis
- Production traceability
- Future AI analytics

The implementation cost is minimal while providing significant long-term architectural benefits.

## Decision Owner

Harish Kamat

## Approved By

Architect Review