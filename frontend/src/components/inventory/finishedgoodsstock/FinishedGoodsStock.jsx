import { useEffect, useMemo, useState } from "react";

function FinishedGoodsStock() {
    const API_URL =
        "http://localhost:8080/api/finished-goods-stock";

    // ============================================================
    // STATE
    // ============================================================

    const [stockList, setStockList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchKeyword, setSearchKeyword] = useState("");

    const [selectedStock, setSelectedStock] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        productId: "",
        currentStockLevel: "",
        minimumStockLevel: "",
        notes: ""
    });

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // ============================================================
    // FETCH ALL FINISHED GOODS STOCK
    // ============================================================

    const fetchStock = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch finished goods stock (${response.status})`
                );
            }

            const result = await response.json();

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
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchStock();
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredStock = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();

        if (!keyword) {
            return stockList;
        }

        return stockList.filter((stock) => {
            return (
                String(stock.finishedGoodsStockId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.productId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.currentStockLevel || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.minimumStockLevel || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.status || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.recordStatus || "")
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

    const handleView = async (id) => {
        try {
            setError("");

            const response = await fetch(
                `${API_URL}/${id}`
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch finished goods stock details (${response.status})`
                );
            }

            const result = await response.json();

            console.log(
                "Finished Goods Stock details:",
                result
            );

            setSelectedStock(result.data);
            setShowViewModal(true);
        } catch (err) {
            console.error(
                "Error fetching finished goods stock details:",
                err
            );

            setError(
                "Unable to load finished goods stock details."
            );
        }
    };

    // ============================================================
    // OPEN CREATE FORM
    // ============================================================

    const handleAdd = () => {
        setEditingId(null);

        setFormData({
            productId: "",
            currentStockLevel: "",
            minimumStockLevel: "",
            notes: ""
        });

        setFormError("");
        setShowFormModal(true);
    };

    // ============================================================
    // OPEN EDIT FORM
    // ============================================================

    const handleEdit = async (id) => {
        try {
            setFormError("");
            setError("");

            const response = await fetch(
                `${API_URL}/${id}`
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch finished goods stock details (${response.status})`
                );
            }

            const result = await response.json();

            const stock = result.data;

            setEditingId(id);

            setFormData({
                productId: stock.productId ?? "",
                currentStockLevel:
                    stock.currentStockLevel ?? "",
                minimumStockLevel:
                    stock.minimumStockLevel ?? "",
                notes: stock.notes ?? ""
            });

            setShowFormModal(true);
        } catch (err) {
            console.error(
                "Error loading finished goods stock for edit:",
                err
            );

            setError(
                "Unable to load the finished goods stock record for editing."
            );
        }
    };

    // ============================================================
    // FORM CHANGE
    // ============================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ============================================================
    // CREATE / UPDATE
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");

        // --------------------------------------------------------
        // BASIC FRONTEND VALIDATION
        // --------------------------------------------------------

        if (!formData.productId) {
            setFormError("Product ID is required.");
            return;
        }

        if (Number(formData.productId) <= 0) {
            setFormError("Product ID must be greater than zero.");
            return;
        }

        if (formData.currentStockLevel === "") {
            setFormError("Current stock level is required.");
            return;
        }

        if (Number(formData.currentStockLevel) < 0) {
            setFormError(
                "Current stock level cannot be negative."
            );
            return;
        }

        if (formData.minimumStockLevel === "") {
            setFormError("Minimum stock level is required.");
            return;
        }

        if (Number(formData.minimumStockLevel) < 0) {
            setFormError(
                "Minimum stock level cannot be negative."
            );
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const requestBody = {
            productId: Number(formData.productId),

            currentStockLevel:
                Number(formData.currentStockLevel),

            minimumStockLevel:
                Number(formData.minimumStockLevel),

            notes:
                formData.notes.trim() === ""
                    ? null
                    : formData.notes.trim()
        };

        console.log(
            "Finished Goods Stock request body:",
            requestBody
        );

        try {
            setSaving(true);

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            console.log(
                "Save Finished Goods Stock response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Request failed (${response.status})`
                );
            }

            setShowFormModal(false);

            setEditingId(null);

            setFormData({
                productId: "",
                currentStockLevel: "",
                minimumStockLevel: "",
                notes: ""
            });

            await fetchStock();
        } catch (err) {
            console.error(
                "Error saving finished goods stock:",
                err
            );

            setFormError(
                err.message ||
                "Unable to save finished goods stock."
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // DELETE / SOFT DELETE
    // ============================================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this finished goods stock record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            const result = await response.json();

            console.log(
                "Delete Finished Goods Stock response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Delete failed (${response.status})`
                );
            }

            await fetchStock();
        } catch (err) {
            console.error(
                "Error deleting finished goods stock:",
                err
            );

            setError(
                err.message ||
                "Unable to delete finished goods stock."
            );
        }
    };

    // ============================================================
    // CLOSE VIEW MODAL
    // ============================================================

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedStock(null);
    };

    // ============================================================
    // CLOSE FORM MODAL
    // ============================================================

    const closeFormModal = () => {
        if (saving) {
            return;
        }

        setShowFormModal(false);
        setEditingId(null);
        setFormError("");

        setFormData({
            productId: "",
            currentStockLevel: "",
            minimumStockLevel: "",
            notes: ""
        });
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="module-container">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="module-header">

                <h1>Finished Goods Stock</h1>

                <p>
                    Manage finished goods stock levels and records
                </p>

            </div>


            {/* ==================================================
                SEARCH + ADD
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>

                        <h2>Finished Goods Stock</h2>

                        <p>
                            Manage available finished product
                            inventory
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="primary-button"
                    >
                        Add Finished Goods Stock
                    </button>

                </div>


                <div className="search-section">

                    <label>
                        Search Finished Goods Stock
                    </label>

                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(
                                event.target.value
                            )
                        }
                        placeholder="Search by product, stock level, status..."
                    />

                </div>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* ==================================================
                FINISHED GOODS STOCK LIST
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>

                        <h2>
                            Finished Goods Stock List
                        </h2>

                        <p>
                            {filteredStock.length} finished goods
                            stock record(s)
                        </p>

                    </div>

                </div>


                {loading ? (

                    <p>
                        Loading finished goods stock...
                    </p>

                ) : filteredStock.length === 0 ? (

                    <p>
                        No finished goods stock records found.
                    </p>

                ) : (

                    <div className="table-container">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>PRODUCT ID</th>

                                    <th>CURRENT STOCK</th>

                                    <th>MINIMUM STOCK</th>

                                    <th>STATUS</th>

                                    <th>LAST UPDATED</th>

                                    <th>RECORD STATUS</th>

                                    <th>ACTIONS</th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredStock.map((stock) => (

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
                                            {
                                                stock.productId
                                            }
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
                                            <strong>
                                                {
                                                    stock.status
                                                }
                                            </strong>
                                        </td>


                                        <td>
                                            {
                                                stock.lastUpdatedDate ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {
                                                stock.recordStatus ||
                                                "ACTIVE"
                                            }
                                        </td>


                                        <td>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleView(
                                                        stock.finishedGoodsStockId
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            {" "}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        stock.finishedGoodsStockId
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            {" "}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        stock.finishedGoodsStockId
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ==================================================
                VIEW MODAL
            ================================================== */}

            {showViewModal && selectedStock && (

                <div className="modal-overlay">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h2>
                                Finished Goods Stock Details
                            </h2>

                            <button
                                type="button"
                                onClick={closeViewModal}
                            >
                                X
                            </button>

                        </div>


                        <div className="details-grid">

                            <div>

                                <strong>
                                    Finished Goods Stock ID
                                </strong>

                                <span>
                                    {
                                        selectedStock.finishedGoodsStockId
                                    }
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Product ID
                                </strong>

                                <span>
                                    {
                                        selectedStock.productId
                                    }
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Current Stock Level
                                </strong>

                                <span>
                                    {
                                        selectedStock.currentStockLevel
                                    }
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Minimum Stock Level
                                </strong>

                                <span>
                                    {
                                        selectedStock.minimumStockLevel
                                    }
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Stock Status
                                </strong>

                                <span>
                                    {
                                        selectedStock.status
                                    }
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Last Updated Date
                                </strong>

                                <span>
                                    {
                                        selectedStock.lastUpdatedDate ||
                                        "-"
                                    }
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Record Status
                                </strong>

                                <span>
                                    {
                                        selectedStock.recordStatus ||
                                        "ACTIVE"
                                    }
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Created At
                                </strong>

                                <span>
                                    {
                                        selectedStock.createdAt
                                            ? new Date(
                                                selectedStock.createdAt
                                            ).toLocaleString()
                                            : "-"
                                    }
                                </span>

                            </div>


                            <div className="full-width">

                                <strong>
                                    Notes
                                </strong>

                                <span>
                                    {
                                        selectedStock.notes ||
                                        "-"
                                    }
                                </span>

                            </div>

                        </div>


                        <div className="modal-actions">

                            <button
                                type="button"
                                onClick={closeViewModal}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ==================================================
                CREATE / UPDATE MODAL
            ================================================== */}

            {showFormModal && (

                <div className="modal-overlay">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h2>
                                {editingId
                                    ? "Update Finished Goods Stock"
                                    : "Add Finished Goods Stock"}
                            </h2>

                            <button
                                type="button"
                                onClick={closeFormModal}
                                disabled={saving}
                            >
                                X
                            </button>

                        </div>


                        {formError && (

                            <div className="error-message">
                                {formError}
                            </div>

                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="form-grid"
                        >

                            {/* ==================================================
                                PRODUCT ID
                            ================================================== */}

                            <div className="form-group">

                                <label>
                                    Product ID *
                                </label>

                                <input
                                    type="number"
                                    name="productId"
                                    value={
                                        formData.productId
                                    }
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    disabled={!!editingId}
                                />

                                {editingId && (

                                    <small>
                                        Product ID cannot be
                                        changed during update.
                                    </small>

                                )}

                            </div>


                            {/* ==================================================
                                CURRENT STOCK LEVEL
                            ================================================== */}

                            <div className="form-group">

                                <label>
                                    Current Stock Level *
                                </label>

                                <input
                                    type="number"
                                    name="currentStockLevel"
                                    value={
                                        formData.currentStockLevel
                                    }
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />

                            </div>


                            {/* ==================================================
                                MINIMUM STOCK LEVEL
                            ================================================== */}

                            <div className="form-group">

                                <label>
                                    Minimum Stock Level *
                                </label>

                                <input
                                    type="number"
                                    name="minimumStockLevel"
                                    value={
                                        formData.minimumStockLevel
                                    }
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />

                            </div>


                            {/* ==================================================
                                NOTES
                            ================================================== */}

                            <div className="form-group full-width">

                                <label>
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={
                                        formData.notes
                                    }
                                    onChange={handleChange}
                                    maxLength={255}
                                    rows={4}
                                    placeholder="Enter notes..."
                                />

                            </div>


                            {/* ==================================================
                                FORM ACTIONS
                            ================================================== */}

                            <div className="form-actions">

                                <button
                                    type="button"
                                    onClick={closeFormModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="primary-button"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Finished Goods Stock"
                                            : "Create Finished Goods Stock"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default FinishedGoodsStock;