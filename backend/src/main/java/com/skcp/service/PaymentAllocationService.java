package com.skcp.service;

import com.skcp.dto.request.paymentallocation.PaymentAllocationCreateRequest;
import com.skcp.dto.request.paymentallocation.PaymentAllocationUpdateRequest;
import com.skcp.dto.response.paymentallocation.PaymentAllocationResponse;
import com.skcp.dto.response.paymentallocation.PaymentAllocationSummaryResponse;
import com.skcp.entity.Order;
import com.skcp.entity.Payment;
import com.skcp.entity.PaymentAllocation;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.PaymentAllocationMapper;
import com.skcp.repository.OrderRepository;
import com.skcp.repository.PaymentAllocationRepository;
import com.skcp.repository.PaymentRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentAllocationService {

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final PaymentAllocationRepository paymentAllocationRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentAllocationMapper paymentAllocationMapper;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public PaymentAllocationService(
            PaymentAllocationRepository paymentAllocationRepository,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            PaymentAllocationMapper paymentAllocationMapper) {

        this.paymentAllocationRepository = paymentAllocationRepository;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.paymentAllocationMapper = paymentAllocationMapper;
    }


    // ============================================================
    // CREATE PAYMENT ALLOCATION
    // ============================================================
    //
    // Business rules:
    //
    // 1. Payment must exist.
    // 2. Payment must be ACTIVE.
    // 3. Order must exist.
    // 4. Order must be ACTIVE.
    // 5. Payment and Order must belong to same Customer.
    // 6. Allocation amount must be greater than zero.
    // 7. Total ACTIVE allocations must not exceed
    //    Payment.totalAmountReceived.
    //
    // ============================================================

    public PaymentAllocationResponse createPaymentAllocation(
            PaymentAllocationCreateRequest request) {

        // --------------------------------------------------------
        // Convert Request DTO → Entity
        // --------------------------------------------------------

        PaymentAllocation paymentAllocation =
                paymentAllocationMapper.toEntity(request);


        // --------------------------------------------------------
        // Validate and Fetch Payment
        // --------------------------------------------------------

        Integer paymentId = request.getPaymentId();

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with ID: " + paymentId
                        )
                );


        // --------------------------------------------------------
        // Payment must be ACTIVE
        // --------------------------------------------------------

        if (!"ACTIVE".equals(payment.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Payment not found with ID: " + paymentId
            );
        }


        // --------------------------------------------------------
        // Validate and Fetch Order
        // --------------------------------------------------------

        Integer orderId = request.getOrderId();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + orderId
                        )
                );


        // --------------------------------------------------------
        // Order must be ACTIVE
        // --------------------------------------------------------

        if (!"ACTIVE".equals(order.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Order not found with ID: " + orderId
            );
        }


        // --------------------------------------------------------
        // Payment and Order must belong to same Customer
        // --------------------------------------------------------

        validateSameCustomer(payment, order);


        // --------------------------------------------------------
        // Validate Allocation Amount
        // --------------------------------------------------------

        validateAllocationAmount(
                paymentAllocation.getAllocatedAmount()
        );


        // --------------------------------------------------------
        // Calculate Already Allocated Amount
        // --------------------------------------------------------

        BigDecimal alreadyAllocated =
                getActiveAllocatedAmountForPayment(paymentId);


        // --------------------------------------------------------
        // Calculate Remaining Payment Amount
        // --------------------------------------------------------

        BigDecimal remainingPaymentAmount =
                payment.getTotalAmountReceived()
                        .subtract(alreadyAllocated);


        // --------------------------------------------------------
        // Allocation Cannot Exceed Remaining Payment
        // --------------------------------------------------------

        if (paymentAllocation.getAllocatedAmount()
                .compareTo(remainingPaymentAmount) > 0) {

            throw new IllegalArgumentException(
                    "Allocated amount exceeds remaining payment amount. "
                            + "Remaining amount available: "
                            + remainingPaymentAmount
            );
        }


        // --------------------------------------------------------
        // Set Managed Parent Entities
        // --------------------------------------------------------

        paymentAllocation.setPayment(payment);
        paymentAllocation.setOrder(order);


        // --------------------------------------------------------
        // New Allocation is ACTIVE
        // --------------------------------------------------------

        paymentAllocation.setRecordStatus("ACTIVE");


        // --------------------------------------------------------
        // Save
        // --------------------------------------------------------

        PaymentAllocation savedAllocation =
                paymentAllocationRepository.save(paymentAllocation);


        // --------------------------------------------------------
        // Entity → Response DTO
        // --------------------------------------------------------

        return paymentAllocationMapper.toResponse(savedAllocation);
    }


    // ============================================================
    // READ ALL ACTIVE PAYMENT ALLOCATIONS
    // ============================================================

    public List<PaymentAllocationSummaryResponse>
    getAllPaymentAllocations() {

        return paymentAllocationRepository.findAll()
                .stream()
                .filter(allocation ->
                        "ACTIVE".equals(
                                allocation.getRecordStatus()
                        )
                )
                .map(paymentAllocationMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // READ ACTIVE PAYMENT ALLOCATION BY ID
    // ============================================================

    public PaymentAllocationResponse getPaymentAllocationById(
            Integer paymentAllocationId) {

        PaymentAllocation allocation =
                paymentAllocationRepository
                        .findById(paymentAllocationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payment Allocation not found with ID: "
                                                + paymentAllocationId
                                )
                        );


        // --------------------------------------------------------
        // Only ACTIVE allocation is visible
        // --------------------------------------------------------

        if (!"ACTIVE".equals(
                allocation.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Payment Allocation not found with ID: "
                            + paymentAllocationId
            );
        }


        // --------------------------------------------------------
        // Entity → Response DTO
        // --------------------------------------------------------

        return paymentAllocationMapper.toResponse(allocation);
    }


    // ============================================================
    // UPDATE PAYMENT ALLOCATION
    // ============================================================
    //
    // Protected:
    // - paymentAllocationId
    // - createdAt
    // - recordStatus
    //
    // ============================================================

    public PaymentAllocationResponse updatePaymentAllocation(
            Integer paymentAllocationId,
            PaymentAllocationUpdateRequest request) {

        // --------------------------------------------------------
        // Find Existing Allocation
        // --------------------------------------------------------

        PaymentAllocation existingAllocation =
                paymentAllocationRepository
                        .findById(paymentAllocationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payment Allocation not found with ID: "
                                                + paymentAllocationId
                                )
                        );


        // --------------------------------------------------------
        // Only ACTIVE allocations can be updated
        // --------------------------------------------------------

        if (!"ACTIVE".equals(
                existingAllocation.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Payment Allocation not found with ID: "
                            + paymentAllocationId
            );
        }


        // --------------------------------------------------------
        // Fetch Payment
        // --------------------------------------------------------

        Integer paymentId = request.getPaymentId();

        Payment payment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payment not found with ID: "
                                                + paymentId
                                )
                        );


        // --------------------------------------------------------
        // Payment must be ACTIVE
        // --------------------------------------------------------

        if (!"ACTIVE".equals(payment.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Payment not found with ID: " + paymentId
            );
        }


        // --------------------------------------------------------
        // Fetch Order
        // --------------------------------------------------------

        Integer orderId = request.getOrderId();

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found with ID: "
                                                + orderId
                                )
                        );


        // --------------------------------------------------------
        // Order must be ACTIVE
        // --------------------------------------------------------

        if (!"ACTIVE".equals(order.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Order not found with ID: " + orderId
            );
        }


        // --------------------------------------------------------
        // Payment and Order must belong to same Customer
        // --------------------------------------------------------

        validateSameCustomer(payment, order);


        // --------------------------------------------------------
        // Validate Allocation Amount
        // --------------------------------------------------------

        validateAllocationAmount(
                request.getAllocatedAmount()
        );


        // --------------------------------------------------------
        // Calculate Other ACTIVE Allocations
        //
        // Exclude the allocation currently being updated.
        // --------------------------------------------------------

        BigDecimal otherAllocatedAmount =
                paymentAllocationRepository.findAll()
                        .stream()
                        .filter(allocation ->
                                allocation.getPayment() != null
                                && allocation.getPayment()
                                        .getPaymentId()
                                        .equals(paymentId)
                                && !allocation
                                        .getPaymentAllocationId()
                                        .equals(paymentAllocationId)
                                && "ACTIVE".equals(
                                        allocation.getRecordStatus()
                                )
                        )
                        .map(PaymentAllocation::getAllocatedAmount)
                        .filter(amount -> amount != null)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );


        // --------------------------------------------------------
        // Calculate Remaining Payment Amount
        // --------------------------------------------------------

        BigDecimal remainingPaymentAmount =
                payment.getTotalAmountReceived()
                        .subtract(otherAllocatedAmount);


        // --------------------------------------------------------
        // Updated Allocation Cannot Exceed Balance
        // --------------------------------------------------------

        if (request.getAllocatedAmount()
                .compareTo(remainingPaymentAmount) > 0) {

            throw new IllegalArgumentException(
                    "Allocated amount exceeds remaining payment amount. "
                            + "Remaining amount available: "
                            + remainingPaymentAmount
            );
        }


        // --------------------------------------------------------
        // Update Entity Using Mapper
        // --------------------------------------------------------

        paymentAllocationMapper.updateEntity(
                request,
                existingAllocation
        );


        // --------------------------------------------------------
        // Set Managed Parent Entities
        // --------------------------------------------------------

        existingAllocation.setPayment(payment);
        existingAllocation.setOrder(order);


        // --------------------------------------------------------
        // IMPORTANT:
        // recordStatus remains ACTIVE
        // createdAt remains unchanged
        // --------------------------------------------------------


        // --------------------------------------------------------
        // Save
        // --------------------------------------------------------

        PaymentAllocation updatedAllocation =
                paymentAllocationRepository.save(
                        existingAllocation
                );


        // --------------------------------------------------------
        // Entity → Response DTO
        // --------------------------------------------------------

        return paymentAllocationMapper.toResponse(
                updatedAllocation
        );
    }


    // ============================================================
    // SOFT DELETE PAYMENT ALLOCATION
    // ============================================================
    //
    // ACTIVE → INACTIVE
    //
    // Valid ACTIVE ID → 200
    // Already INACTIVE → 409
    // Unknown ID → 404
    //
    // No physical DELETE.
    //
    // ============================================================

    public void deletePaymentAllocation(
            Integer paymentAllocationId) {

        PaymentAllocation allocation =
                paymentAllocationRepository
                        .findById(paymentAllocationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payment Allocation not found with ID: "
                                                + paymentAllocationId
                                )
                        );


        // --------------------------------------------------------
        // Already INACTIVE
        // --------------------------------------------------------

        if ("INACTIVE".equals(
                allocation.getRecordStatus())) {

            throw new DuplicateResourceException(
                    "Payment Allocation already deleted with ID: "
                            + paymentAllocationId
            );
        }


        // --------------------------------------------------------
        // Soft Delete
        // --------------------------------------------------------

        allocation.setRecordStatus("INACTIVE");

        paymentAllocationRepository.save(allocation);
    }


    // ============================================================
    // PRIVATE HELPER
    // ============================================================
    //
    // Validate that Payment and Order belong to same Customer.
    //
    // ============================================================

    private void validateSameCustomer(
            Payment payment,
            Order order) {

        if (payment.getCustomer() == null
                || order.getCustomer() == null
                || payment.getCustomer().getCustomerId() == null
                || order.getCustomer().getCustomerId() == null
                || !payment.getCustomer()
                        .getCustomerId()
                        .equals(
                                order.getCustomer()
                                        .getCustomerId()
                        )) {

            throw new IllegalArgumentException(
                    "Payment and Order must belong to the same customer"
            );
        }
    }


    // ============================================================
    // PRIVATE HELPER
    // ============================================================
    //
    // Validate allocated amount.
    //
    // ============================================================

    private void validateAllocationAmount(
            BigDecimal allocatedAmount) {

        if (allocatedAmount == null
                || allocatedAmount.compareTo(
                        BigDecimal.ZERO
                ) <= 0) {

            throw new IllegalArgumentException(
                    "Allocated amount must be greater than 0"
            );
        }
    }


    // ============================================================
    // PRIVATE HELPER
    // ============================================================
    //
    // Calculate total ACTIVE allocations for a Payment.
    //
    // ============================================================

    private BigDecimal getActiveAllocatedAmountForPayment(
            Integer paymentId) {

        return paymentAllocationRepository.findAll()
                .stream()
                .filter(allocation ->
                        allocation.getPayment() != null
                        && allocation.getPayment()
                                .getPaymentId()
                                .equals(paymentId)
                        && "ACTIVE".equals(
                                allocation.getRecordStatus()
                        )
                )
                .map(PaymentAllocation::getAllocatedAmount)
                .filter(amount -> amount != null)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );
    }
}