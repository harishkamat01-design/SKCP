import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../../../services/api";
import ViewModal from "../../ui/common/ViewModal";
import FormModal from "../../ui/common/FormModal";
import DeleteConfirmModal from "../../ui/common/DeleteConfirmModal";
import {
  DetailGrid,
  DetailItem,
} from "../../ui/common/DetailGrid";

function Supplier() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // VIEW SUPPLIER STATE
  // =========================================================

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  // =========================================================
  // EDIT SUPPLIER STATE
  // =========================================================

  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const [editForm, setEditForm] = useState({
    supplierName: "",
    contactPerson: "",
    phone: "",
    whatsapp: "",
    address: "",
    gstNumber: "",
  });

  // =========================================================
  // ADD SUPPLIER STATE
  // =========================================================

  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const [addForm, setAddForm] = useState({
    supplierName: "",
    contactPerson: "",
    phone: "",
    whatsapp: "",
    address: "",
    gstNumber: "",
  });

  // =========================================================
  // DELETE SUPPLIER STATE
  // =========================================================

  const [deletingSupplier, setDeletingSupplier] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // =========================================================
  // FETCH SUPPLIERS
  // =========================================================

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiGet("/api/suppliers");

      console.log("Supplier API response:", result);

      setSuppliers(
        Array.isArray(result?.data) ? result.data : [],
      );
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Unable to load suppliers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredSuppliers = suppliers.filter((supplier) => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    const supplierName =
      supplier.supplierName?.toLowerCase() || "";

    const phone =
      supplier.phone?.toString().toLowerCase() || "";

    const contactPerson =
      supplier.contactPerson?.toLowerCase() || "";

    const whatsapp =
      supplier.whatsapp?.toString().toLowerCase() || "";

    const gstNumber =
      supplier.gstNumber?.toLowerCase() || "";

    return (
      supplierName.includes(keyword) ||
      phone.includes(keyword) ||
      contactPerson.includes(keyword) ||
      whatsapp.includes(keyword) ||
      gstNumber.includes(keyword)
    );
  });

  // =========================================================
  // VIEW SUPPLIER
  // =========================================================

  const handleViewSupplier = async (supplierId) => {
    try {
      setSelectedSupplier(null);
      setViewLoading(true);
      setViewError("");

      const result = await apiGet(`/api/suppliers/${supplierId}`);

      console.log("Supplier View API response:", result);

      setSelectedSupplier(result?.data || null);
    } catch (err) {
      console.error("Error fetching supplier details:", err);

      setViewError(
        err.message ||
          "Unable to load supplier details. Please try again.",
      );
    } finally {
      setViewLoading(false);
    }
  };

  const handleCloseSupplierModal = () => {
    setSelectedSupplier(null);
    setViewLoading(false);
    setViewError("");
  };

  // =========================================================
  // EDIT SUPPLIER
  // =========================================================

  const handleEditSupplier = async (supplierId) => {
    try {
      setEditingSupplier(null);
      setEditLoading(true);
      setEditError("");
      setEditSuccess("");

      const result = await apiGet(`/api/suppliers/${supplierId}`);

      console.log("Supplier Edit API response:", result);

      const supplier = result?.data;

      if (!supplier) {
        throw new Error("Supplier details were not found.");
      }

      setEditingSupplier(supplier);

      setEditForm({
        supplierName: supplier.supplierName || "",
        contactPerson: supplier.contactPerson || "",
        phone: supplier.phone || "",
        whatsapp: supplier.whatsapp || "",
        address: supplier.address || "",
        gstNumber: supplier.gstNumber || "",
      });
    } catch (err) {
      console.error("Error loading supplier for edit:", err);

      setEditError(
        err.message ||
          "Unable to load supplier. Please try again.",
      );
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

  const handleUpdateSupplier = async (event) => {
    event.preventDefault();

    if (!editingSupplier) {
      return;
    }

    try {
      setEditSaving(true);
      setEditError("");
      setEditSuccess("");

      const result = await apiPut(
        `/api/suppliers/${editingSupplier.supplierId}`,
        editForm,
      );

      console.log("Supplier Update API response:", result);

      const updatedSupplier = result?.data;

      if (!updatedSupplier) {
        throw new Error("Updated supplier data was not returned.");
      }

      setSuppliers((previousSuppliers) =>
        previousSuppliers.map((supplier) =>
          supplier.supplierId === updatedSupplier.supplierId
            ? updatedSupplier
            : supplier,
        ),
      );

      setEditSuccess("Supplier updated successfully.");

      setTimeout(() => {
        handleCloseEditModal();
      }, 700);
    } catch (err) {
      console.error("Error updating supplier:", err);

      setEditError(
        err.message ||
          "Unable to update supplier. Please try again.",
      );
    } finally {
      setEditSaving(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditingSupplier(null);
    setEditLoading(false);
    setEditSaving(false);
    setEditError("");
    setEditSuccess("");
  };

  // =========================================================
  // ADD SUPPLIER
  // =========================================================

  const handleOpenAddSupplierModal = () => {
    setAddError("");
    setAddSuccess("");

    setAddForm({
      supplierName: "",
      contactPerson: "",
      phone: "",
      whatsapp: "",
      address: "",
      gstNumber: "",
    });

    setShowAddSupplierModal(true);
  };

  const handleAddChange = (event) => {
    const { name, value } = event.target;

    setAddForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleCreateSupplier = async (event) => {
    event.preventDefault();

    try {
      setAddSaving(true);
      setAddError("");
      setAddSuccess("");

      const result = await apiPost(
        "/api/suppliers",
        addForm,
      );

      console.log("Supplier Create API response:", result);

      const createdSupplier = result?.data;

      if (!createdSupplier) {
        throw new Error("Created supplier data was not returned.");
      }

      setSuppliers((previousSuppliers) => [
        ...previousSuppliers,
        createdSupplier,
      ]);

      setAddSuccess("Supplier created successfully.");

      setTimeout(() => {
        handleCloseAddSupplierModal();
      }, 700);
    } catch (err) {
      console.error("Error creating supplier:", err);

      setAddError(
        err.message ||
          "Unable to create supplier. Please try again.",
      );
    } finally {
      setAddSaving(false);
    }
  };

  const handleCloseAddSupplierModal = () => {
    setShowAddSupplierModal(false);
    setAddSaving(false);
    setAddError("");
    setAddSuccess("");
  };

  // =========================================================
  // DELETE SUPPLIER
  // =========================================================

  const handleOpenDeleteSupplier = (supplier) => {
    setDeleteError("");
    setDeletingSupplier(supplier);
  };

  const handleCloseDeleteSupplier = () => {
    if (deleteSaving) {
      return;
    }

    setDeletingSupplier(null);
    setDeleteSaving(false);
    setDeleteError("");
  };

  const handleConfirmDeleteSupplier = async () => {
    if (!deletingSupplier) {
      return;
    }

    try {
      setDeleteSaving(true);
      setDeleteError("");

      const result = await apiDelete(
        `/api/suppliers/${deletingSupplier.supplierId}`,
      );

      console.log("Supplier Delete API response:", result);

      setSuppliers((previousSuppliers) =>
        previousSuppliers.filter(
          (supplier) =>
            supplier.supplierId !==
            deletingSupplier.supplierId,
        ),
      );

      setDeletingSupplier(null);
    } catch (err) {
      console.error("Error deleting supplier:", err);

      setDeleteError(
        err.message ||
          "Unable to delete supplier. Please try again.",
      );
    } finally {
      setDeleteSaving(false);
    }
  };

  // =========================================================
  // DATE FORMATTER
  // =========================================================

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

  // =========================================================
  // UI
  // =========================================================

  return (
    <section className="section active">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

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
            onClick={handleOpenAddSupplierModal}
          >
            + Add Supplier
          </button>

        </div>

        <div className="fld customer-search">
          <label htmlFor="supplier-search">
            Search Supplier
          </label>

          <input
            id="supplier-search"
            type="text"
            placeholder="Search by name, mobile, contact person or GST number..."
            value={searchKeyword}
            onChange={(event) =>
              setSearchKeyword(event.target.value)
            }
          />
        </div>
      </div>

      {/* =====================================================
          SUPPLIER LIST
          ===================================================== */}

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

        {loading && (
          <div className="empty-state">
            <p>Loading suppliers...</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && deleteError && (
          <div className="alert e show">
            {deleteError}
          </div>
        )}

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
                        {supplier.supplierName || "-"}
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
                        {supplier.status || "-"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          type="button"
                          className="btn sm"
                          onClick={() =>
                            handleViewSupplier(
                              supplier.supplierId,
                            )
                          }
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="btn sm"
                          onClick={() =>
                            handleEditSupplier(
                              supplier.supplierId,
                            )
                          }
                          disabled={
                            deleteSaving &&
                            deletingSupplier?.supplierId ===
                              supplier.supplierId
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn sm"
                          onClick={() =>
                            handleOpenDeleteSupplier(
                              supplier,
                            )
                          }
                          disabled={
                            deleteSaving &&
                            deletingSupplier?.supplierId ===
                              supplier.supplierId
                          }
                        >
                          {deleteSaving &&
                          deletingSupplier?.supplierId ===
                            supplier.supplierId
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

        {!loading &&
          !error &&
          filteredSuppliers.length === 0 && (
            <div className="empty-state">
              <p>No suppliers found.</p>
            </div>
          )}

      </div>

      {/* =====================================================
          VIEW SUPPLIER
          ===================================================== */}

      <ViewModal
        isOpen={
          viewLoading ||
          !!viewError ||
          !!selectedSupplier
        }
        onClose={handleCloseSupplierModal}
        title="Supplier Details"
        subtitle="View supplier information"
        loading={viewLoading}
        error={viewError}
        size="lg"
        footer={
          <button
            type="button"
            className="btn"
            onClick={handleCloseSupplierModal}
          >
            Close
          </button>
        }
      >
        {!viewLoading &&
          !viewError &&
          selectedSupplier && (
            <DetailGrid>

              <DetailItem
                label="Supplier ID"
                value={selectedSupplier.supplierId}
              />

              <DetailItem
                label="Supplier Name"
                value={selectedSupplier.supplierName}
              />

              <DetailItem
                label="Contact Person"
                value={selectedSupplier.contactPerson}
              />

              <DetailItem
                label="Phone"
                value={selectedSupplier.phone}
              />

              <DetailItem
                label="WhatsApp"
                value={selectedSupplier.whatsapp}
              />

              <DetailItem
                label="GST Number"
                value={selectedSupplier.gstNumber}
              />

              <DetailItem
                label="Status"
                value={
                  <span
                    className={
                      selectedSupplier.status === "ACTIVE"
                        ? "badge bg"
                        : "badge br"
                    }
                  >
                    {selectedSupplier.status || "-"}
                  </span>
                }
              />

              <DetailItem
                label="Created At"
                value={formatCreatedAt(
                  selectedSupplier.createdAt,
                )}
              />

              <DetailItem
                label="Address"
                value={selectedSupplier.address}
                fullWidth
              />

            </DetailGrid>
          )}
      </ViewModal>

      {/* =====================================================
          EDIT SUPPLIER
          ===================================================== */}

      <FormModal
        isOpen={
          editLoading ||
          !!editError ||
          !!editingSupplier
        }
        onClose={handleCloseEditModal}
        title="Edit Supplier"
        subtitle="Update supplier information"
        onSubmit={handleUpdateSupplier}
        submitLabel="Save Changes"
        cancelLabel="Cancel"
        saving={editSaving}
        error={editError}
        success={editSuccess}
        size="lg"
      >
        {editLoading && (
          <div className="empty-state">
            <p>Loading supplier details...</p>
          </div>
        )}

        {!editLoading &&
          !editError &&
          editingSupplier && (
            <>
              <div className="customer-modal-section">
                <div className="customer-modal-section-title">
                  Supplier Information
                </div>

                <div className="form-grid">

                  <div className="fld">
                    <label htmlFor="edit-supplier-name">
                      Supplier Name
                    </label>

                    <input
                      id="edit-supplier-name"
                      name="supplierName"
                      type="text"
                      value={editForm.supplierName}
                      onChange={handleEditChange}
                      minLength={2}
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="fld">
                    <label htmlFor="edit-contact-person">
                      Contact Person
                    </label>

                    <input
                      id="edit-contact-person"
                      name="contactPerson"
                      type="text"
                      value={editForm.contactPerson}
                      onChange={handleEditChange}
                      maxLength={100}
                    />
                  </div>

                  <div className="fld">
                    <label htmlFor="edit-supplier-phone">
                      Phone
                    </label>

                    <input
                      id="edit-supplier-phone"
                      name="phone"
                      type="text"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="fld">
                    <label htmlFor="edit-whatsapp">
                      WhatsApp
                    </label>

                    <input
                      id="edit-whatsapp"
                      name="whatsapp"
                      type="text"
                      value={editForm.whatsapp}
                      onChange={handleEditChange}
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
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
                      onChange={handleEditChange}
                      maxLength={15}
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

                    <label htmlFor="edit-supplier-address">
                      Address
                    </label>

                    <textarea
                      id="edit-supplier-address"
                      name="address"
                      value={editForm.address}
                      onChange={handleEditChange}
                      maxLength={500}
                    />

                  </div>

                </div>
              </div>
            </>
          )}
      </FormModal>

      {/* =====================================================
          ADD SUPPLIER
          ===================================================== */}

      <FormModal
        isOpen={showAddSupplierModal}
        onClose={handleCloseAddSupplierModal}
        title="Add Supplier"
        subtitle="Enter supplier information"
        onSubmit={handleCreateSupplier}
        submitLabel="Add Supplier"
        cancelLabel="Cancel"
        saving={addSaving}
        error={addError}
        success={addSuccess}
        size="lg"
      >
        <div className="customer-modal-section">

          <div className="customer-modal-section-title">
            Supplier Information
          </div>

          <div className="form-grid">

            <div className="fld">
              <label htmlFor="add-supplier-name">
                Supplier Name
              </label>

              <input
                id="add-supplier-name"
                name="supplierName"
                type="text"
                value={addForm.supplierName}
                onChange={handleAddChange}
                minLength={2}
                maxLength={100}
                required
              />
            </div>

            <div className="fld">
              <label htmlFor="add-contact-person">
                Contact Person
              </label>

              <input
                id="add-contact-person"
                name="contactPerson"
                type="text"
                value={addForm.contactPerson}
                onChange={handleAddChange}
                maxLength={100}
              />
            </div>

            <div className="fld">
              <label htmlFor="add-supplier-phone">
                Phone
              </label>

              <input
                id="add-supplier-phone"
                name="phone"
                type="text"
                value={addForm.phone}
                onChange={handleAddChange}
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                required
              />
            </div>

            <div className="fld">
              <label htmlFor="add-whatsapp">
                WhatsApp
              </label>

              <input
                id="add-whatsapp"
                name="whatsapp"
                type="text"
                value={addForm.whatsapp}
                onChange={handleAddChange}
                pattern="[6-9][0-9]{9}"
                maxLength={10}
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
                onChange={handleAddChange}
                maxLength={15}
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

              <label htmlFor="add-supplier-address">
                Address
              </label>

              <textarea
                id="add-supplier-address"
                name="address"
                value={addForm.address}
                onChange={handleAddChange}
                maxLength={500}
              />

            </div>

          </div>
        </div>
      </FormModal>

      {/* =====================================================
          DELETE SUPPLIER
          ===================================================== */}

      <DeleteConfirmModal
        isOpen={!!deletingSupplier}
        onClose={handleCloseDeleteSupplier}
        onConfirm={handleConfirmDeleteSupplier}
        title="Delete Supplier"
        subtitle="Deactivate supplier record"
        message="Are you sure you want to delete this supplier?"
        itemName={deletingSupplier?.supplierName}
        confirming={deleteSaving}
        error={deleteError}
      />

    </section>
  );
}

export default Supplier;
