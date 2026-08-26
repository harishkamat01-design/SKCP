import { useEffect, useState } from "react";

function Purchase() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8080/api/purchases"
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch purchases (${response.status})`
                    );
                }

                const result = await response.json();

                console.log("Purchase API response:", result);
                console.log("Purchase API data:", result.data);

                setPurchases(result.data || []);
            } catch (err) {
                console.error("Error fetching purchases:", err);
                setError("Unable to load purchases. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    const filteredPurchases = purchases.filter((purchase) => {
        const keyword = searchKeyword.toLowerCase();

        return (
            (purchase.invoiceNumber || "")
                .toLowerCase()
                .includes(keyword) ||
            (purchase.supplierName || "")
                .toLowerCase()
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
                            Purchases
                        </div>

                        <div className="kpi-sub">
                            Manage purchase information and records
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn primary"
                    >
                        + Add Purchase
                    </button>

                </div>

                {/* Search */}
                <div className="fld customer-search">

                    <label htmlFor="purchase-search">
                        Search Purchase
                    </label>

                    <input
                        id="purchase-search"
                        type="text"
                        placeholder="Search by invoice number or supplier name..."
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(event.target.value)
                        }
                    />

                </div>

            </div>

            {/* Purchase List */}
            <div className="card">

                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Purchase List
                        </div>

                        <div className="kpi-sub">
                            {loading
                                ? "Loading purchases..."
                                : `${filteredPurchases.length} purchase(s)`}
                        </div>
                    </div>

                </div>

                {/* Loading State */}
                {loading && (
                    <div className="empty-state">
                        <p>Loading purchases...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                )}

                {/* Purchase Table */}
                {!loading &&
                    !error &&
                    filteredPurchases.length > 0 && (
                        <div className="tbl-wrap">

                            <table>

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>INVOICE</th>
                                        <th>SUPPLIER</th>
                                        <th>TOTAL AMOUNT</th>
                                        <th>PAYMENT STATUS</th>
                                        <th>STATUS</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredPurchases.map((purchase) => (
                                        <tr key={purchase.purchaseId}>

                                            <td>
                                                {purchase.purchaseId}
                                            </td>

                                            <td>
                                                {purchase.purchaseDate || "-"}
                                            </td>

                                            <td>
                                                <strong>
                                                    {purchase.invoiceNumber || "-"}
                                                </strong>
                                            </td>

                                            <td>
                                                {purchase.supplierName || "-"}
                                            </td>

                                            <td>
                                                ₹{" "}
                                                {purchase.totalAmount != null
                                                    ? Number(
                                                        purchase.totalAmount
                                                    ).toLocaleString("en-IN", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })
                                                    : "0.00"}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        purchase.paymentStatus ===
                                                        "PAID"
                                                            ? "badge bg"
                                                            : "badge br"
                                                    }
                                                >
                                                    {purchase.paymentStatus ||
                                                        "-"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        purchase.status ===
                                                        "ACTIVE"
                                                            ? "badge bg"
                                                            : "badge br"
                                                    }
                                                >
                                                    {purchase.status}
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
                    filteredPurchases.length === 0 && (
                        <div className="empty-state">
                            <p>
                                {searchKeyword
                                    ? "No purchases found matching your search."
                                    : "No purchases found."}
                            </p>
                        </div>
                    )}

            </div>

        </section>
    );
}

export default Purchase;