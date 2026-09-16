import { useEffect, useState } from "react";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import {
    DetailGrid,
    DetailItem,
} from "../../ui/common/DetailGrid";

import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
} from "../../../services/api";



function PaymentAllocation() {
    // ============================================================
    // STATE
    // ============================================================

    const [searchKeyword, setSearchKeyword] = useState("");
    const [allocations, setAllocations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================================
    // VIEW MODAL
    // ============================================================

    const [selectedAllocation, setSelectedAllocation] =
        useState(null);

    // ============================================================
    // EDIT MODAL
    // ============================================================

    const [editingAllocation, setEditingAllocation] =
        useState(null);

    const [editForm, setEditForm] = useState({
        paymentId: "",
        orderId: "",
        allocatedAmount: "",
        allocationDate: "",
        remarks: "",
    });

    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");

    // ============================================================
    // ADD PAYMENT ALLOCATION MODAL
    // ============================================================

    const [showAddModal, setShowAddModal] = useState(false);

    const [addForm, setAddForm] = useState({
        paymentId: "",
        orderId: "",
        allocatedAmount: "",
        allocationDate: "",
        remarks: "",
    });

    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");

    // ============================================================
    // DELETE MODAL
    // ============================================================

    const [deletingAllocation, setDeletingAllocation] =
        useState(null);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchAllocations();
    }, []);

    // ============================================================
    // FETCH PAYMENT ALLOCATIONS
    // ============================================================

        const fetchAllocations = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet(
                "/api/payment-allocations"
            );

            console.log(
                "Payment Allocation API response:",
                result
            );

            setAllocations(result.data || []);
        } catch (err) {
            console.error(
                "Error fetching payment allocations:",
                err
            );

            setError(
                err.message ||
                    "Unable to load payment allocation records. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredAllocations = allocations.filter(
        (allocation) => {
            const keyword =
                searchKeyword.toLowerCase().trim();

            if (!keyword) {
                return true;
            }

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
        }
    );

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(
            `${dateValue}T00:00:00`
        );

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ============================================================
    // FORMAT CURRENCY
    // ============================================================

    const formatCurrency = (amount) => {
        if (
            amount === null ||
            amount === undefined ||
            amount === ""
        ) {
            return "₹ 0.00";
        }

        return `₹ ${Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    // ============================================================
    // VIEW PAYMENT ALLOCATION
    // ============================================================

    const handleView = (allocation) => {
        setSelectedAllocation(allocation);
    };

    const closeViewModal = () => {
        setSelectedAllocation(null);
    };

    // ============================================================
    // ADD PAYMENT ALLOCATION
    // ============================================================

    const openAddModal = () => {
        setAddError("");

        setAddForm({
            paymentId: "",
            orderId: "",
            allocatedAmount: "",
            allocationDate: "",
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
    };

    const handleAddChange = (event) => {
        const { name, value } = event.target;

        setAddForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreateAllocation = async (event) => {
        event.preventDefault();

        if (
            !addForm.paymentId ||
            Number(addForm.paymentId) <= 0
        ) {
            setAddError(
                "Please enter a valid payment ID."
            );
            return;
        }

        if (
            !addForm.orderId ||
            Number(addForm.orderId) <= 0
        ) {
            setAddError(
                "Please enter a valid order ID."
            );
            return;
        }

        if (
            !addForm.allocatedAmount ||
            Number(addForm.allocatedAmount) <= 0
        ) {
            setAddError(
                "Please enter a valid allocated amount."
            );
            return;
        }

        if (!addForm.allocationDate) {
            setAddError(
                "Please select an allocation date."
            );
            return;
        }

        if (
            addForm.remarks &&
            addForm.remarks.trim().length > 500
        ) {
            setAddError(
                "Remarks cannot exceed 500 characters."
            );
            return;
        }

        try {
            setAddLoading(true);
            setAddError("");

            const payload = {
                paymentId:
                    Number(addForm.paymentId),

                orderId:
                    Number(addForm.orderId),

                allocatedAmount:
                    Number(
                        addForm.allocatedAmount
                    ),

                allocationDate:
                    addForm.allocationDate,

                remarks:
                    addForm.remarks.trim() ||
                    null,
            };

            console.log(
                "Creating payment allocation with payload:",
                payload
            );

            const result = await apiPost(
                "/api/payment-allocations",
                payload
            );
            console.log(
                "Payment allocation created:",
                result
            );

            setShowAddModal(false);

            setAddForm({
                paymentId: "",
                orderId: "",
                allocatedAmount: "",
                allocationDate: "",
                remarks: "",
            });

            await fetchAllocations();
        } catch (err) {
            console.error(
                "Error creating payment allocation:",
                err
            );

            setAddError(
                err.message ||
                    "Unable to create payment allocation record."
            );
        } finally {
            setAddLoading(false);
        }
    };

    // ============================================================
    // EDIT PAYMENT ALLOCATION
    // ============================================================

    const handleEdit = (allocation) => {
        setEditError("");

        setEditingAllocation(allocation);

        setEditForm({
            paymentId:
                allocation.paymentId ?? "",

            orderId:
                allocation.orderId ?? "",

            allocatedAmount:
                allocation.allocatedAmount ?? "",

            allocationDate:
                allocation.allocationDate || "",

            remarks:
                allocation.remarks || "",
        });
    };

    const closeEditModal = () => {
        if (editLoading) {
            return;
        }

        setEditingAllocation(null);
        setEditError("");
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ============================================================
    // UPDATE PAYMENT ALLOCATION
    // ============================================================

    const handleUpdateAllocation = async (
        event
    ) => {
        event.preventDefault();

        if (!editingAllocation) {
            return;
        }

        if (
            !editForm.paymentId ||
            Number(editForm.paymentId) <= 0
        ) {
            setEditError(
                "Please enter a valid payment ID."
            );
            return;
        }

        if (
            !editForm.orderId ||
            Number(editForm.orderId) <= 0
        ) {
            setEditError(
                "Please enter a valid order ID."
            );
            return;
        }

        if (
            !editForm.allocatedAmount ||
            Number(editForm.allocatedAmount) <= 0
        ) {
            setEditError(
                "Please enter a valid allocated amount."
            );
            return;
        }

        if (!editForm.allocationDate) {
            setEditError(
                "Please select an allocation date."
            );
            return;
        }

        if (
            editForm.remarks &&
            editForm.remarks.trim().length > 500
        ) {
            setEditError(
                "Remarks cannot exceed 500 characters."
            );
            return;
        }

        try {
            setEditLoading(true);
            setEditError("");

            const payload = {
                paymentId:
                    Number(editForm.paymentId),

                orderId:
                    Number(editForm.orderId),

                allocatedAmount:
                    Number(
                        editForm.allocatedAmount
                    ),

                allocationDate:
                    editForm.allocationDate,

                remarks:
                    editForm.remarks.trim() ||
                    null,
            };

            console.log(
                "Updating payment allocation with payload:",
                payload
            );

            const result = await apiPut(
                `/api/payment-allocations/${editingAllocation.paymentAllocationId}`,
                payload
            );

            console.log(
                "Payment allocation updated:",
                result
            );

            setEditingAllocation(null);

            await fetchAllocations();
        } catch (err) {
            console.error(
                "Error updating payment allocation:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to update payment allocation record."
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ============================================================
    // DELETE PAYMENT ALLOCATION
    // ============================================================

    const handleDelete = (allocation) => {
        setDeleteError("");
        setDeletingAllocation(allocation);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) {
            return;
        }

        setDeletingAllocation(null);
        setDeleteError("");
    };

    const handleConfirmDelete = async () => {
        if (!deletingAllocation) {
            return;
        }

        try {
            setDeleteLoading(true);
            setDeleteError("");

            console.log(
                "Deleting payment allocation ID:",
                deletingAllocation.paymentAllocationId
            );

        const result = await apiDelete(
            `/api/payment-allocations/${deletingAllocation.paymentAllocationId}`
        );

            console.log(
                "Payment allocation deleted:",
                result
            );

            setDeletingAllocation(null);

            await fetchAllocations();
        } catch (err) {
            console.error(
                "Error deleting payment allocation:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete payment allocation record."
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
                    <h2>Payment Allocations</h2>
                    <p>
                        Loading payment allocation records...
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
                PAYMENT ALLOCATION HEADER
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
                            Payment Allocations
                        </h2>

                        <p>
                            Manage payment allocations
                            against customer orders.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            openAddModal
                        }
                    >
                        + Add Payment Allocation
                    </button>
                </div>

                <div className="fld production-search">
                    <label htmlFor="payment-allocation-search">
                        Search Payment Allocations
                    </label>

                    <input
                        id="payment-allocation-search"
                        type="text"
                        placeholder="Search by payment ID, order ID, amount, date or status..."
                        value={
                            searchKeyword
                        }
                        onChange={(
                            event
                        ) =>
                            setSearchKeyword(
                                event.target
                                    .value
                            )
                        }
                    />
                </div>
            </section>

            {/* ====================================================
                PAYMENT ALLOCATION LIST
            ==================================================== */}

            <section className="card">
                <h2>
                    Payment Allocation List
                </h2>

                <p>
                    {
                        filteredAllocations.length
                    }{" "}
                    payment allocation record(s)
                </p>

                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

                {!error &&
                    filteredAllocations.length ===
                        0 && (
                        <p>
                            No payment allocation
                            records found.
                        </p>
                    )}

                {!error &&
                    filteredAllocations.length >
                        0 && (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
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
                                        (
                                            allocation
                                        ) => (
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
                                                    {formatDate(
                                                        allocation.allocationDate
                                                    )}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        allocation.allocatedAmount
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        allocation.recordStatus
                                                    }
                                                </td>

                                                <td>
                                                    <div className="table-actions">
                                                        <button
                                                            type="button"
                                                            className="action-btn view-btn"
                                                            onClick={() =>
                                                                handleView(
                                                                    allocation
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
                                                                    allocation
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
                                                                    allocation
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
                VIEW PAYMENT ALLOCATION MODAL
            ==================================================== */}

            <ViewModal
                isOpen={
                    !!selectedAllocation
                }
                onClose={
                    closeViewModal
                }
                title="Payment Allocation Details"
                subtitle="View payment allocation information"
                size="lg"
                footer={
                    <button
                        type="button"
                        className="btn"
                        onClick={
                            closeViewModal
                        }
                    >
                        Close
                    </button>
                }
            >
                {selectedAllocation && (
                    <DetailGrid>
                        <DetailItem
                            label="Payment Allocation ID"
                            value={
                                selectedAllocation.paymentAllocationId
                            }
                        />

                        <DetailItem
                            label="Payment ID"
                            value={
                                selectedAllocation.paymentId
                            }
                        />

                        <DetailItem
                            label="Order ID"
                            value={
                                selectedAllocation.orderId
                            }
                        />

                        <DetailItem
                            label="Allocation Date"
                            value={formatDate(
                                selectedAllocation.allocationDate
                            )}
                        />

                        <DetailItem
                            label="Allocated Amount"
                            value={formatCurrency(
                                selectedAllocation.allocatedAmount
                            )}
                        />

                        <DetailItem
                            label="Record Status"
                            value={
                                selectedAllocation.recordStatus
                            }
                        />

                        <DetailItem
                            label="Created At"
                            value={
                                selectedAllocation.createdAt
                                    ? new Date(
                                          selectedAllocation.createdAt
                                      ).toLocaleString(
                                          "en-IN"
                                      )
                                    : "-"
                            }
                        />

                        <DetailItem
                            label="Updated At"
                            value={
                                selectedAllocation.updatedAt
                                    ? new Date(
                                          selectedAllocation.updatedAt
                                      ).toLocaleString(
                                          "en-IN"
                                      )
                                    : "-"
                            }
                        />

                        <DetailItem
                            label="Remarks"
                            value={
                                selectedAllocation.remarks ||
                                "-"
                            }
                            fullWidth
                        />
                    </DetailGrid>
                )}
            </ViewModal>

            {/* ====================================================
                ADD PAYMENT ALLOCATION MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    showAddModal
                }
                onClose={
                    closeAddModal
                }
                title="Add Payment Allocation"
                subtitle="Record new payment allocation information"
                onSubmit={
                    handleCreateAllocation
                }
                submitLabel="Add Payment Allocation"
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
                        <label htmlFor="add-payment-id">
                            Payment ID
                        </label>

                        <input
                            id="add-payment-id"
                            type="number"
                            name="paymentId"
                            min="1"
                            value={
                                addForm.paymentId
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter payment ID"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-order-id">
                            Order ID
                        </label>

                        <input
                            id="add-order-id"
                            type="number"
                            name="orderId"
                            min="1"
                            value={
                                addForm.orderId
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter order ID"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-allocated-amount">
                            Allocated Amount
                        </label>

                        <input
                            id="add-allocated-amount"
                            type="number"
                            name="allocatedAmount"
                            min="0"
                            step="0.01"
                            value={
                                addForm.allocatedAmount
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter allocated amount"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-allocation-date">
                            Allocation Date
                        </label>

                        <input
                            id="add-allocation-date"
                            type="date"
                            name="allocationDate"
                            value={
                                addForm.allocationDate
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-record-status">
                            Record Status
                        </label>

                        <input
                            id="add-record-status"
                            type="text"
                            value="ACTIVE"
                            disabled
                        />
                    </div>

                    <div className="fld edit-full">
                        <label htmlFor="add-payment-allocation-remarks">
                            Remarks
                        </label>

                        <textarea
                            id="add-payment-allocation-remarks"
                            name="remarks"
                            rows="3"
                            maxLength="500"
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
                EDIT PAYMENT ALLOCATION MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    !!editingAllocation
                }
                onClose={
                    closeEditModal
                }
                title="Edit Payment Allocation"
                subtitle="Update payment allocation information"
                onSubmit={
                    handleUpdateAllocation
                }
                submitLabel="Update Payment Allocation"
                cancelLabel="Cancel"
                saving={
                    editLoading
                }
                error={
                    editError
                }
                size="lg"
            >
                {editingAllocation && (
                    <div className="edit-form-grid">
                        <div className="fld">
                            <label htmlFor="edit-payment-allocation-id">
                                Payment Allocation ID
                            </label>

                            <input
                                id="edit-payment-allocation-id"
                                type="text"
                                value={
                                    editingAllocation.paymentAllocationId
                                }
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-payment-id">
                                Payment ID
                            </label>

                            <input
                                id="edit-payment-id"
                                type="number"
                                name="paymentId"
                                min="1"
                                value={
                                    editForm.paymentId
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-order-id">
                                Order ID
                            </label>

                            <input
                                id="edit-order-id"
                                type="number"
                                name="orderId"
                                min="1"
                                value={
                                    editForm.orderId
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-allocated-amount">
                                Allocated Amount
                            </label>

                            <input
                                id="edit-allocated-amount"
                                type="number"
                                name="allocatedAmount"
                                min="0"
                                step="0.01"
                                value={
                                    editForm.allocatedAmount
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-allocation-date">
                                Allocation Date
                            </label>

                            <input
                                id="edit-allocation-date"
                                type="date"
                                name="allocationDate"
                                value={
                                    editForm.allocationDate
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-record-status">
                                Record Status
                            </label>

                            <input
                                id="edit-record-status"
                                type="text"
                                value={
                                    editingAllocation.recordStatus ||
                                    ""
                                }
                                disabled
                            />
                        </div>

                        <div className="fld edit-full">
                            <label htmlFor="edit-payment-allocation-remarks">
                                Remarks
                            </label>

                            <textarea
                                id="edit-payment-allocation-remarks"
                                name="remarks"
                                rows="3"
                                maxLength="500"
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
                    !!deletingAllocation
                }
                onClose={
                    closeDeleteModal
                }
                onConfirm={
                    handleConfirmDelete
                }
                title="Delete Payment Allocation"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this payment allocation record?"
                itemName={
                    deletingAllocation
                        ? `Payment Allocation ID: ${deletingAllocation.paymentAllocationId}`
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

export default PaymentAllocation;