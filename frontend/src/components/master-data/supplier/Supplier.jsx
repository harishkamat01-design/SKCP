import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../../../services/api";

import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";
import Pagination from "../../ui/Pagination";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";

import {
    DetailGrid,
    DetailItem,
} from "../../ui/common/DetailGrid";

function Supplier() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // VIEW state
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");

    // EDIT state
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");

    const [editForm, setEditForm] = useState({
        supplierName: "",
        contactPerson: "",
        phone: "",
        whatsapp: "",
        address: "",
        gstNumber: "",
        remarks: "",
    });

    // ADD state
    const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
    const [addSaving, setAddSaving] = useState(false);
    const [addError, setAddError] = useState("");
    const [addSuccess, setAddSuccess] = useState("");

    const [addForm, setAddForm] = useState({
        supplierName: "",
        contactPerson: "",
        phone: "",
        whatsapp: "",
        address: "",
        gstNumber: "",
        remarks: "",
    });

    // DELETE state
    const [deletingSupplier, setDeletingSupplier] = useState(null);
    const [deleteSaving, setDeleteSaving] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ============================================================
    // FETCH SUPPLIERS
    // ============================================================

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet("/api/suppliers");

            setSuppliers(result?.data || []);
        } catch (err) {
            console.error("Error fetching suppliers:", err);
            setError(
                err?.message ||
                    "Failed to load suppliers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredSuppliers = useMemo(() => {
        const keyword = searchKeyword
            .trim()
            .toLowerCase();

        if (!keyword) {
            return suppliers;
        }

        return suppliers.filter((supplier) => {
            return [
                supplier.supplierId,
                supplier.supplierName,
                supplier.phone,
                supplier.contactPerson,
                supplier.whatsapp,
                supplier.gstNumber,
                supplier.remarks,
                supplier.status,
            ].some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [suppliers, searchKeyword]);

    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const handleClearSearch = () => {
        setSearchKeyword("");
    };

    // ============================================================
    // SORTING
    // ============================================================

    const {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    } = useTableSort(
        filteredSuppliers,
        "supplierId",
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
    // VIEW SUPPLIER
    // ============================================================

    const handleViewSupplier = async (supplierId) => {
        try {
            setViewLoading(true);
            setViewError("");
            setSelectedSupplier(null);

            const result = await apiGet(
                `/api/suppliers/${supplierId}`
            );

            setSelectedSupplier(result?.data || null);
        } catch (err) {
            console.error("Error fetching supplier:", err);

            setViewError(
                err?.message ||
                    "Failed to load supplier details."
            );
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        setSelectedSupplier(null);
        setViewError("");
    };

    // ============================================================
    // EDIT SUPPLIER
    // ============================================================

    const handleEditSupplier = async (supplierId) => {
        try {
            setEditLoading(true);
            setEditError("");
            setEditSuccess("");
            setEditingSupplier(null);

            const result = await apiGet(
                `/api/suppliers/${supplierId}`
            );

            const supplier = result?.data;

            setEditingSupplier(supplier);

            setEditForm({
                supplierName:
                    supplier?.supplierName || "",
                contactPerson:
                    supplier?.contactPerson || "",
                phone:
                    supplier?.phone || "",
                whatsapp:
                    supplier?.whatsapp || "",
                address:
                    supplier?.address || "",
                gstNumber:
                    supplier?.gstNumber || "",
                remarks:
                    supplier?.remarks || "",
            });
        } catch (err) {
            console.error(
                "Error fetching supplier for edit:",
                err
            );

            setEditError(
                err?.message ||
                    "Failed to load supplier."
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

    const handleEditSubmit = async (event) => {
        event.preventDefault();

        try {
            setEditSaving(true);
            setEditError("");
            setEditSuccess("");

            await apiPut(
                `/api/suppliers/${editingSupplier.supplierId}`,
                editForm
            );

            setEditSuccess(
                "Supplier updated successfully."
            );

            await fetchSuppliers();
        } catch (err) {
            console.error(
                "Error updating supplier:",
                err
            );

            setEditError(
                err?.message ||
                    "Failed to update supplier."
            );
        } finally {
            setEditSaving(false);
        }
    };

    const closeEditModal = () => {
        setEditingSupplier(null);
        setEditError("");
        setEditSuccess("");
    };

    // ============================================================
    // ADD SUPPLIER
    // ============================================================

    const handleOpenAddSupplier = () => {
        setAddForm({
            supplierName: "",
            contactPerson: "",
            phone: "",
            whatsapp: "",
            address: "",
            gstNumber: "",
            remarks: "",
        });

        setAddError("");
        setAddSuccess("");
        setShowAddSupplierModal(true);
    };

    const handleAddChange = (event) => {
        const { name, value } = event.target;

        setAddForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleAddSubmit = async () => {
        try {
            setAddSaving(true);
            setAddError("");
            setAddSuccess("");

            await apiPost(
                "/api/suppliers",
                addForm
            );

            setAddSuccess(
                "Supplier added successfully."
            );

            await fetchSuppliers();

            setAddForm({
                supplierName: "",
                contactPerson: "",
                phone: "",
                whatsapp: "",
                address: "",
                gstNumber: "",
                remarks: "",
            });
        } catch (err) {
            console.error(
                "Error adding supplier:",
                err
            );

            setAddError(
                err?.message ||
                    "Failed to add supplier."
            );
        } finally {
            setAddSaving(false);
        }
    };

    const closeAddModal = () => {
        setShowAddSupplierModal(false);
        setAddError("");
        setAddSuccess("");
    };

    // ============================================================
    // DELETE SUPPLIER
    // ============================================================

    const handleDeleteSupplier = (supplier) => {
        setDeletingSupplier(supplier);
        setDeleteError("");
    };

    const confirmDelete = async () => {
        try {
            setDeleteSaving(true);
            setDeleteError("");

            await apiDelete(
                `/api/suppliers/${deletingSupplier.supplierId}`
            );

            setDeletingSupplier(null);

            await fetchSuppliers();
        } catch (err) {
            console.error(
                "Error deleting supplier:",
                err
            );

            setDeleteError(
                err?.message ||
                    "Failed to delete supplier."
            );
        } finally {
            setDeleteSaving(false);
        }
    };

    const closeDeleteModal = () => {
        setDeletingSupplier(null);
        setDeleteError("");
    };

    // ============================================================
    // FORMAT CREATED AT
    // ============================================================

    const formatCreatedAt = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const period = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;

        return `${day}-${month}-${year} ${String(hours).padStart(
            2,
            "0"
        )}:${minutes}:${seconds} ${period}`;
    };

    // ============================================================
    // RENDER
    // ============================================================

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <h2>Suppliers</h2>
                    <p>Loading supplier records...</p>
                </section>
            </div>
        );
    }

    return (
        <div className="page">
            {/* ================================================== */}
            {/* HEADER + SEARCH */}
            {/* ================================================== */}

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
                        <h2>Suppliers</h2>
                        <p>
                            Manage supplier information and records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={handleOpenAddSupplier}
                    >
                        Add Supplier
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
                        <label>Search Suppliers</label>

                        <input
                            type="text"
                            placeholder="Search by supplier, phone, contact person, GST, remarks, status..."
                            value={searchKeyword}
                            onChange={(event) =>
                                setSearchKeyword(event.target.value)
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={handleClearSearch}
                        disabled={!searchKeyword}
                    >
                        Clear
                    </button>
                </div>
            </section>

            {/* ================================================== */}
            {/* SUPPLIER LIST */}
            {/* ================================================== */}

            <section className="card">
                <h2>Supplier List</h2>
                <p>
                    {totalRecords} supplier
                    {totalRecords === 1 ? "" : "s"}
                </p>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {!error && totalRecords === 0 && (
                    <p>No supplier records found.</p>
                )}

                {!error && totalRecords > 0 && (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "supplierId"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        ID
                                        {sortKey ===
                                            "supplierId" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "supplierName"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Supplier
                                        {sortKey ===
                                            "supplierName" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "phone"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Phone
                                        {sortKey ===
                                            "phone" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "remarks"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Remarks
                                        {sortKey ===
                                            "remarks" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "status"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Status
                                        {sortKey ===
                                            "status" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedRecords.map(
                                    (supplier) => (
                                        <tr
                                            key={
                                                supplier.supplierId
                                            }
                                        >
                                            <td>
                                                {
                                                    supplier.supplierId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    supplier.supplierName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    supplier.phone
                                                }
                                            </td>

                                            <td>
                                                {
                                                    supplier.remarks ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        supplier.status ===
                                                        "ACTIVE"
                                                            ? "badge bg"
                                                            : "badge br"
                                                    }
                                                >
                                                    {
                                                        supplier.status
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        type="button"
                                                        className="action-btn view-btn"
                                                        onClick={() =>
                                                            handleViewSupplier(
                                                                supplier.supplierId
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn edit-btn"
                                                        onClick={() =>
                                                            handleEditSupplier(
                                                                supplier.supplierId
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn delete-btn"
                                                        onClick={() =>
                                                            handleDeleteSupplier(
                                                                supplier
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
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalRecords={totalRecords}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                            onPageSizeChange={
                                handlePageSizeChange
                            }
                        />
                    </div>
                )}
            </section>

            {/* ================================================== */}
            {/* VIEW MODAL */}
            {/* ================================================== */}

            <ViewModal
                isOpen={
                    viewLoading ||
                    !!viewError ||
                    !!selectedSupplier
                }
                onClose={closeViewModal}
                title="Supplier Details"
                subtitle="View supplier information"
                size="lg"
            >
                {viewLoading && (
                    <div className="empty-state">
                        Loading supplier details...
                    </div>
                )}

                {!viewLoading && viewError && (
                    <div className="alert e show">
                        {viewError}
                    </div>
                )}

                {!viewLoading &&
                    !viewError &&
                    selectedSupplier && (
                        <DetailGrid>
                            <DetailItem
                                label="Supplier ID"
                                value={
                                    selectedSupplier.supplierId
                                }
                            />

                            <DetailItem
                                label="Supplier Name"
                                value={
                                    selectedSupplier.supplierName
                                }
                            />

                            <DetailItem
                                label="Contact Person"
                                value={
                                    selectedSupplier.contactPerson
                                }
                            />

                            <DetailItem
                                label="Phone"
                                value={
                                    selectedSupplier.phone
                                }
                            />

                            <DetailItem
                                label="WhatsApp"
                                value={
                                    selectedSupplier.whatsapp
                                }
                            />

                            <DetailItem
                                label="GST Number"
                                value={
                                    selectedSupplier.gstNumber
                                }
                            />

                            <DetailItem
                                label="Remarks"
                                value={
                                    selectedSupplier.remarks ||
                                    "-"
                                }
                                fullWidth
                            />

                            <DetailItem
                                label="Status"
                                value={
                                    selectedSupplier.status
                                }
                                type="badge"
                            />

                            <DetailItem
                                label="Created At"
                                value={formatCreatedAt(
                                    selectedSupplier.createdAt
                                )}
                            />

                            <DetailItem
                                label="Address"
                                value={
                                    selectedSupplier.address
                                }
                                fullWidth
                            />
                        </DetailGrid>
                    )}
            </ViewModal>

            {/* ================================================== */}
            {/* EDIT MODAL */}
            {/* ================================================== */}

            <FormModal
                isOpen={
                    editLoading ||
                    !!editingSupplier
                }
                onClose={closeEditModal}
                title="Edit Supplier"
                subtitle="Update supplier information"
                size="lg"
                onSubmit={handleEditSubmit}
                submitLabel={
                    editSaving
                        ? "Saving..."
                        : "Save Changes"
                }
                saving={
                    editSaving ||
                    editLoading
                }
            >
                {editLoading && (
                    <div className="empty-state">
                        Loading supplier...
                    </div>
                )}

                {!editLoading && (
                    <>
                        {editError && (
                            <div className="alert e show">
                                {editError}
                            </div>
                        )}

                        {editSuccess && (
                            <div className="alert s show">
                                {editSuccess}
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="fld">
                                <label>
                                    Supplier Name
                                </label>

                                <input
                                    type="text"
                                    name="supplierName"
                                    value={
                                        editForm.supplierName
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />
                            </div>

                            <div className="fld">
                                <label>
                                    Contact Person
                                </label>

                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={
                                        editForm.contactPerson
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />
                            </div>

                            <div className="fld">
                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={
                                        editForm.phone
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />
                            </div>

                            <div className="fld">
                                <label>
                                    WhatsApp
                                </label>

                                <input
                                    type="text"
                                    name="whatsapp"
                                    value={
                                        editForm.whatsapp
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />
                            </div>

                            <div className="fld">
                                <label>
                                    GST Number
                                </label>

                                <input
                                    type="text"
                                    name="gstNumber"
                                    value={
                                        editForm.gstNumber
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />
                            </div>

                            <div className="fld">
                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={
                                        editForm.address
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    rows="3"
                                />
                            </div>

                            <div className="fld">
                                <label>
                                    Remarks
                                </label>

                                <textarea
                                    name="remarks"
                                    value={
                                        editForm.remarks
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    rows="3"
                                    placeholder="Example: Sand, Cement"
                                />
                            </div>
                        </div>
                    </>
                )}
            </FormModal>

            {/* ================================================== */}
            {/* ADD MODAL */}
            {/* ================================================== */}

            <FormModal
                isOpen={showAddSupplierModal}
                onClose={closeAddModal}
                title="Add Supplier"
                subtitle="Enter supplier information"
                size="lg"
                onSubmit={handleAddSubmit}
                submitText={
                    addSaving
                        ? "Saving..."
                        : "Add Supplier"
                }
                submitDisabled={addSaving}
            >
                {addError && (
                    <div className="alert e show">
                        {addError}
                    </div>
                )}

                {addSuccess && (
                    <div className="alert s show">
                        {addSuccess}
                    </div>
                )}

                <div className="form-grid">
                    <div className="fld">
                        <label>
                            Supplier Name
                        </label>

                        <input
                            type="text"
                            name="supplierName"
                            value={
                                addForm.supplierName
                            }
                            onChange={
                                handleAddChange
                            }
                        />
                    </div>

                    <div className="fld">
                        <label>
                            Contact Person
                        </label>

                        <input
                            type="text"
                            name="contactPerson"
                            value={
                                addForm.contactPerson
                            }
                            onChange={
                                handleAddChange
                            }
                        />
                    </div>

                    <div className="fld">
                        <label>
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={addForm.phone}
                            onChange={
                                handleAddChange
                            }
                        />
                    </div>

                    <div className="fld">
                        <label>
                            WhatsApp
                        </label>

                        <input
                            type="text"
                            name="whatsapp"
                            value={
                                addForm.whatsapp
                            }
                            onChange={
                                handleAddChange
                            }
                        />
                    </div>

                    <div className="fld">
                        <label>
                            GST Number
                        </label>

                        <input
                            type="text"
                            name="gstNumber"
                            value={
                                addForm.gstNumber
                            }
                            onChange={
                                handleAddChange
                            }
                        />
                    </div>

                    <div className="fld">
                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={
                                addForm.address
                            }
                            onChange={
                                handleAddChange
                            }
                            rows="3"
                        />
                    </div>

                    <div className="fld">
                        <label>
                            Remarks
                        </label>

                        <textarea
                            name="remarks"
                            value={
                                addForm.remarks
                            }
                            onChange={
                                handleAddChange
                            }
                            rows="3"
                            placeholder="Example: Sand, Cement"
                        />
                    </div>
                </div>
            </FormModal>

            {/* ================================================== */}
            {/* DELETE CONFIRMATION */}
            {/* ================================================== */}

            <DeleteConfirmModal
                isOpen={!!deletingSupplier}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                itemName={
                    deletingSupplier?.supplierName ||
                    "this supplier"
                }
                loading={deleteSaving}
                error={deleteError}
            />
        </div>
    );
}

export default Supplier;