package com.skcp.dto.request.order;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class OrderItemInOrderRequest {

    @NotNull(message = "Product ID is required")
    @Positive(message = "Product ID must be greater than 0")
    private Integer productId;

    @NotNull(message = "Ordered quantity is required")
    @Positive(message = "Ordered quantity must be greater than 0")
    private Integer orderedQuantity;

    @NotNull(message = "Unit selling price is required")
    @DecimalMin(value = "0.00", inclusive = true,
            message = "Unit selling price cannot be negative")
    private BigDecimal unitSellingPrice;

    private String remarks;

    public OrderItemInOrderRequest() {
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getOrderedQuantity() {
        return orderedQuantity;
    }

    public void setOrderedQuantity(Integer orderedQuantity) {
        this.orderedQuantity = orderedQuantity;
    }

    public BigDecimal getUnitSellingPrice() {
        return unitSellingPrice;
    }

    public void setUnitSellingPrice(BigDecimal unitSellingPrice) {
        this.unitSellingPrice = unitSellingPrice;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}