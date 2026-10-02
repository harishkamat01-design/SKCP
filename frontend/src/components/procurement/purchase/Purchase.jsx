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

function Purchase() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [suppliers, setSuppliers] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);

    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");

    const [editingPurchase, setEditingPurchase] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");

    const [editForm, setEditForm] = useState({
        supplierId: "",
        purchaseDate: "",
        invoiceNumber: "",
        paymentStatus: "PENDING",
        remarks: "",
    });

    const [showAddPurchaseModal, setShowAddPurchaseModal] =
        useState(false);
    const [addSaving, setAddSaving] = useState(false);
    const [addError, setAddError] = useState("");
    const [addSuccess, setAddSuccess] = useState("");

    const emptyPurchaseItem = {
        rawMaterialId: "",
        quantity: "",
        unit: "",
        unitPrice: "",
        remarks: "",
    };

    const [addForm, setAddForm] = useState({
        supplierId: "",
        purchaseDate: "",
        invoiceNumber: "",
        paymentStatus: "PENDING",
        remarks: "",
        items: [{ ...emptyPurchaseItem }],
    });

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deletingPurchaseId, setDeletingPurchaseId] = useState(null);
    const [deleteError, setDeleteError] = useState("");

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet("/api/purchases");

            setPurchases(
                Array.isArray(result?.data)
                    ? result.data
                    : []
            );
        } catch (err) {
            console.error("Error fetching purchases:", err);

            setError(
                err.message ||
                    "Unable to load purchases. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const result = await apiGet("/api/suppliers");

            setSuppliers(
                Array.isArray(result?.data)
                    ? result.data
                    : []
            );
        } catch (err) {
            console.error("Error fetching suppliers:", err);
        }
    };

    const fetchRawMaterials = async () => {
        try {
            const result = await apiGet("/api/raw-materials");

            setRawMaterials(
                Array.isArray(result?.data)
                    ? result.data
                    : []
            );
        } catch (err) {
            console.error(
                "Error fetching raw materials:",
                err
            );
        }
    };

    useEffect(() => {
        fetchPurchases();
        fetchSuppliers();
        fetchRawMaterials();
    }, []);

    const filteredPurchases = useMemo(() => {
        const keyword = searchKeyword
            .toLowerCase()
            .trim();

        return purchases.filter((purchase) => {
            const purchaseId =
                purchase.purchaseId
                    ?.toString()
                    .toLowerCase() || "";

            const invoiceNumber =
                purchase.invoiceNumber
                    ?.toLowerCase() || "";

            const supplierName =
                purchase.supplierName
                    ?.toLowerCase() ||
                purchase.supplier?.supplierName
                    ?.toLowerCase() ||
                "";

            const paymentStatus =
                purchase.paymentStatus
                    ?.toLowerCase() || "";

            const status =
                purchase.status
                    ?.toLowerCase() || "";

            return (
                purchaseId.includes(keyword) ||
                invoiceNumber.includes(keyword) ||
                supplierName.includes(keyword) ||
                paymentStatus.includes(keyword) ||
                status.includes(keyword)
            );
        });
    }, [purchases, searchKeyword]);

    const {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    } = useTableSort(
        filteredPurchases,
        "purchaseId",
        "desc"
    );

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

    const handleClearSearch = () => {
        setSearchKeyword("");
    };

    const getSortIndicator = (key) => {
        if (sortKey !== key) {
            return "";
        }

        return sortDirection === "asc"
            ? " ▲"
            : " ▼";
    };

    const handleViewPurchase = async (purchaseId) => {
        try {
            setViewLoading(true);
            setViewError("");
            setSelectedPurchase(null);

            const result = await apiGet(
                `/api/purchases/${purchaseId}`
            );

            setSelectedPurchase(
                result?.data || null
            );
        } catch (err) {
            console.error(
                "Error fetching purchase details:",
                err
            );

            setViewError(
                err.message ||
                    "Unable to load purchase details. Please try again."
            );
        } finally {
            setViewLoading(false);
        }
    };

    const handleClosePurchaseModal = () => {
        setSelectedPurchase(null);
        setViewError("");
        setViewLoading(false);
    };

    const handleEditPurchase = async (purchaseId) => {
        try {
            setEditLoading(true);
            setEditError("");
            setEditSuccess("");
            setEditingPurchase(null);

            const result = await apiGet(
                `/api/purchases/${purchaseId}`
            );

            const purchase = result?.data;

            setEditingPurchase(purchase);

            setEditForm({
                supplierId:
                    purchase?.supplierId ??
                    purchase?.supplier?.supplierId ??
                    "",
                purchaseDate:
                    purchase?.purchaseDate || "",
                invoiceNumber:
                    purchase?.invoiceNumber || "",
                paymentStatus:
                    purchase?.paymentStatus ||
                    "PENDING",
                remarks:
                    purchase?.remarks || "",
            });
        } catch (err) {
            console.error(
                "Error loading purchase for edit:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to load purchase details. Please try again."
            );
        } finally {
            setEditLoading(false);
        }
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleCloseEditModal = () => {
        setEditingPurchase(null);
        setEditError("");
        setEditSuccess("");
        setEditLoading(false);
        setEditSaving(false);
    };

    const handleUpdatePurchase = async (event) => {
        event.preventDefault();

        if (!editingPurchase?.purchaseId) {
            return;
        }

        try {
            setEditSaving(true);
            setEditError("");
            setEditSuccess("");

            const payload = {
                supplierId: Number(
                    editForm.supplierId
                ),
                purchaseDate:
                    editForm.purchaseDate,
                invoiceNumber:
                    editForm.invoiceNumber,
                paymentStatus:
                    editForm.paymentStatus,
                remarks: editForm.remarks,
            };

            await apiPut(
                `/api/purchases/${editingPurchase.purchaseId}`,
                payload
            );

            setEditSuccess(
                "Purchase updated successfully."
            );

            await fetchPurchases();

            setTimeout(() => {
                handleCloseEditModal();
            }, 700);
        } catch (err) {
            console.error(
                "Error updating purchase:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to update purchase. Please try again."
            );
        } finally {
            setEditSaving(false);
        }
    };

    const handleOpenAddPurchaseModal = () => {
        setAddError("");
        setAddSuccess("");

        setAddForm({
            supplierId: "",
            purchaseDate: "",
            invoiceNumber: "",
            paymentStatus: "PENDING",
            remarks: "",
            items: [
                { ...emptyPurchaseItem },
            ],
        });

        setShowAddPurchaseModal(true);
    };

    const handleCloseAddPurchaseModal = () => {
        if (addSaving) {
            return;
        }

        setShowAddPurchaseModal(false);
        setAddError("");
        setAddSuccess("");
    };

    const handleAddChange = (event) => {
        const { name, value } = event.target;

        setAddForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleAddItem = () => {
        setAddForm((previousForm) => ({
            ...previousForm,
            items: [
                ...previousForm.items,
                { ...emptyPurchaseItem },
            ],
        }));
    };

    const handleRemoveItem = (index) => {
        setAddForm((previousForm) => {
            if (previousForm.items.length === 1) {
                return previousForm;
            }

            return {
                ...previousForm,
                items: previousForm.items.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                ),
            };
        });
    };

    const handleItemChange = (
        index,
        event
    ) => {
        const { name, value } =
            event.target;

        setAddForm((previousForm) => ({
            ...previousForm,
            items: previousForm.items.map(
                (item, itemIndex) =>
                    itemIndex === index
                        ? {
                              ...item,
                              [name]: value,
                          }
                        : item
            ),
        }));
    };

    const handleCreatePurchase = async (
        event
    ) => {
        event.preventDefault();

        try {
            setAddSaving(true);
            setAddError("");
            setAddSuccess("");

            const payload = {
                supplierId: Number(
                    addForm.supplierId
                ),
                purchaseDate:
                    addForm.purchaseDate,
                invoiceNumber:
                    addForm.invoiceNumber,
                paymentStatus:
                    addForm.paymentStatus,
                remarks: addForm.remarks,

                items: addForm.items.map(
                    (item) => ({
                        rawMaterialId: Number(
                            item.rawMaterialId
                        ),
                        quantity: Number(
                            item.quantity
                        ),
                        unit: item.unit,
                        unitPrice: Number(
                            item.unitPrice
                        ),
                        remarks: item.remarks,
                    })
                ),
            };

            await apiPost(
                "/api/purchases",
                payload
            );

            setAddSuccess(
                "Purchase created successfully."
            );

            await fetchPurchases();

            setTimeout(() => {
                setShowAddPurchaseModal(false);
                setAddSuccess("");
            }, 700);
        } catch (err) {
            console.error(
                "Error creating purchase:",
                err
            );

            setAddError(
                err.message ||
                    "Unable to create purchase. Please try again."
            );
        } finally {
            setAddSaving(false);
        }
    };

    const handleOpenDeleteConfirm = (
        purchase
    ) => {
        setDeleteError("");
        setDeleteTarget(purchase);
    };

    const handleCloseDeleteConfirm = () => {
        if (
            deletingPurchaseId !== null
        ) {
            return;
        }

        setDeleteTarget(null);
        setDeleteError("");
    };

    const handleDeletePurchase = async () => {
        if (!deleteTarget?.purchaseId) {
            return;
        }

        try {
            setDeletingPurchaseId(
                deleteTarget.purchaseId
            );

            setDeleteError("");

            await apiDelete(
                `/api/purchases/${deleteTarget.purchaseId}`
            );

            setPurchases(
                (previousPurchases) =>
                    previousPurchases.filter(
                        (purchase) =>
                            purchase.purchaseId !==
                            deleteTarget.purchaseId
                    )
            );

            setDeleteTarget(null);
        } catch (err) {
            console.error(
                "Error deleting purchase:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete purchase. Please try again."
            );
        } finally {
            setDeletingPurchaseId(null);
        }
    };

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

    const formatCurrency = (amount) => {
        if (
            amount === null ||
            amount === undefined ||
            amount === ""
        ) {
            return "₹ 0.00";
        }

        const numericAmount =
            Number(amount);

        if (
            Number.isNaN(numericAmount)
        ) {
            return `₹ ${amount}`;
        }

        return `₹ ${numericAmount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    const supplierName = (purchase) =>
        purchase?.supplierName ||
        purchase?.supplier?.supplierName ||
        "-";

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <h2>Purchases</h2>
                    <p>Loading purchase records...</p>
                </section>
            </div>
        );
    }

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
                        <h2>Purchases</h2>
                        <p>
                            Manage purchase information and records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            handleOpenAddPurchaseModal
                        }
                    >
                        Add Purchase
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
                        style={{
                            width: "420px",
                            maxWidth: "100%",
                        }}
                    >
                        <label htmlFor="purchase-search">
                            Search Purchases
                        </label>

                        <input
                            id="purchase-search"
                            type="text"
                            placeholder="Search by invoice number or supplier name..."
                            value={
                                searchKeyword
                            }
                            onChange={(event) =>
                                setSearchKeyword(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={
                            handleClearSearch
                        }
                        disabled={!searchKeyword}
                    >
                        Clear
                    </button>
                </div>
            </section>

            <section className="card">
                <h2>Purchase List</h2>

                <p>
                    {totalRecords} purchase
                    {totalRecords === 1
                        ? ""
                        : "s"}
                </p>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {deleteError && (
                    <div
                        className="form-error"
                        style={{
                            marginTop: "12px",
                        }}
                    >
                        {deleteError}
                    </div>
                )}

                {totalRecords === 0 ? (
                    <p>
                        No purchase records found.
                    </p>
                ) : (
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
                                                    "purchaseId"
                                                )
                                            }
                                        >
                                            ID
                                            {getSortIndicator(
                                                "purchaseId"
                                            )}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "purchaseDate"
                                                )
                                            }
                                        >
                                            DATE
                                            {getSortIndicator(
                                                "purchaseDate"
                                            )}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "invoiceNumber"
                                                )
                                            }
                                        >
                                            INVOICE
                                            {getSortIndicator(
                                                "invoiceNumber"
                                            )}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "supplierName"
                                                )
                                            }
                                        >
                                            SUPPLIER
                                            {getSortIndicator(
                                                "supplierName"
                                            )}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "totalAmount"
                                                )
                                            }
                                        >
                                            TOTAL AMOUNT
                                            {getSortIndicator(
                                                "totalAmount"
                                            )}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "paymentStatus"
                                                )
                                            }
                                        >
                                            PAYMENT STATUS
                                            {getSortIndicator(
                                                "paymentStatus"
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
                                        purchase
                                    ) => (
                                        <tr
                                            key={
                                                purchase.purchaseId
                                            }
                                        >
                                            <td>
                                                {
                                                    purchase.purchaseId
                                                }
                                            </td>

                                            <td>
                                                {formatDate(
                                                    purchase.purchaseDate
                                                )}
                                            </td>

                                            <td>
                                                <strong>
                                                    {purchase.invoiceNumber ||
                                                        "-"}
                                                </strong>
                                            </td>

                                            <td>
                                                {supplierName(
                                                    purchase
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    purchase.totalAmount
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        purchase.paymentStatus ===
                                                        "PAID"
                                                            ? "badge bg"
                                                            : "badge br"
                                                    }
                                                >
                                                    {purchase.paymentStatus ||
                                                        "-"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        purchase.status ===
                                                        "ACTIVE"
                                                            ? "badge bg"
                                                            : "badge br"
                                                    }
                                                >
                                                    {purchase.status ||
                                                        "-"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        type="button"
                                                        className="action-btn view-btn"
                                                        onClick={() =>
                                                            handleViewPurchase(
                                                                purchase.purchaseId
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn edit-btn"
                                                        onClick={() =>
                                                            handleEditPurchase(
                                                                purchase.purchaseId
                                                            )
                                                        }
                                                        disabled={
                                                            deletingPurchaseId ===
                                                                purchase.purchaseId ||
                                                            purchase.status !==
                                                                "ACTIVE"
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn delete-btn"
                                                        onClick={() =>
                                                            handleOpenDeleteConfirm(
                                                                purchase
                                                            )
                                                        }
                                                        disabled={
                                                            deletingPurchaseId ===
                                                                purchase.purchaseId ||
                                                            purchase.status !==
                                                                "ACTIVE"
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

            <ViewModal
                isOpen={
                    viewLoading ||
                    Boolean(viewError) ||
                    Boolean(
                        selectedPurchase
                    )
                }
                onClose={
                    handleClosePurchaseModal
                }
                title="Purchase Details"
                subtitle="View purchase information"
                loading={viewLoading}
                error={viewError}
                size="lg"
                footer={
                    <button
                        type="button"
                        className="btn"
                        onClick={
                            handleClosePurchaseModal
                        }
                    >
                        Close
                    </button>
                }
            >
                {selectedPurchase && (
                    <>
                        <div className="modal-section-title">
                            Basic Information
                        </div>

                        <DetailGrid>
                            <DetailItem
                                label="Purchase ID"
                                value={
                                    selectedPurchase.purchaseId
                                }
                            />

                            <DetailItem
                                label="Purchase Date"
                                value={formatDate(
                                    selectedPurchase.purchaseDate
                                )}
                            />

                            <DetailItem
                                label="Invoice Number"
                                value={
                                    selectedPurchase.invoiceNumber ||
                                    "-"
                                }
                            />

                            <DetailItem
                                label="Supplier"
                                value={supplierName(
                                    selectedPurchase
                                )}
                            />

                            <DetailItem
                                label="Payment Status"
                                value={
                                    <span
                                        className={
                                            selectedPurchase.paymentStatus ===
                                            "PAID"
                                                ? "badge bg"
                                                : "badge br"
                                        }
                                    >
                                        {selectedPurchase.paymentStatus ||
                                            "-"}
                                    </span>
                                }
                            />

                            <DetailItem
                                label="Status"
                                value={
                                    <span
                                        className={
                                            selectedPurchase.status ===
                                            "ACTIVE"
                                                ? "badge bg"
                                                : "badge br"
                                        }
                                    >
                                        {selectedPurchase.status ||
                                            "-"}
                                    </span>
                                }
                            />

                            <DetailItem
                                label="Total Amount"
                                value={formatCurrency(
                                    selectedPurchase.totalAmount
                                )}
                            />
                        </DetailGrid>

                        <div className="modal-section-title">
                            Purchase Items
                        </div>

                        {selectedPurchase
                            .purchaseItems
                            ?.length > 0 ? (
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
                                                QUANTITY
                                            </th>

                                            <th>
                                                UNIT
                                            </th>

                                            <th>
                                                UNIT PRICE
                                            </th>

                                            <th>
                                                LINE AMOUNT
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedPurchase.purchaseItems.map(
                                            (
                                                item
                                            ) => (
                                                <tr
                                                    key={
                                                        item.purchaseItemId
                                                    }
                                                >
                                                    <td>
                                                        {
                                                            item.purchaseItemId
                                                        }
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {item.rawMaterialName ||
                                                                item
                                                                    .rawMaterial
                                                                    ?.rawMaterialName ||
                                                                "-"}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {item.quantity ??
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {item.unit ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            item.unitPrice
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            item.lineAmount
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>
                                    No purchase items found.
                                </p>
                            </div>
                        )}

                        <div className="modal-section-title">
                            Additional Information
                        </div>

                        <DetailGrid>
                            <DetailItem
                                label="Remarks"
                                value={
                                    selectedPurchase.remarks ||
                                    "-"
                                }
                                fullWidth
                            />
                        </DetailGrid>

                        <div className="modal-section-title">
                            System Information
                        </div>

                        <DetailGrid>
                            <DetailItem
                                label="Created At"
                                value={formatDateTime(
                                    selectedPurchase.createdAt
                                )}
                            />
                        </DetailGrid>
                    </>
                )}
            </ViewModal>

            <FormModal
                isOpen={
                    editLoading ||
                    Boolean(editError) ||
                    Boolean(
                        editingPurchase
                    )
                }
                onClose={
                    handleCloseEditModal
                }
                title="Edit Purchase"
                subtitle="Update purchase information"
                onSubmit={
                    handleUpdatePurchase
                }
                submitLabel="Save Changes"
                cancelLabel="Cancel"
                saving={editSaving}
                error={editError}
                success={editSuccess}
                size="lg"
            >
                {editLoading ? (
                    <div className="empty-state">
                        <p>
                            Loading purchase details...
                        </p>
                    </div>
                ) : editingPurchase ? (
                    <>
                        <div className="modal-section-title">
                            Purchase Information
                        </div>

                        <div className="form-grid">
                            <div className="fld">
                                <label htmlFor="edit-purchase-supplier">
                                    Supplier
                                </label>

                                <select
                                    id="edit-purchase-supplier"
                                    name="supplierId"
                                    value={
                                        editForm.supplierId
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                >
                                    <option value="">
                                        Select Supplier
                                    </option>

                                    {suppliers.map(
                                        (
                                            supplier
                                        ) => (
                                            <option
                                                key={
                                                    supplier.supplierId
                                                }
                                                value={
                                                    supplier.supplierId
                                                }
                                            >
                                                {supplier.supplierName ||
                                                    supplier.name ||
                                                    `Supplier ${supplier.supplierId}`}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="fld">
                                <label htmlFor="edit-purchase-date">
                                    Purchase Date
                                </label>

                                <input
                                    id="edit-purchase-date"
                                    name="purchaseDate"
                                    type="date"
                                    value={
                                        editForm.purchaseDate
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                />
                            </div>

                            <div className="fld">
                                <label htmlFor="edit-invoice-number">
                                    Invoice Number
                                </label>

                                <input
                                    id="edit-invoice-number"
                                    name="invoiceNumber"
                                    type="text"
                                    value={
                                        editForm.invoiceNumber
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                />
                            </div>

                            <div className="fld">
                                <label htmlFor="edit-payment-status">
                                    Payment Status
                                </label>

                                <select
                                    id="edit-payment-status"
                                    name="paymentStatus"
                                    value={
                                        editForm.paymentStatus
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                >
                                    <option value="PENDING">
                                        PENDING
                                    </option>

                                    <option value="PAID">
                                        PAID
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-section-title">
                            Additional Information
                        </div>

                        <div className="form-grid">
                            <div className="fld f-full">
                                <label htmlFor="edit-purchase-remarks">
                                    Remarks
                                </label>

                                <textarea
                                    id="edit-purchase-remarks"
                                    name="remarks"
                                    value={
                                        editForm.remarks
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    rows="4"
                                />
                            </div>
                        </div>
                    </>
                ) : null}
            </FormModal>

            <FormModal
                isOpen={
                    showAddPurchaseModal
                }
                onClose={
                    handleCloseAddPurchaseModal
                }
                title="Add Purchase"
                subtitle="Enter purchase information"
                onSubmit={
                    handleCreatePurchase
                }
                submitLabel="Add Purchase"
                cancelLabel="Cancel"
                saving={addSaving}
                error={addError}
                success={addSuccess}
                size="lg"
            >
                <div className="modal-section-title">
                    Purchase Information
                </div>

                <div className="form-grid">
                    <div className="fld">
                        <label htmlFor="add-purchase-supplier">
                            Supplier
                        </label>

                        <select
                            id="add-purchase-supplier"
                            name="supplierId"
                            value={
                                addForm.supplierId
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        >
                            <option value="">
                                Select Supplier
                            </option>

                            {suppliers.map(
                                (
                                    supplier
                                ) => (
                                    <option
                                        key={
                                            supplier.supplierId
                                        }
                                        value={
                                            supplier.supplierId
                                        }
                                    >
                                        {supplier.supplierName ||
                                            supplier.name ||
                                            `Supplier ${supplier.supplierId}`}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="fld">
                        <label htmlFor="add-purchase-date">
                            Purchase Date
                        </label>

                        <input
                            id="add-purchase-date"
                            name="purchaseDate"
                            type="date"
                            value={
                                addForm.purchaseDate
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-invoice-number">
                            Invoice Number
                        </label>

                        <input
                            id="add-invoice-number"
                            name="invoiceNumber"
                            type="text"
                            value={
                                addForm.invoiceNumber
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="add-payment-status">
                            Payment Status
                        </label>

                        <select
                            id="add-payment-status"
                            name="paymentStatus"
                            value={
                                addForm.paymentStatus
                            }
                            onChange={
                                handleAddChange
                            }
                            required
                        >
                            <option value="PENDING">
                                PENDING
                            </option>

                            <option value="PAID">
                                PAID
                            </option>
                        </select>
                    </div>
                </div>

                <div className="modal-section-title">
                    Purchase Items
                </div>

                {addForm.items.map(
                    (item, index) => (
                        <div
                            key={index}
                            className="card"
                            style={{
                                marginBottom:
                                    "12px",
                                padding: "16px",
                            }}
                        >
                            <div className="form-grid">
                                <div className="fld">
                                    <label>
                                        Raw Material
                                    </label>

                                    <select
                                        name="rawMaterialId"
                                        value={
                                            item.rawMaterialId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleItemChange(
                                                index,
                                                event
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Raw Material
                                        </option>

                                        {rawMaterials.map(
                                            (
                                                rawMaterial
                                            ) => (
                                                <option
                                                    key={
                                                        rawMaterial.rawMaterialId
                                                    }
                                                    value={
                                                        rawMaterial.rawMaterialId
                                                    }
                                                >
                                                    {rawMaterial.rawMaterialName ||
                                                        rawMaterial.name ||
                                                        `Raw Material ${rawMaterial.rawMaterialId}`}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="fld">
                                    <label>
                                        Quantity
                                    </label>

                                    <input
                                        name="quantity"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={
                                            item.quantity
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleItemChange(
                                                index,
                                                event
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="fld">
                                    <label>
                                        Unit
                                    </label>

                                    <input
                                        name="unit"
                                        type="text"
                                        placeholder="e.g. KG"
                                        value={
                                            item.unit
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleItemChange(
                                                index,
                                                event
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="fld">
                                    <label>
                                        Unit Price
                                    </label>

                                    <input
                                        name="unitPrice"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={
                                            item.unitPrice
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleItemChange(
                                                index,
                                                event
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="fld f-full">
                                    <label>
                                        Remarks
                                    </label>

                                    <textarea
                                        name="remarks"
                                        value={
                                            item.remarks
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleItemChange(
                                                index,
                                                event
                                            )
                                        }
                                        rows="2"
                                    />
                                </div>
                            </div>

                            {addForm.items
                                .length > 1 && (
                                <button
                                    type="button"
                                    className="btn sm"
                                    onClick={() =>
                                        handleRemoveItem(
                                            index
                                        )
                                    }
                                    disabled={
                                        addSaving
                                    }
                                >
                                    Remove Item
                                </button>
                            )}
                        </div>
                    )
                )}

                <button
                    type="button"
                    className="btn"
                    onClick={
                        handleAddItem
                    }
                    disabled={addSaving}
                >
                    Add Item
                </button>

                <div className="modal-section-title">
                    Additional Information
                </div>

                <div className="form-grid">
                    <div className="fld f-full">
                        <label htmlFor="add-purchase-remarks">
                            Remarks
                        </label>

                        <textarea
                            id="add-purchase-remarks"
                            name="remarks"
                            value={
                                addForm.remarks
                            }
                            onChange={
                                handleAddChange
                            }
                            rows="4"
                        />
                    </div>
                </div>
            </FormModal>

            <DeleteConfirmModal
                isOpen={Boolean(
                    deleteTarget
                )}
                onClose={
                    handleCloseDeleteConfirm
                }
                onConfirm={
                    handleDeletePurchase
                }
                title="Delete Purchase"
                subtitle="Confirm purchase deactivation"
                message="Are you sure you want to delete this purchase?"
                itemName={
                    deleteTarget?.invoiceNumber ||
                    `Purchase #${
                        deleteTarget?.purchaseId ||
                        ""
                    }`
                }
                confirming={
                    deletingPurchaseId !==
                    null
                }
                error={deleteError}
            />
        </div>
    );
}

export default Purchase;