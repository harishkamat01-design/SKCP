package com.skcp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "finished_goods_stock")
public class FinishedGoodsStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "finished_goods_stock_id")
    private Integer finishedGoodsStockId;

    // Parent Relationship → Product (1 : 1)
    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(name = "current_stock_level", nullable = false)
    private Integer currentStockLevel;

    @Column(name = "minimum_stock_level")
    private Integer minimumStockLevel;

    @Column(name = "last_updated_date", nullable = false)
    private LocalDate lastUpdatedDate;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "record_status", nullable = false)
    private String recordStatus;


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

        if (this.recordStatus == null) {
            this.recordStatus = "ACTIVE";
        }
    }

    // Default Constructor
    public FinishedGoodsStock() {

    }

    // Getters and Setters

    public Integer getFinishedGoodsStockId() {
        return finishedGoodsStockId;
    }

    public void setFinishedGoodsStockId(Integer finishedGoodsStockId) {
        this.finishedGoodsStockId = finishedGoodsStockId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getCurrentStockLevel() {
        return currentStockLevel;
    }

    public void setCurrentStockLevel(Integer currentStockLevel) {
        this.currentStockLevel = currentStockLevel;
    }

    public Integer getMinimumStockLevel() {
        return minimumStockLevel;
    }

    public void setMinimumStockLevel(Integer minimumStockLevel) {
        this.minimumStockLevel = minimumStockLevel;
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


    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
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