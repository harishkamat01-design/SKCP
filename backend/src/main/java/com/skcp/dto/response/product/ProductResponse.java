package com.skcp.dto.response.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {

    // ============================================================
    // PRODUCT ID
    // ============================================================

    private Integer productId;


    // ============================================================
    // PRODUCT CODE
    // ============================================================

    private String productCode;


    // ============================================================
    // PRODUCT NAME
    // ============================================================

    private String productName;


    // ============================================================
    // SIZE
    // ============================================================

    private String size;


    // ============================================================
    // DIMENSIONS
    // ============================================================

    private BigDecimal length;

    private BigDecimal width;

    private BigDecimal height;


    // ============================================================
    // UNIT
    // ============================================================

    private String unit;


    // ============================================================
    // DESCRIPTION
    // ============================================================

    private String description;


    // ============================================================
    // STATUS
    // ============================================================

    private String status;


    // ============================================================
    // CREATED AT
    // ============================================================

    private LocalDateTime createdAt;


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getProductId() 
    {
        return productId;
    }

    public void setProductId(Integer productId) 
    {
        this.productId = productId;
    }


    public String getProductCode() 
    {
        return productCode;
    }

    public void setProductCode(String productCode) 
    {
        this.productCode = productCode;
    }


    public String getProductName() 
    {
        return productName;
    }

    public void setProductName(String productName) 
    {
        this.productName = productName;
    }


    public String getSize() 
    {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }


    public BigDecimal getLength() {
        return length;
    }

    public void setLength(BigDecimal length) {
        this.length = length;
    }


    public BigDecimal getWidth() {
        return width;
    }

    public void setWidth(BigDecimal width) {
        this.width = width;
    }


    public BigDecimal getHeight() {
        return height;
    }

    public void setHeight(BigDecimal height) {
        this.height = height;
    }


    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}