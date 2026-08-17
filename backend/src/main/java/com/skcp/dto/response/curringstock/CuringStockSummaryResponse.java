package com.skcp.dto.response.curringstock;

import java.time.LocalDate;

public class CuringStockSummaryResponse {

    private Integer curingStockId;

    private Integer productionId;

    private Integer productId;

    private String productName;

    private Integer quantity;

    private LocalDate productionDate;

    private LocalDate expectedReadyDate;

    private String status;

    private String recordStatus;

    // Default Constructor
    public CuringStockSummaryResponse() {
    }

    // Getters and Setters

    public Integer getCuringStockId() {
        return curingStockId;
    }

    public void setCuringStockId(Integer curingStockId) {
        this.curingStockId = curingStockId;
    }

    public Integer getProductionId() {
        return productionId;
    }

    public void setProductionId(Integer productionId) {
        this.productionId = productionId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
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

    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
        this.recordStatus = recordStatus;
    }
}