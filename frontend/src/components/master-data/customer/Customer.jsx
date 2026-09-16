import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../../../services/api";

import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import { DetailGrid, DetailItem } from "../../ui/common/DetailGrid";

const initialForm = {
  customerName: "",
  mobileNumber: "",
  alternateMobile: "",
  address: "",
  village: "",
  city: "",
  pincode: "",
  gstNumber: "",
  remarks: "",
};

function Customer() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------------------------------------------
  // VIEW
  // ---------------------------------------------------------------------------

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  // ---------------------------------------------------------------------------
  // ADD
  // ---------------------------------------------------------------------------

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [addForm, setAddForm] = useState(initialForm);
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  // ---------------------------------------------------------------------------
  // EDIT
  // ---------------------------------------------------------------------------

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ---------------------------------------------------------------------------
  // INITIAL LOAD
  // ---------------------------------------------------------------------------

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ---------------------------------------------------------------------------
  // GET ALL CUSTOMERS
  // ---------------------------------------------------------------------------

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiGet("/api/customers");

      setCustomers(result?.data || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------------------------

  const filteredCustomers = customers.filter((customer) => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return (
      String(customer.customerName || "")
        .toLowerCase()
        .includes(keyword) ||
      String(customer.mobileNumber || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  // ---------------------------------------------------------------------------
  // FORM HELPERS
  // ---------------------------------------------------------------------------

  const handleAddFormChange = (event) => {
    const { name, value } = event.target;

    setAddForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetAddForm = () => {
    setAddForm(initialForm);
    setAddError("");
    setAddSuccess("");
  };

  const resetEditForm = () => {
    setEditForm(initialForm);
    setEditError("");
    setEditSuccess("");
  };

  // ---------------------------------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------------------------------

  const validateCustomerForm = (form) => {
    if (!form.customerName.trim()) {
      return "Customer name is required.";
    }

    if (!form.mobileNumber.trim()) {
      return "Mobile number is required.";
    }

    return "";
  };

  const buildCustomerPayload = (form) => ({
    customerName: form.customerName.trim(),
    mobileNumber: form.mobileNumber.trim(),
    alternateMobile: form.alternateMobile.trim() || null,
    address: form.address.trim() || null,
    village: form.village.trim() || null,
    city: form.city.trim() || null,
    pincode: form.pincode.trim() || null,
    gstNumber: form.gstNumber.trim() || null,
    remarks: form.remarks.trim() || null,
  });

  // ---------------------------------------------------------------------------
  // VIEW CUSTOMER
  // ---------------------------------------------------------------------------

  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(null);
    setViewError("");
    setViewLoading(true);

    try {
      const result = await apiGet(
        `/api/customers/${customer.customerId}`
      );

      setSelectedCustomer(result?.data || null);
    } catch (err) {
      console.error("Error fetching customer details:", err);
      setViewError(err.message || "Failed to load customer details.");
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => {
    if (viewLoading) {
      return;
    }

    setSelectedCustomer(null);
    setViewError("");
  };

  // ---------------------------------------------------------------------------
  // OPEN ADD
  // ---------------------------------------------------------------------------

  const openAddCustomerModal = () => {
    resetAddForm();
    setShowAddCustomerModal(true);
  };

  const closeAddCustomerModal = () => {
    if (addSaving) {
      return;
    }

    setShowAddCustomerModal(false);
    resetAddForm();
  };

  // ---------------------------------------------------------------------------
  // CREATE CUSTOMER
  // ---------------------------------------------------------------------------

  const handleCreateCustomer = async (event) => {
    event.preventDefault();

    const validationError = validateCustomerForm(addForm);

    if (validationError) {
      setAddError(validationError);
      return;
    }

    try {
      setAddSaving(true);
      setAddError("");
      setAddSuccess("");

      const payload = buildCustomerPayload(addForm);

      const result = await apiPost("/api/customers", payload);

      setAddSuccess(
        result?.message || "Customer created successfully."
      );

      await fetchCustomers();

      setTimeout(() => {
        setShowAddCustomerModal(false);
        resetAddForm();
      }, 700);
    } catch (err) {
      console.error("Error creating customer:", err);
      setAddError(err.message || "Failed to create customer.");
    } finally {
      setAddSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // OPEN EDIT
  // ---------------------------------------------------------------------------

  const handleEditCustomer = async (customer) => {
    setEditingCustomer(customer);
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");

    try {
      const result = await apiGet(
        `/api/customers/${customer.customerId}`
      );

      const data = result?.data;

      if (!data) {
        throw new Error("Customer details were not found.");
      }

      setEditingCustomer(data);

      setEditForm({
        customerName: data.customerName || "",
        mobileNumber: data.mobileNumber || "",
        alternateMobile: data.alternateMobile || "",
        address: data.address || "",
        village: data.village || "",
        city: data.city || "",
        pincode: data.pincode || "",
        gstNumber: data.gstNumber || "",
        remarks: data.remarks || "",
      });
    } catch (err) {
      console.error("Error fetching customer for edit:", err);
      setEditError(err.message || "Failed to load customer details.");
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditCustomerModal = () => {
    if (editSaving) {
      return;
    }

    setEditingCustomer(null);
    resetEditForm();
  };

  // ---------------------------------------------------------------------------
  // UPDATE CUSTOMER
  // ---------------------------------------------------------------------------

  const handleUpdateCustomer = async (event) => {
    event.preventDefault();

    const validationError = validateCustomerForm(editForm);

    if (validationError) {
      setEditError(validationError);
      return;
    }

    if (!editingCustomer?.customerId) {
      setEditError("Customer ID is missing.");
      return;
    }

    try {
      setEditSaving(true);
      setEditError("");
      setEditSuccess("");

      const payload = buildCustomerPayload(editForm);

      const result = await apiPut(
        `/api/customers/${editingCustomer.customerId}`,
        payload
      );

      setEditSuccess(
        result?.message || "Customer updated successfully."
      );

      await fetchCustomers();

      setTimeout(() => {
        setEditingCustomer(null);
        resetEditForm();
      }, 700);
    } catch (err) {
      console.error("Error updating customer:", err);
      setEditError(err.message || "Failed to update customer.");
    } finally {
      setEditSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // DELETE CUSTOMER
  // ---------------------------------------------------------------------------

  const handleDeleteCustomer = (customer) => {
    setDeletingCustomer(customer);
    setDeleteError("");
  };

  const closeDeleteCustomerModal = () => {
    if (deleteSaving) {
      return;
    }

    setDeletingCustomer(null);
    setDeleteError("");
  };

  const confirmDeleteCustomer = async () => {
    if (!deletingCustomer?.customerId) {
      setDeleteError("Customer ID is missing.");
      return;
    }

    try {
      setDeleteSaving(true);
      setDeleteError("");

      await apiDelete(
        `/api/customers/${deletingCustomer.customerId}`
      );

      await fetchCustomers();

      setDeletingCustomer(null);
    } catch (err) {
      console.error("Error deleting customer:", err);
      setDeleteError(err.message || "Failed to delete customer.");
    } finally {
      setDeleteSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // DISPLAY HELPERS
  // ---------------------------------------------------------------------------

  const formatCreatedAt = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  };

  const getStatusLabel = (customer) => {
    const status = String(customer?.status || "").toUpperCase();

    return status || "—";
  };

  const getStatusClass = (customer) => {
    const status = String(customer?.status || "").toUpperCase();

    return status === "ACTIVE" ? "bg" : "br";
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <section className="section active">
      {/* ================================================================== */}
      {/* PAGE HEADER */}
      {/* ================================================================== */}

      <div className="card-head customer-page-header">
        <div>
          <h2>Customers</h2>
          <p>Manage customer information and records.</p>
        </div>

        <button
          type="button"
          className="btn primary"
          onClick={openAddCustomerModal}
        >
          + Add Customer
        </button>
      </div>

      {/* ================================================================== */}
      {/* SEARCH */}
      {/* ================================================================== */}

      <div className="fld customer-search">
        <label htmlFor="customer-search">
          Search Customers
        </label>

        <input
          id="customer-search"
          type="text"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="Search by customer name or mobile..."
        />
      </div>

      {/* ================================================================== */}
      {/* CUSTOMER LIST */}
      {/* ================================================================== */}

      <div className="card">
        <div className="card-head">
          <div>
            <h3>Customer List</h3>
            <p>
              {filteredCustomers.length} customer
              {filteredCustomers.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {loading && (
          <div className="empty-state">
            <p>Loading customers...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert e show">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredCustomers.length === 0 && (
            <div className="empty-state">
              <p>
                {searchKeyword
                  ? "No customers match your search."
                  : "No customers found."}
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredCustomers.length > 0 && (
            <div className="table-wrap">
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
                      <td>{customer.customerId}</td>

                      <td>
                        <strong>
                          {customer.customerName || "—"}
                        </strong>
                      </td>

                      <td>
                        {customer.mobileNumber || "—"}
                      </td>

                      <td>
                        {customer.village || "—"}
                      </td>

                      <td>
                        {customer.city || "—"}
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            customer
                          )}`}
                        >
                          {getStatusLabel(customer)}
                        </span>
                      </td>

                      <td>
                        <div className="customer-action-buttons">
                          <button
                            type="button"
                            className="btn sm"
                            onClick={() =>
                              handleViewCustomer(customer)
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="btn sm customer-edit-btn"
                            onClick={() =>
                              handleEditCustomer(customer)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn sm customer-delete-btn"
                            onClick={() =>
                              handleDeleteCustomer(customer)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* ================================================================== */}
      {/* VIEW CUSTOMER */}
      {/* ================================================================== */}

      <ViewModal
        isOpen={
          Boolean(selectedCustomer) ||
          viewLoading ||
          Boolean(viewError)
        }
        onClose={closeViewModal}
        title="Customer Details"
        subtitle="View customer information"
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
        {selectedCustomer && (
          <DetailGrid>
            <DetailItem
              label="Customer ID"
              value={selectedCustomer.customerId}
            />

            <DetailItem
              label="Customer Name"
              value={selectedCustomer.customerName}
            />

            <DetailItem
              label="Mobile Number"
              value={selectedCustomer.mobileNumber}
            />

            <DetailItem
              label="Alternate Mobile"
              value={selectedCustomer.alternateMobile}
            />

            <DetailItem
              label="Village"
              value={selectedCustomer.village}
            />

            <DetailItem
              label="City"
              value={selectedCustomer.city}
            />

            <DetailItem
              label="Pincode"
              value={selectedCustomer.pincode}
            />

            <DetailItem
              label="GST Number"
              value={selectedCustomer.gstNumber}
            />

            <DetailItem
              label="Record Status"
              value={getStatusLabel(selectedCustomer)}
            />

            <DetailItem
              label="Created At"
              value={formatCreatedAt(
                selectedCustomer.createdAt
              )}
            />

            <DetailItem
              label="Address"
              value={selectedCustomer.address}
              fullWidth
            />

            <DetailItem
              label="Remarks"
              value={selectedCustomer.remarks}
              fullWidth
            />
          </DetailGrid>
        )}
      </ViewModal>

      {/* ================================================================== */}
      {/* ADD CUSTOMER */}
      {/* ================================================================== */}

      <FormModal
        isOpen={showAddCustomerModal}
        onClose={closeAddCustomerModal}
        title="Add Customer"
        subtitle="Enter customer information"
        onSubmit={handleCreateCustomer}
        submitLabel="Add Customer"
        cancelLabel="Cancel"
        saving={addSaving}
        error={addError}
        success={addSuccess}
        size="lg"
      >
        <div className="form-section">
          <h4>Customer Information</h4>

          <div className="form-grid">
            <div className="fld">
              <label htmlFor="add-customer-name">
                Customer Name <span className="required">*</span>
              </label>

              <input
                id="add-customer-name"
                name="customerName"
                type="text"
                value={addForm.customerName}
                onChange={handleAddFormChange}
                placeholder="Enter customer name"
              />
            </div>

            <div className="fld">
              <label htmlFor="add-mobile-number">
                Mobile Number <span className="required">*</span>
              </label>

              <input
                id="add-mobile-number"
                name="mobileNumber"
                type="text"
                value={addForm.mobileNumber}
                onChange={handleAddFormChange}
                placeholder="Enter mobile number"
              />
            </div>

            <div className="fld">
              <label htmlFor="add-alternate-mobile">
                Alternate Mobile
              </label>

              <input
                id="add-alternate-mobile"
                name="alternateMobile"
                type="text"
                value={addForm.alternateMobile}
                onChange={handleAddFormChange}
                placeholder="Enter alternate mobile"
              />
            </div>

            <div className="fld">
              <label htmlFor="add-gst-number">
                GST Number
              </label>

              <input
                id="add-gst-number"
                name="gstNumber"
                type="text"
                value={addForm.gstNumber}
                onChange={handleAddFormChange}
                placeholder="Enter GST number"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Address Information</h4>

          <div className="form-grid">
            <div className="fld">
              <label htmlFor="add-village">
                Village
              </label>

              <input
                id="add-village"
                name="village"
                type="text"
                value={addForm.village}
                onChange={handleAddFormChange}
                placeholder="Enter village"
              />
            </div>

            <div className="fld">
              <label htmlFor="add-city">
                City
              </label>

              <input
                id="add-city"
                name="city"
                type="text"
                value={addForm.city}
                onChange={handleAddFormChange}
                placeholder="Enter city"
              />
            </div>

            <div className="fld">
              <label htmlFor="add-pincode">
                Pincode
              </label>

              <input
                id="add-pincode"
                name="pincode"
                type="text"
                value={addForm.pincode}
                onChange={handleAddFormChange}
                placeholder="Enter pincode"
              />
            </div>

            <div className="fld full">
              <label htmlFor="add-address">
                Address
              </label>

              <textarea
                id="add-address"
                name="address"
                value={addForm.address}
                onChange={handleAddFormChange}
                placeholder="Enter address"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Additional Information</h4>

          <div className="form-grid">
            <div className="fld full">
              <label htmlFor="add-remarks">
                Remarks
              </label>

              <textarea
                id="add-remarks"
                name="remarks"
                value={addForm.remarks}
                onChange={handleAddFormChange}
                placeholder="Enter remarks"
                rows="3"
              />
            </div>
          </div>
        </div>
      </FormModal>

      {/* ================================================================== */}
      {/* EDIT CUSTOMER */}
      {/* ================================================================== */}

      <FormModal
        isOpen={Boolean(editingCustomer)}
        onClose={closeEditCustomerModal}
        title="Edit Customer"
        subtitle={
          editingCustomer?.customerId
            ? `Customer ID: ${editingCustomer.customerId}`
            : "Update customer information"
        }
        onSubmit={handleUpdateCustomer}
        submitLabel="Save Changes"
        cancelLabel="Cancel"
        saving={editSaving}
        error={editError}
        success={editSuccess}
        size="lg"
      >
        {editLoading ? (
          <div className="empty-state">
            <p>Loading customer details...</p>
          </div>
        ) : (
          <>
            <div className="form-section">
              <h4>Customer Information</h4>

              <div className="form-grid">
                <div className="fld">
                  <label htmlFor="edit-customer-name">
                    Customer Name{" "}
                    <span className="required">*</span>
                  </label>

                  <input
                    id="edit-customer-name"
                    name="customerName"
                    type="text"
                    value={editForm.customerName}
                    onChange={handleEditFormChange}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="fld">
                  <label htmlFor="edit-mobile-number">
                    Mobile Number{" "}
                    <span className="required">*</span>
                  </label>

                  <input
                    id="edit-mobile-number"
                    name="mobileNumber"
                    type="text"
                    value={editForm.mobileNumber}
                    onChange={handleEditFormChange}
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="fld">
                  <label htmlFor="edit-alternate-mobile">
                    Alternate Mobile
                  </label>

                  <input
                    id="edit-alternate-mobile"
                    name="alternateMobile"
                    type="text"
                    value={editForm.alternateMobile}
                    onChange={handleEditFormChange}
                    placeholder="Enter alternate mobile"
                  />
                </div>

                <div className="fld">
                  <label htmlFor="edit-gst-number">
                    GST Number
                  </label>

                  <input
                    id="edit-gst-number"
                    name="gstNumber"
                    type="text"
                    value={editForm.gstNumber}
                    onChange={handleEditFormChange}
                    placeholder="Enter GST number"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Address Information</h4>

              <div className="form-grid">
                <div className="fld">
                  <label htmlFor="edit-village">
                    Village
                  </label>

                  <input
                    id="edit-village"
                    name="village"
                    type="text"
                    value={editForm.village}
                    onChange={handleEditFormChange}
                    placeholder="Enter village"
                  />
                </div>

                <div className="fld">
                  <label htmlFor="edit-city">
                    City
                  </label>

                  <input
                    id="edit-city"
                    name="city"
                    type="text"
                    value={editForm.city}
                    onChange={handleEditFormChange}
                    placeholder="Enter city"
                  />
                </div>

                <div className="fld">
                  <label htmlFor="edit-pincode">
                    Pincode
                  </label>

                  <input
                    id="edit-pincode"
                    name="pincode"
                    type="text"
                    value={editForm.pincode}
                    onChange={handleEditFormChange}
                    placeholder="Enter pincode"
                  />
                </div>

                <div className="fld full">
                  <label htmlFor="edit-address">
                    Address
                  </label>

                  <textarea
                    id="edit-address"
                    name="address"
                    value={editForm.address}
                    onChange={handleEditFormChange}
                    placeholder="Enter address"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Additional Information</h4>

              <div className="form-grid">
                <div className="fld full">
                  <label htmlFor="edit-remarks">
                    Remarks
                  </label>

                  <textarea
                    id="edit-remarks"
                    name="remarks"
                    value={editForm.remarks}
                    onChange={handleEditFormChange}
                    placeholder="Enter remarks"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </FormModal>

      {/* ================================================================== */}
      {/* DELETE CUSTOMER */}
      {/* ================================================================== */}

      <DeleteConfirmModal
        isOpen={Boolean(deletingCustomer)}
        onClose={closeDeleteCustomerModal}
        onConfirm={confirmDeleteCustomer}
        title="Delete Customer"
        subtitle="Please confirm this action"
        message="Are you sure you want to deactivate this customer record?"
        itemName={
          deletingCustomer
            ? `${deletingCustomer.customerName || "Customer"} (ID: ${
                deletingCustomer.customerId
              })`
            : ""
        }
        confirming={deleteSaving}
        error={deleteError}
      />
    </section>
  );
}

export default Customer;