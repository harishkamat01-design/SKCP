import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

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
import"./RawMaterialStock.css";
// ============================================================
// APPROVED RAW MATERIALS
// ============================================================

const MATERIAL_NAME_OPTIONS = [
    "Cement",
    "Sand",
    "Water",
    "Hardner",
    "Jelly",
    "Fly Ash",
];

const MATERIAL_UNIT_MAP = {
    Cement: "BAG",
    Sand: "CUBIC_METER",
    Water: "LITER",
    Hardner: "LITER",
    Jelly: "CUBIC_METER",
    "Fly Ash": "TON",
};

const UNIT_OPTIONS = ["BAG", "TON", "LITER", "CUBIC_METER"];

const normalizeMaterialName = (name) => {
    if (!name) return "";

    const value = String(name).trim();

    return MATERIAL_NAME_OPTIONS.find(
        (option) => option.toLowerCase() === value.toLowerCase()
    ) || (value.toLowerCase() === "hardener" ? "Hardner" : value);
};

const getUnitForMaterial = (name) =>
    MATERIAL_UNIT_MAP[normalizeMaterialName(name)] || "";

const getMaterialId = (stock) =>
    stock?.rawMaterialId ??
    stock?.rawMaterial?.rawMaterialId ??
    "";

const getRecordStatus = (stock) =>
    String(stock?.recordStatus || "ACTIVE").toUpperCase();

const isActive = (stock) => getRecordStatus(stock) === "ACTIVE";

const getStockId = (stock) =>
    stock?.rawMaterialStockId ?? stock?.id ?? "";

const getApiRecords = (result) => {
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.content)) return result.data.content;
    if (Array.isArray(result?.content)) return result.content;
    return [];
};

// IMPORTANT: stockDate is the business date.
// Do not use lastUpdatedDate as the stock date.
const getStockDate = (stock) =>
    stock?.stockDate ??
    stock?.stock_date ??
    stock?.date ??
    "";

const getDateOnly = (value) => {
    if (!value) return "";

    const text = String(value);
    const isoMatch = text.match(/^(\d{4}-\d{2}-\d{2})/);

    if (isoMatch) return isoMatch[1];

    const dmyMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (dmyMatch) {
        return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
    }

    return "";
};

