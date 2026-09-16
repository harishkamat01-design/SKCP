function DetailGrid({ children }) {
  return (
    <div className="skcp-detail-grid">
      {children}
    </div>
  );
}

function DetailItem({
  label,
  value,
  fullWidth = false,
}) {
  return (
    <div
      className={`skcp-detail-item ${
        fullWidth ? "skcp-detail-item-full" : ""
      }`}
    >
      <div className="skcp-detail-label">
        {label}
      </div>

      <div className="skcp-detail-value">
        {value ?? "-"}
      </div>
    </div>
  );
}

export { DetailGrid, DetailItem };