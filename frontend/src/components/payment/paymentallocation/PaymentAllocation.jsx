import {
    useEffect,
    useMemo,
    useState,
} from "react";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import {
    DetailGrid,
    DetailItem,
} from "../../ui/common/DetailGrid";

import Pagination from "../../ui/Pagination";

import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";

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

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [filterError, setFilterError] = useState("");

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

            const allocationList = Array.isArray(result)
                ? result
                : Array.isArray(result?.data)
                ? result.data
                : [];

            setAllocations(allocationList);
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
    // FILTER HANDLERS
    // ============================================================

    const handleDateFromChange = (event) => {
        const value = event.target.value;

        setDateFrom(value);

        if (dateTo && value > dateTo) {
            setFilterError(
                "From date cannot be later than To date."
            );
        } else {
            setFilterError("");
        }
    };

    const handleDateToChange = (event) => {
        const value = event.target.value;

        setDateTo(value);

        if (dateFrom && dateFrom > value) {
            setFilterError(
                "From date cannot be later than To date."
            );
        } else {
            setFilterError("");
        }
    };

    const handleClearFilters = () => {
        setSearchKeyword("");
        setDateFrom("");
        setDateTo("");
        setFilterError("");
    };

    // ============================================================
    // FILTER
    // ============================================================

    const filteredAllocations = useMemo(() => {
        const keyword = searchKeyword
            .toLowerCase()
            .trim();

        if (
            dateFrom &&
            dateTo &&
            dateFrom > dateTo
        ) {
            return [];
        }

        return allocations.filter(
            (allocation) => {
                const searchableText = [
                    allocation.paymentAllocationId,
                    allocation.paymentId,
                    allocation.orderId,
                    allocation.customerId,
                    allocation.customerName,
                    allocation.allocatedAmount,
                    allocation.allocationDate,
                    allocation.allocationStatus,
                ]
                    .filter(
                        (value) =>
                            value !== null &&
                            value !== undefined
                    )
                    .join(" ")
                    .toLowerCase();

                const matchesSearch =
                    !keyword ||
                    searchableText.includes(
                        keyword
                    );

                const allocationDate =
                    allocation.allocationDate
                        ? String(
                              allocation.allocationDate
                          ).slice(0, 10)
                        : "";

                const matchesFrom =
                    !dateFrom ||
                    allocationDate >= dateFrom;

                const matchesTo =
                    !dateTo ||
                    allocationDate <= dateTo;

                return (
                    matchesSearch &&
                    matchesFrom &&
                    matchesTo
                );
            }
        );
    }, [
        allocations,
        searchKeyword,
        dateFrom,
        dateTo,
    ]);

    // ============================================================
    // SORTING
    // ============================================================

    const {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    } = useTableSort(
        filteredAllocations,
        "paymentAllocationId",
        "desc"
    );

    // ============================================================
    // PAGINATION
    // ============================================================

    const {
        currentPage,
        pageSize,
        totalPages,
        totalRecords,
        paginatedRecords,
        handlePageChange,
        handlePageSizeChange,
    } = usePagination(
        sortedRecords,
        10
    );

    // ============================================================
    // SORT INDICATOR
    // ============================================================

    const getSortIndicator = (key) => {
        if (sortKey !== key) {
            return "";
        }

        return sortDirection === "asc"
            ? " ↑"
            : " ↓";
    };

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "-";
        }

        const dateText = String(dateValue);

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
            const [year, month, day] =
                dateText.split("-");

            return `${day}-${month}-${year}`;
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );
    };

    // ============================================================
    // FORMAT DATE TIME
    // ============================================================

    const formatDateTime = (dateTimeValue) => {
        if (!dateTimeValue) {
            return "-";
        }

        const date = new Date(dateTimeValue);

        if (Number.isNaN(date.getTime())) {
            return dateTimeValue;
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
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

    const handleCreateAllocation = async (
        event
    ) => {
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
                    <h2>
                        Payment Allocations
                    </h2>

                    <p>
                        Loading payment allocation
                        records...
                    </p>
                </section>
            </div>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="page">
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
                        Add Payment Allocation
                    </button>
                </div>

                {/* ====================================================
                    FILTERS
                ==================================================== */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "16px",
                        flexWrap: "wrap",
                        marginTop: "16px",
                    }}
                >
                    <div
                        className="fld production-search"
                        style={{
                            flex:
                                "2 1 320px",
                        }}
                    >
                        <label htmlFor="payment-allocation-search">
                            Search Payment
                            Allocations
                        </label>

                        <input
                            id="payment-allocation-search"
                            type="text"
                            placeholder="Search by customer, payment ID, order ID, amount, date or status..."
                            value={
                                searchKeyword
                            }
                            onChange={(
                                event
                            ) =>
                                setSearchKeyword(
                                    event
                                        .target
                                        .value
                                )
                            }
                        />
                    </div>

                    <div
                        className="fld"
                        style={{
                            flex:
                                "1 1 180px",
                        }}
                    >
                        <label htmlFor="payment-allocation-date-from">
                            Date From
                        </label>

                        <input
                            id="payment-allocation-date-from"
                            type="date"
                            value={dateFrom}
                            onChange={
                                handleDateFromChange
                            }
                        />
                    </div>

                    <div
                        className="fld"
                        style={{
                            flex:
                                "1 1 180px",
                        }}
                    >
                        <label htmlFor="payment-allocation-date-to">
                            Date To
                        </label>

                        <input
                            id="payment-allocation-date-to"
                            type="date"
                            value={dateTo}
                            onChange={
                                handleDateToChange
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={
                            handleClearFilters
                        }
                    >
                        Clear
                    </button>
                </div>

                {filterError && (
                    <div
                        className="form-error"
                        style={{
                            marginTop: "12px",
                        }}
                    >
                        {filterError}
                    </div>
                )}
            </section>

            {/* ====================================================
                PAYMENT ALLOCATION LIST
            ==================================================== */}

            <section className="card">
                <h2>
                    Payment Allocation List
                </h2>

                <p>
                    {totalRecords} payment allocation
                    {totalRecords === 1
                        ? ""
                        : "s"}
                </p>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {filterError
                    ? null
                    : !error &&
                      totalRecords === 0 && (
                          <p>
                              No payment allocation
                              records found.
                          </p>
                      )}

                {!error &&
                    !filterError &&
                    totalRecords > 0 && (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "paymentAllocationId"
                                                    )
                                                }
                                            >
                                                ID
                                                {getSortIndicator(
                                                    "paymentAllocationId"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "paymentId"
                                                    )
                                                }
                                            >
                                                PAYMENT ID
                                                {getSortIndicator(
                                                    "paymentId"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "orderId"
                                                    )
                                                }
                                            >
                                                ORDER ID
                                                {getSortIndicator(
                                                    "orderId"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "customerName"
                                                    )
                                                }
                                            >
                                                CUSTOMER
                                                {getSortIndicator(
                                                    "customerName"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "allocationDate"
                                                    )
                                                }
                                            >
                                                ALLOCATION DATE
                                                {getSortIndicator(
                                                    "allocationDate"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "allocatedAmount"
                                                    )
                                                }
                                            >
                                                ALLOCATED AMOUNT
                                                {getSortIndicator(
                                                    "allocatedAmount"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "allocationStatus"
                                                    )
                                                }
                                            >
                                                ALLOCATION STATUS
                                                {getSortIndicator(
                                                    "allocationStatus"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedRecords.map(
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
                                                    {
                                                        allocation.customerName ||
                                                        "-"
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
                                                        allocation.allocationStatus ||
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

                            <Pagination
                                currentPage={
                                    currentPage
                                }
                                totalPages={
                                    totalPages
                                }
                                totalRecords={
                                    totalRecords
                                }
                                pageSize={
                                    pageSize
                                }
                                onPageChange={
                                    handlePageChange
                                }
                                onPageSizeChange={
                                    handlePageSizeChange
                                }
                            />
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
                            label="Customer ID"
                            value={
                                selectedAllocation.customerId
                            }
                        />

                        <DetailItem
                            label="Customer Name"
                            value={
                                selectedAllocation.customerName ||
                                "-"
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
                            label="Allocation Status"
                            value={
                                selectedAllocation.allocationStatus ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Created At"
                            value={formatDateTime(
                                selectedAllocation.createdAt
                            )}
                        />

                        <DetailItem
                            label="Updated At"
                            value={formatDateTime(
                                selectedAllocation.updatedAt
                            )}
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
                <div className="form-grid">
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

                    <div className="fld f-full">
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
                    <div className="form-grid">
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

                        <div className="fld f-full">
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
        </div>
    );
}

export default PaymentAllocation;