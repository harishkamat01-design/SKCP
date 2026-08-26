import { useEffect, useMemo, useState } from "react";

function RawMaterialStock() {
    const API_URL = "http://localhost:8080/api/raw-material-stock";

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
        rawMaterialId: "",
        currentStockLevel: "",
        minimumStockLevel: "",
        notes: ""
    });

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // ============================================================
    // FETCH ALL RAW MATERIAL STOCK
    // ============================================================

    const fetchStock = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch raw material stock (${response.status})`
                );
            }

            const result = await response.json();

            console.log("Raw Material Stock API response:", result);

            setStockList(result.data || []);
        } catch (err) {
            console.error("Error fetching raw material stock:", err);

            setError(
                "Unable to load raw material stock. Please try again."
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
                String(stock.rawMaterialStockId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.rawMaterialId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.rawMaterialName || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.rawMaterialUnit || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.stockStatus || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.recordStatus || "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [stockList, searchKeyword]);

    // ============================================================
    // VIEW STOCK
    // ============================================================

    const handleView = async (id) => {
        try {
            setError("");

            const response = await fetch(`${API_URL}/${id}`);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch stock details (${response.status})`
                );
            }

            const result = await response.json();

            console.log("Raw Material Stock details:", result);

            setSelectedStock(result.data);
            setShowViewModal(true);
        } catch (err) {
            console.error("Error fetching stock details:", err);

            setError(
                "Unable to load raw material stock details."
            );
        }
    };

    // ============================================================
    // OPEN CREATE FORM
    // ============================================================

    const handleAdd = () => {
        setEditingId(null);

        setFormData({
            rawMaterialId: "",
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

            const response = await fetch(`${API_URL}/${id}`);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch stock details (${response.status})`
                );
            }

            const result = await response.json();

            const stock = result.data;

            setEditingId(id);

            setFormData({
                rawMaterialId: stock.rawMaterialId ?? "",
                currentStockLevel:
                    stock.currentStockLevel ?? "",
                minimumStockLevel:
                    stock.minimumStockLevel ?? "",
                notes: stock.notes ?? ""
            });

            setShowFormModal(true);
        } catch (err) {
            console.error("Error loading stock for edit:", err);

            setError(
                "Unable to load the stock record for editing."
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

        if (!formData.rawMaterialId) {
            setFormError("Raw material ID is required.");
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

        if (
            formData.minimumStockLevel !== "" &&
            Number(formData.minimumStockLevel) < 0
        ) {
            setFormError(
                "Minimum stock level cannot be negative."
            );
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const requestBody = {
            rawMaterialId: Number(formData.rawMaterialId),
            currentStockLevel: Number(
                formData.currentStockLevel
            ),
            minimumStockLevel:
                formData.minimumStockLevel === ""
                    ? null
                    : Number(formData.minimumStockLevel),
            notes:
                formData.notes.trim() === ""
                    ? null
                    : formData.notes.trim()
        };

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

            console.log("Save Raw Material Stock response:", result);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Request failed (${response.status})`
                );
            }

            setShowFormModal(false);

            setEditingId(null);

            setFormData({
                rawMaterialId: "",
                currentStockLevel: "",
                minimumStockLevel: "",
                notes: ""
            });

            await fetchStock();
        } catch (err) {
            console.error(
                "Error saving raw material stock:",
                err
            );

            setFormError(
                err.message ||
                "Unable to save raw material stock."
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
            "Are you sure you want to delete this raw material stock record?"
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
                "Delete Raw Material Stock response:",
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
                "Error deleting raw material stock:",
                err
            );

            setError(
                err.message ||
                "Unable to delete raw material stock."
            );
        }
    };

    // ============================================================
    // CLOSE MODALS
    // ============================================================

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedStock(null);
    };

    const closeFormModal = () => {
        if (saving) {
            return;
        }

        setShowFormModal(false);
        setEditingId(null);
        setFormError("");

        setFormData({
            rawMaterialId: "",
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
                <h1>Raw Material Stock</h1>

                <p>
                    Manage raw material stock information and records
                </p>
            </div>

            {/* ==================================================
                SEARCH + ADD
            ================================================== */}

            <div className="module-card">

                <div className="section-header">
                    <div>
                        <h2>Raw Material Stock</h2>

                        <p>
                            Manage current stock and minimum stock levels
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="primary-button"
                    >
                        Add Stock
                    </button>
                </div>

                <div className="search-section">

                    <label>
                        Search Raw Material Stock
                    </label>

                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(event.target.value)
                        }
                        placeholder="Search by raw material, unit, stock status..."
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
                STOCK LIST
            ================================================== */}

            <div className="module-card">

                <div className="section-header">
                    <div>
                        <h2>Raw Material Stock List</h2>

                        <p>
                            {filteredStock.length} stock record(s)
                        </p>
                    </div>
                </div>

                {loading ? (
                    <p>Loading raw material stock...</p>
                ) : filteredStock.length === 0 ? (
                    <p>
                        No raw material stock records found.
                    </p>
                ) : (
                    <div className="table-container">

                        <table className="data-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>RAW MATERIAL</th>
                                    <th>UNIT</th>
                                    <th>CURRENT STOCK</th>
                                    <th>MINIMUM STOCK</th>
                                    <th>STOCK STATUS</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredStock.map((stock) => (
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
                                                stock.rawMaterialUnit
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
                                                stock.stockStatus
                                            }
                                        </td>

                                        <td>
                                            {
                                                stock.recordStatus
                                            }
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleView(
                                                        stock.rawMaterialStockId
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
                                                        stock.rawMaterialStockId
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
                                                        stock.rawMaterialStockId
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
                                Raw Material Stock Details
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
                                    Stock ID
                                </strong>

                                <span>
                                    {
                                        selectedStock.rawMaterialStockId
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Raw Material ID
                                </strong>

                                <span>
                                    {
                                        selectedStock.rawMaterialId
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Raw Material
                                </strong>

                                <span>
                                    {
                                        selectedStock.rawMaterialName
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Unit
                                </strong>

                                <span>
                                    {
                                        selectedStock.rawMaterialUnit ||
                                        "-"
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
                                        selectedStock.minimumStockLevel ??
                                        "-"
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Stock Status
                                </strong>

                                <span>
                                    {
                                        selectedStock.stockStatus
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Record Status
                                </strong>

                                <span>
                                    {
                                        selectedStock.recordStatus
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Last Updated
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
                                    ? "Update Raw Material Stock"
                                    : "Add Raw Material Stock"}
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

                            {/* RAW MATERIAL ID */}

                            <div className="form-group">

                                <label>
                                    Raw Material ID *
                                </label>

                                <input
                                    type="number"
                                    name="rawMaterialId"
                                    value={
                                        formData.rawMaterialId
                                    }
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />

                            </div>

                            {/* CURRENT STOCK */}

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
                                    step="0.01"
                                    required
                                />

                            </div>

                            {/* MINIMUM STOCK */}

                            <div className="form-group">

                                <label>
                                    Minimum Stock Level
                                </label>

                                <input
                                    type="number"
                                    name="minimumStockLevel"
                                    value={
                                        formData.minimumStockLevel
                                    }
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                />

                            </div>

                            {/* NOTES */}

                            <div className="form-group full-width">

                                <label>
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    maxLength={1000}
                                    rows={4}
                                    placeholder="Enter notes..."
                                />

                            </div>

                            {/* FORM ACTIONS */}

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
                                            ? "Update Stock"
                                            : "Create Stock"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default RawMaterialStock;