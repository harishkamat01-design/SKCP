import { useEffect, useMemo, useState } from "react";

function Order() {
    const API_URL = "http://localhost:8080/api/orders";

    // ============================================================
    // STATE
    // ============================================================

    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchKeyword, setSearchKeyword] = useState("");

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        customerId: "",
        orderDate: "",
        expectedDeliveryDate: "",
        orderStatus: "PENDING",
        remarks: ""
    });

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // ============================================================
    // FETCH ALL ORDERS
    // ============================================================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            const result = await response.json();

            console.log("Orders API response:", result);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch orders (${response.status})`
                );
            }

            setOrderList(result.data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);

            setError(
                err.message ||
                "Unable to load orders. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchOrders();
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredOrders = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();

        if (!keyword) {
            return orderList;
        }

        return orderList.filter((order) => {
            return (
                String(order.orderId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(order.customerId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(order.orderDate || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(order.expectedDeliveryDate || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(order.orderStatus || "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [orderList, searchKeyword]);

    // ============================================================
    // VIEW ORDER
    // ============================================================

    const handleView = async (id) => {
        try {
            setError("");

            const response = await fetch(`${API_URL}/${id}`);

            const result = await response.json();

            console.log("Order details:", result);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch order details (${response.status})`
                );
            }

            setSelectedOrder(result.data);
            setShowViewModal(true);
        } catch (err) {
            console.error("Error fetching order details:", err);

            setError(
                err.message ||
                "Unable to load order details."
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
            orderDate: "",
            expectedDeliveryDate: "",
            orderStatus: "PENDING",
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

            const response = await fetch(`${API_URL}/${id}`);

            const result = await response.json();

            console.log("Order details for edit:", result);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch order details (${response.status})`
                );
            }

            const order = result.data;

            setEditingId(id);

            setFormData({
                customerId: order.customerId ?? "",
                orderDate: order.orderDate ?? "",
                expectedDeliveryDate:
                    order.expectedDeliveryDate ?? "",
                orderStatus: order.orderStatus ?? "PENDING",
                remarks: order.remarks ?? ""
            });

            setShowFormModal(true);
        } catch (err) {
            console.error(
                "Error loading order for edit:",
                err
            );

            setError(
                err.message ||
                "Unable to load the order record for editing."
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

        if (!formData.customerId) {
            setFormError("Customer ID is required.");
            return;
        }

        if (!formData.orderDate) {
            setFormError("Order date is required.");
            return;
        }

        if (
            formData.expectedDeliveryDate &&
            formData.expectedDeliveryDate < formData.orderDate
        ) {
            setFormError(
                "Expected delivery date cannot be before order date."
            );
            return;
        }

        if (
            editingId &&
            ![
                "PENDING",
                "PARTIAL",
                "COMPLETED",
                "CANCELLED"
            ].includes(formData.orderStatus)
        ) {
            setFormError("Invalid order status.");
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------
        //
        // CREATE:
        // OrderCreateRequest does NOT contain orderStatus.
        //
        // UPDATE:
        // OrderUpdateRequest REQUIRES orderStatus.
        //
        // --------------------------------------------------------

        const requestBody = editingId
            ? {
                customerId: Number(formData.customerId),
                orderDate: formData.orderDate,
                expectedDeliveryDate:
                    formData.expectedDeliveryDate || null,
                orderStatus: formData.orderStatus,
                remarks:
                    formData.remarks.trim() === ""
                        ? null
                        : formData.remarks.trim()
            }
            : {
                customerId: Number(formData.customerId),
                orderDate: formData.orderDate,
                expectedDeliveryDate:
                    formData.expectedDeliveryDate || null,
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

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            console.log(
                "Save Order response:",
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
                orderDate: "",
                expectedDeliveryDate: "",
                orderStatus: "PENDING",
                remarks: ""
            });

            await fetchOrders();
        } catch (err) {
            console.error(
                "Error saving order:",
                err
            );

            setFormError(
                err.message ||
                "Unable to save order."
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // DELETE / SOFT DELETE
    // ============================================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this order?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            const result = await response.json();

            console.log(
                "Delete Order response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Delete failed (${response.status})`
                );
            }

            await fetchOrders();
        } catch (err) {
            console.error(
                "Error deleting order:",
                err
            );

            setError(
                err.message ||
                "Unable to delete order."
            );
        }
    };

    // ============================================================
    // CLOSE VIEW MODAL
    // ============================================================

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedOrder(null);
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
            orderDate: "",
            expectedDeliveryDate: "",
            orderStatus: "PENDING",
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

                <h1>Orders</h1>

                <p>
                    Manage customer orders and order records
                </p>

            </div>

            {/* ==================================================
                SEARCH + ADD
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>

                        <h2>Orders</h2>

                        <p>
                            Manage customer orders
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="primary-button"
                    >
                        Add Order
                    </button>

                </div>

                <div className="search-section">

                    <label>
                        Search Orders
                    </label>

                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(
                                event.target.value
                            )
                        }
                        placeholder="Search by order ID, customer ID, status..."
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
                ORDER LIST
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>

                        <h2>Order List</h2>

                        <p>
                            {filteredOrders.length} order(s)
                        </p>

                    </div>

                </div>

                {loading ? (
                    <p>
                        Loading orders...
                    </p>
                ) : filteredOrders.length === 0 ? (
                    <p>
                        No orders found.
                    </p>
                ) : (
                    <div className="table-container">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>CUSTOMER ID</th>

                                    <th>ORDER DATE</th>

                                    <th>EXPECTED DELIVERY</th>

                                    <th>STATUS</th>

                                    <th>ACTIONS</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredOrders.map((order) => (

                                    <tr
                                        key={order.orderId}
                                    >

                                        <td>
                                            {order.orderId}
                                        </td>

                                        <td>
                                            {order.customerId}
                                        </td>

                                        <td>
                                            {order.orderDate}
                                        </td>

                                        <td>
                                            {order.expectedDeliveryDate ||
                                                "-"}
                                        </td>

                                        <td>
                                            <strong>
                                                {order.orderStatus}
                                            </strong>
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleView(
                                                        order.orderId
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
                                                        order.orderId
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
                                                        order.orderId
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* ==================================================
                VIEW ORDER MODAL
            ================================================== */}

            {showViewModal && selectedOrder && (

                <div className="modal-overlay">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h2>
                                Order Details
                            </h2>

                            <button
                                type="button"
                                onClick={closeViewModal}
                            >
                                X
                            </button>

                        </div>

                        <div className="details-grid">

                            <div>

                                <strong>
                                    Order ID
                                </strong>

                                <span>
                                    {selectedOrder.orderId}
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Customer ID
                                </strong>

                                <span>
                                    {selectedOrder.customerId}
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Order Date
                                </strong>

                                <span>
                                    {selectedOrder.orderDate}
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Expected Delivery Date
                                </strong>

                                <span>
                                    {
                                        selectedOrder.expectedDeliveryDate ||
                                        "-"
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Order Status
                                </strong>

                                <span>
                                    {selectedOrder.orderStatus}
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Created At
                                </strong>

                                <span>
                                    {selectedOrder.createdAt
                                        ? new Date(
                                            selectedOrder.createdAt
                                        ).toLocaleString()
                                        : "-"}
                                </span>

                            </div>

                            <div className="full-width">

                                <strong>
                                    Remarks
                                </strong>

                                <span>
                                    {selectedOrder.remarks ||
                                        "-"}
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
                                    ? "Update Order"
                                    : "Add Order"}

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
                                CUSTOMER ID
                            ================================== */}

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

                            {/* ==================================
                                ORDER DATE
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Order Date *
                                </label>

                                <input
                                    type="date"
                                    name="orderDate"
                                    value={
                                        formData.orderDate
                                    }
                                    onChange={handleChange}
                                    required
                                />

                                <small>
                                    Leave unchanged during
                                    update unless required.
                                </small>

                            </div>

                            {/* ==================================
                                EXPECTED DELIVERY DATE
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Expected Delivery Date
                                </label>

                                <input
                                    type="date"
                                    name="expectedDeliveryDate"
                                    value={
                                        formData.expectedDeliveryDate
                                    }
                                    onChange={handleChange}
                                    min={
                                        formData.orderDate ||
                                        undefined
                                    }
                                />

                            </div>

                            {/* ==================================
                                ORDER STATUS
                            ================================== */}

                            {editingId && (

                                <div className="form-group">

                                    <label>
                                        Order Status *
                                    </label>

                                    <select
                                        name="orderStatus"
                                        value={
                                            formData.orderStatus
                                        }
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="PENDING">
                                            PENDING
                                        </option>

                                        <option value="PARTIAL">
                                            PARTIAL
                                        </option>

                                        <option value="COMPLETED">
                                            COMPLETED
                                        </option>

                                        <option value="CANCELLED">
                                            CANCELLED
                                        </option>

                                    </select>

                                </div>

                            )}

                            {/* ==================================
                                CREATE STATUS INFORMATION
                            ================================== */}

                            {!editingId && (

                                <div className="form-group">

                                    <label>
                                        Order Status
                                    </label>

                                    <input
                                        type="text"
                                        value="PENDING"
                                        disabled
                                    />

                                    <small>
                                        New orders are automatically
                                        created with PENDING status
                                        by the backend.
                                    </small>

                                </div>

                            )}

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
                                    maxLength={255}
                                    rows={4}
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
                                            ? "Update Order"
                                            : "Create Order"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Order;
