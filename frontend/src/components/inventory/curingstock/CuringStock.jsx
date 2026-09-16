import { useEffect, useMemo, useState } from "react";

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

function CuringStock() {
    // ============================================================
    // STATE
    // ============================================================

    const [stockList, setStockList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchKeyword, setSearchKeyword] = useState("");

    // ============================================================
    // VIEW MODAL
    // ============================================================

    const [selectedStock, setSelectedStock] = useState(null);

    const [viewLoading, setViewLoading] = useState(false);

    const [viewError, setViewError] = useState("");

    // ============================================================
    // ADD CURING STOCK MODAL
    // ============================================================

    const [showAddModal, setShowAddModal] = useState(false);

    const [addForm, setAddForm] = useState({
        productionId: "",
        productId: "",
        quantity: "",
        productionDate: "",
        remarks: "",
    });

    const [addLoading, setAddLoading] = useState(false);

    const [addError, setAddError] = useState("");

    // ============================================================
    // EDIT CURING STOCK MODAL
    // ============================================================

    const [editingStock, setEditingStock] = useState(null);

    const [editForm, setEditForm] = useState({
        productId: "",
        quantity: "",
        productionDate: "",
        remarks: "",
    });

    const [editLoading, setEditLoading] = useState(false);

    const [editError, setEditError] = useState("");

    // ============================================================
    // DELETE MODAL
    // ============================================================

    const [deletingStock, setDeletingStock] = useState(null);

    const [deleteLoading, setDeleteLoading] = useState(false);

    const [deleteError, setDeleteError] = useState("");

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchStock();
    }, []);

    // ============================================================
    // FETCH ALL CURING STOCK
    // ============================================================

    const fetchStock = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet("/api/curing-stock");

            console.log(
                "Curing Stock API response:",
                result
            );

            setStockList(result.data || []);
        } catch (err) {
            console.error(
                "Error fetching curing stock:",
                err
            );

            setError(
                "Unable to load curing stock. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredStock = useMemo(() => {
        const keyword =
            searchKeyword.trim().toLowerCase();

        if (!keyword) {
            return stockList;
        }

        return stockList.filter((stock) => {
            return (
                String(
                    stock.curingStockId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.productionId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.productId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.productName || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.quantity || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.productionDate || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.expectedReadyDate || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.status || ""
                )
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [stockList, searchKeyword]);

    // ============================================================
    // VIEW CURING STOCK
    // ============================================================

    const handleView = async (stock) => {
        setViewError("");
        setViewLoading(true);
        setSelectedStock(null);

        try {
            const result = await apiGet(
                `/api/curing-stock/${stock.curingStockId}`
            );

            console.log(
                "Curing Stock details:",
                result
            );

            setSelectedStock(result.data);
        } catch (err) {
            console.error(
                "Error fetching curing stock details:",
                err
            );

            setViewError(
                err.message ||
                    "Unable to load curing stock details."
            );
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        if (viewLoading) {
            return;
        }

        setSelectedStock(null);
        setViewError("");
    };

    // ============================================================
    // ADD CURING STOCK
    // ============================================================

    const openAddModal = () => {
        setAddError("");

        setAddForm({
            productionId: "",
            productId: "",
            quantity: "",
            productionDate: "",
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
            productionId: "",
            productId: "",
            quantity: "",
            productionDate: "",
            remarks: "",
        });
    };

    const handleAddChange = (event) => {
        const { name, value } = event.target;

        setAddForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ============================================================
    // CREATE CURING STOCK
    // ============================================================

    const handleCreateStock = async (event) => {
        event.preventDefault();

        setAddError("");

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!addForm.productionId) {
            setAddError(
                "Please enter a production ID."
            );
            return;
        }

        if (!addForm.productId) {
            setAddError(
                "Please enter a product ID."
            );
            return;
        }

        if (
            addForm.quantity === "" ||
            Number.isNaN(Number(addForm.quantity))
        ) {
            setAddError(
                "Please enter a valid quantity."
            );
            return;
        }

        if (Number(addForm.quantity) < 0) {
            setAddError(
                "Quantity cannot be negative."
            );
            return;
        }

        if (!addForm.productionDate) {
            setAddError(
                "Please enter a production date."
            );
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const payload = {
            productionId:
                Number(addForm.productionId),

            productId:
                Number(addForm.productId),

            quantity:
                Number(addForm.quantity),

            productionDate:
                addForm.productionDate,

            remarks:
                addForm.remarks.trim() || null,
        };

        try {
            setAddLoading(true);

            console.log(
                "Creating curing stock with payload:",
                payload
            );

            const result = await apiPost(
                "/api/curing-stock",
                payload
            );

            console.log(
                "Curing Stock created:",
                result
            );

            setShowAddModal(false);

            setAddForm({
                productionId: "",
                productId: "",
                quantity: "",
                productionDate: "",
                remarks: "",
            });

            await fetchStock();
        } catch (err) {
            console.error(
                "Error creating curing stock:",
                err
            );

            setAddError(
                err.message ||
                    "Unable to create curing stock."
            );
        } finally {
            setAddLoading(false);
        }
    };

    // ============================================================
    // EDIT CURING STOCK
    // ============================================================

    const handleEdit = async (stock) => {
        setEditError("");
        setEditLoading(false);

        try {
            const result = await apiGet(
                `/api/curing-stock/${stock.curingStockId}`
            );

            console.log(
                "Curing Stock edit details:",
                result
            );

            const stockData = result.data;

            setEditingStock(stockData);

            setEditForm({
                productId:
                    stockData.productId ?? "",

                quantity:
                    stockData.quantity ?? "",

                productionDate:
                    stockData.productionDate ?? "",

                remarks:
                    stockData.remarks || "",
            });
        } catch (err) {
            console.error(
                "Error loading curing stock for edit:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to load the curing stock record for editing."
            );

            setEditingStock(stock);
        }
    };

    const closeEditModal = () => {
        if (editLoading) {
            return;
        }

        setEditingStock(null);
        setEditError("");

        setEditForm({
            productId: "",
            quantity: "",
            productionDate: "",
            remarks: "",
        });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ============================================================
    // UPDATE CURING STOCK
    // ============================================================

    const handleUpdateStock = async (event) => {
        event.preventDefault();

        if (!editingStock) {
            return;
        }

        setEditError("");

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!editForm.productId) {
            setEditError(
                "Please enter a product ID."
            );
            return;
        }

        if (
            editForm.quantity === "" ||
            Number.isNaN(Number(editForm.quantity))
        ) {
            setEditError(
                "Please enter a valid quantity."
            );
            return;
        }

        if (Number(editForm.quantity) < 0) {
            setEditError(
                "Quantity cannot be negative."
            );
            return;
        }

        if (!editForm.productionDate) {
            setEditError(
                "Please enter a production date."
            );
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const payload = {
            productId:
                Number(editForm.productId),

            quantity:
                Number(editForm.quantity),

            productionDate:
                editForm.productionDate,

            remarks:
                editForm.remarks.trim() || null,
        };

        try {
            setEditLoading(true);

            console.log(
                "Updating curing stock with payload:",
                payload
            );

            const result = await apiPut(
                `/api/curing-stock/${editingStock.curingStockId}`,
                payload
            );

            console.log(
                "Curing Stock updated:",
                result
            );

            setEditingStock(null);

            setEditForm({
                productId: "",
                quantity: "",
                productionDate: "",
                remarks: "",
            });

            await fetchStock();
        } catch (err) {
            console.error(
                "Error updating curing stock:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to update curing stock."
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ============================================================
    // DELETE CURING STOCK
    // ============================================================

    const handleDelete = (stock) => {
        setDeleteError("");
        setDeletingStock(stock);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) {
            return;
        }

        setDeletingStock(null);
        setDeleteError("");
    };

    const handleConfirmDelete = async () => {
        if (!deletingStock) {
            return;
        }

        try {
            setDeleteLoading(true);
            setDeleteError("");

            console.log(
                "Deleting curing stock ID:",
                deletingStock.curingStockId
            );

            const result = await apiDelete(
                `/api/curing-stock/${deletingStock.curingStockId}`
            );

            console.log(
                "Delete Curing Stock response:",
                result
            );

            console.log(
                "Curing Stock deleted:",
                result
            );

            setDeletingStock(null);

            await fetchStock();
        } catch (err) {
            console.error(
                "Error deleting curing stock:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete curing stock."
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
                    <h2>Curing Stock</h2>

                    <p>
                        Loading curing stock
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
        <>
            {/* ====================================================
                CURING STOCK HEADER
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
                            Curing Stock
                        </h2>

                        <p>
                            Manage blocks currently
                            undergoing curing.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            openAddModal
                        }
                    >
                        + Add Curing Stock
                    </button>
                </div>

                <div className="fld production-search">
                    <label htmlFor="curing-stock-search">
                        Search Curing Stock
                    </label>

                    <input
                        id="curing-stock-search"
                        type="text"
                        placeholder="Search by product, production ID, status..."
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
                CURING STOCK LIST
            ==================================================== */}

            <section className="card">
                <h2>
                    Curing Stock List
                </h2>

                <p>
                    {
                        filteredStock.length
                    }{" "}
                    curing stock
                    record(s)
                </p>

                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

                {!error &&
                    filteredStock.length ===
                        0 && (
                        <p>
                            No curing stock
                            records found.
                        </p>
                    )}

                {!error &&
                    filteredStock.length >
                        0 && (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            PRODUCTION ID
                                        </th>

                                        <th>
                                            PRODUCT
                                        </th>

                                        <th>
                                            QUANTITY
                                        </th>

                                        <th>
                                            PRODUCTION DATE
                                        </th>

                                        <th>
                                            EXPECTED READY
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
                                    {filteredStock.map(
                                        (
                                            stock
                                        ) => (
                                            <tr
                                                key={
                                                    stock.curingStockId
                                                }
                                            >
                                                <td>
                                                    {
                                                        stock.curingStockId
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.productionId
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            stock.productName ||
                                                            `Product ${stock.productId}`
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        stock.quantity
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.productionDate
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.expectedReadyDate ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.status ||
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
                                                                    stock
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
                                                                    stock
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
                                                                    stock
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
                VIEW CURING STOCK MODAL
            ==================================================== */}

            <ViewModal
                isOpen={
                    !!selectedStock ||
                    viewLoading ||
                    !!viewError
                }
                onClose={
                    closeViewModal
                }
                title="Curing Stock Details"
                subtitle="View curing stock information"
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
                {selectedStock && (
                    <DetailGrid>
                        <DetailItem
                            label="Curing Stock ID"
                            value={
                                selectedStock.curingStockId
                            }
                        />

                        <DetailItem
                            label="Production ID"
                            value={
                                selectedStock.productionId
                            }
                        />

                        <DetailItem
                            label="Product ID"
                            value={
                                selectedStock.productId
                            }
                        />

                        <DetailItem
                            label="Product"
                            value={
                                selectedStock.productName ||
                                `Product ${selectedStock.productId}`
                            }
                        />

                        <DetailItem
                            label="Quantity"
                            value={
                                selectedStock.quantity
                            }
                        />

                        <DetailItem
                            label="Production Date"
                            value={
                                selectedStock.productionDate ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Expected Ready Date"
                            value={
                                selectedStock.expectedReadyDate ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Status"
                            value={
                                selectedStock.status ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Created At"
                            value={
                                selectedStock.createdAt
                                    ? new Date(
                                          selectedStock.createdAt
                                      ).toLocaleString(
                                          "en-IN"
                                      )
                                    : "-"
                            }
                        />

                        <DetailItem
                            label="Updated At"
                            value={
                                selectedStock.updatedAt
                                    ? new Date(
                                          selectedStock.updatedAt
                                      ).toLocaleString(
                                          "en-IN"
                                      )
                                    : "-"
                            }
                        />

                        <DetailItem
                            label="Remarks"
                            value={
                                selectedStock.remarks ||
                                "-"
                            }
                            fullWidth
                        />
                    </DetailGrid>
                )}
            </ViewModal>

            {/* ====================================================
                ADD CURING STOCK MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    showAddModal
                }
                onClose={
                    closeAddModal
                }
                title="Add Curing Stock"
                subtitle="Record new curing stock information"
                onSubmit={
                    handleCreateStock
                }
                submitLabel="Add Curing Stock"
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
                        <label htmlFor="add-curing-production-id">
                            Production ID
                        </label>

                        <input
                            id="add-curing-production-id"
                            type="number"
                            name="productionId"
                            min="1"
                            value={
                                addForm.productionId
                            }
                            onChange={
                                handleAddChange
                            }
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
                            value={
                                addForm.productId
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter product ID"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-curing-quantity">
                            Quantity
                        </label>

                        <input
                            id="add-curing-quantity"
                            type="number"
                            name="quantity"
                            min="0"
                            step="0.01"
                            value={
                                addForm.quantity
                            }
                            onChange={
                                handleAddChange
                            }
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
                        <label htmlFor="add-curing-expected-ready-date">
                            Expected Ready Date
                        </label>

                        <input
                            id="add-curing-expected-ready-date"
                            type="text"
                            value={
                                addForm.productionDate
                                    ? (() => {
                                          const date =
                                              new Date(
                                                  `${addForm.productionDate}T00:00:00`
                                              );

                                          date.setDate(
                                              date.getDate() +
                                                  3
                                          );

                                          return date
                                              .toISOString()
                                              .split(
                                                  "T"
                                              )[0];
                                      })()
                                    : "-"
                            }
                            disabled
                        />

                        <small>
                            Calculated automatically
                            as Production Date + 3
                            days.
                        </small>
                    </div>

                    <div className="fld edit-full">
                        <label htmlFor="add-curing-remarks">
                            Remarks
                        </label>

                        <textarea
                            id="add-curing-remarks"
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
                EDIT CURING STOCK MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    !!editingStock
                }
                onClose={
                    closeEditModal
                }
                title="Edit Curing Stock"
                subtitle="Update curing stock information"
                onSubmit={
                    handleUpdateStock
                }
                submitLabel="Update Curing Stock"
                cancelLabel="Cancel"
                saving={
                    editLoading
                }
                error={
                    editError
                }
                size="lg"
            >
                {editingStock && (
                    <div className="edit-form-grid">
                        <div className="fld">
                            <label htmlFor="edit-curing-stock-id">
                                Curing Stock ID
                            </label>

                            <input
                                id="edit-curing-stock-id"
                                type="text"
                                value={
                                    editingStock.curingStockId
                                }
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
                                value={
                                    editingStock.productionId
                                }
                                disabled
                            />

                            <small>
                                Production ID cannot be
                                changed during update.
                            </small>
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-product-id">
                                Product ID
                            </label>

                            <input
                                id="edit-curing-product-id"
                                type="number"
                                name="productId"
                                min="1"
                                value={
                                    editForm.productId
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-quantity">
                                Quantity
                            </label>

                            <input
                                id="edit-curing-quantity"
                                type="number"
                                name="quantity"
                                min="0"
                                step="0.01"
                                value={
                                    editForm.quantity
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-production-date">
                                Production Date
                            </label>

                            <input
                                id="edit-curing-production-date"
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

                        <div className="fld">
                            <label htmlFor="edit-curing-expected-ready-date">
                                Expected Ready Date
                            </label>

                            <input
                                id="edit-curing-expected-ready-date"
                                type="text"
                                value={
                                    editForm.productionDate
                                        ? (() => {
                                              const date =
                                                  new Date(
                                                      `${editForm.productionDate}T00:00:00`
                                                  );

                                              date.setDate(
                                                  date.getDate() +
                                                      3
                                              );

                                              return date
                                                  .toISOString()
                                                  .split(
                                                      "T"
                                                  )[0];
                                          })()
                                        : "-"
                                }
                                disabled
                            />

                            <small>
                                Calculated automatically
                                as Production Date + 3
                                days.
                            </small>
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-curing-status">
                                Status
                            </label>

                            <input
                                id="edit-curing-status"
                                type="text"
                                value={
                                    editingStock.status ||
                                    "-"
                                }
                                disabled
                            />
                        </div>

                        <div className="fld edit-full">
                            <label htmlFor="edit-curing-remarks">
                                Remarks
                            </label>

                            <textarea
                                id="edit-curing-remarks"
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
                    !!deletingStock
                }
                onClose={
                    closeDeleteModal
                }
                onConfirm={
                    handleConfirmDelete
                }
                title="Delete Curing Stock"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this curing stock record?"
                itemName={
                    deletingStock
                        ? `Curing Stock ID: ${deletingStock.curingStockId} — ${
                              deletingStock.productName ||
                              `Product ${deletingStock.productId}`
                          }`
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

export default CuringStock;