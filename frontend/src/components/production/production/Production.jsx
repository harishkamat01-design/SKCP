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

import Pagination from "../../../components/ui/Pagination";
import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";
import "./Production.css";

import { jsPDF } from "jspdf";

function Production() {
    // ============================================================
    // STATE
    // ============================================================

    const [searchKeyword, setSearchKeyword] = useState("");

    const [productionSizeFilter, setProductionSizeFilter] =
        useState("");

    const [productionDateFrom, setProductionDateFrom] =
        useState("");

    const [productionDateTo, setProductionDateTo] =
        useState("");

    const [dateFilterError, setDateFilterError] =
        useState("");

    const [productions, setProductions] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================================
    // VIEW MODAL
    // ============================================================

    const [selectedProduction, setSelectedProduction] =
        useState(null);

    // ============================================================
    // EDIT MODAL
    // ============================================================

    const [editingProduction, setEditingProduction] =
        useState(null);

    const [editForm, setEditForm] = useState({
        productionDate: "",
        size: "",
        assetId: "",
        quantityProduced: "",
        morningCementBags: "",
        afternoonCementBags: "",
        remarks: "",
    });

    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");

    // ============================================================
    // ADD PRODUCTION MODAL
    // ============================================================

    const [showAddModal, setShowAddModal] = useState(false);

    const [addForm, setAddForm] = useState({
        productionDate: "",
        size: "",
        assetId: "",
        quantityProduced: "",
        morningCementBags: "",
        afternoonCementBags: "",
        remarks: "",
    });

    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");

    // ============================================================
    // DELETE MODAL
    // ============================================================

    const [deletingProduction, setDeletingProduction] =
        useState(null);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchProductions();
        fetchProducts();
    }, []);

    // ============================================================
    // FETCH PRODUCTIONS
    // ============================================================

    const fetchProductions = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet(
                "/api/productions"
            );

            console.log(
                "Production API response:",
                result
            );

            setProductions(
                Array.isArray(result?.data)
                    ? result.data
                    : []
            );
        } catch (err) {
            console.error(
                "Error fetching productions:",
                err
            );

            setError(
                err.message ||
                    "Unable to load production records. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // FETCH PRODUCT MASTER
    // ============================================================

    const fetchProducts = async () => {
        try {
            const result = await apiGet(
                "/api/products"
            );

            const productList =
                Array.isArray(result?.data)
                    ? result.data
                    : [];

            setProducts(productList);
        } catch (err) {
            console.error(
                "Error fetching products:",
                err
            );

            setError(
                err.message ||
                    "Unable to load product master records."
            );
        }
    };

    // ============================================================
    // SIZE OPTIONS
    // ============================================================

    const sizeOptions = useMemo(
        () => [
            {
                size: "4-inch",
                dimension: "8 × 4 × 16",
                displayName:
                    "4-inch Block — 8 × 4 × 16",
            },
            {
                size: "6-inch",
                dimension: "8 × 6 × 16",
                displayName:
                    "6-inch Block — 8 × 6 × 16",
            },
            {
                size: "8-inch",
                dimension: "8 × 8 × 16",
                displayName:
                    "8-inch Block — 8 × 8 × 16",
            },
            {
                size: "1 foot",
                dimension: "8 × 6 × 12",
                displayName:
                    "1 foot Block — 8 × 6 × 12",
            },
        ],
        []
    );

    // ============================================================
    // FILTER + SEARCH
    // ============================================================

    const filteredProductions = useMemo(() => {
        const keyword =
            searchKeyword.toLowerCase().trim();

        const selectedSize =
            productionSizeFilter
                .toLowerCase()
                .trim();

        return productions.filter(
            (production) => {
                const productionId =
                    String(
                        production.productionId || ""
                    ).toLowerCase();

                const productionDate =
                    String(
                        production.productionDate || ""
                    );

                const productName =
                    String(
                        production.productName || ""
                    ).toLowerCase();

                const productSize =
                    String(
                        production.productSize || ""
                    ).toLowerCase();

                const assetName =
                    String(
                        production.assetName || ""
                    ).toLowerCase();

                const status =
                    String(
                        production.status || ""
                    ).toLowerCase();

                const matchesSearch =
                    !keyword ||
                    productionId.includes(
                        keyword
                    ) ||
                    productionDate
                        .toLowerCase()
                        .includes(keyword) ||
                    productName.includes(
                        keyword
                    ) ||
                    productSize.includes(
                        keyword
                    ) ||
                    assetName.includes(
                        keyword
                    ) ||
                    status.includes(
                        keyword
                    );

                const matchesSize =
                    !selectedSize ||
                    productSize === selectedSize;

                const matchesFromDate =
                    !productionDateFrom ||
                    productionDate >=
                        productionDateFrom;

                const matchesToDate =
                    !productionDateTo ||
                    productionDate <=
                        productionDateTo;

                return (
                    matchesSearch &&
                    matchesSize &&
                    matchesFromDate &&
                    matchesToDate
                );
            }
        );
    }, [
        productions,
        searchKeyword,
        productionSizeFilter,
        productionDateFrom,
        productionDateTo,
    ]);

    // ============================================================
    // FILTERED TOTALS
    // ============================================================

    const totalQuantity = useMemo(() => {
        return filteredProductions.reduce(
            (total, production) =>
                total +
                Number(
                    production.quantityProduced || 0
                ),
            0
        );
    }, [filteredProductions]);

    const totalCementBags = useMemo(() => {
        return filteredProductions.reduce(
            (total, production) =>
                total +
                Number(
                    production.totalCementBags || 0
                ),
            0
        );
    }, [filteredProductions]);

    // ============================================================
    // SORTING
    // ============================================================

    const {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    } = useTableSort(
        filteredProductions,
        "productionId",
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
    // DATE FILTER HANDLERS
    // ============================================================

    const handleProductionDateFromChange = (
        event
    ) => {
        const value = event.target.value;

        setProductionDateFrom(value);
        setDateFilterError("");

        if (
            value &&
            productionDateTo &&
            value > productionDateTo
        ) {
            setDateFilterError(
                "Production Date From cannot be later than Production Date To."
            );
        }
    };

    const handleProductionDateToChange = (
        event
    ) => {
        const value = event.target.value;

        setProductionDateTo(value);
        setDateFilterError("");

        if (
            productionDateFrom &&
            value &&
            productionDateFrom > value
        ) {
            setDateFilterError(
                "Production Date To cannot be earlier than Production Date From."
            );
        }
    };

    const handleClearFilters = () => {
        setSearchKeyword("");
        setProductionSizeFilter("");
        setProductionDateFrom("");
        setProductionDateTo("");
        setDateFilterError("");
    };

    // ============================================================
    // SORT INDICATOR
    // ============================================================

    const getSortIndicator = (key) => {
        if (sortKey !== key) {
            return "";
        }

        return sortDirection === "asc"
            ? " ▲"
            : " ▼";
    };

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

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return dateValue;
        }

        return date.toLocaleDateString(
            "en-GB"
        );
    };

    // ============================================================
    // FORMAT DATE TIME
    // ============================================================

    const formatDateTime = (
        dateTimeValue
    ) => {
        if (!dateTimeValue) {
            return "-";
        }

        const date = new Date(
            dateTimeValue
        );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return dateTimeValue;
        }

        const datePart =
            date.toLocaleDateString(
                "en-GB"
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

        return `₹ ${Number(
            amount
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    // ============================================================
    // PDF HELPERS
    // ============================================================

    const formatPdfCurrency = (amount) =>
        `INR ${Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;

    const safePdfText = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        return String(value);
    };

    const drawPdfTitle = (
        doc,
        title,
        subtitle
    ) => {
        const pageWidth =
            doc.internal.pageSize.getWidth();

        doc.setFontSize(18);
        doc.setFont(undefined, "bold");

        doc.text(
            title,
            pageWidth / 2,
            22,
            {
                align: "center",
            }
        );

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");

        doc.text(
            subtitle,
            pageWidth / 2,
            30,
            {
                align: "center",
            }
        );

        doc.line(
            14,
            35,
            pageWidth - 14,
            35
        );
    };

    const drawPdfTableHeader = (
        doc,
        columns,
        y
    ) => {
        let x = 14;

        doc.setFontSize(8);
        doc.setFont(undefined, "bold");

        columns.forEach(
            (column) => {
                doc.text(
                    column.label,
                    x,
                    y
                );

                x += column.width;
            }
        );

        doc.line(
            14,
            y + 2,
            196,
            y + 2
        );

        doc.setFont(undefined, "normal");
    };

    // ============================================================
    // DOWNLOAD PRODUCTION LIST PDF
    // ============================================================

    const handleDownloadProductionListPdf =
        () => {
            if (productionDateFrom && productionDateTo) {
                if (
                    productionDateFrom >
                    productionDateTo
                ) {
                    setDateFilterError(
                        "Production Date From cannot be later than Production Date To."
                    );
                    return;
                }
            }

            const doc = new jsPDF(
                "p",
                "mm",
                "a4"
            );

            const logoUrl =
                "/assets/skcp-logo.png";

            try {
                doc.addImage(
                    logoUrl,
                    "PNG",
                    14,
                    10,
                    22,
                    22
                );
            } catch (error) {
                console.warn(
                    "Production PDF logo could not be loaded:",
                    error
                );
            }

            drawPdfTitle(
                doc,
                "SKCP Production List",
                `Generated on ${new Date().toLocaleDateString(
                    "en-GB"
                )}`
            );

            let y = 45;

            doc.setFontSize(9);
            doc.setFont(undefined, "normal");

            if (productionSizeFilter) {
                const selectedSize =
                    sizeOptions.find(
                        (option) =>
                            option.size ===
                            productionSizeFilter
                    );

                doc.text(
                    `Size: ${selectedSize?.displayName || productionSizeFilter}`,
                    14,
                    y
                );

                y += 5;
            }

            if (productionDateFrom) {
                doc.text(
                    `From Date: ${formatDate(
                        productionDateFrom
                    )}`,
                    14,
                    y
                );

                y += 5;
            }

            if (productionDateTo) {
                doc.text(
                    `To Date: ${formatDate(
                        productionDateTo
                    )}`,
                    14,
                    y
                );

                y += 5;
            }

            if (searchKeyword) {
                doc.text(
                    `Search: ${searchKeyword}`,
                    14,
                    y
                );

                y += 5;
            }

            y += 5;

            const columns = [
                {
                    label: "ID",
                    width: 12,
                },
                {
                    label: "DATE",
                    width: 24,
                },
                {
                    label: "PRODUCT",
                    width: 36,
                },
                {
                    label: "SIZE",
                    width: 25,
                },
                {
                    label: "QTY",
                    width: 20,
                },
                {
                    label: "CEMENT",
                    width: 24,
                },
                {
                    label: "ASSET",
                    width: 30,
                },
                {
                    label: "STATUS",
                    width: 25,
                },
            ];

            drawPdfTableHeader(
                doc,
                columns,
                y
            );

            y += 8;

            doc.setFontSize(7);

            const records =
                sortedRecords;

            records.forEach(
                (production) => {
                    if (y > 280) {
                        doc.addPage();

                        y = 20;

                        drawPdfTableHeader(
                            doc,
                            columns,
                            y
                        );

                        y += 8;
                    }

                    let x = 14;

                    const row = [
                        safePdfText(
                            production.productionId
                        ),
                        formatDate(
                            production.productionDate
                        ),
                        safePdfText(
                            production.productName
                        ),
                        safePdfText(
                            production.productSize
                        ),
                        safePdfText(
                            production.quantityProduced
                        ),
                        safePdfText(
                            production.totalCementBags
                        ),
                        safePdfText(
                            production.assetName
                        ),
                        safePdfText(
                            production.status
                        ),
                    ];

                    row.forEach(
                        (
                            value,
                            index
                        ) => {
                            const column =
                                columns[
                                    index
                                ];

                            let text =
                                String(
                                    value
                                );

                            if (
                                text.length >
                                22
                            ) {
                                text =
                                    text.substring(
                                        0,
                                        20
                                    ) +
                                    "...";
                            }

                            doc.text(
                                text,
                                x,
                                y
                            );

                            x +=
                                column.width;
                        }
                    );

                    y += 7;
                }
            );

            if (
                records.length > 0
            ) {
                y += 3;

                if (y > 275) {
                    doc.addPage();
                    y = 20;
                }

                doc.setFontSize(8);
                doc.setFont(
                    undefined,
                    "bold"
                );

                doc.line(
                    14,
                    y,
                    196,
                    y
                );

                y += 6;

                doc.text(
                    "TOTAL",
                    14,
                    y
                );

                doc.text(
                    String(
                        totalQuantity
                    ),
                    106,
                    y
                );

                doc.text(
                    String(
                        totalCementBags
                    ),
                    150,
                    y
                );

                doc.setFont(
                    undefined,
                    "normal"
                );
            }

            if (
                records.length ===
                0
            ) {
                doc.setFontSize(10);

                doc.text(
                    "No production records found.",
                    14,
                    y
                );
            }

            const totalPdfPages =
                doc.internal
                    .getNumberOfPages();

            for (
                let page = 1;
                page <= totalPdfPages;
                page++
            ) {
                doc.setPage(page);

                const pageWidth =
                    doc.internal.pageSize.getWidth();

                const pageHeight =
                    doc.internal.pageSize.getHeight();

                doc.setFontSize(8);

                doc.text(
                    `Page ${page} of ${totalPdfPages}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    {
                        align: "center",
                    }
                );
            }

            const today =
                new Date()
                    .toLocaleDateString(
                        "en-GB"
                    )
                    .replaceAll(
                        "/",
                        "-"
                    );

            const sizeSuffix =
                productionSizeFilter
                    ? `_${productionSizeFilter.replaceAll(
                          " ",
                          "-"
                      )}`
                    : "";

            doc.save(
                `SKCP_Production_List${sizeSuffix}_${today}.pdf`
            );
        };

    // ============================================================
    // DOWNLOAD INDIVIDUAL PRODUCTION PDF
    // ============================================================

    const handleDownloadProductionPdf =
        (production) => {
            if (!production) {
                return;
            }

            const doc = new jsPDF(
                "p",
                "mm",
                "a4"
            );

            const logoUrl =
                "/assets/skcp-logo.png";

            try {
                doc.addImage(
                    logoUrl,
                    "PNG",
                    14,
                    10,
                    22,
                    22
                );
            } catch (error) {
                console.warn(
                    "Production PDF logo could not be loaded:",
                    error
                );
            }

            drawPdfTitle(
                doc,
                "SKCP Production Details",
                "Production Information"
            );

            let y = 45;

            const addPdfDetail = (
                label,
                value
            ) => {
                doc.setFontSize(10);

                doc.setFont(
                    undefined,
                    "bold"
                );

                doc.text(
                    `${label}:`,
                    18,
                    y
                );

                doc.setFont(
                    undefined,
                    "normal"
                );

                const wrapped =
                    doc.splitTextToSize(
                        safePdfText(
                            value
                        ),
                        115
                    );

                doc.text(
                    wrapped,
                    65,
                    y
                );

                y +=
                    Math.max(
                        8,
                        wrapped.length *
                            5
                    );
            };

            addPdfDetail(
                "Production ID",
                production.productionId
            );

            addPdfDetail(
                "Production Date",
                formatDate(
                    production.productionDate
                )
            );

            addPdfDetail(
                "Product",
                production.productName
            );

            addPdfDetail(
                "Size",
                production.productSize
            );

            addPdfDetail(
                "Quantity Produced",
                production.quantityProduced
            );

            addPdfDetail(
                "Morning Cement Bags",
                production.morningCementBags
            );

            addPdfDetail(
                "Afternoon Cement Bags",
                production.afternoonCementBags
            );

            addPdfDetail(
                "Total Cement Bags",
                production.totalCementBags
            );

            addPdfDetail(
                "Asset",
                production.assetName
            );

            addPdfDetail(
                "Asset ID",
                production.assetId
            );

            addPdfDetail(
                "Record Status",
                production.status
            );

            addPdfDetail(
                "Created At",
                formatDateTime(
                    production.createdAt
                )
            );

            y += 3;

            doc.setFontSize(10);
            doc.setFont(
                undefined,
                "bold"
            );

            doc.text(
                "Remarks:",
                18,
                y
            );

            doc.setFont(
                undefined,
                "normal"
            );

            const remarks =
                doc.splitTextToSize(
                    safePdfText(
                        production.remarks
                    ),
                    155
                );

            doc.text(
                remarks,
                18,
                y + 7
            );

            const invoiceDate =
                production.productionDate
                    ? production.productionDate.replaceAll(
                          "-",
                          ""
                      )
                    : "Production";

            doc.save(
                `SKCP_Production_${invoiceDate}_${production.productionId}.pdf`
            );
        };

    // ============================================================
    // VIEW PRODUCTION
    // ============================================================

    const handleView = async (
        production
    ) => {
        try {
            const result = await apiGet(
                `/api/productions/${production.productionId}`
            );

            console.log(
                "Production details response:",
                result
            );

            setSelectedProduction(
                result.data
            );
        } catch (err) {
            console.error(
                "Failed to fetch production details:",
                err
            );

            setError(
                "Failed to load production details."
            );
        }
    };

    const closeViewModal = () => {
        setSelectedProduction(null);
    };

    // ============================================================
    // ADD PRODUCTION
    // ============================================================

    const openAddModal = () => {
        setAddError("");

        setAddForm({
            productionDate: "",
            size: "",
            assetId: "",
            quantityProduced: "",
            morningCementBags: "",
            afternoonCementBags: "",
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

    // ============================================================
    // ADD FORM CHANGE
    // ============================================================

    const handleAddChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        if (name === "size") {
            const selectedSize =
                sizeOptions.find(
                    (option) =>
                        option.size ===
                        value
                );

            setAddForm(
                (previous) => ({
                    ...previous,
                    size: value,
                    remarks:
                        selectedSize?.dimension ||
                        "",
                })
            );

            return;
        }

        setAddForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };

    // ============================================================
    // CREATE PRODUCTION
    // ============================================================

    const handleCreateProduction =
        async (event) => {
            event.preventDefault();

            if (!addForm.productionDate) {
                setAddError(
                    "Please select a production date."
                );
                return;
            }

            if (!addForm.size) {
                setAddError(
                    "Please select a size."
                );
                return;
            }

            const selectedSize =
                sizeOptions.find(
                    (option) =>
                        option.size ===
                        addForm.size
                );

            const selectedProduct =
                products.find(
                    (product) =>
                        String(
                            product.size ?? ""
                        )
                            .trim()
                            .toLowerCase() ===
                            String(
                                addForm.size ?? ""
                            )
                                .trim()
                                .toLowerCase() &&
                        String(
                            product.status ??
                                "ACTIVE"
                        )
                            .trim()
                            .toUpperCase() ===
                            "ACTIVE"
                );

            const productId =
                selectedProduct?.productId;

            if (!selectedSize) {
                setAddError(
                    "Please select a valid product size."
                );
                return;
            }

            if (
                !selectedProduct ||
                !productId
            ) {
                setAddError(
                    `Unable to determine the Product ID for size "${addForm.size}". Please check the Product Master.`
                );
                return;
            }

            if (!addForm.quantityProduced) {
                setAddError(
                    "Please enter the quantity produced."
                );
                return;
            }

            try {
                setAddLoading(true);
                setAddError("");

                const payload = {
                    productionDate:
                        addForm.productionDate,

                    productId:
                        Number(
                            productId
                        ),

                    assetId:
                        addForm.assetId
                            ? Number(
                                  addForm.assetId
                              )
                            : null,

                    quantityProduced:
                        Number(
                            addForm.quantityProduced
                        ),

                    morningCementBags:
                        addForm.morningCementBags ===
                        ""
                            ? 0
                            : Number(
                                  addForm.morningCementBags
                              ),

                    afternoonCementBags:
                        addForm.afternoonCementBags ===
                        ""
                            ? 0
                            : Number(
                                  addForm.afternoonCementBags
                              ),

                    remarks:
                        addForm.remarks.trim() ||
                        null,
                };

                console.log(
                    "Creating production with payload:",
                    payload
                );

                const result = await apiPost(
                    "/api/productions",
                    payload
                );

                console.log(
                    "Production created:",
                    result
                );

                setShowAddModal(false);

                setAddForm({
                    productionDate: "",
                    size: "",
                    assetId: "",
                    quantityProduced: "",
                    morningCementBags: "",
                    afternoonCementBags: "",
                    remarks: "",
                });

                await fetchProductions();
            } catch (err) {
                console.error(
                    "Error creating production:",
                    err
                );

                setAddError(
                    err.message ||
                        "Unable to create production record."
                );
            } finally {
                setAddLoading(false);
            }
        };

    // ============================================================
    // EDIT PRODUCTION
    // ============================================================

    const handleEdit = (
        production
    ) => {
        setEditError("");

        const existingSize =
            String(
                production.productSize ||
                    ""
            )
                .trim()
                .toLowerCase();

        const matchedSize =
            sizeOptions.find(
                (option) =>
                    option.size
                        .trim()
                        .toLowerCase() ===
                    existingSize
            );

        setEditingProduction(
            production
        );

        setEditForm({
            productionDate:
                production.productionDate ||
                "",

            size:
                matchedSize?.size ||
                production.productSize ||
                "",

            assetId:
                production.assetId ??
                "",

            quantityProduced:
                production.quantityProduced ??
                "",

            morningCementBags:
                production.morningCementBags ??
                "",

            afternoonCementBags:
                production.afternoonCementBags ??
                "",

            remarks:
                matchedSize?.dimension ||
                production.remarks ||
                "",
        });
    };

    const closeEditModal = () => {
        if (editLoading) {
            return;
        }

        setEditingProduction(
            null
        );

        setEditError("");
    };

    // ============================================================
    // EDIT FORM CHANGE
    // ============================================================

    const handleEditChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        // --------------------------------------------------------
        // SIZE CHANGE
        // --------------------------------------------------------
        // Same behavior as Add Production.
        //
        // Size changes:
        // 1. Edit Size
        // 2. Resolve Product ID from Product Master
        // 3. Automatically update Remarks with dimensions
        // --------------------------------------------------------

        if (name === "size") {
            const selectedSize =
                sizeOptions.find(
                    (option) =>
                        option.size ===
                        value
                );

            setEditForm(
                (previous) => ({
                    ...previous,
                    size: value,
                    remarks:
                        selectedSize?.dimension ||
                        "",
                })
            );

            return;
        }

        setEditForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };

    // ============================================================
    // UPDATE PRODUCTION
    // ============================================================

    const handleUpdateProduction =
        async (event) => {
            event.preventDefault();

            if (!editingProduction) {
                return;
            }

            if (
                !editForm.productionDate
            ) {
                setEditError(
                    "Please select a production date."
                );
                return;
            }

            if (!editForm.size) {
                setEditError(
                    "Please select a size."
                );
                return;
            }

            if (
                editForm.quantityProduced ===
                    "" ||
                Number.isNaN(
                    Number(
                        editForm.quantityProduced
                    )
                )
            ) {
                setEditError(
                    "Please enter a valid quantity produced."
                );
                return;
            }

            // ----------------------------------------------------
            // RESOLVE PRODUCT ID FROM PRODUCT MASTER
            // ----------------------------------------------------

            const selectedSize =
                sizeOptions.find(
                    (option) =>
                        option.size ===
                        editForm.size
                );

            const selectedProduct =
                products.find(
                    (product) =>
                        String(
                            product.size ?? ""
                        )
                            .trim()
                            .toLowerCase() ===
                            String(
                                editForm.size ?? ""
                            )
                                .trim()
                                .toLowerCase() &&
                        String(
                            product.status ??
                                "ACTIVE"
                        )
                            .trim()
                            .toUpperCase() ===
                            "ACTIVE"
                );

            const productId =
                selectedProduct?.productId;

            if (!selectedSize) {
                setEditError(
                    "Please select a valid product size."
                );
                return;
            }

            if (
                !selectedProduct ||
                !productId
            ) {
                setEditError(
                    `Unable to determine the Product ID for size "${editForm.size}". Please check the Product Master.`
                );
                return;
            }

            try {
                setEditLoading(true);
                setEditError("");

                const payload = {
                    productionDate:
                        editForm.productionDate,

                    productId:
                        Number(
                            productId
                        ),

                    assetId:
                        editForm.assetId
                            ? Number(
                                  editForm.assetId
                              )
                            : null,

                    quantityProduced:
                        Number(
                            editForm.quantityProduced
                        ),

                    morningCementBags:
                        editForm.morningCementBags ===
                        ""
                            ? 0
                            : Number(
                                  editForm.morningCementBags
                              ),

                    afternoonCementBags:
                        editForm.afternoonCementBags ===
                        ""
                            ? 0
                            : Number(
                                  editForm.afternoonCementBags
                              ),

                    // Remarks are controlled by Size.
                    remarks:
                        selectedSize.dimension ||
                        null,
                };

                console.log(
                    "Updating production with payload:",
                    payload
                );

                const result =
                    await apiPut(
                        `/api/productions/${editingProduction.productionId}`,
                        payload
                    );

                console.log(
                    "Production updated:",
                    result
                );

                setEditingProduction(
                    null
                );

                setEditForm({
                    productionDate: "",
                    size: "",
                    assetId: "",
                    quantityProduced: "",
                    morningCementBags: "",
                    afternoonCementBags: "",
                    remarks: "",
                });

                await fetchProductions();
            } catch (err) {
                console.error(
                    "Error updating production:",
                    err
                );

                setEditError(
                    err.message ||
                        "Unable to update production record."
                );
            } finally {
                setEditLoading(false);
            }
        };

    // ============================================================
    // DELETE PRODUCTION
    // ============================================================

    const handleDelete = (
        production
    ) => {
        setDeleteError("");

        setDeletingProduction(
            production
        );
    };

    const closeDeleteModal = () => {
        if (deleteLoading) {
            return;
        }

        setDeletingProduction(
            null
        );

        setDeleteError("");
    };

    const handleConfirmDelete =
        async () => {
            if (!deletingProduction) {
                return;
            }

            try {
                setDeleteLoading(true);
                setDeleteError("");

                console.log(
                    "Deleting production ID:",
                    deletingProduction.productionId
                );

                const result =
                    await apiDelete(
                        `/api/productions/${deletingProduction.productionId}`
                    );

                console.log(
                    "Production deleted:",
                    result
                );

                setDeletingProduction(
                    null
                );

                await fetchProductions();
            } catch (err) {
                console.error(
                    "Error deleting production:",
                    err
                );

                setDeleteError(
                    err.message ||
                        "Unable to delete production record."
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
            <div className="page production-page">
                <section className="card">
                    <h2>Production</h2>

                    <p>
                        Loading production records...
                    </p>
                </section>
            </div>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="page production-page">
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
                        <h2>Production</h2>

                        <p>
                            Manage production information and records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            openAddModal
                        }
                    >
                        Add Production
                    </button>
                </div>

                {/* ==================================================
                    SEARCH / FILTER AREA
                ================================================== */}

                <div
                    style={{
                        display: "flex",
                        alignItems:
                            "flex-end",
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
                        <label htmlFor="production-search">
                            Search Production
                        </label>

                        <input
                            id="production-search"
                            type="text"
                            placeholder="Search by product, size, date, asset or status..."
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
                                "1.5 1 240px",
                        }}
                    >
                        <label htmlFor="production-size-filter">
                            Search by Size
                        </label>

                        <select
                            id="production-size-filter"
                            value={
                                productionSizeFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setProductionSizeFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                        >
                            <option value="">
                                All Sizes
                            </option>

                            {sizeOptions.map(
                                (
                                    option
                                ) => (
                                    <option
                                        key={
                                            option.size
                                        }
                                        value={
                                            option.size
                                        }
                                    >
                                        {
                                            option.displayName
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div
                        className="fld"
                        style={{
                            flex:
                                "1 1 180px",
                        }}
                    >
                        <label htmlFor="production-date-from">
                            Date From
                        </label>

                        <input
                            id="production-date-from"
                            type="date"
                            value={
                                productionDateFrom
                            }
                            onChange={
                                handleProductionDateFromChange
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
                        <label htmlFor="production-date-to">
                            Date To
                        </label>

                        <input
                            id="production-date-to"
                            type="date"
                            value={
                                productionDateTo
                            }
                            onChange={
                                handleProductionDateToChange
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={
                            handleClearFilters
                        }
                        disabled={
                            !searchKeyword &&
                            !productionSizeFilter &&
                            !productionDateFrom &&
                            !productionDateTo
                        }
                    >
                        Clear
                    </button>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            handleDownloadProductionListPdf
                        }
                    >
                        Download PDF
                    </button>
                </div>

                {dateFilterError && (
                    <div
                        className="form-error"
                        style={{
                            marginTop: "12px",
                        }}
                    >
                        {dateFilterError}
                    </div>
                )}
            </section>

            {/* ====================================================
                PRODUCTION LIST
            ==================================================== */}

            <section className="card">
                <h2>Production List</h2>

                <p>
                    {totalRecords} production
                    {totalRecords === 1
                        ? ""
                        : " records"}
                </p>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {!error &&
                    totalRecords === 0 && (
                        <p>
                            No production records found.
                        </p>
                    )}

                {!error &&
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
                                                        "productionId"
                                                    )
                                                }
                                            >
                                                ID
                                                {getSortIndicator(
                                                    "productionId"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "productionDate"
                                                    )
                                                }
                                            >
                                                DATE
                                                {getSortIndicator(
                                                    "productionDate"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "productName"
                                                    )
                                                }
                                            >
                                                PRODUCT
                                                {getSortIndicator(
                                                    "productName"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "productSize"
                                                    )
                                                }
                                            >
                                                SIZE
                                                {getSortIndicator(
                                                    "productSize"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "quantityProduced"
                                                    )
                                                }
                                            >
                                                QUANTITY
                                                {getSortIndicator(
                                                    "quantityProduced"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "totalCementBags"
                                                    )
                                                }
                                            >
                                                TOTAL CEMENT BAGS
                                                {getSortIndicator(
                                                    "totalCementBags"
                                                )}
                                            </button>
                                        </th>

                                        <th>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() =>
                                                    handleSort(
                                                        "assetName"
                                                    )
                                                }
                                            >
                                                ASSET
                                                {getSortIndicator(
                                                    "assetName"
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
                                            production
                                        ) => (
                                            <tr
                                                key={
                                                    production.productionId
                                                }
                                            >
                                                <td>
                                                    {
                                                        production.productionId
                                                    }
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        production.productionDate
                                                    )}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            production.productName
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        production.productSize
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        production.quantityProduced
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        production.totalCementBags
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        production.assetName
                                                    }
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            production.status ===
                                                            "COMPLETED"
                                                                ? "badge bg"
                                                                : "badge br"
                                                        }
                                                    >
                                                        {
                                                            production.status
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div
                                                        className="action-buttons"
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap: "6px",
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="action-btn view-btn"
                                                            onClick={() =>
                                                                handleView(
                                                                    production
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
                                                                    production
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        {production.status !==
                                                            "CANCELLED" && (
                                                            <button
                                                                type="button"
                                                                className="action-btn delete-btn"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        production
                                                                    )
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

                                <tfoot>
                                    <tr>
                                        <td
                                            colSpan="4"
                                            style={{
                                                textAlign:
                                                    "right",
                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            Total
                                        </td>

                                        <td
                                            style={{
                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            {totalQuantity}
                                        </td>

                                        <td
                                            style={{
                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            {
                                                totalCementBags
                                            }
                                        </td>

                                        <td
                                            colSpan="3"
                                        ></td>
                                    </tr>
                                </tfoot>
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
                VIEW PRODUCTION MODAL
            ==================================================== */}

            <ViewModal
                isOpen={
                    !!selectedProduction
                }
                onClose={
                    closeViewModal
                }
                title="Production Details"
                subtitle="View production information"
                size="lg"
                footer={
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            alignItems:
                                "center",
                            gap: "8px",
                        }}
                    >
                        <button
                            type="button"
                            className="action-btn view-btn"
                            onClick={() =>
                                handleDownloadProductionPdf(
                                    selectedProduction
                                )
                            }
                        >
                            Download PDF
                        </button>

                        <button
                            type="button"
                            className="btn"
                            onClick={
                                closeViewModal
                            }
                        >
                            Close
                        </button>
                    </div>
                }
            >
                {selectedProduction && (
                    <DetailGrid>
                        <DetailItem
                            label="Production ID"
                            value={
                                selectedProduction.productionId
                            }
                        />

                        <DetailItem
                            label="Production Date"
                            value={formatDate(
                                selectedProduction.productionDate
                            )}
                        />

                        <DetailItem
                            label="Product"
                            value={
                                selectedProduction.productName
                            }
                        />

                        <DetailItem
                            label="Size"
                            value={
                                selectedProduction.productSize
                            }
                        />

                        <DetailItem
                            label="Quantity Produced"
                            value={
                                selectedProduction.quantityProduced
                            }
                        />

                        <DetailItem
                            label="Morning Cement Bags"
                            value={
                                selectedProduction.morningCementBags
                            }
                        />

                        <DetailItem
                            label="Afternoon Cement Bags"
                            value={
                                selectedProduction.afternoonCementBags
                            }
                        />

                        <DetailItem
                            label="Total Cement Bags"
                            value={
                                selectedProduction.totalCementBags
                            }
                        />

                        <DetailItem
                            label="Asset"
                            value={
                                selectedProduction.assetName
                            }
                        />

                        <DetailItem
                            label="Asset ID"
                            value={
                                selectedProduction.assetId
                            }
                        />

                        <DetailItem
                            label="Record Status"
                            value={
                                selectedProduction.status
                            }
                        />

                        <DetailItem
                            label="Created At"
                            value={formatDateTime(
                                selectedProduction.createdAt
                            )}
                        />

                        <DetailItem
                            label="Remarks"
                            value={
                                selectedProduction.remarks ||
                                "-"
                            }
                            fullWidth
                        />
                    </DetailGrid>
                )}
            </ViewModal>

            {/* ====================================================
                ADD PRODUCTION MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    showAddModal
                }
                onClose={
                    closeAddModal
                }
                title="Add Production"
                subtitle="Daily production information at the End of the day"
                onSubmit={
                    handleCreateProduction
                }
                submitLabel="Add Production"
                cancelLabel="Cancel"
                saving={
                    addLoading
                }
                error={
                    addError
                }
                size="lg"
            >
                <div className="modal-section-title">
                    Production Information
                </div>

                <div className="form-grid">
                    <div className="fld">
                        <label htmlFor="add-production-date">
                            Production Date
                        </label>

                        <input
                            id="add-production-date"
                            type="date"
                            name="productionDate"
                            value={
                                addForm.productionDate
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-production-size">
                            Size
                        </label>

                        <select
                            id="add-production-size"
                            name="size"
                            value={
                                addForm.size
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        >
                            <option value="">
                                Select size
                            </option>

                            {sizeOptions.map(
                                (
                                    option
                                ) => (
                                    <option
                                        key={
                                            option.size
                                        }
                                        value={
                                            option.size
                                        }
                                    >
                                        {
                                            option.displayName
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="fld">
                        <label htmlFor="add-asset-id">
                            Asset ID
                        </label>

                        <input
                            id="add-asset-id"
                            type="number"
                            name="assetId"
                            min="1"
                            value={
                                addForm.assetId
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter asset ID"
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-quantity-produced">
                            Quantity Produced
                        </label>

                        <input
                            id="add-quantity-produced"
                            type="number"
                            name="quantityProduced"
                            min="0"
                            step="0.01"
                            value={
                                addForm.quantityProduced
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter quantity"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-morning-cement-bags">
                            Morning Cement Bags
                        </label>

                        <input
                            id="add-morning-cement-bags"
                            type="number"
                            name="morningCementBags"
                            min="0"
                            step="0.01"
                            value={
                                addForm.morningCementBags
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter morning bags"
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-afternoon-cement-bags">
                            Afternoon Cement Bags
                        </label>

                        <input
                            id="add-afternoon-cement-bags"
                            type="number"
                            name="afternoonCementBags"
                            min="0"
                            step="0.01"
                            value={
                                addForm.afternoonCementBags
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter afternoon bags"
                        />
                    </div>

                    <div className="fld f-full">
                        <label htmlFor="add-production-remarks">
                            Remarks
                        </label>

                        <textarea
                            id="add-production-remarks"
                            name="remarks"
                            rows="3"
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
                EDIT PRODUCTION MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    !!editingProduction
                }
                onClose={
                    closeEditModal
                }
                title="Edit Production"
                subtitle="Update production information"
                onSubmit={
                    handleUpdateProduction
                }
                submitLabel="Update Production"
                cancelLabel="Cancel"
                saving={
                    editLoading
                }
                error={
                    editError
                }
                size="lg"
            >
                {editingProduction && (
                    <>
                        <div className="modal-section-title">
                            Production Information
                        </div>

                        <div className="form-grid">
                            {/* ------------------------------------
                                PRODUCTION ID
                            ------------------------------------ */}

                            <div className="fld">
                                <label htmlFor="edit-production-id">
                                    Production ID
                                </label>

                                <input
                                    id="edit-production-id"
                                    type="text"
                                    value={
                                        editingProduction.productionId
                                    }
                                    disabled
                                />
                            </div>

                            {/* ------------------------------------
                                PRODUCTION DATE
                            ------------------------------------ */}

                            <div className="fld">
                                <label htmlFor="edit-production-date">
                                    Production Date
                                </label>

                                <input
                                    id="edit-production-date"
                                    type="date"
                                    name="productionDate"
                                    value={
                                        editForm.productionDate
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                />
                            </div>

                            {/* ------------------------------------
                                SIZE
                            ------------------------------------ */}

                            <div className="fld">
                                <label htmlFor="edit-production-size">
                                    Size
                                </label>

                                <select
                                    id="edit-production-size"
                                    name="size"
                                    value={
                                        editForm.size
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                >
                                    <option value="">
                                        Select size
                                    </option>

                                    {sizeOptions.map(
                                        (
                                            option
                                        ) => (
                                            <option
                                                key={
                                                    option.size
                                                }
                                                value={
                                                    option.size
                                                }
                                            >
                                                {
                                                    option.displayName
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* ------------------------------------
                                ASSET ID
                            ------------------------------------ */}

                            <div className="fld">
                                <label htmlFor="edit-asset-id">
                                    Asset ID
                                </label>

                                <input
                                    id="edit-asset-id"
                                    type="number"
                                    name="assetId"
                                    min="1"
                                    value={
                                        editForm.assetId
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    placeholder="Enter asset ID"
                                />
                            </div>

                            {/* ------------------------------------
                                QUANTITY PRODUCED
                            ------------------------------------ */}

                            <div className="fld">
                                <label htmlFor="edit-quantity-produced">
                                    Quantity Produced
                                </label>

                                <input
                                    id="edit-quantity-produced"
                                    type="number"
                                    name="quantityProduced"
                                    min="0"
                                    step="0.01"
                                    value={
                                        editForm.quantityProduced
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    placeholder="Enter quantity"
                                    required
                                />
                            </div>

                            {/* ------------------------------------
                                MORNING CEMENT BAGS
                            ------------------------------------ */}

                            <div className="fld">
                                <label htmlFor="edit-morning-cement-bags">
                                    Morning Cement Bags
                                </label>

                                <input
                                    id="edit-morning-cement-bags"
                                    type="number"
                                    name="morningCementBags"
                                    min="0"
                                    step="0.01"
                                    value={
                                        editForm.morningCementBags
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    placeholder="Enter morning bags"
                                />
                            </div>

                            {/* ------------------------------------
                                AFTERNOON CEMENT BAGS
                            ------------------------------------ */}

                            <div className="fld">
                                <label htmlFor="edit-afternoon-cement-bags">
                                    Afternoon Cement Bags
                                </label>

                                <input
                                    id="edit-afternoon-cement-bags"
                                    type="number"
                                    name="afternoonCementBags"
                                    min="0"
                                    step="0.01"
                                    value={
                                        editForm.afternoonCementBags
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    placeholder="Enter afternoon bags"
                                />
                            </div>

                            {/* ------------------------------------
                                TOTAL CEMENT BAGS
                            ------------------------------------ */}

                            <div className="fld">
                                <label htmlFor="edit-total-cement-bags">
                                    Total Cement Bags
                                </label>

                                <input
                                    id="edit-total-cement-bags"
                                    type="text"
                                    value={
                                        Number(
                                            editForm.morningCementBags ||
                                                0
                                        ) +
                                        Number(
                                            editForm.afternoonCementBags ||
                                                0
                                        )
                                    }
                                    disabled
                                />
                            </div>

                            {/* ------------------------------------
                                REMARKS
                            ------------------------------------ */}

                            <div className="fld f-full">
                                <label htmlFor="edit-production-remarks">
                                    Remarks
                                </label>

                                <textarea
                                    id="edit-production-remarks"
                                    name="remarks"
                                    rows="3"
                                    value={
                                        editForm.remarks
                                    }
                                    readOnly
                                />
                            </div>
                        </div>
                    </>
                )}
            </FormModal>

            {/* ====================================================
                DELETE CONFIRMATION MODAL
            ==================================================== */}

            <DeleteConfirmModal
                isOpen={
                    !!deletingProduction
                }
                onClose={
                    closeDeleteModal
                }
                onConfirm={
                    handleConfirmDelete
                }
                title="Delete Production"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this production record?"
                itemName={
                    deletingProduction
                        ? `Production ID: ${deletingProduction.productionId}`
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

export default Production;