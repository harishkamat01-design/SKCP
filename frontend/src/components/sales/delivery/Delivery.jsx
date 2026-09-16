import { useEffect, useMemo, useState } from "react";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import {
    DetailGrid,
    DetailItem,
} from "../../ui/common/DetailGrid";

import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
} from "../../../services/api";

const DELIVERY_STATUSES = [
    "PENDING",
    "IN_PROGRESS",
    "DELIVERED",
    "CANCELLED",
];

function Delivery() {
    // ============================================================
    // DEFAULT FORM DATA
    // ============================================================

    const getInitialFormData = () => ({
        orderId: "",
        deliveryDate: "",
        tripNumber: "",
        totalTrips: "",
        vehicleType: "",
        vehicleNumber: "",
        driverName: "",
        transportMode: "",
        transportCost: "",
        deliveryStatus: "PENDING",
        remarks: "",
    });

    // ============================================================
    // STATE
    // ============================================================

    const [deliveryList, setDeliveryList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchKeyword, setSearchKeyword] = useState("");

    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [deleteError, setDeleteError] = useState("");
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const [formData, setFormData] = useState(getInitialFormData);

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // ============================================================
    // FORMATTERS
    // ============================================================

    const formatDate = (dateValue) =>
        dateValue
            ? new Date(`${dateValue}T00:00:00`).toLocaleDateString(
                  "en-GB",
                  {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                  }
              )
            : "-";

    const formatCurrency = (amount) =>
        amount === null || amount === undefined || amount === ""
            ? "-"
            : `₹ ${Number(amount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })}`;

    const formatDateTime = (dateValue) =>
        dateValue
            ? new Date(dateValue).toLocaleString()
            : "-";

    // ============================================================
    // FETCH ALL DELIVERIES
    // ============================================================

        const fetchDeliveries = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await apiGet("/api/deliveries");

                console.log("Deliveries API response:", result);

                setDeliveryList(
                    Array.isArray(result?.data)
                        ? result.data
                        : Array.isArray(result)
                        ? result
                        : []
                );
            } catch (err) {
                console.error(
                    "Error fetching deliveries:",
                    err
                );

                setError(
                    err.message ||
                        "Unable to load deliveries. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchDeliveries();
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredDeliveries = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();

        if (!keyword) {
            return deliveryList;
        }

        return deliveryList.filter((delivery) => {
            return (
                String(delivery.deliveryId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(delivery.orderId || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(delivery.deliveryDate || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(delivery.tripNumber || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(delivery.totalTrips || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(delivery.vehicleType || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(delivery.vehicleNumber || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(delivery.driverName || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(delivery.transportMode || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(delivery.deliveryStatus || "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [deliveryList, searchKeyword]);

    // ============================================================
    // VIEW DELIVERY
    // ============================================================

        const handleView = async (id) => {
            try {
                setError("");

                const result = await apiGet(
                    `/api/deliveries/${id}`
                );

                console.log("Delivery details:", result);

                const delivery = result?.data || result;

                setSelectedDelivery(delivery);
                setShowViewModal(true);
            } catch (err) {
                console.error(
                    "Error fetching delivery details:",
                    err
                );

                setError(
                    err.message ||
                        "Unable to load delivery details."
                );
            }
        };

    // ============================================================
    // OPEN CREATE FORM
    // ============================================================

    const handleAdd = () => {
        setEditingId(null);
        setFormData(getInitialFormData());
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

            const result = await apiGet(
                `/api/deliveries/${id}`
            );

            console.log(
                "Delivery details for edit:",
                result
            );

            const delivery =

                result?.data || result;

            setEditingId(id);

            setFormData({
                orderId: delivery.orderId ?? "",
                deliveryDate:
                    delivery.deliveryDate ?? "",
                tripNumber:
                    delivery.tripNumber ?? "",
                totalTrips:
                    delivery.totalTrips ?? "",
                vehicleType:
                    delivery.vehicleType ?? "",
                vehicleNumber:
                    delivery.vehicleNumber ?? "",
                driverName:
                    delivery.driverName ?? "",
                transportMode:
                    delivery.transportMode ?? "",
                transportCost:
                    delivery.transportCost ?? "",
                deliveryStatus:
                    delivery.deliveryStatus ??
                    "PENDING",
                remarks:
                    delivery.remarks ?? "",
            });

            setShowFormModal(true);
        } catch (err) {
            console.error(
                "Error loading delivery for edit:",
                err
            );

            setError(
                err.message ||
                    "Unable to load the delivery record for editing."
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
            [name]: value,
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

        if (!formData.orderId) {
            setFormError("Order ID is required.");
            return;
        }

        if (Number(formData.orderId) <= 0) {
            setFormError(
                "Order ID must be greater than 0."
            );
            return;
        }

        if (!formData.deliveryDate) {
            setFormError(
                "Delivery date is required."
            );
            return;
        }

        if (!formData.tripNumber) {
            setFormError(
                "Trip number is required."
            );
            return;
        }

        if (Number(formData.tripNumber) <= 0) {
            setFormError(
                "Trip number must be greater than 0."
            );
            return;
        }

        if (!formData.totalTrips) {
            setFormError(
                "Total trips is required."
            );
            return;
        }

        if (Number(formData.totalTrips) <= 0) {
            setFormError(
                "Total trips must be greater than 0."
            );
            return;
        }

        if (
            Number(formData.tripNumber) >
            Number(formData.totalTrips)
        ) {
            setFormError(
                "Trip number cannot be greater than total trips."
            );
            return;
        }

        if (!formData.transportMode.trim()) {
            setFormError(
                "Transport mode is required."
            );
            return;
        }

        if (
            formData.transportCost !== "" &&
            Number(formData.transportCost) < 0
        ) {
            setFormError(
                "Transport cost cannot be negative."
            );
            return;
        }

        if (formData.vehicleType.length > 50) {
            setFormError(
                "Vehicle type must not exceed 50 characters."
            );
            return;
        }

        if (formData.vehicleNumber.length > 20) {
            setFormError(
                "Vehicle number must not exceed 20 characters."
            );
            return;
        }

        if (formData.driverName.length > 100) {
            setFormError(
                "Driver name must not exceed 100 characters."
            );
            return;
        }

        if (formData.transportMode.length > 20) {
            setFormError(
                "Transport mode must not exceed 20 characters."
            );
            return;
        }

        if (
            editingId &&
            !DELIVERY_STATUSES.includes(
                formData.deliveryStatus
            )
        ) {
            setFormError(
                "Invalid delivery status."
            );
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------

        const requestBody = {
            orderId: Number(formData.orderId),

            deliveryDate:
                formData.deliveryDate,

            tripNumber:
                Number(formData.tripNumber),

            totalTrips:
                Number(formData.totalTrips),

            vehicleType:
                formData.vehicleType.trim() === ""
                    ? null
                    : formData.vehicleType.trim(),

            vehicleNumber:
                formData.vehicleNumber.trim() === ""
                    ? null
                    : formData.vehicleNumber.trim(),

            driverName:
                formData.driverName.trim() === ""
                    ? null
                    : formData.driverName.trim(),

            transportMode:
                formData.transportMode.trim(),

            transportCost:
                formData.transportCost === ""
                    ? null
                    : Number(formData.transportCost),

            remarks:
                formData.remarks.trim() === ""
                    ? null
                    : formData.remarks.trim(),
        };

        // --------------------------------------------------------
        // UPDATE ONLY
        // --------------------------------------------------------

        if (editingId) {
            requestBody.deliveryStatus =
                formData.deliveryStatus;
        }

        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        try {
            setSaving(true);

            let result;

            if (editingId) {
                result = await apiPut(
                    `/api/deliveries/${editingId}`,
                    requestBody
                );
            } else {
                result = await apiPost(
                    "/api/deliveries",
                    requestBody
                );
            }

            console.log(
                "Save Delivery response:",
                result
            );

            setShowFormModal(false);
            setEditingId(null);
            setFormData(
                getInitialFormData()
            );
            setFormError("");

            await fetchDeliveries();
            
        } catch (err) {
            console.error(
                "Error saving delivery:",
                err
            );

            setFormError(
                err.message ||
                    "Unable to save delivery."
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // OPEN DELETE MODAL
    // ============================================================

    const handleDelete = (id) => {
        setDeletingId(id);
        setDeleteError("");
        setShowDeleteModal(true);
    };

    // ============================================================
    // CONFIRM DELETE / SOFT DELETE
    // ============================================================

    const confirmDelete = async () => {
        if (!deletingId) {
            return;
        }

        try {
            setConfirmingDelete(true);
            setDeleteError("");
            setError("");

            const response = await fetch(
                `${API_URL}/${deletingId}`,
                {
                    method: "DELETE",
                }
            );

            const result =
                await response.json();

            console.log(
                "Delete Delivery response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        `Delete failed (${response.status})`
                );
            }

            setShowDeleteModal(false);
            setDeletingId(null);

            await fetchDeliveries();
        } catch (err) {
            console.error(
                "Error deleting delivery:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete delivery."
            );
        } finally {
            setConfirmingDelete(false);
        }
    };

    // ============================================================
    // CLOSE VIEW MODAL
    // ============================================================

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedDelivery(null);
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
        setFormData(getInitialFormData());
    };

    // ============================================================
    // CLOSE DELETE MODAL
    // ============================================================

    const closeDeleteModal = () => {
        if (confirmingDelete) {
            return;
        }

        setShowDeleteModal(false);
        setDeletingId(null);
        setDeleteError("");
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <h2>Deliveries</h2>
                    <p>
                        Loading delivery records...
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
                HEADER + SEARCH
            ================================================== */}

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
                        <h2>Deliveries</h2>

                        <p>
                            Manage customer delivery
                            and transport records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={handleAdd}
                    >
                        Add Delivery
                    </button>
                </div>

                <div className="fld production-search">
                    <label>
                        Search Deliveries
                    </label>

                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(
                                event.target.value
                            )
                        }
                        placeholder="Search by delivery ID, order ID, vehicle, driver, status..."
                    />
                </div>
            </section>

            {/* ==================================================
                DELIVERY LIST
            ================================================== */}

            <section className="card">
                <h2>Delivery List</h2>

                <p>
                    {filteredDeliveries.length} delivery
                    {filteredDeliveries.length === 1
                        ? ""
                        : "ies"}
                </p>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {filteredDeliveries.length === 0 ? (
                    <p>
                        No delivery records found.
                    </p>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>
                                        ORDER ID
                                    </th>
                                    <th>
                                        DELIVERY DATE
                                    </th>
                                    <th>TRIP</th>
                                    <th>
                                        VEHICLE
                                    </th>
                                    <th>
                                        DRIVER
                                    </th>
                                    <th>
                                        TRANSPORT MODE
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
                                {filteredDeliveries.map(
                                    (delivery) => (
                                        <tr
                                            key={
                                                delivery.deliveryId
                                            }
                                        >
                                            <td>
                                                {
                                                    delivery.deliveryId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    delivery.orderId
                                                }
                                            </td>

                                            <td>
                                                {formatDate(
                                                    delivery.deliveryDate
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    delivery.tripNumber
                                                }
                                                /
                                                {
                                                    delivery.totalTrips
                                                }
                                            </td>

                                            <td>
                                                {delivery.vehicleType ||
                                                    "-"}

                                                {delivery.vehicleNumber
                                                    ? ` (${delivery.vehicleNumber})`
                                                    : ""}
                                            </td>

                                            <td>
                                                {delivery.driverName ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {delivery.transportMode ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {
                                                    delivery.deliveryStatus
                                                }
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        type="button"
                                                        className="action-btn view-btn"
                                                        onClick={() =>
                                                            handleView(
                                                                delivery.deliveryId
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
                                                                delivery.deliveryId
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
                                                                delivery.deliveryId
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

            {/* ==================================================
                VIEW DELIVERY MODAL
            ================================================== */}

            <ViewModal
                isOpen={showViewModal}
                onClose={closeViewModal}
                title="Delivery Details"
                subtitle={
                    selectedDelivery
                        ? `Delivery ID: ${selectedDelivery.deliveryId}`
                        : "Delivery information"
                }
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
                {selectedDelivery && (
                    <DetailGrid>
                        <DetailItem
                            label="Delivery ID"
                            value={
                                selectedDelivery.deliveryId
                            }
                        />

                        <DetailItem
                            label="Order ID"
                            value={
                                selectedDelivery.orderId
                            }
                        />

                        <DetailItem
                            label="Delivery Date"
                            value={formatDate(
                                selectedDelivery.deliveryDate
                            )}
                        />

                        <DetailItem
                            label="Trip Number"
                            value={
                                selectedDelivery.tripNumber
                            }
                        />

                        <DetailItem
                            label="Total Trips"
                            value={
                                selectedDelivery.totalTrips
                            }
                        />

                        <DetailItem
                            label="Vehicle Type"
                            value={
                                selectedDelivery.vehicleType ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Vehicle Number"
                            value={
                                selectedDelivery.vehicleNumber ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Driver Name"
                            value={
                                selectedDelivery.driverName ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Transport Mode"
                            value={
                                selectedDelivery.transportMode ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Transport Cost"
                            value={formatCurrency(
                                selectedDelivery.transportCost
                            )}
                        />

                        <DetailItem
                            label="Delivery Status"
                            value={
                                selectedDelivery.deliveryStatus ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Record Status"
                            value={
                                selectedDelivery.recordStatus ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Created At"
                            value={formatDateTime(
                                selectedDelivery.createdAt
                            )}
                        />

                        <DetailItem
                            label="Remarks"
                            value={
                                selectedDelivery.remarks ||
                                "-"
                            }
                            fullWidth
                        />
                    </DetailGrid>
                )}
            </ViewModal>

            {/* ==================================================
                CREATE / UPDATE MODAL
            ================================================== */}

            <FormModal
                isOpen={showFormModal}
                onClose={closeFormModal}
                title={
                    editingId
                        ? "Update Delivery"
                        : "Add Delivery"
                }
                subtitle={
                    editingId
                        ? "Update delivery and transport details."
                        : "Create a new delivery record."
                }
                onSubmit={handleSubmit}
                submitLabel={
                    editingId
                        ? "Update Delivery"
                        : "Create Delivery"
                }
                cancelLabel="Cancel"
                saving={saving}
                error={formError}
                size="lg"
            >
                <div className="edit-form-grid">
                    {/* ORDER ID */}

                    <div className="fld">
                        <label htmlFor="orderId">
                            Order ID *
                        </label>

                        <input
                            id="orderId"
                            type="number"
                            name="orderId"
                            value={
                                formData.orderId
                            }
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    {/* DELIVERY DATE */}

                    <div className="fld">
                        <label htmlFor="deliveryDate">
                            Delivery Date *
                        </label>

                        <input
                            id="deliveryDate"
                            type="date"
                            name="deliveryDate"
                            value={
                                formData.deliveryDate
                            }
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* TRIP NUMBER */}

                    <div className="fld">
                        <label htmlFor="tripNumber">
                            Trip Number *
                        </label>

                        <input
                            id="tripNumber"
                            type="number"
                            name="tripNumber"
                            value={
                                formData.tripNumber
                            }
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    {/* TOTAL TRIPS */}

                    <div className="fld">
                        <label htmlFor="totalTrips">
                            Total Trips *
                        </label>

                        <input
                            id="totalTrips"
                            type="number"
                            name="totalTrips"
                            value={
                                formData.totalTrips
                            }
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    {/* VEHICLE TYPE */}

                    <div className="fld">
                        <label htmlFor="vehicleType">
                            Vehicle Type
                        </label>

                        <input
                            id="vehicleType"
                            type="text"
                            name="vehicleType"
                            value={
                                formData.vehicleType
                            }
                            onChange={handleChange}
                            maxLength={50}
                            placeholder="e.g. Truck"
                        />
                    </div>

                    {/* VEHICLE NUMBER */}

                    <div className="fld">
                        <label htmlFor="vehicleNumber">
                            Vehicle Number
                        </label>

                        <input
                            id="vehicleNumber"
                            type="text"
                            name="vehicleNumber"
                            value={
                                formData.vehicleNumber
                            }
                            onChange={handleChange}
                            maxLength={20}
                            placeholder="e.g. KA01AB1234"
                        />
                    </div>

                    {/* DRIVER NAME */}

                    <div className="fld">
                        <label htmlFor="driverName">
                            Driver Name
                        </label>

                        <input
                            id="driverName"
                            type="text"
                            name="driverName"
                            value={
                                formData.driverName
                            }
                            onChange={handleChange}
                            maxLength={100}
                            placeholder="Enter driver name"
                        />
                    </div>

                    {/* TRANSPORT MODE */}

                    <div className="fld">
                        <label htmlFor="transportMode">
                            Transport Mode *
                        </label>

                        <input
                            id="transportMode"
                            type="text"
                            name="transportMode"
                            value={
                                formData.transportMode
                            }
                            onChange={handleChange}
                            maxLength={20}
                            required
                            placeholder="e.g. OWN / HIRED"
                        />
                    </div>

                    {/* TRANSPORT COST */}

                    <div className="fld">
                        <label htmlFor="transportCost">
                            Transport Cost
                        </label>

                        <input
                            id="transportCost"
                            type="number"
                            name="transportCost"
                            value={
                                formData.transportCost
                            }
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>

                    {/* DELIVERY STATUS */}

                    {editingId && (
                        <div className="fld">
                            <label htmlFor="deliveryStatus">
                                Delivery Status *
                            </label>

                            <select
                                id="deliveryStatus"
                                name="deliveryStatus"
                                value={
                                    formData.deliveryStatus
                                }
                                onChange={handleChange}
                                required
                            >
                                {DELIVERY_STATUSES.map(
                                    (status) => (
                                        <option
                                            key={
                                                status
                                            }
                                            value={
                                                status
                                            }
                                        >
                                            {status}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    )}

                    {/* CREATE STATUS INFORMATION */}

                    {!editingId && (
                        <div className="fld">
                            <label>
                                Delivery Status
                            </label>

                            <input
                                type="text"
                                value="PENDING"
                                disabled
                            />

                            <small>
                                New deliveries are
                                automatically created
                                with PENDING status by
                                the backend.
                            </small>
                        </div>
                    )}

                    {/* REMARKS */}

                    <div className="fld edit-full">
                        <label htmlFor="remarks">
                            Remarks
                        </label>

                        <textarea
                            id="remarks"
                            name="remarks"
                            value={
                                formData.remarks
                            }
                            onChange={handleChange}
                            rows={4}
                            placeholder="Enter remarks..."
                        />
                    </div>
                </div>
            </FormModal>

            {/* ==================================================
                DELETE CONFIRMATION MODAL
            ================================================== */}

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Delivery"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this delivery?"
                itemName={
                    deletingId
                        ? `Delivery ID: ${deletingId}`
                        : ""
                }
                confirming={confirmingDelete}
                error={deleteError}
            />
        </div>
    );
}

export default Delivery;