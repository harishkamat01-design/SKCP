package com.skcp.dto.response.order;

import java.math.BigDecimal;

public class OrderBillItemResponse {

    // ============================================================
    // PRODUCT ID
    // ============================================================

    private Integer productId;


    // ============================================================
    // PRODUCT NAME
    // ============================================================

    private String productName;


    // ============================================================
    // PRODUCT SIZE
    // ============================================================

    private String productSize;


    // ============================================================
    // ORDERED QUANTITY
    // ============================================================

    private Integer orderedQuantity;


    // ============================================================
    // UNIT SELLING PRICE / RATE
    // ============================================================

    private BigDecimal unitSellingPrice;


    // ============================================================
    // LINE AMOUNT
    // ============================================================
    //
    // Amount = Quantity × Rate
    //
    // Calculated by backend.
    // ============================================================

    private BigDecimal amount;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public OrderBillItemResponse() {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }


    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }


    public String getProductSize() {
        return productSize;
    }

    public void setProductSize(String productSize) {
        this.productSize = productSize;
    }


    public Integer getOrderedQuantity() {
        return orderedQuantity;
    }

    public void setOrderedQuantity(Integer orderedQuantity) {
        this.orderedQuantity = orderedQuantity;
    }


    public BigDecimal getUnitSellingPrice() {
        return unitSellingPrice;
    }

    public void setUnitSellingPrice(BigDecimal unitSellingPrice) {
        this.unitSellingPrice = unitSellingPrice;
    }


    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}