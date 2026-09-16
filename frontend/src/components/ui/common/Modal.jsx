  function Modal({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    size = "md",
    closeDisabled = false,
  }) {
    if (!isOpen) {
      return null;
    }

    const handleOverlayClick = () => {
      if (!closeDisabled) {
        onClose();
      }
    };

    return (
      <div
        className="skcp-modal-overlay"
        onClick={handleOverlayClick}
      >
        <div
          className={`skcp-modal skcp-modal-${size}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="skcp-modal-header">
            <div className="skcp-modal-heading">
              <div>
                {title && (
                  <div className="skcp-modal-title">
                    {title}
                  </div>
                )}

                {subtitle && (
                  <div className="skcp-modal-subtitle">
                    {subtitle}
                  </div>
                )}
              </div>
            </div>

              <button
              type="button"
              className="skcp-modal-close"
              onClick={onClose}
              disabled={closeDisabled}
              aria-label="Close"
              >
              X
              </button>
          </div>

          <div className="skcp-modal-body">
            {children}
          </div>

          {footer && (
            <div className="skcp-modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }

  export default Modal;