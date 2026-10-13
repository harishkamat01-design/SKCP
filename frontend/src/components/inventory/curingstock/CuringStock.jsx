import { useEffect, useMemo, useState } from "react";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import { DetailGrid, DetailItem } from "../../ui/common/DetailGrid";

import {
    apiGet,
    apiPost,
    apiPut,
    apiPatch,
    apiDelete,
} from "../../../services/api";

import Pagination from "../../../components/ui/Pagination";
import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";
import "./CuringStock.css";

const EMPTY_ADD_FORM = {
    productionId: "",
    productId: "",
    quantity: "",
    productionDate: "",
    remarks: "",
};

const EMPTY_EDIT_FORM = {
    status: "CURING",
    remarks: "",
};

const CURING_STATUSES = ["CURING", "READY", "MOVED"];

function getTodayLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function addDaysToDate(dateValue, days) {
    if (!dateValue) return "";

    const date = new Date(`${String(dateValue).slice(0, 10)}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "";

    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Long date format for Production Date and Expected Ready Date.
// Example: 06 October 2026
function formatLongDate(dateValue) {
    if (!dateValue) return "-";

    const value = String(dateValue).slice(0, 10);
    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return dateValue;

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

// Short date format retained for messages and other existing displays.
function formatDate(dateValue) {
    if (!dateValue) return "-";

    const value = String(dateValue).slice(0, 10);
    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return dateValue;

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatDateTime(dateTimeValue) {
    if (!dateTimeValue) return "-";

    const date = new Date(dateTimeValue);

    if (Number.isNaN(date.getTime())) return dateTimeValue;

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}

function getErrorMessage(error, fallback) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallback
    );
}

function CuringStock() {
    const [stockList, setStockList] = useState([]);
    const [productList, setProductList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    // View modal
    const [selectedStock, setSelectedStock] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");

    // Add modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState(EMPTY_ADD_FORM);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");

    // Edit modal
    const [editingStock, setEditingStock] = useState(null);
    const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");

    // Delete modal
    const [deletingStock, setDeletingStock] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        fetchStock();
    }, []);

    // Fetch curing stock and products
    const fetchStock = async () => {
        try {
            setLoading(true);
            setError("");

            const [stockResult, productResult] = await Promise.all([
                apiGet("/api/curing-stock"),
                apiGet("/api/products"),
            ]);

            setStockList(stockResult?.data || []);
            setProductList(productResult?.data || []);
        } catch (err) {
            console.error("Error fetching curing stock:", err);

            setError(
                getErrorMessage(
                    err,
                    "Unable to load curing stock. Please try again."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    // Product details
    const stockWithProductDetails = useMemo(() => {
        return stockList.map((stock) => {
            const product = productList.find(
                (item) =>
                    Number(item.productId) === Number(stock.productId)
            );

            return {
                ...stock,
                productName:
                    stock.productName || product?.productName || "-",
                size: product?.size || stock.size || "-",
            };
        });
    }, [stockList, productList]);

    // Search
    const filteredStock = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();

        if (!keyword) return stockWithProductDetails;

        return stockWithProductDetails.filter((stock) => {
            const searchableValues = [
                stock.curingStockId,
                stock.productionId,
                stock.productId,
                stock.productName,
                stock.size,
                stock.quantity,
                stock.productionDate,
                stock.expectedReadyDate,
                stock.status,
                stock.remarks,
            ];

            return searchableValues.some((value) =>
                String(value ?? "").toLowerCase().includes(keyword)
            );
        });
    }, [stockWithProductDetails, searchKeyword]);

    // Sorting
    const {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    } = useTableSort(filteredStock, "curingStockId", "desc");

    // Pagination
    const {
        currentPage,
        pageSize,
        totalPages,
        totalRecords,
        paginatedRecords,
        handlePageChange,
        handlePageSizeChange,
    } = usePagination(sortedRecords, 10);

    // Status and date helpers
    const getExpectedReadyDate = (stock) => {
        return (
            stock?.expectedReadyDate ||
            addDaysToDate(stock?.productionDate, 3)
        );
    };

    const isReadyDateReached = (stock) => {
        const expectedDate = getExpectedReadyDate(stock);

        return Boolean(
            expectedDate &&
            getTodayLocalDate() >= String(expectedDate).slice(0, 10)
        );
    };

    const getStatusOptions = (currentStatus) => {
        if (currentStatus === "CURING") {
            return ["CURING", "READY"];
        }

        if (currentStatus === "READY") {
            return ["READY", "MOVED"];
        }

        if (currentStatus === "MOVED") {
            return ["MOVED"];
        }

        return [currentStatus || "CURING"];
    };

    // View curing stock
    const handleView = async (stock) => {
        setViewError("");
        setViewLoading(true);
        setSelectedStock(null);

        try {
            const result = await apiGet(
                `/api/curing-stock/${stock.curingStockId}`
            );

            const stockData = result?.data;
            const product = productList.find(
                (item) =>
                    Number(item.productId) === Number(stockData?.productId)
            );

            setSelectedStock({
                ...stockData,
                productName:
                    stockData?.productName || product?.productName || "-",
                size: product?.size || stockData?.size || "-",
            });
        } catch (err) {
            console.error("Error fetching curing stock details:", err);

            setViewError(
                getErrorMessage(
                    err,
                    "Unable to load curing stock details."
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

    // Add curing stock
    const openAddModal = () => {
        setAddError("");
        setAddForm({ ...EMPTY_ADD_FORM });
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        if (addLoading) return;

        setShowAddModal(false);
        setAddError("");
        setAddForm({ ...EMPTY_ADD_FORM });
    };

    const handleAddChange = (event) => {
        const { name, value } = event.target;

        setAddForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreateStock = async (event) => {
        event.preventDefault();
        setAddError("");

        if (!addForm.productionId || Number(addForm.productionId) < 1) {
            setAddError("Please enter a valid production ID.");
            return;
        }

        if (!addForm.productId || Number(addForm.productId) < 1) {
            setAddError("Please enter a valid product ID.");
            return;
        }

        if (
            addForm.quantity === "" ||
            !Number.isFinite(Number(addForm.quantity)) ||
            Number(addForm.quantity) <= 0
        ) {
            setAddError("Quantity must be greater than zero.");
            return;
        }

        if (!addForm.productionDate) {
            setAddError("Please enter a production date.");
            return;
        }

        const payload = {
            productionId: Number(addForm.productionId),
            productId: Number(addForm.productId),
            quantity: Number(addForm.quantity),
            productionDate: addForm.productionDate,
            remarks: addForm.remarks.trim() || null,
        };

        try {
            setAddLoading(true);

            await apiPost("/api/curing-stock", payload);

            setShowAddModal(false);
            setAddForm({ ...EMPTY_ADD_FORM });

            await fetchStock();
        } catch (err) {
            console.error("Error creating curing stock:", err);

            setAddError(
                getErrorMessage(err, "Unable to create curing stock.")
            );
        } finally {
            setAddLoading(false);
        }
    };

    // Edit curing stock
    const handleEdit = async (stock) => {
        setEditError("");
        setEditLoading(false);

        try {
            const result = await apiGet(
                `/api/curing-stock/${stock.curingStockId}`
            );

            const stockData = result?.data;

            if (!stockData) {
                throw new Error("Curing stock details were not returned.");
            }

            const product = productList.find(
                (item) =>
                    Number(item.productId) === Number(stockData.productId)
            );

            const normalizedStock = {
                ...stockData,
                productName:
                    stockData.productName || product?.productName || "-",
                size: product?.size || stockData.size || "-",
            };

            setEditingStock(normalizedStock);

            setEditForm({
                status: stockData.status || "CURING",
                remarks: stockData.remarks || "",
            });
        } catch (err) {
            console.error("Error loading curing stock for edit:", err);

            setEditError(
                getErrorMessage(
                    err,
                    "Unable to load the curing stock record for editing."
                )
            );
        }
    };

    const closeEditModal = () => {
        if (editLoading) return;

        setEditingStock(null);
        setEditError("");
        setEditForm({ ...EMPTY_EDIT_FORM });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Update status and remarks
    const handleUpdateStock = async (event) => {
        event.preventDefault();

        if (!editingStock) return;

        setEditError("");

        const originalStatus = editingStock.status || "CURING";
        const requestedStatus = editForm.status;

        const remarksChanged =
            (editForm.remarks || "").trim() !==
            (editingStock.remarks || "").trim();

        const statusChanged = requestedStatus !== originalStatus;

        if (!CURING_STATUSES.includes(requestedStatus)) {
            setEditError("Please select a valid curing status.");
            return;
        }

        if (statusChanged) {
            const validTransition =
                (originalStatus === "CURING" &&
                    requestedStatus === "READY") ||
                (originalStatus === "READY" &&
                    requestedStatus === "MOVED");

            if (!validTransition) {
                setEditError(
                    "Invalid status transition. Only CURING → READY and READY → MOVED are allowed."
                );
                return;
            }

            if (
                originalStatus === "CURING" &&
                requestedStatus === "READY" &&
                !isReadyDateReached(editingStock)
            ) {
                setEditError(
                    `This stock cannot be marked READY before ${formatLongDate(
                        getExpectedReadyDate(editingStock)
                    )}.`
                );
                return;
            }
        }

        if (!statusChanged && !remarksChanged) {
            setEditingStock(null);
            setEditForm({ ...EMPTY_EDIT_FORM });
            return;
        }

        if (remarksChanged && originalStatus !== "CURING") {
            setEditError(
                "Remarks can only be updated while the stock status is CURING. Save the status separately if needed."
            );
            return;
        }

        try {
            setEditLoading(true);

            // Save remarks before any status transition.
            // The required fields are included because the PUT DTO validates them.
            if (remarksChanged) {
                await apiPut(
                    `/api/curing-stock/${editingStock.curingStockId}`,
                    {
                        productionId: Number(editingStock.productionId),
                        productId: Number(editingStock.productId),
                        quantity: Number(editingStock.quantity),
                        productionDate: String(
                            editingStock.productionDate
                        ).slice(0, 10),
                        remarks: editForm.remarks.trim() || null,
                    }
                );
            }

            // Change status through the dedicated PATCH endpoint.
            if (statusChanged) {
                await apiPatch(
                    `/api/curing-stock/${editingStock.curingStockId}/status`,
                    {
                        status: requestedStatus,
                    }
                );
            }

            setEditingStock(null);
            setEditForm({ ...EMPTY_EDIT_FORM });

            await fetchStock();
        } catch (err) {
            console.error("Error updating curing stock:", err);

            setEditError(
                getErrorMessage(
                    err,
                    "Unable to update curing stock. The latest server status will be reloaded."
                )
            );

            await fetchStock();
        } finally {
            setEditLoading(false);
        }
    };

    // Delete curing stock
    const handleDelete = (stock) => {
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

        try {
            setDeleteLoading(true);
            setDeleteError("");

            await apiDelete(
                `/api/curing-stock/${deletingStock.curingStockId}`
            );

            setDeletingStock(null);

            await fetchStock();
        } catch (err) {
            console.error("Error deleting curing stock:", err);

            setDeleteError(
                getErrorMessage(err, "Unable to delete curing stock.")
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="page curing-stock-page">
                <section className="card">
                    <h2>Curing Stock</h2>
                    <p>Loading curing stock records...</p>
                </section>
            </div>
        );
    }

    // Main UI
    return (
        <div className="page curing-stock-page">
            {/* Header and search */}
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
                        <h2>Curing Stock</h2>
                        <p>Manage blocks currently undergoing curing.</p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={openAddModal}
                    >
                        Add Curing Stock
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
                        className="fld"
                        style={{ width: "420px", maxWidth: "100%" }}
                    >
                        <label htmlFor="curing-stock-search">
                            Search Curing Stock
                        </label>

                        <input
                            id="curing-stock-search"
                            type="text"
                            placeholder="Search by product, size, production ID, status..."
                            value={searchKeyword}
                            onChange={(event) =>
                                setSearchKeyword(event.target.value)
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={() => setSearchKeyword("")}
                        disabled={!searchKeyword}
                    >
                        Clear
                    </button>
                </div>
            </section>

            {/* Stock table */}
            <section className="card">
                <h2>Curing Stock List</h2>

                <p>
                    {totalRecords} curing stock record
                    {totalRecords === 1 ? "" : "s"}
                </p>

                {error && <div className="form-error">{error}</div>}

                {!error && totalRecords === 0 && (
                    <p>No curing stock records found.</p>
                )}

                {!error && totalRecords > 0 && (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    {[
                                        ["curingStockId", "ID"],
                                        ["productionId", "PRODUCTION ID"],
                                        ["productName", "PRODUCT"],
                                        ["size", "SIZE"],
                                        ["quantity", "QUANTITY"],
                                        ["productionDate", "PRODUCTION DATE"],
                                        ["expectedReadyDate", "EXPECTED READY"],
                                        ["status", "STATUS"],
                                    ].map(([key, label]) => (
                                        <th key={key}>
                                            <button
                                                type="button"
                                                className="table-sort-btn"
                                                onClick={() => handleSort(key)}
                                            >
                                                {label}
                                                {sortKey === key &&
                                                    (sortDirection === "asc"
                                                        ? " ▲"
                                                        : " ▼")}
                                            </button>
                                        </th>
                                    ))}
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedRecords.map((stock) => {
                                    const due = isReadyDateReached(stock);

                                    return (
                                        <tr key={stock.curingStockId}>
                                            <td>{stock.curingStockId}</td>
                                            <td>{stock.productionId}</td>
                                            <td>
                                                <strong>
                                                    {stock.productName ||
                                                        `Product ${stock.productId}`}
                                                </strong>
                                            </td>
                                            <td>{stock.size || "-"}</td>
                                            <td>{stock.quantity}</td>
                                            <td>
                                                {formatLongDate(
                                                    stock.productionDate
                                                )}
                                            </td>
                                            <td
                                                style={
                                                    stock.status === "CURING" && due
                                                        ? {
                                                              backgroundColor: "#fff3cd",
                                                              fontWeight: 600,
                                                          }
                                                        : undefined
                                                }
                                                title={
                                                    stock.status === "CURING" && due
                                                        ? "Curing period completed. Ready for manual status update."
                                                        : undefined
                                                }
                                            >
                                                {formatLongDate(
                                                    getExpectedReadyDate(stock)
                                                )}
                                                {stock.status === "CURING" &&
                                                    due &&
                                                    " ✓"}
                                            </td>
                                            <td>{stock.status || "-"}</td>
                                            <td>
                                                <div
                                                    className="action-buttons"
                                                    style={{
                                                        display: "flex",
                                                        gap: "6px",
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        className="action-btn view-btn"
                                                        onClick={() =>
                                                            handleView(stock)
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn edit-btn"
                                                        onClick={() =>
                                                            handleEdit(stock)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn delete-btn"
                                                        onClick={() =>
                                                            handleDelete(stock)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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

            {/* View modal */}
            <ViewModal
                isOpen={!!selectedStock || viewLoading || !!viewError}
                onClose={closeViewModal}
                title="Curing Stock Details"
                subtitle="View curing stock information"
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
                        <DetailItem
                            label="Curing Stock ID"
                            value={selectedStock.curingStockId}
                        />
                        <DetailItem
                            label="Production ID"
                            value={selectedStock.productionId}
                        />
                        <DetailItem
                            label="Product ID"
                            value={selectedStock.productId}
                        />
                        <DetailItem
                            label="Product"
                            value={
                                selectedStock.productName ||
                                `Product ${selectedStock.productId}`
                            }
                        />
                        <DetailItem
                            label="Size"
                            value={selectedStock.size || "-"}
                        />
                        <DetailItem
                            label="Quantity"
                            value={selectedStock.quantity}
                        />
                        <DetailItem
                            label="Production Date"
                            value={formatLongDate(selectedStock.productionDate)}
                        />
                        <DetailItem
                            label="Expected Ready Date"
                            value={formatLongDate(
                                getExpectedReadyDate(selectedStock)
                            )}
                        />
                        <DetailItem
                            label="Status"
                            value={selectedStock.status || "-"}
                        />
                        <DetailItem
                            label="Created At"
                            value={formatDateTime(selectedStock.createdAt)}
                        />
                        <DetailItem
                            label="Updated At"
                            value={formatDateTime(selectedStock.updatedAt)}
                        />
                        <DetailItem
                            label="Remarks"
                            value={selectedStock.remarks || "-"}
                            fullWidth
                        />
                    </DetailGrid>
                )}
            </ViewModal>

            {/* Add modal */}
            <FormModal
                isOpen={showAddModal}
                onClose={closeAddModal}
                title="Add Curing Stock"
                subtitle="Record new curing stock information"
                onSubmit={handleCreateStock}
                submitLabel="Add Curing Stock"
                cancelLabel="Cancel"
                saving={addLoading}
                error={addError}
                size="lg"
            >
                <div className="form-grid">
                    <div className="fld">
                        <label htmlFor="add-curing-production-id">
                            Production ID
                        </label>
                        <input
                            id="add-curing-production-id"
                            type="number"
                            name="productionId"
                            min="1"
                            value={addForm.productionId}
                            onChange={handleAddChange}
                            placeholder="Enter production ID"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-curing-product-id">
                            Product ID
                        </label>
                        <input
                            id="add-curing-product-id"
                            type="number"
                            name="productId"
                            min="1"
                            value={addForm.productId}
                            onChange={handleAddChange}
                            placeholder="Enter product ID"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-curing-quantity">Quantity</label>
                        <input
                            id="add-curing-quantity"
                            type="number"
                            name="quantity"
                            min="0.01"
                            step="0.01"
                            value={addForm.quantity}
                            onChange={handleAddChange}
                            placeholder="Enter quantity"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-curing-production-date">
                            Production Date
                        </label>
                        <input
                            id="add-curing-production-date"
                            type="date"
                            name="productionDate"
                            value={addForm.productionDate}
                            onChange={handleAddChange}
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-curing-expected-ready-date">
                            Expected Ready Date
                        </label>
                        <input
                            id="add-curing-expected-ready-date"
                            type="text"
                            value={
                                addForm.productionDate
                                    ? formatLongDate(
                                          addDaysToDate(
                                              addForm.productionDate,
                                              3
                                          )
                                      )
                                    : "-"
                            }
                            disabled
                        />
                        <small>
                            Calculated automatically as Production Date + 3 days.
                        </small>
                    </div>

                    <div className="fld f-full">
                        <label htmlFor="add-curing-remarks">Remarks</label>
                        <textarea
                            id="add-curing-remarks"
                            name="remarks"
                            rows="3"
                            maxLength="255"
                            value={addForm.remarks}
                            onChange={handleAddChange}
                            placeholder="Enter remarks"
                        />
                    </div>
                </div>
            </FormModal>

            {/* Edit modal */}
            <FormModal
                isOpen={!!editingStock}
                onClose={closeEditModal}
                title="Edit Curing Stock"
                subtitle="Update status or remarks"
                onSubmit={handleUpdateStock}
                submitLabel="Save Changes"
                cancelLabel="Cancel"
                saving={editLoading}
                error={editError}
                size="lg"
            >
                {editingStock && (
                    <div className="form-grid">
                        <div className="fld">
                            <label htmlFor="edit-curing-stock-id">
                                Curing Stock ID
                            </label>
                            <input
                                id="edit-curing-stock-id"
                                type="text"
                                value={editingStock.curingStockId ?? ""}
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-production-id">
                                Production ID
                            </label>
                            <input
                                id="edit-curing-production-id"
                                type="text"
                                value={editingStock.productionId ?? ""}
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-product-id">
                                Product ID
                            </label>
                            <input
                                id="edit-curing-product-id"
                                type="text"
                                value={editingStock.productId ?? ""}
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-product-name">
                                Product
                            </label>
                            <input
                                id="edit-curing-product-name"
                                type="text"
                                value={
                                    editingStock.productName ||
                                    `Product ${editingStock.productId}`
                                }
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-size">Size</label>
                            <input
                                id="edit-curing-size"
                                type="text"
                                value={editingStock.size || "-"}
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-quantity">
                                Quantity
                            </label>
                            <input
                                id="edit-curing-quantity"
                                type="text"
                                value={editingStock.quantity ?? ""}
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-production-date">
                                Production Date
                            </label>
                            <input
                                id="edit-curing-production-date"
                                type="text"
                                value={formatLongDate(
                                    editingStock.productionDate
                                )}
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-expected-ready-date">
                                Expected Ready Date
                            </label>
                            <input
                                id="edit-curing-expected-ready-date"
                                type="text"
                                value={formatLongDate(
                                    getExpectedReadyDate(editingStock)
                                )}
                                disabled
                            />
                            <small>
                                Production Date + 3 days. READY is allowed only
                                on or after this date.
                            </small>
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-status">Status</label>
                            <select
                                id="edit-curing-status"
                                name="status"
                                value={editForm.status}
                                onChange={handleEditChange}
                                disabled={editLoading}
                                required
                            >
                                {getStatusOptions(
                                    editingStock.status || "CURING"
                                ).map((status) => {
                                    const isEarlyReady =
                                        status === "READY" &&
                                        !isReadyDateReached(editingStock);

                                    return (
                                        <option
                                            key={status}
                                            value={status}
                                            disabled={isEarlyReady}
                                        >
                                            {status}
                                            {isEarlyReady
                                                ? " (Not yet due)"
                                                : ""}
                                        </option>
                                    );
                                })}
                            </select>

                            {editingStock.status === "CURING" &&
                                !isReadyDateReached(editingStock) && (
                                    <small>
                                        READY becomes available on{" "}
                                        {formatLongDate(
                                            getExpectedReadyDate(editingStock)
                                        )}
                                        .
                                    </small>
                                )}

                            {editingStock.status === "READY" && (
                                <small>
                                    After the stock has transferred successfully,
                                    change the status to MOVED.
                                </small>
                            )}

                            {editingStock.status === "MOVED" && (
                                <small>
                                    This stock has been moved. Its status cannot
                                    be changed back.
                                </small>
                            )}
                        </div>

                        <div className="fld f-full">
                            <label htmlFor="edit-curing-remarks">Remarks</label>
                            <textarea
                                id="edit-curing-remarks"
                                name="remarks"
                                rows="3"
                                maxLength="255"
                                value={editForm.remarks}
                                onChange={handleEditChange}
                                placeholder="Enter remarks"
                                disabled={
                                    editLoading ||
                                    editingStock.status !== "CURING"
                                }
                            />

                            {editingStock.status !== "CURING" && (
                                <small>
                                    Remarks cannot be edited after the stock
                                    leaves the CURING status.
                                </small>
                            )}
                        </div>
                    </div>
                )}
            </FormModal>

            {/* Delete confirmation */}
            <DeleteConfirmModal
                isOpen={!!deletingStock}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Curing Stock"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this curing stock record?"
                itemName={
                    deletingStock
                        ? `Curing Stock ID: ${
                              deletingStock.curingStockId
                          } — ${
                              deletingStock.productName ||
                              `Product ${deletingStock.productId}`
                          }`
                        : ""
                }
                confirming={deleteLoading}
                error={deleteError}
            />
        </div>
    );
}

export default CuringStock;