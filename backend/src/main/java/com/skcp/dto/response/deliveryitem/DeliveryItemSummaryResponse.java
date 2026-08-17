
package com.skcp.dto.response.deliveryitem;

public class DeliveryItemSummaryResponse {

    private Integer deliveryItemId;

    private Integer deliveryId;

    private Integer productId;

    private Integer deliveredQuantity;

    private String recordStatus;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public DeliveryItemSummaryResponse() {
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

    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
        this.recordStatus = recordStatus;
    }
}