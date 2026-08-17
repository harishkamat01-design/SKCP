package com.skcp.service;

import com.skcp.dto.request.orderitem.OrderItemCreateRequest;
import com.skcp.dto.request.orderitem.OrderItemUpdateRequest;
import com.skcp.dto.response.orderitem.OrderItemResponse;
import com.skcp.entity.Order;
import com.skcp.entity.OrderItem;
import com.skcp.entity.Product;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.OrderItemMapper;
import com.skcp.repository.OrderItemRepository;
import com.skcp.repository.OrderRepository;
import com.skcp.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderItemService {

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public OrderItemService(
            OrderItemRepository orderItemRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository) {

        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }


    // ============================================================
    // GET ALL ACTIVE ORDER ITEMS
    // ============================================================

    public List<OrderItemResponse> getAllOrderItems() {

        return orderItemRepository.findByRecordStatus("ACTIVE")
                .stream()
                .map(OrderItemMapper::toResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // GET ACTIVE ORDER ITEM BY ID
    // ============================================================

    public OrderItemResponse getOrderItemById(Integer id) {

        OrderItem orderItem =
                orderItemRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order Item not found with ID: "
                                                + id
                                )
                        );


        if (!"ACTIVE".equals(
                orderItem.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Order Item not found with ID: " + id
            );
        }


        return OrderItemMapper.toResponse(orderItem);
    }


    // ============================================================
    // CREATE ORDER ITEM
    // ============================================================

    public OrderItemResponse createOrderItem(
            OrderItemCreateRequest request) {


        // --------------------------------------------------------
        // FIND ORDER
        // --------------------------------------------------------

        Order order =
                orderRepository
                        .findById(request.getOrderId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found with ID: "
                                                + request.getOrderId()
                                )
                        );


        // --------------------------------------------------------
        // ORDER MUST BE ACTIVE
        // --------------------------------------------------------

        if (!"ACTIVE".equals(
                order.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Order not found with ID: "
                            + request.getOrderId()
            );
        }


        // --------------------------------------------------------
        // FIND PRODUCT
        // --------------------------------------------------------

        Product product =
                productRepository
                        .findById(request.getProductId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with ID: "
                                                + request.getProductId()
                                )
                        );


        // --------------------------------------------------------
        // PRODUCT MUST BE ACTIVE
        // --------------------------------------------------------

        if (!"ACTIVE".equals(
                product.getStatus())) {

            throw new ResourceNotFoundException(
                    "Product not found with ID: "
                            + request.getProductId()
            );
        }


        // --------------------------------------------------------
        // CREATE ENTITY
        // --------------------------------------------------------

        OrderItem orderItem =
                OrderItemMapper.toEntity(
                        request,
                        order,
                        product
                );


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        OrderItem savedOrderItem =
                orderItemRepository.save(orderItem);


        // --------------------------------------------------------
        // RESPONSE
        // --------------------------------------------------------

        return OrderItemMapper.toResponse(
                savedOrderItem
        );
    }


    // ============================================================
    // UPDATE ORDER ITEM
    // ============================================================

    public OrderItemResponse updateOrderItem(
            Integer id,
            OrderItemUpdateRequest request) {


        // --------------------------------------------------------
        // FIND EXISTING ORDER ITEM
        // --------------------------------------------------------

        OrderItem orderItem =
                orderItemRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order Item not found with ID: "
                                                + id
                                )
                        );


        // --------------------------------------------------------
        // ONLY ACTIVE RECORDS CAN BE UPDATED
        // --------------------------------------------------------

        if (!"ACTIVE".equals(
                orderItem.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Order Item not found with ID: " + id
            );
        }


        // --------------------------------------------------------
        // FIND ORDER
        // --------------------------------------------------------

        Order order =
                orderRepository
                        .findById(request.getOrderId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found with ID: "
                                                + request.getOrderId()
                                )
                        );


        // --------------------------------------------------------
        // ORDER MUST BE ACTIVE
        // --------------------------------------------------------

        if (!"ACTIVE".equals(
                order.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Order not found with ID: "
                            + request.getOrderId()
            );
        }


        // --------------------------------------------------------
        // FIND PRODUCT
        // --------------------------------------------------------

        Product product =
                productRepository
                        .findById(request.getProductId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with ID: "
                                                + request.getProductId()
                                )
                        );


        // --------------------------------------------------------
        // PRODUCT MUST BE ACTIVE
        // --------------------------------------------------------

        if (!"ACTIVE".equals(
                product.getStatus())) {

            throw new ResourceNotFoundException(
                    "Product not found with ID: "
                            + request.getProductId()
            );
        }


        // --------------------------------------------------------
        // UPDATE ENTITY
        // --------------------------------------------------------

        OrderItemMapper.updateEntity(
                orderItem,
                request,
                order,
                product
        );


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        OrderItem updatedOrderItem =
                orderItemRepository.save(orderItem);


        // --------------------------------------------------------
        // RESPONSE
        // --------------------------------------------------------

        return OrderItemMapper.toResponse(
                updatedOrderItem
        );
    }


    // ============================================================
    // SOFT DELETE ORDER ITEM
    // ============================================================
    //
    // ACTIVE → INACTIVE
    //
    // Unknown ID:
    //     ResourceNotFoundException → 404
    //
    // Already INACTIVE:
    //     DuplicateResourceException → 409
    //
    // No physical DELETE occurs in PostgreSQL.
    // ============================================================

    public void deleteOrderItem(Integer id) {

        OrderItem orderItem =
                orderItemRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order Item not found with ID: "
                                                + id
                                )
                        );


        // --------------------------------------------------------
        // ALREADY INACTIVE
        // --------------------------------------------------------

        if ("INACTIVE".equals(
                orderItem.getRecordStatus())) {

            throw new DuplicateResourceException(
                    "Order Item is already inactive with ID: "
                            + id
            );
        }


        // --------------------------------------------------------
        // SOFT DELETE
        // --------------------------------------------------------

        orderItem.setRecordStatus("INACTIVE");

        orderItemRepository.save(orderItem);
    }
}


/*
package com.skcp.service;

import com.skcp.entity.OrderItem;
import com.skcp.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    // Dependency Injection
    private final OrderItemRepository orderItemRepository;

    // Constructor Injection
    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    // Get All Order Items
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    // Save Order Item
    public OrderItem saveOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    // Find Order Item by ID
    public OrderItem getOrderItemById(Integer id) {
        return orderItemRepository.findById(id).orElse(null);
    }

    // Delete Order Item
    public void deleteOrderItem(Integer id) {
        orderItemRepository.deleteById(id);
    }
}
    */