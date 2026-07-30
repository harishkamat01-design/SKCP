# Database Data Dictionary

---

| Table | Category | Purpose |
|--------|----------|----------|
| Supplier | Master | Stores supplier information |
| RawMaterial | Master | Stores raw material master |
| Purchase | Transaction | Purchase header |
| PurchaseItem | Transaction | Purchased material details |
| Customer | Master | Customer information |
| Product | Master | Product catalog |
| Production | Transaction | Production header |
| ProductionItem | Transaction | Production details |
| Curing | Transaction | Curing process tracking |
| FinishedGoodsStock | Inventory | Available finished goods |
| Order | Transaction | Customer order |
| OrderItem | Transaction | Ordered products |
| Delivery | Transaction | Delivery header |
| DeliveryItem | Transaction | Delivered products |
| DeliveryConfirmation | Transaction | Delivery acknowledgment |
| Payment | Transaction | Customer payments |
| PaymentAllocation | Transaction | Allocates payment to orders |

---

# Statistics

Master Tables : 4

Transaction Tables : 12

Inventory Tables : 1

Total Tables : 16