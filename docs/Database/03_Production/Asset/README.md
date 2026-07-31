# Asset (Master Table)

---

# Purpose

The Asset table stores all physical assets owned by SKCP.

Instead of maintaining separate tables for machines, generators, vehicles, computers, and other equipment, all physical assets are managed in one centralized master table.

This simplifies maintenance, tracking, and future expansion.

---

# Business Responsibility

The Asset table answers questions such as:

- What assets does the factory own?
- Where is each asset located?
- Is an asset currently active?
- When was it last serviced?
- When is the next maintenance due?

---

# Asset Table

| Column | Type | Description |
|----------|------|-------------|
| AssetID (PK) | UUID / INT | Unique asset identifier |
| AssetName | VARCHAR | Name of the asset |
| AssetCategory | ENUM | Block Machine, Mixer, Generator, Vehicle, CCTV, Computer, Pump, Water Tank, Safety Equipment, etc. |
| Manufacturer | VARCHAR | Manufacturer name |
| ModelNumber | VARCHAR | Model number |
| SerialNumber | VARCHAR | Factory serial number |
| PurchaseDate | DATE | Purchase date |
| InstallationDate | DATE | Installation date |
| Location | VARCHAR | Physical location inside the factory |
| Status | ENUM | Active, Maintenance, Out of Service |
| LastMaintenanceDate | DATE | Last maintenance performed |
| NextMaintenanceDate | DATE | Scheduled maintenance date |
| Notes | TEXT | Additional remarks |

---

# Business Rules

## Rule 1

Every physical asset owned by SKCP must have one Asset record.

---

## Rule 2

Each asset belongs to one Asset Category.

---

## Rule 3

Production capacity is NOT stored in the Asset table.

Capacity depends on the mould being used and will be handled separately in the future Mould table.

---

## Rule 4

Maintenance history begins by storing:

- Last Maintenance Date
- Next Maintenance Date

Detailed maintenance records may be introduced in a future version.

---

## Rule 5

Assets are never deleted.

When an asset is no longer usable, its Status changes to:

- Out of Service

This preserves historical records.

---

# Relationships

Future relationships include:

Asset

↓

Production

↓

Maintenance (Future)

---

# Examples

| Asset | Category |
|--------|----------|
| Block Machine A | Block Machine |
| Block Machine B | Block Machine |
| Concrete Mixer | Mixer |
| Diesel Generator | Generator |
| Carrying Vehicle 1 | Vehicle |
| Carrying Vehicle 2 | Vehicle |
| Office Computer | Computer |
| CCTV Camera 1 | CCTV |
| Borewell Pump | Pump |
| Water Tank 1 | Water Tank |

---

# Future Scope

Possible future tables:

- Maintenance
- Maintenance Log
- Asset Inspection
- Mould

These will reference AssetID.

---

# One-Line Memory

An Asset represents any physical equipment owned by SKCP and serves as the foundation for equipment management, maintenance, and future production tracking.