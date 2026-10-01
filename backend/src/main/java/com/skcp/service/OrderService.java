package com.skcp.service;

import com.skcp.dto.request.delivery.DeliveryCreateRequest;
import com.skcp.dto.request.order.OrderCreateRequest;
import com.skcp.dto.request.order.OrderItemInOrderRequest;
import com.skcp.dto.request.order.OrderUpdateRequest;
import com.skcp.dto.response.order.OrderBillItemResponse;
import com.skcp.dto.response.order.OrderResponse;
import com.skcp.dto.response.order.OrderSummaryResponse;
import com.skcp.entity.Customer;
import com.skcp.entity.Delivery;
import com.skcp.entity.Order;
import com.skcp.entity.OrderItem;
import com.skcp.entity.PaymentAllocation;
import com.skcp.entity.Product;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.DeliveryMapper;
import com.skcp.mapper.OrderMapper;
import com.skcp.repository.CustomerRepository;
import com.skcp.repository.DeliveryRepository;
import com.skcp.repository.OrderItemRepository;
import com.skcp.repository.OrderRepository;
import com.skcp.repository.PaymentAllocationRepository;
import com.skcp.repository.ProductRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final DeliveryRepository deliveryRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final PaymentAllocationRepository paymentAllocationRepository;

    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public OrderService(
            OrderRepository orderRepository,
            CustomerRepository customerRepository,
            DeliveryRepository deliveryRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            PaymentAllocationRepository paymentAllocationRepository) {

        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.deliveryRepository = deliveryRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.paymentAllocationRepository = paymentAllocationRepository;
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

        Order order =
                orderRepository
                        .findById(id)
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

        return buildOrderBill(order);
    }

    // ============================================================
    // CREATE ORDER
    // ============================================================
    //
    // Complete business transaction:
    //
    // 1. Validate Customer
    // 2. Create Order
    // 3. Save Order
    // 4. Create OrderItems
    // 5. Validate Products
    // 6. Create first Delivery automatically
    //
    // If any step fails, the complete transaction is rolled back.
    // ============================================================

    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request) {

        // --------------------------------------------------------
        // FIND CUSTOMER
        // --------------------------------------------------------

        Customer customer =
                customerRepository
                        .findById(request.getCustomerId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Customer not found with ID: "
                                                + request.getCustomerId()
                                )
                        );

        // --------------------------------------------------------
        // CUSTOMER MUST BE ACTIVE
        // --------------------------------------------------------

        if (!"ACTIVE".equals(customer.getStatus())) {

            throw new ResourceNotFoundException(
                    "Customer not found with ID: "
                            + request.getCustomerId()
            );
        }

        // --------------------------------------------------------
        // CREATE ORDER
        // --------------------------------------------------------

        Order order =
                OrderMapper.toEntity(
                        request,
                        customer
                );

        // --------------------------------------------------------
        // SAVE ORDER
        // --------------------------------------------------------

        Order savedOrder =
                orderRepository.save(order);

        // --------------------------------------------------------
        // CREATE ORDER ITEMS
        // --------------------------------------------------------

        if (request.getItems() != null) {

            for (OrderItemInOrderRequest itemRequest :
                    request.getItems()) {

                // ------------------------------------------------
                // FIND PRODUCT
                // ------------------------------------------------

                Product product =
                        productRepository
                                .findById(
                                        itemRequest.getProductId()
                                )
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "Product not found with ID: "
                                                        + itemRequest.getProductId()
                                        )
                                );

                // ------------------------------------------------
                // PRODUCT MUST BE ACTIVE
                // ------------------------------------------------

                if (!"ACTIVE".equals(product.getStatus())) {

                    throw new ResourceNotFoundException(
                            "Product not found with ID: "
                                    + itemRequest.getProductId()
                    );
                }

                // ------------------------------------------------
                // CREATE ORDER ITEM
                // ------------------------------------------------

                OrderItem orderItem =
                        new OrderItem();

                orderItem.setOrder(savedOrder);
                orderItem.setProduct(product);

                orderItem.setOrderedQuantity(
                        itemRequest.getOrderedQuantity()
                );

                orderItem.setUnitSellingPrice(
                        itemRequest.getUnitSellingPrice()
                );

                orderItem.setRemarks(
                        itemRequest.getRemarks()
                );

                // ------------------------------------------------
                // SAVE ORDER ITEM
                // ------------------------------------------------

                orderItemRepository.save(orderItem);
            }
        }

        // --------------------------------------------------------
        // AUTOMATIC FIRST DELIVERY
        // --------------------------------------------------------

        DeliveryCreateRequest deliveryRequest =
                new DeliveryCreateRequest();

        deliveryRequest.setOrderId(
                savedOrder.getOrderId()
        );

        deliveryRequest.setDeliveryDate(
                request.getExpectedDeliveryDate()
        );

        deliveryRequest.setTripNumber(1);

        deliveryRequest.setTotalTrips(1);

        deliveryRequest.setTransportMode(
                request.getTransportMode()
        );

        Delivery delivery =
                DeliveryMapper.toEntity(
                        deliveryRequest,
                        savedOrder
                );

        deliveryRepository.save(delivery);

        // --------------------------------------------------------
        // RESPONSE WITH BILL
        // --------------------------------------------------------

        return buildOrderBill(savedOrder);
    }

    // ============================================================
    // UPDATE ORDER
    // ============================================================

    public OrderResponse updateOrder(
            Integer id,
            OrderUpdateRequest request) {

        Order order =
                orderRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found with ID: " + id
                                )
                        );

        // --------------------------------------------------------
        // ONLY ACTIVE ORDERS CAN BE UPDATED
        // --------------------------------------------------------

        if (!"ACTIVE".equals(order.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Order not found with ID: " + id
            );
        }

        // --------------------------------------------------------
        // FIND CUSTOMER
        // --------------------------------------------------------

        Customer customer =
                customerRepository
                        .findById(request.getCustomerId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Customer not found with ID: "
                                                + request.getCustomerId()
                                )
                        );

        // --------------------------------------------------------
        // CUSTOMER MUST BE ACTIVE
        // --------------------------------------------------------

        if (!"ACTIVE".equals(customer.getStatus())) {

            throw new ResourceNotFoundException(
                    "Customer not found with ID: "
                            + request.getCustomerId()
            );
        }

        // --------------------------------------------------------
        // UPDATE ORDER
        // --------------------------------------------------------

        OrderMapper.updateEntity(
                order,
                request,
                customer
        );

        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        Order updatedOrder =
                orderRepository.save(order);

        // --------------------------------------------------------
        // RESPONSE WITH BILL
        // --------------------------------------------------------

        return buildOrderBill(updatedOrder);
    }

    // ============================================================
    // BUILD ORDER BILL
    // ============================================================
    //
    // Business presentation:
    //
    // Product
    // Size
    // Quantity
    // Rate
    // Amount = Quantity × Rate
    // Total = Sum of all active OrderItem amounts
    //
    // Payment:
    //
    // Paid Amount = Sum of active PaymentAllocation amounts
    // Balance = Total Amount - Paid Amount
    // Payment Status = PAID / PARTIAL / PENDING
    // ============================================================

    private OrderResponse buildOrderBill(Order order) {

        // --------------------------------------------------------
        // START WITH NORMAL ORDER RESPONSE
        // --------------------------------------------------------

        OrderResponse response =
                OrderMapper.toResponse(order);

        // --------------------------------------------------------
        // FIND ACTIVE ORDER ITEMS
        // --------------------------------------------------------

        List<OrderItem> orderItems =
                orderItemRepository
                        .findByOrderOrderIdAndRecordStatus(
                                order.getOrderId(),
                                "ACTIVE"
                        );

        // --------------------------------------------------------
        // BUILD BILL ITEMS
        // --------------------------------------------------------

        List<OrderBillItemResponse> billItems =
                new ArrayList<>();

        BigDecimal totalAmount =
                BigDecimal.ZERO;

        for (OrderItem orderItem : orderItems) {

            Product product =
                    orderItem.getProduct();

            // ----------------------------------------------------
            // CALCULATE LINE AMOUNT
            // ----------------------------------------------------

            BigDecimal amount =
                    orderItem
                            .getUnitSellingPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            orderItem.getOrderedQuantity()
                                    )
                            );

            // ----------------------------------------------------
            // CREATE BILL ITEM RESPONSE
            // ----------------------------------------------------

            OrderBillItemResponse billItem =
                    new OrderBillItemResponse();

            billItem.setProductId(
                    product.getProductId()
            );

            billItem.setProductName(
                    product.getProductName()
            );

            billItem.setProductSize(
                    product.getSize()
            );

            billItem.setOrderedQuantity(
                    orderItem.getOrderedQuantity()
            );

            billItem.setUnitSellingPrice(
                    orderItem.getUnitSellingPrice()
            );

            billItem.setAmount(amount);

            billItems.add(billItem);

            // ----------------------------------------------------
            // ADD TO TOTAL
            // ----------------------------------------------------

            totalAmount =
                    totalAmount.add(amount);
        }

        // --------------------------------------------------------
        // SET BILL DATA
        // --------------------------------------------------------

        response.setItems(billItems);

        response.setTotalAmount(totalAmount);

        // --------------------------------------------------------
        // FIND ACTIVE PAYMENT ALLOCATIONS
        // --------------------------------------------------------

        List<PaymentAllocation> allocations =
                paymentAllocationRepository
                        .findByOrderOrderIdAndRecordStatus(
                                order.getOrderId(),
                                "ACTIVE"
                        );

        // --------------------------------------------------------
        // CALCULATE PAID AMOUNT
        // --------------------------------------------------------

        BigDecimal paidAmount =
                allocations.stream()
                        .map(PaymentAllocation::getAllocatedAmount)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        // --------------------------------------------------------
        // CALCULATE BALANCE
        // --------------------------------------------------------

        BigDecimal billTotalAmount =
                response.getTotalAmount() != null
                        ? response.getTotalAmount()
                        : BigDecimal.ZERO;

        BigDecimal balance =
                billTotalAmount.subtract(paidAmount);

        // --------------------------------------------------------
        // CALCULATE PAYMENT STATUS
        // --------------------------------------------------------

        String paymentStatus;

        if (paidAmount.compareTo(billTotalAmount) >= 0) {

            paymentStatus = "PAID";

        } else if (
                paidAmount.compareTo(BigDecimal.ZERO) > 0) {

            paymentStatus = "PARTIAL";

        } else {

            paymentStatus = "PENDING";
        }

        // --------------------------------------------------------
        // SET PAYMENT DATA
        // --------------------------------------------------------

        response.setPaidAmount(paidAmount);
        response.setBalance(balance);
        response.setPaymentStatus(paymentStatus);

        // --------------------------------------------------------
        // RETURN COMPLETE ORDER BILL
        // --------------------------------------------------------

        return response;
    }

    // ============================================================
    // SOFT DELETE ORDER
    // ============================================================
    //
    // ACTIVE → INACTIVE
    //
    // Already INACTIVE:
    //     DuplicateResourceException → 409
    //
    // Unknown ID:
    //     ResourceNotFoundException → 404
    //
    // No physical DELETE occurs.
    // ============================================================

    public void deleteOrder(Integer id) {

        Order order =
                orderRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found with ID: " + id
                                )
                        );

        // --------------------------------------------------------
        // ALREADY INACTIVE
        // --------------------------------------------------------

        if ("INACTIVE".equals(
                order.getRecordStatus())) {

            throw new DuplicateResourceException(
                    "Order is already inactive with ID: " + id
            );
        }

        // --------------------------------------------------------
        // SOFT DELETE
        // --------------------------------------------------------

        order.setRecordStatus("INACTIVE");

        orderRepository.save(order);
    }
}
