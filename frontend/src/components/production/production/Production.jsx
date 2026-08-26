import { useEffect, useState } from "react";

function Production() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [productions, setProductions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================================
    // FETCH PRODUCTIONS
    // ============================================================

    useEffect(() => {
        const fetchProductions = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8080/api/productions"
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch productions (${response.status})`
                    );
                }

                const result = await response.json();

                console.log("Production API response:", result);
                console.log("Production API data:", result.data);

                setProductions(result.data || []);
            } catch (err) {
                console.error("Error fetching productions:", err);
                setError(
                    "Unable to load production records. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProductions();
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredProductions = productions.filter((production) => {
        const keyword = searchKeyword.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            String(production.productionId || "")
                .toLowerCase()
                .includes(keyword) ||
            String(production.productionDate || "")
                .toLowerCase()
                .includes(keyword) ||
            String(production.productName || "")
                .toLowerCase()
                .includes(keyword) ||
            String(production.productSize || "")
                .toLowerCase()
                .includes(keyword) ||
            String(production.assetName || "")
                .toLowerCase()
                .includes(keyword) ||
            String(production.status || "")
                .toLowerCase()
                .includes(keyword)
        );
    });

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="page">
                <div className="section-card">
                    <h2>Production</h2>
                    <p>Loading production records...</p>
                </div>
            </div>
        );
    }

    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        return (
            <div className="page">
                <div className="section-card">
                    <h2>Production</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="page">

            {/* ====================================================
                PRODUCTION HEADER
            ==================================================== */}

            <div className="section-card">
                <h2>Production</h2>
                <p>Manage production information and records</p>

                {/* Search */}
                <div className="fld production-search">
                    <label htmlFor="production-search">
                        Search Production
                    </label>

                    <input
                        id="production-search"
                        type="text"
                        placeholder="Search by product, size, date, asset or status..."
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(event.target.value)
                        }
                    />
                </div>
            </div>

            {/* ====================================================
                PRODUCTION LIST
            ==================================================== */}

            <div className="section-card">
                <h2>Production List</h2>

                <p>
                    {filteredProductions.length} production record(s)
                </p>

                {filteredProductions.length === 0 ? (
                    <p>No production records found.</p>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>PRODUCT</th>
                                    <th>SIZE</th>
                                    <th>QUANTITY</th>
                                    <th>TOTAL CEMENT BAGS</th>
                                    <th>ASSET</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProductions.map((production) => (
                                    <tr key={production.productionId}>

                                        <td>
                                            {production.productionId}
                                        </td>

                                        <td>
                                            {production.productionDate}
                                        </td>

                                        <td>
                                            <strong>
                                                {production.productName}
                                            </strong>
                                        </td>

                                        <td>
                                            {production.productSize}
                                        </td>

                                        <td>
                                            {production.quantityProduced}
                                        </td>

                                        <td>
                                            {production.totalCementBags}
                                        </td>

                                        <td>
                                            {production.assetName}
                                        </td>

                                        <td>
                                            {production.status}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    console.log(
                                                        "View production:",
                                                        production.productionId
                                                    )
                                                }
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
            </div>

        </div>
    );
}

export default Production;