package com.skcp.dto.request.curringstock;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CuringStockUpdateRequest
{

    // Product being cured
    @NotNull(message = "Product ID is required")
    private Integer productId;

    // Quantity currently under curing
    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    // Production date
    @NotNull(message = "Production date is required")   
    private LocalDate productionDate;

    // Optional remarks
    private String remarks;

    // Default Constructor
    public CuringStockUpdateRequest() {
    }

    // Getters and Setters

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}