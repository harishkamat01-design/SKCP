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

function Production() {
    // ============================================================
    // STATE
    // ============================================================

    const [searchKeyword, setSearchKeyword] = useState("");
    const [productionDateFrom, setProductionDateFrom] =
        useState("");
    const [productionDateTo, setProductionDateTo] =
        useState("");
    const [dateFilterError, setDateFilterError] =
        useState("");

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
    // FILTER + SEARCH
    // ============================================================

    const filteredProductions = useMemo(() => {
        const keyword =
            searchKeyword.toLowerCase().trim();

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
                    matchesFromDate &&
                    matchesToDate
                );
            }
        );
    }, [
        productions,
        searchKeyword,
        productionDateFrom,
        productionDateTo,
    ]);

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
            date.toLocaleDateString("en-GB");

        const timePart =
            date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });

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
        const {
            name,
            value,
        } = event.target;

        setAddForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };

    const handleCreateProduction = async (
        event
    ) => {
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
                    Number(
                        addForm.productId
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

    const handleEdit = (
        production
    ) => {
        setEditError("");

        setEditingProduction(
            production
        );

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

    const handleEditChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

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

                    remarks:
                        editForm.remarks.trim() ||
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
        <div className="page">
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
                        className="fld production-search"
                        style={{
                            flex: "2 1 320px",
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
                            flex: "1 1 180px",
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
                            flex: "1 1 180px",
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
                            !productionDateFrom &&
                            !productionDateTo
                        }
                    >
                        Clear
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
                                                    <div className="action-buttons">
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
                                    onChange={
                                        handleEditChange
                                    }
                                    placeholder="Enter remarks"
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