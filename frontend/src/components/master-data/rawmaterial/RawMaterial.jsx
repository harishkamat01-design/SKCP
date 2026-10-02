import { useEffect, useMemo, useState } from "react";
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
import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";
import Pagination from "../../ui/Pagination";

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

  const filteredRawMaterials = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      return rawMaterials;
    }

    return rawMaterials.filter((material) => {
      const rawMaterialId = String(
        material.rawMaterialId ?? "",
      ).toLowerCase();

      const materialName =
        material.materialName?.toLowerCase() || "";

      const materialCategory =
        material.materialCategory?.toLowerCase() || "";

      const unit =
        material.unit?.toLowerCase() || "";

      const status =
        material.status?.toLowerCase() || "";

      return (
        rawMaterialId.includes(keyword) ||
        materialName.includes(keyword) ||
        materialCategory.includes(keyword) ||
        unit.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }, [rawMaterials, searchKeyword]);

  const handleClearSearch = () => {
    setSearchKeyword("");
  };

  // =========================================================
  // SORTING
  // =========================================================

  const {
    sortKey,
    sortDirection,
    sortedRecords,
    handleSort,
  } = useTableSort(
    filteredRawMaterials,
    "rawMaterialId",
    "desc",
  );

  // =========================================================
  // PAGINATION
  // =========================================================

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
    10,
  );

  // =========================================================
  // SORT ICON
  // =========================================================

  const getSortIndicator = (key) => {
    if (sortKey !== key) {
      return "";
    }

    return sortDirection === "asc"
      ? "▲"
      : "▼";
  };

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

      await apiDelete(
        `/api/raw-materials/${deletingRawMaterial.rawMaterialId}`,
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
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return value;
      }

      const datePart = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const timePart = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      return `${datePart} ${timePart}`;
    } catch {
      return value;
    }
  };

  // =========================================================
  // UI
  // =========================================================

  if (loading) {
    return (
      <div className="page">
        <section className="card">
          <h2>Raw Materials</h2>
          <p>Loading raw material records...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page">

      {/* =====================================================
          PAGE HEADER + SEARCH
          ===================================================== */}

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
            <h2>Raw Materials</h2>
            <p>Manage raw material information and records.</p>
          </div>

          <button
            type="button"
            className="action-btn view-btn"
            onClick={handleOpenAddRawMaterialModal}
          >
            Add Raw Material
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
            <label htmlFor="raw-material-search">
              Search Raw Materials
            </label>

            <input
              id="raw-material-search"
              type="text"
              placeholder="Search by ID, material, category, unit, status..."
              value={searchKeyword}
              onChange={(event) =>
                setSearchKeyword(event.target.value)
              }
            />
          </div>

          <button
            type="button"
            className="btn secondary"
            onClick={handleClearSearch}
            disabled={!searchKeyword}
          >
            Clear
          </button>
        </div>

        {error && (
          <div
            className="form-error"
            style={{ marginTop: "12px" }}
          >
            {error}
          </div>
        )}

      </section>

      {/* =====================================================
          RAW MATERIAL LIST
          ===================================================== */}

      <section className="card">

        <h2>Raw Material List</h2>

        <p>
          {totalRecords} raw material
          {totalRecords === 1 ? "" : "s"}
        </p>

        {!error && deleteError && (
          <div className="form-error">
            {deleteError}
          </div>
        )}

        {!error && totalRecords === 0 && (
          <p>
            {searchKeyword
              ? "No raw materials match your search."
              : "No raw materials found."}
          </p>
        )}

        {!error && totalRecords > 0 && (
          <div className="table-wrap">

            <table>

              <thead>
                <tr>

                  <th
                    onClick={() =>
                      handleSort("rawMaterialId")
                    }
                  >
                    ID{" "}
                    <span className="sort-indicator">
                      {getSortIndicator("rawMaterialId")}
                    </span>
                  </th>

                  <th
                    onClick={() =>
                      handleSort("materialName")
                    }
                  >
                    Material{" "}
                    <span className="sort-indicator">
                      {getSortIndicator("materialName")}
                    </span>
                  </th>

                  <th
                    onClick={() =>
                      handleSort("materialCategory")
                    }
                  >
                    Category{" "}
                    <span className="sort-indicator">
                      {getSortIndicator("materialCategory")}
                    </span>
                  </th>

                  <th
                    onClick={() =>
                      handleSort("unit")
                    }
                  >
                    Unit{" "}
                    <span className="sort-indicator">
                      {getSortIndicator("unit")}
                    </span>
                  </th>

                  <th
                    onClick={() =>
                      handleSort("status")
                    }
                  >
                    Status{" "}
                    <span className="sort-indicator">
                      {getSortIndicator("status")}
                    </span>
                  </th>

                  <th>Actions</th>

                </tr>
              </thead>

              <tbody>

                {paginatedRecords.map((material) => (

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
                          className="action-btn view-btn"
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
                          className="action-btn edit-btn"
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
                          className="action-btn delete-btn"
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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />

          </div>
        )}

      </section>

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

    </div>
  );
}

export default RawMaterial;