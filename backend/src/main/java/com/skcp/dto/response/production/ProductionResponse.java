package com.skcp.dto.response.production;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProductionResponse {
    private Integer productionId;
    private LocalDate productionDate;
    private Integer productId;
    private String productCode;
    private String productName;
    private String productSize;
    private Integer quantityProduced;
    private BigDecimal morningCementBags;
    private BigDecimal afternoonCementBags;
    private BigDecimal totalCementBags;
    private Integer assetId;
    private String assetName;
    private String assetCategory;
    private String notes;
    private String status;
    private LocalDateTime createdAt;

    public ProductionResponse() {}

    public Integer getProductionId() { return productionId; }
    public void setProductionId(Integer v) { productionId = v; }
    public LocalDate getProductionDate() { return productionDate; }
    public void setProductionDate(LocalDate v) { productionDate = v; }
    public Integer getProductId() { return productId; }
    public void setProductId(Integer v) { productId = v; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String v) { productCode = v; }
    public String getProductName() { return productName; }
    public void setProductName(String v) { productName = v; }
    public String getProductSize() { return productSize; }
    public void setProductSize(String v) { productSize = v; }
    public Integer getQuantityProduced() { return quantityProduced; }
    public void setQuantityProduced(Integer v) { quantityProduced = v; }
    public BigDecimal getMorningCementBags() { return morningCementBags; }
    public void setMorningCementBags(BigDecimal v) { morningCementBags = v; }
    public BigDecimal getAfternoonCementBags() { return afternoonCementBags; }
    public void setAfternoonCementBags(BigDecimal v) { afternoonCementBags = v; }
    public BigDecimal getTotalCementBags() { return totalCementBags; }
    public void setTotalCementBags(BigDecimal v) { totalCementBags = v; }
    public Integer getAssetId() { return assetId; }
    public void setAssetId(Integer v) { assetId = v; }
    public String getAssetName() { return assetName; }
    public void setAssetName(String v) { assetName = v; }
    public String getAssetCategory() { return assetCategory; }
    public void setAssetCategory(String v) { assetCategory = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { notes = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { status = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { createdAt = v; }
}
    