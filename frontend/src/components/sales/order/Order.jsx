import { useEffect, useMemo, useState } from "react";

import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
} from "../../../services/api";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import {
    DetailGrid,
    DetailItem,
} from "../../ui/common/DetailGrid";

function Order() {

    // ============================================================
    // STATE
    // ============================================================

    const [orderList, setOrderList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchKeyword, setSearchKeyword] = useState("");


    // ============================================================
    // VIEW MODAL
    // ============================================================

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [viewLoading, setViewLoading] =
        useState(false);

    const [viewError, setViewError] =
        useState("");


    // ============================================================
    // ADD ORDER MODAL
    // ============================================================

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [addForm, setAddForm] = useState({
        customerId: "",
        orderDate: "",
        expectedDeliveryDate: "",
        remarks: "",
    });

    const [addLoading, setAddLoading] =
        useState(false);

    const [addError, setAddError] =
        useState("");


    // ============================================================
    // EDIT ORDER MODAL
    // ============================================================

    const [editingOrder, setEditingOrder] =
        useState(null);

    const [editForm, setEditForm] = useState({
        customerId: "",
        orderDate: "",
        expectedDeliveryDate: "",
        orderStatus: "PENDING",
        remarks: "",
    });

    const [editLoading, setEditLoading] =
        useState(false);

    const [editError, setEditError] =
        useState("");


    // ============================================================
    // DELETE MODAL
    // ============================================================

    const [deletingOrder, setDeletingOrder] =
        useState(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const [deleteError, setDeleteError] =
        useState("");


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchOrders();
    }, []);


    // ============================================================
    // FETCH ALL ORDERS
    // ============================================================

    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const result = await apiGet("/api/orders");

            console.log(
                "Orders API response:",
                result
            );

            setOrderList(result.data || []);

        } catch (err) {

            console.error(
                "Error fetching orders:",
                err
            );

            setError(
                err.message ||
                "Unable to load orders. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // SEARCH
    // ============================================================

    const filteredOrders = useMemo(() => {

        const keyword =
            searchKeyword.trim().toLowerCase();

        if (!keyword) {
            return orderList;
        }

        return orderList.filter((order) => {

            return (

                String(
                    order.orderId || ""
                )
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(
                    order.customerId || ""
                )
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(
                    order.orderDate || ""
                )
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(
                    order.expectedDeliveryDate || ""
                )
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(
                    order.orderStatus || ""
                )
                    .toLowerCase()
                    .includes(keyword)
            );
        });

    }, [orderList, searchKeyword]);


    // ============================================================
    // VIEW ORDER
    // ============================================================

    const handleView = async (order) => {

        setViewError("");
        setViewLoading(true);
        setSelectedOrder(null);

        try {

            const result = await apiGet(
                `/api/orders/${order.orderId}`
            );

            console.log(
                "Order details:",
                result
            );

            setSelectedOrder(result.data);

        } catch (err) {

            console.error(
                "Error fetching order details:",
                err
            );

            setViewError(
                err.message ||
                "Unable to load order details."
            );

        } finally {

            setViewLoading(false);
        }
    };


    const closeViewModal = () => {

        if (viewLoading) {
            return;
        }

        setSelectedOrder(null);
        setViewError("");
    };


    // ============================================================
    // ADD ORDER
    // ============================================================

    const openAddModal = () => {

        setAddError("");

        setAddForm({
            customerId: "",
            orderDate: "",
            expectedDeliveryDate: "",
            remarks: "",
        });

        setShowAddModal(true);
    };


    const closeAddModal = () => {

        if (addLoading) {
            return;
        }

        setShowAddModal(false);
        setAddError("");

        setAddForm({
            customerId: "",
            orderDate: "",
            expectedDeliveryDate: "",
            remarks: "",
        });
    };


    const handleAddChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setAddForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // ============================================================
    // CREATE ORDER
    // ============================================================

    const handleCreateOrder = async (event) => {

        event.preventDefault();

        setAddError("");


        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!addForm.customerId) {

            setAddError(
                "Please enter a customer ID."
            );

            return;
        }

        if (!addForm.orderDate) {

            setAddError(
                "Please enter an order date."
            );

            return;
        }

        if (
            addForm.expectedDeliveryDate &&
            addForm.expectedDeliveryDate <
                addForm.orderDate
        ) {

            setAddError(
                "Expected delivery date cannot be before order date."
            );

            return;
        }


        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const payload = {

            customerId:
                Number(addForm.customerId),

            orderDate:
                addForm.orderDate,

            expectedDeliveryDate:
                addForm.expectedDeliveryDate || null,

            remarks:
                addForm.remarks.trim() || null,
        };


        try {

            setAddLoading(true);

            console.log(
                "Creating order with payload:",
                payload
            );

            const result = await apiPost(
                "/api/orders",
                payload
            );

            console.log(
                "Order created:",
                result
            );

                        setShowAddModal(false);

            setAddForm({
                customerId: "",
                orderDate: "",
                expectedDeliveryDate: "",
                remarks: "",
            });

            await fetchOrders();

        } catch (err) {

            console.error(
                "Error creating order:",
                err
            );

            setAddError(
                err.message ||
                "Unable to create order."
            );

        } finally {

            setAddLoading(false);
        }
    };


    // ============================================================
    // EDIT ORDER
    // ============================================================

    const handleEdit = async (order) => {

        setEditError("");
        setEditLoading(false);

        try {

            const result = await apiGet(
                `/api/orders/${order.orderId}`
            );

            console.log(
                "Order edit details:",
                result
            );

            const orderData =
                result.data;

            setEditingOrder(
                orderData
            );

            setEditForm({

                customerId:
                    orderData.customerId ?? "",

                orderDate:
                    orderData.orderDate ?? "",

                expectedDeliveryDate:
                    orderData.expectedDeliveryDate ?? "",

                orderStatus:
                    orderData.orderStatus ||
                    "PENDING",

                remarks:
                    orderData.remarks || "",
            });

        } catch (err) {

            console.error(
                "Error loading order for edit:",
                err
            );

            setEditError(
                err.message ||
                "Unable to load the order record for editing."
            );

            setEditingOrder(order);
        }
    };


    const closeEditModal = () => {

        if (editLoading) {
            return;
        }

        setEditingOrder(null);
        setEditError("");

        setEditForm({
            customerId: "",
            orderDate: "",
            expectedDeliveryDate: "",
            orderStatus: "PENDING",
            remarks: "",
        });
    };


    const handleEditChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // ============================================================
    // UPDATE ORDER
    // ============================================================

    const handleUpdateOrder = async (event) => {

        event.preventDefault();

        if (!editingOrder) {
            return;
        }

        setEditError("");


        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!editForm.customerId) {

            setEditError(
                "Please enter a customer ID."
            );

            return;
        }

        if (!editForm.orderDate) {

            setEditError(
                "Please enter an order date."
            );

            return;
        }

        if (
            editForm.expectedDeliveryDate &&
            editForm.expectedDeliveryDate <
                editForm.orderDate
        ) {

            setEditError(
                "Expected delivery date cannot be before order date."
            );

            return;
        }

        if (
            ![
                "PENDING",
                "PARTIAL",
                "COMPLETED",
                "CANCELLED",
            ].includes(
                editForm.orderStatus
            )
        ) {

            setEditError(
                "Invalid order status."
            );

            return;
        }


        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const payload = {

            customerId:
                Number(editForm.customerId),

            orderDate:
                editForm.orderDate,

            expectedDeliveryDate:
                editForm.expectedDeliveryDate ||
                null,

            orderStatus:
                editForm.orderStatus,

            remarks:
                editForm.remarks.trim() ||
                null,
        };


        try {

            setEditLoading(true);

            console.log(
                "Updating order with payload:",
                payload
            );

            const result = await apiPut(
                `/api/orders/${editingOrder.orderId}`,
                payload
            );

            console.log(
                "Order updated:",
                result
            );

                        setEditingOrder(null);

            setEditForm({
                customerId: "",
                orderDate: "",
                expectedDeliveryDate: "",
                orderStatus: "PENDING",
                remarks: "",
            });

            await fetchOrders();

        } catch (err) {

            console.error(
                "Error updating order:",
                err
            );

            setEditError(
                err.message ||
                "Unable to update order."
            );

        } finally {

            setEditLoading(false);
        }
    };


    // ============================================================
    // DELETE ORDER
    // ============================================================

    const handleDelete = (order) => {

        setDeleteError("");
        setDeletingOrder(order);
    };


    const closeDeleteModal = () => {

        if (deleteLoading) {
            return;
        }

        setDeletingOrder(null);
        setDeleteError("");
    };


    const handleConfirmDelete = async () => {

        if (!deletingOrder) {
            return;
        }

        try {

            setDeleteLoading(true);
            setDeleteError("");

            console.log(
                "Deleting order ID:",
                deletingOrder.orderId
            );

            const result = await apiDelete(
                `/api/orders/${deletingOrder.orderId}`
            );

            console.log(
                "Delete Order response:",
                result
            );

                        console.log(
                "Order deleted:",
                result
            );

            setDeletingOrder(null);

            await fetchOrders();

        } catch (err) {

            console.error(
                "Error deleting order:",
                err
            );

            setDeleteError(
                err.message ||
                "Unable to delete order."
            );

        } finally {

            setDeleteLoading(false);
        }
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <div className="page">

                <section className="card">

                    <h2>
                        Orders
                    </h2>

                    <p>
                        Loading order records...
                    </p>

                </section>

            </div>
        );
    }


    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <>
            {/* ====================================================
                ORDER HEADER
            ==================================================== */}

            <section className="card">

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                    }}
                >

                    <div>

                        <h2>
                            Orders
                        </h2>

                        <p>
                            Manage customer orders
                            and order records.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            openAddModal
                        }
                    >
                        + Add Order
                    </button>

                </div>


                <div className="fld production-search">

                    <label htmlFor="order-search">
                        Search Orders
                    </label>

                    <input
                        id="order-search"
                        type="text"
                        placeholder="Search by order ID, customer ID, status..."
                        value={
                            searchKeyword
                        }
                        onChange={(
                            event
                        ) =>
                            setSearchKeyword(
                                event.target.value
                            )
                        }
                    />

                </div>

            </section>


            {/* ====================================================
                ORDER LIST
            ==================================================== */}

            <section className="card">

                <h2>
                    Order List
                </h2>

                <p>
                    {
                        filteredOrders.length
                    }{" "}
                    order(s)
                </p>


                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}


                {!error &&
                    filteredOrders.length ===
                        0 && (
                        <p>
                            No orders found.
                        </p>
                    )}


                {!error &&
                    filteredOrders.length >
                        0 && (

                        <div className="table-wrap">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            CUSTOMER ID
                                        </th>

                                        <th>
                                            ORDER DATE
                                        </th>

                                        <th>
                                            EXPECTED DELIVERY
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

                                    {filteredOrders.map(
                                        (
                                            order
                                        ) => (

                                            <tr
                                                key={
                                                    order.orderId
                                                }
                                            >

                                                <td>
                                                    {
                                                        order.orderId
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        order.customerId
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        order.orderDate
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        order.expectedDeliveryDate ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        order.orderStatus ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>

                                                    <div className="table-actions">

                                                        <button
                                                            type="button"
                                                            className="action-btn view-btn"
                                                            onClick={() =>
                                                                handleView(
                                                                    order
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="action-btn edit-btn"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    order
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="action-btn delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    order
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

            </section>


            {/* ====================================================
                VIEW ORDER MODAL
            ==================================================== */}

            <ViewModal
                isOpen={
                    !!selectedOrder ||
                    viewLoading ||
                    !!viewError
                }
                onClose={
                    closeViewModal
                }
                title="Order Details"
                subtitle="View order information"
                loading={
                    viewLoading
                }
                error={
                    viewError
                }
                size="lg"
                footer={
                    <button
                        type="button"
                        className="btn"
                        onClick={
                            closeViewModal
                        }
                        disabled={
                            viewLoading
                        }
                    >
                        Close
                    </button>
                }
            >

                {selectedOrder && (

                    <DetailGrid>

                        <DetailItem
                            label="Order ID"
                            value={
                                selectedOrder.orderId
                            }
                        />

                        <DetailItem
                            label="Customer ID"
                            value={
                                selectedOrder.customerId
                            }
                        />

                        <DetailItem
                            label="Order Date"
                            value={
                                selectedOrder.orderDate ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Expected Delivery Date"
                            value={
                                selectedOrder.expectedDeliveryDate ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Order Status"
                            value={
                                selectedOrder.orderStatus ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Created At"
                            value={
                                selectedOrder.createdAt
                                    ? new Date(
                                          selectedOrder.createdAt
                                      ).toLocaleString(
                                          "en-IN"
                                      )
                                    : "-"
                            }
                        />

                        <DetailItem
                            label="Remarks"
                            value={
                                selectedOrder.remarks ||
                                "-"
                            }
                            fullWidth
                        />

                    </DetailGrid>
                )}

            </ViewModal>


            {/* ====================================================
                ADD ORDER MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    showAddModal
                }
                onClose={
                    closeAddModal
                }
                title="Add Order"
                subtitle="Create a new customer order"
                onSubmit={
                    handleCreateOrder
                }
                submitLabel="Add Order"
                cancelLabel="Cancel"
                saving={
                    addLoading
                }
                error={
                    addError
                }
                size="lg"
            >

                <div className="edit-form-grid">

                    <div className="fld">

                        <label htmlFor="add-order-customer-id">
                            Customer ID
                        </label>

                        <input
                            id="add-order-customer-id"
                            type="number"
                            name="customerId"
                            min="1"
                            value={
                                addForm.customerId
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter customer ID"
                            required
                        />

                    </div>


                    <div className="fld">

                        <label htmlFor="add-order-date">
                            Order Date
                        </label>

                        <input
                            id="add-order-date"
                            type="date"
                            name="orderDate"
                            value={
                                addForm.orderDate
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        />

                    </div>


                    <div className="fld">

                        <label htmlFor="add-order-expected-delivery">
                            Expected Delivery Date
                        </label>

                        <input
                            id="add-order-expected-delivery"
                            type="date"
                            name="expectedDeliveryDate"
                            value={
                                addForm.expectedDeliveryDate
                            }
                            onChange={
                                handleAddChange
                            }
                            min={
                                addForm.orderDate ||
                                undefined
                            }
                        />

                    </div>


                    <div className="fld">

                        <label htmlFor="add-order-status">
                            Order Status
                        </label>

                        <input
                            id="add-order-status"
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


                    <div className="fld edit-full">

                        <label htmlFor="add-order-remarks">
                            Remarks
                        </label>

                        <textarea
                            id="add-order-remarks"
                            name="remarks"
                            rows="3"
                            maxLength="255"
                            value={
                                addForm.remarks
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter remarks"
                        />

                    </div>

                </div>

            </FormModal>


            {/* ====================================================
                EDIT ORDER MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    !!editingOrder
                }
                onClose={
                    closeEditModal
                }
                title="Edit Order"
                subtitle="Update order information"
                onSubmit={
                    handleUpdateOrder
                }
                submitLabel="Update Order"
                cancelLabel="Cancel"
                saving={
                    editLoading
                }
                error={
                    editError
                }
                size="lg"
            >

                {editingOrder && (

                    <div className="edit-form-grid">

                        <div className="fld">

                            <label htmlFor="edit-order-id">
                                Order ID
                            </label>

                            <input
                                id="edit-order-id"
                                type="text"
                                value={
                                    editingOrder.orderId
                                }
                                disabled
                            />

                        </div>


                        <div className="fld">

                            <label htmlFor="edit-order-customer-id">
                                Customer ID
                            </label>

                            <input
                                id="edit-order-customer-id"
                                type="number"
                                name="customerId"
                                min="1"
                                value={
                                    editForm.customerId
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />

                        </div>


                        <div className="fld">

                            <label htmlFor="edit-order-date">
                                Order Date
                            </label>

                            <input
                                id="edit-order-date"
                                type="date"
                                name="orderDate"
                                value={
                                    editForm.orderDate
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />

                        </div>


                        <div className="fld">

                            <label htmlFor="edit-order-expected-delivery">
                                Expected Delivery Date
                            </label>

                            <input
                                id="edit-order-expected-delivery"
                                type="date"
                                name="expectedDeliveryDate"
                                value={
                                    editForm.expectedDeliveryDate
                                }
                                onChange={
                                    handleEditChange
                                }
                                min={
                                    editForm.orderDate ||
                                    undefined
                                }
                            />

                        </div>


                        <div className="fld">

                            <label htmlFor="edit-order-status">
                                Order Status
                            </label>

                            <select
                                id="edit-order-status"
                                name="orderStatus"
                                value={
                                    editForm.orderStatus
                                }
                                onChange={
                                    handleEditChange
                                }
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


                        <div className="fld edit-full">

                            <label htmlFor="edit-order-remarks">
                                Remarks
                            </label>

                            <textarea
                                id="edit-order-remarks"
                                name="remarks"
                                rows="3"
                                maxLength="255"
                                value={
                                    editForm.remarks
                                }
                                onChange={
                                    handleEditChange
                                }
                                placeholder="Enter remarks"
                            />

                        </div>

                    </div>
                )}

            </FormModal>


            {/* ====================================================
                DELETE CONFIRMATION MODAL
            ==================================================== */}

            <DeleteConfirmModal
                isOpen={
                    !!deletingOrder
                }
                onClose={
                    closeDeleteModal
                }
                onConfirm={
                    handleConfirmDelete
                }
                title="Delete Order"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this order?"
                itemName={
                    deletingOrder
                        ? `Order ID: ${deletingOrder.orderId} — Customer ID: ${deletingOrder.customerId}`
                        : ""
                }
                confirming={
                    deleteLoading
                }
                error={
                    deleteError
                }
            />

        </>
    );
}

export default Order;