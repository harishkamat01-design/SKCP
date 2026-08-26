import { useEffect, useState } from "react";

function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8080/api/products"
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch products (${response.status})`
                    );
                }

                const result = await response.json();

                console.log("Product API response:", result);
                console.log("Product API data:", result.data);

                setProducts(result.data || []);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Unable to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className="section active">

            <div className="card">

                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Products
                        </div>

                        <div className="kpi-sub">
                            Manage product information and records
                        </div>
                    </div>

                </div>

                {loading && (
                    <div className="empty-state">
                        <p>Loading products...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="tbl-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product Code</th>
                                    <th>Product Name</th>
                                    <th>Size</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {products.map((product) => (

                                    <tr key={product.productId}>

                                        <td>
                                            {product.productId}
                                        </td>

                                        <td>
                                            <strong>
                                                {product.productCode}
                                            </strong>
                                        </td>

                                        <td>
                                            {product.productName}
                                        </td>

                                        <td>
                                            {product.size}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    product.status === "ACTIVE"
                                                        ? "badge bg"
                                                        : "badge br"
                                                }
                                            >
                                                {product.status}
                                            </span>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

                {!loading &&
                    !error &&
                    products.length === 0 && (
                        <div className="empty-state">
                            <p>No products found.</p>
                        </div>
                    )}

            </div>

        </section>
    );
}

export default Product;