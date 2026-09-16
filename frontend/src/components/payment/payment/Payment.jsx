import React, { useEffect, useMemo, useState } from "react";
import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import {
    DetailGrid,
    DetailItem,
} from "../../ui/common/DetailGrid";

import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
} from "../../../services/api";



const PAYMENT_MODES = [
    "CASH",
    "UPI",
    "BANK_TRANSFER",
    "CHEQUE",
];

const initialFormData = {
    customerId: "",
    paymentDate: "",
    totalAmountReceived: "",
    paymentMode: "CASH",
    referenceNumber: "",
    receivedBy: "",
    remarks: "",
};

const formatDate = (dateValue) =>
    dateValue
        ? new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "-";

const formatDateTime = (dateValue) =>
    dateValue ? new Date(dateValue).toLocaleString() : "-";

const formatCurrency = (amount) =>
    `₹ ${Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;



function Payment() {
    const [payments, setPayments] = useState([]);
    const [allocations, setAllocations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedAllocations, setSelectedAllocations] = useState([]);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");

    const [showFormModal, setShowFormModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchPaymentsAndAllocations = async () => {
        setLoading(true);
        setError("");

        try {
            const [paymentsData, allocationsData] =
                await Promise.all([
                    apiGet("/api/payments"),
                    apiGet("/api/payment-allocations"),
                ]);

            const paymentList = Array.isArray(paymentsData)
                ? paymentsData
                : Array.isArray(paymentsData?.data)
                ? paymentsData.data
                : [];

            const allocationList = Array.isArray(allocationsData)
                ? allocationsData
                : Array.isArray(allocationsData?.data)
                ? allocationsData.data
                : [];

            setPayments(paymentList);
            setAllocations(allocationList);
        } catch (err) {
            setError(
                err.message || "Failed to load payment records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentsAndAllocations();
    }, []);

    const getActiveAllocationsForPayment = (paymentId) =>
        allocations.filter(
            (allocation) =>
                Number(allocation.paymentId) === Number(paymentId) &&
                allocation.recordStatus === "ACTIVE"
        );

    const getTotalAllocated = (paymentId) =>
        getActiveAllocationsForPayment(paymentId).reduce(
            (total, allocation) =>
                total + Number(allocation.allocatedAmount || 0),
            0
        );

    const getUnallocatedAmount = (payment) =>
        Number(payment.totalAmountReceived || 0) -
        getTotalAllocated(payment.paymentId);

    const filteredPayments = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            return payments;
        }

        return payments.filter((payment) => {
            const searchableText = [
                payment.paymentId,
                payment.customerId,
                payment.paymentDate,
                payment.totalAmountReceived,
                payment.paymentMode,
                payment.receivedBy,
                payment.recordStatus,
            ]
                .filter(
                    (value) => value !== null && value !== undefined
                )
                .join(" ")
                .toLowerCase();

            return searchableText.includes(term);
        });
    }, [payments, searchTerm]);

    const handleView = async (payment) => {
        setViewLoading(true);
        setViewError("");
        setSelectedPayment(null);
        setSelectedAllocations([]);

        try {
    const paymentResponse = await apiGet(
        `/api/payments/${payment.paymentId}`
    );

    const paymentData = Array.isArray(paymentResponse)
        ? paymentResponse[0]
        : paymentResponse?.data || paymentResponse;

    setSelectedPayment(paymentData);

    setSelectedAllocations(
        getActiveAllocationsForPayment(payment.paymentId)
    );
        } catch (err) {
            setViewError(
                err.message || "Failed to load payment details."
            );
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        setSelectedPayment(null);
        setSelectedAllocations([]);
        setViewError("");
    };

    const handleAdd = () => {
        setEditingPayment(null);
        setFormData(initialFormData);
        setFormError("");
        setFormSuccess("");
        setShowFormModal(true);
    };

    const handleEdit = async (payment) => {
        setFormError("");
        setFormSuccess("");
        setEditingPayment(payment);
        setShowFormModal(true);

        try {
            const paymentResponse = await apiGet(
                `/api/payments/${payment.paymentId}`
            );

            const paymentData = Array.isArray(paymentResponse)
                ? paymentResponse[0]
                : paymentResponse?.data || paymentResponse;

            setFormData({
                customerId: paymentData.customerId ?? "",
                paymentDate: paymentData.paymentDate ?? "",
                totalAmountReceived:
                    paymentData.totalAmountReceived ?? "",
                paymentMode: paymentData.paymentMode ?? "CASH",
                referenceNumber:
                    paymentData.referenceNumber ?? "",
                receivedBy: paymentData.receivedBy ?? "",
                remarks: paymentData.remarks ?? "",
            });
        } catch (err) {
            setFormError(
                err.message || "Failed to load payment details."
            );
        }
    };

    const closeFormModal = () => {
        if (saving) {
            return;
        }

        setShowFormModal(false);
        setEditingPayment(null);
        setFormData(initialFormData);
        setFormError("");
        setFormSuccess("");
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const customerId = Number(formData.customerId);
        const totalAmountReceived = Number(
            formData.totalAmountReceived
        );

        if (!formData.customerId || customerId <= 0) {
            return "Customer ID is required and must be greater than 0.";
        }

        if (!formData.paymentDate) {
            return "Payment date is required.";
        }

        if (
            !formData.totalAmountReceived ||
            totalAmountReceived <= 0
        ) {
            return "Total amount received is required and must be greater than 0.";
        }

        if (!PAYMENT_MODES.includes(formData.paymentMode)) {
            return "Please select a valid payment mode.";
        }

        if (!formData.receivedBy.trim()) {
            return "Received by is required.";
        }

        if (formData.receivedBy.trim().length > 100) {
            return "Received by cannot exceed 100 characters.";
        }

        if (formData.referenceNumber.trim().length > 100) {
            return "Reference number cannot exceed 100 characters.";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");
        setFormSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setFormError(validationError);
            return;
        }

        const payload = {
            customerId: Number(formData.customerId),
            paymentDate: formData.paymentDate,
            totalAmountReceived: Number(
                formData.totalAmountReceived
            ),
            paymentMode: formData.paymentMode,
            referenceNumber:
                formData.referenceNumber.trim() === ""
                    ? null
                    : formData.referenceNumber.trim(),
            receivedBy: formData.receivedBy.trim(),
            remarks:
                formData.remarks.trim() === ""
                    ? null
                    : formData.remarks.trim(),
        };

        setSaving(true);

        try {
            const isEditing = !!editingPayment;

            if (isEditing) {
                await apiPut(
                    `/api/payments/${editingPayment.paymentId}`,
                    payload
                );
            } else {
                await apiPost("/api/payments", payload);
            }
            setFormSuccess(
                isEditing
                    ? "Payment updated successfully."
                    : "Payment created successfully."
            );

            await fetchPaymentsAndAllocations();

            setTimeout(() => {
                setShowFormModal(false);
                setEditingPayment(null);
                setFormData(initialFormData);
                setFormError("");
                setFormSuccess("");
            }, 700);
        } catch (err) {
            setFormError(
                err.message ||
                    (editingPayment
                        ? "Failed to update payment."
                        : "Failed to create payment.")
            );
        } finally {
            setSaving(false);
        }
    };

    const openDeleteModal = (payment) => {
        setDeletingId(payment.paymentId);
    };

    const closeDeleteModal = () => {
        if (deleting) {
            return;
        }

        setDeletingId(null);
    };

    const confirmDelete = async () => {
        if (!deletingId) {
            return;
        }

        setDeleting(true);
        setError("");

        try {
            await apiDelete(`/api/payments/${deletingId}`);

            setDeletingId(null);

            await fetchPaymentsAndAllocations();
        } catch (err) {
            setError(
                err.message || "Failed to delete payment."
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <h2>Payments</h2>
                    <p>Loading payment records...</p>
                </section>
            </div>
        );
    }

    return (
        <div className="page">
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
                        <h2>Payments</h2>
                        <p>Manage customer payment records.</p>
                    </div>

                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={handleAdd}
                    >
                        Add Payment
                    </button>
                </div>

                <div className="fld production-search">
                    <label>Search Payments</label>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        placeholder="Search by payment ID, customer ID, mode..."
                    />
                </div>
            </section>

            <section className="card">
                <h2>Payment List</h2>

                <p>
                    {filteredPayments.length} payment
                    {filteredPayments.length === 1 ? "" : "s"}
                </p>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {filteredPayments.length === 0 ? (
                    <p>No payment records found.</p>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>CUSTOMER ID</th>
                                    <th>PAYMENT DATE</th>
                                    <th>AMOUNT</th>
                                    <th>PAYMENT MODE</th>
                                    <th>RECEIVED BY</th>
                                    <th>ALLOCATED</th>
                                    <th>UNALLOCATED</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPayments.map((payment) => {
                                    const totalAllocated =
                                        getTotalAllocated(
                                            payment.paymentId
                                        );

                                    const unallocatedAmount =
                                        getUnallocatedAmount(payment);

                                    return (
                                        <tr
                                            key={
                                                payment.paymentId
                                            }
                                        >
                                            <td>
                                                {
                                                    payment.paymentId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    payment.customerId
                                                }
                                            </td>

                                            <td>
                                                {formatDate(
                                                    payment.paymentDate
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    payment.totalAmountReceived
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    payment.paymentMode
                                                }
                                            </td>

                                            <td>
                                                {
                                                    payment.receivedBy
                                                }
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    totalAllocated
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    unallocatedAmount
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    payment.recordStatus
                                                }
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        type="button"
                                                        className="action-btn view-btn"
                                                        onClick={() =>
                                                            handleView(
                                                                payment
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                payment
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-btn delete-btn"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                payment
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <ViewModal
                isOpen={!!selectedPayment || viewLoading || !!viewError}
                onClose={closeViewModal}
                title="Payment Details"
                subtitle={
                    selectedPayment
                        ? `Payment ID: ${selectedPayment.paymentId}`
                        : "Payment information"
                }
                loading={viewLoading}
                error={viewError}
                size="lg"
                footer={
                    <button
                        type="button"
                        className="btn"
                        onClick={closeViewModal}
                    >
                        Close
                    </button>
                }
            >
                {selectedPayment && !viewLoading && (
                    <>
                        <DetailGrid>
                            <DetailItem
                                label="Payment ID"
                                value={
                                    selectedPayment.paymentId
                                }
                            />

                            <DetailItem
                                label="Customer ID"
                                value={
                                    selectedPayment.customerId
                                }
                            />

                            <DetailItem
                                label="Payment Date"
                                value={formatDate(
                                    selectedPayment.paymentDate
                                )}
                            />

                            <DetailItem
                                label="Total Amount Received"
                                value={formatCurrency(
                                    selectedPayment.totalAmountReceived
                                )}
                            />

                            <DetailItem
                                label="Total Allocated"
                                value={formatCurrency(
                                    getTotalAllocated(
                                        selectedPayment.paymentId
                                    )
                                )}
                            />

                            <DetailItem
                                label="Unallocated Amount"
                                value={formatCurrency(
                                    Number(
                                        selectedPayment.totalAmountReceived ||
                                            0
                                    ) -
                                        getTotalAllocated(
                                            selectedPayment.paymentId
                                        )
                                )}
                            />

                            <DetailItem
                                label="Payment Mode"
                                value={
                                    selectedPayment.paymentMode
                                }
                            />

                            <DetailItem
                                label="Reference Number"
                                value={
                                    selectedPayment.referenceNumber ||
                                    "-"
                                }
                            />

                            <DetailItem
                                label="Received By"
                                value={
                                    selectedPayment.receivedBy ||
                                    "-"
                                }
                            />

                            <DetailItem
                                label="Record Status"
                                value={
                                    selectedPayment.recordStatus
                                }
                            />

                            <DetailItem
                                label="Created At"
                                value={formatDateTime(
                                    selectedPayment.createdAt
                                )}
                            />

                            <DetailItem
                                label="Remarks"
                                value={
                                    selectedPayment.remarks ||
                                    "-"
                                }
                            />
                        </DetailGrid>

                        <div style={{ marginTop: "24px" }}>
                            <h3>Payment Allocations</h3>

                            <p>
                                {selectedAllocations.length} active
                                allocation
                                {selectedAllocations.length === 1
                                    ? ""
                                    : "s"}
                            </p>

                            {selectedAllocations.length === 0 ? (
                                <p>
                                    No active payment allocations
                                    found.
                                </p>
                            ) : (
                                <div className="table-wrap">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>
                                                    ALLOCATION ID
                                                </th>
                                                <th>ORDER ID</th>
                                                <th>
                                                    ALLOCATION DATE
                                                </th>
                                                <th>
                                                    ALLOCATED AMOUNT
                                                </th>
                                                <th>STATUS</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {selectedAllocations.map(
                                                (
                                                    allocation
                                                ) => (
                                                    <tr
                                                        key={
                                                            allocation.paymentAllocationId
                                                        }
                                                    >
                                                        <td>
                                                            {
                                                                allocation.paymentAllocationId
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                allocation.orderId
                                                            }
                                                        </td>

                                                        <td>
                                                            {formatDate(
                                                                allocation.allocationDate
                                                            )}
                                                        </td>

                                                        <td>
                                                            {formatCurrency(
                                                                allocation.allocatedAmount
                                                            )}
                                                        </td>

                                                        <td>
                                                            {
                                                                allocation.recordStatus
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </ViewModal>

            <FormModal
                isOpen={showFormModal}
                onClose={closeFormModal}
                title={
                    editingPayment
                        ? "Edit Payment"
                        : "Add Payment"
                }
                subtitle={
                    editingPayment
                        ? `Update Payment ID: ${editingPayment.paymentId}`
                        : "Enter customer payment details."
                }
                onSubmit={handleSubmit}
                submitLabel={
                    editingPayment
                        ? "Update Payment"
                        : "Add Payment"
                }
                cancelLabel="Cancel"
                saving={saving}
                error={formError}
                success={formSuccess}
                size="lg"
            >
                <div className="edit-form-grid">
                    <div className="fld">
                        <label htmlFor="customerId">
                            Customer ID
                        </label>

                        <input
                            id="customerId"
                            name="customerId"
                            type="number"
                            min="1"
                            value={formData.customerId}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="paymentDate">
                            Payment Date
                        </label>

                        <input
                            id="paymentDate"
                            name="paymentDate"
                            type="date"
                            value={formData.paymentDate}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="totalAmountReceived">
                            Total Amount Received
                        </label>

                        <input
                            id="totalAmountReceived"
                            name="totalAmountReceived"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={
                                formData.totalAmountReceived
                            }
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="paymentMode">
                            Payment Mode
                        </label>

                        <select
                            id="paymentMode"
                            name="paymentMode"
                            value={formData.paymentMode}
                            onChange={handleFormChange}
                            required
                        >
                            {PAYMENT_MODES.map((mode) => (
                                <option
                                    key={mode}
                                    value={mode}
                                >
                                    {mode}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="fld">
                        <label htmlFor="referenceNumber">
                            Reference Number
                        </label>

                        <input
                            id="referenceNumber"
                            name="referenceNumber"
                            type="text"
                            maxLength="100"
                            value={
                                formData.referenceNumber
                            }
                            onChange={handleFormChange}
                            placeholder="Optional"
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="receivedBy">
                            Received By
                        </label>

                        <input
                            id="receivedBy"
                            name="receivedBy"
                            type="text"
                            maxLength="100"
                            value={formData.receivedBy}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div className="fld">
                        <label htmlFor="recordStatus">
                            Record Status
                        </label>

                        <input
                            id="recordStatus"
                            type="text"
                            value="ACTIVE"
                            disabled
                        />

                        <small>
                            Payment records are managed using
                            soft-delete status.
                        </small>
                    </div>

                    <div className="fld edit-full">
                        <label htmlFor="remarks">
                            Remarks
                        </label>

                        <textarea
                            id="remarks"
                            name="remarks"
                            rows="4"
                            value={formData.remarks}
                            onChange={handleFormChange}
                            placeholder="Optional remarks"
                        />
                    </div>
                </div>
            </FormModal>

            <DeleteConfirmModal
                isOpen={!!deletingId}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Payment"
                subtitle="Please confirm this action"
                message="Are you sure you want to delete this payment?"
                itemName={
                    deletingId
                        ? `Payment ID: ${deletingId}`
                        : ""
                }
                confirming={deleting}
                error=""
            />
        </div>
    );
}

export default Payment;