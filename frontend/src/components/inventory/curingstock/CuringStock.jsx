import { useEffect, useMemo, useState } from "react";

function CuringStock() {
    const API_URL = "http://localhost:8080/api/curing-stock";

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
        productionId: "",
        productId: "",
        quantity: "",
        productionDate: "",
        remarks: ""
    });

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // ============================================================
    // FETCH ALL CURING STOCK
    // ============================================================

    const fetchStock = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch curing stock (${response.status})`
                );
            }

            const result = await response.json();

            console.log("Curing Stock API response:", result);

            setStockList(result.data || []);
        } catch (err) {
            console.error("Error fetching curing stock:", err);

            setError(
                "Unable to load curing stock. Please try again."
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
                String(stock.curingStockId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.productionId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.productId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.productName || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.quantity || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.productionDate || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.expectedReadyDate || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.status || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(stock.recordStatus || "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [stockList, searchKeyword]);

    // ============================================================
    // VIEW CURING STOCK
    // ============================================================

    const handleView = async (id) => {
        try {
            setError("");

            const response = await fetch(`${API_URL}/${id}`);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch curing stock details (${response.status})`
                );
            }

            const result = await response.json();

            console.log("Curing Stock details:", result);

            setSelectedStock(result.data);
            setShowViewModal(true);
        } catch (err) {
            console.error("Error fetching curing stock details:", err);

            setError(
                "Unable to load curing stock details."
            );
        }
    };

    // ============================================================
    // OPEN CREATE FORM
    // ============================================================

    const handleAdd = () => {
        setEditingId(null);

        setFormData({
            productionId: "",
            productId: "",
            quantity: "",
            productionDate: "",
            remarks: ""
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
                    `Failed to fetch curing stock details (${response.status})`
                );
            }

            const result = await response.json();

            const stock = result.data;

            setEditingId(id);

            setFormData({
                productionId: stock.productionId ?? "",
                productId: stock.productId ?? "",
                quantity: stock.quantity ?? "",
                productionDate: stock.productionDate ?? "",
                remarks: stock.remarks ?? ""
            });

            setShowFormModal(true);
        } catch (err) {
            console.error(
                "Error loading curing stock for edit:",
                err
            );

            setError(
                "Unable to load the curing stock record for editing."
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

        if (!formData.productionId) {
            setFormError("Production ID is required.");
            return;
        }

        if (!formData.productId) {
            setFormError("Product ID is required.");
            return;
        }

        if (formData.quantity === "") {
            setFormError("Quantity is required.");
            return;
        }

        if (Number(formData.quantity) < 0) {
            setFormError("Quantity cannot be negative.");
            return;
        }

        if (!formData.productionDate) {
            setFormError("Production date is required.");
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const requestBody = editingId
            ? {
                  productId: Number(formData.productId),
                  quantity: Number(formData.quantity),
                  productionDate: formData.productionDate,
                  remarks:
                      formData.remarks.trim() === ""
                          ? null
                          : formData.remarks.trim()
              }
            : {
                  productionId: Number(formData.productionId),
                  productId: Number(formData.productId),
                  quantity: Number(formData.quantity),
                  productionDate: formData.productionDate,
                  remarks:
                      formData.remarks.trim() === ""
                          ? null
                          : formData.remarks.trim()
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

            console.log(
                "Save Curing Stock response:",
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
                productionId: "",
                productId: "",
                quantity: "",
                productionDate: "",
                remarks: ""
            });

            await fetchStock();
        } catch (err) {
            console.error(
                "Error saving curing stock:",
                err
            );

            setFormError(
                err.message ||
                "Unable to save curing stock."
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
            "Are you sure you want to delete this curing stock record?"
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
                "Delete Curing Stock response:",
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
                "Error deleting curing stock:",
                err
            );

            setError(
                err.message ||
                "Unable to delete curing stock."
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
            productionId: "",
            productId: "",
            quantity: "",
            productionDate: "",
            remarks: ""
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
                <h1>Curing Stock</h1>

                <p>
                    Manage curing stock information and records
                </p>
            </div>

            {/* ==================================================
                SEARCH + ADD
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>
                        <h2>Curing Stock</h2>

                        <p>
                            Manage blocks currently undergoing
                            curing
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="primary-button"
                    >
                        Add Curing Stock
                    </button>

                </div>

                <div className="search-section">

                    <label>
                        Search Curing Stock
                    </label>

                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(
                                event.target.value
                            )
                        }
                        placeholder="Search by product, production ID, status..."
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
                CURING STOCK LIST
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>
                        <h2>Curing Stock List</h2>

                        <p>
                            {filteredStock.length} curing
                            stock record(s)
                        </p>
                    </div>

                </div>

                {loading ? (
                    <p>Loading curing stock...</p>
                ) : filteredStock.length === 0 ? (
                    <p>
                        No curing stock records found.
                    </p>
                ) : (
                    <div className="table-container">

                        <table className="data-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>PRODUCTION ID</th>
                                    <th>PRODUCT</th>
                                    <th>QUANTITY</th>
                                    <th>PRODUCTION DATE</th>
                                    <th>EXPECTED READY</th>
                                    <th>STATUS</th>
                                    <th>RECORD STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredStock.map((stock) => (
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
                                                stock.expectedReadyDate
                                            }
                                        </td>

                                        <td>
                                            {
                                                stock.status
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
                                                        stock.curingStockId
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
                                                        stock.curingStockId
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
                                                        stock.curingStockId
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
                                Curing Stock Details
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
                                    Curing Stock ID
                                </strong>

                                <span>
                                    {
                                        selectedStock.curingStockId
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Production ID
                                </strong>

                                <span>
                                    {
                                        selectedStock.productionId
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
                                    Quantity
                                </strong>

                                <span>
                                    {
                                        selectedStock.quantity
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Production Date
                                </strong>

                                <span>
                                    {
                                        selectedStock.productionDate
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Expected Ready Date
                                </strong>

                                <span>
                                    {
                                        selectedStock.expectedReadyDate
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Status
                                </strong>

                                <span>
                                    {
                                        selectedStock.status
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
                                    Remarks
                                </strong>

                                <span>
                                    {
                                        selectedStock.remarks ||
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
                                    ? "Update Curing Stock"
                                    : "Add Curing Stock"}
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

                            {/* PRODUCTION ID */}

                            <div className="form-group">

                                <label>
                                    Production ID *
                                </label>

                                <input
                                    type="number"
                                    name="productionId"
                                    value={
                                        formData.productionId
                                    }
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    disabled={!!editingId}
                                />

                                {editingId && (
                                    <small>
                                        Production ID cannot
                                        be changed during update.
                                    </small>
                                )}

                            </div>

                            {/* PRODUCT ID */}

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
                                />

                            </div>

                            {/* QUANTITY */}

                            <div className="form-group">

                                <label>
                                    Quantity *
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={
                                        formData.quantity
                                    }
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />

                            </div>

                            {/* PRODUCTION DATE */}

                            <div className="form-group">

                                <label>
                                    Production Date *
                                </label>

                                <input
                                    type="date"
                                    name="productionDate"
                                    value={
                                        formData.productionDate
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* EXPECTED READY DATE */}

                            <div className="form-group">

                                <label>
                                    Expected Ready Date
                                </label>

                                <input
                                    type="text"
                                    value={
                                        formData.productionDate
                                            ? (() => {
                                                const date =
                                                    new Date(
                                                        `${formData.productionDate}T00:00:00`
                                                    );

                                                date.setDate(
                                                    date.getDate() + 3
                                                );

                                                return date
                                                    .toISOString()
                                                    .split("T")[0];
                                            })()
                                            : "-"
                                    }
                                    disabled
                                />

                                <small>
                                    Calculated automatically
                                    by the backend as
                                    Production Date + 3 days.
                                </small>

                            </div>

                            {/* REMARKS */}

                            <div className="form-group full-width">

                                <label>
                                    Remarks
                                </label>

                                <textarea
                                    name="remarks"
                                    value={
                                        formData.remarks
                                    }
                                    onChange={handleChange}
                                    maxLength={255}
                                    rows={4}
                                    placeholder="Enter remarks..."
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
                                            ? "Update Curing Stock"
                                            : "Create Curing Stock"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default CuringStock;
