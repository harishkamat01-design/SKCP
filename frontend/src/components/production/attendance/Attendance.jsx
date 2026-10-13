import { useEffect, useMemo, useState } from "react";

import Pagination from "../../../components/ui/Pagination";
import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";

import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
} from "../../../services/api";
import "./Attendance.css";
import ViewModal from "../../../components/ui/common/ViewModal";
import FormModal from "../../../components/ui/common/FormModal";
import DeleteConfirmModal from "../../../components/ui/common/DeleteConfirmModal";

import {
    DetailGrid,
    DetailItem,
} from "../../../components/ui/common/DetailGrid";

import { jsPDF } from "jspdf";

// ============================================================
// LOCAL DATE HELPERS — INDIA / LOCAL TIME SAFE
// ============================================================

const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getMondayDateString = (dateString) => {
    if (!dateString) {
        const today = new Date();
        const dayOfWeek = (today.getDay() + 6) % 7;

        today.setDate(today.getDate() - dayOfWeek);

        return getLocalDateString(today);
    }

    const [year, month, day] = dateString
        .substring(0, 10)
        .split("-")
        .map(Number);

    const date = new Date(year, month - 1, day);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    // Monday = 0, Tuesday = 1, ..., Sunday = 6
    const dayOfWeek = (date.getDay() + 6) % 7;

    date.setDate(date.getDate() - dayOfWeek);

    return getLocalDateString(date);
};

const getSundayDateString = (mondayString) => {
    if (!mondayString) {
        return "";
    }

    const [year, month, day] = mondayString
        .substring(0, 10)
        .split("-")
        .map(Number);

    const sunday = new Date(year, month - 1, day);

    if (Number.isNaN(sunday.getTime())) {
        return "";
    }

    sunday.setDate(sunday.getDate() + 6);

    return getLocalDateString(sunday);
};



