
package com.skcp.dto.request.curingstock;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CuringStockCreateRequest {

    // ============================================================
    // PRODUCTION ID
    // ============================================================

    @NotNull(message = "Production ID is required")
    private Integer productionId;

    // ============================================================
    // PRODUCT ID
    // ============================================================

    @NotNull(message = "Product ID is required")
    private Integer productId;

    // ============================================================
    // QUANTITY
    // ============================================================

    @NotNull(message = "Quantity is required")
    @Min(
            value = 0,
            message = "Quantity cannot be negative"
    )
    private Integer quantity;

    // ============================================================
    // PRODUCTION DATE
    // ============================================================

    @NotNull(message = "Production date is required")
    private LocalDate productionDate;

    // ============================================================
    // REMARKS
    // ============================================================

    @Size(
            max = 255,
            message = "Remarks cannot exceed 255 characters"
    )
    private String remarks;

    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public CuringStockCreateRequest() {
    }

    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = normalize(remarks);
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
