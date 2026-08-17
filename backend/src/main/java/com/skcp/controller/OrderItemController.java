package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.orderitem.OrderItemCreateRequest;
import com.skcp.dto.request.orderitem.OrderItemUpdateRequest;
import com.skcp.dto.response.orderitem.OrderItemResponse;
import com.skcp.service.OrderItemService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin(origins = "*")
public class OrderItemController {

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final OrderItemService orderItemService;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public OrderItemController(
            OrderItemService orderItemService) {

        this.orderItemService = orderItemService;
    }


    // ============================================================
    // GET ALL ACTIVE ORDER ITEMS
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<OrderItemResponse>>
            > getAllOrderItems() {

        List<OrderItemResponse> orderItems =
                orderItemService.getAllOrderItems();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order items retrieved successfully",
                        orderItems
                )
        );
    }


    // ============================================================
    // GET ACTIVE ORDER ITEM BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<OrderItemResponse>
            > getOrderItemById(
                    @PathVariable Integer id) {

        OrderItemResponse orderItem =
                orderItemService.getOrderItemById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order item retrieved successfully",
                        orderItem
                )
        );
    }


    // ============================================================
    // CREATE ORDER ITEM
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<OrderItemResponse>
            > createOrderItem(
                    @Valid
                    @RequestBody OrderItemCreateRequest request) {

        OrderItemResponse savedOrderItem =
                orderItemService.createOrderItem(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Order item created successfully",
                                savedOrderItem
                        )
                );
    }


    // ============================================================
    // UPDATE ORDER ITEM
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<OrderItemResponse>
            > updateOrderItem(
                    @PathVariable Integer id,
                    @Valid
                    @RequestBody OrderItemUpdateRequest request) {

        OrderItemResponse updatedOrderItem =
                orderItemService.updateOrderItem(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order item updated successfully",
                        updatedOrderItem
                )
        );
    }


    // ============================================================
    // DELETE / SOFT DELETE ORDER ITEM
    // ============================================================
    //
    // ACTIVE → INACTIVE
    //
    // Database row is preserved.
    //
    // API returns:
    //
    // 200 OK
    // {
    //     "data": null,
    //     "message": "Order item deleted successfully",
    //     "status": "SUCCESS",
    //     "timestamp": "..."
    // }
    //
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deleteOrderItem(
                    @PathVariable Integer id) {

        orderItemService.deleteOrderItem(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Order item deleted successfully",
                        null
                )
        );
    }
}