const formatDate = (value) => {
    const dateOnly = getDateOnly(value);

    if (!dateOnly) return "-";

    const [year, month, day] = dateOnly.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const getErrorMessage = (err, fallback) => {
    const responseMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.data?.message;

    return responseMessage || err?.message || fallback;
};

function RawMaterialStock() {
    // ============================================================
    // COMMON STATE
    // ============================================================

    const [stockList, setStockList] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [materialsError, setMaterialsError] = useState("");

    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedMaterialFilter, setSelectedMaterialFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // ============================================================
    // VIEW MODAL
    // ============================================================

    const [selectedStock, setSelectedStock] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");

    // ============================================================
    // ADD MODAL
    // ============================================================

    const emptyAddForm = {
        stockDate: "",
        rawMaterialId: "",
        currentStockLevel: "",
        minimumStockLevel: "",
        notes: "",
    };

    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ ...emptyAddForm });
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");

    // ============================================================
    // EDIT MODAL
    // ============================================================

    const emptyEditForm = {
        stockDate: "",
        rawMaterialId: "",
        rawMaterialUnit: "",
        currentStockLevel: "",
        minimumStockLevel: "",
        notes: "",
    };

    const [editingStock, setEditingStock] = useState(null);
    const [editForm, setEditForm] = useState({ ...emptyEditForm });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");

    // ============================================================
    // DELETE MODAL
    // ============================================================

    const [deletingStock, setDeletingStock] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ============================================================
    // INITIAL FETCH
    // ============================================================

    useEffect(() => {
        fetchStock();
        fetchRawMaterials();
    }, []);

    const fetchStock = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet("/api/raw-material-stock");
            const records = getApiRecords(result);

            const activeRecords = records
                .filter(isActive)
                .map((stock) => {
                    const materialName = normalizeMaterialName(
                        stock.rawMaterialName ||
                        stock.rawMaterial?.materialName ||
                        ""
                    );

                    return {
                        ...stock,
                        stockDate: getDateOnly(getStockDate(stock)),
                        rawMaterialName: materialName,
                        rawMaterialUnit:
                            stock.rawMaterialUnit ||
                            stock.rawMaterial?.unit ||
                            getUnitForMaterial(materialName),
                        recordStatus: getRecordStatus(stock),
                    };
                });

            setStockList(activeRecords);
        } catch (err) {
            console.error("Error fetching raw material stock:", err);
            setError(
                getErrorMessage(
                    err,
                    "Unable to load raw material stock. Please try again."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchRawMaterials = async () => {
        try {
            setMaterialsError("");

            const result = await apiGet("/api/raw-materials");
            const records = getApiRecords(result);
            const approvedMaterials = new Map();

            records.forEach((material) => {
                if (
                    String(material.status || "ACTIVE").toUpperCase() !==
                    "ACTIVE"
                ) {
                    return;
                }

                const materialName = normalizeMaterialName(
                    material.materialName
                );

                if (!MATERIAL_NAME_OPTIONS.includes(materialName)) return;

                const materialId =
                    material.rawMaterialId ?? material.id;

                if (materialId == null || materialId === "") return;

                if (!approvedMaterials.has(materialName)) {
                    approvedMaterials.set(materialName, {
                        ...material,
                        rawMaterialId: materialId,
                        materialName,
                        unit:
                            material.unit ||
                            getUnitForMaterial(materialName),
                    });
                }
            });

            setRawMaterials(
                MATERIAL_NAME_OPTIONS
                    .map((name) => approvedMaterials.get(name))
                    .filter(Boolean)
            );
        } catch (err) {
            console.error("Error fetching raw material master:", err);
            setMaterialsError(
                getErrorMessage(
                    err,
                    "Unable to load raw material options. Please try again."
                )
            );
        }
    };

    // ============================================================
    // FILTERS
    // ============================================================

    const clearFilters = () => {
        setSearchKeyword("");
        setSelectedMaterialFilter("");
        setFromDate("");
        setToDate("");
    };

    const filteredStock = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();

        return stockList.filter((stock) => {
            const stockDate = getDateOnly(getStockDate(stock));

            const matchesSearch =
                !keyword ||
                [
                    getStockId(stock),
                    formatDate(getStockDate(stock)),
                    stock.rawMaterialName,
                    stock.rawMaterialUnit,
                    stock.currentStockLevel,
                    stock.minimumStockLevel,
                    stock.stockStatus,
                    stock.recordStatus,
                    stock.notes,
                ].some((value) =>
                    String(value ?? "").toLowerCase().includes(keyword)
                );

            const matchesMaterial =
                !selectedMaterialFilter ||
                normalizeMaterialName(stock.rawMaterialName) ===
                    selectedMaterialFilter;

            const matchesFromDate =
                !fromDate || (!!stockDate && stockDate >= fromDate);

            const matchesToDate =
                !toDate || (!!stockDate && stockDate <= toDate);

            return (
                matchesSearch &&
                matchesMaterial &&
                matchesFromDate &&
                matchesToDate
            );
        });
    }, [
        stockList,
        searchKeyword,
        selectedMaterialFilter,
        fromDate,
        toDate,
    ]);

    // ============================================================
    // SORTING
    // ============================================================

    const {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    } = useTableSort(filteredStock, "rawMaterialStockId", "desc");

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
    } = usePagination(sortedRecords, 10);

    const sortLabel = (label, key) =>
        `${label}${
            sortKey === key
                ? sortDirection === "asc"
                    ? " ▲"
                    : " ▼"
                : ""
        }`;

    // ============================================================
    // MATERIAL DROPDOWN / UNITS
    // ============================================================

    const selectedAddMaterial = rawMaterials.find(
        (material) =>
            String(material.rawMaterialId) ===
            String(addForm.rawMaterialId)
    );

    const addUnit =
        selectedAddMaterial?.unit ||
        getUnitForMaterial(selectedAddMaterial?.materialName) ||
        "";

    // ============================================================
    // COMMON VALIDATION
    // ============================================================

    const validateStockForm = (form) => {
        if (!getDateOnly(form.stockDate)) {
            return "Please select a stock date.";
        }

        if (!form.rawMaterialId) {
            return "Please select a Raw Material.";
        }

        if (
            form.currentStockLevel === "" ||
            !Number.isFinite(Number(form.currentStockLevel))
        ) {
            return "Please enter a valid current stock level.";
        }

        if (Number(form.currentStockLevel) < 0) {
            return "Current stock level cannot be negative.";
        }

        if (
            form.minimumStockLevel !== "" &&
            !Number.isFinite(Number(form.minimumStockLevel))
        ) {
            return "Please enter a valid minimum stock level.";
        }

        if (
            form.minimumStockLevel !== "" &&
            Number(form.minimumStockLevel) < 0
        ) {
            return "Minimum stock level cannot be negative.";
        }

        return "";
    };

    // ============================================================
    // VIEW STOCK
    // ============================================================

    const handleView = async (stock) => {
        setViewError("");
        setViewLoading(true);
        setSelectedStock(null);

        try {
            const result = await apiGet(
                `/api/raw-material-stock/${getStockId(stock)}`
            );

            const record = result?.data;

            if (!record) {
                throw new Error("Stock details were not found.");
            }

            const materialName = normalizeMaterialName(
                record.rawMaterialName ||
                record.rawMaterial?.materialName ||
                stock.rawMaterialName ||
                ""
            );

            setSelectedStock({
                ...stock,
                ...record,
                stockDate: getDateOnly(
                    getStockDate(record) || getStockDate(stock)
                ),
                rawMaterialName: materialName,
                rawMaterialUnit:
                    record.rawMaterialUnit ||
                    record.rawMaterial?.unit ||
                    stock.rawMaterialUnit ||
                    getUnitForMaterial(materialName),
                recordStatus: getRecordStatus(record),
            });
        } catch (err) {
            console.error("Error fetching stock details:", err);
            setViewError(
                getErrorMessage(
                    err,
                    "Unable to load raw material stock details."
                )
            );
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        if (viewLoading) return;
        setSelectedStock(null);
        setViewError("");
    };

    // ============================================================
    // ADD STOCK
    // ============================================================

    const openAddModal = () => {
        setAddError("");
        setAddForm({ ...emptyAddForm });
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        if (addLoading) return;

        setShowAddModal(false);
        setAddError("");
        setAddForm({ ...emptyAddForm });
    };

    const handleAddChange = (event) => {
        const { name, value } = event.target;

        setAddForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setAddError("");
    };

    const handleCreateStock = async (event) => {
        event.preventDefault();

        const validationError = validateStockForm(addForm);

        if (validationError) {
            setAddError(validationError);
            return;
        }

        // FIX: include stockDate in the actual POST request.
        // HTML date input values are already in yyyy-MM-dd format.
        const payload = {
            stockDate: getDateOnly(addForm.stockDate),
            rawMaterialId: Number(addForm.rawMaterialId),
            currentStockLevel: Number(addForm.currentStockLevel),
            minimumStockLevel:
                addForm.minimumStockLevel === ""
                    ? null
                    : Number(addForm.minimumStockLevel),
            notes: addForm.notes.trim() || null,
        };

        try {
            setAddLoading(true);
            setAddError("");

            await apiPost("/api/raw-material-stock", payload);

            setShowAddModal(false);
            setAddForm({ ...emptyAddForm });

            await fetchStock();
        } catch (err) {
            console.error("Error creating stock:", err);
            setAddError(
                getErrorMessage(
                    err,
                    "Unable to create raw material stock."
                )
            );
        } finally {
            setAddLoading(false);
        }
    };

    // ============================================================
    // EDIT STOCK
    // ============================================================

    const handleEdit = async (stock) => {
        setEditError("");
        setEditingStock(null);

        try {
            const result = await apiGet(
                `/api/raw-material-stock/${getStockId(stock)}`
            );

            const data = result?.data;

            if (!data) {
                throw new Error("Stock details were not found.");
            }

            const materialName = normalizeMaterialName(
                data.rawMaterialName ||
                data.rawMaterial?.materialName ||
                stock.rawMaterialName ||
                ""
            );

            const materialId = getMaterialId(data) || getMaterialId(stock);

            const existingDate = getDateOnly(
                getStockDate(data) || getStockDate(stock)
            );

            const currentUnit =
                data.rawMaterialUnit ||
                data.rawMaterial?.unit ||
                stock.rawMaterialUnit ||
                getUnitForMaterial(materialName);

            const normalizedData = {
                ...stock,
                ...data,
                stockDate: existingDate,
                rawMaterialId: materialId,
                rawMaterialName: materialName,
                rawMaterialUnit: currentUnit,
                recordStatus: getRecordStatus(data),
            };

            setEditingStock(normalizedData);

            // FIX: initialize stockDate in editForm.
            setEditForm({
                stockDate: existingDate,
                rawMaterialId: String(materialId ?? ""),
                rawMaterialUnit: currentUnit,
                currentStockLevel: data.currentStockLevel ?? "",
                minimumStockLevel: data.minimumStockLevel ?? "",
                notes: data.notes || "",
            });
        } catch (err) {
            console.error("Error loading stock for edit:", err);
            setEditError(
                getErrorMessage(
                    err,
                    "Unable to load the stock record for editing."
                )
            );
        }
    };

    const closeEditModal = () => {
        if (editLoading) return;

        setEditingStock(null);
        setEditError("");
        setEditForm({ ...emptyEditForm });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setEditError("");
    };

    const handleUpdateStock = async (event) => {
        event.preventDefault();

        if (!editingStock) return;

        const validationError = validateStockForm(editForm);

        if (validationError) {
            setEditError(validationError);
            return;
        }

        // FIX: include stockDate in the actual PUT request.
        const payload = {
            stockDate: getDateOnly(editForm.stockDate),
            rawMaterialId: Number(editForm.rawMaterialId),
            currentStockLevel: Number(editForm.currentStockLevel),
            minimumStockLevel:
                editForm.minimumStockLevel === ""
                    ? null
                    : Number(editForm.minimumStockLevel),
            notes: editForm.notes.trim() || null,
        };

        try {
            setEditLoading(true);
            setEditError("");

            await apiPut(
                `/api/raw-material-stock/${getStockId(editingStock)}`,
                payload
            );

            setEditingStock(null);
            setEditForm({ ...emptyEditForm });

            await fetchStock();
        } catch (err) {
            console.error("Error updating stock:", err);
            setEditError(
                getErrorMessage(
                    err,
                    "Unable to update raw material stock."
                )
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ============================================================
    // DELETE — SOFT DELETE THROUGH BACKEND
    // ============================================================

    const handleDelete = (stock) => {
        if (!isActive(stock)) return;

        setDeleteError("");
        setDeletingStock(stock);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) return;

        setDeletingStock(null);
        setDeleteError("");
    };

    const handleConfirmDelete = async () => {
        if (!deletingStock) return;

        const stockId = getStockId(deletingStock);

        try {
            setDeleteLoading(true);
            setDeleteError("");

            await apiDelete(`/api/raw-material-stock/${stockId}`);

            setStockList((previous) =>
                previous.filter(
                    (stock) => String(getStockId(stock)) !== String(stockId)
                )
            );

            setDeletingStock(null);
            await fetchStock();
        } catch (err) {
            console.error("Error deleting stock:", err);
            setDeleteError(
                getErrorMessage(
                    err,
                    "Unable to delete raw material stock."
                )
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // ============================================================
    // PDF EXPORT
    // ============================================================

    const downloadPdf = () => {
        try {
            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const marginLeft = 10;
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const columnWidths = [
                13, 30, 29, 20, 24, 24, 23, 24, 52,
            ];

            doc.setFontSize(16);
            doc.text("SKCP - Raw Material Stock", marginLeft, 15);

            doc.setFontSize(9);

            const filterDescription = [
                selectedMaterialFilter
                    ? `Material: ${selectedMaterialFilter}`
                    : "Material: All",
                fromDate ? `From: ${formatDate(fromDate)}` : "From: All",
                toDate ? `To: ${formatDate(toDate)}` : "To: All",
                searchKeyword ? `Search: ${searchKeyword}` : "",
            ].filter(Boolean).join(" | ");

            doc.text(filterDescription, marginLeft, 22);
            doc.text(
                `Records: ${filteredStock.length}`,
                pageWidth - marginLeft,
                22,
                { align: "right" }
            );

            const headers = [
                "ID",
                "Date",
                "Raw Material",
                "Unit",
                "Current Stock",
                "Minimum Stock",
                "Stock Status",
                "Record Status",
                "Notes",
            ];

            const drawHeader = (y) => {
                let x = marginLeft;

                doc.setFont("helvetica", "bold");
                doc.setFontSize(7);

                headers.forEach((header, index) => {
                    doc.rect(x, y - 5, columnWidths[index], 9);
                    doc.text(header, x + 1, y, {
                        maxWidth: columnWidths[index] - 2,
                    });
                    x += columnWidths[index];
                });

                doc.setFont("helvetica", "normal");
            };

            let y = 32;
            drawHeader(y);
            y += 9;

            doc.setFontSize(7);

            filteredStock.forEach((stock) => {
                const values = [
                    getStockId(stock) || "-",
                    formatDate(getStockDate(stock)),
                    stock.rawMaterialName || "-",
                    stock.rawMaterialUnit || "-",
                    stock.currentStockLevel ?? "-",
                    stock.minimumStockLevel ?? "-",
                    stock.stockStatus || "-",
                    getRecordStatus(stock),
                    stock.notes || "-",
                ].map(String);

                const wrapped = values.map((value, index) =>
                    doc.splitTextToSize(value, columnWidths[index] - 2)
                );

                const lineCount = Math.max(
                    ...wrapped.map((lines) => lines.length),
                    1
                );

                const rowHeight = Math.max(8, lineCount * 3.5 + 2);

                if (y + rowHeight > pageHeight - 10) {
                    doc.addPage();
                    y = 15;
                    drawHeader(y);
                    y += 9;
                }

                let x = marginLeft;

                values.forEach((value, index) => {
                    doc.rect(x, y - 5, columnWidths[index], rowHeight);
                    doc.text(wrapped[index], x + 1, y, {
                        maxWidth: columnWidths[index] - 2,
                    });
                    x += columnWidths[index];
                });

                y += rowHeight;
            });

            if (filteredStock.length === 0) {
                doc.text(
                    "No stock records match the selected filters.",
                    marginLeft,
                    y + 3
                );
            }

            const fileDate = new Date().toISOString().slice(0, 10);
            doc.save(`SKCP_Raw_Material_Stock_${fileDate}.pdf`);
        } catch (err) {
            console.error("Error generating stock PDF:", err);
            setError(
                "Unable to generate PDF. Please check that jsPDF is installed."
            );
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="page raw-material-stock-page">
                <section className="card">
                    <h2>Raw Material Stock</h2>
                    <p>Loading raw material stock records...</p>
                </section>
            </div>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="page raw-material-stock-page">
            <section className="card">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <h2>Raw Material Stock</h2>
                        <p>
                            Manage raw material stock information and records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={openAddModal}
                    >
                        Add Stock
                    </button>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginTop: "16px",
                    }}
                >
                    <div
                        className="fld"
                        style={{ flex: "1 1 230px", minWidth: "200px" }}
                    >
                        <label htmlFor="raw-material-stock-search">Search</label>
                        <input
                            id="raw-material-stock-search"
                            type="text"
                            placeholder="Search stock records..."
                            value={searchKeyword}
                            onChange={(event) =>
                                setSearchKeyword(event.target.value)
                            }
                        />
                    </div>

                    <div
                        className="fld"
                        style={{ flex: "1 1 160px", minWidth: "150px" }}
                    >
                        <label htmlFor="stock-material-filter">Raw Material</label>
                        <select
                            id="stock-material-filter"
                            value={selectedMaterialFilter}
                            onChange={(event) =>
                                setSelectedMaterialFilter(event.target.value)
                            }
                        >
                            <option value="">All Materials</option>
                            {MATERIAL_NAME_OPTIONS.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div
                        className="fld"
                        style={{ flex: "1 1 145px", minWidth: "135px" }}
                    >
                        <label htmlFor="stock-from-date">From Date</label>
                        <input
                            id="stock-from-date"
                            type="date"
                            value={fromDate}
                            max={toDate || undefined}
                            onChange={(event) => setFromDate(event.target.value)}
                        />
                    </div>

                    <div
                        className="fld"
                        style={{ flex: "1 1 145px", minWidth: "135px" }}
                    >
                        <label htmlFor="stock-to-date">To Date</label>
                        <input
                            id="stock-to-date"
                            type="date"
                            value={toDate}
                            min={fromDate || undefined}
                            onChange={(event) => setToDate(event.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={clearFilters}
                        disabled={
                            !searchKeyword &&
                            !selectedMaterialFilter &&
                            !fromDate &&
                            !toDate
                        }
                    >
                        Clear
                    </button>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={downloadPdf}
                    >
                        Download PDF
                    </button>
                </div>

                {materialsError && (
                    <div className="form-error" style={{ marginTop: "12px" }}>
                        {materialsError}
                    </div>
                )}

                {error && (
                    <div className="form-error" style={{ marginTop: "12px" }}>
                        {error}
                    </div>
                )}
            </section>

            <section className="card">
                <h2>Raw Material Stock List</h2>
                <p>
                    {totalRecords} stock record{totalRecords === 1 ? "" : "s"}
                </p>

                {deleteError && !deletingStock && (
                    <div className="form-error">{deleteError}</div>
                )}

                {!error && totalRecords === 0 && (
                    <p>No stock records match the selected filters.</p>
                )}

                {!error && totalRecords > 0 && (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    {[
                                        ["ID", "rawMaterialStockId"],
                                        ["DATE", "stockDate"],
                                        ["RAW MATERIAL", "rawMaterialName"],
                                        ["UNIT", "rawMaterialUnit"],
                                        ["CURRENT STOCK", "currentStockLevel"],
                                        ["MINIMUM STOCK", "minimumStockLevel"],
                                        ["STOCK STATUS", "stockStatus"],
                                        ["RECORD STATUS", "recordStatus"],
                                    ].map(([label, key]) => (
                                        <th key={key}>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() => handleSort(key)}
                                            >
                                                {sortLabel(label, key)}
                                            </button>
                                        </th>
                                    ))}
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedRecords.map((stock) => (
                                    <tr key={getStockId(stock)}>
                                        <td>{getStockId(stock)}</td>
                                        <td>{formatDate(getStockDate(stock))}</td>
                                        <td>
                                            <strong>
                                                {stock.rawMaterialName || "-"}
                                            </strong>
                                        </td>
                                        <td>{stock.rawMaterialUnit || "-"}</td>
                                        <td>{stock.currentStockLevel ?? "-"}</td>
                                        <td>{stock.minimumStockLevel ?? "-"}</td>
                                        <td>{stock.stockStatus || "-"}</td>
                                        <td>
                                            <span className="badge bg">
                                                {getRecordStatus(stock)}
                                            </span>
                                        </td>
                                        <td>
                                            <div
                                                className="action-buttons"
                                                style={{
                                                    display: "flex",
                                                    gap: "6px",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="action-btn view-btn"
                                                    onClick={() => handleView(stock)}
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    className="action-btn edit-btn"
                                                    onClick={() => handleEdit(stock)}
                                                >
                                                    Edit
                                                </button>

                                                {isActive(stock) && (
                                                    <button
                                                        type="button"
                                                        className="action-btn delete-btn"
                                                        onClick={() => handleDelete(stock)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalRecords={totalRecords}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </div>
                )}
            </section>

            {/* VIEW MODAL */}
            <ViewModal
                isOpen={!!selectedStock || viewLoading || !!viewError}
                onClose={closeViewModal}
                title="Raw Material Stock Details"
                subtitle="View raw material stock information"
                loading={viewLoading}
                error={viewError}
                size="lg"
                footer={
                    <button
                        type="button"
                        className="btn"
                        onClick={closeViewModal}
                        disabled={viewLoading}
                    >
                        Close
                    </button>
                }
            >
                {selectedStock && (
                    <DetailGrid>
                        <DetailItem label="Stock ID" value={getStockId(selectedStock)} />
                        <DetailItem label="Date" value={formatDate(getStockDate(selectedStock))} />
                        <DetailItem label="Raw Material" value={selectedStock.rawMaterialName || "-"} />
                        <DetailItem label="Unit" value={selectedStock.rawMaterialUnit || "-"} />
                        <DetailItem label="Current Stock Level" value={selectedStock.currentStockLevel ?? "-"} />
                        <DetailItem label="Minimum Stock Level" value={selectedStock.minimumStockLevel ?? "-"} />
                        <DetailItem label="Stock Status" value={selectedStock.stockStatus || "-"} />
                        <DetailItem label="Record Status" value={getRecordStatus(selectedStock)} />
                        <DetailItem label="Last Updated" value={formatDateTime(selectedStock.lastUpdatedDate)} />
                        <DetailItem label="Created At" value={formatDateTime(selectedStock.createdAt)} />
                        <DetailItem label="Notes" value={selectedStock.notes || "-"} fullWidth />
                    </DetailGrid>
                )}
            </ViewModal>

            {/* ADD MODAL */}
            <FormModal
                isOpen={showAddModal}
                onClose={closeAddModal}
                title="Add Raw Material Stock"
                subtitle="Raw material stock record at the end of the day"
                onSubmit={handleCreateStock}
                submitLabel="Add Stock"
                cancelLabel="Cancel"
                saving={addLoading}
                error={addError}
                size="lg"
            >
                <div className="form-grid">
                    <div className="fld">
                        <label htmlFor="add-stock-material">
                            Raw Material <span>*</span>
                        </label>
                        <select
                            id="add-stock-material"
                            name="rawMaterialId"
                            value={addForm.rawMaterialId}
                            onChange={handleAddChange}
                            required
                        >
                            <option value="">Select Raw Material</option>
                            {rawMaterials.map((material) => (
                                <option
                                    key={material.rawMaterialId}
                                    value={material.rawMaterialId}
                                >
                                    {material.materialName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="fld">
                        <label htmlFor="add-stock-date">
                            Date <span>*</span>
                        </label>
                        <input
                            id="add-stock-date"
                            type="date"
                            name="stockDate"
                            value={addForm.stockDate}
                            onChange={handleAddChange}
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-stock-unit">Unit</label>
                        <input
                            id="add-stock-unit"
                            type="text"
                            value={addUnit}
                            placeholder="Auto-selected"
                            readOnly
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-current-stock-level">
                            Current Stock Level <span>*</span>
                        </label>
                        <input
                            id="add-current-stock-level"
                            type="number"
                            name="currentStockLevel"
                            min="0"
                            step="0.01"
                            value={addForm.currentStockLevel}
                            onChange={handleAddChange}
                            placeholder="Enter current stock"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-minimum-stock-level">
                            Minimum Stock Level
                        </label>
                        <input
                            id="add-minimum-stock-level"
                            type="number"
                            name="minimumStockLevel"
                            min="0"
                            step="0.01"
                            value={addForm.minimumStockLevel}
                            onChange={handleAddChange}
                            placeholder="Enter minimum stock"
                        />
                    </div>

                    <div className="fld f-full">
                        <label htmlFor="add-raw-material-stock-notes">Notes</label>
                        <textarea
                            id="add-raw-material-stock-notes"
                            name="notes"
                            rows="3"
                            maxLength="1000"
                            value={addForm.notes}
                            onChange={handleAddChange}
                            placeholder="Enter notes"
                        />
                    </div>
                </div>
            </FormModal>

            {/* EDIT MODAL */}
            <FormModal
                isOpen={!!editingStock}
                onClose={closeEditModal}
                title="Edit Raw Material Stock"
                subtitle={
                    editingStock
                        ? `Update stock information for Stock ID ${getStockId(editingStock)}`
                        : "Update raw material stock information"
                }
                onSubmit={handleUpdateStock}
                submitLabel="Update Stock"
                cancelLabel="Cancel"
                saving={editLoading}
                error={editError}
                size="lg"
            >
                {editingStock && (
                    <div className="form-grid">
                        <div className="fld">
                            <label htmlFor="edit-raw-material-stock-id">
                                Stock ID
                            </label>
                            <input
                                id="edit-raw-material-stock-id"
                                type="text"
                                value={getStockId(editingStock)}
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-stock-date">
                                Date <span>*</span>
                            </label>
                            <input
                                id="edit-stock-date"
                                type="date"
                                name="stockDate"
                                value={editForm.stockDate}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-raw-material-name">
                                Raw Material <span>*</span>
                            </label>
                            <select
                                id="edit-raw-material-name"
                                name="rawMaterialId"
                                value={editForm.rawMaterialId}
                                onChange={handleEditChange}
                                required
                            >
                                <option value="">Select Raw Material</option>
                                {rawMaterials.map((material) => (
                                    <option
                                        key={material.rawMaterialId}
                                        value={material.rawMaterialId}
                                    >
                                        {material.materialName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-raw-material-unit">Unit</label>
                            <select
                                id="edit-raw-material-unit"
                                name="rawMaterialUnit"
                                value={editForm.rawMaterialUnit}
                                onChange={handleEditChange}
                            >
                                <option value="">Select Unit</option>
                                {UNIT_OPTIONS.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-current-stock-level">
                                Current Stock Level <span>*</span>
                            </label>
                            <input
                                id="edit-current-stock-level"
                                type="number"
                                name="currentStockLevel"
                                min="0"
                                step="0.01"
                                value={editForm.currentStockLevel}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-minimum-stock-level">
                                Minimum Stock Level
                            </label>
                            <input
                                id="edit-minimum-stock-level"
                                type="number"
                                name="minimumStockLevel"
                                min="0"
                                step="0.01"
                                value={editForm.minimumStockLevel}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-stock-status">Stock Status</label>
                            <input
                                id="edit-stock-status"
                                type="text"
                                value={editingStock.stockStatus || "-"}
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-record-status">Record Status</label>
                            <input
                                id="edit-record-status"
                                type="text"
                                value={getRecordStatus(editingStock)}
                                disabled
                            />
                        </div>

                        <div className="fld f-full">
                            <label htmlFor="edit-raw-material-stock-notes">Notes</label>
                            <textarea
                                id="edit-raw-material-stock-notes"
                                name="notes"
                                rows="3"
                                maxLength="1000"
                                value={editForm.notes}
                                onChange={handleEditChange}
                                placeholder="Enter notes"
                            />
                        </div>
                    </div>
                )}
            </FormModal>

            {/* DELETE CONFIRMATION */}
            <DeleteConfirmModal
                isOpen={!!deletingStock}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Raw Material Stock"
                subtitle="Deactivate stock record"
                message="Are you sure you want to deactivate this raw material stock record?"
                itemName={
                    deletingStock
                        ? `${deletingStock.rawMaterialName || "Raw Material"} — ${formatDate(getStockDate(deletingStock))}`
                        : ""
                }
                confirming={deleteLoading}
                error={deleteError}
            />
        </div>
    );
}

export default RawMaterialStock;