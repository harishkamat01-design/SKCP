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

function RawMaterial() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // VIEW RAW MATERIAL STATE
  // =========================================================

  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  // =========================================================
  // EDIT RAW MATERIAL STATE
  // =========================================================

  const [editingRawMaterial, setEditingRawMaterial] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const [editForm, setEditForm] = useState({
    materialName: "",
    materialCategory: "",
    unit: "",
    description: "",
    status: "ACTIVE",
  });

  // =========================================================
  // ADD RAW MATERIAL STATE
  // =========================================================

  const [showAddRawMaterialModal, setShowAddRawMaterialModal] =
    useState(false);

  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const [addForm, setAddForm] = useState({
    materialName: "",
    materialCategory: "",
    unit: "",
    description: "",
  });

  // =========================================================
  // DELETE RAW MATERIAL STATE
  // =========================================================

  const [deletingRawMaterial, setDeletingRawMaterial] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // =========================================================
  // FETCH RAW MATERIALS
  // =========================================================

  const fetchRawMaterials = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiGet("/api/raw-materials");

      console.log("Raw Material API response:", result);

      setRawMaterials(
        Array.isArray(result?.data) ? result.data : [],
      );
    } catch (err) {
      console.error("Error fetching raw materials:", err);

      setError(
        err.message ||
          "Unable to load raw materials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredRawMaterials = rawMaterials.filter((material) => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    const materialName =
      material.materialName?.toLowerCase() || "";

    const materialCategory =
      material.materialCategory?.toLowerCase() || "";

    const unit =
      material.unit?.toLowerCase() || "";

    return (
      materialName.includes(keyword) ||
      materialCategory.includes(keyword) ||
      unit.includes(keyword)
    );
  });

  // =========================================================
  // VIEW RAW MATERIAL
  // =========================================================

  const handleViewRawMaterial = async (rawMaterialId) => {
    try {
      setSelectedRawMaterial(null);
      setViewLoading(true);
      setViewError("");

      const result = await apiGet(
        `/api/raw-materials/${rawMaterialId}`,
      );

      console.log(
        "Raw Material View API response:",
        result,
      );

      setSelectedRawMaterial(result?.data || null);
    } catch (err) {
      console.error(
        "Error fetching raw material details:",
        err,
      );

      setViewError(
        err.message ||
          "Unable to load raw material details. Please try again.",
      );
    } finally {
      setViewLoading(false);
    }
  };

  const handleCloseRawMaterialModal = () => {
    setSelectedRawMaterial(null);
    setViewLoading(false);
    setViewError("");
  };

  // =========================================================
  // EDIT RAW MATERIAL
  // =========================================================

  const handleEditRawMaterial = async (rawMaterialId) => {
    try {
      setEditingRawMaterial(null);
      setEditLoading(true);
      setEditError("");
      setEditSuccess("");

      const result = await apiGet(
        `/api/raw-materials/${rawMaterialId}`,
      );

      console.log(
        "Raw Material Edit API response:",
        result,
      );

      const rawMaterial = result?.data;

      if (!rawMaterial) {
        throw new Error(
          "Raw material details were not found.",
        );
      }

      setEditingRawMaterial(rawMaterial);

      setEditForm({
        materialName: rawMaterial.materialName || "",
        materialCategory:
          rawMaterial.materialCategory || "",
        unit: rawMaterial.unit || "",
        description: rawMaterial.description || "",
        status: rawMaterial.status || "ACTIVE",
      });
    } catch (err) {
      console.error(
        "Error loading raw material for edit:",
        err,
      );

      setEditError(
        err.message ||
          "Unable to load raw material. Please try again.",
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

  const handleUpdateRawMaterial = async (event) => {
    event.preventDefault();

    if (!editingRawMaterial) {
      return;
    }

    try {
      setEditSaving(true);
      setEditError("");
      setEditSuccess("");

      const result = await apiPut(
        `/api/raw-materials/${editingRawMaterial.rawMaterialId}`,
        editForm,
      );

      console.log(
        "Raw Material Update API response:",
        result,
      );

      const updatedRawMaterial = result?.data;

      if (!updatedRawMaterial) {
        throw new Error(
          "Updated raw material data was not returned.",
        );
      }

      setRawMaterials((previousRawMaterials) =>
        previousRawMaterials.map((material) =>
          material.rawMaterialId ===
          updatedRawMaterial.rawMaterialId
            ? updatedRawMaterial
            : material,
        ),
      );

      setEditSuccess(
        "Raw material updated successfully.",
      );

      setTimeout(() => {
        handleCloseEditModal();
      }, 700);
    } catch (err) {
      console.error(
        "Error updating raw material:",
        err,
      );

      setEditError(
        err.message ||
          "Unable to update raw material. Please try again.",
      );
    } finally {
      setEditSaving(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditingRawMaterial(null);
    setEditLoading(false);
    setEditSaving(false);
    setEditError("");
    setEditSuccess("");
  };

  // =========================================================
  // ADD RAW MATERIAL
  // =========================================================

  const handleOpenAddRawMaterialModal = () => {
    setAddError("");
    setAddSuccess("");

    setAddForm({
      materialName: "",
      materialCategory: "",
      unit: "",
      description: "",
    });

    setShowAddRawMaterialModal(true);
  };

  const handleAddChange = (event) => {
    const { name, value } = event.target;

    setAddForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleCreateRawMaterial = async (event) => {
    event.preventDefault();

    try {
      setAddSaving(true);
      setAddError("");
      setAddSuccess("");

      const result = await apiPost(
        "/api/raw-materials",
        addForm,
      );

      console.log(
        "Raw Material Create API response:",
        result,
      );

      const createdRawMaterial = result?.data;

      if (!createdRawMaterial) {
        throw new Error(
          "Created raw material data was not returned.",
        );
      }

      setRawMaterials((previousRawMaterials) => [
        ...previousRawMaterials,
        createdRawMaterial,
      ]);

      setAddSuccess(
        "Raw material created successfully.",
      );

      setTimeout(() => {
        handleCloseAddRawMaterialModal();
      }, 700);
    } catch (err) {
      console.error(
        "Error creating raw material:",
        err,
      );

      setAddError(
        err.message ||
          "Unable to create raw material. Please try again.",
      );
    } finally {
      setAddSaving(false);
    }
  };

  const handleCloseAddRawMaterialModal = () => {
    setShowAddRawMaterialModal(false);
    setAddSaving(false);
    setAddError("");
    setAddSuccess("");
  };

  // =========================================================
  // DELETE RAW MATERIAL
  // =========================================================

  const handleOpenDeleteRawMaterial = (material) => {
    setDeleteError("");
    setDeletingRawMaterial(material);
  };

  const handleCloseDeleteRawMaterial = () => {
    if (deleteSaving) {
      return;
    }

    setDeletingRawMaterial(null);
    setDeleteSaving(false);
    setDeleteError("");
  };

  const handleConfirmDeleteRawMaterial = async () => {
    if (!deletingRawMaterial) {
      return;
    }

    try {
      setDeleteSaving(true);
      setDeleteError("");

      const result = await apiDelete(
        `/api/raw-materials/${deletingRawMaterial.rawMaterialId}`,
      );

      console.log(
        "Raw Material Delete API response:",
        result,
      );

      setRawMaterials((previousRawMaterials) =>
        previousRawMaterials.filter(
          (material) =>
            material.rawMaterialId !==
            deletingRawMaterial.rawMaterialId,
        ),
      );

      setDeletingRawMaterial(null);
    } catch (err) {
      console.error(
        "Error deleting raw material:",
        err,
      );

      setDeleteError(
        err.message ||
          "Unable to delete raw material. Please try again.",
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
              Raw Materials
            </div>

            <div className="kpi-sub">
              Manage raw material information and records
            </div>
          </div>

          <button
            type="button"
            className="btn primary"
            onClick={handleOpenAddRawMaterialModal}
          >
            + Add Raw Material
          </button>

        </div>

        <div className="fld customer-search">

          <label htmlFor="raw-material-search">
            Search Raw Material
          </label>

          <input
            id="raw-material-search"
            type="text"
            placeholder="Search by material, category or unit..."
            value={searchKeyword}
            onChange={(event) =>
              setSearchKeyword(event.target.value)
            }
          />

        </div>

      </div>

      {/* =====================================================
          RAW MATERIAL LIST
          ===================================================== */}

      <div className="card">

        <div className="card-head">

          <div>
            <div className="card-title">
              Raw Material List
            </div>

            <div className="kpi-sub">
              {loading
                ? "Loading raw materials..."
                : `${filteredRawMaterials.length} raw material(s)`}
            </div>
          </div>

        </div>

        {loading && (
          <div className="empty-state">
            <p>Loading raw materials...</p>
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
                  <th>Material</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredRawMaterials.map((material) => (

                  <tr key={material.rawMaterialId}>

                    <td>
                      {material.rawMaterialId}
                    </td>

                    <td>
                      <strong>
                        {material.materialName || "-"}
                      </strong>
                    </td>

                    <td>
                      {material.materialCategory || "-"}
                    </td>

                    <td>
                      {material.unit || "-"}
                    </td>

                    <td>
                      <span
                        className={
                          material.status === "ACTIVE"
                            ? "badge bg"
                            : "badge br"
                        }
                      >
                        {material.status || "-"}
                      </span>
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          type="button"
                          className="btn sm"
                          onClick={() =>
                            handleViewRawMaterial(
                              material.rawMaterialId,
                            )
                          }
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="btn sm"
                          onClick={() =>
                            handleEditRawMaterial(
                              material.rawMaterialId,
                            )
                          }
                          disabled={
                            deleteSaving &&
                            deletingRawMaterial?.rawMaterialId ===
                              material.rawMaterialId
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn sm"
                          onClick={() =>
                            handleOpenDeleteRawMaterial(
                              material,
                            )
                          }
                          disabled={
                            deleteSaving &&
                            deletingRawMaterial?.rawMaterialId ===
                              material.rawMaterialId
                          }
                        >
                          {deleteSaving &&
                          deletingRawMaterial?.rawMaterialId ===
                            material.rawMaterialId
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
          filteredRawMaterials.length === 0 && (
            <div className="empty-state">
              <p>No raw materials found.</p>
            </div>
          )}

      </div>

      {/* =====================================================
          VIEW RAW MATERIAL
          ===================================================== */}

      <ViewModal
        isOpen={
          viewLoading ||
          !!viewError ||
          !!selectedRawMaterial
        }
        onClose={handleCloseRawMaterialModal}
        title="Raw Material Details"
        subtitle="View raw material information"
        loading={viewLoading}
        error={viewError}
        size="lg"
        footer={
          <button
            type="button"
            className="btn"
            onClick={handleCloseRawMaterialModal}
          >
            Close
          </button>
        }
      >
        {!viewLoading &&
          !viewError &&
          selectedRawMaterial && (
            <DetailGrid>

              <DetailItem
                label="Raw Material ID"
                value={selectedRawMaterial.rawMaterialId}
              />

              <DetailItem
                label="Material Name"
                value={selectedRawMaterial.materialName}
              />

              <DetailItem
                label="Material Category"
                value={selectedRawMaterial.materialCategory}
              />

              <DetailItem
                label="Unit"
                value={selectedRawMaterial.unit}
              />

              <DetailItem
                label="Status"
                value={
                  <span
                    className={
                      selectedRawMaterial.status ===
                      "ACTIVE"
                        ? "badge bg"
                        : "badge br"
                    }
                  >
                    {selectedRawMaterial.status || "-"}
                  </span>
                }
              />

              <DetailItem
                label="Created At"
                value={formatCreatedAt(
                  selectedRawMaterial.createdAt,
                )}
              />

              <DetailItem
                label="Description"
                value={selectedRawMaterial.description}
                fullWidth
              />

            </DetailGrid>
          )}
      </ViewModal>

      {/* =====================================================
          EDIT RAW MATERIAL
          ===================================================== */}

      <FormModal
        isOpen={
          editLoading ||
          !!editError ||
          !!editingRawMaterial
        }
        onClose={handleCloseEditModal}
        title="Edit Raw Material"
        subtitle="Update raw material information"
        onSubmit={handleUpdateRawMaterial}
        submitLabel="Save Changes"
        cancelLabel="Cancel"
        saving={editSaving}
        error={editError}
        success={editSuccess}
        size="lg"
      >

        {editLoading && (
          <div className="empty-state">
            <p>Loading raw material details...</p>
          </div>
        )}

        {!editLoading &&
          !editError &&
          editingRawMaterial && (
            <>
              <div className="customer-modal-section">

                <div className="customer-modal-section-title">
                  Raw Material Information
                </div>

                <div className="form-grid">

                  <div className="fld">

                    <label htmlFor="edit-material-name">
                      Material Name
                    </label>

                    <input
                      id="edit-material-name"
                      name="materialName"
                      type="text"
                      value={editForm.materialName}
                      onChange={handleEditChange}
                      minLength={2}
                      maxLength={100}
                      required
                    />

                  </div>

                  <div className="fld">

                    <label htmlFor="edit-material-category">
                      Material Category
                    </label>

                    <input
                      id="edit-material-category"
                      name="materialCategory"
                      type="text"
                      value={editForm.materialCategory}
                      onChange={handleEditChange}
                      maxLength={50}
                      required
                    />

                  </div>

                  <div className="fld">

                    <label htmlFor="edit-material-unit">
                      Unit
                    </label>

                    <select
                      id="edit-material-unit"
                      name="unit"
                      value={editForm.unit}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">
                        Select Unit
                      </option>

                      <option value="BAG">
                        BAG
                      </option>

                      <option value="CUBIC_METER">
                        CUBIC_METER
                      </option>

                      <option value="TON">
                        TON
                      </option>

                      <option value="LITRE">
                        LITRE
                      </option>
                    </select>

                  </div>

                  <div className="fld">

                    <label htmlFor="edit-material-status">
                      Status
                    </label>

                    <select
                      id="edit-material-status"
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
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

              <div className="customer-modal-section">

                <div className="customer-modal-section-title">
                  Description
                </div>

                <div className="form-grid">

                  <div className="fld f-full">

                    <label htmlFor="edit-material-description">
                      Description
                    </label>

                    <textarea
                      id="edit-material-description"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                    />

                  </div>

                </div>

              </div>
            </>
          )}

      </FormModal>

      {/* =====================================================
          ADD RAW MATERIAL
          ===================================================== */}

      <FormModal
        isOpen={showAddRawMaterialModal}
        onClose={handleCloseAddRawMaterialModal}
        title="Add Raw Material"
        subtitle="Enter raw material information"
        onSubmit={handleCreateRawMaterial}
        submitLabel="Add Raw Material"
        cancelLabel="Cancel"
        saving={addSaving}
        error={addError}
        success={addSuccess}
        size="lg"
      >

        <div className="customer-modal-section">

          <div className="customer-modal-section-title">
            Raw Material Information
          </div>

          <div className="form-grid">

            <div className="fld">

              <label htmlFor="add-material-name">
                Material Name
              </label>

              <input
                id="add-material-name"
                name="materialName"
                type="text"
                value={addForm.materialName}
                onChange={handleAddChange}
                minLength={2}
                maxLength={100}
                required
              />

            </div>

            <div className="fld">

              <label htmlFor="add-material-category">
                Material Category
              </label>

              <input
                id="add-material-category"
                name="materialCategory"
                type="text"
                value={addForm.materialCategory}
                onChange={handleAddChange}
                maxLength={50}
                required
              />

            </div>

            <div className="fld">

              <label htmlFor="add-material-unit">
                Unit
              </label>

              <select
                id="add-material-unit"
                name="unit"
                value={addForm.unit}
                onChange={handleAddChange}
                required
              >
                <option value="">
                  Select Unit
                </option>

                <option value="BAG">
                  BAG
                </option>

                <option value="CUBIC_METER">
                  CUBIC_METER
                </option>

                <option value="TON">
                  TON
                </option>

                <option value="LITRE">
                  LITRE
                </option>
              </select>

            </div>

          </div>

        </div>

        <div className="customer-modal-section">

          <div className="customer-modal-section-title">
            Description
          </div>

          <div className="form-grid">

            <div className="fld f-full">

              <label htmlFor="add-material-description">
                Description
              </label>

              <textarea
                id="add-material-description"
                name="description"
                value={addForm.description}
                onChange={handleAddChange}
              />

            </div>

          </div>

        </div>

      </FormModal>

      {/* =====================================================
          DELETE RAW MATERIAL
          ===================================================== */}

      <DeleteConfirmModal
        isOpen={!!deletingRawMaterial}
        onClose={handleCloseDeleteRawMaterial}
        onConfirm={handleConfirmDeleteRawMaterial}
        title="Delete Raw Material"
        subtitle="Deactivate raw material record"
        message="Are you sure you want to delete this raw material?"
        itemName={deletingRawMaterial?.materialName}
        confirming={deleteSaving}
        error={deleteError}
      />

    </section>
  );
}

export default RawMaterial;