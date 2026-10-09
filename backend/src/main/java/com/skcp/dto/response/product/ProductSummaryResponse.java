    package com.skcp.dto.response.product;

import java.math.BigDecimal;

public class ProductSummaryResponse {

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
        // SIZE AND PRICE
        // ============================================================

        private String size;
        private BigDecimal price;

        // ============================================================
        // STATUS
        // ============================================================

        private String status;


        // ============================================================
        // GETTERS AND SETTERS
        // ============================================================

        public Integer getProductId() {
            return productId;
        }

        public void setProductId(Integer productId) {
            this.productId = productId;
        }


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

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }