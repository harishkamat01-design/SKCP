package com.skcp.dto.response.rawmaterialstock;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RawMaterialStockResponse {

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
    // STOCK DETAILS
    // ============================================================

    private BigDecimal currentStockLevel;

    private BigDecimal minimumStockLevel;

    private LocalDate lastUpdatedDate;


    // ============================================================
    // STOCK STATUS
    // ============================================================

    private String stockStatus;


    // ============================================================
    // RECORD STATUS
    // ============================================================

    private String recordStatus;


    // ============================================================
    // OTHER DETAILS
    // ============================================================

    private String notes;

    private LocalDateTime createdAt;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public RawMaterialStockResponse() {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getRawMaterialStockId() {
        return rawMaterialStockId;
    }

    public void setRawMaterialStockId(
            Integer rawMaterialStockId) {

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

    public void setRawMaterialName(
            String rawMaterialName) {

        this.rawMaterialName = rawMaterialName;
    }


    public String getRawMaterialUnit() {
        return rawMaterialUnit;
    }

    public void setRawMaterialUnit(
            String rawMaterialUnit) {

        this.rawMaterialUnit = rawMaterialUnit;
    }


    public BigDecimal getCurrentStockLevel() {
        return currentStockLevel;
    }

    public void setCurrentStockLevel(
            BigDecimal currentStockLevel) {

        this.currentStockLevel = currentStockLevel;
    }


    public BigDecimal getMinimumStockLevel() {
        return minimumStockLevel;
    }

    public void setMinimumStockLevel(
            BigDecimal minimumStockLevel) {

        this.minimumStockLevel = minimumStockLevel;
    }


    public LocalDate getLastUpdatedDate() {
        return lastUpdatedDate;
    }

    public void setLastUpdatedDate(
            LocalDate lastUpdatedDate) {

        this.lastUpdatedDate = lastUpdatedDate;
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

    public void setRecordStatus(
            String recordStatus) {

        this.recordStatus = recordStatus;
    }


    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }
}