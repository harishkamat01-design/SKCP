package com.skcp.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Integer orderItemId;


    // ORDER RELATIONSHIP
   

    // Parent Relationship → Order
    // Many OrderItems can belong to one Order.

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;


    
    // PRODUCT RELATIONSHIP
    
    // Parent Relationship → Product
    // Many OrderItems can refer to one Product.

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // ORDERED QUANTITY
   

    @Column(name = "ordered_quantity", nullable = false)
    private Integer orderedQuantity;



    // UNIT SELLING PRICE


    // Price captured at the time of the order.
    //
    // This is a historical price snapshot.
    // It should NOT automatically change when the Product's
    // current selling price changes.

    @Column(
            name = "unit_selling_price",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal unitSellingPrice;

  
    // RECORD STATUS
   

    // Database record lifecycle:
    // ACTIVE / INACTIVE
    //
    // This is separate from Order.orderStatus.

    @Column(name = "record_status", nullable = false)
    private String recordStatus;

    // REMARKS
    @Column(name = "remarks")
    private String remarks;


    // CREATED AT
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    // PRE-PERSIST
    @PrePersist
    public void prePersist() {

        this.createdAt = LocalDateTime.now();

        if (this.recordStatus == null) {
            this.recordStatus = "ACTIVE";
        }
    }


    // DEFAULT CONSTRUCTOR
    public OrderItem() {
    }

    // GETTERS AND SETTERS
    public Integer getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Integer orderItemId) {
        this.orderItemId = orderItemId;
    }


    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }


    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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


    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
        this.recordStatus = recordStatus;
    }


    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}




/*


package com.skcp.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_item")
public class OrderItem 
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Integer orderItemId;

    // Parent Relationship → Orders
    @ManyToOne                                                 
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Parent Relationship → Product                      
    @ManyToOne                                                 
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "ordered_quantity", nullable = false)
    private Integer orderedQuantity;

    @Column(name = "unit_selling_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitSellingPrice;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    
    public OrderItem() 
    {

    }

     ==========================

    public Integer getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Integer orderItemId) {
        this.orderItemId = orderItemId;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


*/