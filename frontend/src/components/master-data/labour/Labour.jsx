import { useEffect, useState } from "react";

function Labour() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [labours, setLabours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLabours = async () => {
            try {
                setLoading(true);
                setError("");

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
                console.log("Labour API data:", result.data);

                setLabours(result.data || []);
            } catch (err) {
                console.error("Error fetching labours:", err);

                setError(
                    "Unable to load labours. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLabours();
    }, []);

    // Search by labour name OR mobile number
    const filteredLabours = labours.filter((labour) => {
        const keyword = searchKeyword.toLowerCase().trim();

        return (
            labour.labourName
                ?.toLowerCase()
                .includes(keyword) ||
            labour.phone
                ?.toLowerCase()
                .includes(keyword)
        );
    });

    return (
        <section className="section active">

            {/* Page Header */}
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
                        placeholder="Search by labour name or mobile number..."
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(event.target.value)
                        }
                    />

                </div>

            </div>

            {/* Labour List */}
            <div className="card">

                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Labour List
                        </div>

                        <div className="kpi-sub">
                            {loading
                                ? "Loading labours..."
                                : `${filteredLabours.length} labour(s)`}
                        </div>
                    </div>

                </div>

                {/* Loading State */}
                {loading && (
                    <div className="empty-state">
                        <p>Loading labours...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                )}

                {/* Labour Table */}
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

                                {filteredLabours.map((labour) => (

                                    <tr key={labour.labourId}>

                                        <td>
                                            {labour.labourId}
                                        </td>

                                        <td>
                                            <strong>
                                                {labour.labourName}
                                            </strong>
                                        </td>

                                        <td>
                                            {labour.phone || "-"}
                                        </td>

                                        <td>
                                            {labour.skillType || "-"}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    labour.status === "ACTIVE"
                                                        ? "badge bg"
                                                        : "badge br"
                                                }
                                            >
                                                {labour.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="btn sm"
                                            >
                                                View
                                            </button>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

                {/* Empty Search Result */}
                {!loading &&
                    !error &&
                    filteredLabours.length === 0 && (
                        <div className="empty-state">
                            <p>No labours found.</p>
                        </div>
                    )}

            </div>

        </section>
    );
}

export default Labour;