# SKCP Daily Progress
Date: 03-August-2026

---

# Module

Module 4 – Spring Boot Backend Development

Current Phase:
Customer Module

Status:
In Progress

---

# Today's Goal

Build the first backend flow for the Customer Module.

The objective was to understand how a REST request travels through Spring Boot and connects to PostgreSQL.

---

# Completed Today

## Customer Module Structure

Created following packages

com.skcp
│
├── controller
│     └── CustomerController.java
│
├── service
│     └── CustomerService.java
│
├── repository
│     └── CustomerRepository.java
│
└── entity
      └── Customer.java

---

## Repository Layer

Created

CustomerRepository

using

JpaRepository<Customer, Integer>

Learned

Repository talks directly with Database.

No SQL queries are required for basic CRUD operations.

Methods like

findAll()

save()

findById()

deleteById()

are automatically provided by Spring Data JPA.

---

## Service Layer

Created

CustomerService

Purpose

Business Logic Layer

Controller never directly communicates with Database.

Controller

↓

Service

↓

Repository

---

## Controller Layer

Created

CustomerController

Configured REST endpoints

GET

/api/customers

GET

/api/customers/{id}

POST

/api/customers

PUT

/api/customers/{id}

DELETE

/api/customers/{id}

---

## Entity Layer

Started Customer Entity

Mapped Java class with PostgreSQL table

Using

@Entity

@Table

@Column

@Id

@GeneratedValue

Learned

Entity is simply the Java representation of a Database table.

---

# API Testing

Tested API using Postman

GET

http://localhost:8080/api/customers

Response

[]

Status

200 OK

Meaning

Spring Boot

✔

Controller

✔

Service

✔

Repository

✔

Hibernate

✔

PostgreSQL Connection

✔

Customer Table

✔

No customer data available yet

---

# Build Verification

Successfully executed

mvn clean

mvn compile

mvn package

mvn spring-boot:run

Verified

http://localhost:8080

http://localhost:8080/actuator/health

Result

{
  "status":"UP"
}

Backend is healthy.

---

# Biggest Learning Today

I finally understood how Spring Boot components communicate.

Request Flow

Postman

↓

Controller

↓

Service

↓

Repository

↓

Hibernate (JPA)

↓

PostgreSQL

↓

Database Response

↓

Back to Postman

This is the architecture used in enterprise applications.

---

# Challenges Faced

Repository initially used Integer.

Service methods used Long.

Resulted in

findById()

deleteById()

errors.

Fixed by making Repository and Service use the same datatype.

Important lesson

Primary Key datatype must remain consistent across

Entity

Repository

Service

Controller

Database

---

# Key Achievement

Successfully built and tested the first complete backend request pipeline.

Although customer table is empty, the complete backend architecture is operational.

This is the first real CRUD foundation of SKCP.

---

# Next Step

Customer Module

POST API

Insert first customer into PostgreSQL

Verify

Postman

↓

Database

↓

GET API returns customer list