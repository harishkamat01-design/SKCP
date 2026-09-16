
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
import { DetailGrid, DetailItem } from "../../ui/common/DetailGrid";

function Asset() {
  const emptyForm = {
    assetName: "",
    assetCategory: "",
    manufacturer: "",
    modelNumber: "",
    serialNumber: "",
    purchaseDate: "",
    installationDate: "",
    location: "",
    notes: "",
  };

  const [searchKeyword, setSearchKeyword] = useState("");
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  const [editingAsset, setEditingAsset] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const [deletingAsset, setDeletingAsset] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSaving, setDeleteSaving] = useState(false);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiGet("/api/assets");

      setAssets(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err.message || "Unable to load assets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const keyword = searchKeyword.toLowerCase().trim();

    if (!keyword) {
      return true;
    }

    return [
      asset.assetId,
      asset.assetName,
      asset.assetCategory,
      asset.location,
      asset.manufacturer,
      asset.modelNumber,
      asset.serialNumber,
      asset.status,
    ]
      .map((value) => String(value ?? "").toLowerCase())
      .some((value) => value.includes(keyword));
  });

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString();
  };

  const formatDateTime = (dateTimeValue) => {
    if (!dateTimeValue) {
      return "-";
    }

    const date = new Date(dateTimeValue);

    if (Number.isNaN(date.getTime())) {
      return dateTimeValue;
    }

    return date.toLocaleString();
  };

  const handleViewAsset = async (assetId) => {
    try {
      setViewLoading(true);
      setViewError("");
      setSelectedAsset(null);

      const result = await apiGet(`/api/assets/${assetId}`);

      setSelectedAsset(result?.data || null);
    } catch (err) {
      console.error("Error fetching asset details:", err);
      setViewError(
        err.message || "Unable to load asset details. Please try again."
      );
    } finally {
      setViewLoading(false);
    }
  };

  const handleCloseView = () => {
    setSelectedAsset(null);
    setViewLoading(false);
    setViewError("");
  };

  const handleEditAsset = async (assetId) => {
    try {
      setEditError("");
      setEditSuccess("");
      setEditingAsset(null);

      const result = await apiGet(`/api/assets/${assetId}`);
      const asset = result?.data;

      if (!asset) {
        throw new Error("Asset details could not be loaded.");
      }

      setEditingAsset(asset);

      setEditForm({
        assetName: asset.assetName || "",
        assetCategory: asset.assetCategory || "",
        manufacturer: asset.manufacturer || "",
        modelNumber: asset.modelNumber || "",
        serialNumber: asset.serialNumber || "",
        purchaseDate: asset.purchaseDate || "",
        installationDate: asset.installationDate || "",
        location: asset.location || "",
        notes: asset.notes || "",
      });
    } catch (err) {
      console.error("Error loading asset for edit:", err);
      setEditError(
        err.message || "Unable to load asset details. Please try again."
      );
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCloseEdit = () => {
    if (editSaving) {
      return;
    }

    setEditingAsset(null);
    setEditError("");
    setEditSuccess("");
    setEditForm(emptyForm);
  };

  const handleUpdateAsset = async (event) => {
    event.preventDefault();

    if (!editingAsset?.assetId) {
      return;
    }

    try {
      setEditSaving(true);
      setEditError("");
      setEditSuccess("");

      await apiPut(`/api/assets/${editingAsset.assetId}`, editForm);

      setEditSuccess("Asset updated successfully.");

      await fetchAssets();

      setTimeout(() => {
        handleCloseEdit();
      }, 700);
    } catch (err) {
      console.error("Error updating asset:", err);
      setEditError(
        err.message || "Unable to update asset. Please try again."
      );
    } finally {
      setEditSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setAddForm(emptyForm);
    setAddError("");
    setAddSuccess("");
    setShowAddModal(true);
  };

  const handleCloseAdd = () => {
    if (addSaving) {
      return;
    }

    setShowAddModal(false);
    setAddError("");
    setAddSuccess("");
    setAddForm(emptyForm);
  };

  const handleAddChange = (event) => {
    const { name, value } = event.target;

    setAddForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateAsset = async (event) => {
    event.preventDefault();

    try {
      setAddSaving(true);
      setAddError("");
      setAddSuccess("");

      await apiPost("/api/assets", addForm);

      setAddSuccess("Asset created successfully.");

      await fetchAssets();

      setTimeout(() => {
        handleCloseAdd();
      }, 700);
    } catch (err) {
      console.error("Error creating asset:", err);
      setAddError(
        err.message || "Unable to create asset. Please try again."
      );
    } finally {
      setAddSaving(false);
    }
  };

  const handleDeleteAsset = (asset) => {
    setDeletingAsset(asset);
    setDeleteError("");
  };

  const handleCloseDelete = () => {
    if (deleteSaving) {
      return;
    }

    setDeletingAsset(null);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!deletingAsset?.assetId) {
      return;
    }

    try {
      setDeleteSaving(true);
      setDeleteError("");

      await apiDelete(`/api/assets/${deletingAsset.assetId}`);

      setAssets((previousAssets) =>
        previousAssets.filter(
          (asset) => asset.assetId !== deletingAsset.assetId
        )
      );

      setSuccessMessage("Asset deleted successfully.");
      setDeletingAsset(null);

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (err) {
      console.error("Error deleting asset:", err);
      setDeleteError(
        err.message || "Unable to delete asset. Please try again."
      );
    } finally {
      setDeleteSaving(false);
    }
  };

  return (
    <section className="section active">
      <div className="card">
        <div className="card-head customer-page-header">
          <div>
            <div className="card-title">Assets</div>
            <div className="kpi-sub">
              Manage asset information and maintenance records
            </div>
          </div>

          <button
            type="button"
            className="btn primary"
            onClick={handleOpenAdd}
          >
            + Add Asset
          </button>
        </div>

        <div className="fld customer-search">
          <label htmlFor="asset-search">Search Asset</label>
          <input
            id="asset-search"
            type="text"
            placeholder="Search by name, category, location, manufacturer..."
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Asset List</div>
            <div className="kpi-sub">
              {loading
                ? "Loading assets..."
                : `${filteredAssets.length} asset(s)`}
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="alert s show">{successMessage}</div>
        )}

        {loading && (
          <div className="empty-state">
            <p>Loading assets...</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredAssets.length > 0 && (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asset</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.assetId}>
                    <td>{asset.assetId}</td>

                    <td>
                      <strong>{asset.assetName || "-"}</strong>
                    </td>

                    <td>{asset.assetCategory || "-"}</td>

                    <td className="mu">{asset.location || "-"}</td>

                    <td>
                      <span
                        className={
                          asset.status === "ACTIVE"
                            ? "badge bg"
                            : "badge br"
                        }
                      >
                        {asset.status || "-"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => handleViewAsset(asset.assetId)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => handleEditAsset(asset.assetId)}
                          disabled={asset.status !== "ACTIVE"}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => handleDeleteAsset(asset)}
                          disabled={asset.status !== "ACTIVE"}
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

        {!loading && !error && filteredAssets.length === 0 && (
          <div className="empty-state">
            <p>No assets found.</p>
          </div>
        )}
      </div>

      <ViewModal
        isOpen={viewLoading || !!viewError || !!selectedAsset}
        onClose={handleCloseView}
        title="Asset Details"
        subtitle="View asset information"
        loading={viewLoading}
        error={viewError}
        size="lg"
        footer={
          <button
            type="button"
            className="btn"
            onClick={handleCloseView}
          >
            Close
          </button>
        }
      >
        {selectedAsset && (
          <DetailGrid>
            <DetailItem
              label="Asset ID"
              value={selectedAsset.assetId ?? "-"}
            />
            <DetailItem
              label="Asset Name"
              value={selectedAsset.assetName || "-"}
            />
            <DetailItem
              label="Asset Category"
              value={selectedAsset.assetCategory || "-"}
            />
            <DetailItem
              label="Status"
              value={
                <span
                  className={
                    selectedAsset.status === "ACTIVE"
                      ? "badge bg"
                      : "badge br"
                  }
                >
                  {selectedAsset.status || "-"}
                </span>
              }
            />
            <DetailItem
              label="Manufacturer"
              value={selectedAsset.manufacturer || "-"}
            />
            <DetailItem
              label="Model Number"
              value={selectedAsset.modelNumber || "-"}
            />
            <DetailItem
              label="Serial Number"
              value={selectedAsset.serialNumber || "-"}
            />
            <DetailItem
              label="Purchase Date"
              value={formatDate(selectedAsset.purchaseDate)}
            />
            <DetailItem
              label="Installation Date"
              value={formatDate(selectedAsset.installationDate)}
            />
            <DetailItem
              label="Location"
              value={selectedAsset.location || "-"}
            />
            <DetailItem
              label="Last Maintenance"
              value={formatDate(selectedAsset.lastMaintenanceDate)}
            />
            <DetailItem
              label="Next Maintenance"
              value={formatDate(selectedAsset.nextMaintenanceDate)}
            />
            <DetailItem
              label="Notes"
              value={selectedAsset.notes || "-"}
              fullWidth
            />
            <DetailItem
              label="Created At"
              value={formatDateTime(selectedAsset.createdAt)}
            />
          </DetailGrid>
        )}
      </ViewModal>

      <FormModal
        isOpen={!!editingAsset}
        onClose={handleCloseEdit}
        title="Edit Asset"
        subtitle="Update asset information"
        onSubmit={handleUpdateAsset}
        submitLabel="Save Changes"
        saving={editSaving}
        error={editError}
        success={editSuccess}
        size="lg"
      >
        <div className="form-grid">
          <div className="fld">
            <label htmlFor="edit-asset-name">Asset Name</label>
            <input
              id="edit-asset-name"
              name="assetName"
              type="text"
              value={editForm.assetName}
              onChange={handleEditChange}
              required
            />
          </div>

          <div className="fld">
            <label htmlFor="edit-asset-category">Asset Category</label>
            <input
              id="edit-asset-category"
              name="assetCategory"
              type="text"
              value={editForm.assetCategory}
              onChange={handleEditChange}
              required
            />
          </div>

          <div className="fld">
            <label htmlFor="edit-manufacturer">Manufacturer</label>
            <input
              id="edit-manufacturer"
              name="manufacturer"
              type="text"
              value={editForm.manufacturer}
              onChange={handleEditChange}
            />
          </div>

          <div className="fld">
            <label htmlFor="edit-model-number">Model Number</label>
            <input
              id="edit-model-number"
              name="modelNumber"
              type="text"
              value={editForm.modelNumber}
              onChange={handleEditChange}
            />
          </div>

          <div className="fld">
            <label htmlFor="edit-serial-number">Serial Number</label>
            <input
              id="edit-serial-number"
              name="serialNumber"
              type="text"
              value={editForm.serialNumber}
              onChange={handleEditChange}
            />
          </div>

          <div className="fld">
            <label htmlFor="edit-location">Location</label>
            <input
              id="edit-location"
              name="location"
              type="text"
              value={editForm.location}
              onChange={handleEditChange}
            />
          </div>

          <div className="fld">
            <label htmlFor="edit-purchase-date">Purchase Date</label>
            <input
              id="edit-purchase-date"
              name="purchaseDate"
              type="date"
              value={editForm.purchaseDate}
              onChange={handleEditChange}
            />
          </div>

          <div className="fld">
            <label htmlFor="edit-installation-date">
              Installation Date
            </label>
            <input
              id="edit-installation-date"
              name="installationDate"
              type="date"
              value={editForm.installationDate}
              onChange={handleEditChange}
            />
          </div>

          <div className="fld f-full">
            <label htmlFor="edit-notes">Notes</label>
            <textarea
              id="edit-notes"
              name="notes"
              rows="4"
              value={editForm.notes}
              onChange={handleEditChange}
            />
          </div>
        </div>
      </FormModal>

      <FormModal
        isOpen={showAddModal}
        onClose={handleCloseAdd}
        title="Add Asset"
        subtitle="Enter asset information"
        onSubmit={handleCreateAsset}
        submitLabel="Add Asset"
        saving={addSaving}
        error={addError}
        success={addSuccess}
        size="lg"
      >
        <div className="form-grid">
          <div className="fld">
            <label htmlFor="add-asset-name">Asset Name</label>
            <input
              id="add-asset-name"
              name="assetName"
              type="text"
              value={addForm.assetName}
              onChange={handleAddChange}
              required
            />
          </div>

          <div className="fld">
            <label htmlFor="add-asset-category">Asset Category</label>
            <input
              id="add-asset-category"
              name="assetCategory"
              type="text"
              value={addForm.assetCategory}
              onChange={handleAddChange}
              required
            />
          </div>

          <div className="fld">
            <label htmlFor="add-manufacturer">Manufacturer</label>
            <input
              id="add-manufacturer"
              name="manufacturer"
              type="text"
              value={addForm.manufacturer}
              onChange={handleAddChange}
            />
          </div>

          <div className="fld">
            <label htmlFor="add-model-number">Model Number</label>
            <input
              id="add-model-number"
              name="modelNumber"
              type="text"
              value={addForm.modelNumber}
              onChange={handleAddChange}
            />
          </div>

          <div className="fld">
            <label htmlFor="add-serial-number">Serial Number</label>
            <input
              id="add-serial-number"
              name="serialNumber"
              type="text"
              value={addForm.serialNumber}
              onChange={handleAddChange}
            />
          </div>

          <div className="fld">
            <label htmlFor="add-location">Location</label>
            <input
              id="add-location"
              name="location"
              type="text"
              value={addForm.location}
              onChange={handleAddChange}
            />
          </div>

          <div className="fld">
            <label htmlFor="add-purchase-date">Purchase Date</label>
            <input
              id="add-purchase-date"
              name="purchaseDate"
              type="date"
              value={addForm.purchaseDate}
              onChange={handleAddChange}
            />
          </div>

          <div className="fld">
            <label htmlFor="add-installation-date">
              Installation Date
            </label>
            <input
              id="add-installation-date"
              name="installationDate"
              type="date"
              value={addForm.installationDate}
              onChange={handleAddChange}
            />
          </div>

          <div className="fld f-full">
            <label htmlFor="add-notes">Notes</label>
            <textarea
              id="add-notes"
              name="notes"
              rows="4"
              value={addForm.notes}
              onChange={handleAddChange}
            />
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={!!deletingAsset}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Asset"
        subtitle="Confirm asset deactivation"
        message="Are you sure you want to delete this asset?"
        itemName={deletingAsset?.assetName}
        confirming={deleteSaving}
        error={deleteError}
      />
    </section>
  );
}

export default Asset;
