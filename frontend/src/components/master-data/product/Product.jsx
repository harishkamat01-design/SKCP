import { useEffect, useState } from "react";
import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
} from "../../../services/api";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import {
    DetailGrid,
    DetailItem,
} from "../../ui/common/DetailGrid";

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
    // GET ALL PRODUCTS
    // ============================================================

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet("/api/products");

            console.log("Product API response:", result);
            console.log("Product API data:", result.data);

            setProducts(
                Array.isArray(result?.data)
                    ? result.data
                    : []
            );
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
            return new Date(value).toLocaleString("en-IN");
        } catch {
            return value;
        }
    };

    // ============================================================
    // FILTER PRODUCTS
    // ============================================================

    const filteredProducts = products.filter((product) => {
        const search = searchTerm
            .trim()
            .toLowerCase();

        if (!search) {
            return true;
        }

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
                productCode:
                    addForm.productCode.trim(),
                productName:
                    addForm.productName.trim(),
                size: addForm.size.trim(),
                length: Number(addForm.length),
                width: Number(addForm.width),
                height: Number(addForm.height),
                unit: addForm.unit.trim(),
                description:
                    addForm.description.trim() || null,
            };

            console.log(
                "Create Product payload:",
                payload
            );

            const result = await apiPost(
                "/api/products",
                payload
            );

            console.log(
                "Create Product response:",
                result
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

            setEditingProduct(product);

            setEditForm({
                productCode:
                    product.productCode || "",
                productName:
                    product.productName || "",
                size: product.size || "",
                length: product.length ?? "",
                width: product.width ?? "",
                height: product.height ?? "",
                unit: product.unit || "",
                description:
                    product.description || "",
                status:
                    product.status || "ACTIVE",
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
                productCode:
                    editForm.productCode.trim(),
                productName:
                    editForm.productName.trim(),
                size: editForm.size.trim(),
                length: Number(editForm.length),
                width: Number(editForm.width),
                height: Number(editForm.height),
                unit: editForm.unit.trim(),
                description:
                    editForm.description.trim() ||
                    null,
                status: editForm.status,
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

            setEditForm({
                productCode:
                    result.data.productCode || "",
                productName:
                    result.data.productName || "",
                size:
                    result.data.size || "",
                length:
                    result.data.length ?? "",
                width:
                    result.data.width ?? "",
                height:
                    result.data.height ?? "",
                unit:
                    result.data.unit || "",
                description:
                    result.data.description || "",
                status:
                    result.data.status || "ACTIVE",
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

    const handleOpenDeleteProduct = (
        product
    ) => {
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
            const result = await apiDelete(
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

    return (
        <section className="section active">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

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

                    <button
                        type="button"
                        className="btn primary"
                        onClick={
                            handleOpenAddProduct
                        }
                    >
                        + Add Product
                    </button>

                </div>

            </div>

            {/* ==================================================
                PRODUCT LIST
            ================================================== */}

            <div className="card">

                <div className="card-head">

                    <div>
                        <div className="card-title">
                            Product List
                        </div>

                        <div className="kpi-sub">
                            {filteredProducts.length}{" "}
                            {filteredProducts.length ===
                            1
                                ? "record"
                                : "records"}
                        </div>
                    </div>

                </div>

                {/* SEARCH */}

                <div
                    className="search-wrap"
                    style={{
                        marginBottom: "16px",
                    }}
                >
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />
                </div>

                {/* LOADING */}

                {loading && (
                    <div className="empty-state">
                        <p>
                            Loading products...
                        </p>
                    </div>
                )}

                {/* ERROR */}

                {!loading && error && (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                )}

                {/* TABLE */}

                {!loading && !error && (
                    <div className="tbl-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>
                                        Product Code
                                    </th>
                                    <th>
                                        Product Name
                                    </th>
                                    <th>Size</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredProducts.map(
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

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="btn sm"
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
                                                        className="btn sm"
                                                        onClick={() =>
                                                            handleEditProduct(
                                                                product.productId
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn sm"
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

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

                {/* EMPTY STATE */}

                {!loading &&
                    !error &&
                    filteredProducts.length ===
                        0 && (
                        <div className="empty-state">
                            <p>
                                {searchTerm.trim()
                                    ? "No products match your search."
                                    : "No products found."}
                            </p>
                        </div>
                    )}

            </div>

            {/* ==================================================
                VIEW PRODUCT MODAL
            ================================================== */}

            <ViewModal
                isOpen={
                    viewLoading ||
                    !!viewError ||
                    !!selectedProduct
                }
                onClose={
                    handleCloseProductModal
                }
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

            {/* ==================================================
                ADD PRODUCT MODAL
            ================================================== */}

            <FormModal
                isOpen={showAddProduct}
                onClose={
                    handleCloseAddProduct
                }
                title="Add Product"
                subtitle="Create a new product"
                onSubmit={
                    handleCreateProduct
                }
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
                                Product Code
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

                        <div className="fld">
                            <label>
                                Product Name
                            </label>

                            <input
                                name="productName"
                                type="text"
                                value={
                                    addForm.productName
                                }
                                onChange={
                                    handleAddChange
                                }
                                minLength={2}
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="fld">
                            <label>Size</label>

                            <input
                                name="size"
                                type="text"
                                value={addForm.size}
                                onChange={
                                    handleAddChange
                                }
                                maxLength={10}
                                required
                            />
                        </div>

                        <div className="fld">
                            <label>Unit</label>

                            <input
                                name="unit"
                                type="text"
                                value={addForm.unit}
                                onChange={
                                    handleAddChange
                                }
                                maxLength={20}
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
                            <label>Length</label>

                            <input
                                name="length"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={
                                    addForm.length
                                }
                                onChange={
                                    handleAddChange
                                }
                                required
                            />
                        </div>

                        <div className="fld">
                            <label>Width</label>

                            <input
                                name="width"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={
                                    addForm.width
                                }
                                onChange={
                                    handleAddChange
                                }
                                required
                            />
                        </div>

                        <div className="fld">
                            <label>Height</label>

                            <input
                                name="height"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={
                                    addForm.height
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

            {/* ==================================================
                EDIT PRODUCT MODAL
            ================================================== */}

            <FormModal
                isOpen={
                    editLoading ||
                    !!editError ||
                    !!editingProduct
                }
                onClose={
                    handleCloseEditModal
                }
                title="Edit Product"
                subtitle="Update product information"
                onSubmit={
                    handleUpdateProduct
                }
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
                                            Product Code
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

                                    <div className="fld">
                                        <label>
                                            Product Name
                                        </label>

                                        <input
                                            name="productName"
                                            type="text"
                                            value={
                                                editForm.productName
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Size
                                        </label>

                                        <input
                                            name="size"
                                            type="text"
                                            value={
                                                editForm.size
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="fld">
                                        <label>Unit</label>

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

                                </div>

                            </div>

                            <div className="customer-modal-section">

                                <div className="customer-modal-section-title">
                                    Dimensions
                                </div>

                                <div className="form-grid">

                                    <div className="fld">
                                        <label>
                                            Length
                                        </label>

                                        <input
                                            name="length"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={
                                                editForm.length
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Width
                                        </label>

                                        <input
                                            name="width"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={
                                                editForm.width
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Height
                                        </label>

                                        <input
                                            name="height"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={
                                                editForm.height
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

            {/* ==================================================
                DELETE CONFIRMATION
            ================================================== */}

            <DeleteConfirmModal
                isOpen={
                    !!deletingProduct
                }
                onClose={
                    handleCloseDeleteProduct
                }
                onConfirm={
                    handleConfirmDelete
                }
                title="Delete Product"
                subtitle="Deactivate product record"
                message="Are you sure you want to delete this product?"
                itemName={
                    deletingProduct?.productName
                }
                confirming={deleteSaving}
                error={deleteError}
            />

        </section>
    );
}

export default Product;
