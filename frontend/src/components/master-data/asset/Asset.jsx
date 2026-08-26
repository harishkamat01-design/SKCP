import { useEffect, useState } from "react";

function Asset() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8080/api/assets"
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch assets (${response.status})`
                    );
                }

                const result = await response.json();

                console.log("Asset API response:", result);
                console.log("Asset API data:", result.data);

                setAssets(result.data || []);
            } catch (err) {
                console.error("Error fetching assets:", err);
                setError("Unable to load assets. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, []);

    return (
        <section className="section active">

            {/* Page Header */}
            <div className="card">
                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Assets
                        </div>

                        <div className="kpi-sub">
                            Manage asset information and records
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn primary"
                    >
                        + Add Asset
                    </button>

                </div>
            </div>

            {/* Asset Table */}
            <div className="card">

                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Asset List
                        </div>

                        <div className="kpi-sub">
                            {loading
                                ? "Loading assets..."
                                : `${assets.length} asset(s)`}
                        </div>
                    </div>

                </div>

                {/* Loading State */}
                {loading && (
                    <div className="empty-state">
                        <p>Loading assets...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                )}

                {/* Asset Table */}
                {!loading && !error && assets.length > 0 && (
                    <div className="tbl-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>ASSET</th>
                                    <th>CATEGORY</th>
                                    <th>LOCATION</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                {assets.map((asset) => (
                                    <tr key={asset.assetId}>

                                        <td>
                                            {asset.assetId}
                                        </td>

                                        <td>
                                            <strong>
                                                {asset.assetName}
                                            </strong>
                                        </td>

                                        <td>
                                            {asset.assetCategory}
                                        </td>

                                        <td>
                                            {asset.location || "-"}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    asset.status === "ACTIVE"
                                                        ? "badge bg"
                                                        : "badge br"
                                                }
                                            >
                                                {asset.status}
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

                {/* Empty State */}
                {!loading &&
                    !error &&
                    assets.length === 0 && (
                        <div className="empty-state">
                            <p>
                                No assets found.
                            </p>
                        </div>
                    )}

            </div>

        </section>
    );
}

export default Asset;
