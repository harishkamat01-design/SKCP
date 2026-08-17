package com.skcp.dto.request.rawmaterialstock;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class RawMaterialStockCreateRequest {

    // ============================================================
    // RAW MATERIAL ID
    // ============================================================

    @NotNull(message = "Raw material ID is required")
    private Integer rawMaterialId;


    // ============================================================
    // CURRENT STOCK LEVEL
    // ============================================================

    /*
     * 0 is a valid business value.
     *
     * Example:
     * No stock currently available.
     *
     * Therefore:
     *
     * 0  = valid
     * 1+ = valid
     * <0 = invalid
     */

    @NotNull(message = "Current stock level is required")
    @DecimalMin(
            value = "0.00",
            message = "Current stock level cannot be negative"
    )
    private BigDecimal currentStockLevel;


    // ============================================================
    // MINIMUM STOCK LEVEL
    // ============================================================

    @DecimalMin(
            value = "0.00",
            message = "Minimum stock level cannot be negative"
    )
    private BigDecimal minimumStockLevel;


    // ============================================================
    // NOTES
    // ============================================================

    @Size(
            max = 1000,
            message = "Notes must not exceed 1000 characters"
    )
    private String notes;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public RawMaterialStockCreateRequest() {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getRawMaterialId() {
        return rawMaterialId;
    }

    public void setRawMaterialId(Integer rawMaterialId) {
        this.rawMaterialId = rawMaterialId;
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


    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = normalize(notes);
    }


    // ============================================================
    // NORMALIZATION
    // ============================================================

    private String normalize(String value) {

        if (value == null) {
            return null;
        }

        String trimmedValue = value.trim();

        return trimmedValue.isEmpty()
                ? null
                : trimmedValue;
    }
}