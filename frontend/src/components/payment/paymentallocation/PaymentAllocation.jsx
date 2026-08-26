import { useEffect, useMemo, useState } from "react";

function PaymentAllocation() {
    const API_URL =
        "http://localhost:8080/api/payment-allocations";

    // ============================================================
    // STATE
    // ============================================================

    const [allocationList, setAllocationList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchKeyword, setSearchKeyword] = useState("");

    const [selectedAllocation, setSelectedAllocation] =
        useState(null);

    const [showViewModal, setShowViewModal] =
        useState(false);

    const [showFormModal, setShowFormModal] =
        useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        paymentId: "",
        orderId: "",
        allocatedAmount: "",
        allocationDate: "",
        remarks: ""
    });

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // ============================================================
    // FETCH PAYMENT ALLOCATIONS
    // ============================================================

    const fetchAllocations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            const result = await response.json();

            console.log(
                "Payment Allocations API response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch payment allocations (${response.status})`
                );
            }

            setAllocationList(result.data || []);
        } catch (err) {
            console.error(
                "Error fetching payment allocations:",
                err
            );

            setError(
                err.message ||
                "Unable to load payment allocations."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchAllocations();
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredAllocations = useMemo(() => {
        const keyword =
            searchKeyword.trim().toLowerCase();

        if (!keyword) {
            return allocationList;
        }

        return allocationList.filter((allocation) => {
            return (
                String(
                    allocation.paymentAllocationId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    allocation.paymentId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    allocation.orderId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    allocation.allocatedAmount || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    allocation.allocationDate || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    allocation.recordStatus || ""
                )
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [allocationList, searchKeyword]);

    // ============================================================
    // OPEN CREATE FORM
    // ============================================================

    const handleAdd = () => {
        setEditingId(null);

        setFormData({
            paymentId: "",
            orderId: "",
            allocatedAmount: "",
            allocationDate: "",
            remarks: ""
        });

        setFormError("");
        setShowFormModal(true);
    };

    // ============================================================
    // VIEW ALLOCATION
    // ============================================================

    const handleView = async (id) => {
        try {
            setError("");

            const response =
                await fetch(`${API_URL}/${id}`);

            const result =
                await response.json();

            console.log(
                "Payment Allocation details:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch payment allocation details (${response.status})`
                );
            }

            setSelectedAllocation(result.data);
            setShowViewModal(true);
        } catch (err) {
            console.error(
                "Error fetching payment allocation details:",
                err
            );

            setError(
                err.message ||
                "Unable to load payment allocation details."
            );
        }
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
                "Payment Allocation details for edit:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch payment allocation details (${response.status})`
                );
            }

            const allocation = result.data;

            setEditingId(id);

            setFormData({
                paymentId:
                    allocation.paymentId ?? "",

                orderId:
                    allocation.orderId ?? "",

                allocatedAmount:
                    allocation.allocatedAmount ?? "",

                allocationDate:
                    allocation.allocationDate ?? "",

                remarks:
                    allocation.remarks ?? ""
            });

            setShowFormModal(true);
        } catch (err) {
            console.error(
                "Error loading payment allocation for edit:",
                err
            );

            setError(
                err.message ||
                "Unable to load the payment allocation for editing."
            );
        }
    };

    // ============================================================
    // FORM CHANGE
    // ============================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

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

        if (!formData.paymentId) {
            setFormError(
                "Payment ID is required."
            );
            return;
        }

        if (Number(formData.paymentId) <= 0) {
            setFormError(
                "Payment ID must be greater than 0."
            );
            return;
        }

        if (!formData.orderId) {
            setFormError(
                "Order ID is required."
            );
            return;
        }

        if (Number(formData.orderId) <= 0) {
            setFormError(
                "Order ID must be greater than 0."
            );
            return;
        }

        if (!formData.allocatedAmount) {
            setFormError(
                "Allocated amount is required."
            );
            return;
        }

        if (
            Number(formData.allocatedAmount) <= 0
        ) {
            setFormError(
                "Allocated amount must be greater than 0."
            );
            return;
        }

        if (!formData.allocationDate) {
            setFormError(
                "Allocation date is required."
            );
            return;
        }

        if (
            formData.remarks.trim().length > 500
        ) {
            setFormError(
                "Remarks must not exceed 500 characters."
            );
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const requestBody = {
            paymentId:
                Number(formData.paymentId),

            orderId:
                Number(formData.orderId),

            allocatedAmount:
                Number(formData.allocatedAmount),

            allocationDate:
                formData.allocationDate,

            remarks:
                formData.remarks.trim() === ""
                    ? null
                    : formData.remarks.trim()
        };

        console.log(
            "Payment Allocation request body:",
            requestBody
        );

        try {
            setSaving(true);

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId
                ? "PUT"
                : "POST";

            const response =
                await fetch(url, {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(
                            requestBody
                        )
                });

            const result =
                await response.json();

            console.log(
                "Save Payment Allocation response:",
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
                paymentId: "",
                orderId: "",
                allocatedAmount: "",
                allocationDate: "",
                remarks: ""
            });

            await fetchAllocations();
        } catch (err) {
            console.error(
                "Error saving payment allocation:",
                err
            );

            setFormError(
                err.message ||
                "Unable to save payment allocation."
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
                "Are you sure you want to delete this payment allocation?"
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
                "Delete Payment Allocation response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Delete failed (${response.status})`
                );
            }

            await fetchAllocations();
        } catch (err) {
            console.error(
                "Error deleting payment allocation:",
                err
            );

            setError(
                err.message ||
                "Unable to delete payment allocation."
            );
        }
    };

    // ============================================================
    // CLOSE VIEW MODAL
    // ============================================================

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedAllocation(null);
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
            paymentId: "",
            orderId: "",
            allocatedAmount: "",
            allocationDate: "",
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

                <h1>
                    Payment Allocations
                </h1>

                <p>
                    Manage payment allocations against customer orders
                </p>

            </div>

            {/* ==================================================
                SEARCH + ADD
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>

                        <h2>
                            Payment Allocations
                        </h2>

                        <p>
                            Allocate received payments to customer orders
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="primary-button"
                    >
                        Add Payment Allocation
                    </button>

                </div>

                <div className="search-section">

                    <label>
                        Search Payment Allocations
                    </label>

                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(
                                event.target.value
                            )
                        }
                        placeholder="Search by allocation ID, payment ID, order ID..."
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
                ALLOCATION LIST
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>

                        <h2>
                            Payment Allocation List
                        </h2>

                        <p>
                            {filteredAllocations.length} allocation(s)
                        </p>

                    </div>

                </div>

                {loading ? (

                    <p>
                        Loading payment allocations...
                    </p>

                ) : filteredAllocations.length === 0 ? (

                    <p>
                        No payment allocations found.
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
                                        PAYMENT ID
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

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredAllocations.map(
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
                                                    allocation.paymentId
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

                                            <td>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleView(
                                                            allocation.paymentAllocationId
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
                                                            allocation.paymentAllocationId
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
                                                            allocation.paymentAllocationId
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* ==================================================
                VIEW PAYMENT ALLOCATION MODAL
            ================================================== */}

            {showViewModal &&
                selectedAllocation && (

                    <div className="modal-overlay">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h2>
                                    Payment Allocation Details
                                </h2>

                                <button
                                    type="button"
                                    onClick={closeViewModal}
                                >
                                    X
                                </button>

                            </div>

                            {/* ======================================
                                ALLOCATION INFORMATION
                            ====================================== */}

                            <div className="details-grid">

                                <div>

                                    <strong>
                                        Payment Allocation ID
                                    </strong>

                                    <span>
                                        {
                                            selectedAllocation.paymentAllocationId
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Payment ID
                                    </strong>

                                    <span>
                                        {
                                            selectedAllocation.paymentId
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Order ID
                                    </strong>

                                    <span>
                                        {
                                            selectedAllocation.orderId
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Allocation Date
                                    </strong>

                                    <span>
                                        {
                                            selectedAllocation.allocationDate
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Allocated Amount
                                    </strong>

                                    <span>
                                        ₹{" "}
                                        {Number(
                                            selectedAllocation.allocatedAmount ||
                                            0
                                        ).toFixed(2)}
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Record Status
                                    </strong>

                                    <span>
                                        {
                                            selectedAllocation.recordStatus
                                        }
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Created At
                                    </strong>

                                    <span>
                                        {
                                            selectedAllocation.createdAt
                                                ? new Date(
                                                    selectedAllocation.createdAt
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
                                            selectedAllocation.remarks ||
                                            "-"
                                        }
                                    </span>

                                </div>

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
                                    ? "Update Payment Allocation"
                                    : "Add Payment Allocation"}

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

                            {/* ==================================
                                PAYMENT ID
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Payment ID *
                                </label>

                                <input
                                    type="number"
                                    name="paymentId"
                                    value={
                                        formData.paymentId
                                    }
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />

                            </div>

                            {/* ==================================
                                ORDER ID
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Order ID *
                                </label>

                                <input
                                    type="number"
                                    name="orderId"
                                    value={
                                        formData.orderId
                                    }
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />

                            </div>

                            {/* ==================================
                                ALLOCATED AMOUNT
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Allocated Amount *
                                </label>

                                <input
                                    type="number"
                                    name="allocatedAmount"
                                    value={
                                        formData.allocatedAmount
                                    }
                                    onChange={handleChange}
                                    min="0.01"
                                    step="0.01"
                                    required
                                />

                            </div>

                            {/* ==================================
                                ALLOCATION DATE
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Allocation Date *
                                </label>

                                <input
                                    type="date"
                                    name="allocationDate"
                                    value={
                                        formData.allocationDate
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* ==================================
                                RECORD STATUS
                            ================================== */}

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
                                    New payment allocations are automatically
                                    created with ACTIVE status by the backend.
                                </small>

                            </div>

                            {/* ==================================
                                REMARKS
                            ================================== */}

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
                                    maxLength={500}
                                    placeholder="Enter remarks..."
                                />

                            </div>

                            {/* ==================================
                                FORM ACTIONS
                            ================================== */}

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
                                            ? "Update Allocation"
                                            : "Create Allocation"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default PaymentAllocation;
