import { useEffect, useState } from "react";

function Supplier() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8080/api/suppliers"
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch suppliers (${response.status})`
                    );
                }

                const result = await response.json();

                console.log("Supplier API response:", result);
                console.log("Supplier API data:", result.data);

                setSuppliers(result.data || []);
            } catch (err) {
                console.error("Error fetching suppliers:", err);
                setError("Unable to load suppliers. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    const filteredSuppliers = suppliers.filter((supplier) => {
    const keyword = searchKeyword.toLowerCase();

    const supplierName = supplier.supplierName?.toLowerCase() || "";
    const phone = supplier.phone?.toString() || "";

    return (
        supplierName.includes(keyword) ||
        phone.includes(searchKeyword)
    );
    });

    return (
        <section className="section active">

            {/* Page Header */}
            <div className="card">
                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Suppliers
                        </div>

                        <div className="kpi-sub">
                            Manage supplier information and records
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn primary"
                    >
                        + Add Supplier
                    </button>

                </div>

                {/* Search */}
                <div className="fld customer-search">
                    <label htmlFor="supplier-search">
                        Search Supplier
                    </label>

                    <input
                        id="supplier-search"
                        type="text"
                        placeholder="Search by name or mobile number..."
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(event.target.value)
                        }
                    />
                </div>
            </div>

            {/* Supplier Table */}
            <div className="card">

                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Supplier List
                        </div>

                        <div className="kpi-sub">
                            {loading
                                ? "Loading suppliers..."
                                : `${filteredSuppliers.length} supplier(s)`}
                        </div>
                    </div>

                </div>

                {/* Loading State */}
                {loading && (
                    <div className="empty-state">
                        <p>Loading suppliers...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                )}

                {/* Supplier Table */}
                {!loading && !error && (
                    <div className="tbl-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Supplier</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredSuppliers.map((supplier) => (

                                    <tr key={supplier.supplierId}>

                                        <td>
                                            {supplier.supplierId}
                                        </td>

                                        <td>
                                            <strong>
                                                {supplier.supplierName}
                                            </strong>
                                        </td>

                                        <td>
                                            {supplier.phone || "-"}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    supplier.status === "ACTIVE"
                                                        ? "badge bg"
                                                        : "badge br"
                                                }
                                            >
                                                {supplier.status}
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
                    filteredSuppliers.length === 0 && (
                        <div className="empty-state">
                            <p>
                                No suppliers found.
                            </p>
                        </div>
                    )}

            </div>

        </section>
    );
}

export default Supplier;