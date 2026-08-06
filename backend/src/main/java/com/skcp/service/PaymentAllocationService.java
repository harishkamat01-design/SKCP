package com.skcp.service;

import com.skcp.entity.PaymentAllocation;
import com.skcp.repository.PaymentAllocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentAllocationService {

    private final PaymentAllocationRepository paymentAllocationRepository;

    // Constructor Injection
    public PaymentAllocationService(PaymentAllocationRepository paymentAllocationRepository) {
        this.paymentAllocationRepository = paymentAllocationRepository;
    }

    // ==========================
    // CREATE
    // ==========================
    public PaymentAllocation savePaymentAllocation(PaymentAllocation paymentAllocation) {
        return paymentAllocationRepository.save(paymentAllocation);
    }

    // ==========================
    // READ ALL
    // ==========================
    public List<PaymentAllocation> getAllPaymentAllocations() {
        return paymentAllocationRepository.findAll();
    }

    // ==========================
    // READ BY ID
    // ==========================
    public Optional<PaymentAllocation> getPaymentAllocationById(Integer paymentAllocationId) {
        return paymentAllocationRepository.findById(paymentAllocationId);
    }

    // ==========================
    // UPDATE
    // ==========================
    public PaymentAllocation updatePaymentAllocation(
            Integer paymentAllocationId,
            PaymentAllocation updatedPaymentAllocation) {

        return paymentAllocationRepository.findById(paymentAllocationId)
                .map(existingAllocation -> {

                    existingAllocation.setPayment(updatedPaymentAllocation.getPayment());
                    existingAllocation.setOrder(updatedPaymentAllocation.getOrder());
                    existingAllocation.setAllocatedAmount(updatedPaymentAllocation.getAllocatedAmount());
                    existingAllocation.setAllocationDate(updatedPaymentAllocation.getAllocationDate());
                    existingAllocation.setRemarks(updatedPaymentAllocation.getRemarks());

                    return paymentAllocationRepository.save(existingAllocation);

                }).orElseThrow(() ->
                        new RuntimeException(
                                "Payment Allocation not found with ID : "
                                        + paymentAllocationId));
    }

    // ==========================
    // DELETE
    // ==========================
    public void deletePaymentAllocation(Integer paymentAllocationId) {
        paymentAllocationRepository.deleteById(paymentAllocationId);
    }

}