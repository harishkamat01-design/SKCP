package com.skcp.service;

import com.skcp.dto.request.payment.PaymentCreateRequest;
import com.skcp.dto.request.payment.PaymentUpdateRequest;
import com.skcp.dto.response.payment.PaymentResponse;
import com.skcp.dto.response.payment.PaymentSummaryResponse;
import com.skcp.entity.Customer;
import com.skcp.entity.Payment;
import com.skcp.exception.DuplicateResourceException;
import com.skcp.exception.ResourceNotFoundException;
import com.skcp.mapper.PaymentMapper;
import com.skcp.repository.CustomerRepository;
import com.skcp.repository.PaymentRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final PaymentMapper paymentMapper;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public PaymentService(
            PaymentRepository paymentRepository,
            CustomerRepository customerRepository,
            PaymentMapper paymentMapper) {

        this.paymentRepository = paymentRepository;
        this.customerRepository = customerRepository;
        this.paymentMapper = paymentMapper;
    }


    // ============================================================
    // GET ALL ACTIVE PAYMENTS
    // ============================================================

    public List<PaymentSummaryResponse> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .filter(payment ->
                        "ACTIVE".equals(payment.getRecordStatus()))
                .map(paymentMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // GET ACTIVE PAYMENT BY ID
    // ============================================================

    public PaymentResponse getPaymentById(Integer id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with ID: " + id
                        )
                );


        /*
         * Only ACTIVE payments are visible
         * to normal business operations.
         */

        if (!"ACTIVE".equals(payment.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Payment not found with ID: " + id
            );
        }


        return paymentMapper.toResponse(payment);
    }


    // ============================================================
    // CREATE PAYMENT
    // ============================================================

    public PaymentResponse createPayment(
            PaymentCreateRequest request) {


        // --------------------------------------------------------
        // Find Customer
        // --------------------------------------------------------

        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with ID: "
                                        + request.getCustomerId()
                        )
                );


        // --------------------------------------------------------
        // Convert Request → Entity
        // --------------------------------------------------------

        Payment payment = paymentMapper.toEntity(
                request,
                customer
        );


        /*
         * New Payment:
         *
         * recordStatus → ACTIVE
         *
         * The database default is also ACTIVE.
         *
         * We explicitly set it here so the application
         * business rule is clear.
         */

        payment.setRecordStatus("ACTIVE");


        // --------------------------------------------------------
        // Save
        // --------------------------------------------------------

        Payment savedPayment =
                paymentRepository.save(payment);


        // --------------------------------------------------------
        // Entity → Response DTO
        // --------------------------------------------------------

        return paymentMapper.toResponse(savedPayment);
    }


    // ============================================================
    // UPDATE PAYMENT
    // ============================================================

    public PaymentResponse updatePayment(
            Integer id,
            PaymentUpdateRequest request) {


        // --------------------------------------------------------
        // Find Existing Payment
        // --------------------------------------------------------

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with ID: " + id
                        )
                );


        // --------------------------------------------------------
        // Only ACTIVE Payments Can Be Updated
        // --------------------------------------------------------

        if (!"ACTIVE".equals(payment.getRecordStatus())) {

            throw new ResourceNotFoundException(
                    "Payment not found with ID: " + id
            );
        }


        // --------------------------------------------------------
        // Find Customer
        // --------------------------------------------------------

        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with ID: "
                                        + request.getCustomerId()
                        )
                );


        // --------------------------------------------------------
        // Update Existing Entity
        // --------------------------------------------------------

        paymentMapper.updateEntity(
                payment,
                request,
                customer
        );


        // --------------------------------------------------------
        // Save Updated Payment
        // --------------------------------------------------------

        Payment updatedPayment =
                paymentRepository.save(payment);


        // --------------------------------------------------------
        // Entity → Response DTO
        // --------------------------------------------------------

        return paymentMapper.toResponse(updatedPayment);
    }


    // ============================================================
    // SOFT DELETE PAYMENT
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
    // No physical DELETE occurs.
    // ============================================================

    public void deletePayment(Integer id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with ID: " + id
                        )
                );


        // --------------------------------------------------------
        // Already Inactive
        // --------------------------------------------------------

        if ("INACTIVE".equals(payment.getRecordStatus())) {

            throw new DuplicateResourceException(
                    "Payment is already inactive with ID: " + id
            );
        }


        // --------------------------------------------------------
        // Soft Delete
        // --------------------------------------------------------

        payment.setRecordStatus("INACTIVE");


        paymentRepository.save(payment);
    }
}


/*
# PaymentService Responsibilities

The PaymentService is responsible for:

- Retrieving all ACTIVE payments
- Retrieving an ACTIVE payment by ID
- Creating payments
- Updating ACTIVE payments
- Soft deleting payments


# Architecture

Controller
    ↓
PaymentCreateRequest / PaymentUpdateRequest
    ↓
PaymentService
    ↓
PaymentMapper
    ↓
Payment Entity
    ↓
PaymentRepository
    ↓
PostgreSQL


# CREATE

PaymentCreateRequest
        ↓
CustomerRepository
        ↓
Customer
        ↓
PaymentMapper.toEntity()
        ↓
Payment
        ↓
recordStatus = ACTIVE
        ↓
PaymentRepository.save()
        ↓
PaymentMapper.toResponse()
        ↓
PaymentResponse


# READ ALL

PaymentRepository.findAll()
        ↓
Filter ACTIVE
        ↓
PaymentMapper.toSummaryResponse()
        ↓
List<PaymentSummaryResponse>


# READ BY ID

PaymentRepository.findById()
        ↓
Check recordStatus
        ↓
ACTIVE
        ↓
PaymentMapper.toResponse()
        ↓
PaymentResponse


# UPDATE

PaymentRepository.findById()
        ↓
Check ACTIVE
        ↓
CustomerRepository.findById()
        ↓
PaymentMapper.updateEntity()
        ↓
PaymentRepository.save()
        ↓
PaymentMapper.toResponse()


# DELETE

ACTIVE
   ↓
DELETE request
   ↓
recordStatus = INACTIVE
   ↓
PaymentRepository.save()
   ↓
Database row preserved


# Protected Fields

The following fields are NOT changed during update:

- paymentId
- createdAt
- recordStatus

These are system-controlled fields.


# Exception Architecture

Unknown Payment ID
        ↓
ResourceNotFoundException
        ↓
GlobalExceptionHandler
        ↓
HTTP 404


Already INACTIVE Payment
        ↓
DuplicateResourceException
        ↓
GlobalExceptionHandler
        ↓
HTTP 409


Unknown Customer ID
        ↓
ResourceNotFoundException
        ↓
GlobalExceptionHandler
        ↓
HTTP 404


# Important Design Decision

Physical deletion is intentionally NOT used.

The following is NOT used:

paymentRepository.deleteById(id);

Instead:

ACTIVE
   ↓
INACTIVE

The database record remains available for audit/history.


# Payment Allocation

Payment does not directly contain orderId.

Payment allocation will be handled separately.

Future relationship:

Customer
   │
   ├── Payment 1
   ├── Payment 2
   └── Payment 3
          │
          ▼
   Payment Allocation
          │
          ├── Order 1
          └── Order 2


# Outstanding Amount

Future calculation:

Outstanding Amount
=
Total Order Value
-
Allocated Payments

This logic belongs to the Payment Allocation /
Order payment business logic and is intentionally
NOT implemented in the basic Payment CRUD service.


# Order Payment Status

Future business logic:

PENDING
   ↓
PARTIAL
   ↓
PAID

This will be implemented when Payment Allocation
functionality is developed.
*/
