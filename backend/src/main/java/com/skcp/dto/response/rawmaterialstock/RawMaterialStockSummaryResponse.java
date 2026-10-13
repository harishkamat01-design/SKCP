package com.skcp.dto.response.rawmaterialstock;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RawMaterialStockSummaryResponse {

    // ============================================================
    // RAW MATERIAL STOCK ID
    // ============================================================

    private Integer rawMaterialStockId;

    // ============================================================
    // RAW MATERIAL
    // ============================================================

    private Integer rawMaterialId;
    private String rawMaterialName;
    private String rawMaterialUnit;

    // ============================================================
    // STOCK DATES
    // ============================================================

    private LocalDate stockDate;
    private LocalDate lastUpdatedDate;

    // ============================================================
    // STOCK
    // ============================================================

    private BigDecimal currentStockLevel;
    private BigDecimal minimumStockLevel;

    // ============================================================
    // STOCK STATUS
    // ============================================================

    private String stockStatus;

    // ============================================================
    // RECORD STATUS
    // ============================================================

    private String recordStatus;

    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public RawMaterialStockSummaryResponse() {
    }

    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getRawMaterialStockId() {
        return rawMaterialStockId;
    }

    public void setRawMaterialStockId(Integer rawMaterialStockId) {
        this.rawMaterialStockId = rawMaterialStockId;
    }

    public Integer getRawMaterialId() {
        return rawMaterialId;
    }

    public void setRawMaterialId(Integer rawMaterialId) {
        this.rawMaterialId = rawMaterialId;
    }

    public String getRawMaterialName() {
        return rawMaterialName;
    }

    public void setRawMaterialName(String rawMaterialName) {
        this.rawMaterialName = rawMaterialName;
    }

    public String getRawMaterialUnit() {
        return rawMaterialUnit;
    }

    public void setRawMaterialUnit(String rawMaterialUnit) {
        this.rawMaterialUnit = rawMaterialUnit;
    }

    public LocalDate getStockDate() {
        return stockDate;
    }

    public void setStockDate(LocalDate stockDate) {
        this.stockDate = stockDate;
    }

    public LocalDate getLastUpdatedDate() {
        return lastUpdatedDate;
    }

    public void setLastUpdatedDate(LocalDate lastUpdatedDate) {
        this.lastUpdatedDate = lastUpdatedDate;
    }

    public BigDecimal getCurrentStockLevel() {
        return currentStockLevel;
    }

    public void setCurrentStockLevel(BigDecimal currentStockLevel) {
        this.currentStockLevel = currentStockLevel;
    }

    public BigDecimal getMinimumStockLevel() {
        return minimumStockLevel;
    }

    public void setMinimumStockLevel(BigDecimal minimumStockLevel) {
        this.minimumStockLevel = minimumStockLevel;
    }

    public String getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(String stockStatus) {
        this.stockStatus = stockStatus;
    }

    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
        this.recordStatus = recordStatus;
    }
}