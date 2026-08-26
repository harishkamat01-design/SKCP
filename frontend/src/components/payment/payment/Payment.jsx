import { useEffect, useMemo, useState } from "react";

function Payment() {
    const API_URL = "http://localhost:8080/api/payments";
    const ALLOCATION_API_URL =
        "http://localhost:8080/api/payment-allocations";

    // ============================================================
    // STATE
    // ============================================================

    const [paymentList, setPaymentList] = useState([]);
    const [allocationList, setAllocationList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchKeyword, setSearchKeyword] = useState("");

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedPaymentAllocations, setSelectedPaymentAllocations] =
        useState([]);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        customerId: "",
        paymentDate: "",
        totalAmountReceived: "",
        paymentMode: "CASH",
        referenceNumber: "",
        receivedBy: "",
        remarks: ""
    });

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // ============================================================
    // FETCH PAYMENTS + PAYMENT ALLOCATIONS
    // ============================================================

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const [paymentsResponse, allocationsResponse] =
                await Promise.all([
                    fetch(API_URL),
                    fetch(ALLOCATION_API_URL)
                ]);

            const paymentsResult = await paymentsResponse.json();
            const allocationsResult =
                await allocationsResponse.json();

            console.log(
                "Payments API response:",
                paymentsResult
            );

            console.log(
                "Payment Allocations API response:",
                allocationsResult
            );

            if (!paymentsResponse.ok) {
                throw new Error(
                    paymentsResult.message ||
                    `Failed to fetch payments (${paymentsResponse.status})`
                );
            }

            if (!allocationsResponse.ok) {
                throw new Error(
                    allocationsResult.message ||
                    `Failed to fetch payment allocations (${allocationsResponse.status})`
                );
            }

            setPaymentList(paymentsResult.data || []);
            setAllocationList(allocationsResult.data || []);
        } catch (err) {
            console.error(
                "Error fetching payments / allocations:",
                err
            );

            setError(
                err.message ||
                "Unable to load payments."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchPayments();
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredPayments = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();

        if (!keyword) {
            return paymentList;
        }

        return paymentList.filter((payment) => {
            return (
                String(payment.paymentId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(payment.customerId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(payment.paymentDate || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(payment.totalAmountReceived || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(payment.paymentMode || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(payment.receivedBy || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(payment.recordStatus || "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [paymentList, searchKeyword]);

    // ============================================================
    // GET ACTIVE ALLOCATIONS FOR PAYMENT
    // ============================================================

    const getAllocationsForPayment = (paymentId) => {
        return allocationList.filter(
            (allocation) =>
                Number(allocation.paymentId) === Number(paymentId) &&
                allocation.recordStatus === "ACTIVE"
        );
    };

    // ============================================================
    // CALCULATE TOTAL ALLOCATED
    // ============================================================

    const getTotalAllocatedAmount = (paymentId) => {
        const allocations =
            getAllocationsForPayment(paymentId);

        return allocations.reduce(
            (total, allocation) =>
                total + Number(allocation.allocatedAmount || 0),
            0
        );
    };

    // ============================================================
    // CALCULATE UNALLOCATED AMOUNT
    // ============================================================

    const getUnallocatedAmount = (payment) => {
        const receivedAmount =
            Number(payment.totalAmountReceived || 0);

        const allocatedAmount =
            getTotalAllocatedAmount(payment.paymentId);

        return receivedAmount - allocatedAmount;
    };

    // ============================================================
    // VIEW PAYMENT
    // ============================================================

    const handleView = async (id) => {
        try {
            setError("");

            const response =
                await fetch(`${API_URL}/${id}`);

            const result =
                await response.json();

            console.log(
                "Payment details:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch payment details (${response.status})`
                );
            }

            const payment = result.data;

            setSelectedPayment(payment);

            const allocations =
                getAllocationsForPayment(
                    payment.paymentId
                );

            setSelectedPaymentAllocations(
                allocations
            );

            setShowViewModal(true);
        } catch (err) {
            console.error(
                "Error fetching payment details:",
                err
            );

            setError(
                err.message ||
                "Unable to load payment details."
            );
        }
    };

    // ============================================================
    // OPEN CREATE FORM
    // ============================================================

    const handleAdd = () => {
        setEditingId(null);

        setFormData({
            customerId: "",
            paymentDate: "",
            totalAmountReceived: "",
            paymentMode: "CASH",
            referenceNumber: "",
            receivedBy: "",
            remarks: ""
        });

        setFormError("");
        setShowFormModal(true);
    };

    // ============================================================
    // OPEN EDIT FORM
    // ============================================================

    const handleEdit = async (id) => {
        try {
            setFormError("");
            setError("");

            const response =
                await fetch(`${API_URL}/${id}`);

            const result =
                await response.json();

            console.log(
                "Payment details for edit:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch payment details (${response.status})`
                );
            }

            const payment = result.data;

            setEditingId(id);

            setFormData({
                customerId:
                    payment.customerId ?? "",

                paymentDate:
                    payment.paymentDate ?? "",

                totalAmountReceived:
                    payment.totalAmountReceived ?? "",

                paymentMode:
                    payment.paymentMode ?? "CASH",

                referenceNumber:
                    payment.referenceNumber ?? "",

                receivedBy:
                    payment.receivedBy ?? "",

                remarks:
                    payment.remarks ?? ""
            });

            setShowFormModal(true);
        } catch (err) {
            console.error(
                "Error loading payment for edit:",
                err
            );

            setError(
                err.message ||
                "Unable to load the payment record for editing."
            );
        }
    };

    // ============================================================
    // FORM CHANGE
    // ============================================================

    const handleChange = (event) => {
        const { name, value } =
            event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ============================================================
    // CREATE / UPDATE
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");

        // --------------------------------------------------------
        // BASIC FRONTEND VALIDATION
        // --------------------------------------------------------

        if (!formData.customerId) {
            setFormError(
                "Customer ID is required."
            );
            return;
        }

        if (Number(formData.customerId) <= 0) {
            setFormError(
                "Customer ID must be greater than 0."
            );
            return;
        }

        if (!formData.paymentDate) {
            setFormError(
                "Payment date is required."
            );
            return;
        }

        if (!formData.totalAmountReceived) {
            setFormError(
                "Total amount received is required."
            );
            return;
        }

        if (
            Number(formData.totalAmountReceived) <= 0
        ) {
            setFormError(
                "Total amount received must be greater than 0."
            );
            return;
        }

        const validPaymentModes = [
            "CASH",
            "UPI",
            "BANK_TRANSFER",
            "CHEQUE"
        ];

        if (
            !validPaymentModes.includes(
                formData.paymentMode
            )
        ) {
            setFormError(
                "Invalid payment mode."
            );
            return;
        }

        if (!formData.receivedBy.trim()) {
            setFormError(
                "Received by is required."
            );
            return;
        }

        if (
            formData.receivedBy.trim().length > 100
        ) {
            setFormError(
                "Received by must not exceed 100 characters."
            );
            return;
        }

        if (
            formData.referenceNumber.trim().length > 100
        ) {
            setFormError(
                "Reference number must not exceed 100 characters."
            );
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const requestBody = {
            customerId:
                Number(formData.customerId),

            paymentDate:
                formData.paymentDate,

            totalAmountReceived:
                Number(formData.totalAmountReceived),

            paymentMode:
                formData.paymentMode,

            referenceNumber:
                formData.referenceNumber.trim() === ""
                    ? null
                    : formData.referenceNumber.trim(),

            receivedBy:
                formData.receivedBy.trim(),

            remarks:
                formData.remarks.trim() === ""
                    ? null
                    : formData.remarks.trim()
        };

        try {
            setSaving(true);

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(
                            requestBody
                        )
                }
            );

            const result =
                await response.json();

            console.log(
                "Save Payment response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Request failed (${response.status})`
                );
            }

            setShowFormModal(false);
            setEditingId(null);

            setFormData({
                customerId: "",
                paymentDate: "",
                totalAmountReceived: "",
                paymentMode: "CASH",
                referenceNumber: "",
                receivedBy: "",
                remarks: ""
            });

            await fetchPayments();
        } catch (err) {
            console.error(
                "Error saving payment:",
                err
            );

            setFormError(
                err.message ||
                "Unable to save payment."
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // DELETE / SOFT DELETE
    // ============================================================

    const handleDelete = async (id) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this payment?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "DELETE"
                    }
                );

            const result =
                await response.json();

            console.log(
                "Delete Payment response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Delete failed (${response.status})`
                );
            }

            await fetchPayments();
        } catch (err) {
            console.error(
                "Error deleting payment:",
                err
            );

            setError(
                err.message ||
                "Unable to delete payment."
            );
        }
    };

    // ============================================================
    // CLOSE VIEW MODAL
    // ============================================================

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedPayment(null);
        setSelectedPaymentAllocations([]);
    };

    // ============================================================
    // CLOSE FORM MODAL
    // ============================================================

    const closeFormModal = () => {
        if (saving) {
            return;
        }

        setShowFormModal(false);
        setEditingId(null);
        setFormError("");

        setFormData({
            customerId: "",
            paymentDate: "",
            totalAmountReceived: "",
            paymentMode: "CASH",
            referenceNumber: "",
            receivedBy: "",
            remarks: ""
        });
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="module-container">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="module-header">

                <h1>Payments</h1>

                <p>
                    Manage customer payments and payment records
                </p>

            </div>

            {/* ==================================================
                SEARCH + ADD
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>

                        <h2>Payments</h2>

                        <p>
                            Manage customer payment records
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="primary-button"
                    >
                        Add Payment
                    </button>

                </div>

                <div className="search-section">

                    <label>
                        Search Payments
                    </label>

                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(
                                event.target.value
                            )
                        }
                        placeholder="Search by payment ID, customer ID, mode..."
                    />

                </div>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* ==================================================
                PAYMENT LIST
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>

                        <h2>Payment List</h2>

                        <p>
                            {filteredPayments.length} payment(s)
                        </p>

                    </div>

                </div>

                {loading ? (

                    <p>
                        Loading payments...
                    </p>

                ) : filteredPayments.length === 0 ? (

                    <p>
                        No payments found.
                    </p>

                ) : (

                    <div className="table-container">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>CUSTOMER ID</th>

                                    <th>PAYMENT DATE</th>

                                    <th>AMOUNT</th>

                                    <th>PAYMENT MODE</th>

                                    <th>RECEIVED BY</th>

                                    <th>ALLOCATED</th>

                                    <th>UNALLOCATED</th>

                                    <th>STATUS</th>

                                    <th>ACTIONS</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredPayments.map(
                                    (payment) => {

                                        const totalAllocated =
                                            getTotalAllocatedAmount(
                                                payment.paymentId
                                            );

                                        const unallocatedAmount =
                                            getUnallocatedAmount(
                                                payment
                                            );

                                        return (

                                            <tr
                                                key={
                                                    payment.paymentId
                                                }
                                            >

                                                <td>
                                                    {
                                                        payment.paymentId
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.customerId
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.paymentDate
                                                    }
                                                </td>

                                                <td>
                                                    ₹{" "}
                                                    {Number(
                                                        payment.totalAmountReceived ||
                                                        0
                                                    ).toFixed(2)}
                                                </td>

                                                <td>
                                                    {
                                                        payment.paymentMode
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.receivedBy
                                                    }
                                                </td>

                                                <td>
                                                    ₹{" "}
                                                    {totalAllocated.toFixed(
                                                        2
                                                    )}
                                                </td>

                                                <td>
                                                    ₹{" "}
                                                    {unallocatedAmount.toFixed(
                                                        2
                                                    )}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            payment.recordStatus
                                                        }
                                                    </strong>
                                                </td>

                                                <td>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleView(
                                                                payment.paymentId
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    {" "}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                payment.paymentId
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    {" "}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                payment.paymentId
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* ==================================================
                VIEW PAYMENT MODAL
            ================================================== */}

            {showViewModal &&
                selectedPayment && (

                    <div className="modal-overlay">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h2>
                                    Payment Details
                                </h2>

                                <button
                                    type="button"
                                    onClick={closeViewModal}
                                >
                                    X
                                </button>

                            </div>

                            {/* ======================================
                                PAYMENT INFORMATION
                            ====================================== */}

                            <div className="details-grid">

                                <div>

                                    <strong>
                                        Payment ID
                                    </strong>

                                    <span>
                                        {
                                            selectedPayment.paymentId
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Customer ID
                                    </strong>

                                    <span>
                                        {
                                            selectedPayment.customerId
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Payment Date
                                    </strong>

                                    <span>
                                        {
                                            selectedPayment.paymentDate
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Total Amount Received
                                    </strong>

                                    <span>
                                        ₹{" "}
                                        {Number(
                                            selectedPayment.totalAmountReceived ||
                                            0
                                        ).toFixed(2)}
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Total Allocated
                                    </strong>

                                    <span>
                                        ₹{" "}
                                        {getTotalAllocatedAmount(
                                            selectedPayment.paymentId
                                        ).toFixed(2)}
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Unallocated Amount
                                    </strong>

                                    <span>
                                        ₹{" "}
                                        {getUnallocatedAmount(
                                            selectedPayment
                                        ).toFixed(2)}
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Payment Mode
                                    </strong>

                                    <span>
                                        {
                                            selectedPayment.paymentMode
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Reference Number
                                    </strong>

                                    <span>
                                        {
                                            selectedPayment.referenceNumber ||
                                            "-"
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Received By
                                    </strong>

                                    <span>
                                        {
                                            selectedPayment.receivedBy
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Record Status
                                    </strong>

                                    <span>
                                        {
                                            selectedPayment.recordStatus
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Created At
                                    </strong>

                                    <span>
                                        {
                                            selectedPayment.createdAt
                                                ? new Date(
                                                    selectedPayment.createdAt
                                                ).toLocaleString()
                                                : "-"
                                        }
                                    </span>

                                </div>

                                <div className="full-width">

                                    <strong>
                                        Remarks
                                    </strong>

                                    <span>
                                        {
                                            selectedPayment.remarks ||
                                            "-"
                                        }
                                    </span>

                                </div>

                            </div>

                            {/* ======================================
                                PAYMENT ALLOCATIONS
                            ====================================== */}

                            <div className="module-card">

                                <div className="section-header">

                                    <div>

                                        <h3>
                                            Payment Allocations
                                        </h3>

                                        <p>
                                            {
                                                selectedPaymentAllocations.length
                                            } active allocation(s)
                                        </p>

                                    </div>

                                </div>

                                {selectedPaymentAllocations.length ===
                                0 ? (

                                    <p>
                                        No active allocations found for
                                        this payment.
                                    </p>

                                ) : (

                                    <div className="table-container">

                                        <table className="data-table">

                                            <thead>

                                                <tr>

                                                    <th>
                                                        ALLOCATION ID
                                                    </th>

                                                    <th>
                                                        ORDER ID
                                                    </th>

                                                    <th>
                                                        ALLOCATION DATE
                                                    </th>

                                                    <th>
                                                        ALLOCATED AMOUNT
                                                    </th>

                                                    <th>
                                                        STATUS
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {selectedPaymentAllocations.map(
                                                    (allocation) => (

                                                        <tr
                                                            key={
                                                                allocation.paymentAllocationId
                                                            }
                                                        >

                                                            <td>
                                                                {
                                                                    allocation.paymentAllocationId
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    allocation.orderId
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    allocation.allocationDate
                                                                }
                                                            </td>

                                                            <td>
                                                                ₹{" "}
                                                                {Number(
                                                                    allocation.allocatedAmount ||
                                                                    0
                                                                ).toFixed(2)}
                                                            </td>

                                                            <td>
                                                                <strong>
                                                                    {
                                                                        allocation.recordStatus
                                                                    }
                                                                </strong>
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    onClick={closeViewModal}
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            {/* ==================================================
                CREATE / UPDATE MODAL
            ================================================== */}

            {showFormModal && (

                <div className="modal-overlay">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h2>

                                {editingId
                                    ? "Update Payment"
                                    : "Add Payment"}

                            </h2>

                            <button
                                type="button"
                                onClick={closeFormModal}
                                disabled={saving}
                            >
                                X
                            </button>

                        </div>

                        {formError && (
                            <div className="error-message">
                                {formError}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="form-grid"
                        >

                            {/* CUSTOMER ID */}

                            <div className="form-group">

                                <label>
                                    Customer ID *
                                </label>

                                <input
                                    type="number"
                                    name="customerId"
                                    value={
                                        formData.customerId
                                    }
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />

                            </div>

                            {/* PAYMENT DATE */}

                            <div className="form-group">

                                <label>
                                    Payment Date *
                                </label>

                                <input
                                    type="date"
                                    name="paymentDate"
                                    value={
                                        formData.paymentDate
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* TOTAL AMOUNT */}

                            <div className="form-group">

                                <label>
                                    Total Amount Received *
                                </label>

                                <input
                                    type="number"
                                    name="totalAmountReceived"
                                    value={
                                        formData.totalAmountReceived
                                    }
                                    onChange={handleChange}
                                    min="0.01"
                                    step="0.01"
                                    required
                                />

                            </div>

                            {/* PAYMENT MODE */}

                            <div className="form-group">

                                <label>
                                    Payment Mode *
                                </label>

                                <select
                                    name="paymentMode"
                                    value={
                                        formData.paymentMode
                                    }
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="CASH">
                                        CASH
                                    </option>

                                    <option value="UPI">
                                        UPI
                                    </option>

                                    <option value="BANK_TRANSFER">
                                        BANK TRANSFER
                                    </option>

                                    <option value="CHEQUE">
                                        CHEQUE
                                    </option>

                                </select>

                            </div>

                            {/* REFERENCE NUMBER */}

                            <div className="form-group">

                                <label>
                                    Reference Number
                                </label>

                                <input
                                    type="text"
                                    name="referenceNumber"
                                    value={
                                        formData.referenceNumber
                                    }
                                    onChange={handleChange}
                                    maxLength={100}
                                    placeholder="UPI / cheque / bank reference"
                                />

                            </div>

                            {/* RECEIVED BY */}

                            <div className="form-group">

                                <label>
                                    Received By *
                                </label>

                                <input
                                    type="text"
                                    name="receivedBy"
                                    value={
                                        formData.receivedBy
                                    }
                                    onChange={handleChange}
                                    maxLength={100}
                                    required
                                />

                            </div>

                            {/* RECORD STATUS */}

                            <div className="form-group">

                                <label>
                                    Record Status
                                </label>

                                <input
                                    type="text"
                                    value="ACTIVE"
                                    disabled
                                />

                                <small>
                                    New payments are automatically
                                    created with ACTIVE status
                                    by the backend.
                                </small>

                            </div>

                            {/* REMARKS */}

                            <div className="form-group full-width">

                                <label>
                                    Remarks
                                </label>

                                <textarea
                                    name="remarks"
                                    value={
                                        formData.remarks
                                    }
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter remarks..."
                                />

                            </div>

                            {/* FORM ACTIONS */}

                            <div className="form-actions">

                                <button
                                    type="button"
                                    onClick={closeFormModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="primary-button"
                                >

                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Payment"
                                            : "Create Payment"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Payment;
