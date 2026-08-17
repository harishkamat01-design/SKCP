package com.skcp.dto.request.orderitem;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class OrderItemCreateRequest {

    // ============================================================
    // ORDER ID
    // ============================================================

    @NotNull(message = "Order ID is required")
    @Positive(message = "Order ID must be greater than 0")
    private Integer orderId;


    // ============================================================
    // PRODUCT ID
    // ============================================================

    @NotNull(message = "Product ID is required")
    @Positive(message = "Product ID must be greater than 0")
    private Integer productId;


    // ============================================================
    // ORDERED QUANTITY
    // ============================================================

    @NotNull(message = "Ordered quantity is required")
    @Positive(message = "Ordered quantity must be greater than 0")
    private Integer orderedQuantity;


    // ============================================================
    // UNIT SELLING PRICE
    // ============================================================

    @NotNull(message = "Unit selling price is required")
    @DecimalMin(
            value = "0.00",
            message = "Unit selling price must be greater than or equal to 0"
    )
    private BigDecimal unitSellingPrice;


    // ============================================================
    // REMARKS
    // ============================================================

    private String remarks;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public OrderItemCreateRequest() {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
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
