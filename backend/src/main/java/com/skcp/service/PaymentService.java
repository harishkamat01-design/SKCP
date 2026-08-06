package com.skcp.service;

import com.skcp.entity.Payment;
import com.skcp.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    // Constructor Injection
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // ==========================
    // CREATE
    // ==========================
    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    // ==========================
    // READ ALL
    // ==========================
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // ==========================
    // READ BY ID
    // ==========================
    public Optional<Payment> getPaymentById(Integer paymentId) {
        return paymentRepository.findById(paymentId);
    }

    // ==========================
    // UPDATE
    // ==========================
    public Payment updatePayment(Integer paymentId,
                                 Payment updatedPayment) {

        return paymentRepository.findById(paymentId)
                .map(existingPayment -> {

                    existingPayment.setCustomer(updatedPayment.getCustomer());
                    existingPayment.setPaymentDate(updatedPayment.getPaymentDate());
                    existingPayment.setTotalAmountReceived(updatedPayment.getTotalAmountReceived());
                    existingPayment.setPaymentMode(updatedPayment.getPaymentMode());
                    existingPayment.setReferenceNumber(updatedPayment.getReferenceNumber());
                    existingPayment.setReceivedBy(updatedPayment.getReceivedBy());
                    existingPayment.setRemarks(updatedPayment.getRemarks());

                    return paymentRepository.save(existingPayment);

                })
                .orElseThrow(() ->
                        new RuntimeException("Payment not found with ID : " + paymentId));
    }

    // ==========================
    // DELETE
    // ==========================
    public void deletePayment(Integer paymentId) {
        paymentRepository.deleteById(paymentId);
    }
}

/*
# Responsibilities
Current responsibilities:
- Create Payment
- Retrieve all Payments
- Retrieve Payment by ID
- Update Payment
- Delete Payment

# Constructor Injection
private final PaymentRepository paymentRepository;
Advantages:
- Follows Dependency Injection principles.
- Makes dependencies immutable.
- Easier unit testing.
- Enterprise best practice.

# Update Strategy
 Instead of replacing the entity:
1. Fetch the existing Payment.
2. Update mutable fields.
3. Save the updated entity.

This preserves:
payment_id
created_at
Entity identity

# Business Logic (Current)
At present, the service performs CRUD only.
No financial validations are implemented yet.

# Outstanding Calculation
Automatically calculate:
Outstanding Amount=Total Order Value - Allocated Payments

# Order Status Update
Automatically update:
    PENDING

    ↓

    PARTIAL

    ↓

    PAID
    
*/