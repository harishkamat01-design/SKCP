package com.skcp.controller;

import com.skcp.entity.Orders;
import com.skcp.service.OrdersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    // Dependency Injection
    private final OrdersService ordersService;

    // Constructor Injection
    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    // ============================================
    // GET ALL ORDERS
    // ============================================
    @GetMapping
    public ResponseEntity<List<Orders>> getAllOrders() {

        List<Orders> orders = ordersService.getAllOrders();

        return ResponseEntity.ok(orders);
    }

    // ============================================
    // GET ORDER BY ID
    // ============================================
    @GetMapping("/{id}")
    public ResponseEntity<Orders> getOrdersById(@PathVariable Integer id) {

        Orders orders = ordersService.getOrdersById(id);

        if (orders == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(orders);
    }

    // ============================================
    // CREATE ORDER
    // ============================================
    @PostMapping
    public ResponseEntity<Orders> createOrders(@RequestBody Orders orders) {

        Orders savedOrders = ordersService.saveOrders(orders);

        return new ResponseEntity<>(savedOrders, HttpStatus.CREATED);
    }

    // ============================================
    // UPDATE ORDER
    // ============================================
    @PutMapping("/{id}")
    public ResponseEntity<Orders> updateOrders(
            @PathVariable Integer id,
            @RequestBody Orders orders) {

        Orders existingOrders = ordersService.getOrdersById(id);

        if (existingOrders == null) {
            return ResponseEntity.notFound().build();
        }

        orders.setOrderId(id);

        Orders updatedOrders = ordersService.saveOrders(orders);

        return ResponseEntity.ok(updatedOrders);
    }

    // ============================================
    // DELETE ORDER
    // ============================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrders(@PathVariable Integer id) {

        Orders existingOrders = ordersService.getOrdersById(id);

        if (existingOrders == null) {
            return ResponseEntity.notFound().build();
        }

        ordersService.deleteOrders(id);

        return ResponseEntity.noContent().build();
    }
}