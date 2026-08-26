import { useEffect, useMemo, useState } from "react";

function Delivery() {
    const API_URL = "http://localhost:8080/api/deliveries";

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

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
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
        remarks: ""
    });

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // ============================================================
    // FETCH ALL DELIVERIES
    // ============================================================

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            const result = await response.json();

            console.log("Deliveries API response:", result);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch deliveries (${response.status})`
                );
            }

            setDeliveryList(result.data || []);
        } catch (err) {
            console.error("Error fetching deliveries:", err);

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

            const response = await fetch(`${API_URL}/${id}`);

            const result = await response.json();

            console.log("Delivery details:", result);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch delivery details (${response.status})`
                );
            }

            setSelectedDelivery(result.data);
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

        setFormData({
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

            const result = await response.json();

            console.log(
                "Delivery details for edit:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to fetch delivery details (${response.status})`
                );
            }

            const delivery = result.data;

            setEditingId(id);

            setFormData({
                orderId: delivery.orderId ?? "",
                deliveryDate: delivery.deliveryDate ?? "",
                tripNumber: delivery.tripNumber ?? "",
                totalTrips: delivery.totalTrips ?? "",
                vehicleType: delivery.vehicleType ?? "",
                vehicleNumber: delivery.vehicleNumber ?? "",
                driverName: delivery.driverName ?? "",
                transportMode: delivery.transportMode ?? "",
                transportCost: delivery.transportCost ?? "",
                deliveryStatus:
                    delivery.deliveryStatus ?? "PENDING",
                remarks: delivery.remarks ?? ""
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

        if (!formData.orderId) {
            setFormError("Order ID is required.");
            return;
        }

        if (Number(formData.orderId) <= 0) {
            setFormError("Order ID must be greater than 0.");
            return;
        }

        if (!formData.deliveryDate) {
            setFormError("Delivery date is required.");
            return;
        }

        if (!formData.tripNumber) {
            setFormError("Trip number is required.");
            return;
        }

        if (Number(formData.tripNumber) <= 0) {
            setFormError("Trip number must be greater than 0.");
            return;
        }

        if (!formData.totalTrips) {
            setFormError("Total trips is required.");
            return;
        }

        if (Number(formData.totalTrips) <= 0) {
            setFormError("Total trips must be greater than 0.");
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
            setFormError("Transport mode is required.");
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

        if (
            formData.vehicleType.length > 50
        ) {
            setFormError(
                "Vehicle type must not exceed 50 characters."
            );
            return;
        }

        if (
            formData.vehicleNumber.length > 20
        ) {
            setFormError(
                "Vehicle number must not exceed 20 characters."
            );
            return;
        }

        if (
            formData.driverName.length > 100
        ) {
            setFormError(
                "Driver name must not exceed 100 characters."
            );
            return;
        }

        if (
            editingId &&
            ![
                "PENDING",
                "IN_PROGRESS",
                "DELIVERED",
                "CANCELLED"
            ].includes(formData.deliveryStatus)
        ) {
            setFormError("Invalid delivery status.");
            return;
        }

        // --------------------------------------------------------
        // REQUEST BODY
        // --------------------------------------------------------
        //
        // CREATE:
        // DeliveryCreateRequest does NOT contain deliveryStatus.
        //
        // UPDATE:
        // DeliveryUpdateRequest REQUIRES deliveryStatus.
        //
        // --------------------------------------------------------

        const requestBody = editingId
            ? {
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

                deliveryStatus:
                    formData.deliveryStatus,

                remarks:
                    formData.remarks.trim() === ""
                        ? null
                        : formData.remarks.trim()
            }
            : {
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
                        : formData.remarks.trim()
            };

        try {
            setSaving(true);

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            console.log(
                "Save Delivery response:",
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
                remarks: ""
            });

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
    // DELETE / SOFT DELETE
    // ============================================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this delivery?"
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
                "Delete Delivery response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Delete failed (${response.status})`
                );
            }

            await fetchDeliveries();
        } catch (err) {
            console.error(
                "Error deleting delivery:",
                err
            );

            setError(
                err.message ||
                "Unable to delete delivery."
            );
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

        setFormData({
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

                <h1>Deliveries</h1>

                <p>
                    Manage customer delivery and transport records
                </p>

            </div>

            {/* ==================================================
                SEARCH + ADD
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>

                        <h2>Deliveries</h2>

                        <p>
                            Manage delivery records
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="primary-button"
                    >
                        Add Delivery
                    </button>

                </div>

                <div className="search-section">

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
                DELIVERY LIST
            ================================================== */}

            <div className="module-card">

                <div className="section-header">

                    <div>

                        <h2>Delivery List</h2>

                        <p>
                            {filteredDeliveries.length} delivery(s)
                        </p>

                    </div>

                </div>

                {loading ? (

                    <p>
                        Loading deliveries...
                    </p>

                ) : filteredDeliveries.length === 0 ? (

                    <p>
                        No deliveries found.
                    </p>

                ) : (

                    <div className="table-container">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>ORDER ID</th>

                                    <th>DELIVERY DATE</th>

                                    <th>TRIP</th>

                                    <th>VEHICLE</th>

                                    <th>DRIVER</th>

                                    <th>TRANSPORT MODE</th>

                                    <th>STATUS</th>

                                    <th>ACTIONS</th>

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
                                                {
                                                    delivery.deliveryDate
                                                }
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
                                                {
                                                    delivery.vehicleType ||
                                                    "-"
                                                }

                                                {delivery.vehicleNumber
                                                    ? ` (${delivery.vehicleNumber})`
                                                    : ""}
                                            </td>

                                            <td>
                                                {
                                                    delivery.driverName ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    delivery.transportMode
                                                }
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        delivery.deliveryStatus
                                                    }
                                                </strong>
                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleView(
                                                            delivery.deliveryId
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
                                                            delivery.deliveryId
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
                                                            delivery.deliveryId
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* ==================================================
                VIEW DELIVERY MODAL
            ================================================== */}

            {showViewModal && selectedDelivery && (

                <div className="modal-overlay">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h2>
                                Delivery Details
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
                                    Delivery ID
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.deliveryId
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Order ID
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.orderId
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Delivery Date
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.deliveryDate
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Trip Number
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.tripNumber
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Total Trips
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.totalTrips
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Vehicle Type
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.vehicleType ||
                                        "-"
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Vehicle Number
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.vehicleNumber ||
                                        "-"
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Driver Name
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.driverName ||
                                        "-"
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Transport Mode
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.transportMode
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Transport Cost
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.transportCost ??
                                        "0.00"
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Delivery Status
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.deliveryStatus
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Record Status
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.recordStatus
                                    }
                                </span>

                            </div>

                            <div>

                                <strong>
                                    Created At
                                </strong>

                                <span>
                                    {
                                        selectedDelivery.createdAt
                                            ? new Date(
                                                selectedDelivery.createdAt
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
                                        selectedDelivery.remarks ||
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
                                    ? "Update Delivery"
                                    : "Add Delivery"}

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

                            {/* ==================================
                                ORDER ID
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Order ID *
                                </label>

                                <input
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

                            {/* ==================================
                                DELIVERY DATE
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Delivery Date *
                                </label>

                                <input
                                    type="date"
                                    name="deliveryDate"
                                    value={
                                        formData.deliveryDate
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* ==================================
                                TRIP NUMBER
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Trip Number *
                                </label>

                                <input
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

                            {/* ==================================
                                TOTAL TRIPS
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Total Trips *
                                </label>

                                <input
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

                            {/* ==================================
                                VEHICLE TYPE
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Vehicle Type
                                </label>

                                <input
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

                            {/* ==================================
                                VEHICLE NUMBER
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Vehicle Number
                                </label>

                                <input
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

                            {/* ==================================
                                DRIVER NAME
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Driver Name
                                </label>

                                <input
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

                            {/* ==================================
                                TRANSPORT MODE
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Transport Mode *
                                </label>

                                <input
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

                            {/* ==================================
                                TRANSPORT COST
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Transport Cost
                                </label>

                                <input
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

                            {/* ==================================
                                DELIVERY STATUS
                            ================================== */}

                            {editingId && (

                                <div className="form-group">

                                    <label>
                                        Delivery Status *
                                    </label>

                                    <select
                                        name="deliveryStatus"
                                        value={
                                            formData.deliveryStatus
                                        }
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="PENDING">
                                            PENDING
                                        </option>

                                        <option value="IN_PROGRESS">
                                            IN_PROGRESS
                                        </option>

                                        <option value="DELIVERED">
                                            DELIVERED
                                        </option>

                                        <option value="CANCELLED">
                                            CANCELLED
                                        </option>

                                    </select>

                                </div>

                            )}

                            {/* ==================================
                                CREATE STATUS INFORMATION
                            ================================== */}

                            {!editingId && (

                                <div className="form-group">

                                    <label>
                                        Delivery Status
                                    </label>

                                    <input
                                        type="text"
                                        value="PENDING"
                                        disabled
                                    />

                                    <small>
                                        New deliveries are automatically
                                        created with PENDING status
                                        by the backend.
                                    </small>

                                </div>

                            )}

                            {/* ==================================
                                REMARKS
                            ================================== */}

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
                                    rows={4}
                                    placeholder="Enter remarks..."
                                />

                            </div>

                            {/* ==================================
                                FORM ACTIONS
                            ================================== */}

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
                                            ? "Update Delivery"
                                            : "Create Delivery"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Delivery;