function Attendance() {
    // ============================================================
    // STATE
    // ============================================================

    const [searchKeyword, setSearchKeyword] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [attendance, setAttendance] = useState([]);
    const [labours, setLabours] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================================
    // VIEW MODAL
    // ============================================================

    const [selectedAttendance, setSelectedAttendance] =
        useState(null);

    // ============================================================
    // EDIT MODAL
    // ============================================================

    const [editingAttendance, setEditingAttendance] =
        useState(null);

    const [editForm, setEditForm] = useState({
        attendanceDate: "",
        attendanceStatus: "PRESENT",
        dayType: "FULL_DAY",
        leaveReason: "",
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
        dayType: "FULL_DAY",
        leaveReason: "",
        remarks: "",
    });

    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");

    // ============================================================
    // DELETE MODAL
    // ============================================================

    const [deletingAttendance, setDeletingAttendance] =
        useState(null);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ============================================================
    // WEEKLY ATTENDANCE
    // ============================================================

    const [selectedLabourId, setSelectedLabourId] =
        useState("");

    const [weekStartDate, setWeekStartDate] = useState(
    () => getMondayDateString()
     );

    const [showWeeklyAttendance, setShowWeeklyAttendance] =
        useState(false);

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
    // LABOUR HELPERS
    // ============================================================

    const getSelectedLabour = (labourId) => {
        return labours.find(
            (labour) =>
                String(labour.labourId) ===
                String(labourId)
        );
    };

    const getLabourDailyRate = (labourId) => {
        const labour = getSelectedLabour(labourId);

        return labour?.dailyRate ?? 0;
    };

    // ============================================================
    // DAILY AMOUNT DISPLAY CALCULATION
    // ============================================================

    /*
     * Attendance payment rules:
     *
     * PRESENT + FULL_DAY  = 100%
     * PRESENT + HALF_DAY  = 50%
     *
     * ABSENT  + FULL_DAY  = 0%
     * ABSENT  + HALF_DAY  = 50%
     *
     * HOLIDAY + FULL_DAY  = 0%
     * HOLIDAY + HALF_DAY  = 50%
     */
    const calculateDisplayAmount = (
        dailyRate,
        attendanceStatus,
        dayType
    ) => {
        const rate = Number(dailyRate || 0);

        if (dayType === "HALF_DAY") {
            return rate / 2;
        }

        if (
            dayType === "FULL_DAY" &&
            attendanceStatus === "PRESENT"
        ) {
            return rate;
        }

        return 0;
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
            dayType: "FULL_DAY",
            leaveReason: "",
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

        if (name === "attendanceStatus") {
            setAddForm((previous) => ({
                ...previous,
                attendanceStatus: value,
                dayType:
                    previous.dayType === "HALF_DAY"
                        ? "HALF_DAY"
                        : "FULL_DAY",
                leaveReason:
                    value === "ABSENT"
                        ? previous.leaveReason
                        : "",
            }));

            return;
        }

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

                dayType:
                    addForm.dayType === "HALF_DAY"
                        ? "HALF_DAY"
                        : "FULL_DAY",

                leaveReason:
                    addForm.attendanceStatus ===
                    "ABSENT"
                        ? addForm.leaveReason.trim() ||
                          null
                        : null,

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
                dayType: "FULL_DAY",
                leaveReason: "",
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

        const attendanceStatus =
            record.attendanceStatus ||
            "PRESENT";

        const dayType =
            record.dayType === "HALF_DAY"
                ? "HALF_DAY"
                : "FULL_DAY";

        setEditForm({
            attendanceDate:
                record.attendanceDate || "",

            attendanceStatus,

            dayType,

            leaveReason:
                record.leaveReason || "",

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

        if (name === "attendanceStatus") {
            setEditForm((previous) => ({
                ...previous,

                attendanceStatus: value,

                dayType:
                    previous.dayType === "HALF_DAY"
                        ? "HALF_DAY"
                        : "FULL_DAY",

                leaveReason:
                    value === "ABSENT"
                        ? previous.leaveReason
                        : "",
            }));

            return;
        }

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

        if (!editForm.attendanceDate) {
            setEditError(
                "Please select an attendance date."
            );

            return;
        }

        if (
            editForm.attendanceStatus === "ABSENT" &&
            !editForm.leaveReason.trim()
        ) {
            setEditError(
                "Please enter a leave reason for absent attendance."
            );

            return;
        }

        try {
            setEditLoading(true);
            setEditError("");

            const dayType =
                editForm.dayType === "HALF_DAY"
                    ? "HALF_DAY"
                    : "FULL_DAY";

            const payload = {
                labourId:
                    Number(
                        editingAttendance.labourId
                    ),

                attendanceDate:
                    editForm.attendanceDate,

                attendanceStatus:
                    editForm.attendanceStatus,

                dayType,

                leaveReason:
                    editForm.attendanceStatus ===
                    "ABSENT"
                        ? editForm.leaveReason.trim() ||
                          null
                        : null,

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

            setEditingAttendance(null);

            await fetchAttendance();
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
    // SEARCH + DATE FILTER
    // ============================================================

    const filteredAttendance = useMemo(() => {
        const keyword =
            searchKeyword.toLowerCase().trim();

        return attendance.filter((record) => {
            const matchesSearch =
                !keyword ||
                String(record.labourName || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(record.labourId || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(record.attendanceDate || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(record.attendanceStatus || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(record.dayType || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(record.status || "")
                    .toLowerCase()
                    .includes(keyword);

            const recordDate =
                String(
                    record.attendanceDate || ""
                ).substring(0, 10);

            const matchesFromDate =
                !dateFrom ||
                recordDate >= dateFrom;

            const matchesToDate =
                !dateTo ||
                recordDate <= dateTo;

            return (
                matchesSearch &&
                matchesFromDate &&
                matchesToDate
            );
        });
    }, [
        attendance,
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
        filteredAttendance,
        "attendanceId",
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
    } = usePagination(sortedRecords, 10);

    // ============================================================
    // DAILY ATTENDANCE TOTAL
    // ============================================================

    const totalDailyAmount = useMemo(() => {
        return sortedRecords.reduce((total, record) => {
            const amount = calculateDisplayAmount(
                record.dailyRate,
                record.attendanceStatus,
                record.dayType
            );

            return total + Number(amount || 0);
        }, 0);
    }, [sortedRecords]);

    // ============================================================
    // WEEKLY ATTENDANCE RECORDS
    // ============================================================

    const weeklyAttendanceRecords = useMemo(() => {
        if (
            !showWeeklyAttendance ||
            !selectedLabourId ||
            !weekStartDate
        ) {
            return [];
        }

        const startDate = new Date(
            `${weekStartDate}T00:00:00`
        );

        if (Number.isNaN(startDate.getTime())) {
            return [];
        }

        const endDate = new Date(startDate);

        endDate.setDate(
            endDate.getDate() + 6
        );

const startText = getMondayDateString(weekStartDate);

if (!startText) {
    return [];
}

const endText = getSundayDateString(startText);

if (!endText) {
    return [];
}

        return attendance
            .filter((record) => {
                const recordDate =
                    String(
                        record.attendanceDate || ""
                    ).substring(0, 10);

                return (
                    String(record.labourId) ===
                        String(selectedLabourId) &&
                    recordDate >= startText &&
                    recordDate <= endText
                );
            })
            .sort((a, b) => {
                const dateA = String(
                    a.attendanceDate || ""
                ).substring(0, 10);

                const dateB = String(
                    b.attendanceDate || ""
                ).substring(0, 10);

                if (dateA !== dateB) {
                    return dateB.localeCompare(dateA);
                }

                return (
                    Number(
                        b.attendanceId || 0
                    ) -
                    Number(
                        a.attendanceId || 0
                    )
                );
            });
    }, [
        attendance,
        selectedLabourId,
        weekStartDate,
        showWeeklyAttendance,
    ]);

    // ============================================================
    // WEEKLY INFORMATION
    // ============================================================

const weeklyEndDate = useMemo(() => {
    return getSundayDateString(
        getMondayDateString(weekStartDate)
    );
}, [weekStartDate]);




    const weeklyTotalAmount = useMemo(() => {
        return weeklyAttendanceRecords.reduce(
            (total, record) => {
                return (
                    total +
                    Number(
                        calculateDisplayAmount(
                            record.dailyRate,
                            record.attendanceStatus,
                            record.dayType
                        ) || 0
                    )
                );
            },
            0
        );
    }, [weeklyAttendanceRecords]);

    // ============================================================
    // WEEKLY SUMMARY COUNTS
    // ============================================================

    const weeklyPresentDays = useMemo(() => {
        return weeklyAttendanceRecords.filter(
            (record) =>
                record.attendanceStatus ===
                "PRESENT"
        ).length;
    }, [weeklyAttendanceRecords]);

    const weeklyAbsentDays = useMemo(() => {
        return weeklyAttendanceRecords.filter(
            (record) =>
                record.attendanceStatus ===
                "ABSENT"
        ).length;
    }, [weeklyAttendanceRecords]);

    const weeklyHolidayDays = useMemo(() => {
        return weeklyAttendanceRecords.filter(
            (record) =>
                record.attendanceStatus ===
                "HOLIDAY"
        ).length;
    }, [weeklyAttendanceRecords]);

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

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const month =
            monthNames[date.getMonth()];

        const year =
            date.getFullYear();

        return `${day} ${month} ${year}`;
    };

    // ============================================================
    // FORMAT DAY TYPE
    // ============================================================

    const formatDayType = (dayType) => {
        if (dayType === "HALF_DAY") {
            return "Half Day";
        }

        if (dayType === "FULL_DAY") {
            return "Full Day";
        }

        return "-";
    };

    // ============================================================
    // CLEAR FILTERS
    // ============================================================

    const clearFilters = () => {
        setSearchKeyword("");
        setDateFrom("");
        setDateTo("");
    };

    // ============================================================
    // CLEAR WEEKLY FILTERS
    // ============================================================

    const clearWeeklyFilters = () => {
    setSelectedLabourId("");
    setWeekStartDate(getMondayDateString());
    setShowWeeklyAttendance(false);
    setSummaryError("");
};

    // ============================================================
    // VIEW WEEKLY ATTENDANCE
    // ============================================================

    const handleViewWeeklyAttendance = () => {
        if (!selectedLabourId || !weekStartDate) {
            setSummaryError(
                "Please select a labour and week start date."
            );

            return;
        }

        setSummaryError("");
        setShowWeeklyAttendance(true);
    };

    // ============================================================
    // PDF FORMATTERS
    // ============================================================

    const formatPdfCurrency = (amount) => {
        return `INR ${Number(
            amount || 0
        ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatPdfDate = (date) => {
        return formatDate(date);
    };

    // ============================================================
    // DOWNLOAD DAILY ATTENDANCE PDF
    // ============================================================

    const handleDownloadAttendancePdf = () => {
        if (
            !sortedRecords ||
            sortedRecords.length === 0
        ) {
            return;
        }

        const doc = new jsPDF();

        const pageWidth =
            doc.internal.pageSize.getWidth();

        const pageHeight =
            doc.internal.pageSize.getHeight();

        const leftMargin = 12;

        const rightMargin =
            pageWidth - 12;

        let y = 18;

        const addPageIfNeeded = (
            requiredHeight = 15
        ) => {
            if (
                y + requiredHeight >
                pageHeight - 20
            ) {
                doc.addPage();

                y = 20;

                return true;
            }

            return false;
        };

        doc.setFontSize(20);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Shree Kundodari Cement Products",
            leftMargin,
            y
        );

        doc.setFontSize(10);

        doc.text(
            "DAILY ATTENDANCE LIST",
            rightMargin,
            y,
            {
                align: "right",
            }
        );

        y += 9;

        doc.setLineWidth(0.5);

        doc.line(
            leftMargin,
            y,
            rightMargin,
            y
        );

        y += 12;

        doc.setFontSize(11);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Attendance Information",
            leftMargin,
            y
        );

        y += 8;

        doc.setFontSize(10);

        doc.setFont(
            "helvetica",
            "normal"
        );

        const periodText =
            dateFrom || dateTo
                ? `${formatPdfDate(
                      dateFrom
                  )} - ${formatPdfDate(
                      dateTo
                  )}`
                : "All Dates";

        doc.text(
            `Attendance Period: ${periodText}`,
            leftMargin,
            y
        );

        y += 7;

        doc.text(
            `Search: ${
                searchKeyword.trim() ||
                "All Attendance"
            }`,
            leftMargin,
            y
        );

        y += 7;

        doc.text(
            `Total Records: ${sortedRecords.length}`,
            leftMargin,
            y
        );

        y += 14;

        addPageIfNeeded(45);

        doc.setFontSize(11);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Attendance Records",
            leftMargin,
            y
        );

        y += 8;

        doc.setFontSize(7);

        doc.text(
            "ID",
            12,
            y
        );

        doc.text(
            "Date",
            25,
            y
        );

        doc.text(
            "Labour",
            43,
            y
        );

        doc.text(
            "Attendance",
            78,
            y
        );

        doc.text(
            "Day Type",
            106,
            y
        );

        doc.text(
            "Daily Rate",
            133,
            y
        );

        doc.text(
            "Amount",
            161,
            y
        );

        doc.text(
            "Status",
            184,
            y
        );

        y += 5;

        doc.line(
            leftMargin,
            y,
            rightMargin,
            y
        );

        y += 6;

        doc.setFont(
            "helvetica",
            "normal"
        );

        sortedRecords.forEach(
            (record) => {
                addPageIfNeeded(10);

                const displayDailyRate =
                    record.dailyRate;

                const displayDailyAmount =
                    calculateDisplayAmount(
                        record.dailyRate,
                        record.attendanceStatus,
                        record.dayType
                    );

                doc.text(
                    String(
                        record.attendanceId ||
                            "-"
                    ),
                    12,
                    y
                );

                doc.text(
                    formatPdfDate(
                        record.attendanceDate
                    ),
                    25,
                    y
                );

                doc.text(
                    String(
                        record.labourName ||
                            "-"
                    ),
                    43,
                    y
                );

                doc.text(
                    String(
                        record.attendanceStatus ||
                            "-"
                    ),
                    78,
                    y
                );

                doc.text(
                    formatDayType(
                        record.dayType
                    ),
                    106,
                    y
                );

                doc.text(
                    formatPdfCurrency(
                        displayDailyRate
                    ),
                    133,
                    y
                );

                doc.text(
                    formatPdfCurrency(
                        displayDailyAmount
                    ),
                    161,
                    y
                );

                doc.text(
                    String(
                        record.status ||
                            "-"
                    ),
                    184,
                    y
                );

                y += 7;
            }
        );

        y += 5;

        addPageIfNeeded(30);

        let totalDailyAmount = 0;

        sortedRecords.forEach(
            (record) => {
                totalDailyAmount +=
                    calculateDisplayAmount(
                        record.dailyRate,
                        record.attendanceStatus,
                        record.dayType
                    );
            }
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(9);

        doc.text(
            `Total Attendance Records: ${sortedRecords.length}`,
            105,
            y
        );

        y += 7;

        doc.text(
            `Total Daily Amount: ${formatPdfCurrency(
                totalDailyAmount
            )}`,
            105,
            y
        );

        const totalPages =
            doc.getNumberOfPages();

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {
            doc.setPage(page);

            const footerY =
                pageHeight - 10;

            doc.setFontSize(8);

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.text(
                "SKCP - Kumta - 581343, Karnataka",
                pageWidth / 2,
                footerY,
                {
                    align: "center",
                }
            );

            doc.text(
                `Page ${page} of ${totalPages}`,
                rightMargin,
                footerY,
                {
                    align: "right",
                }
            );
        }

        const safeFromDate =
            dateFrom || "All";

        const safeToDate =
            dateTo || "Dates";

        doc.save(
            `SKCP-Daily-Attendance-${safeFromDate}-to-${safeToDate}.pdf`
        );
    };

    // ============================================================
    // DOWNLOAD WEEKLY ATTENDANCE PDF
    // ============================================================

    const handleDownloadWeeklyAttendancePdf = () => {
        if (
            !selectedLabourId ||
            !weekStartDate ||
            weeklyAttendanceRecords.length === 0
        ) {
            return;
        }

        const selectedLabour =
            getSelectedLabour(
                selectedLabourId
            );

        const labourName =
            weeklyAttendanceRecords[0]
                ?.labourName ||
            selectedLabour?.labourName ||
            "Labour";

        const doc = new jsPDF();

        const pageWidth =
            doc.internal.pageSize.getWidth();

        const pageHeight =
            doc.internal.pageSize.getHeight();

        const leftMargin = 12;

        const rightMargin =
            pageWidth - 12;

        let y = 18;

        const addPageIfNeeded = (
            requiredHeight = 15
        ) => {
            if (
                y + requiredHeight >
                pageHeight - 20
            ) {
                doc.addPage();

                y = 20;

                return true;
            }

            return false;
        };

        // --------------------------------------------------------
        // HEADER
        // --------------------------------------------------------

        doc.setFontSize(20);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Shree Kundodari Cement Products",
            leftMargin,
            y
        );

        doc.setFontSize(10);

        doc.text(
            "WEEKLY ATTENDANCE SUMMARY",
            rightMargin,
            y,
            {
                align: "right",
            }
        );

        y += 9;

        doc.setLineWidth(0.5);

        doc.line(
            leftMargin,
            y,
            rightMargin,
            y
        );

        // --------------------------------------------------------
        // WEEK INFORMATION
        // --------------------------------------------------------

        y += 12;

        doc.setFontSize(11);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Weekly Attendance Information",
            leftMargin,
            y
        );

        y += 8;

        doc.setFontSize(10);

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            `Labour ID: ${selectedLabourId}`,
            leftMargin,
            y
        );

        y += 7;

        doc.text(
            `Labour: ${labourName}`,
            leftMargin,
            y
        );

        y += 7;

        doc.text(
            `Week Start: ${formatPdfDate(
                weekStartDate
            )}`,
            leftMargin,
            y
        );

        y += 7;

        doc.text(
            `Week End: ${formatPdfDate(
                weeklyEndDate
            )}`,
            leftMargin,
            y
        );

        y += 7;

        doc.text(
            `Total Records: ${weeklyAttendanceRecords.length}`,
            leftMargin,
            y
        );

        y += 14;

        // --------------------------------------------------------
        // SUMMARY COUNTS
        // --------------------------------------------------------

        doc.setFontSize(10);

        doc.text(
            `Present Days: ${weeklyPresentDays}`,
            leftMargin,
            y
        );

        doc.text(
            `Absent Days: ${weeklyAbsentDays}`,
            75,
            y
        );

        doc.text(
            `Holiday Days: ${weeklyHolidayDays}`,
            135,
            y
        );

        y += 12;

        // --------------------------------------------------------
        // TABLE
        // --------------------------------------------------------

        addPageIfNeeded(45);

        doc.setFontSize(11);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Attendance Records",
            leftMargin,
            y
        );

        y += 8;

        doc.setFontSize(7);

        doc.text(
            "ID",
            12,
            y
        );

        doc.text(
            "Date",
            25,
            y
        );

        doc.text(
            "Labour",
            43,
            y
        );

        doc.text(
            "Attendance",
            78,
            y
        );

        doc.text(
            "Day Type",
            106,
            y
        );

        doc.text(
            "Daily Rate",
            133,
            y
        );

        doc.text(
            "Amount",
            161,
            y
        );

        doc.text(
            "Status",
            184,
            y
        );

        y += 5;

        doc.line(
            leftMargin,
            y,
            rightMargin,
            y
        );

        y += 6;

        doc.setFont(
            "helvetica",
            "normal"
        );

        weeklyAttendanceRecords.forEach(
            (record) => {
                addPageIfNeeded(10);

                const displayDailyAmount =
                    calculateDisplayAmount(
                        record.dailyRate,
                        record.attendanceStatus,
                        record.dayType
                    );

                doc.text(
                    String(
                        record.attendanceId ||
                            "-"
                    ),
                    12,
                    y
                );

                doc.text(
                    formatPdfDate(
                        record.attendanceDate
                    ),
                    25,
                    y
                );

                doc.text(
                    String(
                        record.labourName ||
                            labourName ||
                            "-"
                    ),
                    43,
                    y
                );

                doc.text(
                    String(
                        record.attendanceStatus ||
                            "-"
                    ),
                    78,
                    y
                );

                doc.text(
                    formatDayType(
                        record.dayType
                    ),
                    106,
                    y
                );

                doc.text(
                    formatPdfCurrency(
                        record.dailyRate
                    ),
                    133,
                    y
                );

                doc.text(
                    formatPdfCurrency(
                        displayDailyAmount
                    ),
                    161,
                    y
                );

                doc.text(
                    String(
                        record.status ||
                            "-"
                    ),
                    184,
                    y
                );

                y += 7;
            }
        );

        // --------------------------------------------------------
        // TOTAL
        // --------------------------------------------------------

        y += 5;

        addPageIfNeeded(30);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(9);

        doc.text(
            `Total Attendance Records: ${weeklyAttendanceRecords.length}`,
            105,
            y
        );

        y += 7;

        doc.text(
            `Weekly Amount: ${formatPdfCurrency(
                weeklyTotalAmount
            )}`,
            105,
            y
        );

        // --------------------------------------------------------
        // FOOTER
        // --------------------------------------------------------

        const totalPages =
            doc.getNumberOfPages();

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {
            doc.setPage(page);

            const footerY =
                pageHeight - 10;

            doc.setFontSize(8);

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.text(
                "SKCP - Kumta - 581343, Karnataka",
                pageWidth / 2,
                footerY,
                {
                    align: "center",
                }
            );

            doc.text(
                `Page ${page} of ${totalPages}`,
                rightMargin,
                footerY,
                {
                    align: "right",
                }
            );
        }

        const safeLabourName = String(
            labourName || "Labour"
        )
            .replace(
                /[^a-zA-Z0-9-_]/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );

        doc.save(
            `SKCP-Weekly-Attendance-${safeLabourName}-${weekStartDate}.pdf`
        );
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <h2>Attendance</h2>

                    <p>
                        Loading attendance records...
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
                        Add Attendance
                    </button>
                </div>
            </section>

            {/* ====================================================
                DAILY ATTENDANCE LIST
            ==================================================== */}

            <section className="card">
                <h2>Daily Attendance List</h2>

                <p>
                    {totalRecords} attendance record
                    {totalRecords === 1 ? "" : "s"}
                </p>

                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "16px",
                        flexWrap: "wrap",
                        marginTop: "16px",
                        marginBottom: "16px",
                    }}
                >
                    <div
                        className="fld"
                        style={{
                            width: "320px",
                            maxWidth: "100%",
                        }}
                    >
                        <label htmlFor="daily-attendance-search">
                            Search Attendance
                        </label>

                        <input
                            id="daily-attendance-search"
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

                    <div className="fld">
                        <label htmlFor="attendance-date-from">
                            From Date
                        </label>

                        <input
                            id="attendance-date-from"
                            type="date"
                            value={dateFrom}
                            onChange={(event) =>
                                setDateFrom(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="attendance-date-to">
                            To Date
                        </label>

                        <input
                            id="attendance-date-to"
                            type="date"
                            value={dateTo}
                            onChange={(event) =>
                                setDateTo(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={clearFilters}
                        disabled={
                            !searchKeyword &&
                            !dateFrom &&
                            !dateTo
                        }
                    >
                        Clear
                    </button>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={
                            handleDownloadAttendancePdf
                        }
                        disabled={
                            sortedRecords.length === 0
                        }
                    >
                        Download PDF
                    </button>
                </div>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {!error && totalRecords === 0 && (
                    <p>
                        No attendance records found.
                    </p>
                )}

                {!error && totalRecords > 0 && (
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
                                                    "attendanceId"
                                                )
                                            }
                                        >
                                            ID
                                            {sortKey ===
                                                "attendanceId" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ▲"
                                                    : " ▼")}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "attendanceDate"
                                                )
                                            }
                                        >
                                            DATE
                                            {sortKey ===
                                                "attendanceDate" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ▲"
                                                    : " ▼")}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "labourName"
                                                )
                                            }
                                        >
                                            LABOUR
                                            {sortKey ===
                                                "labourName" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ▲"
                                                    : " ▼")}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "attendanceStatus"
                                                )
                                            }
                                        >
                                            ATTENDANCE
                                            {sortKey ===
                                                "attendanceStatus" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ▲"
                                                    : " ▼")}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "dayType"
                                                )
                                            }
                                        >
                                            DAY TYPE
                                            {sortKey ===
                                                "dayType" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ▲"
                                                    : " ▼")}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "dailyRate"
                                                )
                                            }
                                        >
                                            DAILY RATE
                                            {sortKey ===
                                                "dailyRate" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ▲"
                                                    : " ▼")}
                                        </button>
                                    </th>

                                    <th>
                                        <button
                                            type="button"
                                            className="table-sort-btn"
                                            onClick={() =>
                                                handleSort(
                                                    "dailyAmount"
                                                )
                                            }
                                        >
                                            DAILY AMOUNT
                                            {sortKey ===
                                                "dailyAmount" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ▲"
                                                    : " ▼")}
                                        </button>
                                    </th>

                                    <th>REMARKS</th>

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
                                            {sortKey ===
                                                "status" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ▲"
                                                    : " ▼")}
                                        </button>
                                    </th>

                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedRecords.map(
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
                                                {formatDayType(
                                                    record.dayType
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    record.dailyRate
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    calculateDisplayAmount(
                                                        record.dailyRate,
                                                        record.attendanceStatus,
                                                        record.dayType
                                                    )
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
                                                <div
                                                    className="action-buttons"
                                                    style={{
                                                        display: "flex",
                                                        gap: "6px",
                                                    }}
                                                >
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

                            <tfoot>
                                <tr>
                                    <td>
                                        <strong>
                                            Total
                                        </strong>
                                    </td>

                                    <td colSpan="5"></td>

                                    <td>
                                        <strong>
                                            {formatCurrency(
                                                totalDailyAmount
                                            )}
                                        </strong>
                                    </td>

                                    <td colSpan="3"></td>
                                </tr>
                            </tfoot>
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

            {/* ====================================================
                WEEKLY ATTENDANCE SUMMARY
            ==================================================== */}

            <section className="card">
                <h2>Weekly Attendance Summary</h2>

                <p style={{ marginBottom: "16px" }}>
                    View detailed attendance records and
                    labour payment for a selected week.
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

                                setShowWeeklyAttendance(
                                    false
                                );

                                setSummaryError("");
                            }}
                        >
                            <option value="">
                                Select Labour
                            </option>

                            {labours
                                .filter(
                                    (labour) =>
                                        String(
                                            labour.status
                                        ).toUpperCase() ===
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
    const selectedDate = event.target.value;

    setWeekStartDate(
        selectedDate
            ? getMondayDateString(selectedDate)
            : ""
    );

    setShowWeeklyAttendance(false);
    setSummaryError("");
}}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            type="button"
                            className="action-btn view-btn"
                            onClick={
                                handleViewWeeklyAttendance
                            }
                        >
                            View Weekly Attendance
                        </button>

                        <button
                            type="button"
                            className="btn secondary"
                            onClick={
                                clearWeeklyFilters
                            }
                            disabled={
                                !selectedLabourId &&
                                !weekStartDate
                            }
                        >
                            Clear
                        </button>

                        {showWeeklyAttendance && (
                            <button
                                type="button"
                                className="action-btn view-btn"
                                onClick={
                                    handleDownloadWeeklyAttendancePdf
                                }
                                disabled={
                                    weeklyAttendanceRecords.length ===
                                    0
                                }
                            >
                                Download PDF
                            </button>
                        )}
                    </div>
                </div>

                {summaryError && (
                    <p className="form-error">
                        {summaryError}
                    </p>
                )}

                {showWeeklyAttendance && (
                    <>
                        <div
                            style={{
                                marginTop: "20px",
                                marginBottom: "16px",
                            }}
                        >
                            <h3>
                                {weeklyAttendanceRecords[0]
                                    ?.labourName ||
                                    getSelectedLabour(
                                        selectedLabourId
                                    )?.labourName ||
                                    "Labour"}
                                {" - "}
                                {formatDate(
                                    weekStartDate
                                )}
                                {" to "}
                                {formatDate(
                                    weeklyEndDate
                                )}
                            </h3>

                            <p>
                                {weeklyAttendanceRecords.length}{" "}
                                attendance record
                                {weeklyAttendanceRecords.length ===
                                1
                                    ? ""
                                    : "s"}
                                {" | "}
                                Present:{" "}
                                {weeklyPresentDays}
                                {" | "}
                                Absent:{" "}
                                {weeklyAbsentDays}
                                {" | "}
                                Holiday:{" "}
                                {weeklyHolidayDays}
                            </p>
                        </div>

                        {weeklyAttendanceRecords.length ===
                            0 && (
                            <p>
                                No attendance records found
                                for the selected labour and
                                week.
                            </p>
                        )}

                        {weeklyAttendanceRecords.length >
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
                                                DAY TYPE
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
                                        {weeklyAttendanceRecords.map(
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
                                                        {formatDayType(
                                                            record.dayType
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            record.dailyRate
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            calculateDisplayAmount(
                                                                record.dailyRate,
                                                                record.attendanceStatus,
                                                                record.dayType
                                                            )
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
                                                        <div
                                                            className="action-buttons"
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                gap: "6px",
                                                            }}
                                                        >
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

                                    <tfoot>
                                        <tr>
                                            <td>
                                                <strong>
                                                    Total
                                                </strong>
                                            </td>

                                            <td colSpan="5"></td>

                                            <td>
                                                <strong>
                                                    {formatCurrency(
                                                        weeklyTotalAmount
                                                    )}
                                                </strong>
                                            </td>

                                            <td colSpan="3"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* ====================================================
                ADD ATTENDANCE MODAL
            ==================================================== */}

            <FormModal
                isOpen={showAddModal}
                onClose={closeAddModal}
                title="Add Attendance"
                subtitle="Record new labour attendance information"
                size="lg"
                onSubmit={handleCreateAttendance}
                submitLabel={
                    addLoading
                        ? "Saving..."
                        : "Add Attendance"
                }
                saving={addLoading}
                error={addError}
                formId="attendance-add-form"
            >
                <form
                    id="attendance-add-form"
                    onSubmit={handleCreateAttendance}
                >
                    <div className="form-grid">
                        <div className="fld">
                            <label htmlFor="add-labour">
                                Labour
                            </label>

                            <select
                                id="add-labour"
                                name="labourId"
                                value={addForm.labourId}
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
                                            String(
                                                labour.status
                                            ).toUpperCase() ===
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

                        <div className="fld">
                            <label htmlFor="add-day-type">
                                Day Type
                            </label>

                            <select
                                id="add-day-type"
                                name="dayType"
                                value={addForm.dayType}
                                onChange={
                                    handleAddChange
                                }
                                required
                            >
                                <option value="FULL_DAY">
                                    Full Day
                                </option>

                                <option value="HALF_DAY">
                                    Half Day
                                </option>
                            </select>
                        </div>

                        <div className="fld">
                            <label htmlFor="add-daily-rate">
                                Daily Rate
                            </label>

                            <input
                                id="add-daily-rate"
                                type="text"
                                value={formatCurrency(
                                    getLabourDailyRate(
                                        addForm.labourId
                                    )
                                )}
                                readOnly
                            />
                        </div>

                        <div className="fld">
                            <label htmlFor="add-daily-amount">
                                Daily Amount
                            </label>

                            <input
                                id="add-daily-amount"
                                type="text"
                                value={formatCurrency(
                                    calculateDisplayAmount(
                                        getLabourDailyRate(
                                            addForm.labourId
                                        ),
                                        addForm.attendanceStatus,
                                        addForm.dayType
                                    )
                                )}
                                readOnly
                            />
                        </div>

                        {addForm.attendanceStatus ===
                            "ABSENT" && (
                            <div className="fld">
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

                        <div className="fld">
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
                </form>
            </FormModal>

            {/* ====================================================
                VIEW ATTENDANCE MODAL
            ==================================================== */}

            <ViewModal
                isOpen={!!selectedAttendance}
                onClose={closeViewModal}
                title="Attendance Details"
                subtitle={
                    selectedAttendance
                        ? `Attendance information of labour ID ${selectedAttendance.labourId}`
                        : ""
                }
                size="lg"
            >
                {selectedAttendance && (
                    <DetailGrid>
                        <DetailItem
                            label="Attendance ID"
                            value={
                                selectedAttendance.attendanceId
                            }
                        />

                        <DetailItem
                            label="Labour"
                            value={
                                selectedAttendance.labourName ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Attendance Date"
                            value={formatDate(
                                selectedAttendance.attendanceDate
                            )}
                        />

                        <DetailItem
                            label="Attendance Status"
                            value={
                                selectedAttendance.attendanceStatus ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Day Type"
                            value={formatDayType(
                                selectedAttendance.dayType
                            )}
                        />

                        <DetailItem
                            label="Daily Rate"
                            value={formatCurrency(
                                selectedAttendance.dailyRate
                            )}
                        />

                        <DetailItem
                            label="Daily Amount"
                            value={formatCurrency(
                                calculateDisplayAmount(
                                    selectedAttendance.dailyRate,
                                    selectedAttendance.attendanceStatus,
                                    selectedAttendance.dayType
                                )
                            )}
                        />

                        <DetailItem
                            label="Leave Reason"
                            value={
                                selectedAttendance.leaveReason ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Remarks"
                            value={
                                selectedAttendance.remarks ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Status"
                            value={
                                selectedAttendance.status ||
                                "-"
                            }
                        />

                        <DetailItem
                            label="Created At"
                            value={
                                selectedAttendance.createdAt ||
                                "-"
                            }
                        />
                    </DetailGrid>
                )}
            </ViewModal>

            {/* ====================================================
                EDIT ATTENDANCE MODAL
            ==================================================== */}

            <FormModal
                isOpen={!!editingAttendance}
                onClose={closeEditModal}
                title="Edit Attendance"
                subtitle={
                    editingAttendance
                        ? `Update attendance information of labour ID ${editingAttendance.labourId}`
                        : "Update attendance information"
                }
                size="lg"
                onSubmit={handleUpdateAttendance}
                submitLabel="Update Attendance"
                saving={editLoading}
                error={editError}
                formId="attendance-edit-form"
            >
                {editingAttendance && (
                    <form
                        id="attendance-edit-form"
                        onSubmit={
                            handleUpdateAttendance
                        }
                    >
                        <div className="form-grid">
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
                                    readOnly
                                />
                            </div>

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

                            <div className="fld">
                                <label htmlFor="edit-day-type">
                                    Day Type
                                </label>

                                <select
                                    id="edit-day-type"
                                    name="dayType"
                                    value={
                                        editForm.dayType
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                >
                                    <option value="FULL_DAY">
                                        Full Day
                                    </option>

                                    <option value="HALF_DAY">
                                        Half Day
                                    </option>
                                </select>
                            </div>

                            <div className="fld">
                                <label htmlFor="edit-daily-rate">
                                    Daily Rate
                                </label>

                                <input
                                    id="edit-daily-rate"
                                    type="text"
                                    value={formatCurrency(
                                        editingAttendance.dailyRate
                                    )}
                                    readOnly
                                />
                            </div>

                            <div className="fld">
                                <label htmlFor="edit-daily-amount">
                                    Daily Amount
                                </label>

                                <input
                                    id="edit-daily-amount"
                                    type="text"
                                    value={formatCurrency(
                                        calculateDisplayAmount(
                                            editingAttendance.dailyRate,
                                            editForm.attendanceStatus,
                                            editForm.dayType
                                        )
                                    )}
                                    readOnly
                                />
                            </div>

                            {editForm.attendanceStatus ===
                                "ABSENT" && (
                                <div className="fld">
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

                            <div className="fld">
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
                    </form>
                )}
            </FormModal>

            {/* ====================================================
                DELETE CONFIRMATION MODAL
            ==================================================== */}

            <DeleteConfirmModal
                isOpen={!!deletingAttendance}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Attendance"
                subtitle="Confirm attendance record deletion"
                message="Are you sure you want to delete this attendance record?"
                itemName={
                    deletingAttendance
                        ? `${
                              deletingAttendance.labourName ||
                              "Labour"
                          } - ${formatDate(
                              deletingAttendance.attendanceDate
                          )}`
                        : ""
                }
                confirming={deleteLoading}
                error={deleteError}
            />
        </div>
    );
}

export default Attendance;