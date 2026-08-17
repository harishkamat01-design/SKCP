package com.skcp.dto.request.production;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ProductionCreateRequest {

    @NotNull(message = "Production date is required")
    private LocalDate productionDate;

    @NotNull(message = "Product ID is required")
    private Integer productId;

    @NotNull(message = "Quantity produced is required")
    @Min(value = 1, message = "Quantity produced must be greater than 0")
    private Integer quantityProduced;

    @NotNull(message = "Morning cement bags is required")
    @DecimalMin(value = "0.00", message = "Morning cement bags cannot be negative")
    private BigDecimal morningCementBags;

    @NotNull(message = "Afternoon cement bags is required")
    @DecimalMin(value = "0.00", message = "Afternoon cement bags cannot be negative")
    private BigDecimal afternoonCementBags;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;

    @NotNull(message = "Asset ID is required")
    private Integer assetId;

    public ProductionCreateRequest() {}

    public LocalDate getProductionDate() { return productionDate; }
    public void setProductionDate(LocalDate productionDate) { this.productionDate = productionDate; }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public Integer getQuantityProduced() { return quantityProduced; }
    public void setQuantityProduced(Integer quantityProduced) { this.quantityProduced = quantityProduced; }

    public BigDecimal getMorningCementBags() { return morningCementBags; }
    public void setMorningCementBags(BigDecimal morningCementBags) { this.morningCementBags = morningCementBags; }

    public BigDecimal getAfternoonCementBags() { return afternoonCementBags; }
    public void setAfternoonCementBags(BigDecimal afternoonCementBags) { this.afternoonCementBags = afternoonCementBags; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) {
        this.notes = notes == null || notes.trim().isEmpty() ? null : notes.trim();
    }

    public Integer getAssetId() { return assetId; }
    public void setAssetId(Integer assetId) { this.assetId = assetId; }
}
