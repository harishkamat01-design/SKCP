import Modal from "./Modal";

function FormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  saving = false,
  error = "",
  success = "",
  size = "md",
}) {
  const footer = (
    <>
      <button
        type="button"
        className="btn"
        onClick={onClose}
        disabled={saving}
      >
        {cancelLabel}
      </button>

      <button
        type="submit"
        className="btn primary"
        form="skcp-common-form"
        disabled={saving}
      >
        {saving ? "Saving..." : submitLabel}
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
      size={size}
      closeDisabled={saving}
    >
      {error && (
        <div className="alert e show">
          {error}
        </div>
      )}

      {success && (
        <div className="alert s show">
          {success}
        </div>
      )}

      <form
        id="skcp-common-form"
        onSubmit={onSubmit}
      >
        {children}
      </form>
    </Modal>
  );
}

export default FormModal;