import { useEffect, useState } from "react";

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

function Production() {
    // ============================================================
    // STATE
    // ============================================================

    const [searchKeyword, setSearchKeyword] = useState("");
    const [productions, setProductions] = useState([]);

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
        productId: "",
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

            setProductions(result.data || []);
        } catch (err) {
            console.error(
                "Error fetching productions:",
                err
            );

            setError(
                "Unable to load production records. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredProductions = productions.filter(
        (production) => {
            const keyword =
                searchKeyword.toLowerCase().trim();

            if (!keyword) {
                return true;
            }

            return (
                String(
                    production.productionId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||
                String(
                    production.productionDate || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||
                String(
                    production.productName || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||
                String(
                    production.productSize || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||
                String(
                    production.assetName || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||
                String(
                    production.status || ""
                )
                    .toLowerCase()
                    .includes(keyword)
            );
        }
    );

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

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
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

        return `₹ ${Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    // ============================================================
    // VIEW PRODUCTION
    // ============================================================

    const handleView = (production) => {
        setSelectedProduction(production);
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
            productId: "",
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

    const handleAddChange = (event) => {
        const { name, value } = event.target;

        setAddForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreateProduction = async (event) => {
        event.preventDefault();

        if (!addForm.productionDate) {
            setAddError(
                "Please select a production date."
            );
            return;
        }

        if (!addForm.productId) {
            setAddError(
                "Please enter a product ID."
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
                    Number(addForm.productId),

                assetId: addForm.assetId
                    ? Number(addForm.assetId)
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
                productId: "",
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

    const handleEdit = (production) => {
        setEditError("");

        setEditingProduction(production);

        setEditForm({
            productionDate:
                production.productionDate ||
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
                production.remarks || "",
        });
    };

    const closeEditModal = () => {
        if (editLoading) {
            return;
        }

        setEditingProduction(null);
        setEditError("");
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ============================================================
    // UPDATE PRODUCTION
    // ============================================================

    const handleUpdateProduction = async (
        event
    ) => {
        event.preventDefault();

        if (!editingProduction) {
            return;
        }

        if (!editForm.productionDate) {
            setEditError(
                "Please select a production date."
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

        try {
            setEditLoading(true);
            setEditError("");

            // Product is NOT editable in the UI.
            // The existing Product ID is sent silently
            // because the backend requires it for update.
        const payload = {
            productionDate:
                editForm.productionDate,

            productId:
                Number(
                    editingProduction.productId
                ),

            assetId:
                editingProduction.assetId
                    ? Number(
                        editingProduction.assetId
                    )
                    : null,

            quantityProduced:
                Number(
                    editForm.quantityProduced
                ),

            morningCementBags:
                editForm.morningCementBags === ""
                    ? 0
                    : Number(
                        editForm.morningCementBags
                    ),

            afternoonCementBags:
                editForm.afternoonCementBags === ""
                    ? 0
                    : Number(
                        editForm.afternoonCementBags
                    ),

            remarks:
                editForm.remarks.trim() || null,
        };

            console.log(
                "Updating production with payload:",
                payload
            );

            const result = await apiPut(
                `/api/productions/${editingProduction.productionId}`,
                payload
            );

            console.log(
                "Production updated:",
                result
            );

            setEditingProduction(null);

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

    const handleDelete = (production) => {
        setDeleteError("");
        setDeletingProduction(production);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) {
            return;
        }

        setDeletingProduction(null);
        setDeleteError("");
    };

    const handleConfirmDelete = async () => {
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

            const result = await apiDelete(
                `/api/productions/${deletingProduction.productionId}`
            );

            console.log(
                "Production deleted:",
                result
            );

            setDeletingProduction(null);

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
            <div className="page">
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
        <>
            {/* ====================================================
                PRODUCTION HEADER
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
                        <h2>Production</h2>

                        <p>
                            Manage production
                            information and
                            records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            openAddModal
                        }
                    >
                        + Add Production
                    </button>
                </div>

                <div className="fld production-search">
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
                                event.target
                                    .value
                            )
                        }
                    />
                </div>
            </section>

            {/* ====================================================
                PRODUCTION LIST
            ==================================================== */}

            <section className="card">
                <h2>Production List</h2>

                <p>
                    {
                        filteredProductions.length
                    }{" "}
                    production record(s)
                </p>

                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

                {!error &&
                    filteredProductions.length ===
                        0 && (
                        <p>
                            No production
                            records found.
                        </p>
                    )}

                {!error &&
                    filteredProductions.length >
                        0 && (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>
                                            DATE
                                        </th>
                                        <th>
                                            PRODUCT
                                        </th>
                                        <th>
                                            SIZE
                                        </th>
                                        <th>
                                            QUANTITY
                                        </th>
                                        <th>
                                            TOTAL CEMENT BAGS
                                        </th>
                                        <th>
                                            ASSET
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
                                    {filteredProductions.map(
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
                                                    {
                                                        production.status
                                                    }
                                                </td>

                                                <td>
                                                    <div className="table-actions">
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
                    <button
                        type="button"
                        className="btn"
                        onClick={
                            closeViewModal
                        }
                    >
                        Close
                    </button>
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
                            label="Product Size"
                            value={
                                selectedProduction.productSize
                            }
                        />

                        <DetailItem
                            label="Product ID"
                            value={
                                selectedProduction.productId
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
                            value={
                                selectedProduction.createdAt
                                    ? new Date(
                                          selectedProduction.createdAt
                                      ).toLocaleString(
                                          "en-IN"
                                      )
                                    : "-"
                            }
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
                subtitle="Record new production information"
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
                <div className="edit-form-grid">
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
                        <label htmlFor="add-product-id">
                            Product ID
                        </label>

                        <input
                            id="add-product-id"
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

                    <div className="fld edit-full">
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
                    <div className="edit-form-grid">
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

                        <div className="fld">
                            <label htmlFor="edit-production-product">
                                Product
                            </label>

                            <input
                                id="edit-production-product"
                                type="text"
                                value={
                                    editingProduction.productName ||
                                    ""
                                }
                                disabled
                            />
                        </div>

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
                                required
                            />
                        </div>

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
                            />
                        </div>

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
                            />
                        </div>

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

                        <div className="fld">
                            <label htmlFor="edit-production-asset">
                                Asset
                            </label>

                            <input
                                id="edit-production-asset"
                                type="text"
                                value={
                                    editingProduction.assetName ||
                                    ""
                                }
                                disabled
                            />
                        </div>

                        <div className="fld edit-full">
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
        </>
    );
}

export default Production;