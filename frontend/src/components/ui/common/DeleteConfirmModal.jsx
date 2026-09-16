import Modal from "./Modal";

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Record",
  subtitle = "Please confirm this action",
  message = "Are you sure you want to delete this record?",
  itemName = "",
  confirming = false,
  error = "",
}) {
  const footer = (
    <>
      <button
        type="button"
        className="btn"
        onClick={onClose}
        disabled={confirming}
      >
        Cancel
      </button>

      <button
        type="button"
        className="btn danger"
        onClick={onConfirm}
        disabled={confirming}
      >
        {confirming ? "Deleting..." : "Delete"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={footer}
      size="sm"
      closeDisabled={confirming}
    >
      <div className="skcp-delete-confirm">
        <div className="skcp-delete-icon" aria-hidden="true">
          !
        </div>

        <div className="skcp-delete-content">
          <div className="skcp-delete-message">
            {message}
          </div>

          {itemName && (
            <div className="skcp-delete-item">
              {itemName}
            </div>
          )}

          <div className="skcp-delete-warning">
            This action will deactivate the record.
          </div>
        </div>
      </div>

      {error && (
        <div className="alert e show">
          {error}
        </div>
      )}
    </Modal>
  );
}

export default DeleteConfirmModal;