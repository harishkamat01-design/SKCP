import { useEffect, useState } from "react";

import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete
} from "../../../services/api";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import { DetailGrid, DetailItem } from "../../ui/common/DetailGrid";

function Labour() {

    // ============================================================
    // STATE
    // ============================================================

    const [searchKeyword, setSearchKeyword] = useState("");
    const [labours, setLabours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [showViewModal, setShowViewModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedLabour, setSelectedLabour] = useState(null);

    const [formMode, setFormMode] = useState("add");

    const [formData, setFormData] = useState({
        labourName: "",
        phone: "",
        address: "",
        joiningDate: "",
        skillType: "",
        dailyRate: ""
    });

    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ============================================================
    // FETCH ALL LABOURS
    // ============================================================

    const fetchLabours = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet("/api/labours");

            setLabours(
                Array.isArray(result?.data)
                    ? result.data
                    : []
            );

        } catch (err) {
            console.error("Error fetching labours:", err);

            setError(
                err.message ||
                "Unable to load labours. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchLabours();
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredLabours = labours.filter((labour) => {

        const keyword =
            searchKeyword.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            String(labour.labourId || "")
                .toLowerCase()
                .includes(keyword) ||

            labour.labourName
                ?.toLowerCase()
                .includes(keyword) ||

            labour.phone
                ?.toLowerCase()
                .includes(keyword) ||

            labour.skillType
                ?.toLowerCase()
                .includes(keyword) ||

            labour.status
                ?.toLowerCase()
                .includes(keyword)
        );
    });

    // ============================================================
    // FORM INPUT HANDLER
    // ============================================================

    const handleInputChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    // ============================================================
    // OPEN ADD FORM
    // ============================================================

    const handleAddLabour = () => {

        setFormMode("add");

        setSelectedLabour(null);

        setFormError("");

        setFormData({
            labourName: "",
            phone: "",
            address: "",
            joiningDate: "",
            skillType: "",
            dailyRate: ""
        });

        setShowFormModal(true);
    };

    // ============================================================
    // OPEN VIEW MODAL
    // ============================================================

    const handleViewLabour = async (labour) => {

        try {

            setError("");

            const result =
                await apiGet(
                    `/api/labours/${labour.labourId}`
                );

            setSelectedLabour(result?.data || null);

            setShowViewModal(true);

        } catch (err) {

            console.error(
                "Error fetching labour details:",
                err
            );

            setError(
                err.message ||
                "Unable to load labour details."
            );
        }
    };

    // ============================================================
    // OPEN EDIT FORM
    // ============================================================

    const handleEditLabour = async (labour) => {

        try {

            setFormError("");

            const result =
                await apiGet(
                    `/api/labours/${labour.labourId}`
                );

            const labourDetails = result?.data;

            setSelectedLabour(labourDetails);

            setFormData({
                labourName:
                    labourDetails?.labourName || "",

                phone:
                    labourDetails?.phone || "",

                address:
                    labourDetails?.address || "",

                joiningDate:
                    labourDetails?.joiningDate || "",

                skillType:
                    labourDetails?.skillType || "",

                dailyRate:
                    labourDetails?.dailyRate ?? ""
            });

            setFormMode("edit");

            setShowFormModal(true);

        } catch (err) {

            console.error(
                "Error fetching labour for edit:",
                err
            );

            setError(
                err.message ||
                "Unable to load labour details."
            );
        }
    };

    // ============================================================
    // OPEN DELETE CONFIRMATION
    // ============================================================

    const handleDeleteLabour = (labour) => {

        setSelectedLabour(labour);
        setDeleteError("");
        setShowDeleteModal(true);
    };

    // ============================================================
    // CLOSE VIEW MODAL
    // ============================================================

    const handleCloseViewModal = () => {

        setShowViewModal(false);
        setSelectedLabour(null);
    };

    // ============================================================
    // CLOSE FORM MODAL
    // ============================================================

    const handleCloseFormModal = () => {

        if (submitting) {
            return;
        }

        setShowFormModal(false);
        setSelectedLabour(null);
        setFormError("");
    };

    // ============================================================
    // CLOSE DELETE MODAL
    // ============================================================

    const handleCloseDeleteModal = () => {

        if (deleting) {
            return;
        }

        setShowDeleteModal(false);
        setSelectedLabour(null);
        setDeleteError("");
    };

    // ============================================================
    // CREATE / UPDATE LABOUR
    // ============================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSubmitting(true);
            setFormError("");

            const payload = {
                labourName:
                    formData.labourName.trim(),

                phone:
                    formData.phone.trim(),

                address:
                    formData.address.trim(),

                joiningDate:
                    formData.joiningDate,

                skillType:
                    formData.skillType.trim(),

                dailyRate:
                    Number(formData.dailyRate)
            };

            // ====================================================
            // CREATE
            // ====================================================

            if (formMode === "add") {

                await apiPost(
                    "/api/labours",
                    payload
                );

                setSuccessMessage(
                    "Labour created successfully."
                );
            }

            // ====================================================
            // UPDATE
            // ====================================================

            if (
                formMode === "edit" &&
                selectedLabour
            ) {

                await apiPut(
                    `/api/labours/${selectedLabour.labourId}`,
                    payload
                );

                setSuccessMessage(
                    "Labour updated successfully."
                );
            }

            await fetchLabours();

            handleCloseFormModal();

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

        } catch (err) {

            console.error(
                "Error saving labour:",
                err
            );

            setFormError(
                err.message ||
                "Unable to save labour."
            );

        } finally {

            setSubmitting(false);
        }
    };

    // ============================================================
    // DELETE LABOUR - SOFT DELETE
    // ============================================================

    const confirmDeleteLabour = async () => {

        if (!selectedLabour) {
            return;
        }

        try {

            setDeleting(true);
            setDeleteError("");

            await apiDelete(
                `/api/labours/${selectedLabour.labourId}`
            );

            setSuccessMessage(
                "Labour deleted successfully."
            );

            await fetchLabours();

            setShowDeleteModal(false);
            setSelectedLabour(null);

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

        } catch (err) {

            console.error(
                "Error deleting labour:",
                err
            );

            setDeleteError(
                err.message ||
                "Unable to delete labour."
            );

        } finally {

            setDeleting(false);
        }
    };

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "-";
        }

        return new Date(
            `${dateValue}T00:00:00`
        ).toLocaleDateString(
            "en-IN"
        );
    };

    // ============================================================
    // FORMAT CURRENCY
    // ============================================================

    const formatCurrency = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        return `₹${Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (

        <section className="section active">

            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <div className="card">

                <div className="card-head">

                    <div>

                        <div className="card-title">
                            Labour
                        </div>

                        <div className="kpi-sub">
                            Manage labour information and records
                        </div>

                    </div>

                    <button
                        type="button"
                        className="btn primary"
                        onClick={handleAddLabour}
                    >
                        + Add Labour
                    </button>

                </div>

                {/* Search */}

                <div className="fld customer-search">

                    <label htmlFor="labour-search">
                        Search Labour
                    </label>

                    <input
                        id="labour-search"
                        type="text"
                        placeholder="Search by labour name, mobile, skill type or status..."
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(
                                event.target.value
                            )
                        }
                    />

                </div>

            </div>

            {/* ====================================================
                SUCCESS MESSAGE
            ==================================================== */}

            {successMessage && (

                <div className="card">

                    <div className="empty-state">

                        <p>
                            {successMessage}
                        </p>

                    </div>

                </div>
            )}

            {/* ====================================================
                LABOUR LIST
            ==================================================== */}

            <div className="card">

                <div className="card-head">

                    <div>

                        <div className="card-title">
                            Labour List
                        </div>

                        <div className="kpi-sub">

                            {loading
                                ? "Loading labours..."
                                : `${filteredLabours.length} labour(s)`
                            }

                        </div>

                    </div>

                </div>

                {/* Loading */}

                {loading && (

                    <div className="empty-state">

                        <p>
                            Loading labours...
                        </p>

                    </div>
                )}

                {/* Error */}

                {!loading && error && (

                    <div className="empty-state">

                        <p>
                            {error}
                        </p>

                    </div>
                )}

                {/* Table */}

                {!loading && !error && (

                    <div className="tbl-wrap">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Labour</th>
                                    <th>Phone</th>
                                    <th>Skill Type</th>
                                    <th>Status</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredLabours.map(
                                    (labour) => (

                                        <tr
                                            key={
                                                labour.labourId
                                            }
                                        >

                                            <td>
                                                {
                                                    labour.labourId
                                                }
                                            </td>

                                            <td>

                                                <strong>
                                                    {
                                                        labour.labourName
                                                    }
                                                </strong>

                                            </td>

                                            <td>
                                                {
                                                    labour.phone ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    labour.skillType ||
                                                    "-"
                                                }
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        labour.status ===
                                                        "ACTIVE"
                                                            ? "badge bg"
                                                            : "badge br"
                                                    }
                                                >
                                                    {
                                                        labour.status
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="btn sm"
                                                        onClick={() =>
                                                            handleViewLabour(
                                                                labour
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn sm"
                                                        onClick={() =>
                                                            handleEditLabour(
                                                                labour
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    {labour.status ===
                                                        "ACTIVE" && (

                                                        <button
                                                            type="button"
                                                            className="btn sm"
                                                            onClick={() =>
                                                                handleDeleteLabour(
                                                                    labour
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

                {/* Empty State */}

                {!loading &&
                    !error &&
                    filteredLabours.length === 0 && (

                        <div className="empty-state">

                            <p>
                                No labours found.
                            </p>

                        </div>
                    )}

            </div>

            {/* ====================================================
                VIEW MODAL
            ==================================================== */}

            <ViewModal
                isOpen={showViewModal}
                onClose={handleCloseViewModal}
                title="Labour Details"
                subtitle={
                    selectedLabour
                        ? `Labour ID: ${selectedLabour.labourId}`
                        : ""
                }
                size="lg"
                footer={
                    <button
                        type="button"
                        className="btn"
                        onClick={handleCloseViewModal}
                    >
                        Close
                    </button>
                }
            >

                {selectedLabour && (

                    <DetailGrid>

                        <DetailItem
                            label="Labour ID"
                            value={selectedLabour.labourId}
                        />

                        <DetailItem
                            label="Labour Name"
                            value={
                                selectedLabour.labourName || "-"
                            }
                        />

                        <DetailItem
                            label="Phone"
                            value={
                                selectedLabour.phone || "-"
                            }
                        />

                        <DetailItem
                            label="Address"
                            value={
                                selectedLabour.address || "-"
                            }
                            fullWidth
                        />

                        <DetailItem
                            label="Joining Date"
                            value={
                                formatDate(
                                    selectedLabour.joiningDate
                                )
                            }
                        />

                        <DetailItem
                            label="Skill Type"
                            value={
                                selectedLabour.skillType || "-"
                            }
                        />

                        <DetailItem
                            label="Daily Rate"
                            value={
                                formatCurrency(
                                    selectedLabour.dailyRate
                                )
                            }
                        />

                        <DetailItem
                            label="Status"
                            value={
                                <span
                                    className={
                                        selectedLabour.status ===
                                        "ACTIVE"
                                            ? "badge bg"
                                            : "badge br"
                                    }
                                >
                                    {
                                        selectedLabour.status ||
                                        "-"
                                    }
                                </span>
                            }
                        />

                        <DetailItem
                            label="Created At"
                            value={
                                selectedLabour.createdAt
                                    ? new Date(
                                        selectedLabour.createdAt
                                    ).toLocaleString("en-IN")
                                    : "-"
                            }
                        />

                    </DetailGrid>
                )}

            </ViewModal>

            {/* ====================================================
                ADD / EDIT FORM MODAL
            ==================================================== */}

            <FormModal
                isOpen={showFormModal}
                onClose={handleCloseFormModal}
                title={
                    formMode === "add"
                        ? "Add Labour"
                        : "Edit Labour"
                }
                subtitle={
                    formMode === "add"
                        ? "Enter labour information"
                        : selectedLabour
                            ? `Update labour ID ${selectedLabour.labourId}`
                            : "Update labour information"
                }
                onSubmit={handleSubmit}
                submitLabel={
                    formMode === "add"
                        ? "Add Labour"
                        : "Update Labour"
                }
                cancelLabel="Cancel"
                saving={submitting}
                error={formError}
                size="lg"
            >

                <div className="fld">

                    <label>
                        Labour Name
                    </label>

                    <input
                        type="text"
                        name="labourName"
                        value={formData.labourName}
                        onChange={handleInputChange}
                        required
                    />

                </div>

                <div className="fld">

                    <label>
                        Phone
                    </label>

                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />

                </div>

                <div className="fld">

                    <label>
                        Address
                    </label>

                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />

                </div>

                <div className="fld">

                    <label>
                        Joining Date
                    </label>

                    <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        required
                    />

                </div>

                <div className="fld">

                    <label>
                        Skill Type
                    </label>

                    <input
                        type="text"
                        name="skillType"
                        value={formData.skillType}
                        onChange={handleInputChange}
                        required
                    />

                </div>

                <div className="fld">

                    <label>
                        Daily Rate
                    </label>

                    <input
                        type="number"
                        name="dailyRate"
                        min="0.01"
                        step="0.01"
                        value={formData.dailyRate}
                        onChange={handleInputChange}
                        required
                    />

                </div>

            </FormModal>

            {/* ====================================================
                DELETE CONFIRMATION
            ==================================================== */}

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={confirmDeleteLabour}
                title="Delete Labour"
                subtitle={
                    selectedLabour
                        ? `Labour ID: ${selectedLabour.labourId}`
                        : ""
                }
                message="This labour record will be deactivated and will no longer appear in the active labour list."
                itemName={
                    selectedLabour?.labourName || ""
                }
                confirming={deleting}
                error={deleteError}
            />

        </section>
    );
}

export default Labour;