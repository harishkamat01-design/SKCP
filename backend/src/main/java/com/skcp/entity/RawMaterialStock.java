package com.skcp.entity;

import com.skcp.enums.RawMaterialStockStatus;
import com.skcp.enums.RecordStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "raw_material_stock")
public class RawMaterialStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "raw_material_stock_id")
    private Integer rawMaterialStockId;

    // ============================================================
    // PARENT RELATIONSHIP
    // RawMaterialStock : RawMaterial = 1 : 1
    // ============================================================

    @OneToOne
    @JoinColumn(
            name = "raw_material_id",
            nullable = false,
            unique = true
    )
    private RawMaterial rawMaterial;

    // ============================================================
    // STOCK LEVELS
    // Inventory terminology → STOCK
    // ============================================================

    @Column(
            name = "current_stock_level",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal currentStockLevel;

    @Column(
            name = "minimum_stock_level",
            precision = 10,
            scale = 2
    )
    private BigDecimal minimumStockLevel;

    // ============================================================
    // LAST UPDATED
    // ============================================================

    @Column(name = "last_updated_date", nullable = false)
    private LocalDate lastUpdatedDate;

    // ============================================================
    // STOCK CONDITION
    //
    // NORMAL
    // LOW_STOCK
    // OUT_OF_STOCK
    // ============================================================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "stock_status",
            nullable = false,
            length = 20
    )
    private RawMaterialStockStatus stockStatus;

    // ============================================================
    // RECORD LIFECYCLE / SOFT DELETE
    //
    // ACTIVE
    // INACTIVE
    // ============================================================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "record_status",
            nullable = false,
            length = 20
    )
    private RecordStatus recordStatus;

    // ============================================================
    // OTHER FIELDS
    // ============================================================

    @Column(name = "notes")
    private String notes;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    // ============================================================
    // PRE-PERSIST
    // ============================================================

    @PrePersist
    public void prePersist() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (lastUpdatedDate == null) {
            lastUpdatedDate = LocalDate.now();
        }

        if (currentStockLevel == null) {
            currentStockLevel = BigDecimal.ZERO;
        }

        if (stockStatus == null) {
            stockStatus = RawMaterialStockStatus.NORMAL;
        }

        if (recordStatus == null) {
            recordStatus = RecordStatus.ACTIVE;
        }
    }

    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public RawMaterialStock() {
    }

    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getRawMaterialStockId() {
        return rawMaterialStockId;
    }

    public void setRawMaterialStockId(Integer rawMaterialStockId) {
        this.rawMaterialStockId = rawMaterialStockId;
    }

    public RawMaterial getRawMaterial() {
        return rawMaterial;
    }

    public void setRawMaterial(RawMaterial rawMaterial) {
        this.rawMaterial = rawMaterial;
    }

    public BigDecimal getCurrentStockLevel() {
        return currentStockLevel;
    }

    public void setCurrentStockLevel(BigDecimal currentStockLevel) {
        this.currentStockLevel = currentStockLevel;
    }

    public BigDecimal getMinimumStockLevel() {
        return minimumStockLevel;
    }

    public void setMinimumStockLevel(BigDecimal minimumStockLevel) {
        this.minimumStockLevel = minimumStockLevel;
    }

    public LocalDate getLastUpdatedDate() {
        return lastUpdatedDate;
    }

    public void setLastUpdatedDate(LocalDate lastUpdatedDate) {
        this.lastUpdatedDate = lastUpdatedDate;
    }

    public RawMaterialStockStatus getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(RawMaterialStockStatus stockStatus) {
        this.stockStatus = stockStatus;
    }

    public RecordStatus getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(RecordStatus recordStatus) {
        this.recordStatus = recordStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}





/*

package com.skcp.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "raw_material_stock")
public class RawMaterialStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "raw_material_stock_id")
    private Integer rawMaterialStockId;

    // Parent Relationship → RawMaterial (1 : 1)
    @OneToOne
    @JoinColumn(name = "raw_material_id", nullable = false, unique = true)
    private RawMaterial rawMaterial;

    @Column(name = "current_quantity", nullable = false)
    private BigDecimal currentQuantity;

    @Column(name = "minimum_quantity")
    private BigDecimal minimumQuantity;

    @Column(name = "last_updated_date", nullable = false)
    private LocalDate lastUpdatedDate;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {

        this.createdAt = LocalDateTime.now();

        if (this.lastUpdatedDate == null) {
            this.lastUpdatedDate = LocalDate.now();
        }

        if (this.currentQuantity == null) {
            this.currentQuantity = BigDecimal.ZERO;
        }

        if (this.status == null) {
            this.status = "NORMAL";
        }
    }

    // Default Constructor
    public RawMaterialStock() {

    }

    // ===========================
    // Getters and Setters
    // ===========================

    public Integer getRawMaterialStockId() {
        return rawMaterialStockId;
    }

    public void setRawMaterialStockId(Integer rawMaterialStockId) {
        this.rawMaterialStockId = rawMaterialStockId;
    }

    public RawMaterial getRawMaterial() {
        return rawMaterial;
    }

    public void setRawMaterial(RawMaterial rawMaterial) {
        this.rawMaterial = rawMaterial;
    }

    public BigDecimal getCurrentQuantity() {
        return currentQuantity;
    }

    public void setCurrentQuantity(BigDecimal currentQuantity) {
        this.currentQuantity = currentQuantity;
    }

    public BigDecimal getMinimumQuantity() {
        return minimumQuantity;
    }

    public void setMinimumQuantity(BigDecimal minimumQuantity) {
        this.minimumQuantity = minimumQuantity;
    }

    public LocalDate getLastUpdatedDate() {
        return lastUpdatedDate;
    }

    public void setLastUpdatedDate(LocalDate lastUpdatedDate) {
        this.lastUpdatedDate = lastUpdatedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

    */