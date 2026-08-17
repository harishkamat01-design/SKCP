package com.skcp.dto.request.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class ProductUpdateRequest {

    // ============================================================
    // PRODUCT CODE
    // ============================================================

    @NotBlank(message = "Product code is required")
    @Size(max = 20, message = "Product code must not exceed 20 characters")
    private String productCode;


    // ============================================================
    // PRODUCT NAME
    // ============================================================

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String productName;


    // ============================================================
    // SIZE
    // ============================================================

    @NotBlank(message = "Product size is required")
    @Size(max = 10, message = "Product size must not exceed 10 characters")
    private String size;


    // ============================================================
    // LENGTH
    // ============================================================

    @NotNull(message = "Length is required")
    @DecimalMin(value = "0.01", message = "Length must be greater than 0")
    private BigDecimal length;


    // ============================================================
    // WIDTH
    // ============================================================

    @NotNull(message = "Width is required")
    @DecimalMin(value = "0.01", message = "Width must be greater than 0")
    private BigDecimal width;


    // ============================================================
    // HEIGHT
    // ============================================================

    @NotNull(message = "Height is required")
    @DecimalMin(value = "0.01", message = "Height must be greater than 0")
    private BigDecimal height;


    // ============================================================
    // UNIT
    // ============================================================

    @NotBlank(message = "Unit is required")
    @Size(max = 20, message = "Unit must not exceed 20 characters")
    private String unit;


    // ============================================================
    // DESCRIPTION
    // ============================================================

    private String description;


    // ============================================================
    // STATUS
    // ============================================================

    @NotBlank(message = "Status is required")
    @Size(max = 10, message = "Status must not exceed 10 characters")
    private String status;


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }


    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }


    public String getSize() {
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
}