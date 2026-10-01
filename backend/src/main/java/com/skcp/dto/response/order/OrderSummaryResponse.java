package com.skcp.dto.response.order;

import java.time.LocalDate;

public class OrderSummaryResponse {

    // ============================================================
    // ORDER ID
    // ============================================================

    private Integer orderId;


    // ============================================================
    // CUSTOMER ID
    // ============================================================

    private Integer customerId;


    // ============================================================
    // CUSTOMER NAME
    // ============================================================

    private String customerName;


    // ============================================================
    // ORDER DATE
    // ============================================================

    private LocalDate orderDate;


    // ============================================================
    // EXPECTED DELIVERY DATE
    // ============================================================

    private LocalDate expectedDeliveryDate;


    // ============================================================
    // ORDER STATUS
    // ============================================================

    private String orderStatus;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public OrderSummaryResponse() {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDate getExpectedDeliveryDate() {
        return expectedDeliveryDate;
    }

    public void setExpectedDeliveryDate(
            LocalDate expectedDeliveryDate) {

        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }
}


/*

                    Order Entity
                         │
                    OrderMapper
                    /         \
                   ↓           ↓
      OrderResponse      OrderSummaryResponse
       (full detail)        (list/detail-light)

*/




/*

                    Order Entity
                         │
                    OrderMapper
                    /         \
                   ↓           ↓
      OrderResponse      OrderResponseSummary
       (full detail)        (list/detail-light)

*/