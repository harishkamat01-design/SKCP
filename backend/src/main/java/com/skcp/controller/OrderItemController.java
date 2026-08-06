package com.skcp.controller;

import com.skcp.entity.OrderItem;
import com.skcp.service.OrderItemService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin(origins = "*")
public class OrderItemController {

    // Dependency Injection
    private final OrderItemService orderItemService;

    // Constructor Injection
    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    // =====================================================
    // GET ALL ORDER ITEMS
    // =====================================================
    @GetMapping
    public ResponseEntity<List<OrderItem>> getAllOrderItems() {

        List<OrderItem> orderItems = orderItemService.getAllOrderItems();

        return new ResponseEntity<>(orderItems, HttpStatus.OK);
    }

    // =====================================================
    // GET ORDER ITEM BY ID
    // =====================================================
    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getOrderItemById(@PathVariable Integer id) {

        OrderItem orderItem = orderItemService.getOrderItemById(id);

        if (orderItem != null) {
            return new ResponseEntity<>(orderItem, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // =====================================================
    // CREATE ORDER ITEM
    // =====================================================
    @PostMapping
    public ResponseEntity<OrderItem> createOrderItem(@RequestBody OrderItem orderItem) {

        OrderItem savedOrderItem = orderItemService.saveOrderItem(orderItem);

        return new ResponseEntity<>(savedOrderItem, HttpStatus.CREATED);
    }

    // =====================================================
    // UPDATE ORDER ITEM
    // =====================================================
    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> updateOrderItem(
            @PathVariable Integer id,
            @RequestBody OrderItem updatedOrderItem) {

        OrderItem existingOrderItem = orderItemService.getOrderItemById(id);

        if (existingOrderItem == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        existingOrderItem.setOrder(updatedOrderItem.getOrder());
        existingOrderItem.setProduct(updatedOrderItem.getProduct());
        existingOrderItem.setOrderedQuantity(updatedOrderItem.getOrderedQuantity());
        existingOrderItem.setUnitSellingPrice(updatedOrderItem.getUnitSellingPrice());
        existingOrderItem.setRemarks(updatedOrderItem.getRemarks());

        OrderItem savedOrderItem = orderItemService.saveOrderItem(existingOrderItem);

        return new ResponseEntity<>(savedOrderItem, HttpStatus.OK);
    }

    // =====================================================
    // DELETE ORDER ITEM
    // =====================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Integer id) {

        OrderItem existingOrderItem = orderItemService.getOrderItemById(id);

        if (existingOrderItem == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        orderItemService.deleteOrderItem(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}