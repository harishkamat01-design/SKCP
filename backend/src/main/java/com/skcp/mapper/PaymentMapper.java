package com.skcp.mapper;

import com.skcp.dto.request.payment.PaymentCreateRequest;
import com.skcp.dto.request.payment.PaymentUpdateRequest;
import com.skcp.dto.response.payment.PaymentResponse;
import com.skcp.dto.response.payment.PaymentSummaryResponse;
import com.skcp.entity.Customer;
import com.skcp.entity.Payment;

import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public Payment toEntity(
            PaymentCreateRequest request,
            Customer customer) {

        Payment payment = new Payment();

        payment.setCustomer(customer);
        payment.setPaymentDate(request.getPaymentDate());
        payment.setTotalAmountReceived(
                request.getTotalAmountReceived()
        );
        payment.setPaymentMode(request.getPaymentMode());
        payment.setReferenceNumber(
                request.getReferenceNumber()
        );
        payment.setReceivedBy(request.getReceivedBy());
        payment.setRemarks(request.getRemarks());

        return payment;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public void updateEntity(
            Payment payment,
            PaymentUpdateRequest request,
            Customer customer) {

        payment.setCustomer(customer);
        payment.setPaymentDate(request.getPaymentDate());
        payment.setTotalAmountReceived(
                request.getTotalAmountReceived()
        );
        payment.setPaymentMode(request.getPaymentMode());
        payment.setReferenceNumber(
                request.getReferenceNumber()
        );
        payment.setReceivedBy(request.getReceivedBy());
        payment.setRemarks(request.getRemarks());

        /*
         * Intentionally NOT updating:
         *
         * paymentId
         * createdAt
         * recordStatus
         *
         * These fields are controlled by the system.
         */
    }


    // ============================================================
    // ENTITY → FULL RESPONSE
    // ============================================================

    public PaymentResponse toResponse(Payment payment) {

        PaymentResponse response = new PaymentResponse();

        response.setPaymentId(payment.getPaymentId());

        if (payment.getCustomer() != null) {
            response.setCustomerId(
                    payment.getCustomer().getCustomerId()
            );
        }

        response.setPaymentDate(
                payment.getPaymentDate()
        );

        response.setTotalAmountReceived(
                payment.getTotalAmountReceived()
        );

        response.setPaymentMode(
                payment.getPaymentMode()
        );

        response.setReferenceNumber(
                payment.getReferenceNumber()
        );

        response.setReceivedBy(
                payment.getReceivedBy()
        );

        response.setRemarks(
                payment.getRemarks()
        );

        response.setCreatedAt(
                payment.getCreatedAt()
        );

        response.setRecordStatus(
                payment.getRecordStatus()
        );

        return response;
    }


    // ============================================================
    // ENTITY → SUMMARY RESPONSE
    // ============================================================

    public PaymentSummaryResponse toSummaryResponse(
            Payment payment) {

        PaymentSummaryResponse response =
                new PaymentSummaryResponse();

        response.setPaymentId(
                payment.getPaymentId()
        );

        if (payment.getCustomer() != null) {
            response.setCustomerId(
                    payment.getCustomer().getCustomerId()
            );
        }

        response.setPaymentDate(
                payment.getPaymentDate()
        );

        response.setTotalAmountReceived(
                payment.getTotalAmountReceived()
        );

        response.setPaymentMode(
                payment.getPaymentMode()
        );

        response.setReceivedBy(
                payment.getReceivedBy()
        );

        response.setRecordStatus(
                payment.getRecordStatus()
        );

        return response;
    }
}