import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import jsPDF from "jspdf";

import { apiGet } from "../../../services/api";
import useTableSort from "../../../hooks/useTableSort";

const Statements = () => {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [paymentAllocations, setPaymentAllocations] =
        useState([]);

    const [customerId, setCustomerId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [statementData, setStatementData] =
        useState(null);

    // ============================================================
    // LOAD DATA
    // ============================================================

    useEffect(() => {
        loadStatementData();
    }, []);

    const loadStatementData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                customersResponse,
                ordersResponse,
                paymentsResponse,
                allocationsResponse
            ] = await Promise.all([
                apiGet("/api/customers"),
                apiGet("/api/orders"),
                apiGet("/api/payments"),
                apiGet("/api/payment-allocations")
            ]);

            setCustomers(
                customersResponse?.data || []
            );

            setOrders(
                ordersResponse?.data || []
            );

            setPayments(
                paymentsResponse?.data || []
            );

            setPaymentAllocations(
                allocationsResponse?.data || []
            );
        } catch (err) {
            console.error(
                "Error loading statement data:",
                err
            );

            setError(
                "Failed to load statement data."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // GENERATE STATEMENT
    // ============================================================

    const handleGenerateStatement = async () => {
        try {
            setError("");
            setStatementData(null);

            if (!customerId) {
                setError(
                    "Please select a customer."
                );
                return;
            }

            if (
                fromDate &&
                toDate &&
                fromDate > toDate
            ) {
                setError(
                    "From Date cannot be later than To Date."
                );
                return;
            }

            const selectedCustomer =
                customers.find(
                    (customer) =>
                        customer.customerId ===
                        Number(customerId)
                );

            if (!selectedCustomer) {
                setError(
                    "Customer not found."
                );
                return;
            }

            const customerOrders =
                orders.filter(
                    (order) =>
                        order.customerId ===
                        Number(customerId)
                );

            const customerPayments =
                payments.filter(
                    (payment) =>
                        payment.customerId ===
                        Number(customerId)
                );

            const customerOrderIds =
                customerOrders.map(
                    (order) => order.orderId
                );

            const customerAllocations =
                paymentAllocations.filter(
                    (allocation) =>
                        customerOrderIds.includes(
                            allocation.orderId
                        )
                );

            const detailedOrderResponses =
                await Promise.all(
                    customerOrders.map(
                        (order) =>
                            apiGet(
                                `/api/orders/${order.orderId}`
                            )
                    )
                );

            const detailedOrders =
                detailedOrderResponses
                    .map(
                        (result) =>
                            result?.data
                    )
                    .filter(Boolean);

            const totalPayments =
                customerPayments.reduce(
                    (sum, payment) =>
                        sum +
                        Number(
                            payment.totalAmountReceived ||
                                0
                        ),
                    0
                );

            const totalAllocated =
                customerAllocations.reduce(
                    (sum, allocation) =>
                        sum +
                        Number(
                            allocation.allocatedAmount ||
                                0
                        ),
                    0
                );

            const unallocatedAmount =
                totalPayments -
                totalAllocated;

            const totalOrderAmount =
                detailedOrders.reduce(
                    (sum, order) =>
                        sum +
                        Number(
                            order.totalAmount || 0
                        ),
                    0
                );

            const totalPaidAmount =
                detailedOrders.reduce(
                    (sum, order) =>
                        sum +
                        Number(
                            order.paidAmount || 0
                        ),
                    0
                );

            const totalOutstanding =
                detailedOrders.reduce(
                    (sum, order) =>
                        sum +
                        Number(
                            order.balance || 0
                        ),
                    0
                );

            setStatementData({
                customer:
                    selectedCustomer,

                orders:
                    customerOrders,

                detailedOrders,

                payments:
                    customerPayments,

                paymentAllocations:
                    customerAllocations,

                totalPayments,

                totalAllocated,

                unallocatedAmount,

                totalOrderAmount,

                totalPaidAmount,

                totalOutstanding,

                fromDate,

                toDate
            });
        } catch (err) {
            console.error(
                "Error generating statement:",
                err
            );

            setError(
                "Failed to generate customer statement."
            );
        }
    };

    // ============================================================
    // FORMATTERS
    // ============================================================

    const formatCurrency = (amount) => {
        return Number(
            amount || 0
        ).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        });
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    };

    // ============================================================
    // PAYMENT ROWS
    // ============================================================

    const paymentRows = useMemo(() => {
        if (!statementData?.payments) {
            return [];
        }

        return statementData.payments.map(
            (payment) => {
                const paymentOrders =
                    statementData.paymentAllocations
                        .filter(
                            (allocation) =>
                                allocation.paymentId ===
                                payment.paymentId
                        )
                        .map(
                            (allocation) =>
                                allocation.orderId
                        );

                const uniqueOrderIds = [
                    ...new Set(
                        paymentOrders
                    )
                ];

                return {
                    ...payment,

                    statementOrderId:
                        uniqueOrderIds.length >
                        0
                            ? uniqueOrderIds.join(
                                  ", "
                              )
                            : "UNALLOCATED"
                };
            }
        );
    }, [
        statementData?.payments,
        statementData?.paymentAllocations
    ]);

    // ============================================================
    // TABLE SORTING
    // ============================================================

    const {
        sortKey: orderSortKey,
        sortDirection:
            orderSortDirection,
        sortedRecords: sortedOrders,
        handleSort: handleOrderSort
    } = useTableSort(
        statementData?.detailedOrders ||
            [],
        "orderId",
        "asc"
    );

    const {
        sortKey: paymentSortKey,
        sortDirection:
            paymentSortDirection,
        sortedRecords: sortedPayments,
        handleSort: handlePaymentSort
    } = useTableSort(
        paymentRows,
        "paymentId",
        "asc"
    );

    const {
        sortKey: allocationSortKey,
        sortDirection:
            allocationSortDirection,
        sortedRecords:
            sortedAllocations,
        handleSort:
            handleAllocationSort
    } = useTableSort(
        statementData?.paymentAllocations ||
            [],
        "paymentAllocationId",
        "asc"
    );

    const {
        sortKey: outstandingSortKey,
        sortDirection:
            outstandingSortDirection,
        sortedRecords:
            sortedOutstanding,
        handleSort:
            handleOutstandingSort
    } = useTableSort(
        statementData?.detailedOrders ||
            [],
        "orderId",
        "asc"
    );

    const getSortIndicator = (
        activeKey,
        currentKey,
        direction
    ) => {
        if (activeKey !== currentKey) {
            return "";
        }

        return direction === "asc"
            ? " ↑"
            : " ↓";
    };

    // ============================================================
    // PDF FORMATTERS
    // ============================================================

    const formatPdfCurrency = (
        amount
    ) => {
        return `INR ${Number(
            amount || 0
        ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatPdfDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return String(date);
        }

        const day = String(
            parsedDate.getDate()
        ).padStart(2, "0");

        const month = String(
            parsedDate.getMonth() + 1
        ).padStart(2, "0");

        const year =
            parsedDate.getFullYear();

        return `${day}-${month}-${year}`;
    };

    // ============================================================
    // DOWNLOAD CUSTOMER STATEMENT PDF
    // ============================================================

    const handleDownloadStatementPdf =
        () => {
            if (!statementData) {
                return;
            }

            const doc = new jsPDF();

            const pageWidth =
                doc.internal.pageSize.getWidth();

            const pageHeight =
                doc.internal.pageSize.getHeight();

            const leftMargin = 18;

            const rightMargin =
                pageWidth - 18;

            let y = 18;

            // ----------------------------------------------------
            // HELPER - NEW PAGE
            // ----------------------------------------------------

            const addPageIfNeeded = (
                requiredHeight = 15
            ) => {
                if (
                    y + requiredHeight >
                    pageHeight - 20
                ) {
                    doc.addPage();

                    y = 20;

                    return true;
                }

                return false;
            };

            // ----------------------------------------------------
            // HEADER
            // ----------------------------------------------------

            doc.setFontSize(20);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Shree Kundodari Cement Products",
                leftMargin,
                y
            );

            doc.setFontSize(10);

            doc.text(
                "CUSTOMER STATEMENT",
                rightMargin,
                y,
                {
                    align: "right"
                }
            );

            y += 9;

            doc.setLineWidth(0.5);

            doc.line(
                leftMargin,
                y,
                rightMargin,
                y
            );

            // ----------------------------------------------------
            // CUSTOMER INFORMATION
            // ----------------------------------------------------

            y += 12;

            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Customer Information",
                leftMargin,
                y
            );

            y += 8;

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setFontSize(10);

            doc.text(
                `Customer: ${
                    statementData.customer
                        ?.customerName ||
                    "-"
                }`,
                leftMargin,
                y
            );

            y += 7;

            const periodText =
                statementData.fromDate ||
                statementData.toDate
                    ? `${formatPdfDate(
                          statementData.fromDate
                      )} - ${formatPdfDate(
                          statementData.toDate
                      )}`
                    : "All Dates";

            doc.text(
                `Statement Period: ${periodText}`,
                leftMargin,
                y
            );

            y += 12;

            // ----------------------------------------------------
            // ACCOUNT SUMMARY
            // ----------------------------------------------------

            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Account Summary",
                leftMargin,
                y
            );

            y += 8;

            doc.setFontSize(10);

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.text(
                `Total Order Amount: ${formatPdfCurrency(
                    statementData.totalOrderAmount
                )}`,
                leftMargin,
                y
            );

            y += 7;

            doc.text(
                `Total Paid Amount: ${formatPdfCurrency(
                    statementData.totalPaidAmount
                )}`,
                leftMargin,
                y
            );

            y += 7;

            doc.text(
                `Total Outstanding: ${formatPdfCurrency(
                    statementData.totalOutstanding
                )}`,
                leftMargin,
                y
            );

            y += 12;

            // ----------------------------------------------------
            // PAYMENT SUMMARY
            // ----------------------------------------------------

            addPageIfNeeded(40);

            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Payment Summary",
                leftMargin,
                y
            );

            y += 8;

            doc.setFontSize(10);

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.text(
                `Total Payments Received: ${formatPdfCurrency(
                    statementData.totalPayments
                )}`,
                leftMargin,
                y
            );

            y += 7;

            doc.text(
                `Total Allocated: ${formatPdfCurrency(
                    statementData.totalAllocated
                )}`,
                leftMargin,
                y
            );

            y += 7;

            doc.text(
                `Unallocated Payment: ${formatPdfCurrency(
                    statementData.unallocatedAmount
                )}`,
                leftMargin,
                y
            );

            y += 14;

            // ----------------------------------------------------
            // ORDERS
            // ----------------------------------------------------

            addPageIfNeeded(45);

            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Orders",
                leftMargin,
                y
            );

            y += 8;

            doc.setFontSize(8);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Order ID",
                18,
                y
            );

            doc.text(
                "Order Date",
                43,
                y
            );

            doc.text(
                "Delivery",
                72,
                y
            );

            doc.text(
                "Total",
                105,
                y
            );

            doc.text(
                "Paid",
                138,
                y
            );

            doc.text(
                "Outstanding",
                168,
                y
            );

            y += 5;

            doc.line(
                leftMargin,
                y,
                rightMargin,
                y
            );

            y += 6;

            doc.setFont(
                "helvetica",
                "normal"
            );

            sortedOrders.forEach(
                (order) => {
                    addPageIfNeeded(10);

                    doc.text(
                        String(
                            order.orderId ||
                                "-"
                        ),
                        18,
                        y
                    );

                    doc.text(
                        formatPdfDate(
                            order.orderDate
                        ),
                        43,
                        y
                    );

                    doc.text(
                        formatPdfDate(
                            order.expectedDeliveryDate
                        ),
                        72,
                        y
                    );

                    doc.text(
                        formatPdfCurrency(
                            order.totalAmount
                        ),
                        105,
                        y
                    );

                    doc.text(
                        formatPdfCurrency(
                            order.paidAmount
                        ),
                        138,
                        y
                    );

                    doc.text(
                        formatPdfCurrency(
                            order.balance
                        ),
                        168,
                        y
                    );

                    y += 7;
                }
            );

            y += 4;

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                `Total Order Amount: ${formatPdfCurrency(
                    statementData.totalOrderAmount
                )}`,
                105,
                y
            );

            y += 14;

            // ----------------------------------------------------
            // PAYMENTS
            // ----------------------------------------------------

            addPageIfNeeded(45);

            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Payments",
                leftMargin,
                y
            );

            y += 8;

            doc.setFontSize(8);

            doc.text(
                "Payment ID",
                18,
                y
            );

            doc.text(
                "Order ID",
                42,
                y
            );

            doc.text(
                "Date",
                70,
                y
            );

            doc.text(
                "Mode",
                95,
                y
            );

            doc.text(
                "Amount",
                125,
                y
            );

            doc.text(
                "Received By",
                160,
                y
            );

            y += 5;

            doc.line(
                leftMargin,
                y,
                rightMargin,
                y
            );

            y += 6;

            doc.setFont(
                "helvetica",
                "normal"
            );

            sortedPayments.forEach(
                (payment) => {
                    addPageIfNeeded(10);

                    doc.text(
                        String(
                            payment.paymentId ||
                                "-"
                        ),
                        18,
                        y
                    );

                    doc.text(
                        String(
                            payment.statementOrderId ||
                                "UNALLOCATED"
                        ),
                        42,
                        y
                    );

                    doc.text(
                        formatPdfDate(
                            payment.paymentDate
                        ),
                        70,
                        y
                    );

                    doc.text(
                        String(
                            payment.paymentMode ||
                                "-"
                        ),
                        95,
                        y
                    );

                    doc.text(
                        formatPdfCurrency(
                            payment.totalAmountReceived
                        ),
                        125,
                        y
                    );

                    doc.text(
                        String(
                            payment.receivedBy ||
                                "-"
                        ),
                        160,
                        y
                    );

                    y += 7;
                }
            );

            y += 4;

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                `Total Payments: ${formatPdfCurrency(
                    statementData.totalPayments
                )}`,
                105,
                y
            );

            y += 7;

            doc.text(
                `Unallocated Payments: ${formatPdfCurrency(
                    statementData.unallocatedAmount
                )}`,
                105,
                y
            );

            y += 14;

            // ----------------------------------------------------
            // PAYMENT ALLOCATIONS
            // ----------------------------------------------------

            addPageIfNeeded(45);

            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Payment Allocations",
                leftMargin,
                y
            );

            y += 8;

            doc.setFontSize(8);

            doc.text(
                "Allocation ID",
                18,
                y
            );

            doc.text(
                "Payment ID",
                48,
                y
            );

            doc.text(
                "Order ID",
                76,
                y
            );

            doc.text(
                "Date",
                104,
                y
            );

            doc.text(
                "Amount",
                132,
                y
            );

            doc.text(
                "Status",
                165,
                y
            );

            y += 5;

            doc.line(
                leftMargin,
                y,
                rightMargin,
                y
            );

            y += 6;

            doc.setFont(
                "helvetica",
                "normal"
            );

            sortedAllocations.forEach(
                (allocation) => {
                    addPageIfNeeded(10);

                    doc.text(
                        String(
                            allocation.paymentAllocationId ||
                                "-"
                        ),
                        18,
                        y
                    );

                    doc.text(
                        String(
                            allocation.paymentId ||
                                "-"
                        ),
                        48,
                        y
                    );

                    doc.text(
                        String(
                            allocation.orderId ||
                                "-"
                        ),
                        76,
                        y
                    );

                    doc.text(
                        formatPdfDate(
                            allocation.allocationDate
                        ),
                        104,
                        y
                    );

                    doc.text(
                        formatPdfCurrency(
                            allocation.allocatedAmount
                        ),
                        132,
                        y
                    );

                    doc.text(
                        String(
                            allocation.allocationStatus ||
                                "-"
                        ),
                        165,
                        y
                    );

                    y += 7;
                }
            );

            y += 4;

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                `Total Allocated: ${formatPdfCurrency(
                    statementData.totalAllocated
                )}`,
                105,
                y
            );

            y += 14;

            // ----------------------------------------------------
            // OUTSTANDING BALANCE
            // ----------------------------------------------------

            addPageIfNeeded(45);

            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Outstanding Balance",
                leftMargin,
                y
            );

            y += 8;

            doc.setFontSize(8);

            doc.text(
                "Order ID",
                18,
                y
            );

            doc.text(
                "Order Total",
                48,
                y
            );

            doc.text(
                "Paid",
                90,
                y
            );

            doc.text(
                "Outstanding",
                120,
                y
            );

            doc.text(
                "Payment Status",
                165,
                y
            );

            y += 5;

            doc.line(
                leftMargin,
                y,
                rightMargin,
                y
            );

            y += 6;

            doc.setFont(
                "helvetica",
                "normal"
            );

            sortedOutstanding.forEach(
                (order) => {
                    addPageIfNeeded(10);

                    doc.text(
                        String(
                            order.orderId ||
                                "-"
                        ),
                        18,
                        y
                    );

                    doc.text(
                        formatPdfCurrency(
                            order.totalAmount
                        ),
                        48,
                        y
                    );

                    doc.text(
                        formatPdfCurrency(
                            order.paidAmount
                        ),
                        90,
                        y
                    );

                    doc.text(
                        formatPdfCurrency(
                            order.balance
                        ),
                        120,
                        y
                    );

                    doc.text(
                        String(
                            order.paymentStatus ||
                                "-"
                        ),
                        165,
                        y
                    );

                    y += 7;
                }
            );

            y += 5;

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                `Total Outstanding: ${formatPdfCurrency(
                    statementData.totalOutstanding
                )}`,
                105,
                y
            );

            // ----------------------------------------------------
            // FOOTER ON ALL PAGES
            // ----------------------------------------------------

            const totalPages =
                doc.getNumberOfPages();

            for (
                let page = 1;
                page <= totalPages;
                page++
            ) {
                doc.setPage(page);

                const footerY =
                    pageHeight - 10;

                doc.setFontSize(8);

                doc.setFont(
                    "helvetica",
                    "normal"
                );

                doc.text(
                    "SKCP - Kumta - 581343, Karnataka",
                    pageWidth / 2,
                    footerY,
                    {
                        align: "center"
                    }
                );

                doc.text(
                    `Page ${page} of ${totalPages}`,
                    rightMargin,
                    footerY,
                    {
                        align: "right"
                    }
                );
            }

            // ----------------------------------------------------
            // SAVE PDF
            // ----------------------------------------------------

            const customerName =
                statementData.customer
                    ?.customerName ||
                "Customer";

            const safeCustomerName =
                customerName
                    .replace(
                        /[^a-zA-Z0-9]/g,
                        "-"
                    )
                    .replace(
                        /-+/g,
                        "-"
                    );

            doc.save(
                `SKCP-Customer-Statement-${safeCustomerName}.pdf`
            );
        };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div>

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    marginBottom: "16px"
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "20px",
                            fontWeight: 700
                        }}
                    >
                        Statements
                    </h2>

                    <p
                        style={{
                            margin: "4px 0 0",
                            fontSize: "12px",
                            color:
                                "var(--text2)"
                        }}
                    >
                        Customer account
                        statements and
                        transaction details
                    </p>
                </div>
            </div>

            {/* =====================================================
                CUSTOMER STATEMENT FILTER
            ====================================================== */}

            <div className="card">

                <div className="card-head">
                    <div className="card-title">
                        Customer Statement
                    </div>
                </div>

                <div className="reports-filter-grid">

                    <div className="reports-filter-field">

                        <label>
                            Customer
                        </label>

                        <select
                            value={
                                customerId
                            }
                            onChange={(e) =>
                                setCustomerId(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select Customer
                            </option>

                            {customers.map(
                                (customer) => (
                                    <option
                                        key={
                                            customer.customerId
                                        }
                                        value={
                                            customer.customerId
                                        }
                                    >
                                        {
                                            customer.customerName
                                        }
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                    <div className="reports-filter-field">

                        <label>
                            From Date
                        </label>

                        <input
                            type="date"
                            value={
                                fromDate
                            }
                            onChange={(e) =>
                                setFromDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="reports-filter-field">

                        <label>
                            To Date
                        </label>

                        <input
                            type="date"
                            value={
                                toDate
                            }
                            onChange={(e) =>
                                setToDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "flex-end"
                        }}
                    >
                        <button
                            type="button"
                            className="action-btn view-btn"
                            style={{
                                minHeight:
                                    "40px",
                                padding:
                                    "0 16px"
                            }}
                            onClick={
                                handleGenerateStatement
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Loading..."
                                : "Generate Statement"}
                        </button>
                    </div>

                </div>
            </div>

            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (
                <div
                    className="card"
                    style={{
                        padding:
                            "12px 15px",
                        color:
                            "var(--text)"
                    }}
                >
                    <div
                        style={{
                            fontSize:
                                "12px",
                            fontWeight: 600,
                            color:
                                "var(--accent)"
                        }}
                    >
                        {error}
                    </div>
                </div>
            )}

            {/* =====================================================
                LOADING
            ====================================================== */}

            {loading && (
                <div className="dashboard-loading">
                    Loading statement data...
                </div>
            )}

            {/* =====================================================
                STATEMENT RESULTS
            ====================================================== */}

            {statementData &&
                !loading && (
                    <>

                        {/* =============================================
                            STATEMENT HEADER
                        ============================================== */}

                        <div className="card">

                            <div className="card-head">

                                <div className="card-title">
                                    Statement Results
                                </div>

                                <button
                                    type="button"
                                    className="action-btn view-btn"
                                    onClick={
                                        handleDownloadStatementPdf
                                    }
                                >
                                    Download PDF
                                </button>

                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    flexWrap:
                                        "wrap",
                                    gap: "24px",
                                    alignItems:
                                        "center"
                                }}
                            >

                                <div>

                                    <div
                                        style={{
                                            fontSize:
                                                "11px",
                                            color:
                                                "var(--text2)",
                                            marginBottom:
                                                "3px"
                                        }}
                                    >
                                        CUSTOMER
                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                "15px",
                                            fontWeight:
                                                700,
                                            color:
                                                "var(--text)"
                                        }}
                                    >
                                        {
                                            statementData
                                                .customer
                                                ?.customerName
                                        }
                                    </div>

                                </div>

                                <div>

                                    <div
                                        style={{
                                            fontSize:
                                                "11px",
                                            color:
                                                "var(--text2)",
                                            marginBottom:
                                                "3px"
                                        }}
                                    >
                                        PERIOD
                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                "13px",
                                            fontWeight:
                                                600
                                        }}
                                    >
                                        {fromDate ||
                                        toDate
                                            ? `${formatDate(
                                                  fromDate
                                              )} - ${formatDate(
                                                  toDate
                                              )}`
                                            : "All Dates"}
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* =============================================
                            ACCOUNT SUMMARY
                        ============================================== */}

                        <div className="card">

                            <div className="card-head">

                                <div className="card-title">
                                    Account Summary
                                </div>

                            </div>

                            <div className="kpi-grid">

                                <div className="card">

                                    <div
                                        style={{
                                            fontSize:
                                                "11px",
                                            color:
                                                "var(--text2)",
                                            marginBottom:
                                                "6px"
                                        }}
                                    >
                                        TOTAL ORDER
                                        AMOUNT
                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                "17px",
                                            fontWeight:
                                                700
                                        }}
                                    >
                                        {formatCurrency(
                                            statementData.totalOrderAmount
                                        )}
                                    </div>

                                </div>

                                <div className="card">

                                    <div
                                        style={{
                                            fontSize:
                                                "11px",
                                            color:
                                                "var(--text2)",
                                            marginBottom:
                                                "6px"
                                        }}
                                    >
                                        TOTAL PAID
                                        AMOUNT
                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                "17px",
                                            fontWeight:
                                                700
                                        }}
                                    >
                                        {formatCurrency(
                                            statementData.totalPaidAmount
                                        )}
                                    </div>

                                </div>

                                <div className="card">

                                    <div
                                        style={{
                                            fontSize:
                                                "11px",
                                            color:
                                                "var(--text2)",
                                            marginBottom:
                                                "6px"
                                        }}
                                    >
                                        TOTAL
                                        OUTSTANDING
                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                "17px",
                                            fontWeight:
                                                700
                                        }}
                                    >
                                        {formatCurrency(
                                            statementData.totalOutstanding
                                        )}
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* =============================================
                            PAYMENT SUMMARY
                        ============================================== */}

                        <div className="card">

                            <div className="card-head">

                                <div className="card-title">
                                    Payment Summary
                                </div>

                            </div>

                            <div className="kpi-grid">

                                <div className="card">

                                    <div
                                        style={{
                                            fontSize:
                                                "11px",
                                            color:
                                                "var(--text2)",
                                            marginBottom:
                                                "6px"
                                        }}
                                    >
                                        TOTAL PAYMENTS
                                        RECEIVED
                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                "17px",
                                            fontWeight:
                                                700
                                        }}
                                    >
                                        {formatCurrency(
                                            statementData.totalPayments
                                        )}
                                    </div>

                                </div>

                                <div className="card">

                                    <div
                                        style={{
                                            fontSize:
                                                "11px",
                                            color:
                                                "var(--text2)",
                                            marginBottom:
                                                "6px"
                                        }}
                                    >
                                        TOTAL
                                        ALLOCATED
                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                "17px",
                                            fontWeight:
                                                700
                                        }}
                                    >
                                        {formatCurrency(
                                            statementData.totalAllocated
                                        )}
                                    </div>

                                </div>

                                <div className="card">

                                    <div
                                        style={{
                                            fontSize:
                                                "11px",
                                            color:
                                                "var(--text2)",
                                            marginBottom:
                                                "6px"
                                        }}
                                    >
                                        UNALLOCATED
                                        PAYMENT
                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                "17px",
                                            fontWeight:
                                                700
                                        }}
                                    >
                                        {formatCurrency(
                                            statementData.unallocatedAmount
                                        )}
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* =============================================
                            ORDERS
                        ============================================== */}

                        <div className="card">

                            <div className="card-head">

                                <div className="card-title">
                                    Orders
                                </div>

                            </div>

                            <div
                                style={{
                                    overflowX:
                                        "auto"
                                }}
                            >

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOrderSort(
                                                            "orderId"
                                                        )
                                                    }
                                                >
                                                    Order ID
                                                    {getSortIndicator(
                                                        orderSortKey,
                                                        "orderId",
                                                        orderSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOrderSort(
                                                            "orderDate"
                                                        )
                                                    }
                                                >
                                                    Order Date
                                                    {getSortIndicator(
                                                        orderSortKey,
                                                        "orderDate",
                                                        orderSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOrderSort(
                                                            "expectedDeliveryDate"
                                                        )
                                                    }
                                                >
                                                    Expected Delivery
                                                    {getSortIndicator(
                                                        orderSortKey,
                                                        "expectedDeliveryDate",
                                                        orderSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOrderSort(
                                                            "totalAmount"
                                                        )
                                                    }
                                                >
                                                    Order Total
                                                    {getSortIndicator(
                                                        orderSortKey,
                                                        "totalAmount",
                                                        orderSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOrderSort(
                                                            "paidAmount"
                                                        )
                                                    }
                                                >
                                                    Paid Amount
                                                    {getSortIndicator(
                                                        orderSortKey,
                                                        "paidAmount",
                                                        orderSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOrderSort(
                                                            "balance"
                                                        )
                                                    }
                                                >
                                                    Outstanding
                                                    {getSortIndicator(
                                                        orderSortKey,
                                                        "balance",
                                                        orderSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOrderSort(
                                                            "paymentStatus"
                                                        )
                                                    }
                                                >
                                                    Payment Status
                                                    {getSortIndicator(
                                                        orderSortKey,
                                                        "paymentStatus",
                                                        orderSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOrderSort(
                                                            "orderStatus"
                                                        )
                                                    }
                                                >
                                                    Order Status
                                                    {getSortIndicator(
                                                        orderSortKey,
                                                        "orderStatus",
                                                        orderSortDirection
                                                    )}
                                                </button>
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {sortedOrders.map(
                                            (order) => (
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
                                                        {formatDate(
                                                            order.orderDate
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            order.expectedDeliveryDate
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            order.totalAmount
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            order.paidAmount
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            order.balance
                                                        )}
                                                    </td>

                                                    <td>
                                                        {
                                                            order.paymentStatus ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            order.orderStatus ||
                                                            "-"
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                        <tr>

                                            <td
                                                colSpan="3"
                                                style={{
                                                    fontWeight:
                                                        700,
                                                    textAlign:
                                                        "right"
                                                }}
                                            >
                                                TOTAL
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                {formatCurrency(
                                                    statementData.totalOrderAmount
                                                )}
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                {formatCurrency(
                                                    statementData.totalPaidAmount
                                                )}
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                {formatCurrency(
                                                    statementData.totalOutstanding
                                                )}
                                            </td>

                                            <td></td>
                                            <td></td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        {/* =============================================
                            PAYMENTS
                        ============================================== */}

                        <div className="card">

                            <div className="card-head">

                                <div className="card-title">
                                    Payments
                                </div>

                            </div>

                            <div
                                style={{
                                    overflowX:
                                        "auto"
                                }}
                            >

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handlePaymentSort(
                                                            "paymentId"
                                                        )
                                                    }
                                                >
                                                    Payment ID
                                                    {getSortIndicator(
                                                        paymentSortKey,
                                                        "paymentId",
                                                        paymentSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handlePaymentSort(
                                                            "statementOrderId"
                                                        )
                                                    }
                                                >
                                                    Order ID
                                                    {getSortIndicator(
                                                        paymentSortKey,
                                                        "statementOrderId",
                                                        paymentSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handlePaymentSort(
                                                            "paymentDate"
                                                        )
                                                    }
                                                >
                                                    Payment Date
                                                    {getSortIndicator(
                                                        paymentSortKey,
                                                        "paymentDate",
                                                        paymentSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handlePaymentSort(
                                                            "paymentMode"
                                                        )
                                                    }
                                                >
                                                    Payment Mode
                                                    {getSortIndicator(
                                                        paymentSortKey,
                                                        "paymentMode",
                                                        paymentSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handlePaymentSort(
                                                            "totalAmountReceived"
                                                        )
                                                    }
                                                >
                                                    Amount
                                                    {getSortIndicator(
                                                        paymentSortKey,
                                                        "totalAmountReceived",
                                                        paymentSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handlePaymentSort(
                                                            "receivedBy"
                                                        )
                                                    }
                                                >
                                                    Received By
                                                    {getSortIndicator(
                                                        paymentSortKey,
                                                        "receivedBy",
                                                        paymentSortDirection
                                                    )}
                                                </button>
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {sortedPayments.map(
                                            (payment) => (
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
                                                            payment.statementOrderId
                                                        }
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            payment.paymentDate
                                                        )}
                                                    </td>

                                                    <td>
                                                        {
                                                            payment.paymentMode ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            payment.totalAmountReceived
                                                        )}
                                                    </td>

                                                    <td>
                                                        {
                                                            payment.receivedBy ||
                                                            "-"
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                        <tr>

                                            <td
                                                colSpan="4"
                                                style={{
                                                    fontWeight:
                                                        700,
                                                    textAlign:
                                                        "right"
                                                }}
                                            >
                                                TOTAL
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                {formatCurrency(
                                                    statementData.totalPayments
                                                )}
                                            </td>

                                            <td></td>

                                        </tr>

                                        <tr>

                                            <td
                                                colSpan="4"
                                                style={{
                                                    fontWeight:
                                                        700,
                                                    textAlign:
                                                        "right"
                                                }}
                                            >
                                                UNALLOCATED
                                                PAYMENTS
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                {formatCurrency(
                                                    statementData.unallocatedAmount
                                                )}
                                            </td>

                                            <td></td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        {/* =============================================
                            PAYMENT ALLOCATIONS
                        ============================================== */}

                        <div className="card">

                            <div className="card-head">

                                <div className="card-title">
                                    Payment Allocations
                                </div>

                            </div>

                            <div
                                style={{
                                    overflowX:
                                        "auto"
                                }}
                            >

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleAllocationSort(
                                                            "paymentAllocationId"
                                                        )
                                                    }
                                                >
                                                    Allocation ID
                                                    {getSortIndicator(
                                                        allocationSortKey,
                                                        "paymentAllocationId",
                                                        allocationSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleAllocationSort(
                                                            "paymentId"
                                                        )
                                                    }
                                                >
                                                    Payment ID
                                                    {getSortIndicator(
                                                        allocationSortKey,
                                                        "paymentId",
                                                        allocationSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleAllocationSort(
                                                            "orderId"
                                                        )
                                                    }
                                                >
                                                    Order ID
                                                    {getSortIndicator(
                                                        allocationSortKey,
                                                        "orderId",
                                                        allocationSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleAllocationSort(
                                                            "allocationDate"
                                                        )
                                                    }
                                                >
                                                    Allocation Date
                                                    {getSortIndicator(
                                                        allocationSortKey,
                                                        "allocationDate",
                                                        allocationSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleAllocationSort(
                                                            "allocatedAmount"
                                                        )
                                                    }
                                                >
                                                    Allocated Amount
                                                    {getSortIndicator(
                                                        allocationSortKey,
                                                        "allocatedAmount",
                                                        allocationSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleAllocationSort(
                                                            "allocationStatus"
                                                        )
                                                    }
                                                >
                                                    Status
                                                    {getSortIndicator(
                                                        allocationSortKey,
                                                        "allocationStatus",
                                                        allocationSortDirection
                                                    )}
                                                </button>
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {sortedAllocations.map(
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
                                                            allocation.allocationStatus
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                        <tr>

                                            <td
                                                colSpan="4"
                                                style={{
                                                    fontWeight:
                                                        700,
                                                    textAlign:
                                                        "right"
                                                }}
                                            >
                                                TOTAL
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                {formatCurrency(
                                                    statementData.totalAllocated
                                                )}
                                            </td>

                                            <td></td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        {/* =============================================
                            OUTSTANDING BALANCE
                        ============================================== */}

                        <div className="card">

                            <div className="card-head">

                                <div className="card-title">
                                    Outstanding Balance
                                </div>

                            </div>

                            <div
                                style={{
                                    overflowX:
                                        "auto"
                                }}
                            >

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOutstandingSort(
                                                            "orderId"
                                                        )
                                                    }
                                                >
                                                    Order ID
                                                    {getSortIndicator(
                                                        outstandingSortKey,
                                                        "orderId",
                                                        outstandingSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOutstandingSort(
                                                            "totalAmount"
                                                        )
                                                    }
                                                >
                                                    Order Total
                                                    {getSortIndicator(
                                                        outstandingSortKey,
                                                        "totalAmount",
                                                        outstandingSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOutstandingSort(
                                                            "paidAmount"
                                                        )
                                                    }
                                                >
                                                    Paid Amount
                                                    {getSortIndicator(
                                                        outstandingSortKey,
                                                        "paidAmount",
                                                        outstandingSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOutstandingSort(
                                                            "balance"
                                                        )
                                                    }
                                                >
                                                    Outstanding
                                                    {getSortIndicator(
                                                        outstandingSortKey,
                                                        "balance",
                                                        outstandingSortDirection
                                                    )}
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    type="button"
                                                    className="table-sort-btn"
                                                    onClick={() =>
                                                        handleOutstandingSort(
                                                            "paymentStatus"
                                                        )
                                                    }
                                                >
                                                    Payment Status
                                                    {getSortIndicator(
                                                        outstandingSortKey,
                                                        "paymentStatus",
                                                        outstandingSortDirection
                                                    )}
                                                </button>
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {sortedOutstanding.map(
                                            (order) => (
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
                                                        {formatCurrency(
                                                            order.totalAmount
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            order.paidAmount
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            order.balance
                                                        )}
                                                    </td>

                                                    <td>
                                                        {
                                                            order.paymentStatus ||
                                                            "-"
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                        <tr>

                                            <td
                                                style={{
                                                    fontWeight:
                                                        700,
                                                    textAlign:
                                                        "right"
                                                }}
                                            >
                                                TOTAL
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                {formatCurrency(
                                                    statementData.totalOrderAmount
                                                )}
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                {formatCurrency(
                                                    statementData.totalPaidAmount
                                                )}
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                {formatCurrency(
                                                    statementData.totalOutstanding
                                                )}
                                            </td>

                                            <td></td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </>
                )}

        </div>
    );
};

export default Statements;
