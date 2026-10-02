import { useEffect, useMemo, useState } from "react";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import {
    DetailGrid,
    DetailItem,
} from "../../ui/common/DetailGrid";

import { apiGet, apiPut, apiDelete } from "../../../services/api";

import useTableSort from "../../../hooks/useTableSort";
import usePagination from "../../../hooks/usePagination";
import Pagination from "../../ui/Pagination";

import AddCustomerModal from "./AddCustomerModal";

const initialForm = {
    customerName: "",
    mobileNumber: "",
    alternateMobile: "",
    address: "",
    village: "",
    city: "",
    pincode: "",
    gstNumber: "",
    remarks: "",
};

function Customer() {
    // ============================================================
    // STATE
    // ============================================================

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ------------------------------------------------------------
    // FILTER STATE
    // ------------------------------------------------------------

    const [searchKeyword, setSearchKeyword] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [filterError, setFilterError] = useState("");

    // ------------------------------------------------------------
    // VIEW STATE
    // ------------------------------------------------------------

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");

    // ------------------------------------------------------------
    // ADD / EDIT STATE
    // ------------------------------------------------------------

    const [showAddCustomerModal, setShowAddCustomerModal] =
        useState(false);

    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editForm, setEditForm] = useState(initialForm);
    const [editLoading, setEditLoading] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");

    // ------------------------------------------------------------
    // DELETE STATE
    // ------------------------------------------------------------

    const [deletingCustomer, setDeletingCustomer] = useState(null);
    const [deleteSaving, setDeleteSaving] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ============================================================
    // FORMATTERS
    // ============================================================

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(
            `${String(dateValue).slice(0, 10)}T00:00:00`
        );

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const formatDateTime = (dateValue) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");

        const hour12 = hours % 12 || 12;
        const period = hours >= 12 ? "PM" : "AM";

        return `${day}-${month}-${year} ${String(hour12).padStart(
            2,
            "0"
        )}:${minutes} ${period}`;
    };

    // ============================================================
    // FETCH ALL CUSTOMERS
    // ============================================================

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet("/api/customers");

            console.log("Customers API response:", result);

            setCustomers(
                Array.isArray(result?.data)
                    ? result.data
                    : Array.isArray(result)
                    ? result
                    : []
            );
        } catch (err) {
            console.error("Error fetching customers:", err);

            setError(
                err.message ||
                    "Unable to load customers. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchCustomers();
    }, []);

    // ============================================================
    // DATE FILTER HANDLERS
    // ============================================================

    const handleDateFromChange = (event) => {
        const value = event.target.value;

        setDateFrom(value);

        if (dateTo && value > dateTo) {
            setFilterError(
                "From date cannot be later than To date."
            );
        } else {
            setFilterError("");
        }
    };

    const handleDateToChange = (event) => {
        const value = event.target.value;

        setDateTo(value);

        if (dateFrom && dateFrom > value) {
            setFilterError(
                "From date cannot be later than To date."
            );
        } else {
            setFilterError("");
        }
    };

    // ============================================================
    // CLEAR ALL FILTERS
    // ============================================================

    const handleClearFilters = () => {
        setSearchKeyword("");
        setDateFrom("");
        setDateTo("");
        setFilterError("");
    };

    // ============================================================
    // FILTER
    // ============================================================

    const filteredCustomers = useMemo(() => {
        const keyword = searchKeyword
            .trim()
            .toLowerCase();

        if (dateFrom && dateTo && dateFrom > dateTo) {
            return [];
        }

        return customers.filter((customer) => {
            const searchableText = [
                customer.customerId,
                customer.customerName,
                customer.mobileNumber,
                customer.alternateMobile,
                customer.address,
                customer.village,
                customer.city,
                customer.pincode,
                customer.gstNumber,
                customer.status,
            ]
                .filter(
                    (value) =>
                        value !== null &&
                        value !== undefined
                )
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !keyword ||
                searchableText.includes(keyword);

            const createdDate = customer.createdAt
                ? String(customer.createdAt).slice(0, 10)
                : "";

            const matchesFrom =
                !dateFrom ||
                (createdDate && createdDate >= dateFrom);

            const matchesTo =
                !dateTo ||
                (createdDate && createdDate <= dateTo);

            return (
                matchesSearch &&
                matchesFrom &&
                matchesTo
            );
        });
    }, [
        customers,
        searchKeyword,
        dateFrom,
        dateTo,
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
        filteredCustomers,
        "customerId",
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
        paginatedRecords: paginatedCustomers,
        handlePageChange,
        handlePageSizeChange,
    } = usePagination(
        sortedRecords,
        10
    );

    // ============================================================
    // SORT INDICATOR
    // ============================================================

    const getSortIndicator = (key) =>
        sortKey === key
            ? sortDirection === "asc"
                ? " ↑"
                : " ↓"
            : "";

    // ============================================================
    // STATUS HELPERS
    // ============================================================

    const getStatusLabel = (customer) => {
        const status = String(
            customer?.status || ""
        ).toUpperCase();

        return status || "-";
    };

    // ============================================================
    // OPEN ADD CUSTOMER
    // ============================================================

    const handleAdd = () => {
        setShowAddCustomerModal(true);
    };

    // ============================================================
    // VIEW CUSTOMER
    // ============================================================

    const handleView = async (id) => {
        try {
            setViewError("");
            setViewLoading(true);

            const result = await apiGet(
                `/api/customers/${id}`
            );

            console.log(
                "Customer details:",
                result
            );

            const customer =
                result?.data || result;

            setSelectedCustomer(customer);
        } catch (err) {
            console.error(
                "Error fetching customer details:",
                err
            );

            setViewError(
                err.message ||
                    "Unable to load customer details."
            );
        } finally {
            setViewLoading(false);
        }
    };

    // ============================================================
    // CLOSE VIEW
    // ============================================================

    const closeViewModal = () => {
        if (viewLoading) {
            return;
        }

        setSelectedCustomer(null);
        setViewError("");
        setViewLoading(false);
    };

    // ============================================================
    // FORM HELPERS
    // ============================================================

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const resetEditForm = () => {
        setEditForm(initialForm);
        setEditError("");
        setEditSuccess("");
    };

    // ============================================================
    // VALIDATION
    // ============================================================

    const validateCustomerForm = (form) => {
        if (!form.customerName.trim()) {
            return "Customer name is required.";
        }

        if (!form.mobileNumber.trim()) {
            return "Mobile number is required.";
        }

        return "";
    };

    const buildCustomerPayload = (form) => ({
        customerName: form.customerName.trim(),

        mobileNumber:
            form.mobileNumber.trim(),

        alternateMobile:
            form.alternateMobile.trim() || null,

        address:
            form.address.trim() || null,

        village:
            form.village.trim() || null,

        city:
            form.city.trim() || null,

        pincode:
            form.pincode.trim() || null,

        gstNumber:
            form.gstNumber.trim() || null,

        remarks:
            form.remarks.trim() || null,
    });

    // ============================================================
    // OPEN EDIT CUSTOMER
    // ============================================================

    const handleEdit = async (id) => {
        try {
            setEditError("");
            setEditSuccess("");
            setEditLoading(true);

            const result = await apiGet(
                `/api/customers/${id}`
            );

            console.log(
                "Customer details for edit:",
                result
            );

            const customer =
                result?.data || result;

            if (!customer) {
                throw new Error(
                    "Customer details were not found."
                );
            }

            setEditingCustomer(customer);

            setEditForm({
                customerName:
                    customer.customerName || "",

                mobileNumber:
                    customer.mobileNumber || "",

                alternateMobile:
                    customer.alternateMobile || "",

                address:
                    customer.address || "",

                village:
                    customer.village || "",

                city:
                    customer.city || "",

                pincode:
                    customer.pincode || "",

                gstNumber:
                    customer.gstNumber || "",

                remarks:
                    customer.remarks || "",
            });
        } catch (err) {
            console.error(
                "Error loading customer for edit:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to load the customer record for editing."
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ============================================================
    // UPDATE CUSTOMER
    // ============================================================

    const handleUpdateCustomer = async (event) => {
        event.preventDefault();

        setEditError("");
        setEditSuccess("");

        const validationError =
            validateCustomerForm(editForm);

        if (validationError) {
            setEditError(validationError);
            return;
        }

        if (!editingCustomer?.customerId) {
            setEditError("Customer ID is missing.");
            return;
        }

        try {
            setEditSaving(true);

            const payload =
                buildCustomerPayload(editForm);

            const result = await apiPut(
                `/api/customers/${editingCustomer.customerId}`,
                payload
            );

            console.log(
                "Update Customer response:",
                result
            );

            setEditSuccess(
                result?.message ||
                    "Customer updated successfully."
            );

            await fetchCustomers();

            setTimeout(() => {
                setEditingCustomer(null);
                resetEditForm();
            }, 700);
        } catch (err) {
            console.error(
                "Error updating customer:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to update customer."
            );
        } finally {
            setEditSaving(false);
        }
    };

    // ============================================================
    // CLOSE EDIT MODAL
    // ============================================================

    const closeEditModal = () => {
        if (editSaving) {
            return;
        }

        setEditingCustomer(null);
        resetEditForm();
    };

    // ============================================================
    // OPEN DELETE MODAL
    // ============================================================

    const handleDelete = (customer) => {
        setDeleteError("");
        setDeletingCustomer(customer);
    };

    // ============================================================
    // CONFIRM DELETE / SOFT DELETE
    // ============================================================

    const confirmDelete = async () => {
        if (!deletingCustomer?.customerId) {
            setDeleteError("Customer ID is missing.");
            return;
        }

        try {
            setDeleteSaving(true);
            setDeleteError("");
            setError("");

            const result = await apiDelete(
                `/api/customers/${deletingCustomer.customerId}`
            );

            console.log(
                "Delete Customer response:",
                result
            );

            setDeletingCustomer(null);

            await fetchCustomers();
        } catch (err) {
            console.error(
                "Error deleting customer:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete customer."
            );
        } finally {
            setDeleteSaving(false);
        }
    };

    // ============================================================
    // CLOSE DELETE MODAL
    // ============================================================

    const closeDeleteModal = () => {
        if (deleteSaving) {
            return;
        }

        setDeletingCustomer(null);
        setDeleteError("");
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <h2>Customers</h2>

                    <p>
                        Loading customer records...
                    </p>
                </section>
            </div>
        );
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="page">

            {/* ==================================================
                HEADER + SEARCH + FILTERS
            ================================================== */}

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
                        <h2>Customers</h2>

                        <p>
                            Manage customer information
                            and records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={handleAdd}
                    >
                        Add Customer
                    </button>
                </div>

                {/* ------------------------------------------------
                    FILTER ROW
                ------------------------------------------------ */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "16px",
                        flexWrap: "wrap",
                        marginTop: "16px",
                    }}
                >

                    {/* SEARCH */}

                    <div
                        className="fld production-search"
                        style={{
                            flex: "2 1 320px",
                        }}
                    >
                        <label>
                            Search Customers
                        </label>

                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(event) =>
                                setSearchKeyword(
                                    event.target.value
                                )
                            }
                            placeholder="Search by name, mobile, village, city, GST, status..."
                        />
                    </div>

                    {/* DATE FROM */}

                    <div
                        className="fld"
                        style={{
                            flex: "1 1 180px",
                        }}
                    >
                        <label htmlFor="customerDateFrom">
                            Date From
                        </label>

                        <input
                            id="customerDateFrom"
                            type="date"
                            value={dateFrom}
                            onChange={
                                handleDateFromChange
                            }
                        />
                    </div>

                    {/* DATE TO */}

                    <div
                        className="fld"
                        style={{
                            flex: "1 1 180px",
                        }}
                    >
                        <label htmlFor="customerDateTo">
                            Date To
                        </label>

                        <input
                            id="customerDateTo"
                            type="date"
                            value={dateTo}
                            onChange={
                                handleDateToChange
                            }
                        />
                    </div>

                    {/* CLEAR */}

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={
                            handleClearFilters
                        }
                    >
                        Clear
                    </button>
                </div>

                {/* FILTER ERROR */}

                {filterError && (
                    <div
                        className="form-error"
                        style={{
                            marginTop: "12px",
                        }}
                    >
                        {filterError}
                    </div>
                )}
            </section>

            {/* ==================================================
                CUSTOMER LIST
            ================================================== */}

            <section className="card">

                <h2>Customer List</h2>

                <p>
                    {totalRecords} customer
                    {totalRecords === 1
                        ? ""
                        : "s"}
                </p>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {filterError ? null : totalRecords ===
                  0 ? (
                    <p>
                        {searchKeyword ||
                        dateFrom ||
                        dateTo
                            ? "No customer records match the selected filters."
                            : "No customer records found."}
                    </p>
                ) : (
                    <div className="table-wrap">

                        <table>
                            <thead>
                                <tr>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "customerId"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        ID
                                        {getSortIndicator(
                                            "customerId"
                                        )}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "customerName"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        CUSTOMER
                                        {getSortIndicator(
                                            "customerName"
                                        )}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "mobileNumber"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        MOBILE
                                        {getSortIndicator(
                                            "mobileNumber"
                                        )}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "village"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        VILLAGE
                                        {getSortIndicator(
                                            "village"
                                        )}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "city"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        CITY
                                        {getSortIndicator(
                                            "city"
                                        )}
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
                                        STATUS
                                        {getSortIndicator(
                                            "status"
                                        )}
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>
                            </thead>

                            <tbody>
                                {paginatedCustomers.map(
                                    (customer) => (
                                        <tr
                                            key={
                                                customer.customerId
                                            }
                                        >

                                            <td>
                                                {
                                                    customer.customerId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.customerName ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.mobileNumber ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.village ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.city ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    getStatusLabel(
                                                        customer
                                                    )
                                                }
                                            </td>

                                            <td>
                                                <div className="table-actions">

                                                    <button
                                                        type="button"
                                                        className="action-btn view-btn"
                                                        onClick={() =>
                                                            handleView(
                                                                customer.customerId
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
                                                                customer.customerId
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
                                                                customer
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

                        {/* ------------------------------------------------
                            PAGINATION
                        ------------------------------------------------ */}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalRecords={totalRecords}
                            pageSize={pageSize}
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

            {/* ==================================================
                VIEW CUSTOMER MODAL
            ================================================== */}

            <ViewModal
                isOpen={
                    Boolean(selectedCustomer) ||
                    viewLoading ||
                    Boolean(viewError)
                }
                onClose={closeViewModal}
                title="Customer Details"
                subtitle={
                    selectedCustomer
                        ? `Customer ID: ${selectedCustomer.customerId}`
                        : "Customer information"
                }
                loading={viewLoading}
                error={viewError}
                size="lg"
                footer={
                    <button
                        type="button"
                        className="btn"
                        onClick={closeViewModal}
                    >
                        Close
                    </button>
                }
            >
                {selectedCustomer && (
                    <DetailGrid>

                        <DetailItem
                            label="Customer ID"
                            value={
                                selectedCustomer.customerId
                            }
                        />

                        <DetailItem
                            label="Customer Name"
                            value={
                                selectedCustomer.customerName ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Mobile Number"
                            value={
                                selectedCustomer.mobileNumber ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Alternate Mobile"
                            value={
                                selectedCustomer.alternateMobile ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Village"
                            value={
                                selectedCustomer.village ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="City"
                            value={
                                selectedCustomer.city ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Pincode"
                            value={
                                selectedCustomer.pincode ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="GST Number"
                            value={
                                selectedCustomer.gstNumber ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Record Status"
                            value={
                                getStatusLabel(
                                    selectedCustomer
                                )
                            }
                        />

                        <DetailItem
                            label="Created At"
                            value={formatDateTime(
                                selectedCustomer.createdAt
                            )}
                        />

                        <DetailItem
                            label="Address"
                            value={
                                selectedCustomer.address ||
                                "-"
                            }
                            fullWidth
                        />

                        <DetailItem
                            label="Remarks"
                            value={
                                selectedCustomer.remarks ||
                                "-"
                            }
                            fullWidth
                        />

                    </DetailGrid>
                )}
            </ViewModal>

            {/* ==================================================
                ADD CUSTOMER
            ================================================== */}

            <AddCustomerModal
                isOpen={showAddCustomerModal}
                onClose={() =>
                    setShowAddCustomerModal(false)
                }
                onCustomerCreated={() => {
                    fetchCustomers();
                }}
            />

            {/* ==================================================
                EDIT CUSTOMER MODAL
            ================================================== */}

            <FormModal
                isOpen={Boolean(editingCustomer)}
                onClose={closeEditModal}
                title="Edit Customer"
                subtitle={
                    editingCustomer
                        ? `Customer ID: ${editingCustomer.customerId}`
                        : "Update customer information."
                }
                onSubmit={handleUpdateCustomer}
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
                            Loading customer details...
                        </p>
                    </div>
                ) : (
                    <div className="edit-form-grid">

                        {/* CUSTOMER NAME */}

                        <div className="fld">
                            <label htmlFor="editCustomerName">
                                Customer Name *
                            </label>

                            <input
                                id="editCustomerName"
                                name="customerName"
                                type="text"
                                value={
                                    editForm.customerName
                                }
                                onChange={
                                    handleEditFormChange
                                }
                                placeholder="Enter customer name"
                                required
                            />
                        </div>

                        {/* MOBILE NUMBER */}

                        <div className="fld">
                            <label htmlFor="editMobileNumber">
                                Mobile Number *
                            </label>

                            <input
                                id="editMobileNumber"
                                name="mobileNumber"
                                type="text"
                                value={
                                    editForm.mobileNumber
                                }
                                onChange={
                                    handleEditFormChange
                                }
                                placeholder="Enter mobile number"
                                required
                            />
                        </div>

                        {/* ALTERNATE MOBILE */}

                        <div className="fld">
                            <label htmlFor="editAlternateMobile">
                                Alternate Mobile
                            </label>

                            <input
                                id="editAlternateMobile"
                                name="alternateMobile"
                                type="text"
                                value={
                                    editForm.alternateMobile
                                }
                                onChange={
                                    handleEditFormChange
                                }
                                placeholder="Enter alternate mobile"
                            />
                        </div>

                        {/* GST NUMBER */}

                        <div className="fld">
                            <label htmlFor="editGstNumber">
                                GST Number
                            </label>

                            <input
                                id="editGstNumber"
                                name="gstNumber"
                                type="text"
                                value={
                                    editForm.gstNumber
                                }
                                onChange={
                                    handleEditFormChange
                                }
                                placeholder="Enter GST number"
                            />
                        </div>

                        {/* VILLAGE */}

                        <div className="fld">
                            <label htmlFor="editVillage">
                                Village
                            </label>

                            <input
                                id="editVillage"
                                name="village"
                                type="text"
                                value={
                                    editForm.village
                                }
                                onChange={
                                    handleEditFormChange
                                }
                                placeholder="Enter village"
                            />
                        </div>

                        {/* CITY */}

                        <div className="fld">
                            <label htmlFor="editCity">
                                City
                            </label>

                            <input
                                id="editCity"
                                name="city"
                                type="text"
                                value={
                                    editForm.city
                                }
                                onChange={
                                    handleEditFormChange
                                }
                                placeholder="Enter city"
                            />
                        </div>

                        {/* PINCODE */}

                        <div className="fld">
                            <label htmlFor="editPincode">
                                Pincode
                            </label>

                            <input
                                id="editPincode"
                                name="pincode"
                                type="text"
                                value={
                                    editForm.pincode
                                }
                                onChange={
                                    handleEditFormChange
                                }
                                placeholder="Enter pincode"
                            />
                        </div>

                        {/* ADDRESS */}

                        <div className="fld edit-full">
                            <label htmlFor="editAddress">
                                Address
                            </label>

                            <textarea
                                id="editAddress"
                                name="address"
                                value={
                                    editForm.address
                                }
                                onChange={
                                    handleEditFormChange
                                }
                                rows={3}
                                placeholder="Enter address"
                            />
                        </div>

                        {/* REMARKS */}

                        <div className="fld edit-full">
                            <label htmlFor="editRemarks">
                                Remarks
                            </label>

                            <textarea
                                id="editRemarks"
                                name="remarks"
                                value={
                                    editForm.remarks
                                }
                                onChange={
                                    handleEditFormChange
                                }
                                rows={3}
                                placeholder="Enter remarks..."
                            />
                        </div>

                    </div>
                )}
            </FormModal>

            {/* ==================================================
                DELETE CONFIRMATION MODAL
            ================================================== */}

            <DeleteConfirmModal
                isOpen={Boolean(deletingCustomer)}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Customer"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this customer?"
                itemName={
                    deletingCustomer
                        ? `Customer: ${
                              deletingCustomer.customerName ||
                              "Customer"
                          } (ID: ${
                              deletingCustomer.customerId
                          })`
                        : ""
                }
                confirming={deleteSaving}
                error={deleteError}
            />

        </div>
    );
}

export default Customer;