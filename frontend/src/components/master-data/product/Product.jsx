import { useEffect, useMemo, useState } from "react";

import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
} from "../../../services/api";

import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";
import Pagination from "../../ui/Pagination";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import {
    DetailGrid,
    DetailItem,
} from "../../ui/common/DetailGrid";
import "./Product.css";
// ============================================================
// PRODUCT MASTER OPTIONS
// ============================================================

const PRODUCT_NAME_OPTIONS = [
    "Solid Block",
];

const PRODUCT_SIZE_OPTIONS = [
    {
        value: "4-inch",
        label: "4-inch Block — 8 × 4 × 16",
        description: "4-inch Block",
        height: 8,
        width: 4,
        length: 16,
    },
    {
        value: "6-inch",
        label: "6-inch Block — 8 × 6 × 16",
        description: "6-inch Block",
        height: 8,
        width: 6,
        length: 16,
    },
    {
        value: "8-inch",
        label: "8-inch Block — 8 × 8 × 16",
        description: "8-inch Block",
        height: 8,
        width: 8,
        length: 16,
    },
    {
        value: "1 foot",
        label: "1 foot Block — 8 × 6 × 12",
        description: "1 foot Block",
        height: 8,
        width: 6,
        length: 12,
    },
];

function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // ============================================================
    // ADD PRODUCT
    // ============================================================

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [addSaving, setAddSaving] = useState(false);
    const [addError, setAddError] = useState("");
    const [addSuccess, setAddSuccess] = useState("");

    const [addForm, setAddForm] = useState({
        productCode: "",
        productName: "",
        size: "",
        length: "",
        width: "",
        height: "",
        unit: "",
        price: "",
        description: "",
    });

    // ============================================================
    // VIEW PRODUCT
    // ============================================================

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");

    // ============================================================
    // EDIT PRODUCT
    // ============================================================

    const [editingProduct, setEditingProduct] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const [editSaving, setEditSaving] = useState(false);

    const [editForm, setEditForm] = useState({
        productCode: "",
        productName: "",
        size: "",
        length: "",
        width: "",
        height: "",
        unit: "",
        price: "",
        description: "",
        status: "ACTIVE",
    });

    // ============================================================
    // DELETE PRODUCT
    // ============================================================

    const [deletingProduct, setDeletingProduct] = useState(null);
    const [deleteError, setDeleteError] = useState("");
    const [deleteSaving, setDeleteSaving] = useState(false);

    // ============================================================
    // FIND SIZE MASTER
    // ============================================================

    const getSizeOption = (size) => {
        const normalizedSize = String(size ?? "")
            .trim()
            .toLowerCase();

        return PRODUCT_SIZE_OPTIONS.find(
            (option) =>
                option.value.toLowerCase() === normalizedSize ||
                option.description.toLowerCase() === normalizedSize ||
                option.label.toLowerCase() === normalizedSize
        );
    };

    // ============================================================
    // APPLY SIZE TO ADD FORM
    // ============================================================

    const applyAddSize = (size) => {
        const selectedSize = getSizeOption(size);

        if (!selectedSize) {
            setAddForm((previous) => ({
                ...previous,
                size: "",
                length: "",
                width: "",
                height: "",
                description: "",
            }));

            return;
        }

        setAddForm((previous) => ({
            ...previous,
            size: selectedSize.value,
            length: selectedSize.length,
            width: selectedSize.width,
            height: selectedSize.height,
            description: selectedSize.description,
        }));
    };

    // ============================================================
    // APPLY SIZE TO EDIT FORM
    // ============================================================

    const applyEditSize = (size) => {
        const selectedSize = getSizeOption(size);

        if (!selectedSize) {
            setEditForm((previous) => ({
                ...previous,
                size: "",
                length: "",
                width: "",
                height: "",
                description: "",
            }));

            return;
        }

        setEditForm((previous) => ({
            ...previous,
            size: selectedSize.value,
            length: selectedSize.length,
            width: selectedSize.width,
            height: selectedSize.height,
            description: selectedSize.description,
        }));
    };

    // ============================================================
    // GET ALL PRODUCTS
    // ============================================================

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet("/api/products");

            const productList = Array.isArray(result?.data)
                ? result.data
                : [];

            /*
             * The product list response does not currently include
             * description, while the individual product response does.
             *
             * Fetch the complete product details so the Product List
             * table can display the actual description.
             */
            const productsWithDetails = await Promise.all(
                productList.map(async (product) => {
                    try {
                        const detailResult = await apiGet(
                            `/api/products/${product.productId}`
                        );

                        return {
                            ...product,
                            description:
                                detailResult?.data?.description ??
                                product.description ??
                                null,
                        };
                    } catch (detailError) {
                        console.error(
                            `Error fetching details for product ${product.productId}:`,
                            detailError
                        );

                        return product;
                    }
                })
            );

            setProducts(productsWithDetails);
        } catch (err) {
            console.error(
                "Error fetching products:",
                err
            );

            setError(
                err.message ||
                    "Unable to load products. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ============================================================
    // FORMAT CREATED AT
    // ============================================================

    const formatCreatedAt = (value) => {
        if (!value) {
            return "-";
        }

        try {
            const date = new Date(value);

            if (Number.isNaN(date.getTime())) {
                return value;
            }

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");
            const period = hours >= 12 ? "PM" : "AM";

            hours = hours % 12 || 12;

            return `${day}-${month}-${year} ${String(hours).padStart(
                2,
                "0"
            )}:${minutes}:${seconds} ${period}`;
        } catch {
            return value;
        }
    };

    // ============================================================
    // FILTER PRODUCTS
    // ============================================================

    const filteredProducts = useMemo(() => {
        const search = String(searchTerm ?? "")
            .trim()
            .toLowerCase();

        if (!search) {
            return products;
        }

        return products.filter((product) => {
            return [
                product.productId,
                product.productCode,
                product.productName,
                product.size,
                product.unit,
                product.status,
            ].some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(search)
            );
        });
    }, [products, searchTerm]);

    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    // ============================================================
    // SORTING
    // ============================================================

    const {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    } = useTableSort(
        filteredProducts,
        "productId",
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
    } = usePagination(
        sortedRecords,
        10
    );

    // ============================================================
    // ADD PRODUCT - OPEN
    // ============================================================

    const handleOpenAddProduct = () => {
        setAddError("");
        setAddSuccess("");

        setAddForm({
            productCode: "",
            productName: "",
            size: "",
            length: "",
            width: "",
            height: "",
            unit: "",
            price: "",
            description: "",
        });

        setShowAddProduct(true);
    };

    // ============================================================
    // ADD PRODUCT - CLOSE
    // ============================================================

    const handleCloseAddProduct = () => {
        if (addSaving) {
            return;
        }

        setShowAddProduct(false);
        setAddError("");
        setAddSuccess("");
    };

    // ============================================================
    // ADD PRODUCT - FORM CHANGE
    // ============================================================

    const handleAddChange = (event) => {
        const { name, value } = event.target;

        if (name === "size") {
            applyAddSize(value);
            return;
        }

        setAddForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ============================================================
    // CREATE PRODUCT
    // ============================================================

    const handleCreateProduct = async (event) => {
        event.preventDefault();

        setAddSaving(true);
        setAddError("");
        setAddSuccess("");

        try {
            const payload = {
                productCode: String(
                    addForm.productCode ?? ""
                ).trim(),

                productName: String(
                    addForm.productName ?? ""
                ).trim(),

                size: String(
                    addForm.size ?? ""
                ).trim(),

                length: Number(addForm.length),

                width: Number(addForm.width),

                height: Number(addForm.height),

                unit: String(
                    addForm.unit ?? ""
                ).trim(),

                price: Number(addForm.price),

                description:
                    String(
                        addForm.description ?? ""
                    ).trim() || null,
            };

            await apiPost(
                "/api/products",
                payload
            );

            setAddSuccess(
                "Product created successfully."
            );

            await fetchProducts();

            setTimeout(() => {
                setShowAddProduct(false);
                setAddSuccess("");
            }, 800);
        } catch (err) {
            console.error(
                "Error creating product:",
                err
            );

            setAddError(
                err.message ||
                    "Unable to create product."
            );
        } finally {
            setAddSaving(false);
        }
    };

    // ============================================================
    // VIEW PRODUCT
    // ============================================================

    const handleViewProduct = async (productId) => {
        setSelectedProduct(null);
        setViewError("");
        setViewLoading(true);

        try {
            const result = await apiGet(
                `/api/products/${productId}`
            );

            setSelectedProduct(result.data);
        } catch (err) {
            console.error(
                "Error fetching product:",
                err
            );

            setViewError(
                err.message ||
                    "Unable to load product details."
            );
        } finally {
            setViewLoading(false);
        }
    };

    // ============================================================
    // CLOSE VIEW
    // ============================================================

    const handleCloseProductModal = () => {
        setSelectedProduct(null);
        setViewError("");
        setViewLoading(false);
    };

    // ============================================================
    // EDIT PRODUCT
    // ============================================================

    const handleEditProduct = async (productId) => {
        setEditingProduct(null);
        setEditError("");
        setEditSuccess("");
        setEditLoading(true);

        try {
            const result = await apiGet(
                `/api/products/${productId}`
            );

            const product = result.data;

            const selectedSize = getSizeOption(
                product.size
            );

            setEditingProduct(product);

            setEditForm({
                productCode:
                    product.productCode || "",

                productName:
                    product.productName || "",

                size:
                    selectedSize?.value ||
                    String(product.size ?? ""),

                length:
                    selectedSize?.length ??
                    product.length ??
                    "",

                width:
                    selectedSize?.width ??
                    product.width ??
                    "",

                height:
                    selectedSize?.height ??
                    product.height ??
                    "",

                unit:
                    product.unit || "",

                price:
                    product.price ?? "",

                description:
                    product.description ||
                    selectedSize?.description ||
                    "",

                status:
                    product.status ||
                    "ACTIVE",
            });
        } catch (err) {
            console.error(
                "Error loading product for edit:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to load product details."
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ============================================================
    // EDIT FORM CHANGE
    // ============================================================

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        if (name === "size") {
            applyEditSize(value);
            return;
        }

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ============================================================
    // UPDATE PRODUCT
    // ============================================================

    const handleUpdateProduct = async (event) => {
        event.preventDefault();

        if (!editingProduct) {
            return;
        }

        setEditSaving(true);
        setEditError("");
        setEditSuccess("");

        try {
            const payload = {
                productCode: String(
                    editForm.productCode ?? ""
                ).trim(),

                productName: String(
                    editForm.productName ?? ""
                ).trim(),

                size: String(
                    editForm.size ?? ""
                ).trim(),

                length: Number(editForm.length),

                width: Number(editForm.width),

                height: Number(editForm.height),

                unit: String(
                    editForm.unit ?? ""
                ).trim(),

                price: Number(editForm.price),

                description:
                    String(
                        editForm.description ?? ""
                    ).trim() || null,

                status:
                    editForm.status,
            };

            const result = await apiPut(
                `/api/products/${editingProduct.productId}`,
                payload
            );

            setEditSuccess(
                "Product updated successfully."
            );

            await fetchProducts();

            setEditingProduct(result.data);

            const updatedSize = getSizeOption(
                result.data.size
            );

            setEditForm({
                productCode:
                    result.data.productCode || "",

                productName:
                    result.data.productName || "",

                size:
                    updatedSize?.value ||
                    String(result.data.size ?? ""),

                length:
                    updatedSize?.length ??
                    result.data.length ??
                    "",

                width:
                    updatedSize?.width ??
                    result.data.width ??
                    "",

                height:
                    updatedSize?.height ??
                    result.data.height ??
                    "",

                unit:
                    result.data.unit || "",

                price:
                    result.data.price ?? "",

                description:
                    result.data.description ||
                    updatedSize?.description ||
                    "",

                status:
                    result.data.status ||
                    "ACTIVE",
            });
        } catch (err) {
            console.error(
                "Error updating product:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to update product."
            );
        } finally {
            setEditSaving(false);
        }
    };

    // ============================================================
    // CLOSE EDIT
    // ============================================================

    const handleCloseEditModal = () => {
        if (editSaving) {
            return;
        }

        setEditingProduct(null);
        setEditError("");
        setEditSuccess("");
        setEditLoading(false);
    };

    // ============================================================
    // OPEN DELETE CONFIRMATION
    // ============================================================

    const handleOpenDeleteProduct = (product) => {
        setDeleteError("");
        setDeletingProduct(product);
    };

    // ============================================================
    // CLOSE DELETE CONFIRMATION
    // ============================================================

    const handleCloseDeleteProduct = () => {
        if (deleteSaving) {
            return;
        }

        setDeletingProduct(null);
        setDeleteError("");
    };

    // ============================================================
    // CONFIRM DELETE / SOFT DELETE
    // ============================================================

    const handleConfirmDelete = async () => {
        if (!deletingProduct) {
            return;
        }

        setDeleteSaving(true);
        setDeleteError("");
        setError("");

        try {
            await apiDelete(
                `/api/products/${deletingProduct.productId}`
            );

            await fetchProducts();

            setDeletingProduct(null);
        } catch (err) {
            console.error(
                "Error deleting product:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete product."
            );
        } finally {
            setDeleteSaving(false);
        }
    };

    // ============================================================
    // RENDER
    // ============================================================

    if (loading) {
        return (
            <div className="page product-page">
                <section className="card">
                    <h2>Products</h2>
                    <p>Loading product records...</p>
                </section>
            </div>
        );
    }

    return (
        <div className="page product-page">
            {/* ================================================== */}
            {/* HEADER + SEARCH */}
            {/* ================================================== */}

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
                        <h2>Products</h2>

                        <p>
                            Manage product information and records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={handleOpenAddProduct}
                    >
                        Add Product
                    </button>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "16px",
                        flexWrap: "wrap",
                        marginTop: "16px",
                    }}
                >
                    <div
                        className="fld"
                        style={{
                            width: "420px",
                            maxWidth: "100%",
                        }}
                    >
                        <label>Search Products</label>

                        <input
                            type="text"
                            placeholder="Search by product code, name, size, unit, status..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={handleClearSearch}
                        disabled={!searchTerm}
                    >
                        Clear
                    </button>
                </div>
            </section>

            {/* ================================================== */}
            {/* PRODUCT LIST */}
            {/* ================================================== */}

            <section className="card">
                <h2>Product List</h2>

                <p>
                    {totalRecords} product
                    {totalRecords === 1 ? "" : "s"}
                </p>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {!error && totalRecords === 0 && (
                    <p>No product records found.</p>
                )}

                {!error && totalRecords > 0 && (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "productId"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        ID
                                        {sortKey ===
                                            "productId" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "productCode"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Product Code
                                        {sortKey ===
                                            "productCode" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "productName"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Product Name
                                        {sortKey ===
                                            "productName" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "size"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Size
                                        {sortKey ===
                                            "size" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    {/* PRICE AFTER SIZE */}
                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "price"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Price
                                        {sortKey ===
                                            "price" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    {/* DESCRIPTION */}
                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "description"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Description
                                        {sortKey ===
                                            "description" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleSort(
                                                "status"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Status
                                        {sortKey ===
                                            "status" &&
                                            (sortDirection ===
                                            "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </th>

                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedRecords.map(
                                    (product) => (
                                        <tr
                                            key={
                                                product.productId
                                            }
                                        >
                                            <td>
                                                {
                                                    product.productId
                                                }
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        product.productCode
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    product.productName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    product.size
                                                }
                                            </td>

                                            {/* PRICE AFTER SIZE */}
                                            <td>
                                                ₹
                                                {Number(
                                                    product.price ??
                                                        0
                                                ).toFixed(2)}
                                            </td>

                                            {/* DESCRIPTION */}
                                            <td>
                                                {
                                                    product.description ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        product.status ===
                                                        "ACTIVE"
                                                            ? "badge bg"
                                                            : "badge br"
                                                    }
                                                >
                                                    {
                                                        product.status
                                                    }
                                                </span>
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
                                                            handleViewProduct(
                                                                product.productId
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn edit-btn"
                                                        onClick={() =>
                                                            handleEditProduct(
                                                                product.productId
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    {product.status ===
                                                        "ACTIVE" && (
                                                        <button
                                                            type="button"
                                                            className="action-btn delete-btn"
                                                            onClick={() =>
                                                                handleOpenDeleteProduct(
                                                                    product
                                                                )
                                                            }
                                                            disabled={
                                                                deleteSaving
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
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

            {/* ================================================== */}
            {/* VIEW PRODUCT MODAL */}
            {/* ================================================== */}

            <ViewModal
                isOpen={
                    viewLoading ||
                    !!viewError ||
                    !!selectedProduct
                }
                onClose={handleCloseProductModal}
                title="Product Details"
                subtitle="View product information"
                size="lg"
                footer={
                    <button
                        type="button"
                        className="btn"
                        onClick={
                            handleCloseProductModal
                        }
                    >
                        Close
                    </button>
                }
            >
                {viewLoading && (
                    <div className="empty-state">
                        <p>
                            Loading product details...
                        </p>
                    </div>
                )}

                {!viewLoading && viewError && (
                    <div className="empty-state">
                        <p>{viewError}</p>
                    </div>
                )}

                {!viewLoading &&
                    !viewError &&
                    selectedProduct && (
                        <DetailGrid>
                            <DetailItem
                                label="Product ID"
                                value={
                                    selectedProduct.productId
                                }
                            />

                            <DetailItem
                                label="Product Code"
                                value={
                                    selectedProduct.productCode
                                }
                            />

                            <DetailItem
                                label="Product Name"
                                value={
                                    selectedProduct.productName
                                }
                            />

                            <DetailItem
                                label="Size"
                                value={
                                    selectedProduct.size
                                }
                            />

                            <DetailItem
                                label="Length"
                                value={
                                    selectedProduct.length
                                }
                            />

                            <DetailItem
                                label="Width"
                                value={
                                    selectedProduct.width
                                }
                            />

                            <DetailItem
                                label="Height"
                                value={
                                    selectedProduct.height
                                }
                            />

                            <DetailItem
                                label="Unit"
                                value={
                                    selectedProduct.unit
                                }
                            />

                            <DetailItem
                                label="Price"
                                value={`₹${Number(
                                    selectedProduct.price ?? 0
                                ).toFixed(2)}`}
                            />

                            <DetailItem
                                label="Status"
                                value={
                                    selectedProduct.status
                                }
                            />

                            <DetailItem
                                label="Created At"
                                value={formatCreatedAt(
                                    selectedProduct.createdAt
                                )}
                            />

                            <DetailItem
                                label="Description"
                                value={
                                    selectedProduct.description ||
                                    "-"
                                }
                                fullWidth
                            />
                        </DetailGrid>
                    )}
            </ViewModal>

            {/* ================================================== */}
            {/* ADD PRODUCT MODAL */}
            {/* ================================================== */}

            <FormModal
                isOpen={showAddProduct}
                onClose={handleCloseAddProduct}
                title="Add Product"
                subtitle="Create a new product"
                onSubmit={handleCreateProduct}
                submitLabel="Add Product"
                cancelLabel="Cancel"
                saving={addSaving}
                error={addError}
                success={addSuccess}
                size="lg"
            >
                <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                        Product Information
                    </div>

                    <div className="form-grid">
                        <div className="fld">
                            <label>
                                Product Name{" "}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <select
                                name="productName"
                                value={
                                    addForm.productName
                                }
                                onChange={
                                    handleAddChange
                                }
                                required
                            >
                                <option value="">
                                    Select Product Name
                                </option>

                                {PRODUCT_NAME_OPTIONS.map(
                                    (productName) => (
                                        <option
                                            key={
                                                productName
                                            }
                                            value={
                                                productName
                                            }
                                        >
                                            {productName}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="fld">
                            <label>
                                Size{" "}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <select
                                name="size"
                                value={
                                    addForm.size
                                }
                                onChange={
                                    handleAddChange
                                }
                                required
                            >
                                <option value="">
                                    Select Size
                                </option>

                                {PRODUCT_SIZE_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {option.label}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="fld">
                            <label>
                                Product Code{" "}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                name="productCode"
                                type="text"
                                value={
                                    addForm.productCode
                                }
                                onChange={
                                    handleAddChange
                                }
                                maxLength={20}
                                required
                            />
                        </div>

                        {/* UNIT BEFORE PRICE */}
                        <div className="fld">
                            <label>
                                Unit{" "}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                name="unit"
                                type="text"
                                value={
                                    addForm.unit
                                }
                                onChange={
                                    handleAddChange
                                }
                                maxLength={20}
                                required
                            />
                        </div>

                        {/* PRICE AFTER UNIT */}
                        <div className="fld">
                            <label>
                                Price{" "}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                name="price"
                                type="number"
                                step="0.25"
                                min="0.00"
                                value={
                                    addForm.price
                                }
                                onChange={
                                    handleAddChange
                                }
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                        Dimensions
                    </div>

                    <div className="form-grid">
                        <div className="fld">
                            <label>
                                Length{" "}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                name="length"
                                type="number"
                                value={
                                    addForm.length
                                }
                                readOnly
                                required
                            />
                        </div>

                        <div className="fld">
                            <label>
                                Width{" "}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                name="width"
                                type="number"
                                value={
                                    addForm.width
                                }
                                readOnly
                                required
                            />
                        </div>

                        <div className="fld">
                            <label>
                                Height{" "}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                name="height"
                                type="number"
                                value={
                                    addForm.height
                                }
                                readOnly
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                        Additional Information
                    </div>

                    <div className="form-grid">
                        <div className="fld f-full">
                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    addForm.description
                                }
                                onChange={
                                    handleAddChange
                                }
                                maxLength={500}
                            />
                        </div>
                    </div>
                </div>
            </FormModal>

            {/* ================================================== */}
            {/* EDIT PRODUCT MODAL */}
            {/* ================================================== */}

            <FormModal
                isOpen={
                    editLoading ||
                    !!editError ||
                    !!editingProduct
                }
                onClose={handleCloseEditModal}
                title="Edit Product"
                subtitle="Update product information"
                onSubmit={handleUpdateProduct}
                submitLabel="Save Changes"
                cancelLabel="Cancel"
                saving={editSaving}
                error={editError}
                success={editSuccess}
                size="lg"
            >
                {editLoading && (
                    <div className="empty-state">
                        <p>
                            Loading product details...
                        </p>
                    </div>
                )}

                {!editLoading &&
                    editingProduct && (
                        <>
                            <div className="customer-modal-section">
                                <div className="customer-modal-section-title">
                                    Product Information
                                </div>

                                <div className="form-grid">
                                    <div className="fld">
                                        <label>
                                            Product Name{" "}
                                            <span className="required">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            name="productName"
                                            value={
                                                editForm.productName
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Product Name
                                            </option>

                                            {PRODUCT_NAME_OPTIONS.map(
                                                (
                                                    productName
                                                ) => (
                                                    <option
                                                        key={
                                                            productName
                                                        }
                                                        value={
                                                            productName
                                                        }
                                                    >
                                                        {
                                                            productName
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Size{" "}
                                            <span className="required">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            name="size"
                                            value={
                                                editForm.size
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Size
                                            </option>

                                            {PRODUCT_SIZE_OPTIONS.map(
                                                (
                                                    option
                                                ) => (
                                                    <option
                                                        key={
                                                            option.value
                                                        }
                                                        value={
                                                            option.value
                                                        }
                                                    >
                                                        {
                                                            option.label
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Product Code{" "}
                                            <span className="required">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="productCode"
                                            type="text"
                                            value={
                                                editForm.productCode
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />
                                    </div>

                                    {/* UNIT BEFORE PRICE */}
                                    <div className="fld">
                                        <label>
                                            Unit{" "}
                                            <span className="required">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="unit"
                                            type="text"
                                            value={
                                                editForm.unit
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />
                                    </div>

                                    {/* PRICE AFTER UNIT */}
                                    <div className="fld">
                                        <label>
                                            Price{" "}
                                            <span className="required">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="price"
                                            type="number"
                                            step="0.25"
                                            min="0.00"
                                            value={
                                                editForm.price
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="customer-modal-section">
                                <div className="customer-modal-section-title">
                                    Dimensions
                                </div>

                                <div className="form-grid">
                                    <div className="fld">
                                        <label>
                                            Length{" "}
                                            <span className="required">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="length"
                                            type="number"
                                            value={
                                                editForm.length
                                            }
                                            readOnly
                                            required
                                        />
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Width{" "}
                                            <span className="required">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="width"
                                            type="number"
                                            value={
                                                editForm.width
                                            }
                                            readOnly
                                            required
                                        />
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Height{" "}
                                            <span className="required">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="height"
                                            type="number"
                                            value={
                                                editForm.height
                                            }
                                            readOnly
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="customer-modal-section">
                                <div className="customer-modal-section-title">
                                    Additional Information
                                </div>

                                <div className="form-grid">
                                    <div className="fld f-full">
                                        <label>
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={
                                                editForm.description
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            maxLength={500}
                                        />
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            value={
                                                editForm.status
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        >
                                            <option value="ACTIVE">
                                                ACTIVE
                                            </option>

                                            <option value="INACTIVE">
                                                INACTIVE
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
            </FormModal>

            {/* ================================================== */}
            {/* DELETE CONFIRMATION */}
            {/* ================================================== */}

            <DeleteConfirmModal
                isOpen={!!deletingProduct}
                onClose={handleCloseDeleteProduct}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                subtitle="Deactivate product record"
                message="Are you sure you want to delete this product?"
                itemName={
                    deletingProduct?.productName
                }
                confirming={deleteSaving}
                error={deleteError}
            />
        </div>
    );
}

export default Product;