package com.skcp.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "production")
public class Production {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "production_id")
    private Integer productionId;

    @Column(name = "production_date", nullable = false)
    private LocalDate productionDate;

    // Parent Relationship → Product
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity_produced", nullable = false)
    private Integer quantityProduced;

    @Column(name = "morning_cement_bags", nullable = false)
    private BigDecimal morningCementBags;

    @Column(name = "afternoon_cement_bags", nullable = false)
    private BigDecimal afternoonCementBags;

    // PostgreSQL Generated Column
    @Column(
            name = "total_cement_bags",
            insertable = false,
            updatable = false
    )
    private BigDecimal totalCementBags;

    @Column(name = "notes")
    private String notes;

    @Column(name = "status", nullable = false)
    private String status;

    // Parent Relationship → Asset
    @ManyToOne
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Default Constructor
    public Production() 
    {

    }

    // Getters and Setters

    public Integer getProductionId() {
        return productionId;
    }

    public void setProductionId(Integer productionId) {
        this.productionId = productionId;
    }

    public LocalDate getProductionDate() {
        return productionDate;
    }

    public void setProductionDate(LocalDate productionDate) {
        this.productionDate = productionDate;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantityProduced() {
        return quantityProduced;
    }

    public void setQuantityProduced(Integer quantityProduced) {
        this.quantityProduced = quantityProduced;
    }

    public BigDecimal getMorningCementBags() {
        return morningCementBags;
    }

    public void setMorningCementBags(BigDecimal morningCementBags) {
        this.morningCementBags = morningCementBags;
    }

    public BigDecimal getAfternoonCementBags() {
        return afternoonCementBags;
    }

    public void setAfternoonCementBags(BigDecimal afternoonCementBags) {
        this.afternoonCementBags = afternoonCementBags;
    }

    public BigDecimal getTotalCementBags() {
        return totalCementBags;
    }

    public void setTotalCementBags(BigDecimal totalCementBags) {
        this.totalCementBags = totalCementBags;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}