import { useEffect, useState } from "react";

function Customer() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8080/api/customers"
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch customers (${response.status})`
                    );
                }

                const result = await response.json();

                console.log("Customer API response:", result);
                console.log("Customer API data:", result.data);

                setCustomers(result.data || []);
            } catch (err) {
                console.error("Error fetching customers:", err);
                setError("Unable to load customers. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter((customer) => {
    const keyword = searchKeyword.toLowerCase();

    const customerName = customer.customerName?.toLowerCase() || "";
    const mobileNumber = customer.mobileNumber?.toString() || "";

    return (
        customerName.includes(keyword) ||
        mobileNumber.includes(searchKeyword)
    );
    });

    return (
        <section className="section active">

            {/* Page Header */}
            <div className="card">
                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Customers
                        </div>

                        <div className="kpi-sub">
                            Manage customer information and records
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn primary"
                    >
                        + Add Customer
                    </button>

                </div>

                {/* Search */}
                <div className="fld customer-search">
                    <label htmlFor="customer-search">
                        Search Customer
                    </label>

                    <input
                        id="customer-search"
                        type="text"
                        placeholder="Search by name or mobile number..."
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(event.target.value)
                        }
                    />
                </div>
            </div>

            {/* Customer Table */}
            <div className="card">

                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Customer List
                        </div>

                        <div className="kpi-sub">
                            {loading
                                ? "Loading customers..."
                                : `${filteredCustomers.length} customer(s)`}
                        </div>
                    </div>

                </div>

                {/* Loading State */}
                {loading && (
                    <div className="empty-state">
                        <p>Loading customers...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                )}

                {/* Customer Table */}
                {!loading && !error && (
                    <div className="tbl-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Mobile</th>
                                    <th>Village</th>
                                    <th>City</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredCustomers.map((customer) => (

                                    <tr key={customer.customerId}>

                                        <td>
                                            {customer.customerId}
                                        </td>

                                        <td>
                                            <strong>
                                                {customer.customerName}
                                            </strong>
                                        </td>

                                        <td>
                                            {customer.mobileNumber}
                                        </td>

                                        <td className="mu">
                                            {customer.village || "-"}
                                        </td>

                                        <td className="mu">
                                            {customer.city || "-"}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    customer.status === "ACTIVE"
                                                        ? "badge bg"
                                                        : "badge br"
                                                }
                                            >
                                                {customer.status}
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
                    filteredCustomers.length === 0 && (
                        <div className="empty-state">
                            <p>
                                No customers found.
                            </p>
                        </div>
                    )}

            </div>

        </section>
    );
}

export default Customer;
