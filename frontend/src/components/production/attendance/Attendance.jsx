import { useEffect, useState } from "react";

function Attendance() {
    // ============================================================
    // STATE
    // ============================================================

    const [searchKeyword, setSearchKeyword] = useState("");
    const [attendance, setAttendance] = useState([]);
    const [labours, setLabours] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Weekly summary
    const [selectedLabourId, setSelectedLabourId] = useState("");
    const [weekStartDate, setWeekStartDate] = useState("");
    const [weeklySummary, setWeeklySummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState("");

    // ============================================================
    // FETCH ATTENDANCE
    // ============================================================

    useEffect(() => {
        fetchAttendance();
        fetchLabours();
    }, []);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/attendance"
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch attendance (${response.status})`
                );
            }

            const result = await response.json();

            console.log("Attendance API response:", result);

            setAttendance(result.data || []);
        } catch (err) {
            console.error("Error fetching attendance:", err);
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
            const response = await fetch(
                "http://localhost:8080/api/labours"
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch labours (${response.status})`
                );
            }

            const result = await response.json();

            console.log("Labour API response:", result);

            setLabours(result.data || []);
        } catch (err) {
            console.error("Error fetching labours:", err);
        }
    };

    // ============================================================
    // WEEKLY SUMMARY
    // ============================================================

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

            const url =
                `http://localhost:8080/api/attendance/summary/weekly` +
                `?labourId=${selectedLabourId}` +
                `&weekStartDate=${weekStartDate}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch weekly summary (${response.status})`
                );
            }

            const result = await response.json();

            console.log("Weekly Attendance Summary:", result);

            setWeeklySummary(result.data || null);
        } catch (err) {
            console.error(
                "Error fetching weekly attendance summary:",
                err
            );

            setSummaryError(
                "Unable to load weekly attendance summary."
            );
        } finally {
            setSummaryLoading(false);
        }
    };

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredAttendance = attendance.filter((record) => {
        const keyword = searchKeyword.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
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
                .includes(keyword)
        );
    });

    // ============================================================
    // FORMAT CURRENCY
    // ============================================================

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) {
            return "₹ 0.00";
        }

        return `₹ ${Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
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
                <h2>Attendance</h2>

                <p>
                    Manage daily labour attendance and weekly
                    attendance summaries
                </p>

                {/* ====================================================
                    SEARCH
                ==================================================== */}

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
                            setSearchKeyword(event.target.value)
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
                    View weekly attendance and labour payment summary
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "flex-end",
                        flexWrap: "wrap",
                    }}
                >
                    {/* Labour */}

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
                                        labour.status === "ACTIVE"
                                )
                                .map((labour) => (
                                    <option
                                        key={labour.labourId}
                                        value={labour.labourId}
                                    >
                                        {labour.labourName}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Week Start Date */}

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

                    {/* Button */}

                    <button
                        type="button"
                        onClick={fetchWeeklySummary}
                        disabled={summaryLoading}
                    >
                        {summaryLoading
                            ? "Loading..."
                            : "View Weekly Summary"}
                    </button>
                </div>

                {/* Summary Error */}

                {summaryError && (
                    <p style={{ marginTop: "12px" }}>
                        {summaryError}
                    </p>
                )}

                {/* ====================================================
                    WEEKLY SUMMARY RESULT
                ==================================================== */}

                {weeklySummary && (
                    <div
                        style={{
                            marginTop: "24px",
                        }}
                    >
                        <h3>
                            {weeklySummary.labourName}
                        </h3>

                        <p>
                            Week:{" "}
                            <strong>
                                {weeklySummary.weekStartDate}
                            </strong>{" "}
                            to{" "}
                            <strong>
                                {weeklySummary.weekEndDate}
                            </strong>
                        </p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(150px, 1fr))",
                                gap: "16px",
                                marginTop: "16px",
                            }}
                        >
                            <div>
                                <strong>Present Days</strong>
                                <div>
                                    {weeklySummary.presentDays}
                                </div>
                            </div>

                            <div>
                                <strong>Absent Days</strong>
                                <div>
                                    {weeklySummary.absentDays}
                                </div>
                            </div>

                            <div>
                                <strong>Holiday Days</strong>
                                <div>
                                    {weeklySummary.holidayDays}
                                </div>
                            </div>

                            <div>
                                <strong>Daily Rate</strong>
                                <div>
                                    {formatCurrency(
                                        weeklySummary.dailyRate
                                    )}
                                </div>
                            </div>

                            <div>
                                <strong>Weekly Amount</strong>
                                <div>
                                    {formatCurrency(
                                        weeklySummary.weeklyAmount
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
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

                {/* Loading */}

                {loading && (
                    <p>Loading attendance records...</p>
                )}

                {/* Error */}

                {!loading && error && (
                    <p>{error}</p>
                )}

                {/* Empty */}

                {!loading &&
                    !error &&
                    filteredAttendance.length === 0 && (
                        <p>
                            No attendance records found.
                        </p>
                    )}

                {/* Table */}

                {!loading &&
                    !error &&
                    filteredAttendance.length > 0 && (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>LABOUR</th>
                                        <th>ATTENDANCE</th>
                                        <th>DAILY RATE</th>
                                        <th>DAILY AMOUNT</th>
                                        <th>REMARKS</th>
                                        <th>STATUS</th>
                                        <th>ACTIONS</th>
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
                                                    {
                                                        record.attendanceDate
                                                    }
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
                                                        record.status
                                                    }
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            alert(
                                                                `Attendance ID: ${record.attendanceId}`
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
            </section>
        </>
    );
}

export default Attendance;