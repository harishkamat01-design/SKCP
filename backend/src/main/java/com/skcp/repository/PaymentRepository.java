
package com.skcp.repository;

import com.skcp.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    // ============================================================
    // FIND ALL PAYMENTS BY RECORD STATUS
    // ============================================================

    List<Payment> findByRecordStatus(String recordStatus);


    // ============================================================
    // FIND PAYMENT BY ID AND RECORD STATUS
    // ============================================================

    Optional<Payment> findByPaymentIdAndRecordStatus(
            Integer paymentId,
            String recordStatus
    );
}


/*
# Purpose

The PaymentRepository is responsible for database access
for the Payment entity.

It acts as the Data Access Layer (DAL).

# Standard Spring Data JPA Operations

By extending:

    JpaRepository<Payment, Integer>

Spring Data JPA provides:

    save()
    findAll()
    findById()
    deleteById()
    existsById()
    count()
    flush()
    saveAll()

# Custom Methods

## 1. Find Payments by Record Status

List<Payment> findByRecordStatus(String recordStatus);

Used by the Service layer to retrieve ACTIVE payments.

Example:

    findByRecordStatus("ACTIVE")

This is the repository method required for:

    GET /api/payments


## 2. Find Payment by ID and Record Status

Optional<Payment> findByPaymentIdAndRecordStatus(
        Integer paymentId,
        String recordStatus
);

Used by the Service layer to retrieve an ACTIVE payment
by ID.

Example:

    findByPaymentIdAndRecordStatus(
        paymentId,
        "ACTIVE"
    )

This supports:

    GET /api/payments/{id}


# Soft Delete Architecture

Payment records are never physically deleted.

Lifecycle:

    ACTIVE
       |
       | DELETE
       ↓
    INACTIVE

The Service layer controls this business behavior.

The Repository only performs the required data access.


# Architecture

PaymentController
        ↓
PaymentService
        ↓
PaymentRepository
        ↓
PostgreSQL
        ↓
payment


# Important

Business logic must remain in the Service layer.

The Repository should not contain business rules.
*/
