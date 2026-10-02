import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";

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
import AddCustomerModal from "../../master-data/customer/AddCustomerModal";
import usePagination from "../../../hooks/usePagination";
import Pagination from "../../ui/Pagination";
import useTableSort from "../../../hooks/useTableSort";

const initialOrderForm = {
    customerId: "",
    orderDate: "",
    expectedDeliveryDate: "",
    transportMode: "",
    remarks: "",
};

const createEmptyItem = () => ({
    orderItemId: null,
    productId: "",
    orderedQuantity: "",
    unitSellingPrice: "",
    remarks: "",
    isExisting: false,
});

const ORDER_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
];

function Order({ onOpenPayment }) {
    // ============================================================
    // ORDERS
    // ============================================================

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [dateFilterError, setDateFilterError] = useState("");

    // ============================================================
    // CUSTOMERS / PRODUCTS
    // ============================================================

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [masterLoading, setMasterLoading] = useState(false);
    const [masterError, setMasterError] = useState("");

    // ============================================================
    // ADD ORDER
    // ============================================================

    const [showAddCustomerModal, setShowAddCustomerModal] =
        useState(false);
    const [showAddOrder, setShowAddOrder] = useState(false);
    const [addSaving, setAddSaving] = useState(false);
    const [addError, setAddError] = useState("");
    const [addSuccess, setAddSuccess] = useState("");

    const [addForm, setAddForm] = useState(initialOrderForm);

    const [addItems, setAddItems] = useState([
        createEmptyItem(),
    ]);

    // ============================================================
    // VIEW ORDER / BILL
    // ============================================================

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");

    // ============================================================
    // EDIT ORDER
    // ============================================================

    const [editingOrder, setEditingOrder] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");

    const [editForm, setEditForm] = useState(
        initialOrderForm
    );

    const [editOrderStatus, setEditOrderStatus] =
        useState("PENDING");

    const [editItems, setEditItems] = useState([]);

    // ============================================================
    // DELETE ORDER
    // ============================================================

    const [deletingOrder, setDeletingOrder] = useState(null);
    const [deleteSaving, setDeleteSaving] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ============================================================
    // GET ALL ORDERS
    // ============================================================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiGet("/api/orders");

            console.log("Order API response:", result);

            setOrders(
                Array.isArray(result?.data)
                    ? result.data
                    : []
            );
        } catch (err) {
            console.error(
                "Error fetching orders:",
                err
            );

            setError(
                err.message ||
                    "Unable to load orders. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // GET CUSTOMERS AND PRODUCTS
    // ============================================================

    const fetchMasterData = async () => {
        try {
            setMasterLoading(true);
            setMasterError("");

            const [customerResult, productResult] =
                await Promise.all([
                    apiGet("/api/customers"),
                    apiGet("/api/products"),
                ]);

            const customerData = Array.isArray(
                customerResult?.data
            )
                ? customerResult.data
                : [];

            const productData = Array.isArray(
                productResult?.data
            )
                ? productResult.data
                : [];

            setCustomers(customerData);
            setProducts(productData);
        } catch (err) {
            console.error(
                "Error fetching order master data:",
                err
            );

            setMasterError(
                err.message ||
                    "Unable to load customers and products."
            );
        } finally {
            setMasterLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchMasterData();
    }, []);

    // ============================================================
    // FILTER ORDERS
    // ============================================================

    const filteredOrders = useMemo(() => {
        if (
            dateFrom &&
            dateTo &&
            dateFrom > dateTo
        ) {
            return [];
        }

        const search = searchTerm
            .trim()
            .toLowerCase();

        return orders.filter((order) => {
            const matchesSearch =
                !search ||
                [
                    order.orderId,
                    order.customerId,
                    order.customerName,
                    order.orderDate,
                    order.expectedDeliveryDate,
                    order.orderStatus,
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                );

            const matchesDateFrom =
                !dateFrom ||
                order.orderDate >= dateFrom;

            const matchesDateTo =
                !dateTo ||
                order.orderDate <= dateTo;

            return (
                matchesSearch &&
                matchesDateFrom &&
                matchesDateTo
            );
        });
    }, [
        orders,
        searchTerm,
        dateFrom,
        dateTo,
    ]);

    // ============================================================
    // SORT ORDERS
    // ============================================================

    const {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    } = useTableSort(
        filteredOrders,
        "orderId",
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
    // FORMAT DATE
    // ============================================================

    const formatDate = (value) => {
        if (!value) {
            return "-";
        }

        try {
            return new Date(
                `${value}T00:00:00`
            ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch {
            return value;
        }
    };

    // ============================================================
    // FORMAT CURRENCY
    // ============================================================

    const formatCurrency = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "₹0.00";
        }

        const amount = Number(value);

        if (Number.isNaN(amount)) {
            return "₹0.00";
        }

        return `₹${amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatPdfCurrency = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "INR 0.00";
        }

        const amount = Number(value);

        if (Number.isNaN(amount)) {
            return "INR 0.00";
        }

        return `INR ${amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    // ============================================================
    // GET PRODUCT
    // ============================================================

    const getProductById = (productId) => {
        return products.find(
            (product) =>
                Number(product.productId) ===
                Number(productId)
        );
    };

    // ============================================================
    // GET CUSTOMER
    // ============================================================

    const getCustomerById = (customerId) => {
        return customers.find(
            (customer) =>
                Number(customer.customerId) ===
                Number(customerId)
        );
    };

    // ============================================================
    // ITEM AMOUNT
    // ============================================================

    const calculateItemAmount = (item) => {
        const quantity = Number(
            item.orderedQuantity || 0
        );

        const rate = Number(
            item.unitSellingPrice || 0
        );

        return quantity * rate;
    };

    // ============================================================
    // ADD ORDER - OPEN
    // ============================================================

    const handleOpenAddOrder = async () => {
        setAddError("");
        setAddSuccess("");
        setMasterError("");

        setAddForm({
            ...initialOrderForm,
            orderDate: new Date()
                .toISOString()
                .split("T")[0],
        });

        setAddItems([createEmptyItem()]);

        if (
            customers.length === 0 ||
            products.length === 0
        ) {
            await fetchMasterData();
        }

        setShowAddOrder(true);
    };

    // ============================================================
    // ADD ORDER - CLOSE
    // ============================================================

    const handleCloseAddOrder = () => {
        if (addSaving) {
            return;
        }

        setShowAddOrder(false);
        setAddError("");
        setAddSuccess("");
        setAddForm(initialOrderForm);
        setAddItems([createEmptyItem()]);
    };

    // ============================================================
    // ADD ORDER - HEADER CHANGE
    // ============================================================

    const handleAddFormChange = (event) => {
        const { name, value } = event.target;

        setAddForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ============================================================
    // ADD ITEM
    // ============================================================

    const handleAddItem = () => {
        setAddItems((previous) => [
            ...previous,
            createEmptyItem(),
        ]);
    };

    // ============================================================
    // REMOVE ADD ITEM
    // ============================================================

    const handleRemoveAddItem = (index) => {
        if (addItems.length === 1) {
            return;
        }

        setAddItems((previous) =>
            previous.filter(
                (_, itemIndex) => itemIndex !== index
            )
        );
    };

    // ============================================================
    // CHANGE ADD ITEM
    // ============================================================

    const handleAddItemChange = (
        index,
        field,
        value
    ) => {
        setAddItems((previous) =>
            previous.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };

    // ============================================================
    // ADD ORDER TOTAL
    // ============================================================

    const addOrderTotal = addItems.reduce(
        (total, item) =>
            total + calculateItemAmount(item),
        0
    );

    // ============================================================
    // VALIDATE ORDER ITEMS
    // ============================================================

    const validateOrderItems = (items) => {
        if (!items || items.length === 0) {
            return "At least one product is required.";
        }

        for (let index = 0; index < items.length; index++) {
            const item = items[index];

            if (!item.productId) {
                return `Please select a product for item ${
                    index + 1
                }.`;
            }

            if (
                !item.orderedQuantity ||
                Number(item.orderedQuantity) <= 0
            ) {
                return `Please enter a valid quantity for item ${
                    index + 1
                }.`;
            }

            if (
                item.unitSellingPrice === "" ||
                item.unitSellingPrice === null ||
                Number(item.unitSellingPrice) < 0
            ) {
                return `Please enter a valid rate for item ${
                    index + 1
                }.`;
            }
        }

        return "";
    };

    // ============================================================
    // CREATE ORDER
    // ============================================================

    const handleCreateOrder = async (event) => {
        event.preventDefault();

        setAddSaving(true);
        setAddError("");
        setAddSuccess("");

        try {
            if (!addForm.customerId) {
                throw new Error(
                    "Please select a customer."
                );
            }

            if (!addForm.orderDate) {
                throw new Error(
                    "Order date is required."
                );
            }

            if (
                addForm.expectedDeliveryDate &&
                addForm.expectedDeliveryDate < addForm.orderDate
            ) {
                throw new Error(
                    "Expected delivery date cannot be earlier than the order date."
                );
            }

            if (!addForm.transportMode) {
                throw new Error(
                    "Please select a transport."
                );
            }

            const itemValidation =
                validateOrderItems(addItems);

            if (itemValidation) {
                throw new Error(itemValidation);
            }

            const orderPayload = {
                customerId: Number(
                    addForm.customerId
                ),
                orderDate: addForm.orderDate,
                expectedDeliveryDate:
                    addForm.expectedDeliveryDate ||
                    null,
                transportMode:
                    addForm.transportMode,
                remarks:
                    addForm.remarks.trim() ||
                    null,
            };

            console.log(
                "Create Order payload:",
                orderPayload
            );

            const orderResult = await apiPost(
                "/api/orders",
                orderPayload
            );

            console.log(
                "Create Order response:",
                orderResult
            );

            const createdOrder =
                orderResult?.data;

            if (!createdOrder?.orderId) {
                throw new Error(
                    "Order was created but Order ID was not returned by the server."
                );
            }

            const orderId =
                createdOrder.orderId;

            for (const item of addItems) {
                const itemPayload = {
                    orderId: Number(orderId),
                    productId: Number(
                        item.productId
                    ),
                    orderedQuantity: Number(
                        item.orderedQuantity
                    ),
                    unitSellingPrice: Number(
                        item.unitSellingPrice
                    ),
                    remarks:
                        item.remarks?.trim() ||
                        null,
                };

                console.log(
                    "Create Order Item payload:",
                    itemPayload
                );

                await apiPost(
                    "/api/order-items",
                    itemPayload
                );
            }

            if (onOpenPayment) {
                onOpenPayment({
                    customerId: Number(addForm.customerId),
                    orderId: Number(orderId),
                });
            }

            setAddSuccess(
                "Order and order items created successfully."
            );

            await fetchOrders();

            setTimeout(() => {
                setShowAddOrder(false);
                setAddSuccess("");
                setAddForm(initialOrderForm);
                setAddItems([
                    createEmptyItem(),
                ]);
            }, 800);
        } catch (err) {
            console.error(
                "Error creating order:",
                err
            );

            setAddError(
                err.message ||
                    "Unable to create order."
            );
        } finally {
            setAddSaving(false);
        }
    };

    // ============================================================
    // VIEW ORDER / BILL
    // ============================================================

    const handleViewOrder = async (orderId) => {
        setSelectedOrder(null);
        setViewError("");
        setViewLoading(true);

        try {
            const result = await apiGet(
                `/api/orders/${orderId}`
            );

            console.log(
                "Order View response:",
                result
            );

            setSelectedOrder(result?.data || null);
        } catch (err) {
            console.error(
                "Error fetching order:",
                err
            );

            setViewError(
                err.message ||
                    "Unable to load order details."
            );
        } finally {
            setViewLoading(false);
        }
    };

    // ============================================================
    // CLOSE VIEW
    // ============================================================

    const handleCloseViewOrder = () => {
        setSelectedOrder(null);
        setViewError("");
        setViewLoading(false);
    };

    // ============================================================
    // DOWNLOAD ORDER BILL PDF
    // ============================================================

    const handleDownloadOrderPdf = () => {
        if (!selectedOrder) {
            return;
        }

        const doc = new jsPDF();

        const pageWidth =
            doc.internal.pageSize.getWidth();

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(
            "Shree Kundodari Cement Products",
            18,
            18
        );

        doc.setFontSize(16);
        doc.text(
            "ORDER BILL",
            pageWidth - 18,
            18,
            {
                align: "right",
            }
        );

        doc.setLineWidth(0.5);
        doc.line(
            20,
            26,
            pageWidth - 20,
            26
        );

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(
            "Order Information",
            20,
            38
        );

        doc.setFont("helvetica", "normal");

        doc.text(
            `Customer: ${selectedOrder.customerName || "-"}`,
            20,
            47
        );

        doc.text(
            `Order Number: #${selectedOrder.orderId || "-"}`,
            20,
            55
        );

        doc.text(
            `Order Date: ${formatDate(selectedOrder.orderDate)}`,
            20,
            63
        );

        doc.text(
            `Expected Delivery: ${formatDate(
                selectedOrder.expectedDeliveryDate
            )}`,
            20,
            71
        );

        let y = 84;

        doc.setFont("helvetica", "bold");
        doc.text(
            "Order Items",
            20,
            y
        );

        y += 8;

        doc.setFontSize(10);

        doc.text("Product", 20, y);
        doc.text("Size", 75, y);
        doc.text("Qty", 115, y);
        doc.text("Rate", 140, y);
        doc.text("Amount", 170, y);

        y += 5;

        doc.setLineWidth(0.3);
        doc.line(
            20,
            y,
            pageWidth - 20,
            y
        );

        y += 7;

        doc.setFont("helvetica", "normal");

        if (
            selectedOrder.items &&
            selectedOrder.items.length > 0
        ) {
            selectedOrder.items.forEach((item) => {
                doc.text(
                    String(
                        item.productName || "-"
                    ),
                    20,
                    y
                );

                doc.text(
                    String(
                        item.productSize || "-"
                    ),
                    75,
                    y
                );

                doc.text(
                    String(
                        item.orderedQuantity || 0
                    ),
                    115,
                    y
                );

                doc.text(
                    formatPdfCurrency(
                        item.unitSellingPrice
                    ),
                    140,
                    y
                );

                doc.text(
                    formatPdfCurrency(
                        item.amount
                    ),
                    170,
                    y
                );

                y += 7;

                if (y > 260) {
                    doc.addPage();
                    y = 20;
                }
            });
        } else {
            doc.text(
                "No order items found.",
                20,
                y
            );

            y += 7;
        }

        y += 3;

        doc.setLineWidth(0.3);
        doc.line(
            20,
            y,
            pageWidth - 20,
            y
        );

        y += 9;

        doc.setFont("helvetica", "bold");

        doc.text(
            "Total",
            140,
            y
        );

        doc.text(
            formatPdfCurrency(
                selectedOrder.totalAmount
            ),
            170,
            y
        );

        y += 16;

        doc.setFontSize(11);
        doc.text(
            "Payment Summary",
            20,
            y
        );

        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        doc.text(
            `Payment Status: ${
                selectedOrder.paymentStatus ||
                "PENDING"
            }`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Paid Amount: ${formatPdfCurrency(
                selectedOrder.paidAmount
            )}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Balance: ${formatPdfCurrency(
                selectedOrder.balance
            )}`,
            20,
            y
        );

        y += 16;

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");

        doc.text(
            "Additional Information",
            20,
            y
        );

        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        doc.text(
            `Order Status: ${
                selectedOrder.orderStatus || "-"
            }`,
            20,
            y
        );

        y += 7;

        const remarks =
            selectedOrder.remarks || "-";

        const wrappedRemarks =
            doc.splitTextToSize(
                `Remarks: ${remarks}`,
                pageWidth - 40
            );

        doc.text(
            wrappedRemarks,
            20,
            y
        );

        const footerY =
            doc.internal.pageSize.getHeight() - 15;

        doc.setFontSize(8);
        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            "SKCP - Kumta - 581343, Karnataka",
            pageWidth / 2,
            footerY,
            {
                align: "center",
            }
        );

        doc.save(
            `SKCP-Order-${selectedOrder.orderId}.pdf`
        );
    };

    // ============================================================
    // EDIT ORDER
    // ============================================================

    const handleEditOrder = async (orderId) => {
        setEditingOrder(null);
        setEditError("");
        setEditSuccess("");
        setEditLoading(true);

        try {
            if (
                customers.length === 0 ||
                products.length === 0
            ) {
                await fetchMasterData();
            }

            const orderResult = await apiGet(
                `/api/orders/${orderId}`
            );

            const order =
                orderResult?.data;

            if (!order) {
                throw new Error(
                    "Order details not found."
                );
            }

            const orderItemsResult =
                await apiGet(
                    "/api/order-items"
                );

            const allOrderItems =
                Array.isArray(
                    orderItemsResult?.data
                )
                    ? orderItemsResult.data
                    : [];

            const existingItems =
                allOrderItems
                    .filter(
                        (item) =>
                            Number(item.orderId) ===
                            Number(orderId)
                    )
                    .map((item) => ({
                        orderItemId:
                            item.orderItemId,
                        productId:
                            item.productId || "",
                        orderedQuantity:
                            item.orderedQuantity ??
                            "",
                        unitSellingPrice:
                            item.unitSellingPrice ??
                            "",
                        remarks:
                            item.remarks || "",
                        isExisting: true,
                    }));

            setEditingOrder(order);

            setEditForm({
                customerId:
                    order.customerId || "",
                orderDate:
                    order.orderDate || "",
                expectedDeliveryDate:
                    order.expectedDeliveryDate ||
                    "",
                remarks:
                    order.remarks || "",
            });

            setEditOrderStatus(
                order.orderStatus ||
                    "PENDING"
            );

            setEditItems(
                existingItems.length > 0
                    ? existingItems
                    : [createEmptyItem()]
            );
        } catch (err) {
            console.error(
                "Error loading order for edit:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to load order details."
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ============================================================
    // EDIT ORDER HEADER CHANGE
    // ============================================================

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ============================================================
    // EDIT ITEM
    // ============================================================

    const handleEditItemChange = (
        index,
        field,
        value
    ) => {
        setEditItems((previous) =>
            previous.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };

    // ============================================================
    // ADD NEW ITEM TO EDIT
    // ============================================================

    const handleAddEditItem = () => {
        setEditItems((previous) => [
            ...previous,
            createEmptyItem(),
        ]);
    };

    // ============================================================
    // REMOVE ITEM FROM EDIT
    // ============================================================

    const handleRemoveEditItem = async (
        index
    ) => {
        const item = editItems[index];

        if (!item?.isExisting) {
            if (editItems.length === 1) {
                setEditItems([
                    createEmptyItem(),
                ]);
                return;
            }

            setEditItems((previous) =>
                previous.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                )
            );

            return;
        }

        try {
            setEditSaving(true);
            setEditError("");

            await apiDelete(
                `/api/order-items/${item.orderItemId}`
            );

            setEditItems((previous) =>
                previous.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                )
            );
        } catch (err) {
            console.error(
                "Error removing order item:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to remove order item."
            );
        } finally {
            setEditSaving(false);
        }
    };

    // ============================================================
    // EDIT ORDER TOTAL
    // ============================================================

    const editOrderTotal = editItems.reduce(
        (total, item) =>
            total + calculateItemAmount(item),
        0
    );

    // ============================================================
    // UPDATE ORDER
    // ============================================================

    const handleUpdateOrder = async (event) => {
        event.preventDefault();

        if (!editingOrder) {
            return;
        }

        setEditSaving(true);
        setEditError("");
        setEditSuccess("");

        try {
            if (!editForm.customerId) {
                throw new Error(
                    "Please select a customer."
                );
            }

            if (!editForm.orderDate) {
                throw new Error(
                    "Order date is required."
                );
            }

            const itemValidation =
                validateOrderItems(editItems);

            if (itemValidation) {
                throw new Error(itemValidation);
            }

            const orderPayload = {
                customerId: Number(
                    editForm.customerId
                ),
                orderDate:
                    editForm.orderDate,
                expectedDeliveryDate:
                    editForm.expectedDeliveryDate ||
                    null,
                orderStatus:
                    editOrderStatus,
                remarks:
                    editForm.remarks.trim() ||
                    null,
            };

            console.log(
                "Update Order payload:",
                orderPayload
            );

            await apiPut(
                `/api/orders/${editingOrder.orderId}`,
                orderPayload
            );

            for (const item of editItems) {
                const itemPayload = {
                    orderId: Number(
                        editingOrder.orderId
                    ),
                    productId: Number(
                        item.productId
                    ),
                    orderedQuantity: Number(
                        item.orderedQuantity
                    ),
                    unitSellingPrice: Number(
                        item.unitSellingPrice
                    ),
                    remarks:
                        item.remarks?.trim() ||
                        null,
                };

                if (
                    item.isExisting &&
                    item.orderItemId
                ) {
                    console.log(
                        "Update Order Item payload:",
                        itemPayload
                    );

                    await apiPut(
                        `/api/order-items/${item.orderItemId}`,
                        itemPayload
                    );
                } else {
                    console.log(
                        "Create Order Item payload:",
                        itemPayload
                    );

                    await apiPost(
                        "/api/order-items",
                        itemPayload
                    );
                }
            }

            setEditSuccess(
                "Order and order items updated successfully."
            );

            await fetchOrders();

            const refreshedOrderResult =
                await apiGet(
                    `/api/orders/${editingOrder.orderId}`
                );

            setEditingOrder(
                refreshedOrderResult?.data ||
                    editingOrder
            );

            setTimeout(() => {
                setEditingOrder(null);
                setEditSuccess("");
                setEditForm(
                    initialOrderForm
                );
                setEditItems([]);
            }, 800);
        } catch (err) {
            console.error(
                "Error updating order:",
                err
            );

            setEditError(
                err.message ||
                    "Unable to update order."
            );
        } finally {
            setEditSaving(false);
        }
    };

    // ============================================================
    // CLOSE EDIT
    // ============================================================

    const handleCloseEditOrder = () => {
        if (editSaving) {
            return;
        }

        setEditingOrder(null);
        setEditError("");
        setEditSuccess("");
        setEditLoading(false);
        setEditForm(initialOrderForm);
        setEditItems([]);
    };

    // ============================================================
    // DELETE ORDER
    // ============================================================

    const handleOpenDeleteOrder = (order) => {
        setDeleteError("");
        setDeletingOrder(order);
    };

    // ============================================================
    // CLOSE DELETE
    // ============================================================

    const handleCloseDeleteOrder = () => {
        if (deleteSaving) {
            return;
        }

        setDeletingOrder(null);
        setDeleteError("");
    };

    // ============================================================
    // CONFIRM DELETE
    // ============================================================

    const handleConfirmDelete = async () => {
        if (!deletingOrder) {
            return;
        }

        setDeleteSaving(true);
        setDeleteError("");
        setError("");

        try {
            await apiDelete(
                `/api/orders/${deletingOrder.orderId}`
            );

            await fetchOrders();

            setDeletingOrder(null);
        } catch (err) {
            console.error(
                "Error deleting order:",
                err
            );

            setDeleteError(
                err.message ||
                    "Unable to delete order."
            );
        } finally {
            setDeleteSaving(false);
        }
    };

    // ============================================================
    // ORDER ITEM FORM
    // ============================================================

    const renderOrderItemRows = (
        items,
        onItemChange,
        onRemoveItem,
        isEdit = false
    ) => {
        return (
            <div className="tbl-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item, index) => {
                            const product =
                                getProductById(
                                    item.productId
                                );

                            return (
                                <tr
                                    key={
                                        item.orderItemId ||
                                        `new-${index}`
                                    }
                                >
                                    <td>
                                        <select
                                            value={
                                                item.productId
                                            }
                                            onChange={(event) =>
                                                onItemChange(
                                                    index,
                                                    "productId",
                                                    event.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Product
                                            </option>

                                            {products
                                                .filter(
                                                    (product) =>
                                                        product.status ===
                                                        "ACTIVE"
                                                )
                                                .map(
                                                    (
                                                        product
                                                    ) => (
                                                        <option
                                                            key={
                                                                product.productId
                                                            }
                                                            value={
                                                                product.productId
                                                            }
                                                        >
                                                            {
                                                                product.productName
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                product.size
                                                            }
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                    </td>

                                    <td>
                                        <input
                                            type="text"
                                            value={
                                                product?.size ||
                                                ""
                                            }
                                            readOnly
                                            placeholder="-"
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={
                                                item.orderedQuantity
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                onItemChange(
                                                    index,
                                                    "orderedQuantity",
                                                    event.target.value
                                                )
                                            }
                                            required
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                item.unitSellingPrice
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                onItemChange(
                                                    index,
                                                    "unitSellingPrice",
                                                    event.target.value
                                                )
                                            }
                                            required
                                        />
                                    </td>

                                    <td>
                                        <strong>
                                            {formatCurrency(
                                                calculateItemAmount(
                                                    item
                                                )
                                            )}
                                        </strong>
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="btn sm"
                                            onClick={() =>
                                                onRemoveItem(
                                                    index
                                                )
                                            }
                                            disabled={
                                                items.length ===
                                                    1 ||
                                                addSaving ||
                                                editSaving
                                            }
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
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
                            Orders
                        </div>

                        <div className="kpi-sub">
                            Manage customer orders and order records
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn primary"
                        onClick={
                            handleOpenAddOrder
                        }
                    >
                        Add Order
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
                            flex: "2 1 320px",
                        }}
                    >
                        <label>
                            Search Orders
                        </label>

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search by customer, order ID, date, status..."
                        />
                    </div>

                    <div
                        className="fld"
                        style={{
                            flex: "1 1 180px",
                        }}
                    >
                        <label htmlFor="orderDateFrom">
                            Date From
                        </label>

                        <input
                            id="orderDateFrom"
                            type="date"
                            value={dateFrom}
                            onChange={(event) => {
                                const value =
                                    event.target.value;

                                setDateFrom(value);

                                if (
                                    dateTo &&
                                    value > dateTo
                                ) {
                                    setDateFilterError(
                                        "From date cannot be later than To date."
                                    );
                                } else {
                                    setDateFilterError("");
                                }
                            }}
                        />
                    </div>

                    <div
                        className="fld"
                        style={{
                            flex: "1 1 180px",
                        }}
                    >
                        <label htmlFor="orderDateTo">
                            Date To
                        </label>

                        <input
                            id="orderDateTo"
                            type="date"
                            value={dateTo}
                            onChange={(event) => {
                                const value =
                                    event.target.value;

                                setDateTo(value);

                                if (
                                    dateFrom &&
                                    dateFrom > value
                                ) {
                                    setDateFilterError(
                                        "From date cannot be later than To date."
                                    );
                                } else {
                                    setDateFilterError("");
                                }
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={() => {
                            setSearchTerm("");
                            setDateFrom("");
                            setDateTo("");
                            setDateFilterError("");
                        }}
                    >
                        Clear
                    </button>
                </div>

                {dateFilterError && (
                    <div
                        className="form-error"
                        style={{
                            marginTop: "12px",
                        }}
                    >
                        {dateFilterError}
                    </div>
                )}
            </div>

            {/* ==================================================
                ORDER LIST
            ================================================== */}

            <div className="card">
                <div className="card-head">
                    <div>
                        <div className="card-title">
                            Order List
                        </div>

                        <div className="kpi-sub">
                            {totalRecords}{" "}
                            {totalRecords === 1
                                ? "record"
                                : "records"}
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="empty-state">
                        <p>
                            Loading orders...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                )}

                {!loading &&
                    !error &&
                    !dateFilterError &&
                    totalRecords === 0 && (
                        <div className="empty-state">
                            <p>
                                {searchTerm.trim()
                                    ? "No orders match your search."
                                    : "No orders found."}
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    !dateFilterError &&
                    totalRecords > 0 && (
                        <div className="tbl-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th
                                            onClick={() =>
                                                handleSort(
                                                    "orderId"
                                                )
                                            }
                                            style={{
                                                cursor: "pointer",
                                            }}
                                        >
                                            ID
                                            {sortKey ===
                                                "orderId" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ↑"
                                                    : " ↓")}
                                        </th>

                                        <th
                                            onClick={() =>
                                                handleSort(
                                                    "customerName"
                                                )
                                            }
                                            style={{
                                                cursor: "pointer",
                                            }}
                                        >
                                            CUSTOMER
                                            {sortKey ===
                                                "customerName" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ↑"
                                                    : " ↓")}
                                        </th>

                                        <th
                                            onClick={() =>
                                                handleSort(
                                                    "orderDate"
                                                )
                                            }
                                            style={{
                                                cursor: "pointer",
                                            }}
                                        >
                                            ORDER DATE
                                            {sortKey ===
                                                "orderDate" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ↑"
                                                    : " ↓")}
                                        </th>

                                        <th
                                            onClick={() =>
                                                handleSort(
                                                    "expectedDeliveryDate"
                                                )
                                            }
                                            style={{
                                                cursor: "pointer",
                                            }}
                                        >
                                            EXPECTED DELIVERY
                                            {sortKey ===
                                                "expectedDeliveryDate" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ↑"
                                                    : " ↓")}
                                        </th>

                                        <th
                                            onClick={() =>
                                                handleSort(
                                                    "orderStatus"
                                                )
                                            }
                                            style={{
                                                cursor: "pointer",
                                            }}
                                        >
                                            STATUS
                                            {sortKey ===
                                                "orderStatus" &&
                                                (sortDirection ===
                                                "asc"
                                                    ? " ↑"
                                                    : " ↓")}
                                        </th>

                                        <th>
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedRecords.map(
                                        (order) => (
                                            <tr
                                                key={
                                                    order.orderId
                                                }
                                            >
                                                <td>
                                                    {
                                                        order.orderId
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {order.customerName ||
                                                            `Customer #${order.customerId}`}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        order.orderDate
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        order.expectedDeliveryDate
                                                    )}
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            order.orderStatus ===
                                                            "COMPLETED"
                                                                ? "badge bg"
                                                                : "badge br"
                                                        }
                                                    >
                                                        {
                                                            order.orderStatus
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="table-actions">
                                                        <button
                                                            type="button"
                                                            className="action-btn view-btn"
                                                            onClick={() =>
                                                                handleViewOrder(
                                                                    order.orderId
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="action-btn edit-btn"
                                                            onClick={() =>
                                                                handleEditOrder(
                                                                    order.orderId
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="action-btn delete-btn"
                                                            onClick={() =>
                                                                handleOpenDeleteOrder(
                                                                    order
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

                            <Pagination
                                currentPage={
                                    currentPage
                                }
                                totalPages={
                                    totalPages
                                }
                                totalRecords={
                                    totalRecords
                                }
                                pageSize={
                                    pageSize
                                }
                                onPageChange={
                                    handlePageChange
                                }
                                onPageSizeChange={
                                    handlePageSizeChange
                                }
                            />
                        </div>
                    )}
            </div>

            {/* ==================================================
                VIEW ORDER / BILL
            ================================================== */}

            <ViewModal
                isOpen={
                    viewLoading ||
                    !!viewError ||
                    !!selectedOrder
                }
                onClose={
                    handleCloseViewOrder
                }
                title="Order Bill"
                subtitle="Customer order and payment details"
                size="lg"
                footer={
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            gap: "8px",
                        }}
                    >
                        {selectedOrder &&
                            Number(
                                selectedOrder.balance || 0
                            ) > 0 && (
                                <button
                                    type="button"
                                    className="btn primary"
                                    onClick={() => {
                                        onOpenPayment({
                                            customerId:
                                                Number(
                                                    selectedOrder.customerId
                                                ),
                                            orderId:
                                                Number(
                                                    selectedOrder.orderId
                                                ),
                                        });
                                    }}
                                >
                                    Collect Payment
                                </button>
                            )}

                        <button
                            type="button"
                            className="btn primary"
                            onClick={
                                handleDownloadOrderPdf
                            }
                        >
                            Download PDF
                        </button>

                        <button
                            type="button"
                            className="btn"
                            onClick={
                                handleCloseViewOrder
                            }
                        >
                            Close
                        </button>
                    </div>
                }
            >
                {viewLoading && (
                    <div className="empty-state">
                        <p>
                            Loading order details...
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
                    selectedOrder && (
                        <>
                            <div className="customer-modal-section">
                                <div className="customer-modal-section-title">
                                    Order Information
                                </div>

                                <DetailGrid>
                                    <DetailItem
                                        label="Customer"
                                        value={
                                            selectedOrder.customerName ||
                                            "-"
                                        }
                                    />

                                    <DetailItem
                                        label="Order Number"
                                        value={
                                            selectedOrder.orderId
                                        }
                                    />

                                    <DetailItem
                                        label="Order Date"
                                        value={formatDate(
                                            selectedOrder.orderDate
                                        )}
                                    />

                                    <DetailItem
                                        label="Expected Delivery"
                                        value={formatDate(
                                            selectedOrder.expectedDeliveryDate
                                        )}
                                    />
                                </DetailGrid>
                            </div>

                            <div className="customer-modal-section">
                                <div className="customer-modal-section-title">
                                    Order Items
                                </div>

                                {selectedOrder.items &&
                                selectedOrder.items.length >
                                    0 ? (
                                    <div className="tbl-wrap">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        Product
                                                    </th>
                                                    <th>
                                                        Size
                                                    </th>
                                                    <th>
                                                        Qty
                                                    </th>
                                                    <th>
                                                        Rate
                                                    </th>
                                                    <th>
                                                        Amount
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {selectedOrder.items.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={`${item.productId}-${index}`}
                                                        >
                                                            <td>
                                                                {
                                                                    item.productName
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    item.productSize
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    item.orderedQuantity
                                                                }
                                                            </td>

                                                            <td>
                                                                {formatCurrency(
                                                                    item.unitSellingPrice
                                                                )}
                                                            </td>

                                                            <td>
                                                                <strong>
                                                                    {formatCurrency(
                                                                        item.amount
                                                                    )}
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>

                                            <tfoot>
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        style={{
                                                            textAlign:
                                                                "right",
                                                        }}
                                                    >
                                                        <strong>
                                                            Total
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {formatCurrency(
                                                                selectedOrder.totalAmount
                                                            )}
                                                        </strong>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <p>
                                            No order items found.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="customer-modal-section">
                                <div className="customer-modal-section-title">
                                    Payment Summary
                                </div>

                                <DetailGrid>
                                    <DetailItem
                                        label="Payment Status"
                                        value={
                                            selectedOrder.paymentStatus ||
                                            "PENDING"
                                        }
                                    />

                                    <DetailItem
                                        label="Total Amount"
                                        value={formatCurrency(
                                            selectedOrder.totalAmount
                                        )}
                                    />

                                    <DetailItem
                                        label="Paid Amount"
                                        value={formatCurrency(
                                            selectedOrder.paidAmount
                                        )}
                                    />

                                    <DetailItem
                                        label="Balance"
                                        value={formatCurrency(
                                            selectedOrder.balance
                                        )}
                                    />
                                </DetailGrid>
                            </div>

                            <div className="customer-modal-section">
                                <div className="customer-modal-section-title">
                                    Additional Information
                                </div>

                                <DetailGrid>
                                    <DetailItem
                                        label="Order Status"
                                        value={
                                            selectedOrder.orderStatus ||
                                            "-"
                                        }
                                    />

                                    <DetailItem
                                        label="Remarks"
                                        value={
                                            selectedOrder.remarks ||
                                            "-"
                                        }
                                        fullWidth
                                    />
                                </DetailGrid>
                            </div>
                        </>
                    )}
            </ViewModal>

            {/* ==================================================
                ADD ORDER MODAL
            ================================================== */}

            <FormModal
                isOpen={showAddOrder}
                onClose={
                    handleCloseAddOrder
                }
                title="Add Order"
                subtitle="Create a customer order with order items"
                onSubmit={
                    handleCreateOrder
                }
                submitLabel="Create Order"
                formId="skcp-form-add-order"
                cancelLabel="Cancel"
                saving={addSaving}
                error={
                    addError ||
                    masterError
                }
                success={addSuccess}
                size="lg"
            >
                <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                        Order Information
                    </div>

                    <div className="form-grid">
                        <div className="fld">
                            <label>
                                Customer *
                            </label>

                            <select
                                name="customerId"
                                value={
                                    addForm.customerId
                                }
                                onChange={
                                    handleAddFormChange
                                }
                                required
                                disabled={
                                    masterLoading
                                }
                            >
                                <option value="">
                                    {masterLoading
                                        ? "Loading customers..."
                                        : "Select Customer"}
                                </option>

                                {customers
                                    .filter(
                                        (customer) =>
                                            customer.status ===
                                            "ACTIVE"
                                    )
                                    .map(
                                        (customer) => (
                                            <option
                                                key={
                                                    customer.customerId
                                                }
                                                value={
                                                    customer.customerId
                                                }
                                            >
                                                {
                                                    customer.customerName
                                                }
                                            </option>
                                        )
                                    )}
                            </select>

                            <button
                                type="button"
                                className="btn sm"
                                style={{
                                    marginTop:
                                        "8px",
                                }}
                                onClick={() =>
                                    setShowAddCustomerModal(
                                        true
                                    )
                                }
                            >
                                Add Customer
                            </button>
                        </div>

                        <div className="fld">
                            <label>
                                Order Date *
                            </label>

                            <input
                                name="orderDate"
                                type="date"
                                value={
                                    addForm.orderDate
                                }
                                onChange={
                                    handleAddFormChange
                                }
                                required
                            />
                        </div>

                        <div className="fld">
                            <label>
                                Expected Delivery Date
                            </label>

                            <input
                                name="expectedDeliveryDate"
                                type="date"
                                value={
                                    addForm.expectedDeliveryDate
                                }
                                onChange={
                                    handleAddFormChange
                                }
                            />
                        </div>

                        <div className="fld">
                            <label>
                                Transport *
                            </label>

                            <select
                                name="transportMode"
                                value={
                                    addForm.transportMode
                                }
                                onChange={
                                    handleAddFormChange
                                }
                                required
                            >
                                <option value="">
                                    Select Transport
                                </option>

                                <option value="OWN">
                                    Own Transport
                                </option>

                                <option value="CUSTOMER">
                                    Customer Transport
                                </option>

                                <option value="THIRD_PARTY">
                                    Third-Party Transport
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                            }}
                        >
                            <span>
                                Order Items
                            </span>

                            <button
                                type="button"
                                className="btn sm"
                                onClick={
                                    handleAddItem
                                }
                            >
                                Add Item
                            </button>
                        </div>
                    </div>

                    {renderOrderItemRows(
                        addItems,
                        handleAddItemChange,
                        handleRemoveAddItem
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            marginTop: "16px",
                            fontSize: "16px",
                        }}
                    >
                        <strong>
                            Order Total:&nbsp;
                            {formatCurrency(
                                addOrderTotal
                            )}
                        </strong>
                    </div>
                </div>

                <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                        Additional Information
                    </div>

                    <div className="form-grid">
                        <div className="fld f-full">
                            <label>
                                Remarks
                            </label>

                            <textarea
                                name="remarks"
                                value={
                                    addForm.remarks
                                }
                                onChange={
                                    handleAddFormChange
                                }
                                maxLength={500}
                            />
                        </div>
                    </div>
                </div>
            </FormModal>

            <AddCustomerModal
                isOpen={
                    showAddCustomerModal
                }
                onClose={() =>
                    setShowAddCustomerModal(
                        false
                    )
                }
                onCustomerCreated={(createdCustomer) => {
                    const normalizedCustomer = {
                        ...createdCustomer,
                        status:
                            createdCustomer.status ||
                            "ACTIVE",
                    };

                    setCustomers((previous) => {
                        const exists =
                            previous.some(
                                (customer) =>
                                    Number(
                                        customer.customerId
                                    ) ===
                                    Number(
                                        normalizedCustomer.customerId
                                    )
                            );

                        if (exists) {
                            return previous;
                        }

                        return [
                            ...previous,
                            normalizedCustomer,
                        ];
                    });

                    setAddForm((previous) => ({
                        ...previous,
                        customerId:
                            String(
                                normalizedCustomer.customerId
                            ),
                    }));
                }}
            />

            {/* ==================================================
                EDIT ORDER MODAL
            ================================================== */}

            <FormModal
                isOpen={
                    editLoading ||
                    !!editError ||
                    !!editingOrder
                }
                onClose={
                    handleCloseEditOrder
                }
                title="Edit Order"
                subtitle="Update order and order items"
                onSubmit={
                    handleUpdateOrder
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
                            Loading order details...
                        </p>
                    </div>
                )}

                {!editLoading &&
                    editingOrder && (
                        <>
                            <div className="customer-modal-section">
                                <div className="customer-modal-section-title">
                                    Order Information
                                </div>

                                <div className="form-grid">
                                    <div className="fld">
                                        <label>
                                            Customer *
                                        </label>

                                        <select
                                            name="customerId"
                                            value={
                                                editForm.customerId
                                            }
                                            onChange={
                                                handleEditFormChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Customer
                                            </option>

                                            {customers
                                                .filter(
                                                    (
                                                        customer
                                                    ) =>
                                                        customer.status ===
                                                        "ACTIVE"
                                                )
                                                .map(
                                                    (
                                                        customer
                                                    ) => (
                                                        <option
                                                            key={
                                                                customer.customerId
                                                            }
                                                            value={
                                                                customer.customerId
                                                            }
                                                        >
                                                            {
                                                                customer.customerName
                                                            }
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Order Date *
                                        </label>

                                        <input
                                            name="orderDate"
                                            type="date"
                                            value={
                                                editForm.orderDate
                                            }
                                            onChange={
                                                handleEditFormChange
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Expected Delivery Date
                                        </label>

                                        <input
                                            name="expectedDeliveryDate"
                                            type="date"
                                            value={
                                                editForm.expectedDeliveryDate
                                            }
                                            onChange={
                                                handleEditFormChange
                                            }
                                        />
                                    </div>

                                    <div className="fld">
                                        <label>
                                            Order Status
                                        </label>

                                        <select
                                            value={
                                                editOrderStatus
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setEditOrderStatus(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        >
                                            {ORDER_STATUSES.map(
                                                (
                                                    status
                                                ) => (
                                                    <option
                                                        key={
                                                            status
                                                        }
                                                        value={
                                                            status
                                                        }
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="customer-modal-section">
                                <div className="customer-modal-section-title">
                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                        }}
                                    >
                                        <span>
                                            Order Items
                                        </span>

                                        <button
                                            type="button"
                                            className="btn sm"
                                            onClick={
                                                handleAddEditItem
                                            }
                                        >
                                            Add Item
                                        </button>
                                    </div>
                                </div>

                                {renderOrderItemRows(
                                    editItems,
                                    handleEditItemChange,
                                    handleRemoveEditItem,
                                    true
                                )}

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "flex-end",
                                        marginTop:
                                            "16px",
                                        fontSize:
                                            "16px",
                                    }}
                                >
                                    <strong>
                                        Order Total:&nbsp;
                                        {formatCurrency(
                                            editOrderTotal
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <div className="customer-modal-section">
                                <div className="customer-modal-section-title">
                                    Additional Information
                                </div>

                                <div className="form-grid">
                                    <div className="fld f-full">
                                        <label>
                                            Remarks
                                        </label>

                                        <textarea
                                            name="remarks"
                                            value={
                                                editForm.remarks
                                            }
                                            onChange={
                                                handleEditFormChange
                                            }
                                            maxLength={
                                                500
                                            }
                                        />
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
                    !!deletingOrder
                }
                onClose={
                    handleCloseDeleteOrder
                }
                onConfirm={
                    handleConfirmDelete
                }
                title="Delete Order"
                subtitle="Deactivate order record"
                message="Are you sure you want to delete this order?"
                itemName={
                    deletingOrder
                        ? `Order #${deletingOrder.orderId}`
                        : ""
                }
                confirming={
                    deleteSaving
                }
                error={
                    deleteError
                }
            />
        </section>
    );
}

export default Order;