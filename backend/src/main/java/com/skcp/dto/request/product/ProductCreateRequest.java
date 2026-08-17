package com.skcp.dto.request.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class ProductCreateRequest 
{

    @NotBlank(message = "Product code is required")
    @Size(max = 20, message = "Product code must not exceed 20 characters")
    private String productCode;

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
    private String productName;

    @NotBlank(message = "Product size is required")
    @Size(max = 10, message = "Product size must not exceed 10 characters")
    private String size;

    @NotNull(message = "Product length is required")
    @DecimalMin(value = "0.01", message = "Product length must be greater than 0")
    private BigDecimal length;

    @NotNull(message = "Product width is required")
    @DecimalMin(value = "0.01", message = "Product width must be greater than 0")
    private BigDecimal width;

    @NotNull(message = "Product height is required")
    @DecimalMin(value = "0.01", message = "Product height must be greater than 0")
    private BigDecimal height;

    @Size(max = 20, message = "Unit must not exceed 20 characters")
    private String unit;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;


    // Default Constructor

    public ProductCreateRequest() 
    {
    }


    // Getters and Setters

    public String getProductCode() 
    {
        return productCode;
    }

    public void setProductCode(String productCode) 
    {
        this.productCode = normalize(productCode);
    }

    public String getProductName() 
    {
        return productName;
    }

    public void setProductName(String productName) 
    {
        this.productName = normalize(productName);
    }

    public String getSize() 
    {
        return size;
    }

    public void setSize(String size) 
    {
        this.size = normalize(size);
    }

    public BigDecimal getLength() 
    {
        return length;
    }

    public void setLength(BigDecimal length) 
    {
        this.length = length;
    }

    public BigDecimal getWidth() 
    {
        return width;
    }

    public void setWidth(BigDecimal width) 
    {
        this.width = width;
    }

    public BigDecimal getHeight() 
    {
        return height;
    }

    public void setHeight(BigDecimal height) 
    {
        this.height = height;
    }

    public String getUnit() 
    {
        return unit;
    }

    public void setUnit(String unit) 
    {
        this.unit = normalize(unit);
    }

    public String getDescription() 
    {
        return description;
    }

    public void setDescription(String description) 
    {
        this.description = normalize(description);
    }


    // Private helper method

    private String normalize(String value) 
    {

        if (value == null) {
            return null;
        }

        String trimmedValue = value.trim();

        return trimmedValue.isEmpty() ? null : trimmedValue;
    }
}