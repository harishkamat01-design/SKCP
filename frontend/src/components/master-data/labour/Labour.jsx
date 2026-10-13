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
import { DetailGrid, DetailItem } from "../../ui/common/DetailGrid";

import Pagination from "../../ui/Pagination";
import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";
import "./Labour.css";
// =========================================================
// SKILL TYPE OPTIONS
// =========================================================

const SKILL_TYPE_OPTIONS = [
  "Mason",
  "Helper",
  "Machine Operator",
  "Production Worker",
  "Curing Worker",
  "Loading Worker",
  "Unloading Worker",
  "Material Handler",
  "Quality Checker",
  "Maintenance Worker",
  "Driver",
  "Other",
];

function Labour() {
  // =========================================================
  // STATE
  // =========================================================

  const [searchKeyword, setSearchKeyword] = useState("");
  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedLabour, setSelectedLabour] = useState(null);

  const [formMode, setFormMode] = useState("add");

  const [formData, setFormData] = useState({
    labourName: "",
    phone: "",
    address: "",
    joiningDate: "",
    skillType: "",
    dailyRate: "",
  });

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // =========================================================
  // FETCH ALL LABOURS
  // =========================================================

  const fetchLabours = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiGet("/api/labours");

      setLabours(
        Array.isArray(result?.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error("Error fetching labours:", err);

      setError(
        err.message ||
          "Unable to load labours. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabours();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredLabours = useMemo(() => {
    const keyword = searchKeyword.toLowerCase().trim();

    if (!keyword) {
      return labours;
    }

    return labours.filter((labour) => (
      String(labour.labourId || "")
        .toLowerCase()
        .includes(keyword) ||

      labour.labourName
        ?.toLowerCase()
        .includes(keyword) ||

      labour.phone
        ?.toLowerCase()
        .includes(keyword) ||

      labour.skillType
        ?.toLowerCase()
        .includes(keyword) ||

      labour.status
        ?.toLowerCase()
        .includes(keyword)
    ));
  }, [labours, searchKeyword]);

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
    filteredLabours,
    "labourId",
    "desc"
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
    10
  );

  // =========================================================
  // SORT INDICATOR
  // =========================================================

  const getSortIndicator = (columnKey) => {
    if (sortKey !== columnKey) {
      return "";
    }

    return sortDirection === "asc"
      ? "▲"
      : "▼";
  };

  // =========================================================
  // RATE CALCULATIONS
  // =========================================================

  const getNumericDailyRate = () => {
    const value = Number(formData.dailyRate);

    if (
      !formData.dailyRate ||
      Number.isNaN(value) ||
      value <= 0
    ) {
      return 0;
    }

    return value;
  };

  const dailyRate = getNumericDailyRate();

  const weeklyRate = dailyRate * 6;
  const monthlyRate = dailyRate * 26;

  // =========================================================
  // FORM INPUT HANDLER
  // =========================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Phone - allow digits only and maximum 10 digits
    if (name === "phone") {
      const digitsOnly = value
        .replace(/\D/g, "")
        .slice(0, 10);

      setFormData((previousData) => ({
        ...previousData,
        [name]: digitsOnly,
      }));

      return;
    }

    // Daily Rate
    if (name === "dailyRate") {
      setFormData((previousData) => ({
        ...previousData,
        [name]: value,
      }));

      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  const handleAddLabour = () => {
    setFormMode("add");
    setSelectedLabour(null);
    setFormError("");

    setFormData({
      labourName: "",
      phone: "",
      address: "",
      joiningDate: "",
      skillType: "",
      dailyRate: "",
    });

    setShowFormModal(true);
  };

  // =========================================================
  // OPEN VIEW MODAL
  // =========================================================

  const handleViewLabour = async (labour) => {
    try {
      setError("");

      const result = await apiGet(
        `/api/labours/${labour.labourId}`
      );

      setSelectedLabour(result?.data || null);
      setShowViewModal(true);
    } catch (err) {
      console.error(
        "Error fetching labour details:",
        err
      );

      setError(
        err.message ||
          "Unable to load labour details."
      );
    }
  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const handleEditLabour = async (labour) => {
    try {
      setFormError("");

      const result = await apiGet(
        `/api/labours/${labour.labourId}`
      );

      const labourDetails = result?.data;

      setSelectedLabour(labourDetails);

      setFormData({
        labourName:
          labourDetails?.labourName || "",

        phone:
          labourDetails?.phone || "",

        address:
          labourDetails?.address || "",

        joiningDate:
          labourDetails?.joiningDate || "",

        skillType:
          labourDetails?.skillType || "",

        dailyRate:
          labourDetails?.dailyRate ?? "",
      });

      setFormMode("edit");
      setShowFormModal(true);
    } catch (err) {
      console.error(
        "Error fetching labour for edit:",
        err
      );

      setError(
        err.message ||
          "Unable to load labour details."
      );
    }
  };

  // =========================================================
  // OPEN DELETE CONFIRMATION
  // =========================================================

  const handleDeleteLabour = (labour) => {
    setSelectedLabour(labour);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  // =========================================================
  // CLOSE VIEW MODAL
  // =========================================================

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedLabour(null);
  };

  // =========================================================
  // CLOSE FORM MODAL
  // =========================================================

  const handleCloseFormModal = () => {
    if (submitting) {
      return;
    }

    setShowFormModal(false);
    setSelectedLabour(null);
    setFormError("");
  };

  // =========================================================
  // CLOSE DELETE MODAL
  // =========================================================

  const handleCloseDeleteModal = () => {
    if (deleting) {
      return;
    }

    setShowDeleteModal(false);
    setSelectedLabour(null);
    setDeleteError("");
  };

  // =========================================================
  // CREATE / UPDATE LABOUR
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setFormError("");

      const labourName =
        formData.labourName.trim();

      const phone =
        formData.phone.trim();

      const address =
        formData.address.trim();

      const joiningDate =
        formData.joiningDate;

      const skillType =
        formData.skillType.trim();

      const dailyRateValue =
        Number(formData.dailyRate);

      // =====================================================
      // FRONTEND VALIDATION
      // =====================================================

      if (!labourName) {
        throw new Error(
          "Labour Name is required."
        );
      }

      if (!phone) {
        throw new Error(
          "Phone is required."
        );
      }

      if (!/^\d{10}$/.test(phone)) {
        throw new Error(
          "Phone number must contain exactly 10 digits."
        );
      }

      if (!joiningDate) {
        throw new Error(
          "Joining Date is required."
        );
      }

      if (!skillType) {
        throw new Error(
          "Skill Type is required."
        );
      }

      if (
        !SKILL_TYPE_OPTIONS.includes(skillType)
      ) {
        throw new Error(
          "Please select a valid Skill Type."
        );
      }

      if (
        !formData.dailyRate ||
        Number.isNaN(dailyRateValue) ||
        dailyRateValue <= 0
      ) {
        throw new Error(
          "Daily Rate is required."
        );
      }

      if (dailyRateValue % 25 !== 0) {
        throw new Error(
          "Daily Rate must be in increments of ₹25."
        );
      }

      // =====================================================
      // FRONTEND DUPLICATE PHONE CHECK
      // =====================================================

      const duplicateLabour =
        labours.find((labour) => {
          if (
            formMode === "edit" &&
            selectedLabour &&
            labour.labourId ===
              selectedLabour.labourId
          ) {
            return false;
          }

          return (
            String(labour.phone || "").trim() ===
              phone
          );
        });

      if (duplicateLabour) {
        throw new Error(
          "Phone number already exists. Please enter a different Phone number."
        );
      }

      // =====================================================
      // PAYLOAD
      // =====================================================

      const payload = {
        labourName,
        phone,
        address,
        joiningDate,
        skillType,
        dailyRate: dailyRateValue,
      };

      // =====================================================
      // CREATE
      // =====================================================

      if (formMode === "add") {
        await apiPost(
          "/api/labours",
          payload
        );

        setSuccessMessage(
          "Labour created successfully."
        );
      }

      // =====================================================
      // UPDATE
      // =====================================================

      if (
        formMode === "edit" &&
        selectedLabour
      ) {
        await apiPut(
          `/api/labours/${selectedLabour.labourId}`,
          payload
        );

        setSuccessMessage(
          "Labour updated successfully."
        );
      }

      await fetchLabours();

      handleCloseFormModal();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Error saving labour:",
        err
      );

      setFormError(
        err.message ||
          "Unable to save labour."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE LABOUR - SOFT DELETE
  // =========================================================

  const confirmDeleteLabour = async () => {
    if (!selectedLabour) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      await apiDelete(
        `/api/labours/${selectedLabour.labourId}`
      );

      setSuccessMessage(
        "Labour deleted successfully."
      );

      await fetchLabours();

      setShowDeleteModal(false);
      setSelectedLabour(null);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Error deleting labour:",
        err
      );

      setDeleteError(
        err.message ||
          "Unable to delete labour."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    try {
      const date = new Date(
        `${dateValue}T00:00:00`
      );

      if (Number.isNaN(date.getTime())) {
        return dateValue;
      }

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );
    } catch {
      return dateValue;
    }
  };

  // =========================================================
  // FORMAT CREATED AT
  // =========================================================

  const formatCreatedAt = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    try {
      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return dateValue;
      }

      const datePart =
        date.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        );

      const timePart =
        date.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }
        );

      return `${datePart} ${timePart}`;
    } catch {
      return dateValue;
    }
  };

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return `₹${Number(value).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="page labour-page">
        <section className="card">
          <h2>Labour</h2>
          <p>Loading labour records...</p>
        </section>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="page labour-page">

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
            <h2>Labour</h2>
            <p>
              Manage labour information and records.
            </p>
          </div>

          <button
            type="button"
            className="action-btn view-btn"
            onClick={handleAddLabour}
          >
            Add Labour
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
            <label htmlFor="labour-search">
              Search Labour
            </label>

            <input
              id="labour-search"
              type="text"
              placeholder="Search by labour name, mobile, skill type, status..."
              value={searchKeyword}
              onChange={(event) =>
                setSearchKeyword(
                  event.target.value
                )
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
          SUCCESS MESSAGE
          ===================================================== */}

      {successMessage && (
        <section className="card">

          <div className="form-success">
            {successMessage}
          </div>

        </section>
      )}

      {/* =====================================================
          LABOUR LIST
          ===================================================== */}

      <section className="card">

        <h2>Labour List</h2>

        <p>
          {totalRecords} labour
          {totalRecords === 1 ? "" : "s"}
        </p>

        {!error && totalRecords === 0 && (
          <p>
            {searchKeyword
              ? "No labours match your search."
              : "No labours found."}
          </p>
        )}

        {!error && totalRecords > 0 && (
          <div className="table-wrap">

            <table>

              <thead>
                <tr>
                  <th onClick={()=>handleSort("labourId")}>
                    ID <span className="sort-indicator">{getSortIndicator("labourId")}</span>
                  </th>

                  <th onClick={()=>handleSort("labourName")}>
                    Labour <span className="sort-indicator">{getSortIndicator("labourName")}</span>
                  </th>

                  <th onClick={()=>handleSort("phone")}>
                    Phone <span className="sort-indicator">{getSortIndicator("phone")}</span>
                  </th>

                  <th onClick={()=>handleSort("dailyRate")}>
                    Daily Rate <span className="sort-indicator">{getSortIndicator("dailyRate")}</span>
                  </th>

                  <th onClick={()=>handleSort("skillType")}>
                    Skill Type <span className="sort-indicator">{getSortIndicator("skillType")}</span>
                  </th>

                  <th onClick={()=>handleSort("status")}>
                    Status <span className="sort-indicator">{getSortIndicator("status")}</span>
                  </th>

                  <th>Actions</th>
                </tr>
              </thead>

                            <tbody>
                {paginatedRecords.map((labour) => (
                  <tr key={labour.labourId}>
                    <td>{labour.labourId}</td>

                    <td>
                      <strong>{labour.labourName || "-"}</strong>
                    </td>

                    <td>{labour.phone || "-"}</td>

                    <td>{formatCurrency(labour.dailyRate)}</td>

                    <td>{labour.skillType || "-"}</td>

                    <td>
                      <span
                        className={
                          labour.status === "ACTIVE"
                            ? "badge bg"
                            : "badge br"
                        }
                      >
                        {labour.status || "-"}
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
                          onClick={() => handleViewLabour(labour)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="action-btn edit-btn"
                          onClick={() => handleEditLabour(labour)}
                        >
                          Edit
                        </button>

                        {labour.status === "ACTIVE" && (
                          <button
                            type="button"
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteLabour(labour)}
                          >
                            Delete
                          </button>
                                        )}
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
              onPageSizeChange={
                handlePageSizeChange
              }
            />

          </div>
        )}

      </section>

      {/* =====================================================
          VIEW MODAL
          ===================================================== */}

      <ViewModal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        title="Labour Details"
        subtitle={
          selectedLabour
            ? `Labour ID: ${selectedLabour.labourId}`
            : ""
        }
        size="lg"
        footer={
          <button
            type="button"
            className="btn"
            onClick={handleCloseViewModal}
          >
            Close
          </button>
        }
      >

        {selectedLabour && (
          <DetailGrid>

            <DetailItem
              label="Labour ID"
              value={selectedLabour.labourId}
            />

            <DetailItem
              label="Labour Name"
              value={
                selectedLabour.labourName || "-"
              }
            />

            <DetailItem
              label="Phone"
              value={
                selectedLabour.phone || "-"
              }
            />

            <DetailItem
              label="Daily Rate"
              value={formatCurrency(
                selectedLabour.dailyRate
              )}
            />

            <DetailItem
              label="Weekly Rate"
              value={
                selectedLabour.dailyRate
                  ? formatCurrency(
                      Number(
                        selectedLabour.dailyRate
                      ) * 7
                    )
                  : "-"
              }
            />

            <DetailItem
              label="Monthly Rate"
              value={
                selectedLabour.dailyRate
                  ? formatCurrency(
                      Number(
                        selectedLabour.dailyRate
                      ) * 30
                    )
                  : "-"
              }
            />

            <DetailItem
              label="Address"
              value={
                selectedLabour.address || "-"
              }
              fullWidth
            />

            <DetailItem
              label="Joining Date"
              value={formatDate(
                selectedLabour.joiningDate
              )}
            />

            <DetailItem
              label="Skill Type"
              value={
                selectedLabour.skillType || "-"
              }
            />

            <DetailItem
              label="Status"
              value={
                <span
                  className={
                    selectedLabour.status ===
                    "ACTIVE"
                      ? "badge bg"
                      : "badge br"
                  }
                >
                  {selectedLabour.status || "-"}
                </span>
              }
            />

            <DetailItem
              label="Created At"
              value={formatCreatedAt(
                selectedLabour.createdAt
              )}
            />

          </DetailGrid>
        )}

      </ViewModal>

      {/* =====================================================
          ADD / EDIT FORM MODAL
          ===================================================== */}

      <FormModal
        isOpen={showFormModal}
        onClose={handleCloseFormModal}
        title={
          formMode === "add"
            ? "Add Labour"
            : "Edit Labour"
        }
        subtitle={
          formMode === "add"
            ? "Enter labour information"
            : selectedLabour
              ? `Update labour ID ${selectedLabour.labourId}`
              : "Update labour information"
        }
        onSubmit={handleSubmit}
        submitLabel={
          formMode === "add"
            ? "Add Labour"
            : "Update Labour"
        }
        cancelLabel="Cancel"
        saving={submitting}
        error={formError}
        size="lg"
      >

        <div className="customer-modal-section">

          <div className="customer-modal-section-title">
            Labour Information
          </div>

          <div className="form-grid">

            {/* LABOUR NAME */}

            <div className="fld">

              <label htmlFor="labour-name">
                Labour Name <span>*</span>
              </label>

              <input
                id="labour-name"
                type="text"
                name="labourName"
                value={formData.labourName}
                onChange={handleInputChange}
                required
              />

            </div>

            {/* PHONE */}

            <div className="fld">

              <label htmlFor="labour-phone">
                Phone <span>*</span>
              </label>

              <input
                id="labour-phone"
                type="text"
                name="phone"
                inputMode="numeric"
                maxLength="10"
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile number"
                required
              />

            </div>

            {/* JOINING DATE */}

            <div className="fld">

              <label htmlFor="labour-joining-date">
                Joining Date <span>*</span>
              </label>

              <input
                id="labour-joining-date"
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                required
              />

            </div>

            {/* SKILL TYPE */}

            <div className="fld">

              <label htmlFor="labour-skill-type">
                Skill Type <span>*</span>
              </label>

              <select
                id="labour-skill-type"
                name="skillType"
                value={formData.skillType}
                onChange={handleInputChange}
                required
              >
                <option value="">
                  Select Skill Type
                </option>

                {SKILL_TYPE_OPTIONS.map(
                  (skillType) => (
                    <option
                      key={skillType}
                      value={skillType}
                    >
                      {skillType}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* DAILY RATE */}

            <div className="fld">

              <label htmlFor="labour-daily-rate">
                Daily Rate <span>*</span>
              </label>

              <input
                id="labour-daily-rate"
                type="number"
                name="dailyRate"
                min="25"
                step="25"
                value={formData.dailyRate}
                onChange={handleInputChange}
                placeholder="Enter daily rate"
                required
              />

            </div>

            {/* WEEKLY RATE */}

            <div className="fld">

              <label htmlFor="labour-weekly-rate">
                Weekly Rate
              </label>

              <input
                id="labour-weekly-rate"
                type="text"
                value={
                  dailyRate > 0
                    ? formatCurrency(weeklyRate)
                    : ""
                }
                placeholder="Auto calculated"
                readOnly
              />

            </div>

            {/* MONTHLY RATE */}

            <div className="fld">

              <label htmlFor="labour-monthly-rate">
                Monthly Rate
              </label>

              <input
                id="labour-monthly-rate"
                type="text"
                value={
                  dailyRate > 0
                    ? formatCurrency(monthlyRate)
                    : ""
                }
                placeholder="Auto calculated"
                readOnly
              />

            </div>

          </div>

        </div>

        {/* ADDRESS */}

        <div className="customer-modal-section">

          <div className="customer-modal-section-title">
            Address
          </div>

          <div className="form-grid">

            <div className="fld f-full">

              <label htmlFor="labour-address">
                Address
              </label>

              <textarea
                id="labour-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />

            </div>

          </div>

        </div>

      </FormModal>

      {/* =====================================================
          DELETE CONFIRMATION
          ===================================================== */}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDeleteLabour}
        title="Delete Labour"
        subtitle={
          selectedLabour
            ? `Labour ID: ${selectedLabour.labourId}`
            : ""
        }
        message="This labour record will be deactivated and will no longer appear in the active labour list."
        itemName={
          selectedLabour?.labourName || ""
        }
        confirming={deleting}
        error={deleteError}
      />

    </div>
  );
}

export default Labour;