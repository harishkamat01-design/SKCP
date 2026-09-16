import Modal from "./Modal";

function ViewModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  loading = false,
  error = "",
  footer = null,
  size = "md",
}) {
  let content = children;

  if (loading) {
    content = (
      <div className="empty-state">
        <p>Loading details...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="empty-state">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={footer}
      size={size}
    >
      {content}
    </Modal>
  );
}

export default ViewModal;