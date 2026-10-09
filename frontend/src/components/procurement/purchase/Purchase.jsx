import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";

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

import Pagination from "../../../components/ui/Pagination";
import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";

function Purchase() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [suppliers, setSuppliers] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);

    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");

    const [editingPurchase, setEditingPurchase] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");

    const emptyPurchaseItem = {
        purchaseItemId: "",
        rawMaterialId: "",
        quantity: "",
        unit: "",
        unitPrice: "",
        remarks: "",
    };

    const [editForm, setEditForm] = useState({
        supplierId: "",
        purchaseDate: "",
        invoiceDate: "",
        invoiceSequence: "01",
        invoiceNumber: "",
        paymentStatus: "PENDING",
        items: [{ ...emptyPurchaseItem }],
    });

    const [showAddPurchaseModal, setShowAddPurchaseModal] =
        useState(false);

    const [addSaving, setAddSaving] = useState(false);
    const [addError, setAddError] = useState("");
    const [addSuccess, setAddSuccess] = useState("");

    const [addForm, setAddForm] = useState({
        supplierId: "",
        purchaseDate: "",
        invoiceDate: "",
        invoiceSequence: "01",
        invoiceNumber: "",
        paymentStatus: "PENDING",
        items: [{ ...emptyPurchaseItem }],
    });

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deletingPurchaseId, setDeletingPurchaseId] =
        useState(null);
    const [deleteError, setDeleteError] = useState("");

    /* ============================================================
       DATE HELPERS
       ============================================================ */

    const getTodayDate = () => {
        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const formatInvoiceDate = (dateValue) => {
        if (!dateValue) {
            return "";
        }

        const date = new Date(
            `${dateValue}T00:00:00`
        );

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(
            `${dateValue}T00:00:00`
        );

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    const formatDateTime = (dateTimeValue) => {
        if (!dateTimeValue) {
            return "-";
        }

        const date = new Date(dateTimeValue);

        if (Number.isNaN(date.getTime())) {
            return dateTimeValue;
        }

        const datePart =
            date.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }
            );

        const timePart =
            date.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                }
            );

        return `${datePart} ${timePart}`;
    };

    const buildInvoiceNumber = (
        invoiceDate,
        invoiceSequence
    ) => {
        const formattedDate =
            formatInvoiceDate(invoiceDate);

        const sequence = String(
            invoiceSequence || "01"
        ).trim();

        if (!formattedDate) {
            return "";
        }

        return `Purchase/Invoice/${formattedDate}/${sequence}`;
    };

    /*
     * Extract:
     * Purchase/Invoice/08 October 2026/03
     *
     * into:
     * invoiceDate = 2026-10-08
     * invoiceSequence = 03
     */
    const parseInvoiceNumber = (
        invoiceNumber,
        fallbackDate
    ) => {
        const result = {
            invoiceDate:
                fallbackDate || "",
            invoiceSequence: "01",
        };

        if (!invoiceNumber) {
            return result;
        }

        const match =
            invoiceNumber.match(
                /^Purchase\/Invoice\/(.+)\/(\d+)$/
            );

        if (!match) {
            return result;
        }

        result.invoiceSequence =
            match[2] || "01";

        const parsedDate =
            new Date(match[1]);

        if (
            !Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            result.invoiceDate =
                `${parsedDate.getFullYear()}-${String(
                    parsedDate.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    parsedDate.getDate()
                ).padStart(2, "0")}`;
        }

        return result;
    };

    /* ============================================================
       RAW MATERIAL → UNIT
       ============================================================ */

    const getUnitForRawMaterial = (
        rawMaterial
    ) => {
        if (!rawMaterial) {
            return "";
        }

        const rawMaterialName =
            String(
                rawMaterial.materialName || ""
            )
                .trim()
                .toLowerCase();

        const unitMap = {
            cement: "BAG",
            "fly ash": "TON",
            hardner: "LITER",
            jelly: "CUBIC_METER",
            sand: "CUBIC_METER",
            water: "LITER",
        };

        return (
            unitMap[rawMaterialName] || ""
        );
    };

    /* ============================================================
       INTEGER INPUT
       ============================================================ */

    const sanitizeInteger = (value) => {
        return String(value || "").replace(
            /\D/g,
            ""
        );
    };

    /* ============================================================
       TOTAL AMOUNTS
       ============================================================ */

    const calculateItemTotal = (item) => {
        const quantity = Number(
            item?.quantity || 0
        );

        const unitPrice = Number(
            item?.unitPrice || 0
        );

        if (
            Number.isNaN(quantity) ||
            Number.isNaN(unitPrice)
        ) {
            return 0;
        }

        return quantity * unitPrice;
    };

    const calculatePurchaseTotal = (
        items
    ) => {
        if (!Array.isArray(items)) {
            return 0;
        }

        return items.reduce(
            (total, item) =>
                total +
                calculateItemTotal(item),
            0
        );
    };

    /* ============================================================
       DISPLAY HELPERS
       ============================================================ */

    const formatCurrency = (amount) => {
        if (
            amount === null ||
            amount === undefined ||
            amount === ""
        ) {
            return "INR 0.00";
        }

        const numericAmount =
            Number(amount);

        if (
            Number.isNaN(
                numericAmount
            )
        ) {
            return `INR ${amount}`;
        }

        return `INR ${numericAmount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    const formatPaymentStatus = (
        paymentStatus
    ) => {
        if (
            paymentStatus ===
            "PENDING"
        ) {
            return "SKCP-PENDING";
        }

        if (
            paymentStatus ===
            "PAID"
        ) {
            return "SKCP-PAID";
        }

        return paymentStatus || "-";
    };

    const supplierName = (purchase) =>
        purchase?.supplierName ||
        purchase?.supplier?.supplierName ||
        "-";

    const getPurchaseItems = (purchase) => {
        if (
            Array.isArray(
                purchase?.purchaseItems
            )
        ) {
            return purchase.purchaseItems;
        }

        if (
            Array.isArray(
                purchase?.items
            )
        ) {
            return purchase.items;
        }

        return [];
    };

    const getItemMaterialName = (item) =>
        item?.materialName ||
        item?.rawMaterialName ||
        item?.rawMaterial?.materialName ||
        item?.rawMaterial?.rawMaterialName ||
        "-";

    const getItemRawMaterialId = (item) =>
        item?.rawMaterialId ??
        item?.rawMaterial?.rawMaterialId ??
        "";

    /* ============================================================
       FETCH DATA
       ============================================================ */

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet(
                "/api/purchases"
            );

            setPurchases(
                Array.isArray(result?.data)
                    ? result.data
                    : []
            );
        } catch (err) {
            console.error(
                "Error fetching purchases:",
                err
            );

            setError(
                err.message ||
                    "Unable to load purchases. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const result = await apiGet(
                "/api/suppliers"
            );

            setSuppliers(
                Array.isArray(result?.data)
                    ? result.data
                    : []
            );
        } catch (err) {
            console.error(
                "Error fetching suppliers:",
                err
            );
        }
    };

    const fetchRawMaterials = async () => {
        try {
            const result = await apiGet(
                "/api/raw-materials"
            );

            setRawMaterials(
                Array.isArray(result?.data)
                    ? result.data
                    : []
            );
        } catch (err) {
            console.error(
                "Error fetching raw materials:",
                err
            );
        }
    };

    useEffect(() => {
        fetchPurchases();
        fetchSuppliers();
        fetchRawMaterials();
    }, []);

    /* ============================================================
       FILTERING
       ============================================================ */

    const filteredPurchases = useMemo(() => {
        const keyword =
            searchKeyword
                .toLowerCase()
                .trim();

        return purchases.filter(
            (purchase) => {
                const purchaseId =
                    purchase.purchaseId
                        ?.toString()
                        .toLowerCase() ||
                    "";

                const invoiceNumber =
                    purchase.invoiceNumber
                        ?.toLowerCase() ||
                    "";

                const supplier =
                    supplierName(
                        purchase
                    )
                        .toLowerCase();

                const paymentStatus =
                    purchase.paymentStatus
                        ?.toLowerCase() ||
                    "";

                const status =
                    purchase.status
                        ?.toLowerCase() ||
                    "";

                const matchesKeyword =
                    !keyword ||
                    purchaseId.includes(
                        keyword
                    ) ||
                    invoiceNumber.includes(
                        keyword
                    ) ||
                    supplier.includes(
                        keyword
                    ) ||
                    paymentStatus.includes(
                        keyword
                    ) ||
                    status.includes(
                        keyword
                    );

                const purchaseDate =
                    purchase.purchaseDate ||
                    "";

                const matchesFromDate =
                    !fromDate ||
                    purchaseDate >=
                        fromDate;

                const matchesToDate =
                    !toDate ||
                    purchaseDate <=
                        toDate;

                return (
                    matchesKeyword &&
                    matchesFromDate &&
                    matchesToDate
                );
            }
        );
    }, [
        purchases,
        searchKeyword,
        fromDate,
        toDate,
    ]);

    /* ============================================================
       SORTING
       ============================================================ */

    const {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    } = useTableSort(
        filteredPurchases,
        "purchaseId",
        "desc"
    );

    /* ============================================================
       PAGINATION
       ============================================================ */

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

    const getSortIndicator = (key) => {
        if (sortKey !== key) {
            return "";
        }

        return sortDirection === "asc"
            ? " ▲"
            : " ▼";
    };

    const handleClearSearch = () => {
        setSearchKeyword("");
        setFromDate("");
        setToDate("");
    };

    /* ============================================================
       PDF HELPERS — SIMPLE jsPDF ONLY
       ============================================================ */

    const loadLogo = () =>
        new Promise((resolve) => {
            const image =
                new Image();

            image.onload = () =>
                resolve(image);

            image.onerror = () =>
                resolve(null);

            image.src =
                "/assets/skcp-logo.png";
        });

    const addPdfLogo = async (
        doc
    ) => {
        const logo =
            await loadLogo();

        if (!logo) {
            return;
        }

        try {
            doc.addImage(
                logo,
                "PNG",
                14,
                10,
                20,
                20
            );
        } catch (err) {
            console.warn(
                "Unable to add SKCP logo:",
                err
            );
        }
    };

    const pdfText = (
        doc,
        text,
        x,
        y,
        options = {}
    ) => {
        doc.setFontSize(
            options.size || 9
        );

        doc.setFont(
            "helvetica",
            options.bold
                ? "bold"
                : "normal"
        );

        doc.text(
            String(
                text ?? "-"
            ),
            x,
            y
        );
    };

    const drawPdfTable = (
        doc,
        columns,
        rows,
        startY,
        columnWidths
    ) => {
        const pageWidth =
            doc.internal.pageSize
                .getWidth();

        const leftMargin = 14;

        const usableWidth =
            pageWidth -
            leftMargin -
            14;

        const widths =
            columnWidths ||
            columns.map(
                () =>
                    usableWidth /
                    columns.length
            );

        let y = startY;
        const rowHeight = 8;
        const headerHeight = 9;

        const drawHeader = () => {
            let x = leftMargin;

            doc.setFillColor(
                230,
                230,
                230
            );

            doc.rect(
                leftMargin,
                y,
                usableWidth,
                headerHeight,
                "F"
            );

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setFontSize(7);

            columns.forEach(
                (
                    column,
                    index
                ) => {
                    doc.text(
                        String(column),
                        x + 2,
                        y + 6
                    );

                    x += widths[index];
                }
            );

            doc.setDrawColor(
                150,
                150,
                150
            );

            doc.rect(
                leftMargin,
                y,
                usableWidth,
                headerHeight
            );

            x = leftMargin;

            widths.forEach(
                (width) => {
                    doc.line(
                        x,
                        y,
                        x,
                        y +
                            headerHeight
                    );

                    x += width;
                }
            );

            y += headerHeight;
        };

        const drawRow = (row) => {
            if (
                y + rowHeight >
                282
            ) {
                doc.addPage();
                y = 14;
                drawHeader();
            }

            let x = leftMargin;

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setFontSize(7);

            row.forEach(
                (
                    value,
                    index
                ) => {
                    const cellText =
                        String(
                            value ??
                                "-"
                        );

                    doc.text(
                        cellText.substring(
                            0,
                            35
                        ),
                        x + 2,
                        y + 5
                    );

                    x += widths[index];
                }
            );

            doc.rect(
                leftMargin,
                y,
                usableWidth,
                rowHeight
            );

            x = leftMargin;

            widths.forEach(
                (width) => {
                    doc.line(
                        x,
                        y,
                        x,
                        y +
                            rowHeight
                    );

                    x += width;
                }
            );

            y += rowHeight;
        };

        drawHeader();

        rows.forEach(drawRow);

        return y;
    };

    const safePdfFileName = (
        value
    ) => {
        return String(
            value || "Purchase"
        )
            .replace(
                /[<>:"/\\|?*]/g,
                "_"
            )
            .replace(
                /\s+/g,
                "-"
            );
    };

    const getTodayFileDate = () => {
        const today =
            new Date();

        return `${String(
            today.getDate()
        ).padStart(
            2,
            "0"
        )}-${String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        )}-${today.getFullYear()}`;
    };

    /* ============================================================
       PURCHASE LIST PDF
       ============================================================ */

    const handleDownloadPurchaseListPdf =
        async () => {
            try {
                const doc =
                    new jsPDF({
                        orientation:
                            "portrait",
                        unit: "mm",
                        format: "a4",
                    });

                await addPdfLogo(doc);

                pdfText(
                    doc,
                    "SHREE KUNDODARI CEMENT PRODUCTS",
                    46,
                    17,
                    {
                        size: 13,
                        bold: true,
                    }
                );

                pdfText(
                    doc,
                    "SKCP Purchase List",
                    46,
                    24,
                    {
                        size: 11,
                        bold: true,
                    }
                );

                pdfText(
                    doc,
                    `Generated: ${formatDate(
                        getTodayDate()
                    )}`,
                    46,
                    30,
                    {
                        size: 8,
                    }
                );

                let y = 40;

                if (
                    searchKeyword ||
                    fromDate ||
                    toDate
                ) {
                    pdfText(
                        doc,
                        `Filters: ${
                            searchKeyword
                                ? `Search="${searchKeyword}" `
                                : ""
                        }${
                            fromDate
                                ? `From=${formatDate(
                                      fromDate
                                  )} `
                                : ""
                        }${
                            toDate
                                ? `To=${formatDate(
                                      toDate
                                  )}`
                                : ""
                        }`,
                        14,
                        y,
                        {
                            size: 8,
                        }
                    );

                    y += 7;
                }

                const rows =
                    filteredPurchases.map(
                        (purchase) => [
                            purchase.purchaseId ||
                                "-",
                            formatDate(
                                purchase.purchaseDate
                            ),
                            purchase.invoiceNumber ||
                                "-",
                            supplierName(
                                purchase
                            ),
                            formatCurrency(
                                purchase.totalAmount
                            ),
                            formatPaymentStatus(
                                purchase.paymentStatus
                            ),
                            purchase.status ||
                                "-",
                        ]
                    );

                y = drawPdfTable(
                    doc,
                    [
                        "ID",
                        "DATE",
                        "INVOICE",
                        "SUPPLIER",
                        "TOTAL",
                        "PAYMENT",
                        "STATUS",
                    ],
                    rows,
                    y,
                    [
                        7,
                        23,
                        45,
                        35,
                        25,
                        28,
                        20,
                    ]
                );

                pdfText(
                    doc,
                    `Total Records: ${filteredPurchases.length}`,
                    14,
                    y + 8,
                    {
                        size: 9,
                        bold: true,
                    }
                );

                doc.save(
                    `SKCP_Purchase_List_${getTodayFileDate()}.pdf`
                );
            } catch (err) {
                console.error(
                    "Error creating purchase list PDF:",
                    err
                );
            }
        };

    /* ============================================================
       INDIVIDUAL PURCHASE PDF
       ============================================================ */

    const handleDownloadPurchasePdf =
        async (purchase) => {
            if (!purchase) {
                return;
            }

            try {
                const doc =
                    new jsPDF({
                        orientation:
                            "portrait",
                        unit: "mm",
                        format: "a4",
                    });

                await addPdfLogo(doc);

                pdfText(
                    doc,
                    "SHREE KUNDODARI CEMENT PRODUCTS",
                    46,
                    17,
                    {
                        size: 13,
                        bold: true,
                    }
                );

                pdfText(
                    doc,
                    "PURCHASE INVOICE",
                    46,
                    24,
                    {
                        size: 11,
                        bold: true,
                    }
                );

                let y = 43;

                pdfText(
                    doc,
                    "Purchase ID:",
                    14,
                    y,
                    {
                        bold: true,
                    }
                );

                pdfText(
                    doc,
                    purchase.purchaseId ||
                        "-",
                    48,
                    y
                );

                y += 7;

                pdfText(
                    doc,
                    "Purchase Date:",
                    14,
                    y,
                    {
                        bold: true,
                    }
                );

                pdfText(
                    doc,
                    formatDate(
                        purchase.purchaseDate
                    ),
                    48,
                    y
                );

                y += 7;

                pdfText(
                    doc,
                    "Invoice Number:",
                    14,
                    y,
                    {
                        bold: true,
                    }
                );

                pdfText(
                    doc,
                    purchase.invoiceNumber ||
                        "-",
                    48,
                    y
                );

                y += 7;

                pdfText(
                    doc,
                    "Supplier:",
                    14,
                    y,
                    {
                        bold: true,
                    }
                );

                pdfText(
                    doc,
                    supplierName(
                        purchase
                    ),
                    48,
                    y
                );

                y += 7;

                pdfText(
                    doc,
                    "Payment Status:",
                    14,
                    y,
                    {
                        bold: true,
                    }
                );

                pdfText(
                    doc,
                    formatPaymentStatus(
                        purchase.paymentStatus
                    ),
                    48,
                    y
                );

                y += 7;

                pdfText(
                    doc,
                    "Purchase Total:",
                    14,
                    y,
                    {
                        bold: true,
                    }
                );

                pdfText(
                    doc,
                    formatCurrency(
                        purchase.totalAmount ??
                            calculatePurchaseTotal(
                                getPurchaseItems(
                                    purchase
                                )
                            )
                    ),
                    48,
                    y
                );

                y += 12;

                pdfText(
                    doc,
                    "Purchase Items",
                    14,
                    y,
                    {
                        size: 10,
                        bold: true,
                    }
                );

                y += 5;

                const items =
                    getPurchaseItems(
                        purchase
                    );

                const rows =
                    items.map(
                        (item) => [
                            item.purchaseItemId ||
                                "-",
                            getItemMaterialName(
                                item
                            ),
                            item.quantity ??
                                "-",
                            item.unit ||
                                "-",
                            formatCurrency(
                                item.unitPrice
                            ),
                            formatCurrency(
                                item.lineAmount ??
                                    calculateItemTotal(
                                        item
                                    )
                            ),
                        ]
                    );

                y = drawPdfTable(
                    doc,
                    [
                        "ID",
                        "RAW MATERIAL",
                        "QTY",
                        "UNIT",
                        "UNIT PRICE",
                        "TOTAL",
                    ],
                    rows,
                    y,
                    [
                        12,
                        52,
                        18,
                        25,
                        34,
                        35,
                    ]
                );

                y += 8;

                const total =
                    purchase.totalAmount ??
                    calculatePurchaseTotal(
                        items
                    );

                pdfText(
                    doc,
                    "TOTAL AMOUNT",
                    125,
                    y,
                    {
                        size: 10,
                        bold: true,
                    }
                );

                pdfText(
                    doc,
                    formatCurrency(total),
                    166,
                    y,
                    {
                        size: 10,
                        bold: true,
                    }
                );

                y += 12;

                if (
                    purchase.remarks
                ) {
                    pdfText(
                        doc,
                        "Remarks",
                        14,
                        y,
                        {
                            size: 9,
                            bold: true,
                        }
                    );

                    y += 6;

                    pdfText(
                        doc,
                        purchase.remarks,
                        14,
                        y,
                        {
                            size: 8,
                        }
                    );
                }

                const fileInvoice =
                    safePdfFileName(
                        purchase.invoiceNumber ||
                            `Purchase_${purchase.purchaseId}`
                    );

                doc.save(
                    `SKCP_Purchase_Invoice_${fileInvoice}.pdf`
                );
            } catch (err) {
                console.error(
                    "Error creating purchase PDF:",
                    err
                );
            }
        };

    /* ============================================================
       VIEW PURCHASE
       ============================================================ */

    const handleViewPurchase =
        async (purchaseId) => {
            try {
                setViewLoading(true);
                setViewError("");
                setSelectedPurchase(
                    null
                );

                const result =
                    await apiGet(
                        `/api/purchases/${purchaseId}`
                    );

                setSelectedPurchase(
                    result?.data || null
                );
            } catch (err) {
                console.error(
                    "Error fetching purchase details:",
                    err
                );

                setViewError(
                    err.message ||
                        "Unable to load purchase details. Please try again."
                );
            } finally {
                setViewLoading(false);
            }
        };

    const handleClosePurchaseModal =
        () => {
            setSelectedPurchase(
                null
            );
            setViewError("");
            setViewLoading(false);
        };

    /* ============================================================
       EDIT PURCHASE
       ============================================================ */

    const handleEditPurchase =
        async (purchaseId) => {
            try {
                setEditLoading(true);
                setEditError("");
                setEditSuccess("");
                setEditingPurchase(
                    null
                );

                const result =
                    await apiGet(
                        `/api/purchases/${purchaseId}`
                    );

                const purchase =
                    result?.data;

                const invoiceParts =
                    parseInvoiceNumber(
                        purchase?.invoiceNumber,
                        purchase?.purchaseDate ||
                            ""
                    );

                const purchaseItems =
                    getPurchaseItems(
                        purchase
                    );

                const mappedItems =
                    purchaseItems.length >
                    0
                        ? purchaseItems.map(
                              (item) => {
                                  const material =
                                      rawMaterials.find(
                                          (
                                              rawMaterial
                                          ) =>
                                              String(
                                                  rawMaterial.rawMaterialId
                                              ) ===
                                              String(
                                                  getItemRawMaterialId(
                                                      item
                                                  )
                                              )
                                      );

                                  return {
                                      purchaseItemId:
                                          item.purchaseItemId ||
                                          "",
                                      rawMaterialId:
                                          getItemRawMaterialId(
                                              item
                                          ),
                                      quantity:
                                          item.quantity ??
                                          "",
                                      unit:
                                          item.unit ||
                                          getUnitForRawMaterial(
                                              material
                                          ),
                                      unitPrice:
                                          item.unitPrice ??
                                          "",
                                      remarks:
                                          item.remarks ||
                                          "",
                                  };
                              }
                          )
                        : [
                              {
                                  ...emptyPurchaseItem,
                              },
                          ];

                setEditingPurchase(
                    purchase
                );

                setEditForm({
                    supplierId:
                        purchase?.supplierId ??
                        purchase
                            ?.supplier
                            ?.supplierId ??
                        "",
                    purchaseDate:
                        purchase?.purchaseDate ||
                        "",
                    invoiceDate:
                        invoiceParts.invoiceDate ||
                        purchase?.purchaseDate ||
                        "",
                    invoiceSequence:
                        invoiceParts.invoiceSequence ||
                        "01",
                    invoiceNumber:
                        purchase?.invoiceNumber ||
                        "",
                    paymentStatus:
                        purchase?.paymentStatus ||
                        "PENDING",
                    items:
                        mappedItems,
                });
            } catch (err) {
                console.error(
                    "Error loading purchase for edit:",
                    err
                );

                setEditError(
                    err.message ||
                        "Unable to load purchase details. Please try again."
                );
            } finally {
                setEditLoading(false);
            }
        };

    const handleEditChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setEditForm(
            (previousForm) => {
                const updatedForm = {
                    ...previousForm,
                    [name]: value,
                };

                if (
                    name ===
                    "purchaseDate"
                ) {
                    updatedForm.invoiceDate =
                        value;

                    updatedForm.invoiceNumber =
                        buildInvoiceNumber(
                            value,
                            previousForm.invoiceSequence
                        );
                }

                if (
                    name ===
                    "invoiceDate"
                ) {
                    updatedForm.invoiceNumber =
                        buildInvoiceNumber(
                            value,
                            previousForm.invoiceSequence
                        );
                }

                if (
                    name ===
                    "invoiceSequence"
                ) {
                    const sequence =
                        sanitizeInteger(
                            value
                        );

                    updatedForm.invoiceSequence =
                        sequence;

                    updatedForm.invoiceNumber =
                        buildInvoiceNumber(
                            previousForm.invoiceDate,
                            sequence
                        );
                }

                return updatedForm;
            }
        );
    };

    const handleEditItemChange =
        (
            index,
            event
        ) => {
            const {
                name,
                value,
            } = event.target;

            setEditForm(
                (previousForm) => ({
                    ...previousForm,
                    items:
                        previousForm.items.map(
                            (
                                item,
                                itemIndex
                            ) => {
                                if (
                                    itemIndex !==
                                    index
                                ) {
                                    return item;
                                }

                                if (
                                    name ===
                                    "rawMaterialId"
                                ) {
                                    const selectedRawMaterial =
                                        rawMaterials.find(
                                            (
                                                rawMaterial
                                            ) =>
                                                String(
                                                    rawMaterial.rawMaterialId
                                                ) ===
                                                String(
                                                    value
                                                )
                                        );

                                    return {
                                        ...item,
                                        rawMaterialId:
                                            value,
                                        unit:
                                            getUnitForRawMaterial(
                                                selectedRawMaterial
                                            ),
                                    };
                                }

                                if (
                                    name ===
                                    "quantity"
                                ) {
                                    return {
                                        ...item,
                                        quantity:
                                            sanitizeInteger(
                                                value
                                            ),
                                    };
                                }

                                if (
                                    name ===
                                    "unitPrice"
                                ) {
                                    return {
                                        ...item,
                                        unitPrice:
                                            sanitizeInteger(
                                                value
                                            ),
                                    };
                                }

                                return {
                                    ...item,
                                    [name]:
                                        value,
                                };
                            }
                        ),
                })
            );
        };

    const handleEditAddItem =
        () => {
            setEditForm(
                (previousForm) => ({
                    ...previousForm,
                    items: [
                        ...previousForm.items,
                        {
                            ...emptyPurchaseItem,
                        },
                    ],
                })
            );
        };

    const handleEditRemoveItem =
        (index) => {
            setEditForm(
                (previousForm) => {
                    if (
                        previousForm.items
                            .length ===
                        1
                    ) {
                        return previousForm;
                    }

                    return {
                        ...previousForm,
                        items:
                            previousForm.items.filter(
                                (
                                    _,
                                    itemIndex
                                ) =>
                                    itemIndex !==
                                    index
                            ),
                    };
                }
            );
        };

    const handleCloseEditModal =
        () => {
            setEditingPurchase(
                null
            );
            setEditError("");
            setEditSuccess("");
            setEditLoading(false);
            setEditSaving(false);
        };

    const handleUpdatePurchase =
        async (event) => {
            event.preventDefault();

            if (
                !editingPurchase
                    ?.purchaseId
            ) {
                return;
            }

            try {
                setEditSaving(true);
                setEditError("");
                setEditSuccess("");

                const invoiceNumber =
                    buildInvoiceNumber(
                        editForm.invoiceDate ||
                            editForm.purchaseDate,
                        editForm.invoiceSequence
                    );

                const payload = {
                    supplierId:
                        Number(
                            editForm.supplierId
                        ),

                    purchaseDate:
                        editForm.purchaseDate,

                    invoiceNumber:
                        invoiceNumber,

                    paymentStatus:
                        editForm.paymentStatus,

                    items:
                        editForm.items.map(
                            (item) => ({
                                ...(item.purchaseItemId
                                    ? {
                                          purchaseItemId:
                                              Number(
                                                  item.purchaseItemId
                                              ),
                                      }
                                    : {}),
                                rawMaterialId:
                                    Number(
                                        item.rawMaterialId
                                    ),
                                quantity:
                                    Number(
                                        item.quantity
                                    ),
                                unit:
                                    item.unit,
                                unitPrice:
                                    Number(
                                        item.unitPrice
                                    ),
                                remarks:
                                    item.remarks ||
                                    "",
                            })
                        ),
                };

                await apiPut(
                    `/api/purchases/${editingPurchase.purchaseId}`,
                    payload
                );

                setEditSuccess(
                    "Purchase updated successfully."
                );

                await fetchPurchases();

                setTimeout(() => {
                    handleCloseEditModal();
                }, 700);
            } catch (err) {
                console.error(
                    "Error updating purchase:",
                    err
                );

                setEditError(
                    err.message ||
                        "Unable to update purchase. Please try again."
                );
            } finally {
                setEditSaving(false);
            }
        };

    /* ============================================================
       ADD PURCHASE
       ============================================================ */

    const handleOpenAddPurchaseModal =
        () => {
            const today =
                getTodayDate();

            setAddError("");
            setAddSuccess("");

            setAddForm({
                supplierId: "",
                purchaseDate: today,
                invoiceDate: today,
                invoiceSequence: "01",
                invoiceNumber:
                    buildInvoiceNumber(
                        today,
                        "01"
                    ),
                paymentStatus:
                    "PENDING",
                items: [
                    {
                        ...emptyPurchaseItem,
                    },
                ],
            });

            setShowAddPurchaseModal(
                true
            );
        };

    const handleCloseAddPurchaseModal =
        () => {
            if (addSaving) {
                return;
            }

            setShowAddPurchaseModal(
                false
            );
            setAddError("");
            setAddSuccess("");
        };

    const handleAddChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setAddForm(
            (previousForm) => {
                const updatedForm = {
                    ...previousForm,
                    [name]: value,
                };

                if (
                    name ===
                    "purchaseDate"
                ) {
                    updatedForm.invoiceDate =
                        value;

                    updatedForm.invoiceNumber =
                        buildInvoiceNumber(
                            value,
                            previousForm.invoiceSequence
                        );
                }

                if (
                    name ===
                    "invoiceDate"
                ) {
                    updatedForm.invoiceNumber =
                        buildInvoiceNumber(
                            value,
                            previousForm.invoiceSequence
                        );
                }

                if (
                    name ===
                    "invoiceSequence"
                ) {
                    const sequence =
                        sanitizeInteger(
                            value
                        );

                    updatedForm.invoiceSequence =
                        sequence;

                    updatedForm.invoiceNumber =
                        buildInvoiceNumber(
                            previousForm.invoiceDate,
                            sequence
                        );
                }

                return updatedForm;
            }
        );
    };

    const handleAddItem = () => {
        setAddForm(
            (previousForm) => ({
                ...previousForm,
                items: [
                    ...previousForm.items,
                    {
                        ...emptyPurchaseItem,
                    },
                ],
            })
        );
    };

    const handleRemoveItem = (
        index
    ) => {
        setAddForm(
            (previousForm) => {
                if (
                    previousForm.items
                        .length ===
                    1
                ) {
                    return previousForm;
                }

                return {
                    ...previousForm,
                    items:
                        previousForm.items.filter(
                            (
                                _,
                                itemIndex
                            ) =>
                                itemIndex !==
                                index
                        ),
                };
            }
        );
    };

    const handleItemChange = (
        index,
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setAddForm(
            (previousForm) => ({
                ...previousForm,
                items:
                    previousForm.items.map(
                        (
                            item,
                            itemIndex
                        ) => {
                            if (
                                itemIndex !==
                                index
                            ) {
                                return item;
                            }

                            if (
                                name ===
                                "rawMaterialId"
                            ) {
                                const selectedRawMaterial =
                                    rawMaterials.find(
                                        (
                                            rawMaterial
                                        ) =>
                                            String(
                                                rawMaterial.rawMaterialId
                                            ) ===
                                            String(
                                                value
                                            )
                                    );

                                return {
                                    ...item,
                                    rawMaterialId:
                                        value,
                                    unit:
                                        getUnitForRawMaterial(
                                            selectedRawMaterial
                                        ),
                                };
                            }

                            if (
                                name ===
                                "quantity"
                            ) {
                                return {
                                    ...item,
                                    quantity:
                                        sanitizeInteger(
                                            value
                                        ),
                                };
                            }

                            if (
                                name ===
                                "unitPrice"
                            ) {
                                return {
                                    ...item,
                                    unitPrice:
                                        sanitizeInteger(
                                            value
                                        ),
                                };
                            }

                            return {
                                ...item,
                                [name]:
                                    value,
                            };
                        }
                    ),
            })
        );
    };

    const handleCreatePurchase =
        async (event) => {
            event.preventDefault();

            try {
                setAddSaving(true);
                setAddError("");
                setAddSuccess("");

                const invoiceNumber =
                    buildInvoiceNumber(
                        addForm.invoiceDate ||
                            addForm.purchaseDate,
                        addForm.invoiceSequence
                    );

                const payload = {
                    supplierId:
                        Number(
                            addForm.supplierId
                        ),

                    purchaseDate:
                        addForm.purchaseDate,

                    invoiceNumber:
                        invoiceNumber,

                    paymentStatus:
                        addForm.paymentStatus,

                    items:
                        addForm.items.map(
                            (item) => ({
                                rawMaterialId:
                                    Number(
                                        item.rawMaterialId
                                    ),
                                quantity:
                                    Number(
                                        item.quantity
                                    ),
                                unit:
                                    item.unit,
                                unitPrice:
                                    Number(
                                        item.unitPrice
                                    ),
                                remarks:
                                    item.remarks ||
                                    "",
                            })
                        ),
                };

                await apiPost(
                    "/api/purchases",
                    payload
                );

                setAddSuccess(
                    "Purchase created successfully."
                );

                await fetchPurchases();

                setTimeout(() => {
                    setShowAddPurchaseModal(
                        false
                    );
                    setAddSuccess("");
                }, 700);
            } catch (err) {
                console.error(
                    "Error creating purchase:",
                    err
                );

                setAddError(
                    err.message ||
                        "Unable to create purchase. Please try again."
                );
            } finally {
                setAddSaving(false);
            }
        };

    /* ============================================================
       DELETE PURCHASE
       ============================================================ */

    const handleOpenDeleteConfirm =
        (purchase) => {
            setDeleteError("");
            setDeleteTarget(
                purchase
            );
        };

    const handleCloseDeleteConfirm =
        () => {
            if (
                deletingPurchaseId !==
                null
            ) {
                return;
            }

            setDeleteTarget(null);
            setDeleteError("");
        };

        const handleDeletePurchase = async () => {
        if (!deleteTarget?.purchaseId) {
            return;
        }

        try {
            setDeletingPurchaseId(
                deleteTarget.purchaseId
            );

            setDeleteError("");

            await apiDelete(
                `/api/purchases/${deleteTarget.purchaseId}`
            );

            setPurchases(
                (previousPurchases) =>
                    previousPurchases.map(
                        (purchase) =>
                            purchase.purchaseId ===
                            deleteTarget.purchaseId
                                ? {
                                    ...purchase,
                                    status: "INACTIVE",
                                }
                                : purchase
                    )
            );

            setDeleteTarget(null);
        } catch (err) {
            console.error(
                "Error deleting purchase:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete purchase. Please try again."
            );
        } finally {
            setDeletingPurchaseId(null);
        }
    };
    /* ============================================================
       LOADING
       ============================================================ */

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <h2>
                        Purchases
                    </h2>

                    <p>
                        Loading purchase
                        records...
                    </p>
                </section>
            </div>
        );
    }

    /* ============================================================
       RENDER
       ============================================================ */

    return (
        <div className="page">
            <section className="card">
                <div
                    style={{
                        display:
                            "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        gap: "16px",
                        flexWrap:
                            "wrap",
                    }}
                >
                    <div>
                        <h2>
                            Purchases
                        </h2>

                        <p>
                            Manage purchase
                            information and
                            records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            handleOpenAddPurchaseModal
                        }
                    >
                        Add Purchase
                    </button>
                </div>

                {/* SEARCH / FILTERS */}

                <div
                    style={{
                        display:
                            "flex",
                        alignItems:
                            "flex-end",
                        gap: "16px",
                        flexWrap:
                            "wrap",
                        marginTop:
                            "16px",
                    }}
                >
                    <div
                        className="fld"
                        style={{
                            width: "360px",
                            maxWidth:
                                "100%",
                        }}
                    >
                        <label htmlFor="purchase-search">
                            Search Purchases
                        </label>

                        <input
                            id="purchase-search"
                            type="text"
                            placeholder="Search by invoice number or supplier name..."
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
                            width: "180px",
                        }}
                    >
                        <label htmlFor="purchase-from-date">
                            From Date
                        </label>

                        <input
                            id="purchase-from-date"
                            type="date"
                            value={
                                fromDate
                            }
                            onChange={(
                                event
                            ) =>
                                setFromDate(
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
                            width: "180px",
                        }}
                    >
                        <label htmlFor="purchase-to-date">
                            To Date
                        </label>

                        <input
                            id="purchase-to-date"
                            type="date"
                            value={
                                toDate
                            }
                            onChange={(
                                event
                            ) =>
                                setToDate(
                                    event
                                        .target
                                        .value
                                )
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={
                            handleClearSearch
                        }
                        disabled={
                            !searchKeyword &&
                            !fromDate &&
                            !toDate
                        }
                    >
                        Clear
                    </button>

                    <button
                        type="button"
                        className="btn"
                        onClick={
                            handleDownloadPurchaseListPdf
                        }
                    >
                        Download PDF
                    </button>
                </div>
            </section>

            {/* PURCHASE LIST */}

            <section className="card">
                <h2>
                    Purchase List
                </h2>

                <p>
                    {totalRecords} purchase
                    {totalRecords ===
                    1
                        ? ""
                        : "s"}
                </p>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {deleteError && (
                    <div
                        className="form-error"
                        style={{
                            marginTop:
                                "12px",
                        }}
                    >
                        {deleteError}
                    </div>
                )}

                {totalRecords ===
                0 ? (
                    <p>
                        No purchase
                        records found.
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
                                                    "purchaseId"
                                                )
                                            }
                                        >
                                            ID
                                            {getSortIndicator(
                                                "purchaseId"
                                            )}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "purchaseDate"
                                                )
                                            }
                                        >
                                            DATE
                                            {getSortIndicator(
                                                "purchaseDate"
                                            )}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "invoiceNumber"
                                                )
                                            }
                                        >
                                            INVOICE
                                            {getSortIndicator(
                                                "invoiceNumber"
                                            )}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "supplierName"
                                                )
                                            }
                                        >
                                            SUPPLIER
                                            {getSortIndicator(
                                                "supplierName"
                                            )}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "totalAmount"
                                                )
                                            }
                                        >
                                            TOTAL AMOUNT
                                            {getSortIndicator(
                                                "totalAmount"
                                            )}
                                        </button>
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
                                            PAYMENT STATUS
                                            {getSortIndicator(
                                                "paymentStatus"
                                            )}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "status"
                                                )
                                            }
                                        >
                                            STATUS
                                            {getSortIndicator(
                                                "status"
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
                                        purchase
                                    ) => (
                                        <tr
                                            key={
                                                purchase.purchaseId
                                            }
                                        >
                                            <td>
                                                {
                                                    purchase.purchaseId
                                                }
                                            </td>

                                            <td>
                                                {formatDate(
                                                    purchase.purchaseDate
                                                )}
                                            </td>

                                            <td>
                                                <strong>
                                                    {purchase.invoiceNumber ||
                                                        "-"}
                                                </strong>
                                            </td>

                                            <td>
                                                {supplierName(
                                                    purchase
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    purchase.totalAmount
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        purchase.paymentStatus ===
                                                        "PAID"
                                                            ? "badge bg"
                                                            : "badge br"
                                                    }
                                                >
                                                    {formatPaymentStatus(
                                                        purchase.paymentStatus
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        purchase.status ===
                                                        "ACTIVE"
                                                            ? "badge bg"
                                                            : "badge br"
                                                    }
                                                >
                                                    {purchase.status ||
                                                        "-"}
                                                </span>
                                            </td>

                                            <td>
                                                <div
                                                    className="action-buttons"
                                                    style={{
                                                        display:
                                                            "flex",
                                                        gap:
                                                            "6px",
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        className="action-btn view-btn"
                                                        onClick={() =>
                                                            handleViewPurchase(
                                                                purchase.purchaseId
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn edit-btn"
                                                        onClick={() =>
                                                            handleEditPurchase(
                                                                purchase.purchaseId
                                                            )
                                                        }
                                                        disabled={
                                                            deletingPurchaseId ===
                                                            purchase.purchaseId
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    {purchase.status === "ACTIVE" && (
                                                    <button
                                                        type="button"
                                                        className="action-btn delete-btn"
                                                        onClick={() =>
                                                            handleOpenDeleteConfirm(
                                                                purchase
                                                            )
                                                        }
                                                        disabled={
                                                            deletingPurchaseId ===
                                                            purchase.purchaseId
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                )}
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

            {/* =====================================================
                VIEW PURCHASE
                ===================================================== */}

            <ViewModal
                isOpen={
                    viewLoading ||
                    Boolean(
                        viewError
                    ) ||
                    Boolean(
                        selectedPurchase
                    )
                }
                onClose={
                    handleClosePurchaseModal
                }
                title="Purchase Details"
                subtitle="View purchase information"
                loading={
                    viewLoading
                }
                error={
                    viewError
                }
                size="lg"
                footer={
                    <>
                        {selectedPurchase && (
                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    handleDownloadPurchasePdf(
                                        selectedPurchase
                                    )
                                }
                            >
                                Download PDF
                            </button>
                        )}

                        <button
                            type="button"
                            className="btn secondary"
                            onClick={
                                handleClosePurchaseModal
                            }
                        >
                            Close
                        </button>
                    </>
                }
            >
                {selectedPurchase && (
                    <>
                        <div className="modal-section-title">
                            Basic Information
                        </div>

                        <DetailGrid>
                            <DetailItem
                                label="Purchase ID"
                                value={
                                    selectedPurchase.purchaseId
                                }
                            />

                            <DetailItem
                                label="Purchase Date"
                                value={formatDate(
                                    selectedPurchase.purchaseDate
                                )}
                            />

                            <DetailItem
                                label="Invoice Number"
                                value={
                                    selectedPurchase.invoiceNumber ||
                                    "-"
                                }
                            />

                            <DetailItem
                                label="Supplier"
                                value={supplierName(
                                    selectedPurchase
                                )}
                            />

                            <DetailItem
                                label="Payment Status"
                                value={
                                    <span
                                        className={
                                            selectedPurchase.paymentStatus ===
                                            "PAID"
                                                ? "badge bg"
                                                : "badge br"
                                        }
                                    >
                                        {formatPaymentStatus(
                                            selectedPurchase.paymentStatus
                                        )}
                                    </span>
                                }
                            />

                            <DetailItem
                                label="Status"
                                value={
                                    <span
                                        className={
                                            selectedPurchase.status ===
                                            "ACTIVE"
                                                ? "badge bg"
                                                : "badge br"
                                        }
                                    >
                                        {selectedPurchase.status ||
                                            "-"}
                                    </span>
                                }
                            />

                            <DetailItem
                                label="Total Amount"
                                value={formatCurrency(
                                    selectedPurchase.totalAmount ??
                                        calculatePurchaseTotal(
                                            getPurchaseItems(
                                                selectedPurchase
                                            )
                                        )
                                )}
                            />
                        </DetailGrid>

                        <div className="modal-section-title">
                            Purchase Items
                        </div>

                        {getPurchaseItems(
                            selectedPurchase
                        ).length > 0 ? (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                ID
                                            </th>

                                            <th>
                                                RAW MATERIAL
                                            </th>

                                            <th>
                                                QUANTITY
                                            </th>

                                            <th>
                                                UNIT
                                            </th>

                                            <th>
                                                UNIT PRICE
                                            </th>

                                            <th>
                                                LINE AMOUNT
                                            </th>

                                            <th>
                                                REMARKS
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {getPurchaseItems(
                                            selectedPurchase
                                        ).map(
                                            (
                                                item
                                            ) => (
                                                <tr
                                                    key={
                                                        item.purchaseItemId ||
                                                        `${getItemRawMaterialId(
                                                            item
                                                        )}-${item.quantity}`
                                                    }
                                                >
                                                    <td>
                                                        {item.purchaseItemId ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {getItemMaterialName(
                                                                item
                                                            )}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {item.quantity ??
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {item.unit ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            item.unitPrice
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            item.lineAmount ??
                                                                calculateItemTotal(
                                                                    item
                                                                )
                                                        )}
                                                    </td>

                                                    <td>
                                                        {item.remarks ||
                                                            "-"}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>
                                    No purchase
                                    items
                                    found.
                                </p>
                            </div>
                        )}

                        <div className="modal-section-title">
                            System Information
                        </div>

                        <DetailGrid>
                            <DetailItem
                                label="Created At"
                                value={formatDateTime(
                                    selectedPurchase.createdAt
                                )}
                            />
                        </DetailGrid>
                    </>
                )}
            </ViewModal>

            {/* =====================================================
                EDIT PURCHASE
                ===================================================== */}

            <FormModal
                isOpen={
                    editLoading ||
                    Boolean(
                        editError
                    ) ||
                    Boolean(
                        editingPurchase
                    )
                }
                onClose={
                    handleCloseEditModal
                }
                title="Edit Purchase"
                subtitle="Update purchase information"
                onSubmit={
                    handleUpdatePurchase
                }
                submitLabel="Save Changes"
                cancelLabel="Cancel"
                saving={
                    editSaving
                }
                error={
                    editError
                }
                success={
                    editSuccess
                }
                size="lg"
            >
                {editLoading ? (
                    <div className="empty-state">
                        <p>
                            Loading purchase
                            details...
                        </p>
                    </div>
                ) : editingPurchase ? (
                    <>
                        <div className="modal-section-title">
                            Purchase Information
                        </div>

                        <div className="form-grid">
                            <div className="fld">
                                <label>
                                    Supplier
                                </label>

                                <select
                                    name="supplierId"
                                    value={
                                        editForm.supplierId
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                >
                                    <option value="">
                                        Select Supplier
                                    </option>

                                    {suppliers.map(
                                        (
                                            supplier
                                        ) => (
                                            <option
                                                key={
                                                    supplier.supplierId
                                                }
                                                value={
                                                    supplier.supplierId
                                                }
                                            >
                                                {supplier.supplierName ||
                                                    supplier.name ||
                                                    `Supplier ${supplier.supplierId}`}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="fld">
                                <label>
                                    Purchase Date
                                </label>

                                <input
                                    name="purchaseDate"
                                    type="date"
                                    value={
                                        editForm.purchaseDate
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                />
                            </div>

                            <div className="fld">
                                <label>
                                    Invoice Date
                                </label>

                                <input
                                    name="invoiceDate"
                                    type="date"
                                    value={
                                        editForm.invoiceDate
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                />
                            </div>

                            <div className="fld">
                                <label>
                                    Invoice Sequence
                                </label>

                                <input
                                    name="invoiceSequence"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={
                                        editForm.invoiceSequence
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                />
                            </div>

                            <div className="fld f-full">
                                <label>
                                    Invoice Number
                                </label>

                                <input
                                    type="text"
                                    value={
                                        editForm.invoiceNumber
                                    }
                                    readOnly
                                />
                            </div>

                            <div className="fld">
                                <label>
                                    Payment Status
                                </label>

                                <select
                                    name="paymentStatus"
                                    value={
                                        editForm.paymentStatus
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                >
                                    <option value="PENDING">
                                        SKCP-PENDING
                                    </option>

                                    <option value="PAID">
                                        SKCP-PAID
                                    </option>
                                </select>
                            </div>

                            <div className="fld">
                                <label>
                                    Total Amount
                                </label>

                                <input
                                    type="text"
                                    value={formatCurrency(
                                        calculatePurchaseTotal(
                                            editForm.items
                                        )
                                    )}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="modal-section-title">
                            Purchase Items
                        </div>

                        {editForm.items.map(
                            (
                                item,
                                index
                            ) => (
                                <div
                                    key={
                                        item.purchaseItemId ||
                                        index
                                    }
                                    className="card"
                                    style={{
                                        marginBottom:
                                            "12px",
                                        padding:
                                            "16px",
                                    }}
                                >
                                    <div className="form-grid">
                                        <div className="fld">
                                            <label>
                                                Raw Material
                                            </label>

                                            <select
                                                name="rawMaterialId"
                                                value={
                                                    item.rawMaterialId
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleEditItemChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Select Raw Material
                                                </option>

                                                {rawMaterials.map(
                                                    (
                                                        rawMaterial
                                                    ) => (
                                                        <option
                                                            key={
                                                                rawMaterial.rawMaterialId
                                                            }
                                                            value={
                                                                rawMaterial.rawMaterialId
                                                            }
                                                        >
                                                            {
                                                                rawMaterial.rawMaterialId
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                rawMaterial.materialName
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div className="fld">
                                            <label>
                                                Quantity
                                            </label>

                                            <input
                                                name="quantity"
                                                type="number"
                                                step="1"
                                                min="0"
                                                inputMode="numeric"
                                                value={
                                                    item.quantity
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleEditItemChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="fld">
                                            <label>
                                                Unit
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    item.unit
                                                }
                                                readOnly
                                            />
                                        </div>

                                        <div className="fld">
                                            <label>
                                                Unit Price
                                            </label>

                                            <input
                                                name="unitPrice"
                                                type="number"
                                                step="1"
                                                min="0"
                                                inputMode="numeric"
                                                value={
                                                    item.unitPrice
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleEditItemChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="fld">
                                            <label>
                                                Total Amount
                                            </label>

                                            <input
                                                type="text"
                                                value={formatCurrency(
                                                    calculateItemTotal(
                                                        item
                                                    )
                                                )}
                                                readOnly
                                            />
                                        </div>

                                        <div className="fld f-full">
                                            <label>
                                                Remarks
                                            </label>

                                            <textarea
                                                name="remarks"
                                                value={
                                                    item.remarks
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleEditItemChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                rows="2"
                                            />
                                        </div>
                                    </div>

                                    {editForm.items
                                        .length >
                                        1 && (
                                        <button
                                            type="button"
                                            className="btn sm"
                                            onClick={() =>
                                                handleEditRemoveItem(
                                                    index
                                                )
                                            }
                                            disabled={
                                                editSaving
                                            }
                                        >
                                            Remove Item
                                        </button>
                                    )}
                                </div>
                            )
                        )}

                        <button
                            type="button"
                            className="btn"
                            onClick={
                                handleEditAddItem
                            }
                            disabled={
                                editSaving
                            }
                        >
                            Add Item
                        </button>
                    </>
                ) : null}
            </FormModal>

            {/* =====================================================
                ADD PURCHASE
                ===================================================== */}

            <FormModal
                isOpen={
                    showAddPurchaseModal
                }
                onClose={
                    handleCloseAddPurchaseModal
                }
                title="Add Purchase"
                subtitle="Enter purchase information"
                onSubmit={
                    handleCreatePurchase
                }
                submitLabel="Add Purchase"
                cancelLabel="Cancel"
                saving={
                    addSaving
                }
                error={
                    addError
                }
                success={
                    addSuccess
                }
                size="lg"
            >
                <div className="modal-section-title">
                    Purchase Information
                </div>

                <div className="form-grid">
                    <div className="fld">
                        <label>
                            Supplier
                        </label>

                        <select
                            name="supplierId"
                            value={
                                addForm.supplierId
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        >
                            <option value="">
                                Select Supplier
                            </option>

                            {suppliers
                                .filter(
                                    (
                                        supplier
                                    ) =>
                                        supplier.status ===
                                        "ACTIVE"
                                )
                                .map(
                                    (
                                        supplier
                                    ) => (
                                        <option
                                            key={
                                                supplier.supplierId
                                            }
                                            value={
                                                supplier.supplierId
                                            }
                                        >
                                            {supplier.supplierName ||
                                                supplier.name ||
                                                `Supplier ${supplier.supplierId}`}
                                        </option>
                                    )
                                )}
                        </select>
                    </div>

                    <div className="fld">
                        <label>
                            Purchase Date
                        </label>

                        <input
                            name="purchaseDate"
                            type="date"
                            value={
                                addForm.purchaseDate
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        />
                    </div>

                    <div className="fld">
                        <label>
                            Invoice Date
                        </label>

                        <input
                            name="invoiceDate"
                            type="date"
                            value={
                                addForm.invoiceDate
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        />
                    </div>

                    <div className="fld">
                        <label>
                            Invoice Sequence
                        </label>

                        <input
                            name="invoiceSequence"
                            type="number"
                            min="1"
                            step="1"
                            value={
                                addForm.invoiceSequence
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        />
                    </div>

                    <div className="fld f-full">
                        <label>
                            Invoice Number
                        </label>

                        <input
                            type="text"
                            value={
                                addForm.invoiceNumber
                            }
                            readOnly
                        />
                    </div>

                    <div className="fld">
                        <label>
                            Payment Status
                        </label>

                        <select
                            name="paymentStatus"
                            value={
                                addForm.paymentStatus
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        >
                            <option value="PENDING">
                                SKCP-PENDING
                            </option>

                            <option value="PAID">
                                SKCP-PAID
                            </option>
                        </select>
                    </div>

                    <div className="fld">
                        <label>
                            Total Amount
                        </label>

                        <input
                            type="text"
                            value={formatCurrency(
                                calculatePurchaseTotal(
                                    addForm.items
                                )
                            )}
                            readOnly
                        />
                    </div>
                </div>

                <div className="modal-section-title">
                    Purchase Items
                </div>

                {addForm.items.map(
                    (
                        item,
                        index
                    ) => (
                        <div
                            key={index}
                            className="card"
                            style={{
                                marginBottom:
                                    "12px",
                                padding:
                                    "16px",
                            }}
                        >
                            <div className="form-grid">
                                <div className="fld">
                                    <label>
                                        Raw Material
                                    </label>

                                    <select
                                        name="rawMaterialId"
                                        value={
                                            item.rawMaterialId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleItemChange(
                                                index,
                                                event
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Raw Material
                                        </option>

                                        {rawMaterials.map(
                                            (
                                                rawMaterial
                                            ) => (
                                                <option
                                                    key={
                                                        rawMaterial.rawMaterialId
                                                    }
                                                    value={
                                                        rawMaterial.rawMaterialId
                                                    }
                                                >
                                                    {
                                                        rawMaterial.rawMaterialId
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        rawMaterial.materialName
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="fld">
                                    <label>
                                        Quantity
                                    </label>

                                    <input
                                        name="quantity"
                                        type="number"
                                        step="1"
                                        min="0"
                                        inputMode="numeric"
                                        value={
                                            item.quantity
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleItemChange(
                                                index,
                                                event
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="fld">
                                    <label>
                                        Unit
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            item.unit
                                        }
                                        readOnly
                                    />
                                </div>

                                <div className="fld">
                                    <label>
                                        Unit Price
                                    </label>

                                    <input
                                        name="unitPrice"
                                        type="number"
                                        step="1"
                                        min="0"
                                        inputMode="numeric"
                                        value={
                                            item.unitPrice
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleItemChange(
                                                index,
                                                event
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="fld">
                                    <label>
                                        Total Amount
                                    </label>

                                    <input
                                        type="text"
                                        value={formatCurrency(
                                            calculateItemTotal(
                                                item
                                            )
                                        )}
                                        readOnly
                                    />
                                </div>

                                <div className="fld f-full">
                                    <label>
                                        Remarks
                                    </label>

                                    <textarea
                                        name="remarks"
                                        value={
                                            item.remarks
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleItemChange(
                                                index,
                                                event
                                            )
                                        }
                                        rows="2"
                                    />
                                </div>
                            </div>

                            {addForm.items
                                .length >
                                1 && (
                                <button
                                    type="button"
                                    className="btn sm"
                                    onClick={() =>
                                        handleRemoveItem(
                                            index
                                        )
                                    }
                                    disabled={
                                        addSaving
                                    }
                                >
                                    Remove Item
                                </button>
                            )}
                        </div>
                    )
                )}

                <button
                    type="button"
                    className="btn"
                    onClick={
                        handleAddItem
                    }
                    disabled={
                        addSaving
                    }
                >
                    Add Item
                </button>
            </FormModal>

            {/* =====================================================
                DELETE
                ===================================================== */}

            <DeleteConfirmModal
                isOpen={Boolean(
                    deleteTarget
                )}
                onClose={
                    handleCloseDeleteConfirm
                }
                onConfirm={
                    handleDeletePurchase
                }
                title="Delete Purchase"
                subtitle="Confirm purchase deactivation"
                message="Are you sure you want to delete this purchase?"
                itemName={
                    deleteTarget?.invoiceNumber ||
                    `Purchase #${
                        deleteTarget?.purchaseId ||
                        ""
                    }`
                }
                confirming={
                    deletingPurchaseId !==
                    null
                }
                error={
                    deleteError
                }
            />
        </div>
    );
}

export default Purchase;