
/*
Based on the deletion issue we identified,
the key change is to remove orphanRemoval = true from the Purchase → PurchaseItem relationship.
*/

package com.skcp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase")
public class Purchase
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_id")
    private Integer purchaseId;


    // ============================================================
    // PARENT → SUPPLIER
    // ============================================================

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;


    // ============================================================
    // PURCHASE → PURCHASE ITEMS
    // ============================================================

    /*
     * Purchase is the parent entity.
     *
     * PurchaseItem owns the database relationship through:
     *
     *     PurchaseItem.purchase
     *
     * cascade = ALL
     * allows persistence operations on Purchase to cascade
     * to its PurchaseItems.
     *
     * orphanRemoval is intentionally NOT enabled.
     *
     * PurchaseItem deletion is controlled explicitly by
     * PurchaseItemService.deletePurchaseItem().
     */

    @OneToMany(
            mappedBy = "purchase",
            cascade = CascadeType.ALL
    )
    private List<PurchaseItem> purchaseItems =
            new ArrayList<>();


    // ============================================================
    // PURCHASE DETAILS
    // ============================================================

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "invoice_number", length = 50)
    private String invoiceNumber;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    // ============================================================
    // PRE-PERSIST
    // ============================================================

    @PrePersist
    public void prePersist()
    {
        this.createdAt = LocalDateTime.now();
    }


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public Purchase()
    {

    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getPurchaseId()
    {
        return purchaseId;
    }

    public void setPurchaseId(Integer purchaseId)
    {
        this.purchaseId = purchaseId;
    }


    public Supplier getSupplier()
    {
        return supplier;
    }

    public void setSupplier(Supplier supplier)
    {
        this.supplier = supplier;
    }


    public List<PurchaseItem> getPurchaseItems()
    {
        return purchaseItems;
    }

    public void setPurchaseItems(
            List<PurchaseItem> purchaseItems)
    {
        this.purchaseItems = purchaseItems;
    }


    public LocalDate getPurchaseDate()
    {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate)
    {
        this.purchaseDate = purchaseDate;
    }


    public String getInvoiceNumber()
    {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber)
    {
        this.invoiceNumber = invoiceNumber;
    }


    public BigDecimal getTotalAmount()
    {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount)
    {
        this.totalAmount = totalAmount;
    }


    public String getPaymentStatus()
    {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus)
    {
        this.paymentStatus = paymentStatus;
    }


    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(String remarks)
    {
        this.remarks = remarks;
    }


    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }


    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }

}
    // ============================================================
    // ARCHITECTURE LEARNING
    // ============================================================

    /*
     * Purchase is the PARENT.
     *
     * Supplier relationship:
     *
     * Supplier
     *     │
     *     ▼
     * Purchase
     *
     *
     * PurchaseItem relationship:
     *
     * Purchase
     *     │
     *     ├── PurchaseItem
     *     ├── PurchaseItem
     *     └── PurchaseItem
     *
     *
     * mappedBy = "purchase"
     *
     * means the PurchaseItem.purchase field owns
     * the database relationship.
     *
     *
     * cascade = CascadeType.ALL
     *
     * means persistence operations on Purchase can
     * cascade to its PurchaseItems.
     *
     *
     * orphanRemoval = false (default)
     *
     * PurchaseItem deletion is handled explicitly
     * through PurchaseItemService.
     */













/* 

package com.skcp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase")
public class Purchase
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_id")
    private Integer purchaseId;


    // ============================================================
    // PARENT → SUPPLIER
    // ============================================================

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;


    // ============================================================
    // PURCHASE → PURCHASE ITEMS
    // ============================================================

    @OneToMany(
            mappedBy = "purchase",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<PurchaseItem> purchaseItems =
            new ArrayList<>();


    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "invoice_number", length = 50)
    private String invoiceNumber;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    // ============================================================
    // PRE-PERSIST
    // ============================================================

    @PrePersist
    public void prePersist()
    {
        this.createdAt = LocalDateTime.now();
    }


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public Purchase()
    {

    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getPurchaseId()
    {
        return purchaseId;
    }

    public void setPurchaseId(Integer purchaseId)
    {
        this.purchaseId = purchaseId;
    }


    public Supplier getSupplier()
    {
        return supplier;
    }

    public void setSupplier(Supplier supplier)
    {
        this.supplier = supplier;
    }


    public List<PurchaseItem> getPurchaseItems()
    {
        return purchaseItems;
    }

    public void setPurchaseItems(
            List<PurchaseItem> purchaseItems)
    {
        this.purchaseItems = purchaseItems;
    }


    public LocalDate getPurchaseDate()
    {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate)
    {
        this.purchaseDate = purchaseDate;
    }


    public String getInvoiceNumber()
    {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber)
    {
        this.invoiceNumber = invoiceNumber;
    }


    public BigDecimal getTotalAmount()
    {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount)
    {
        this.totalAmount = totalAmount;
    }


    public String getPaymentStatus()
    {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus)
    {
        this.paymentStatus = paymentStatus;
    }


    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(String remarks)
    {
        this.remarks = remarks;
    }


    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }


    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }

}

*/
    