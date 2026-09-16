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

function RawMaterialStock() {
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

    const [selectedStock, setSelectedStock] =
        useState(null);

    const [viewLoading, setViewLoading] =
        useState(false);

    const [viewError, setViewError] =
        useState("");

    // ============================================================
    // ADD STOCK MODAL
    // ============================================================

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [addForm, setAddForm] = useState({
        rawMaterialId: "",
        currentStockLevel: "",
        minimumStockLevel: "",
        notes: "",
    });

    const [addLoading, setAddLoading] =
        useState(false);

    const [addError, setAddError] =
        useState("");

    // ============================================================
    // EDIT STOCK MODAL
    // ============================================================

    const [editingStock, setEditingStock] =
        useState(null);

    const [editForm, setEditForm] = useState({
        currentStockLevel: "",
        minimumStockLevel: "",
        notes: "",
    });

    const [editLoading, setEditLoading] =
        useState(false);

    const [editError, setEditError] =
        useState("");

    // ============================================================
    // DELETE MODAL
    // ============================================================

    const [deletingStock, setDeletingStock] =
        useState(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const [deleteError, setDeleteError] =
        useState("");

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchStock();
    }, []);

    // ============================================================
    // FETCH ALL RAW MATERIAL STOCK
    // ============================================================

    const fetchStock = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet(
                "/api/raw-material-stock"
            );

            console.log(
                "Raw Material Stock API response:",
                result
            );

            setStockList(result.data || []);
        } catch (err) {
            console.error(
                "Error fetching raw material stock:",
                err
            );

            setError(
                "Unable to load raw material stock. Please try again."
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
                    stock.rawMaterialStockId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.rawMaterialId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.rawMaterialName || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.rawMaterialUnit || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.currentStockLevel || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.minimumStockLevel || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.stockStatus || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.recordStatus || ""
                )
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [stockList, searchKeyword]);

    // ============================================================
    // VIEW STOCK
    // ============================================================

    const handleView = async (stock) => {
        setViewError("");
        setViewLoading(true);
        setSelectedStock(null);

        try {
            const result = await apiGet(
                `/api/raw-material-stock/${stock.rawMaterialStockId}`
            );

            console.log(
                "Raw Material Stock details:",
                result
            );

            setSelectedStock(result.data);
        } catch (err) {
            console.error(
                "Error fetching stock details:",
                err
            );

            setViewError(
                err.message ||
                    "Unable to load raw material stock details."
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
    // ADD STOCK
    // ============================================================

    const openAddModal = () => {
        setAddError("");

        setAddForm({
            rawMaterialId: "",
            currentStockLevel: "",
            minimumStockLevel: "",
            notes: "",
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
            rawMaterialId: "",
            currentStockLevel: "",
            minimumStockLevel: "",
            notes: "",
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
    // CREATE STOCK
    // ============================================================

    const handleCreateStock = async (event) => {
        event.preventDefault();

        setAddError("");

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!addForm.rawMaterialId) {
            setAddError(
                "Please enter a raw material ID."
            );
            return;
        }

        if (
            addForm.currentStockLevel === "" ||
            Number.isNaN(
                Number(addForm.currentStockLevel)
            )
        ) {
            setAddError(
                "Please enter a valid current stock level."
            );
            return;
        }

        if (
            Number(addForm.currentStockLevel) < 0
        ) {
            setAddError(
                "Current stock level cannot be negative."
            );
            return;
        }

        if (
            addForm.minimumStockLevel !== "" &&
            Number.isNaN(
                Number(addForm.minimumStockLevel)
            )
        ) {
            setAddError(
                "Please enter a valid minimum stock level."
            );
            return;
        }

        if (
            addForm.minimumStockLevel !== "" &&
            Number(addForm.minimumStockLevel) < 0
        ) {
            setAddError(
                "Minimum stock level cannot be negative."
            );
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const payload = {
            rawMaterialId:
                Number(addForm.rawMaterialId),

            currentStockLevel:
                Number(addForm.currentStockLevel),

            minimumStockLevel:
                addForm.minimumStockLevel === ""
                    ? null
                    : Number(
                          addForm.minimumStockLevel
                      ),

            notes:
                addForm.notes.trim() || null,
        };

        try {
            setAddLoading(true);

            console.log(
                "Creating raw material stock with payload:",
                payload
            );

            const result = await apiPost(
                "/api/raw-material-stock",
                payload
            );

            console.log(
                "Raw Material Stock created:",
                result
            );

            setShowAddModal(false);

            setAddForm({
                rawMaterialId: "",
                currentStockLevel: "",
                minimumStockLevel: "",
                notes: "",
            });

            await fetchStock();
        } catch (err) {
            console.error(
                "Error creating raw material stock:",
                err
            );

            setAddError(
                err.message ||
                    "Unable to create raw material stock."
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
        setEditLoading(false);

        try {
            const result = await apiGet(
                `/api/raw-material-stock/${stock.rawMaterialStockId}`
            );

            console.log(
                "Raw Material Stock edit details:",
                result
            );

            const stockData = result.data;

            setEditingStock(stockData);

            setEditForm({
                currentStockLevel:
                    stockData.currentStockLevel ??
                    "",

                minimumStockLevel:
                    stockData.minimumStockLevel ??
                    "",

                notes:
                    stockData.notes || "",
            });
        } catch (err) {
            console.error(
                "Error loading stock for edit:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to load the stock record for editing."
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
            currentStockLevel: "",
            minimumStockLevel: "",
            notes: "",
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
    // UPDATE STOCK
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

        if (
            editForm.currentStockLevel === "" ||
            Number.isNaN(
                Number(editForm.currentStockLevel)
            )
        ) {
            setEditError(
                "Please enter a valid current stock level."
            );
            return;
        }

        if (
            Number(editForm.currentStockLevel) < 0
        ) {
            setEditError(
                "Current stock level cannot be negative."
            );
            return;
        }

        if (
            editForm.minimumStockLevel !== "" &&
            Number.isNaN(
                Number(editForm.minimumStockLevel)
            )
        ) {
            setEditError(
                "Please enter a valid minimum stock level."
            );
            return;
        }

        if (
            editForm.minimumStockLevel !== "" &&
            Number(editForm.minimumStockLevel) < 0
        ) {
            setEditError(
                "Minimum stock level cannot be negative."
            );
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const payload = {
            currentStockLevel:
                Number(
                    editForm.currentStockLevel
                ),

            minimumStockLevel:
                editForm.minimumStockLevel === ""
                    ? null
                    : Number(
                          editForm.minimumStockLevel
                      ),

            notes:
                editForm.notes.trim() || null,
        };

        try {
            setEditLoading(true);

            console.log(
                "Updating raw material stock with payload:",
                payload
            );

            const result = await apiPut(
                `/api/raw-material-stock/${editingStock.rawMaterialStockId}`,
                payload
            );

            console.log(
                "Raw Material Stock updated:",
                result
            );

            setEditingStock(null);

            setEditForm({
                currentStockLevel: "",
                minimumStockLevel: "",
                notes: "",
            });

            await fetchStock();
        } catch (err) {
            console.error(
                "Error updating raw material stock:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to update raw material stock."
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ============================================================
    // DELETE STOCK
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
                "Deleting raw material stock ID:",
                deletingStock.rawMaterialStockId
            );

            const result = await apiDelete(
                `/api/raw-material-stock/${deletingStock.rawMaterialStockId}`
            );

            console.log(
                "Delete Raw Material Stock response:",
                result
            );

            console.log(
                "Raw Material Stock deleted:",
                result
            );

            setDeletingStock(null);

            await fetchStock();
        } catch (err) {
            console.error(
                "Error deleting raw material stock:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete raw material stock."
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
                        Raw Material Stock
                    </h2>

                    <p>
                        Loading raw material
                        stock records...
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
                RAW MATERIAL STOCK HEADER
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
                            Raw Material Stock
                        </h2>

                        <p>
                            Manage raw material
                            stock information
                            and records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            openAddModal
                        }
                    >
                        + Add Stock
                    </button>
                </div>

                <div className="fld production-search">
                    <label htmlFor="raw-material-stock-search">
                        Search Raw Material Stock
                    </label>

                    <input
                        id="raw-material-stock-search"
                        type="text"
                        placeholder="Search by raw material, unit, stock level or status..."
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
                RAW MATERIAL STOCK LIST
            ==================================================== */}

            <section className="card">
                <h2>
                    Raw Material Stock List
                </h2>

                <p>
                    {
                        filteredStock.length
                    }{" "}
                    stock record(s)
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
                            No raw material
                            stock records
                            found.
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
                                            RAW MATERIAL
                                        </th>

                                        <th>
                                            UNIT
                                        </th>

                                        <th>
                                            CURRENT STOCK
                                        </th>

                                        <th>
                                            MINIMUM STOCK
                                        </th>

                                        <th>
                                            STOCK STATUS
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
                                                    stock.rawMaterialStockId
                                                }
                                            >
                                                <td>
                                                    {
                                                        stock.rawMaterialStockId
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            stock.rawMaterialName
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        stock.rawMaterialUnit ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.currentStockLevel
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.minimumStockLevel ??
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.stockStatus ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.recordStatus ||
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
                VIEW RAW MATERIAL STOCK MODAL
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
                title="Raw Material Stock Details"
                subtitle="View raw material stock information"
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
                            label="Stock ID"
                            value={
                                selectedStock.rawMaterialStockId
                            }
                        />

                        <DetailItem
                            label="Raw Material ID"
                            value={
                                selectedStock.rawMaterialId
                            }
                        />

                        <DetailItem
                            label="Raw Material"
                            value={
                                selectedStock.rawMaterialName
                            }
                        />

                        <DetailItem
                            label="Unit"
                            value={
                                selectedStock.rawMaterialUnit ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Current Stock Level"
                            value={
                                selectedStock.currentStockLevel
                            }
                        />

                        <DetailItem
                            label="Minimum Stock Level"
                            value={
                                selectedStock.minimumStockLevel ??
                                "-"
                            }
                        />

                        <DetailItem
                            label="Stock Status"
                            value={
                                selectedStock.stockStatus ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Record Status"
                            value={
                                selectedStock.recordStatus ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Last Updated"
                            value={
                                selectedStock.lastUpdatedDate ||
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
                            label="Notes"
                            value={
                                selectedStock.notes ||
                                "-"
                            }
                            fullWidth
                        />
                    </DetailGrid>
                )}
            </ViewModal>

            {/* ====================================================
                ADD RAW MATERIAL STOCK MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    showAddModal
                }
                onClose={
                    closeAddModal
                }
                title="Add Raw Material Stock"
                subtitle="Record new raw material stock information"
                onSubmit={
                    handleCreateStock
                }
                submitLabel="Add Stock"
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
                        <label htmlFor="add-raw-material-id">
                            Raw Material ID
                        </label>

                        <input
                            id="add-raw-material-id"
                            type="number"
                            name="rawMaterialId"
                            min="1"
                            value={
                                addForm.rawMaterialId
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter raw material ID"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-current-stock-level">
                            Current Stock Level
                        </label>

                        <input
                            id="add-current-stock-level"
                            type="number"
                            name="currentStockLevel"
                            min="0"
                            step="0.01"
                            value={
                                addForm.currentStockLevel
                            }
                            onChange={
                                handleAddChange
                            }
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
                            value={
                                addForm.minimumStockLevel
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter minimum stock"
                        />
                    </div>

                    <div className="fld edit-full">
                        <label htmlFor="add-raw-material-stock-notes">
                            Notes
                        </label>

                        <textarea
                            id="add-raw-material-stock-notes"
                            name="notes"
                            rows="3"
                            maxLength="1000"
                            value={
                                addForm.notes
                            }
                            onChange={
                                handleAddChange
                            }
                            placeholder="Enter notes"
                        />
                    </div>
                </div>
            </FormModal>

            {/* ====================================================
                EDIT RAW MATERIAL STOCK MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    !!editingStock
                }
                onClose={
                    closeEditModal
                }
                title="Edit Raw Material Stock"
                subtitle="Update raw material stock information"
                onSubmit={
                    handleUpdateStock
                }
                submitLabel="Update Stock"
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
                            <label htmlFor="edit-raw-material-stock-id">
                                Stock ID
                            </label>

                            <input
                                id="edit-raw-material-stock-id"
                                type="text"
                                value={
                                    editingStock.rawMaterialStockId
                                }
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-raw-material-id">
                                Raw Material ID
                            </label>

                            <input
                                id="edit-raw-material-id"
                                type="text"
                                value={
                                    editingStock.rawMaterialId
                                }
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-raw-material-name">
                                Raw Material
                            </label>

                            <input
                                id="edit-raw-material-name"
                                type="text"
                                value={
                                    editingStock.rawMaterialName ||
                                    ""
                                }
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-raw-material-unit">
                                Unit
                            </label>

                            <input
                                id="edit-raw-material-unit"
                                type="text"
                                value={
                                    editingStock.rawMaterialUnit ||
                                    "-"
                                }
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-current-stock-level">
                                Current Stock Level
                            </label>

                            <input
                                id="edit-current-stock-level"
                                type="number"
                                name="currentStockLevel"
                                min="0"
                                step="0.01"
                                value={
                                    editForm.currentStockLevel
                                }
                                onChange={
                                    handleEditChange
                                }
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
                                value={
                                    editForm.minimumStockLevel
                                }
                                onChange={
                                    handleEditChange
                                }
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-stock-status">
                                Stock Status
                            </label>

                            <input
                                id="edit-stock-status"
                                type="text"
                                value={
                                    editingStock.stockStatus ||
                                    "-"
                                }
                                disabled
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
                                    editingStock.recordStatus ||
                                    "-"
                                }
                                disabled
                            />
                        </div>

                        <div className="fld edit-full">
                            <label htmlFor="edit-raw-material-stock-notes">
                                Notes
                            </label>

                            <textarea
                                id="edit-raw-material-stock-notes"
                                name="notes"
                                rows="3"
                                maxLength="1000"
                                value={
                                    editForm.notes
                                }
                                onChange={
                                    handleEditChange
                                }
                                placeholder="Enter notes"
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
                title="Delete Raw Material Stock"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this raw material stock record?"
                itemName={
                    deletingStock
                        ? `Stock ID: ${deletingStock.rawMaterialStockId} — ${
                              deletingStock.rawMaterialName ||
                              "Raw Material"
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

export default RawMaterialStock;