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

function FinishedGoodsStock() {
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
    // ADD FINISHED GOODS STOCK MODAL
    // ============================================================

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [addForm, setAddForm] = useState({
        productId: "",
        currentStockLevel: "",
        minimumStockLevel: "",
        notes: "",
    });

    const [addLoading, setAddLoading] =
        useState(false);

    const [addError, setAddError] =
        useState("");

    // ============================================================
    // EDIT FINISHED GOODS STOCK MODAL
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
    // FETCH ALL FINISHED GOODS STOCK
    // ============================================================

    const fetchStock = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet(
                "/api/finished-goods-stock"
            );

            console.log(
                "Finished Goods Stock API response:",
                result
            );

            setStockList(result.data || []);
        } catch (err) {
            console.error(
                "Error fetching finished goods stock:",
                err
            );

            setError(
                "Unable to load finished goods stock. Please try again."
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
                    stock.finishedGoodsStockId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.productId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    stock.productName || ""
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

                String(stock.status || "")
                    .toLowerCase()
                    .includes(keyword) ||

                

                String(stock.notes || "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [stockList, searchKeyword]);

    // ============================================================
    // VIEW FINISHED GOODS STOCK
    // ============================================================

    const handleView = async (stock) => {
        setViewError("");
        setViewLoading(true);
        setSelectedStock(null);

        try {
            const result = await apiGet(
                `/api/finished-goods-stock/${stock.finishedGoodsStockId}`
            );

            console.log(
                "Finished Goods Stock details:",
                result
            );


            setSelectedStock(result.data);
        } catch (err) {
            console.error(
                "Error fetching finished goods stock details:",
                err
            );

            setViewError(
                err.message ||
                    "Unable to load finished goods stock details."
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
    // ADD FINISHED GOODS STOCK
    // ============================================================

    const openAddModal = () => {
        setAddError("");

        setAddForm({
            productId: "",
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
            productId: "",
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
    // CREATE FINISHED GOODS STOCK
    // ============================================================

    const handleCreateStock = async (event) => {
        event.preventDefault();

        setAddError("");

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!addForm.productId) {
            setAddError(
                "Product ID is required."
            );
            return;
        }

        if (Number(addForm.productId) <= 0) {
            setAddError(
                "Product ID must be greater than zero."
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
                "Current stock level is required."
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
            addForm.minimumStockLevel === "" ||
            Number.isNaN(
                Number(addForm.minimumStockLevel)
            )
        ) {
            setAddError(
                "Minimum stock level is required."
            );
            return;
        }

        if (
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
            productId:
                Number(addForm.productId),

            currentStockLevel:
                Number(addForm.currentStockLevel),

            minimumStockLevel:
                Number(addForm.minimumStockLevel),

            notes:
                addForm.notes.trim() || null,
        };

        try {
            setAddLoading(true);

            console.log(
                "Creating finished goods stock with payload:",
                payload
            );

            const result = await apiPost(
                "/api/finished-goods-stock",
                payload
            );

            console.log(
                "Finished Goods Stock created:",
                result
            );


            setShowAddModal(false);

            setAddForm({
                productId: "",
                currentStockLevel: "",
                minimumStockLevel: "",
                notes: "",
            });

            await fetchStock();
        } catch (err) {
            console.error(
                "Error creating finished goods stock:",
                err
            );

            setAddError(
                err.message ||
                    "Unable to create finished goods stock."
            );
        } finally {
            setAddLoading(false);
        }
    };

    // ============================================================
    // EDIT FINISHED GOODS STOCK
    // ============================================================

    const handleEdit = async (stock) => {
        setEditError("");
        setEditLoading(false);

        try {
            const result = await apiGet(
                `/api/finished-goods-stock/${stock.finishedGoodsStockId}`
            );

            console.log(
                "Finished Goods Stock edit details:",
                result
            );


            const stockData = result.data;

            setEditingStock(stockData);

            setEditForm({
                currentStockLevel:
                    stockData.currentStockLevel ?? "",

                minimumStockLevel:
                    stockData.minimumStockLevel ?? "",

                notes:
                    stockData.notes || "",
            });
        } catch (err) {
            console.error(
                "Error loading finished goods stock for edit:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to load the finished goods stock record for editing."
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
    // UPDATE FINISHED GOODS STOCK
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
                "Current stock level is required."
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
            editForm.minimumStockLevel === "" ||
            Number.isNaN(
                Number(editForm.minimumStockLevel)
            )
        ) {
            setEditError(
                "Minimum stock level is required."
            );
            return;
        }

        if (
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
                Number(
                    editForm.minimumStockLevel
                ),

            notes:
                editForm.notes.trim() || null,
        };

        try {
            setEditLoading(true);

            console.log(
                "Updating finished goods stock with payload:",
                payload
            );

            const result = await apiPut(
                `/api/finished-goods-stock/${editingStock.finishedGoodsStockId}`,
                payload
            );

            console.log(
                "Finished Goods Stock updated:",
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
                "Error updating finished goods stock:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to update finished goods stock."
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ============================================================
    // DELETE FINISHED GOODS STOCK
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
                "Deleting finished goods stock ID:",
                deletingStock.finishedGoodsStockId
            );

            const result = await apiDelete(
                `/api/finished-goods-stock/${deletingStock.finishedGoodsStockId}`
            );

            console.log(
                "Delete Finished Goods Stock response:",
                result
            );


            console.log(
                "Finished Goods Stock deleted:",
                result
            );

            setDeletingStock(null);

            await fetchStock();
        } catch (err) {
            console.error(
                "Error deleting finished goods stock:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete finished goods stock."
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
                        Finished Goods Stock
                    </h2>

                    <p>
                        Loading finished goods
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
                FINISHED GOODS STOCK HEADER
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
                            Finished Goods Stock
                        </h2>

                        <p>
                            Manage available
                            finished product
                            inventory.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            openAddModal
                        }
                    >
                        + Add Finished Goods Stock
                    </button>
                </div>

                <div className="fld production-search">
                    <label htmlFor="finished-goods-stock-search">
                        Search Finished Goods Stock
                    </label>

                    <input
                        id="finished-goods-stock-search"
                        type="text"
                        placeholder="Search by product, stock level, status..."
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
                FINISHED GOODS STOCK LIST
            ==================================================== */}

            <section className="card">
                <h2>
                    Finished Goods Stock List
                </h2>

                <p>
                    {
                        filteredStock.length
                    }{" "}
                    finished goods stock
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
                            No finished goods
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
                                            PRODUCT
                                        </th>

                                        <th>
                                            CURRENT STOCK
                                        </th>

                                        <th>
                                            MINIMUM STOCK
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                        <th>
                                            LAST UPDATED
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
                                                    stock.finishedGoodsStockId
                                                }
                                            >
                                                <td>
                                                    {
                                                        stock.finishedGoodsStockId
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            stock.productName ||
                                                            `Product ${stock.productId}`
                                                        }
                                                    </strong>

                                                    <br />

                                                    <small>
                                                        Product ID:{" "}
                                                        {
                                                            stock.productId
                                                        }
                                                    </small>
                                                </td>

                                                <td>
                                                    {
                                                        stock.currentStockLevel
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.minimumStockLevel
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.status ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        stock.lastUpdatedDate ||
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
                VIEW FINISHED GOODS STOCK MODAL
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
                title="Finished Goods Stock Details"
                subtitle="View finished goods stock information"
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
                            label="Finished Goods Stock ID"
                            value={
                                selectedStock.finishedGoodsStockId
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
                            label="Current Stock Level"
                            value={
                                selectedStock.currentStockLevel
                            }
                        />

                        <DetailItem
                            label="Minimum Stock Level"
                            value={
                                selectedStock.minimumStockLevel
                            }
                        />

                        <DetailItem
                            label="Stock Status"
                            value={
                                selectedStock.status ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Last Updated Date"
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
                ADD FINISHED GOODS STOCK MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    showAddModal
                }
                onClose={
                    closeAddModal
                }
                title="Add Finished Goods Stock"
                subtitle="Record new finished goods stock information"
                onSubmit={
                    handleCreateStock
                }
                submitLabel="Add Finished Goods Stock"
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
                        <label htmlFor="add-finished-goods-product-id">
                            Product ID
                        </label>

                        <input
                            id="add-finished-goods-product-id"
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
                        <label htmlFor="add-finished-goods-current-stock">
                            Current Stock Level
                        </label>

                        <input
                            id="add-finished-goods-current-stock"
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
                            placeholder="Enter current stock level"
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-finished-goods-minimum-stock">
                            Minimum Stock Level
                        </label>

                        <input
                            id="add-finished-goods-minimum-stock"
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
                            placeholder="Enter minimum stock level"
                            required
                        />
                    </div>

                    <div className="fld edit-full">
                        <label htmlFor="add-finished-goods-notes">
                            Notes
                        </label>

                        <textarea
                            id="add-finished-goods-notes"
                            name="notes"
                            rows="3"
                            maxLength="255"
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
                EDIT FINISHED GOODS STOCK MODAL
            ==================================================== */}

            <FormModal
                isOpen={
                    !!editingStock
                }
                onClose={
                    closeEditModal
                }
                title="Edit Finished Goods Stock"
                subtitle="Update finished goods stock information"
                onSubmit={
                    handleUpdateStock
                }
                submitLabel="Update Finished Goods Stock"
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
                            <label htmlFor="edit-finished-goods-stock-id">
                                Finished Goods Stock ID
                            </label>

                            <input
                                id="edit-finished-goods-stock-id"
                                type="text"
                                value={
                                    editingStock.finishedGoodsStockId
                                }
                                disabled
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-finished-goods-product-id">
                                Product ID
                            </label>

                            <input
                                id="edit-finished-goods-product-id"
                                type="text"
                                value={
                                    editingStock.productId
                                }
                                disabled
                            />

                            <small>
                                Product ID cannot be
                                changed during update.
                            </small>
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-finished-goods-current-stock">
                                Current Stock Level
                            </label>

                            <input
                                id="edit-finished-goods-current-stock"
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
                            <label htmlFor="edit-finished-goods-minimum-stock">
                                Minimum Stock Level
                            </label>

                            <input
                                id="edit-finished-goods-minimum-stock"
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
                                required
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="edit-finished-goods-status">
                                Status
                            </label>

                            <input
                                id="edit-finished-goods-status"
                                type="text"
                                value={
                                    editingStock.status ||
                                    "-"
                                }
                                disabled
                            />
                        </div>

                   

                        <div className="fld">
                            <label htmlFor="edit-finished-goods-last-updated">
                                Last Updated Date
                            </label>

                            <input
                                id="edit-finished-goods-last-updated"
                                type="text"
                                value={
                                    editingStock.lastUpdatedDate ||
                                    "-"
                                }
                                disabled
                            />
                        </div>

                        <div className="fld edit-full">
                            <label htmlFor="edit-finished-goods-notes">
                                Notes
                            </label>

                            <textarea
                                id="edit-finished-goods-notes"
                                name="notes"
                                rows="3"
                                maxLength="255"
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
                title="Delete Finished Goods Stock"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this finished goods stock record?"
                itemName={
                    deletingStock
                        ? `Finished Goods Stock ID: ${deletingStock.finishedGoodsStockId} — ${
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

export default FinishedGoodsStock;