package com.skcp.mapper;

import com.skcp.dto.request.paymentallocation.PaymentAllocationCreateRequest;
import com.skcp.dto.request.paymentallocation.PaymentAllocationUpdateRequest;
import com.skcp.dto.response.paymentallocation.PaymentAllocationResponse;
import com.skcp.dto.response.paymentallocation.PaymentAllocationSummaryResponse;
import com.skcp.entity.PaymentAllocation;

import org.springframework.stereotype.Component;

@Component
public class PaymentAllocationMapper {

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public PaymentAllocation toEntity(
            PaymentAllocationCreateRequest request) {

        PaymentAllocation allocation = new PaymentAllocation();

        allocation.setAllocatedAmount(request.getAllocatedAmount());
        allocation.setAllocationDate(request.getAllocationDate());
        allocation.setRemarks(request.getRemarks());

        return allocation;
    }


    // ============================================================
    // UPDATE REQUEST → ENTITY
    // ============================================================

    public void updateEntity(
            PaymentAllocationUpdateRequest request,
            PaymentAllocation allocation) {

        allocation.setAllocatedAmount(request.getAllocatedAmount());
        allocation.setAllocationDate(request.getAllocationDate());
        allocation.setRemarks(request.getRemarks());
    }


    // ============================================================
    // ENTITY → DETAILED RESPONSE
    // ============================================================

    public PaymentAllocationResponse toResponse(
            PaymentAllocation allocation) {

        PaymentAllocationResponse response =
                new PaymentAllocationResponse();

        response.setPaymentAllocationId(
                allocation.getPaymentAllocationId());

        if (allocation.getPayment() != null) {
            response.setPaymentId(
                    allocation.getPayment().getPaymentId());
        }

        if (allocation.getOrder() != null) {
            response.setOrderId(
                    allocation.getOrder().getOrderId());
        }

        response.setAllocatedAmount(
                allocation.getAllocatedAmount());

        response.setAllocationDate(
                allocation.getAllocationDate());

        response.setRemarks(
                allocation.getRemarks());

        response.setRecordStatus(
                allocation.getRecordStatus());

        response.setCreatedAt(
                allocation.getCreatedAt());

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE
    // ============================================================

    public PaymentAllocationSummaryResponse toSummaryResponse(
            PaymentAllocation allocation) {

        PaymentAllocationSummaryResponse response =
                new PaymentAllocationSummaryResponse();

        response.setPaymentAllocationId(
                allocation.getPaymentAllocationId());

        if (allocation.getPayment() != null) {
            response.setPaymentId(
                    allocation.getPayment().getPaymentId());
        }

        if (allocation.getOrder() != null) {
            response.setOrderId(
                    allocation.getOrder().getOrderId());
        }

        response.setAllocatedAmount(
                allocation.getAllocatedAmount());

        response.setAllocationDate(
                allocation.getAllocationDate());

        response.setRecordStatus(
                allocation.getRecordStatus());

        return response;
    }
}