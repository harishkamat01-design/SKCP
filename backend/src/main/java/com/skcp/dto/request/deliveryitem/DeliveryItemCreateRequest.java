package com.skcp.dto.request.deliveryitem;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class DeliveryItemCreateRequest {

    @NotNull(message = "Delivery ID is required")
    @Positive(message = "Delivery ID must be greater than 0")
    private Integer deliveryId;

    @NotNull(message = "Product ID is required")
    @Positive(message = "Product ID must be greater than 0")
    private Integer productId;

    @NotNull(message = "Delivered quantity is required")
    @Positive(message = "Delivered quantity must be greater than 0")
    private Integer deliveredQuantity;

    private String remarks;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public DeliveryItemCreateRequest() {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(Integer deliveryId) {
        this.deliveryId = deliveryId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getDeliveredQuantity() {
        return deliveredQuantity;
    }

    public void setDeliveredQuantity(Integer deliveredQuantity) {
        this.deliveredQuantity = deliveredQuantity;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
