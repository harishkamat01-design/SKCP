package com.skcp.dto.response.orderitem;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderItemResponse {

    // ============================================================
    // ORDER ITEM ID
    // ============================================================

    private Integer orderItemId;


    // ============================================================
    // ORDER ID
    // ============================================================

    private Integer orderId;


    // ============================================================
    // PRODUCT ID
    // ============================================================

    private Integer productId;


    // ============================================================
    // ORDERED QUANTITY
    // ============================================================

    private Integer orderedQuantity;


    // ============================================================
    // UNIT SELLING PRICE
    // ============================================================

    private BigDecimal unitSellingPrice;


    // ============================================================
    // REMARKS
    // ============================================================

    private String remarks;


    // ============================================================
    // CREATED AT
    // ============================================================

    private LocalDateTime createdAt;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public OrderItemResponse() {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Integer orderItemId) {
        this.orderItemId = orderItemId;
    }


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


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}