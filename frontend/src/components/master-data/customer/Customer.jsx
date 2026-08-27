import { useEffect, useState } from "react";

function Customer() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // View Modal state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  // Edit Modal state
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Edit form state
  const [editForm, setEditForm] = useState({
    customerName: "",
    mobileNumber: "",
    alternateMobile: "",
    address: "",
    village: "",
    city: "",
    pincode: "",
    gstNumber: "",
    remarks: "",
  });

  // Add Customer Modal state
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  // Delete Customer state
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Add Customer form state
  const [addForm, setAddForm] = useState({
    customerName: "",
    mobileNumber: "",
    alternateMobile: "",
    address: "",
    village: "",
    city: "",
    pincode: "",
    gstNumber: "",
    remarks: "",
  });

  // =========================================================
  // FETCH CUSTOMERS
  // =========================================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:8080/api/customers");

      if (!response.ok) {
        throw new Error(`Failed to fetch customers (${response.status})`);
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

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const filteredCustomers = customers.filter((customer) => {
    const keyword = searchKeyword.toLowerCase();

    const customerName = customer.customerName?.toLowerCase() || "";

    const mobileNumber = customer.mobileNumber?.toString() || "";

    return (
      customerName.includes(keyword) || mobileNumber.includes(searchKeyword)
    );
  });

  // =========================================================
  // VIEW CUSTOMER
  // =========================================================

  const handleViewCustomer = async (customerId) => {
    try {
      setViewLoading(true);
      setViewError("");
      setSelectedCustomer(null);

      const response = await fetch(
        `http://localhost:8080/api/customers/${customerId}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch customer (${response.status})`);
      }

      const result = await response.json();

      console.log("Customer View API response:", result);
      console.log("Customer View API data:", result.data);

      setSelectedCustomer(result.data);
    } catch (err) {
      console.error("Error fetching customer details:", err);
      setViewError("Unable to load customer details. Please try again.");
    } finally {
      setViewLoading(false);
    }
  };

  const handleCloseCustomerModal = () => {
    setSelectedCustomer(null);
    setViewError("");
    setViewLoading(false);
  };

  // =========================================================
  // EDIT CUSTOMER
  // =========================================================

  const handleEditCustomer = async (customerId) => {
    try {
      setEditLoading(true);
      setEditError("");
      setEditSuccess("");
      setEditingCustomer(null);

      const response = await fetch(
        `http://localhost:8080/api/customers/${customerId}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch customer (${response.status})`);
      }

      const result = await response.json();
      const customer = result.data;

      console.log("Customer Edit API response:", result);
      console.log("Customer Edit API data:", customer);

      setEditingCustomer(customer);

      setEditForm({
        customerName: customer.customerName || "",
        mobileNumber: customer.mobileNumber || "",
        alternateMobile: customer.alternateMobile || "",
        address: customer.address || "",
        village: customer.village || "",
        city: customer.city || "",
        pincode: customer.pincode || "",
        gstNumber: customer.gstNumber || "",
        remarks: customer.remarks || "",
      });
    } catch (err) {
      console.error("Error loading customer for edit:", err);
      setEditError("Unable to load customer details. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleCloseEditModal = () => {
    setEditingCustomer(null);
    setEditError("");
    setEditSuccess("");
    setEditLoading(false);
    setEditSaving(false);
  };

  // =========================================================
  // UPDATE CUSTOMER
  // =========================================================

  const handleUpdateCustomer = async (event) => {
    event.preventDefault();

    if (!editingCustomer?.customerId) {
      return;
    }

    try {
      setEditSaving(true);
      setEditError("");
      setEditSuccess("");

      const response = await fetch(
        `http://localhost:8080/api/customers/${editingCustomer.customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        },
      );

      const result = await response.json();

      console.log("Customer Update API response:", result);

      if (!response.ok) {
        throw new Error(
          result.message || `Failed to update customer (${response.status})`,
        );
      }

      setEditSuccess("Customer updated successfully.");

      // Refresh customer list after successful update
      await fetchCustomers();

      // Close edit modal shortly after success
      setTimeout(() => {
        handleCloseEditModal();
      }, 700);
    } catch (err) {
      console.error("Error updating customer:", err);

      setEditError(
        err.message || "Unable to update customer. Please try again.",
      );
    } finally {
      setEditSaving(false);
    }
  };

  // =========================================================
  // ADD CUSTOMER
  // =========================================================

  const handleOpenAddCustomerModal = () => {
    setAddError("");
    setAddSuccess("");

    setAddForm({
      customerName: "",
      mobileNumber: "",
      alternateMobile: "",
      address: "",
      village: "",
      city: "",
      pincode: "",
      gstNumber: "",
      remarks: "",
    });

    setShowAddCustomerModal(true);
  };

  const handleCloseAddCustomerModal = () => {
    if (addSaving) {
      return;
    }

    setShowAddCustomerModal(false);
    setAddError("");
    setAddSuccess("");
  };

  const handleAddChange = (event) => {
    const { name, value } = event.target;

    setAddForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleCreateCustomer = async (event) => {
    event.preventDefault();

    try {
      setAddSaving(true);
      setAddError("");
      setAddSuccess("");

      const response = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addForm),
      });

      const result = await response.json();

      console.log("Customer Create API response:", result);

      if (!response.ok) {
        throw new Error(
          result.message || `Failed to create customer (${response.status})`,
        );
      }

      setAddSuccess("Customer created successfully.");

      await fetchCustomers();

      setTimeout(() => {
        setShowAddCustomerModal(false);
        setAddSuccess("");
      }, 700);
    } catch (err) {
      console.error("Error creating customer:", err);

      setAddError(
        err.message || "Unable to create customer. Please try again.",
      );
    } finally {
      setAddSaving(false);
    }
  };

    // =========================================================
    // DELETE CUSTOMER
    // =========================================================

    const handleDeleteCustomer = async (customerId, customerName) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete customer "${customerName}"?`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingCustomerId(customerId);
        setDeleteError("");

        const response = await fetch(
          `http://localhost:8080/api/customers/${customerId}`,
          {
            method: "DELETE",
          },
        );

        const result = await response.json();

        console.log("Customer Delete API response:", result);

        if (!response.ok) {
          throw new Error(
            result.message || `Failed to delete customer (${response.status})`,
          );
        }

        // Remove deleted customer immediately from the frontend list
        setCustomers((previousCustomers) =>
          previousCustomers.filter(
            (customer) => customer.customerId !== customerId,
          ),
        );
      } catch (err) {
        console.error("Error deleting customer:", err);

        setDeleteError(
          err.message || "Unable to delete customer. Please try again.",
        );
      } finally {
        setDeletingCustomerId(null);
      }
    };


  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatCreatedAt = (createdAt) => {
    if (!createdAt) {
      return "-";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return createdAt;
    }

    return date.toLocaleString();
  };

  return (
    <section className="section active">
      {/* =====================================================
                PAGE HEADER
        ===================================================== */}
        <div className="card">
        <div className="card-head customer-page-header">
            <div>
            <div className="card-title">Customers</div>

            <div className="kpi-sub">
                Manage customer information and records
            </div>
            </div>

            <button
            type="button"
            className="btn primary"
            onClick={handleOpenAddCustomerModal}
            >
            + Add Customer
            </button>
        </div>

        <div className="fld customer-search">
            <label htmlFor="customer-search">Search Customer</label>

            <input
            id="customer-search"
            type="text"
            placeholder="Search by name or mobile number..."
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            />
        </div>
        </div>

      {/* =====================================================
                CUSTOMER TABLE
         ===================================================== */}

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Customer List</div>

            <div className="kpi-sub">
              {loading
                ? "Loading customers..."
                : `${filteredCustomers.length} customer(s)`}
            </div>
          </div>
        </div>
          {deleteError && (
            <div className="alert e show">
              {deleteError}
            </div>
          )}
        {/* Loading */}
        {loading && (
          <div className="empty-state">
            <p>Loading customers...</p>
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
                      <strong>{customer.customerName}</strong>
                    </td>

                    <td>{customer.mobileNumber}</td>

                    <td className="mu">{customer.village || "-"}</td>

                    <td className="mu">{customer.city || "-"}</td>

                    <td>
                      <span
                        className={
                          customer.status === "ACTIVE" ? "badge bg" : "badge br"
                        }
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td>
                     <div className="customer-action-buttons">
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() =>
                            handleViewCustomer(customer.customerId)
                          }
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="btn sm customer-edit-btn"
                          onClick={() =>
                            handleEditCustomer(customer.customerId)
                          }
                          disabled={deletingCustomerId === customer.customerId}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn sm customer-delete-btn"
                          onClick={() =>
                            handleDeleteCustomer(
                              customer.customerId,
                              customer.customerName,
                            )
                          }
                          disabled={deletingCustomerId === customer.customerId}
                        >
                          {deletingCustomerId === customer.customerId
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCustomers.length === 0 && (
          <div className="empty-state">
            <p>No customers found.</p>
          </div>
        )}
      </div>

      {/* =====================================================
                CUSTOMER VIEW MODAL
                ===================================================== */}

      {(viewLoading || viewError || selectedCustomer) && (
        <div
          className="customer-modal-overlay"
          onClick={handleCloseCustomerModal}
        >
          <div
            className="customer-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-modal-header">
              <div>
                <div className="customer-modal-title">Customer Details</div>

                <div className="customer-modal-subtitle">
                  View customer information
                </div>
              </div>

              <button
                type="button"
                className="customer-modal-close"
                onClick={handleCloseCustomerModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="customer-modal-body">
              {viewLoading && (
                <div className="empty-state">
                  <p>Loading customer details...</p>
                </div>
              )}

              {!viewLoading && viewError && (
                <div className="empty-state">
                  <p>{viewError}</p>
                </div>
              )}

              {!viewLoading && !viewError && selectedCustomer && (
                <>
                  <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                      Basic Information
                    </div>

                    <div className="customer-modal-grid">
                      <div className="customer-modal-field">
                        <span className="customer-modal-label">
                          Customer ID
                        </span>

                        <span className="customer-modal-value">
                          {selectedCustomer.customerId ?? "-"}
                        </span>
                      </div>

                      <div className="customer-modal-field">
                        <span className="customer-modal-label">
                          Customer Name
                        </span>

                        <span className="customer-modal-value">
                          {selectedCustomer.customerName || "-"}
                        </span>
                      </div>

                      <div className="customer-modal-field">
                        <span className="customer-modal-label">
                          Mobile Number
                        </span>

                        <span className="customer-modal-value">
                          {selectedCustomer.mobileNumber || "-"}
                        </span>
                      </div>

                      <div className="customer-modal-field">
                        <span className="customer-modal-label">
                          Alternate Mobile
                        </span>

                        <span className="customer-modal-value">
                          {selectedCustomer.alternateMobile || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                      Address Information
                    </div>

                    <div className="customer-modal-grid">
                      <div className="customer-modal-field customer-modal-field-full">
                        <span className="customer-modal-label">Address</span>

                        <span className="customer-modal-value">
                          {selectedCustomer.address || "-"}
                        </span>
                      </div>

                      <div className="customer-modal-field">
                        <span className="customer-modal-label">Village</span>

                        <span className="customer-modal-value">
                          {selectedCustomer.village || "-"}
                        </span>
                      </div>

                      <div className="customer-modal-field">
                        <span className="customer-modal-label">City</span>

                        <span className="customer-modal-value">
                          {selectedCustomer.city || "-"}
                        </span>
                      </div>

                      <div className="customer-modal-field">
                        <span className="customer-modal-label">Pincode</span>

                        <span className="customer-modal-value">
                          {selectedCustomer.pincode || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                      Business Information
                    </div>

                    <div className="customer-modal-grid">
                      <div className="customer-modal-field">
                        <span className="customer-modal-label">GST Number</span>

                        <span className="customer-modal-value">
                          {selectedCustomer.gstNumber || "-"}
                        </span>
                      </div>

                      <div className="customer-modal-field">
                        <span className="customer-modal-label">Status</span>

                        <span className="customer-modal-value">
                          <span
                            className={
                              selectedCustomer.status === "ACTIVE"
                                ? "badge bg"
                                : "badge br"
                            }
                          >
                            {selectedCustomer.status || "-"}
                          </span>
                        </span>
                      </div>

                      <div className="customer-modal-field customer-modal-field-full">
                        <span className="customer-modal-label">Remarks</span>

                        <span className="customer-modal-value">
                          {selectedCustomer.remarks || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                      System Information
                    </div>

                    <div className="customer-modal-grid">
                      <div className="customer-modal-field">
                        <span className="customer-modal-label">Created At</span>

                        <span className="customer-modal-value">
                          {formatCreatedAt(selectedCustomer.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="customer-modal-footer">
              <button
                type="button"
                className="btn"
                onClick={handleCloseCustomerModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
                CUSTOMER EDIT MODAL
                ===================================================== */}

      {(editLoading || editError || editingCustomer) && (
        <div className="customer-modal-overlay" onClick={handleCloseEditModal}>
          <div
            className="customer-modal customer-edit-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-modal-header">
              <div>
                <div className="customer-modal-title">Edit Customer</div>

                <div className="customer-modal-subtitle">
                  Update customer information
                </div>
              </div>

              <button
                type="button"
                className="customer-modal-close"
                onClick={handleCloseEditModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleUpdateCustomer}
              className="customer-modal-body"
            >
              {editLoading && (
                <div className="empty-state">
                  <p>Loading customer details...</p>
                </div>
              )}

              {!editLoading && editError && (
                <div className="empty-state">
                  <p>{editError}</p>
                </div>
              )}

              {!editLoading && !editError && editingCustomer && (
                <>
                  <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                      Customer Information
                    </div>

                    <div className="form-grid">
                      <div className="fld">
                        <label htmlFor="edit-customer-name">
                          Customer Name
                        </label>

                        <input
                          id="edit-customer-name"
                          name="customerName"
                          type="text"
                          value={editForm.customerName}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="fld">
                        <label htmlFor="edit-mobile-number">
                          Mobile Number
                        </label>

                        <input
                          id="edit-mobile-number"
                          name="mobileNumber"
                          type="text"
                          value={editForm.mobileNumber}
                          onChange={handleEditChange}
                          required
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
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="fld">
                        <label htmlFor="edit-gst-number">GST Number</label>

                        <input
                          id="edit-gst-number"
                          name="gstNumber"
                          type="text"
                          value={editForm.gstNumber}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="customer-modal-section">
                    <div className="customer-modal-section-title">
                      Address Information
                    </div>

                    <div className="form-grid">
                      <div className="fld f-full">
                        <label htmlFor="edit-address">Address</label>

                        <textarea
                          id="edit-address"
                          name="address"
                          value={editForm.address}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="fld">
                        <label htmlFor="edit-village">Village</label>

                        <input
                          id="edit-village"
                          name="village"
                          type="text"
                          value={editForm.village}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="fld">
                        <label htmlFor="edit-city">City</label>

                        <input
                          id="edit-city"
                          name="city"
                          type="text"
                          value={editForm.city}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="fld">
                        <label htmlFor="edit-pincode">Pincode</label>

                        <input
                          id="edit-pincode"
                          name="pincode"
                          type="text"
                          value={editForm.pincode}
                          onChange={handleEditChange}
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
                        <label htmlFor="edit-remarks">Remarks</label>

                        <textarea
                          id="edit-remarks"
                          name="remarks"
                          value={editForm.remarks}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>
                  </div>

                  {editSuccess && (
                    <div className="alert s show">{editSuccess}</div>
                  )}

                  {editError && <div className="alert e show">{editError}</div>}

                  <div className="customer-modal-footer">
                    <button
                      type="button"
                      className="btn"
                      onClick={handleCloseEditModal}
                      disabled={editSaving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn primary"
                      disabled={editSaving}
                    >
                      {editSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
            ADD CUSTOMER MODAL
            ===================================================== */}

      {showAddCustomerModal && (
        <div
          className="customer-modal-overlay"
          onClick={handleCloseAddCustomerModal}
        >
          <div
            className="customer-modal customer-edit-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-modal-header">
              <div>
                <div className="customer-modal-title">Add Customer</div>

                <div className="customer-modal-subtitle">
                  Enter customer information
                </div>
              </div>

              <button
                type="button"
                className="customer-modal-close"
                onClick={handleCloseAddCustomerModal}
                disabled={addSaving}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleCreateCustomer}
              className="customer-modal-body"
            >
              <div className="customer-modal-section">
                <div className="customer-modal-section-title">
                  Customer Information
                </div>

                <div className="form-grid">
                  <div className="fld">
                    <label htmlFor="add-customer-name">Customer Name</label>

                    <input
                      id="add-customer-name"
                      name="customerName"
                      type="text"
                      value={addForm.customerName}
                      onChange={handleAddChange}
                      required
                    />
                  </div>

                  <div className="fld">
                    <label htmlFor="add-mobile-number">Mobile Number</label>

                    <input
                      id="add-mobile-number"
                      name="mobileNumber"
                      type="text"
                      value={addForm.mobileNumber}
                      onChange={handleAddChange}
                      required
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
                      onChange={handleAddChange}
                    />
                  </div>

                  <div className="fld">
                    <label htmlFor="add-gst-number">GST Number</label>

                    <input
                      id="add-gst-number"
                      name="gstNumber"
                      type="text"
                      value={addForm.gstNumber}
                      onChange={handleAddChange}
                    />
                  </div>
                </div>
              </div>

              <div className="customer-modal-section">
                <div className="customer-modal-section-title">
                  Address Information
                </div>

                <div className="form-grid">
                  <div className="fld f-full">
                    <label htmlFor="add-address">Address</label>

                    <textarea
                      id="add-address"
                      name="address"
                      value={addForm.address}
                      onChange={handleAddChange}
                    />
                  </div>

                  <div className="fld">
                    <label htmlFor="add-village">Village</label>

                    <input
                      id="add-village"
                      name="village"
                      type="text"
                      value={addForm.village}
                      onChange={handleAddChange}
                    />
                  </div>

                  <div className="fld">
                    <label htmlFor="add-city">City</label>

                    <input
                      id="add-city"
                      name="city"
                      type="text"
                      value={addForm.city}
                      onChange={handleAddChange}
                    />
                  </div>

                  <div className="fld">
                    <label htmlFor="add-pincode">Pincode</label>

                    <input
                      id="add-pincode"
                      name="pincode"
                      type="text"
                      value={addForm.pincode}
                      onChange={handleAddChange}
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
                    <label htmlFor="add-remarks">Remarks</label>

                    <textarea
                      id="add-remarks"
                      name="remarks"
                      value={addForm.remarks}
                      onChange={handleAddChange}
                    />
                  </div>
                </div>
              </div>

              {addSuccess && <div className="alert s show">{addSuccess}</div>}

              {addError && <div className="alert e show">{addError}</div>}

              <div className="customer-modal-footer">
                <button
                  type="button"
                  className="btn"
                  onClick={handleCloseAddCustomerModal}
                  disabled={addSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn primary"
                  disabled={addSaving}
                >
                  {addSaving ? "Saving..." : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Customer;
