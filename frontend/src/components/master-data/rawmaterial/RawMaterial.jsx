import { useEffect, useState } from "react";

function RawMaterial() {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRawMaterials = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8080/api/raw-materials"
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch raw materials (${response.status})`
                    );
                }

                const result = await response.json();

                console.log("Raw Material API response:", result);
                console.log("Raw Material API data:", result.data);

                setRawMaterials(result.data || []);
            } catch (err) {
                console.error("Error fetching raw materials:", err);
                setError(
                    "Unable to load raw materials. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRawMaterials();
    }, []);

    return (
        <section className="section active">

            {/* Page Header */}
            <div className="card">
                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Raw Materials
                        </div>

                        <div className="kpi-sub">
                            Manage raw material information and records
                        </div>
                    </div>

                </div>
            </div>

            {/* Raw Material List */}
            <div className="card">

                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Raw Material List
                        </div>

                        <div className="kpi-sub">
                            {loading
                                ? "Loading raw materials..."
                                : `${rawMaterials.length} raw material(s)`}
                        </div>
                    </div>

                </div>

                {/* Loading */}
                {loading && (
                    <div className="empty-state">
                        <p>Loading raw materials...</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                )}

                {/* Table */}
                {!loading && !error && (
                    <div className="tbl-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Material</th>
                                    <th>Category</th>
                                    <th>Unit</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {rawMaterials.map((material) => (

                                    <tr key={material.rawMaterialId}>

                                        <td>
                                            {material.rawMaterialId}
                                        </td>

                                        <td>
                                            <strong>
                                                {material.materialName}
                                            </strong>
                                        </td>

                                        <td>
                                            {material.materialCategory}
                                        </td>

                                        <td>
                                            {material.unit}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    material.status === "ACTIVE"
                                                        ? "badge bg"
                                                        : "badge br"
                                                }
                                            >
                                                {material.status}
                                            </span>
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
                    rawMaterials.length === 0 && (
                        <div className="empty-state">
                            <p>No raw materials found.</p>
                        </div>
                    )}

            </div>

        </section>
    );
}

export default RawMaterial; 