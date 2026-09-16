import { useEffect, useState } from "react";

import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
} from "../../../services/api";

function Attendance() {
    // ============================================================
    // STATE
    // ============================================================

    const [searchKeyword, setSearchKeyword] = useState("");
    const [attendance, setAttendance] = useState([]);
    const [labours, setLabours] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================================
    // VIEW MODAL
    // ============================================================

    const [selectedAttendance, setSelectedAttendance] = useState(null);

    // ============================================================
    // EDIT MODAL
    // ============================================================

    const [editingAttendance, setEditingAttendance] = useState(null);

    const [editForm, setEditForm] = useState({
        attendanceDate: "",
        attendanceStatus: "PRESENT",
        leaveReason: "",
        dailyRate: "",
        remarks: "",
    });

    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");

    // ============================================================
    // ADD ATTENDANCE MODAL
    // ============================================================

    const [showAddModal, setShowAddModal] = useState(false);

    const [addForm, setAddForm] = useState({
        labourId: "",
        attendanceDate: "",
        attendanceStatus: "PRESENT",
        leaveReason: "",
        dailyRate: "",
        remarks: "",
    });

    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");

    // ============================================================
    // DELETE MODAL
    // ============================================================

    const [deletingAttendance, setDeletingAttendance] = useState(null);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ============================================================
    // WEEKLY SUMMARY
    // ============================================================

    const [selectedLabourId, setSelectedLabourId] = useState("");
    const [weekStartDate, setWeekStartDate] = useState("");

    const [weeklySummary, setWeeklySummary] = useState(null);

    const [showWeeklySummaryModal, setShowWeeklySummaryModal] =
        useState(false);

    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState("");

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchAttendance();
        fetchLabours();
    }, []);

    // ============================================================
    // FETCH ATTENDANCE
    // ============================================================

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet("/api/attendance");

            console.log(
                "Attendance API response:",
                result
            );

            setAttendance(result.data || []);
        } catch (err) {
            console.error(
                "Error fetching attendance:",
                err
            );

            setError(
                "Unable to load attendance records. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // FETCH LABOURS
    // ============================================================

    const fetchLabours = async () => {
        try {
            const result = await apiGet("/api/labours");

            console.log(
                "Labour API response:",
                result
            );

            setLabours(result.data || []);
        } catch (err) {
            console.error(
                "Error fetching labours:",
                err
            );
        }
    };

    // ============================================================
    // ADD ATTENDANCE
    // ============================================================

    const openAddModal = () => {
        setAddError("");

        setAddForm({
            labourId: "",
            attendanceDate: "",
            attendanceStatus: "PRESENT",
            leaveReason: "",
            dailyRate: "",
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

    const handleCreateAttendance = async (event) => {
        event.preventDefault();

        if (!addForm.labourId) {
            setAddError("Please select a labour.");
            return;
        }

        if (!addForm.attendanceDate) {
            setAddError(
                "Please select an attendance date."
            );
            return;
        }

        if (
            addForm.dailyRate === "" ||
            Number.isNaN(Number(addForm.dailyRate))
        ) {
            setAddError(
                "Please enter a valid daily rate."
            );
            return;
        }

        if (
            addForm.attendanceStatus === "ABSENT" &&
            !addForm.leaveReason.trim()
        ) {
            setAddError(
                "Please enter a leave reason for absent attendance."
            );
            return;
        }

        try {
            setAddLoading(true);
            setAddError("");

            const payload = {
                labourId: Number(addForm.labourId),

                attendanceDate:
                    addForm.attendanceDate,

                attendanceStatus:
                    addForm.attendanceStatus,

                leaveReason:
                    addForm.attendanceStatus ===
                    "ABSENT"
                        ? addForm.leaveReason.trim() ||
                          null
                        : null,

                dailyRate:
                    Number(addForm.dailyRate),

                remarks:
                    addForm.remarks.trim() || null,
            };

            console.log(
                "Creating attendance with payload:",
                payload
            );

            const result = await apiPost(
                "/api/attendance",
                payload
            );

            console.log(
                "Attendance created:",
                result
            );

            setShowAddModal(false);

            setAddForm({
                labourId: "",
                attendanceDate: "",
                attendanceStatus: "PRESENT",
                leaveReason: "",
                dailyRate: "",
                remarks: "",
            });

            await fetchAttendance();
        } catch (err) {
            console.error(
                "Error creating attendance:",
                err
            );

            setAddError(
                err.message ||
                    "Unable to create attendance record."
            );
        } finally {
            setAddLoading(false);
        }
    };

    // ============================================================
    // FETCH WEEKLY SUMMARY
    // ============================================================

    const closeWeeklySummaryModal = () => {
        setShowWeeklySummaryModal(false);
    };

    const fetchWeeklySummary = async () => {
        if (!selectedLabourId || !weekStartDate) {
            setSummaryError(
                "Please select a labour and week start date."
            );

            return;
        }

        try {
            setSummaryLoading(true);
            setSummaryError("");
            setWeeklySummary(null);

            const params = new URLSearchParams({
                labourId: selectedLabourId,
                weekStartDate: weekStartDate,
            });

            const result = await apiGet(
                `/api/attendance/summary/weekly?${params.toString()}`
            );

            console.log(
                "Weekly Attendance Summary:",
                result
            );

            setWeeklySummary(result.data || null);

            setShowWeeklySummaryModal(true);
        } catch (err) {
            console.error(
                "Error fetching weekly attendance summary:",
                err
            );

            setSummaryError(
                err.message ||
                    "Unable to load weekly attendance summary."
            );
        } finally {
            setSummaryLoading(false);
        }
    };

    // ============================================================
    // VIEW ATTENDANCE
    // ============================================================

    const handleView = (record) => {
        setSelectedAttendance(record);
    };

    const closeViewModal = () => {
        setSelectedAttendance(null);
    };

    // ============================================================
    // EDIT ATTENDANCE
    // ============================================================

    const handleEdit = (record) => {
        setEditError("");

        setEditingAttendance(record);

        setEditForm({
            attendanceDate:
                record.attendanceDate || "",

            attendanceStatus:
                record.attendanceStatus ||
                "PRESENT",

            leaveReason:
                record.leaveReason || "",

            dailyRate:
                record.dailyRate ?? "",

            remarks:
                record.remarks || "",
        });
    };

    const closeEditModal = () => {
        if (editLoading) {
            return;
        }

        setEditingAttendance(null);
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
    // UPDATE ATTENDANCE
    // ============================================================

    const handleUpdateAttendance = async (event) => {
        event.preventDefault();

        if (!editingAttendance) {
            return;
        }

        if (
            editForm.dailyRate === "" ||
            Number.isNaN(Number(editForm.dailyRate))
        ) {
            setEditError(
                "Please enter a valid daily rate."
            );

            return;
        }

        try {
            setEditLoading(true);
            setEditError("");

            const payload = {
                attendanceDate:
                    editForm.attendanceDate,

                attendanceStatus:
                    editForm.attendanceStatus,

                leaveReason:
                    editForm.attendanceStatus ===
                    "ABSENT"
                        ? editForm.leaveReason.trim() ||
                          null
                        : null,

                dailyRate:
                    Number(editForm.dailyRate),

                remarks:
                    editForm.remarks.trim() || null,
            };

            console.log(
                "Updating attendance with payload:",
                payload
            );

            const result = await apiPut(
                `/api/attendance/${editingAttendance.attendanceId}`,
                payload
            );

            console.log(
                "Attendance updated:",
                result
            );

            const updatedLabourId =
                editingAttendance.labourId;

            setEditingAttendance(null);

            await fetchAttendance();

            if (
                selectedLabourId &&
                weekStartDate &&
                String(selectedLabourId) ===
                    String(updatedLabourId)
            ) {
                await fetchWeeklySummary();
            }
        } catch (err) {
            console.error(
                "Error updating attendance:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to update attendance record."
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ============================================================
    // DELETE ATTENDANCE
    // ============================================================

    const handleDelete = (record) => {
        setDeleteError("");
        setDeletingAttendance(record);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) {
            return;
        }

        setDeletingAttendance(null);
        setDeleteError("");
    };

    const handleConfirmDelete = async () => {
        if (!deletingAttendance) {
            return;
        }

        try {
            setDeleteLoading(true);
            setDeleteError("");

            console.log(
                "Deleting attendance ID:",
                deletingAttendance.attendanceId
            );

            const result = await apiDelete(
                `/api/attendance/${deletingAttendance.attendanceId}`
            );

            console.log(
                "Attendance deleted:",
                result
            );

            setDeletingAttendance(null);

            await fetchAttendance();
        } catch (err) {
            console.error(
                "Error deleting attendance:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete attendance record."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredAttendance =
        attendance.filter((record) => {
            const keyword =
                searchKeyword
                    .toLowerCase()
                    .trim();

            if (!keyword) {
                return true;
            }

            return (
                String(
                    record.labourName || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    record.labourId || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    record.attendanceDate || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    record.attendanceStatus || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    record.status || ""
                )
                    .toLowerCase()
                    .includes(keyword)
            );
        });

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
    // RENDER
    // ============================================================

    return (
        <>
            {/* ====================================================
                ATTENDANCE HEADER
            ==================================================== */}

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
                        <h2>Attendance</h2>

                        <p>
                            Manage daily labour attendance
                            and weekly attendance summaries.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={openAddModal}
                    >
                        + Add Attendance
                    </button>
                </div>

                <div className="fld attendance-search">
                    <label htmlFor="attendance-search">
                        Search Attendance
                    </label>

                    <input
                        id="attendance-search"
                        type="text"
                        placeholder="Search by labour name, ID, date or status..."
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(
                                event.target.value
                            )
                        }
                    />
                </div>
            </section>

            {/* ====================================================
                WEEKLY SUMMARY
            ==================================================== */}

            <section className="card">
                <h2>Weekly Attendance Summary</h2>

                <p>
                    View weekly attendance and labour
                    payment summary.
                </p>

                <div className="attendance-summary-filters">
                    <div className="fld">
                        <label htmlFor="attendance-labour">
                            Labour
                        </label>

                        <select
                            id="attendance-labour"
                            value={selectedLabourId}
                            onChange={(event) => {
                                setSelectedLabourId(
                                    event.target.value
                                );

                                setWeeklySummary(null);
                                setSummaryError("");
                            }}
                        >
                            <option value="">
                                Select Labour
                            </option>

                            {labours
                                .filter(
                                    (labour) =>
                                        labour.status ===
                                        "ACTIVE"
                                )
                                .map((labour) => (
                                    <option
                                        key={
                                            labour.labourId
                                        }
                                        value={
                                            labour.labourId
                                        }
                                    >
                                        {
                                            labour.labourName
                                        }
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="fld">
                        <label htmlFor="week-start-date">
                            Week Start Date
                        </label>

                        <input
                            id="week-start-date"
                            type="date"
                            value={weekStartDate}
                            onChange={(event) => {
                                setWeekStartDate(
                                    event.target.value
                                );

                                setWeeklySummary(null);
                                setSummaryError("");
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={fetchWeeklySummary}
                        disabled={summaryLoading}
                    >
                        {summaryLoading
                            ? "Loading..."
                            : "View Weekly Summary"}
                    </button>
                </div>

                {summaryError && (
                    <p className="form-error">
                        {summaryError}
                    </p>
                )}
            </section>

            {/* ====================================================
                ATTENDANCE LIST
            ==================================================== */}

            <section className="card">
                <h2>Attendance List</h2>

                <p>
                    {loading
                        ? "Loading..."
                        : `${filteredAttendance.length} attendance record(s)`}
                </p>

                {loading && (
                    <p>
                        Loading attendance records...
                    </p>
                )}

                {!loading && error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    filteredAttendance.length ===
                        0 && (
                        <p>
                            No attendance records
                            found.
                        </p>
                    )}

                {!loading &&
                    !error &&
                    filteredAttendance.length >
                        0 && (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>LABOUR</th>
                                        <th>
                                            ATTENDANCE
                                        </th>
                                        <th>
                                            DAILY RATE
                                        </th>
                                        <th>
                                            DAILY AMOUNT
                                        </th>
                                        <th>
                                            REMARKS
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
                                    {filteredAttendance.map(
                                        (record) => (
                                            <tr
                                                key={
                                                    record.attendanceId
                                                }
                                            >
                                                <td>
                                                    {
                                                        record.attendanceId
                                                    }
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        record.attendanceDate
                                                    )}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            record.labourName
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        record.attendanceStatus
                                                    }
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        record.dailyRate
                                                    )}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        record.dailyAmount
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        record.remarks ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        record.status ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    <div className="table-actions">
                                                        <button
                                                            type="button"
                                                            className="action-btn view-btn"
                                                            onClick={() =>
                                                                handleView(
                                                                    record
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
                                                                    record
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
                                                                    record
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
                ADD ATTENDANCE MODAL
            ==================================================== */}

            {showAddModal && (
                <div
                    className="modal-overlay"
                    onClick={closeAddModal}
                >
                    <div
                        className="modal attendance-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <h2>
                                    Add Attendance
                                </h2>

                                <p>
                                    Record new labour
                                    attendance
                                    information
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    closeAddModal
                                }
                                disabled={addLoading}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleCreateAttendance
                            }
                        >
                            <div className="edit-form-grid">
                                {/* LABOUR */}

                                <div className="fld">
                                    <label htmlFor="add-labour">
                                        Labour
                                    </label>

                                    <select
                                        id="add-labour"
                                        name="labourId"
                                        value={
                                            addForm.labourId
                                        }
                                        onChange={
                                            handleAddChange
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Labour
                                        </option>

                                        {labours
                                            .filter(
                                                (labour) =>
                                                    labour.status ===
                                                    "ACTIVE"
                                            )
                                            .map(
                                                (
                                                    labour
                                                ) => (
                                                    <option
                                                        key={
                                                            labour.labourId
                                                        }
                                                        value={
                                                            labour.labourId
                                                        }
                                                    >
                                                        {
                                                            labour.labourName
                                                        }
                                                    </option>
                                                )
                                            )}
                                    </select>
                                </div>

                                {/* ATTENDANCE DATE */}

                                <div className="fld">
                                    <label htmlFor="add-attendance-date">
                                        Attendance Date
                                    </label>

                                    <input
                                        id="add-attendance-date"
                                        type="date"
                                        name="attendanceDate"
                                        value={
                                            addForm.attendanceDate
                                        }
                                        onChange={
                                            handleAddChange
                                        }
                                        required
                                    />
                                </div>

                                {/* ATTENDANCE STATUS */}

                                <div className="fld">
                                    <label htmlFor="add-attendance-status">
                                        Attendance Status
                                    </label>

                                    <select
                                        id="add-attendance-status"
                                        name="attendanceStatus"
                                        value={
                                            addForm.attendanceStatus
                                        }
                                        onChange={
                                            handleAddChange
                                        }
                                        required
                                    >
                                        <option value="PRESENT">
                                            PRESENT
                                        </option>

                                        <option value="ABSENT">
                                            ABSENT
                                        </option>

                                        <option value="HOLIDAY">
                                            HOLIDAY
                                        </option>
                                    </select>
                                </div>

                                {/* DAILY RATE */}

                                <div className="fld">
                                    <label htmlFor="add-daily-rate">
                                        Daily Rate
                                    </label>

                                    <input
                                        id="add-daily-rate"
                                        type="number"
                                        name="dailyRate"
                                        step="0.01"
                                        min="0"
                                        value={
                                            addForm.dailyRate
                                        }
                                        onChange={
                                            handleAddChange
                                        }
                                        placeholder="Enter daily rate"
                                        required
                                    />
                                </div>

                                {/* LEAVE REASON */}

                                {addForm.attendanceStatus ===
                                    "ABSENT" && (
                                    <div className="fld edit-full">
                                        <label htmlFor="add-leave-reason">
                                            Leave Reason
                                        </label>

                                        <input
                                            id="add-leave-reason"
                                            type="text"
                                            name="leaveReason"
                                            value={
                                                addForm.leaveReason
                                            }
                                            onChange={
                                                handleAddChange
                                            }
                                            placeholder="Enter leave reason"
                                        />
                                    </div>
                                )}

                                {/* REMARKS */}

                                <div className="fld edit-full">
                                    <label htmlFor="add-remarks">
                                        Remarks
                                    </label>

                                    <textarea
                                        id="add-remarks"
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

                            {addError && (
                                <p className="form-error">
                                    {addError}
                                </p>
                            )}

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={
                                        closeAddModal
                                    }
                                    disabled={
                                        addLoading
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="action-btn view-btn"
                                    disabled={
                                        addLoading
                                    }
                                >
                                    {addLoading
                                        ? "Saving..."
                                        : "Add Attendance"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ====================================================
                WEEKLY SUMMARY MODAL
            ==================================================== */}

            {showWeeklySummaryModal &&
                weeklySummary && (
                    <div
                        className="modal-overlay"
                        onClick={
                            closeWeeklySummaryModal
                        }
                    >
                        <div
                            className="modal attendance-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="modal-header">
                                <div>
                                    <h2>
                                        Weekly Attendance
                                        Summary
                                    </h2>

                                    <p>
                                        Labour attendance
                                        and payment
                                        summary
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={
                                        closeWeeklySummaryModal
                                    }
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="details-grid">
                                <div className="detail-item">
                                    <span>
                                        Labour
                                    </span>

                                    <strong>
                                        {weeklySummary.labourName ||
                                            "-"}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Labour ID
                                    </span>

                                    <strong>
                                        {weeklySummary.labourId ||
                                            selectedLabourId ||
                                            "-"}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Week Start Date
                                    </span>

                                    <strong>
                                        {formatDate(
                                            weeklySummary.weekStartDate ||
                                                weekStartDate
                                        )}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Week End Date
                                    </span>

                                    <strong>
                                        {formatDate(
                                            weeklySummary.weekEndDate
                                        )}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Present Days
                                    </span>

                                    <strong>
                                        {weeklySummary.presentDays ??
                                            "-"}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Absent Days
                                    </span>

                                    <strong>
                                        {weeklySummary.absentDays ??
                                            "-"}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Holiday Days
                                    </span>

                                    <strong>
                                        {weeklySummary.holidayDays ??
                                            "-"}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Total Days
                                    </span>

                                    <strong>
                                        {weeklySummary.totalDays ??
                                            "-"}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            weeklySummary.totalAmount
                                        )}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Total Payment
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            weeklySummary.totalPayment
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={
                                        closeWeeklySummaryModal
                                    }
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* ====================================================
                VIEW MODAL
            ==================================================== */}

            {selectedAttendance && (
                <div
                    className="modal-overlay"
                    onClick={closeViewModal}
                >
                    <div
                        className="modal attendance-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <h2>
                                    Attendance Details
                                </h2>

                                <p>
                                    View attendance
                                    information
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    closeViewModal
                                }
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <div className="details-grid">
                            <div className="detail-item">
                                <span>
                                    Attendance ID
                                </span>

                                <strong>
                                    {
                                        selectedAttendance.attendanceId
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Attendance Date
                                </span>

                                <strong>
                                    {formatDate(
                                        selectedAttendance.attendanceDate
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Labour
                                </span>

                                <strong>
                                    {
                                        selectedAttendance.labourName
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Labour ID
                                </span>

                                <strong>
                                    {
                                        selectedAttendance.labourId
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Attendance Status
                                </span>

                                <strong>
                                    {
                                        selectedAttendance.attendanceStatus
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Leave Reason
                                </span>

                                <strong>
                                    {
                                        selectedAttendance.leaveReason ||
                                        "-"
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Daily Rate
                                </span>

                                <strong>
                                    {formatCurrency(
                                        selectedAttendance.dailyRate
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Daily Amount
                                </span>

                                <strong>
                                    {formatCurrency(
                                        selectedAttendance.dailyAmount
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Record Status
                                </span>

                                <strong>
                                    {
                                        selectedAttendance.status ||
                                        "-"
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Created At
                                </span>

                                <strong>
                                    {
                                        selectedAttendance.createdAt ||
                                        "-"
                                    }
                                </strong>
                            </div>

                            <div className="detail-item detail-full">
                                <span>
                                    Remarks
                                </span>

                                <strong>
                                    {
                                        selectedAttendance.remarks ||
                                        "-"
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={
                                    closeViewModal
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ====================================================
                EDIT MODAL
            ==================================================== */}

            {editingAttendance && (
                <div
                    className="modal-overlay"
                    onClick={closeEditModal}
                >
                    <div
                        className="modal attendance-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <h2>
                                    Edit Attendance
                                </h2>

                                <p>
                                    Update attendance
                                    information
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    closeEditModal
                                }
                                disabled={editLoading}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleUpdateAttendance
                            }
                        >
                            <div className="edit-form-grid">
                                {/* LABOUR */}

                                <div className="fld">
                                    <label htmlFor="edit-labour">
                                        Labour
                                    </label>

                                    <input
                                        id="edit-labour"
                                        type="text"
                                        value={
                                            editingAttendance.labourName ||
                                            ""
                                        }
                                        disabled
                                    />
                                </div>

                                {/* ATTENDANCE DATE */}

                                <div className="fld">
                                    <label htmlFor="edit-attendance-date">
                                        Attendance Date
                                    </label>

                                    <input
                                        id="edit-attendance-date"
                                        type="date"
                                        name="attendanceDate"
                                        value={
                                            editForm.attendanceDate
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        required
                                    />
                                </div>

                                {/* ATTENDANCE STATUS */}

                                <div className="fld">
                                    <label htmlFor="edit-attendance-status">
                                        Attendance Status
                                    </label>

                                    <select
                                        id="edit-attendance-status"
                                        name="attendanceStatus"
                                        value={
                                            editForm.attendanceStatus
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        required
                                    >
                                        <option value="PRESENT">
                                            PRESENT
                                        </option>

                                        <option value="ABSENT">
                                            ABSENT
                                        </option>

                                        <option value="HOLIDAY">
                                            HOLIDAY
                                        </option>
                                    </select>
                                </div>

                                {/* DAILY RATE */}

                                <div className="fld">
                                    <label htmlFor="edit-daily-rate">
                                        Daily Rate
                                    </label>

                                    <input
                                        id="edit-daily-rate"
                                        type="number"
                                        name="dailyRate"
                                        step="0.01"
                                        min="0"
                                        value={
                                            editForm.dailyRate
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        required
                                    />
                                </div>

                                {/* LEAVE REASON */}

                                {editForm.attendanceStatus ===
                                    "ABSENT" && (
                                    <div className="fld edit-full">
                                        <label htmlFor="edit-leave-reason">
                                            Leave Reason
                                        </label>

                                        <input
                                            id="edit-leave-reason"
                                            type="text"
                                            name="leaveReason"
                                            value={
                                                editForm.leaveReason
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            placeholder="Enter leave reason"
                                        />
                                    </div>
                                )}

                                {/* REMARKS */}

                                <div className="fld edit-full">
                                    <label htmlFor="edit-remarks">
                                        Remarks
                                    </label>

                                    <textarea
                                        id="edit-remarks"
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

                            {editError && (
                                <p className="form-error">
                                    {editError}
                                </p>
                            )}

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={
                                        closeEditModal
                                    }
                                    disabled={
                                        editLoading
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="action-btn view-btn"
                                    disabled={
                                        editLoading
                                    }
                                >
                                    {editLoading
                                        ? "Updating..."
                                        : "Update Attendance"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ====================================================
                DELETE CONFIRMATION MODAL
            ==================================================== */}

            {deletingAttendance && (
                <div
                    className="modal-overlay"
                    onClick={closeDeleteModal}
                >
                    <div
                        className="modal attendance-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <h2>
                                    Delete Attendance
                                </h2>

                                <p>
                                    Confirm attendance
                                    record deletion
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={
                                    deleteLoading
                                }
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <p>
                            Are you sure you want to
                            delete this attendance
                            record?
                        </p>

                        <div className="details-grid">
                            <div className="detail-item">
                                <span>
                                    Attendance ID
                                </span>

                                <strong>
                                    {
                                        deletingAttendance.attendanceId
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Attendance Date
                                </span>

                                <strong>
                                    {formatDate(
                                        deletingAttendance.attendanceDate
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Labour
                                </span>

                                <strong>
                                    {
                                        deletingAttendance.labourName
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Attendance Status
                                </span>

                                <strong>
                                    {
                                        deletingAttendance.attendanceStatus
                                    }
                                </strong>
                            </div>
                        </div>

                        <p>
                            This will mark the attendance
                            record as{" "}
                            <strong>INACTIVE</strong>.
                            The record will not be
                            physically removed from the
                            database.
                        </p>

                        {deleteError && (
                            <p className="form-error">
                                {deleteError}
                            </p>
                        )}

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={
                                    deleteLoading
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="action-btn delete-btn"
                                onClick={
                                    handleConfirmDelete
                                }
                                disabled={
                                    deleteLoading
                                }
                            >
                                {deleteLoading
                                    ? "Deleting..."
                                    : "Delete Attendance"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Attendance;