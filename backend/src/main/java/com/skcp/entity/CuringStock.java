package com.skcp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "curing_stock")
public class CuringStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "curing_stock_id")
    private Integer curingStockId;

    // One Production Batch → One Curing Batch
    @OneToOne
    @JoinColumn(name = "production_id", nullable = false, unique = true)
    private Production production;

    // Product being cured
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "production_date", nullable = false)
    private LocalDate productionDate;

    // Calculated by Service Layer
    @Column(name = "expected_ready_date", nullable = false)
    private LocalDate expectedReadyDate;

    // Lifecycle:
    // CURING → READY → MOVED
    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "record_status", nullable = false)
    private String recordStatus;

    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.recordStatus == null) {
            this.recordStatus = "ACTIVE";
        }
    }

    public CuringStock() {
    }

    public Integer getCuringStockId() {
        return curingStockId;
    }

    public void setCuringStockId(Integer curingStockId) {
        this.curingStockId = curingStockId;
    }

    public Production getProduction() {
        return production;
    }

    public void setProduction(Production production) {
        this.production = production;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDate getProductionDate() {
        return productionDate;
    }

    public void setProductionDate(LocalDate productionDate) {
        this.productionDate = productionDate;
    }

    public LocalDate getExpectedReadyDate() {
        return expectedReadyDate;
    }

    public void setExpectedReadyDate(LocalDate expectedReadyDate) {
        this.expectedReadyDate = expectedReadyDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
        this.recordStatus = recordStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}