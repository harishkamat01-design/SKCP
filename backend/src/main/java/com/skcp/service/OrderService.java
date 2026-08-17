package com.skcp.service;

import com.skcp.dto.request.order.OrderCreateRequest;
import com.skcp.dto.request.order.OrderUpdateRequest;
import com.skcp.dto.response.order.OrderResponse;
import com.skcp.dto.response.order.OrderSummaryResponse;
import com.skcp.entity.Customer;
import com.skcp.entity.Order;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.OrderMapper;
import com.skcp.repository.CustomerRepository;
import com.skcp.repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public OrderService(
            OrderRepository orderRepository,
            CustomerRepository customerRepository) {

        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
    }


    // ============================================================
    // GET ALL ACTIVE ORDERS
    // ============================================================

    public List<OrderSummaryResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .filter(order ->
                        "ACTIVE".equals(order.getRecordStatus()))
                .map(OrderMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // GET ACTIVE ORDER BY ID
    // ============================================================

    public OrderResponse getOrderById(Integer id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id
                        )
                );

        if (!"ACTIVE".equals(order.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Order not found with ID: " + id
            );
        }

        return OrderMapper.toResponse(order);
    }


    // ============================================================
    // CREATE ORDER
    // ============================================================

    public OrderResponse createOrder(
            OrderCreateRequest request) {

        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with ID: "
                                        + request.getCustomerId()
                        )
                );

        Order order = OrderMapper.toEntity(
                request,
                customer
        );

        /*
         * New Order:
         *
         * orderStatus  → PENDING
         * recordStatus → ACTIVE
         *
         * Both defaults are handled by Order @PrePersist.
         */

        Order savedOrder =
                orderRepository.save(order);

        return OrderMapper.toResponse(savedOrder);
    }


    // ============================================================
    // UPDATE ORDER
    // ============================================================

    public OrderResponse updateOrder(
            Integer id,
            OrderUpdateRequest request) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id
                        )
                );

        /*
         * Only ACTIVE records can be updated.
         */

        if (!"ACTIVE".equals(order.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Order not found with ID: " + id
            );
        }


        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with ID: "
                                        + request.getCustomerId()
                        )
                );


        OrderMapper.updateEntity(
                order,
                request,
                customer
        );

        Order updatedOrder =
                orderRepository.save(order);

        return OrderMapper.toResponse(updatedOrder);
    }


    // ============================================================
    // SOFT DELETE ORDER
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

    public void deleteOrder(Integer id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id
                        )
                );


        if ("INACTIVE".equals(order.getRecordStatus())) {

            throw new DuplicateResourceException(
                    "Order is already inactive with ID: " + id
            );
        }


        order.setRecordStatus("INACTIVE");

        orderRepository.save(order);
    }
}




/*

                 ORDER
                   │
        ┌──────────┴──────────┐
        │                     │
   orderStatus          recordStatus
        │                     │
        ▼                     ▼
 PENDING                 ACTIVE
 PARTIAL                    │
 COMPLETED                  │ DELETE
 CANCELLED                  ▼
                         INACTIVE

And importantly:
GET ALL → only ACTIVE
GET BY ID → only ACTIVE
CREATE → PENDING + ACTIVE
UPDATE → only ACTIVE
DELETE → ACTIVE → INACTIVE
Physical DELETE FROM orders is not used
ResourceNotFoundException → your existing 404
DuplicateResourceException → your existing 409

*/




/*  Before DTO code:


package com.skcp.service;

import com.skcp.entity.Order;
import com.skcp.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    // Dependency Injection
    private final OrderRepository orderRepository;

    // Constructor Injection
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Get all Orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Save Order
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    // Find Order by ID
    public Order getOrderById(Integer id) {
        return orderRepository.findById(id).orElse(null);
    }

    // Delete Order
    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }
}

*/