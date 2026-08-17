package com.skcp.dto.response.finishedgoodsstock;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class FinishedGoodsStockResponse {

    private Integer finishedGoodsStockId;
    private Integer productId;
    private Integer currentStockLevel;
    private Integer minimumStockLevel;
    private LocalDate lastUpdatedDate;
    private String status;
    private String notes;
    private LocalDateTime createdAt;

    // Default Constructor
    public FinishedGoodsStockResponse() {
    }

    // Getters and Setters

    public Integer getFinishedGoodsStockId() {
        return finishedGoodsStockId;
    }

    public void setFinishedGoodsStockId(Integer finishedGoodsStockId) {
        this.finishedGoodsStockId = finishedGoodsStockId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
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