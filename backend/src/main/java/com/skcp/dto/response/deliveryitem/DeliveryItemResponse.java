package com.skcp.dto.response.deliveryitem;

import java.time.LocalDateTime;

public class DeliveryItemResponse {

    private Integer deliveryItemId;

    private Integer deliveryId;

    private Integer productId;

    private Integer deliveredQuantity;

    private String remarks;

    private String recordStatus;

    private LocalDateTime createdAt;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public DeliveryItemResponse() {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getDeliveryItemId() {
        return deliveryItemId;
    }

    public void setDeliveryItemId(Integer deliveryItemId) {
        this.deliveryItemId = deliveryItemId;
    }

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
