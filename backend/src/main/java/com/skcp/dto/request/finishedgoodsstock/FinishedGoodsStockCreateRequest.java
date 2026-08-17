package com.skcp.dto.request.finishedgoodsstock;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class FinishedGoodsStockCreateRequest {

    @NotNull(message = "Product ID is required")
    private Integer productId;

    @NotNull(message = "Current stock level is required")
    @PositiveOrZero(message = "Current stock level cannot be negative")
    private Integer currentStockLevel;

    @NotNull(message = "Minimum stock level is required")
    @PositiveOrZero(message = "Minimum stock level cannot be negative")
    private Integer minimumStockLevel;

    private String notes;

    // Default Constructor
    public FinishedGoodsStockCreateRequest() {
    }

    // Getters and Setters

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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}