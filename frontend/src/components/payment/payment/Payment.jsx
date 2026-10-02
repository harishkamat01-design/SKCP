import React, {
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
import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
} from "../../../services/api";

import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";

const PAYMENT_MODES = [
    "CASH",
    "UPI",
    "BANK_TRANSFER",
    "CHEQUE",
];

const initialFormData = {
    customerId: "",
    orderId: "",
    paymentDate: "",
    totalAmountReceived: "",
    paymentMode: "CASH",
    referenceNumber: "",
    receivedBy: "",
    remarks: "",
};

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

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const formatDateTime = (dateValue) => {
    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
};

const formatCurrency = (amount) =>
    `₹ ${Number(amount || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;

function Payment({ paymentContext }) {
    const [payments, setPayments] = useState([]);
    const [allocations, setAllocations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================================
    // SEARCH + DATE FILTER STATE
    // ============================================================

    const [searchTerm, setSearchTerm] =
        useState("");

    const [dateFrom, setDateFrom] =
        useState("");

    const [dateTo, setDateTo] =
        useState("");

    const [dateFilterError, setDateFilterError] =
        useState("");

    // ============================================================
    // VIEW STATE
    // ============================================================

    const [selectedPayment, setSelectedPayment] =
        useState(null);

    const [selectedAllocations, setSelectedAllocations] =
        useState([]);

    const [viewLoading, setViewLoading] =
        useState(false);

    const [viewError, setViewError] =
        useState("");

    // ============================================================
    // FORM STATE
    // ============================================================

    const [showFormModal, setShowFormModal] =
        useState(false);

    const [editingPayment, setEditingPayment] =
        useState(null);

    const [formData, setFormData] =
        useState(initialFormData);

    const [formError, setFormError] =
        useState("");

    const [orderSummary, setOrderSummary] =
        useState(null);

    const [orderSummaryLoading, setOrderSummaryLoading] =
        useState(false);

    const [orderSummaryError, setOrderSummaryError] =
        useState("");

    const [formSuccess, setFormSuccess] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    // ============================================================
    // DELETE STATE
    // ============================================================

    const [deletingId, setDeletingId] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);

    // ============================================================
    // FETCH PAYMENTS + ALLOCATIONS
    // ============================================================

    const fetchPaymentsAndAllocations = async () => {
        setLoading(true);
        setError("");

        try {
            const [
                paymentsData,
                allocationsData,
            ] = await Promise.all([
                apiGet("/api/payments"),
                apiGet("/api/payment-allocations"),
            ]);

            const paymentList =
                Array.isArray(paymentsData)
                    ? paymentsData
                    : Array.isArray(
                          paymentsData?.data
                      )
                    ? paymentsData.data
                    : [];

            const allocationList =
                Array.isArray(
                    allocationsData
                )
                    ? allocationsData
                    : Array.isArray(
                          allocationsData?.data
                      )
                    ? allocationsData.data
                    : [];

            setPayments(paymentList);
            setAllocations(allocationList);
        } catch (err) {
            setError(
                err.message ||
                    "Failed to load payment records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentsAndAllocations();
    }, []);

    // ============================================================
    // PAYMENT CONTEXT FROM ORDER
    // ============================================================

    useEffect(() => {
        if (
            !paymentContext?.customerId ||
            !paymentContext?.orderId
        ) {
            return;
        }

        const loadOrderSummary = async () => {
            setEditingPayment(null);
            setFormError("");
            setFormSuccess("");
            setOrderSummary(null);
            setOrderSummaryError("");
            setOrderSummaryLoading(true);

            setFormData({
                ...initialFormData,
                customerId: String(
                    paymentContext.customerId
                ),
                orderId: String(
                    paymentContext.orderId
                ),
                paymentDate: new Date()
                    .toISOString()
                    .split("T")[0],
            });

            setShowFormModal(true);

            try {
                const response =
                    await apiGet(
                        `/api/orders/${paymentContext.orderId}`
                    );

                const orderData =
                    response?.data ||
                    response;

                setOrderSummary(orderData);

                setFormData(
                    (previous) => ({
                        ...previous,
                        totalAmountReceived:
                            Number(
                                orderData.balance ||
                                    0
                            ),
                    })
                );
            } catch (err) {
                setOrderSummaryError(
                    err.message ||
                        "Failed to load order details."
                );
            } finally {
                setOrderSummaryLoading(
                    false
                );
            }
        };

        loadOrderSummary();
    }, [paymentContext]);

    // ============================================================
    // PAYMENT ALLOCATION HELPERS
    // ============================================================

    const getActiveAllocationsForPayment = (
        paymentId
    ) =>
        allocations.filter(
            (allocation) =>
                Number(
                    allocation.paymentId
                ) === Number(paymentId) &&
                allocation.recordStatus ===
                    "ACTIVE"
        );

    const getTotalAllocated = (
        paymentId
    ) =>
        getActiveAllocationsForPayment(
            paymentId
        ).reduce(
            (
                total,
                allocation
            ) =>
                total +
                Number(
                    allocation.allocatedAmount ||
                        0
                ),
            0
        );

    const getUnallocatedAmount = (
        payment
    ) =>
        Number(
            payment.totalAmountReceived ||
                0
        ) -
        getTotalAllocated(
            payment.paymentId
        );

    // ============================================================
    // FILTER PAYMENTS
    // ============================================================

    const filteredPayments = useMemo(() => {
        if (
            dateFrom &&
            dateTo &&
            dateFrom > dateTo
        ) {
            return [];
        }

        const term =
            searchTerm
                .trim()
                .toLowerCase();

        return payments.filter(
            (payment) => {
                const searchableText = [
                    payment.paymentId,
                    payment.customerId,
                    payment.customerName,
                    payment.paymentDate,
                    payment.totalAmountReceived,
                    payment.paymentMode,
                    payment.receivedBy,
                    payment.paymentStatus,
                ]
                    .filter(
                        (value) =>
                            value !== null &&
                            value !== undefined
                    )
                    .join(" ")
                    .toLowerCase();

                const matchesSearch =
                    !term ||
                    searchableText.includes(
                        term
                    );

                const matchesDateFrom =
                    !dateFrom ||
                    payment.paymentDate >=
                        dateFrom;

                const matchesDateTo =
                    !dateTo ||
                    payment.paymentDate <=
                        dateTo;

                return (
                    matchesSearch &&
                    matchesDateFrom &&
                    matchesDateTo
                );
            }
        );
    }, [
        payments,
        searchTerm,
        dateFrom,
        dateTo,
    ]);

    // ============================================================
    // SORT PAYMENTS
    // ============================================================

    const {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    } = useTableSort(
        filteredPayments,
        "paymentId",
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
        paginatedRecords:
            paginatedPayments,
        handlePageChange,
        handlePageSizeChange,
    } = usePagination(
        sortedRecords,
        10
    );

    // ============================================================
    // CLEAR SEARCH + DATE FILTERS
    // ============================================================

    const handleClearFilters = () => {
        setSearchTerm("");
        setDateFrom("");
        setDateTo("");
        setDateFilterError("");
    };

    // ============================================================
    // VIEW PAYMENT
    // ============================================================

    const handleView = async (
        payment
    ) => {
        setViewLoading(true);
        setViewError("");
        setSelectedPayment(null);
        setSelectedAllocations([]);

        try {
            const paymentResponse =
                await apiGet(
                    `/api/payments/${payment.paymentId}`
                );

            const paymentData =
                Array.isArray(
                    paymentResponse
                )
                    ? paymentResponse[0]
                    : paymentResponse?.data ||
                      paymentResponse;

            setSelectedPayment(
                paymentData
            );

            setSelectedAllocations(
                getActiveAllocationsForPayment(
                    payment.paymentId
                )
            );
        } catch (err) {
            setViewError(
                err.message ||
                    "Failed to load payment details."
            );
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        setSelectedPayment(null);
        setSelectedAllocations([]);
        setViewError("");
    };

    // ============================================================
    // ADD PAYMENT
    // ============================================================

    const handleAdd = () => {
        setEditingPayment(null);
        setFormData(initialFormData);
        setFormError("");
        setFormSuccess("");
        setOrderSummary(null);
        setOrderSummaryError("");
        setShowFormModal(true);
    };

    // ============================================================
    // EDIT PAYMENT
    // ============================================================

    const handleEdit = async (
        payment
    ) => {
        setFormError("");
        setFormSuccess("");
        setEditingPayment(payment);
        setShowFormModal(true);

        try {
            const paymentResponse =
                await apiGet(
                    `/api/payments/${payment.paymentId}`
                );

            const paymentData =
                Array.isArray(
                    paymentResponse
                )
                    ? paymentResponse[0]
                    : paymentResponse?.data ||
                      paymentResponse;

            setFormData({
                customerId:
                    paymentData.customerId ??
                    "",
                orderId:
                    paymentData.orderId ??
                    "",
                paymentDate:
                    paymentData.paymentDate ??
                    "",
                totalAmountReceived:
                    paymentData.totalAmountReceived ??
                    "",
                paymentMode:
                    paymentData.paymentMode ??
                    "CASH",
                referenceNumber:
                    paymentData.referenceNumber ??
                    "",
                receivedBy:
                    paymentData.receivedBy ??
                    "",
                remarks:
                    paymentData.remarks ??
                    "",
            });
        } catch (err) {
            setFormError(
                err.message ||
                    "Failed to load payment details."
            );
        }
    };

    // ============================================================
    // CLOSE FORM
    // ============================================================

    const closeFormModal = () => {
        if (saving) {
            return;
        }

        setShowFormModal(false);
        setEditingPayment(null);
        setFormData(initialFormData);
        setFormError("");
        setFormSuccess("");
        setOrderSummary(null);
        setOrderSummaryError("");
    };

    // ============================================================
    // FORM CHANGE
    // ============================================================

    const handleFormChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };

    // ============================================================
    // FORM VALIDATION
    // ============================================================

    const validateForm = () => {
        const customerId =
            Number(
                formData.customerId
            );

        const totalAmountReceived =
            Number(
                formData.totalAmountReceived
            );

        if (
            !formData.customerId ||
            customerId <= 0
        ) {
            return "Customer ID is required and must be greater than 0.";
        }

        if (!formData.paymentDate) {
            return "Payment date is required.";
        }

        if (
            !formData.totalAmountReceived ||
            totalAmountReceived <= 0
        ) {
            return "Total amount received is required and must be greater than 0.";
        }

        if (
            !PAYMENT_MODES.includes(
                formData.paymentMode
            )
        ) {
            return "Please select a valid payment mode.";
        }

        if (
            !formData.receivedBy.trim()
        ) {
            return "Received by is required.";
        }

        if (
            formData.receivedBy.trim()
                .length > 100
        ) {
            return "Received by cannot exceed 100 characters.";
        }

        if (
            formData.referenceNumber.trim()
                .length > 100
        ) {
            return "Reference number cannot exceed 100 characters.";
        }

        return "";
    };

    // ============================================================
    // SUBMIT PAYMENT
    // ============================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setFormError("");
        setFormSuccess("");

        const validationError =
            validateForm();

        if (validationError) {
            setFormError(
                validationError
            );
            return;
        }

        const payload = {
            customerId: Number(
                formData.customerId
            ),
            paymentDate:
                formData.paymentDate,
            totalAmountReceived:
                Number(
                    formData.totalAmountReceived
                ),
            paymentMode:
                formData.paymentMode,
            referenceNumber:
                formData.referenceNumber.trim() ===
                ""
                    ? null
                    : formData.referenceNumber.trim(),
            receivedBy:
                formData.receivedBy.trim(),
            remarks:
                formData.remarks.trim() ===
                ""
                    ? null
                    : formData.remarks.trim(),
        };

        setSaving(true);

        try {
            const isEditing =
                !!editingPayment;

            if (isEditing) {
                await apiPut(
                    `/api/payments/${editingPayment.paymentId}`,
                    payload
                );
            } else {
                const paymentResponse =
                    await apiPost(
                        "/api/payments",
                        payload
                    );

                const createdPayment =
                    paymentResponse?.data ||
                    paymentResponse;

                const paymentId =
                    createdPayment?.paymentId;

                if (!paymentId) {
                    throw new Error(
                        "Payment was created but Payment ID was not returned."
                    );
                }

                // Automatically allocate the payment
                // to the current Order
                if (formData.orderId) {
                    const paymentAmount =
                        Number(
                            formData.totalAmountReceived
                        );

                    const unpaidAmount =
                        Number(
                            orderSummary?.balance ||
                                0
                        );

                    if (
                        paymentAmount >
                        unpaidAmount
                    ) {
                        throw new Error(
                            `Payment amount ₹${paymentAmount.toFixed(
                                2
                            )} cannot exceed the Unpaid Amount ₹${unpaidAmount.toFixed(
                                2
                            )}.`
                        );
                    }

                    const allocationPayload =
                        {
                            paymentId:
                                Number(
                                    paymentId
                                ),
                            orderId:
                                Number(
                                    formData.orderId
                                ),
                            allocatedAmount:
                                paymentAmount,
                            allocationDate:
                                formData.paymentDate,
                            remarks: null,
                        };

                    await apiPost(
                        "/api/payment-allocations",
                        allocationPayload
                    );
                }
            }

            setFormSuccess(
                isEditing
                    ? "Payment updated successfully."
                    : formData.orderId
                    ? "Payment created and allocated to the Order successfully."
                    : "Payment created successfully."
            );

            await fetchPaymentsAndAllocations();

            setTimeout(() => {
                setShowFormModal(false);
                setEditingPayment(null);
                setFormData(
                    initialFormData
                );
                setFormError("");
                setFormSuccess("");
                setOrderSummary(null);
                setOrderSummaryError("");
            }, 700);
        } catch (err) {
            setFormError(
                err.message ||
                    (editingPayment
                        ? "Failed to update payment."
                        : "Failed to create payment.")
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // DELETE
    // ============================================================

    const openDeleteModal = (
        payment
    ) => {
        setDeletingId(
            payment.paymentId
        );
    };

    const closeDeleteModal = () => {
        if (deleting) {
            return;
        }

        setDeletingId(null);
    };

    const confirmDelete = async () => {
        if (!deletingId) {
            return;
        }

        setDeleting(true);
        setError("");

        try {
            await apiDelete(
                `/api/payments/${deletingId}`
            );

            setDeletingId(null);

            await fetchPaymentsAndAllocations();
        } catch (err) {
            setError(
                err.message ||
                    "Failed to delete payment."
            );
        } finally {
            setDeleting(false);
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <h2>Payments</h2>
                    <p>
                        Loading payment records...
                    </p>
                </section>
            </div>
        );
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="page">
            {/* ==================================================
                PAYMENT HEADER + SEARCH
            ================================================== */}

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
                        <h2>Payments</h2>
                        <p>
                            Manage customer
                            payment records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={handleAdd}
                    >
                        Add Payment
                    </button>
                </div>

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
                            flex: "2 1 320px",
                        }}
                    >
                        <label htmlFor="payment-search">
                            Search Payments
                        </label>

                        <input
                            id="payment-search"
                            type="text"
                            value={searchTerm}
                            onChange={(
                                event
                            ) =>
                                setSearchTerm(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search by customer, payment ID, customer ID, mode..."
                        />
                    </div>

                    <div
                        className="fld"
                        style={{
                            flex: "1 1 180px",
                        }}
                    >
                        <label htmlFor="payment-date-from">
                            Date From
                        </label>

                        <input
                            id="payment-date-from"
                            type="date"
                            value={dateFrom}
                            onChange={(
                                event
                            ) => {
                                const value =
                                    event
                                        .target
                                        .value;

                                setDateFrom(
                                    value
                                );

                                if (
                                    dateTo &&
                                    value >
                                        dateTo
                                ) {
                                    setDateFilterError(
                                        "Date From cannot be later than Date To."
                                    );
                                } else {
                                    setDateFilterError(
                                        ""
                                    );
                                }
                            }}
                        />
                    </div>

                    <div
                        className="fld"
                        style={{
                            flex: "1 1 180px",
                        }}
                    >
                        <label htmlFor="payment-date-to">
                            Date To
                        </label>

                        <input
                            id="payment-date-to"
                            type="date"
                            value={dateTo}
                            onChange={(
                                event
                            ) => {
                                const value =
                                    event
                                        .target
                                        .value;

                                setDateTo(
                                    value
                                );

                                if (
                                    dateFrom &&
                                    dateFrom >
                                        value
                                ) {
                                    setDateFilterError(
                                        "Date From cannot be later than Date To."
                                    );
                                } else {
                                    setDateFilterError(
                                        ""
                                    );
                                }
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={
                            handleClearFilters
                        }
                        disabled={
                            !searchTerm &&
                            !dateFrom &&
                            !dateTo
                        }
                    >
                        Clear
                    </button>
                </div>

                {dateFilterError && (
                    <div
                        className="form-error"
                        style={{
                            marginTop: "12px",
                        }}
                    >
                        {
                            dateFilterError
                        }
                    </div>
                )}
            </section>

            {/* ==================================================
                PAYMENT LIST
            ================================================== */}

            <section className="card">
                <h2>Payment List</h2>

                <p>
                    {totalRecords} payment
                    {totalRecords === 1
                        ? ""
                        : "s"}
                </p>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {dateFilterError ? null : totalRecords ===
                  0 ? (
                    <p>
                        No payment records
                        found.
                    </p>
                ) : (
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
                                                    "paymentId"
                                                )
                                            }
                                        >
                                            ID{" "}
                                            {sortKey ===
                                                "paymentId" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? "▲"
                                                    : "▼")}
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
                                            CUSTOMER{" "}
                                            {sortKey ===
                                                "customerName" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? "▲"
                                                    : "▼")}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "paymentDate"
                                                )
                                            }
                                        >
                                            PAYMENT DATE{" "}
                                            {sortKey ===
                                                "paymentDate" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? "▲"
                                                    : "▼")}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "totalAmountReceived"
                                                )
                                            }
                                        >
                                            AMOUNT{" "}
                                            {sortKey ===
                                                "totalAmountReceived" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? "▲"
                                                    : "▼")}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "paymentMode"
                                                )
                                            }
                                        >
                                            PAYMENT MODE{" "}
                                            {sortKey ===
                                                "paymentMode" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? "▲"
                                                    : "▼")}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "receivedBy"
                                                )
                                            }
                                        >
                                            RECEIVED BY{" "}
                                            {sortKey ===
                                                "receivedBy" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? "▲"
                                                    : "▼")}
                                        </button>
                                    </th>

                                    <th>
                                        ALLOCATED
                                    </th>

                                    <th>
                                        UNALLOCATED
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "paymentStatus"
                                                )
                                            }
                                        >
                                            PAYMENT STATUS{" "}
                                            {sortKey ===
                                                "paymentStatus" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? "▲"
                                                    : "▼")}
                                        </button>
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedPayments.map(
                                    (
                                        payment
                                    ) => {
                                        const totalAllocated =
                                            getTotalAllocated(
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
                                                        payment.customerName
                                                    }
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        payment.paymentDate
                                                    )}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        payment.totalAmountReceived
                                                    )}
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
                                                    {formatCurrency(
                                                        totalAllocated
                                                    )}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        unallocatedAmount
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        payment.paymentStatus ||
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
                                                                    payment
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
                                                                    payment
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="action-btn delete-btn"
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    payment
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
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

            {/* ==================================================
                VIEW PAYMENT MODAL
            ================================================== */}

            <ViewModal
                isOpen={
                    !!selectedPayment ||
                    viewLoading ||
                    !!viewError
                }
                onClose={
                    closeViewModal
                }
                title="Payment Details"
                subtitle={
                    selectedPayment
                        ? `Payment ID: ${selectedPayment.paymentId}`
                        : "Payment information"
                }
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
                    >
                        Close
                    </button>
                }
            >
                {selectedPayment &&
                    !viewLoading && (
                        <>
                            <DetailGrid>
                                <DetailItem
                                    label="Payment ID"
                                    value={
                                        selectedPayment.paymentId
                                    }
                                />

                                <DetailItem
                                    label="Customer ID"
                                    value={
                                        selectedPayment.customerId
                                    }
                                />

                                <DetailItem
                                    label="Customer Name"
                                    value={
                                        selectedPayment.customerName ||
                                        "-"
                                    }
                                />

                                <DetailItem
                                    label="Payment Date"
                                    value={formatDate(
                                        selectedPayment.paymentDate
                                    )}
                                />

                                <DetailItem
                                    label="Total Amount Received"
                                    value={formatCurrency(
                                        selectedPayment.totalAmountReceived
                                    )}
                                />

                                <DetailItem
                                    label="Total Allocated"
                                    value={formatCurrency(
                                        getTotalAllocated(
                                            selectedPayment.paymentId
                                        )
                                    )}
                                />

                                <DetailItem
                                    label="Unallocated Amount"
                                    value={formatCurrency(
                                        Number(
                                            selectedPayment.totalAmountReceived ||
                                                0
                                        ) -
                                            getTotalAllocated(
                                                selectedPayment.paymentId
                                            )
                                    )}
                                />

                                <DetailItem
                                    label="Payment Mode"
                                    value={
                                        selectedPayment.paymentMode
                                    }
                                />

                                <DetailItem
                                    label="Reference Number"
                                    value={
                                        selectedPayment.referenceNumber ||
                                        "-"
                                    }
                                />

                                <DetailItem
                                    label="Received By"
                                    value={
                                        selectedPayment.receivedBy ||
                                        "-"
                                    }
                                />

                                <DetailItem
                                    label="Payment Status"
                                    value={
                                        selectedPayment.paymentStatus ||
                                        "-"
                                    }
                                />

                                <DetailItem
                                    label="Created At"
                                    value={formatDateTime(
                                        selectedPayment.createdAt
                                    )}
                                />

                                <DetailItem
                                    label="Remarks"
                                    value={
                                        selectedPayment.remarks ||
                                        "-"
                                    }
                                />
                            </DetailGrid>

                            <div
                                style={{
                                    marginTop:
                                        "24px",
                                }}
                            >
                                <h3>
                                    Payment
                                    Allocations
                                </h3>

                                <p>
                                    {
                                        selectedAllocations.length
                                    }{" "}
                                    active
                                    allocation
                                    {selectedAllocations.length ===
                                    1
                                        ? ""
                                        : "s"}
                                </p>

                                {selectedAllocations.length ===
                                0 ? (
                                    <p>
                                        No active
                                        payment
                                        allocations
                                        found.
                                    </p>
                                ) : (
                                    <div className="table-wrap">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        ALLOCATION
                                                        ID
                                                    </th>
                                                    <th>
                                                        ORDER
                                                        ID
                                                    </th>
                                                    <th>
                                                        ALLOCATION
                                                        DATE
                                                    </th>
                                                    <th>
                                                        ALLOCATED
                                                        AMOUNT
                                                    </th>
                                                    <th>
                                                        ALLOCATION
                                                        STATUS
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {selectedAllocations.map(
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
                                                                    allocation.allocationStatus ||
                                                                    "-"
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
            </ViewModal>

            {/* ==================================================
                PAYMENT FORM MODAL
            ================================================== */}

            <FormModal
                isOpen={
                    showFormModal
                }
                onClose={
                    closeFormModal
                }
                title={
                    editingPayment
                        ? "Edit Payment"
                        : "Add Payment"
                }
                subtitle={
                    editingPayment
                        ? `Update Payment ID: ${editingPayment.paymentId}`
                        : "Enter customer payment details."
                }
                onSubmit={
                    handleSubmit
                }
                submitLabel={
                    editingPayment
                        ? "Update Payment"
                        : "Add Payment"
                }
                cancelLabel="Cancel"
                saving={
                    saving
                }
                error={
                    formError
                }
                success={
                    formSuccess
                }
                size="lg"
            >
                {orderSummaryLoading && (
                    <div className="form-success">
                        Loading order
                        details...
                    </div>
                )}

                {orderSummaryError && (
                    <div className="form-error">
                        {
                            orderSummaryError
                        }
                    </div>
                )}

                {orderSummary &&
                    !orderSummaryLoading && (
                        <div
                            style={{
                                marginBottom:
                                    "20px",
                                padding:
                                    "16px",
                                border:
                                    "1px solid #ddd",
                                borderRadius:
                                    "8px",
                            }}
                        >
                            <h3
                                style={{
                                    marginTop: 0,
                                }}
                            >
                                Order Summary
                            </h3>

                            <div className="form-grid">
                                <div className="fld">
                                    <label>
                                        Order Total
                                    </label>

                                    <input
                                        type="text"
                                        value={formatCurrency(
                                            orderSummary.totalAmount
                                        )}
                                        readOnly
                                    />
                                </div>

                                <div className="fld">
                                    <label>
                                        Already Paid
                                    </label>

                                    <input
                                        type="text"
                                        value={formatCurrency(
                                            orderSummary.paidAmount
                                        )}
                                        readOnly
                                    />
                                </div>

                                <div className="fld">
                                    <label>
                                        Unpaid Amount
                                    </label>

                                    <input
                                        type="text"
                                        value={formatCurrency(
                                            orderSummary.balance
                                        )}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                <div className="form-grid">
                    <div className="fld">
                        <label htmlFor="customerId">
                            Customer ID
                        </label>

                        <input
                            id="customerId"
                            name="customerId"
                            type="number"
                            min="1"
                            value={
                                formData.customerId
                            }
                            onChange={
                                handleFormChange
                            }
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="orderId">
                            Order ID
                        </label>

                        <input
                            id="orderId"
                            name="orderId"
                            type="number"
                            min="1"
                            value={
                                formData.orderId
                            }
                            onChange={
                                handleFormChange
                            }
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="paymentDate">
                            Payment Date
                        </label>

                        <input
                            id="paymentDate"
                            name="paymentDate"
                            type="date"
                            value={
                                formData.paymentDate
                            }
                            onChange={
                                handleFormChange
                            }
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="totalAmountReceived">
                            Total Amount
                            Received
                        </label>

                        <input
                            id="totalAmountReceived"
                            name="totalAmountReceived"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={
                                formData.totalAmountReceived
                            }
                            onChange={
                                handleFormChange
                            }
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="paymentMode">
                            Payment Mode
                        </label>

                        <select
                            id="paymentMode"
                            name="paymentMode"
                            value={
                                formData.paymentMode
                            }
                            onChange={
                                handleFormChange
                            }
                            required
                        >
                            {PAYMENT_MODES.map(
                                (mode) => (
                                    <option
                                        key={
                                            mode
                                        }
                                        value={
                                            mode
                                        }
                                    >
                                        {mode}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="fld">
                        <label htmlFor="referenceNumber">
                            Reference Number
                        </label>

                        <input
                            id="referenceNumber"
                            name="referenceNumber"
                            type="text"
                            maxLength="100"
                            value={
                                formData.referenceNumber
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Optional"
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="receivedBy">
                            Received By
                        </label>

                        <input
                            id="receivedBy"
                            name="receivedBy"
                            type="text"
                            maxLength="100"
                            value={
                                formData.receivedBy
                            }
                            onChange={
                                handleFormChange
                            }
                            required
                        />
                    </div>

                    <div className="fld f-full">
                        <label htmlFor="remarks">
                            Remarks
                        </label>

                        <textarea
                            id="remarks"
                            name="remarks"
                            rows="4"
                            value={
                                formData.remarks
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Optional remarks"
                        />
                    </div>
                </div>
            </FormModal>

            {/* ==================================================
                DELETE CONFIRMATION
            ================================================== */}

            <DeleteConfirmModal
                isOpen={
                    !!deletingId
                }
                onClose={
                    closeDeleteModal
                }
                onConfirm={
                    confirmDelete
                }
                title="Delete Payment"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this payment?"
                itemName={
                    deletingId
                        ? `Payment ID: ${deletingId}`
                        : ""
                }
                confirming={
                    deleting
                }
                error=""
            />
        </div>
    );
}

export default Payment;