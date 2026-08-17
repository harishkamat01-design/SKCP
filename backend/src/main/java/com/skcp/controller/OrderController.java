package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.order.OrderCreateRequest;
import com.skcp.dto.request.order.OrderUpdateRequest;
import com.skcp.dto.response.order.OrderResponse;
import com.skcp.dto.response.order.OrderSummaryResponse;
import com.skcp.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    // ============================================================
    // GET ALL ORDERS
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<OrderSummaryResponse>>
            > getAllOrders() {

        List<OrderSummaryResponse> orders =
                orderService.getAllOrders();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Orders retrieved successfully",
                        orders
                )
        );
    }


    // ============================================================
    // GET ORDER BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<OrderResponse>
            > getOrderById(
                    @PathVariable Integer id) {

        OrderResponse order =
                orderService.getOrderById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order retrieved successfully",
                        order
                )
        );
    }


    // ============================================================
    // CREATE ORDER
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<OrderResponse>
            > createOrder(
                    @Valid
                    @RequestBody OrderCreateRequest request) {

        OrderResponse savedOrder =
                orderService.createOrder(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Order created successfully",
                                savedOrder
                        )
                );
    }


    // ============================================================
    // UPDATE ORDER
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<OrderResponse>
            > updateOrder(
                    @PathVariable Integer id,
                    @Valid
                    @RequestBody OrderUpdateRequest request) {

        OrderResponse updatedOrder =
                orderService.updateOrder(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order updated successfully",
                        updatedOrder
                )
        );
    }


    // ============================================================
    // DELETE / SOFT DELETE ORDER
    // ============================================================
    //
    // ACTIVE → INACTIVE
    //
    // Valid ACTIVE ID:
    //     200 OK
    //
    // Already INACTIVE:
    //     409 CONFLICT
    //
    // Invalid ID:
    //     404 NOT FOUND
    //
    // The Service is responsible for throwing the appropriate
    // business exceptions.
    //
    // The finalized exception architecture handles the response.
    //
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deleteOrder(
                    @PathVariable Integer id) {

        orderService.deleteOrder(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Order deleted successfully",
                        null
                )
        );
    }
}
