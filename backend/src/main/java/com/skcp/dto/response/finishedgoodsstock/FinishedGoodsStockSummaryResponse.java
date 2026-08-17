package com.skcp.dto.response.finishedgoodsstock;

public class FinishedGoodsStockSummaryResponse {

    private Integer finishedGoodsStockId;
    private Integer productId;
    private Integer currentStockLevel;
    private Integer minimumStockLevel;
    private String status;

    // Default Constructor
    public FinishedGoodsStockSummaryResponse() {
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}