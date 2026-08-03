/******************************************************************
 Project      : SKCP
 Database     : PostgreSQL
 Version      : 1.0
 Module       : Module 3
 Author       : Harish Kamat
 Status       : Production Ready
******************************************************************/
-- Create Database
CREATE DATABASE skcp_db
WITH
ENCODING = 'UTF8'
TEMPLATE = template0;

-- Connect to the database
--\c skcp_db;  

/******************
 \c skcp_db;  
This works only inside psql (SQL Shell).
It does NOT work in
pgAdmin Query Tool
DBeaver
IntelliJ
Spring Boot
For GitHub schema files I recommend commenting it.
Example: -- Connect to skcp_db before executing the script.
*******************/


-- Create Schema
CREATE SCHEMA IF NOT EXISTS skcp;
SET search_path TO skcp;

-- Create Tables

-- ==========================================================
-- Table : customer
-- Domain: Master Data
-- Purpose: Stores customer master information
-- ==========================================================

CREATE TABLE customer 
(
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    alternate_mobile VARCHAR(15),
    address TEXT,
    village VARCHAR(100),
    city VARCHAR(100),
    pincode VARCHAR(10),
    gst_number VARCHAR(20),
    remarks TEXT,

    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Table : supplier
-- Domain: Master Data 
-- Purpose: Stores supplier master information
-- ==========================================================

CREATE TABLE supplier
(
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    address TEXT,
    gst_number VARCHAR(30),

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Table : product
-- Domain: Master Data / Sales
-- Purpose: Stores finished product master information
-- ==========================================================

CREATE TABLE product
(
    product_id SERIAL PRIMARY KEY,

    product_code VARCHAR(20)
        NOT NULL
        UNIQUE,

    product_name VARCHAR(100)
        NOT NULL,

    size VARCHAR(10)
        NOT NULL,

    length DECIMAL(5,2)
        NOT NULL,

    width DECIMAL(5,2)
        NOT NULL,

    height DECIMAL(5,2)
        NOT NULL,

    unit VARCHAR(20)
        NOT NULL
        DEFAULT 'INCH',

    description TEXT,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Table : raw_material
-- Domain: Master Data / Procurement
-- Purpose: Stores raw material master information
-- ==========================================================

CREATE TABLE raw_material
(
    raw_material_id SERIAL PRIMARY KEY,

    material_name VARCHAR(100) NOT NULL,

    material_category VARCHAR(50) NOT NULL,

    description TEXT,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Table : labour
-- Domain: Master Data / Production
-- Purpose: Stores labour master information
-- ==========================================================

CREATE TABLE labour
(
    labour_id SERIAL PRIMARY KEY,

    labour_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    address TEXT,

    joining_date DATE NOT NULL,

    skill_type VARCHAR(50) NOT NULL,

    daily_rate DECIMAL(10,2) NOT NULL
        CHECK (daily_rate >= 0),

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Table : asset
-- Domain: Master Data / Production
-- Purpose: Stores factory asset master information
-- ==========================================================

CREATE TABLE asset
(
    asset_id SERIAL PRIMARY KEY,

    asset_name VARCHAR(100) NOT NULL,

    asset_category VARCHAR(50) NOT NULL,

    manufacturer VARCHAR(100),

    model_number VARCHAR(100),

    serial_number VARCHAR(100),

    purchase_date DATE,

    installation_date DATE,

    location VARCHAR(100),

    status VARCHAR(20)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE')),

    last_maintenance_date DATE,

    next_maintenance_date DATE,

    notes TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Table : purchase
-- Domain: Procurement
-- Purpose: Stores purchase transactions from suppliers
-- ==========================================================

CREATE TABLE purchase
(
    purchase_id SERIAL PRIMARY KEY,

    supplier_id INT NOT NULL,

    purchase_date DATE NOT NULL,

    invoice_number VARCHAR(50),

    total_amount DECIMAL(12,2) NOT NULL,

    payment_status VARCHAR(10)
        NOT NULL
        DEFAULT 'PENDING'
        CHECK (payment_status IN ('PENDING','PARTIAL','PAID')),

    remarks TEXT,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE','CANCELLED')),

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_purchase_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES supplier(supplier_id)
);

-- ==========================================================
-- Table : purchase_item
-- Domain: Procurement
-- Purpose: Stores individual raw materials within a purchase
-- ==========================================================

CREATE TABLE purchase_item
(
    purchase_item_id SERIAL PRIMARY KEY,

    purchase_id INT NOT NULL,

    raw_material_id INT NOT NULL,

    quantity DECIMAL(10,2) NOT NULL,

    unit VARCHAR(30) NOT NULL,

    unit_price DECIMAL(12,2) NOT NULL,

    line_amount DECIMAL(12,2) NOT NULL,

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_purchase_item_purchase
        FOREIGN KEY (purchase_id)
        REFERENCES purchase(purchase_id),

    CONSTRAINT fk_purchase_item_raw_material
        FOREIGN KEY (raw_material_id)
        REFERENCES raw_material(raw_material_id)
);

-- ==========================================================
-- Table : production
-- Domain: Production
-- Purpose: Stores daily production batch information
-- ==========================================================

CREATE TABLE production
(
    production_id SERIAL PRIMARY KEY,

    production_date DATE NOT NULL,

    product_id INT NOT NULL,

    quantity_produced INT NOT NULL CHECK (quantity_produced > 0),

    morning_cement_bags DECIMAL(5,2)
        NOT NULL
        DEFAULT 0
        CHECK (morning_cement_bags >= 0),

    afternoon_cement_bags DECIMAL(5,2)
        NOT NULL
        DEFAULT 0
        CHECK (afternoon_cement_bags >= 0),

    total_cement_bags DECIMAL(5,2)
        GENERATED ALWAYS AS
        (morning_cement_bags + afternoon_cement_bags)
        STORED,

    notes TEXT,

    status VARCHAR(15)
        NOT NULL
        DEFAULT 'COMPLETED'
        CHECK (status IN ('COMPLETED','CANCELLED')),

    asset_id INT NOT NULL,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_production_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id),

    CONSTRAINT fk_production_asset
        FOREIGN KEY (asset_id)
        REFERENCES asset(asset_id)
);

-- ==========================================================
-- Table : attendance
-- Domain: Production
-- Purpose: Stores daily labour attendance records
-- ==========================================================

CREATE TABLE attendance
(
    attendance_id SERIAL PRIMARY KEY,

    labour_id INT NOT NULL,

    attendance_date DATE NOT NULL,

    attendance_status VARCHAR(10)
        NOT NULL
        CHECK (attendance_status IN ('PRESENT', 'ABSENT', 'HOLIDAY')),

    leave_reason VARCHAR(100),

    daily_rate DECIMAL(10,2) NOT NULL,

    daily_amount DECIMAL(10,2) NOT NULL,

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attendance_labour
        FOREIGN KEY (labour_id)
        REFERENCES labour(labour_id)
);

-- ==========================================================
-- Table : raw_material_stock
-- Domain: Inventory
-- Purpose: Stores current stock position of each raw material
-- ==========================================================

CREATE TABLE raw_material_stock
(
    raw_material_stock_id SERIAL PRIMARY KEY,

    raw_material_id INT
        NOT NULL
        UNIQUE
        REFERENCES raw_material(raw_material_id),

    current_quantity DECIMAL(10,2)
        NOT NULL
        DEFAULT 0,

    minimum_quantity DECIMAL(10,2),

    last_updated_date DATE
        NOT NULL
        DEFAULT CURRENT_DATE,

    status VARCHAR(20)
        NOT NULL
        DEFAULT 'NORMAL'
        CHECK (status IN ('NORMAL','LOW_STOCK','OUT_OF_STOCK')),

    notes TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Table : curing_stock
-- Domain: Inventory
-- Purpose: Stores current curing inventory batches
-- ==========================================================

CREATE TABLE curing_stock
(
    curing_stock_id SERIAL PRIMARY KEY,
production_id INT NOT NULL UNIQUE, 
    product_id INT NOT NULL,

    quantity INT NOT NULL
        CHECK (quantity >= 0),

    production_date DATE NOT NULL,

    expected_ready_date DATE NOT NULL,  
    /*  GENERATED ALWAYS AS
        (production_date + INTERVAL '3 days') */

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'CURING'
        CHECK (status IN ('CURING', 'READY', 'MOVED')),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_curing_product
    FOREIGN KEY (product_id)
    REFERENCES product(product_id),

    CONSTRAINT fk_curing_production
    FOREIGN KEY (production_id)
    REFERENCES production(production_id)
);

-- ==========================================================
-- Table : finished_goods_stock
-- Domain: Inventory
-- Purpose: Stores current saleable finished goods stock
-- ==========================================================

CREATE TABLE finished_goods_stock
(
    finished_goods_stock_id SERIAL PRIMARY KEY,

    product_id INT NOT NULL UNIQUE,

    current_quantity INT NOT NULL DEFAULT 0,

    minimum_quantity INT DEFAULT 0,

    last_updated_date DATE
        NOT NULL
        DEFAULT CURRENT_DATE,

    status VARCHAR(20)
        NOT NULL
        DEFAULT 'NORMAL'
        CHECK (status IN ('NORMAL', 'LOW_STOCK', 'OUT_OF_STOCK')),

    notes TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_finished_goods_stock_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);

-- ==========================================================
-- Table : orders
-- Domain: Sales
-- Purpose: Stores customer order header information
-- ==========================================================

CREATE TABLE orders
(
    order_id SERIAL PRIMARY KEY,

    customer_id INT NOT NULL,

    order_date DATE NOT NULL,

    expected_delivery_date DATE,

    order_status VARCHAR(15)
        NOT NULL
        DEFAULT 'PENDING'
        CHECK (order_status IN
        (
            'PENDING',
            'PARTIAL',
            'COMPLETED',
            'CANCELLED'
        )),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
);

-- ==========================================================
-- Table : order_item
-- Domain: Sales
-- Purpose: Stores products included in a customer order
-- ==========================================================

CREATE TABLE order_item
(
    order_item_id SERIAL PRIMARY KEY,

    order_id INT NOT NULL,

    product_id INT NOT NULL,

    ordered_quantity INT NOT NULL
        CHECK (ordered_quantity > 0),

    unit_selling_price DECIMAL(12,2) NOT NULL
        CHECK (unit_selling_price >= 0),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orderitem_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id),

    CONSTRAINT fk_orderitem_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);

-- ==========================================================
-- Table : delivery
-- Domain: Sales
-- Purpose: Stores customer delivery header information
-- ==========================================================

CREATE TABLE delivery
(
    delivery_id SERIAL PRIMARY KEY,

    order_id INT NOT NULL,

    delivery_date DATE NOT NULL,

    trip_number INT NOT NULL
        CHECK (trip_number > 0),

    total_trips INT NOT NULL
        CHECK (total_trips > 0),

    vehicle_type VARCHAR(50),

    vehicle_number VARCHAR(20),

    driver_name VARCHAR(100),

    transport_mode VARCHAR(20)
        NOT NULL
        CHECK
        (
            transport_mode IN
            (
                'CUSTOMER_ARRANGED',
                'FACTORY_ARRANGED',
                'THIRD_PARTY'
            )
        ),

    transport_cost DECIMAL(12,2)
        DEFAULT 0
        CHECK (transport_cost >= 0),

    delivery_status VARCHAR(20)
        NOT NULL
        DEFAULT 'PENDING'
        CHECK
        (
            delivery_status IN
            (
                'PENDING',
                'IN_TRANSIT',
                'DELIVERED'
            )
        ),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_delivery_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
);

-- ==========================================================
-- Table : delivery_item
-- Domain: Sales
-- Purpose: Stores products delivered in each delivery
-- ==========================================================

CREATE TABLE delivery_item
(
    delivery_item_id SERIAL PRIMARY KEY,

    delivery_id INT NOT NULL,

    product_id INT NOT NULL,

    delivered_quantity INT NOT NULL
        CHECK (delivered_quantity > 0),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_deliveryitem_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES delivery(delivery_id),

    CONSTRAINT fk_deliveryitem_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);

-- ==========================================================
-- Table : payment
-- Domain: Finance
-- Purpose: Stores customer payment transactions
-- ==========================================================

CREATE TABLE payment
(
    payment_id SERIAL PRIMARY KEY,

    customer_id INT NOT NULL,

    payment_date DATE NOT NULL,

    total_amount_received DECIMAL(12,2)
        NOT NULL
        CHECK (total_amount_received > 0),

    payment_mode VARCHAR(20)
        NOT NULL
        CHECK
        (
            payment_mode IN
            (
                'CASH',
                'UPI',
                'BANK_TRANSFER',
                'CHEQUE'
            )
        ),

    reference_number VARCHAR(100),

    received_by VARCHAR(100) NOT NULL,

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
);

-- ==========================================================
-- Table : payment_allocation
-- Domain: Finance
-- Purpose: Stores payment allocation against customer orders
-- ==========================================================

CREATE TABLE payment_allocation
(
    payment_allocation_id SERIAL PRIMARY KEY,

    payment_id INT NOT NULL,

    order_id INT NOT NULL,

    allocated_amount DECIMAL(12,2)
        NOT NULL
        CHECK (allocated_amount > 0),

    allocation_date DATE NOT NULL,

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_paymentallocation_payment
        FOREIGN KEY (payment_id)
        REFERENCES payment(payment_id),

    CONSTRAINT fk_paymentallocation_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
);







