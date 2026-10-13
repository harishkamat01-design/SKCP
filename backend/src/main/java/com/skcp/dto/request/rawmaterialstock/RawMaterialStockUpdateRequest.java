package com.skcp.dto.request.rawmaterialstock;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RawMaterialStockUpdateRequest {

    @NotNull(message = "Raw material ID is required")
    private Integer rawMaterialId;

    @NotNull(message = "Stock date is required")
    private LocalDate stockDate;

    @NotNull(message = "Current stock level is required")
    @DecimalMin(
            value = "0.00",
            message = "Current stock level cannot be negative"
    )
    private BigDecimal currentStockLevel;

    @DecimalMin(
            value = "0.00",
            message = "Minimum stock level cannot be negative"
    )
    private BigDecimal minimumStockLevel;

    @Size(
            max = 1000,
            message = "Notes must not exceed 1000 characters"
    )
    private String notes;

    public RawMaterialStockUpdateRequest() {
    }

    public Integer getRawMaterialId() {
        return rawMaterialId;
    }

    public void setRawMaterialId(Integer rawMaterialId) {
        this.rawMaterialId = rawMaterialId;
    }

    public LocalDate getStockDate() {
        return stockDate;
    }

    public void setStockDate(LocalDate stockDate) {
        this.stockDate = stockDate;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = normalize(notes);
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmedValue = value.trim();
        return trimmedValue.isEmpty() ? null : trimmedValue;
    }
}