import React from "react";

export default function Sidebar({
  isDark,
  setIsDark,
  setCurrentLang,
  setActiveSection,
  activeSection,
}) {
  const isActive = (section) => activeSection === section;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-row">
          <div className="brand-logo">SKCP</div>

          <div>
            <div className="brand-name">
              Shree Kundodari
              <br />
              Cement Products
            </div>

            <div className="brand-sub">B2B MANAGEMENT PORTAL</div>
          </div>
        </div>
      </div>

      <div className="nav-group">
        <div className="nav-label">MASTER DATA</div>

        <div
          className={`nav-item ${isActive("customer") ? "active" : ""}`}
          onClick={() => setActiveSection("customer")}
        >
          <i className="ti ti-users" />
          Customers
        </div>

        <div
          className={`nav-item ${isActive("supplier") ? "active" : ""}`}
          onClick={() => setActiveSection("supplier")}
        >
          <i className="ti ti-truck-delivery" />
          Suppliers
        </div>

        <div
          className={`nav-item ${isActive("product") ? "active" : ""}`}
          onClick={() => setActiveSection("product")}
        >
          <i className="ti ti-package" />
          Products
        </div>

        <div
          className={`nav-item ${isActive("raw-material") ? "active" : ""}`}
          onClick={() => setActiveSection("raw-material")}
        >
          <i className="ti ti-box" />
          Raw Materials
        </div>

        <div
          className={`nav-item ${isActive("labour") ? "active" : ""}`}
          onClick={() => setActiveSection("labour")}
        >
          <i className="ti ti-user" />
          Labour
        </div>

        <div
          className={`nav-item ${isActive("asset") ? "active" : ""}`}
          onClick={() => setActiveSection("asset")}
        >
          <i className="ti ti-building-factory" />
          Assets
        </div>
      </div>

      <div className="divider" />

      <div className="nav-group">
        <div className="nav-label">OPERATIONS</div>

        <div
          className={`nav-item ${isActive("attendance") ? "active" : ""}`}
          onClick={() => setActiveSection("attendance")}
        >
          <i className="ti ti-calendar-check" />
          Attendance
        </div>

        <div
          className={`nav-item ${isActive("purchase") ? "active" : ""}`}
          onClick={() => setActiveSection("purchase")}
        >
          <i className="ti ti-shopping-cart" />
          Purchases
        </div>

        <div
          className={`nav-item ${isActive("production") ? "active" : ""}`}
          onClick={() => setActiveSection("production")}
        >
          <i className="ti ti-settings" />
          Production
        </div>
      </div>

      <div className="divider" />

      <div className="nav-group">
        <div className="nav-label">INVENTORY</div>

        <div
          className={`nav-item ${
            isActive("raw-material-stock") ? "active" : ""
          }`}
          onClick={() => setActiveSection("raw-material-stock")}
        >
          <i className="ti ti-box" />
          Raw Material Stock
        </div>

        <div
          className={`nav-item ${isActive("curing-stock") ? "active" : ""}`}
          onClick={() => setActiveSection("curing-stock")}
        >
          <i className="ti ti-droplet" />
          Curing Stock
        </div>

        <div
          className={`nav-item ${
            isActive("finished-goods-stock") ? "active" : ""
          }`}
          onClick={() => setActiveSection("finished-goods-stock")}
        >
          <i className="ti ti-stack-2" />
          Finished Goods Stock
        </div>
      </div>

      <div className="divider" />

      <div className="nav-group">
        <div className="nav-label">SALES</div>

        <div
          className={`nav-item ${isActive("order") ? "active" : ""}`}
          onClick={() => setActiveSection("order")}
        >
          <i className="ti ti-file-invoice" />
          Orders
        </div>

        <div
          className={`nav-item ${isActive("delivery") ? "active" : ""}`}
          onClick={() => setActiveSection("delivery")}
        >
          <i className="ti ti-truck" />
          Deliveries
        </div>
      </div>

      <div className="divider" />

      <div className="nav-group">
        <div className="nav-label">FINANCE</div>

        <div
          className={`nav-item ${isActive("payment") ? "active" : ""}`}
          onClick={() => setActiveSection("payment")}
        >
          <i className="ti ti-coin-rupee" />
          Payments
        </div>

        <div
          className={`nav-item ${
            isActive("payment-allocation") ? "active" : ""
          }`}
          onClick={() => setActiveSection("payment-allocation")}
        >
          <i className="ti ti-arrows-transfer-up" />
          Payment Allocation
        </div>
      </div>

      <div className="divider" />

      <div className="nav-group">
        <div className="nav-label">APPLICATION</div>

        <div
          className={`nav-item ${isActive("dashboard") ? "active" : ""}`}
          onClick={() => setActiveSection("dashboard")}
        >
          <i className="ti ti-layout-dashboard" />
          Dashboard
        </div>

        <div
          className={`nav-item ${isActive("reports") ? "active" : ""}`}
          onClick={() => setActiveSection("reports")}
        >
          <i className="ti ti-chart-bar" />
          Reports
        </div>

        <div
          className={`nav-item ${isActive("settings") ? "active" : ""}`}
          onClick={() => setActiveSection("settings")}
        >
          <i className="ti ti-settings" />
          Settings
        </div>

        <div
          className={`nav-item ${isActive("about") ? "active" : ""}`}
          onClick={() => setActiveSection("about")}
        >
          <i className="ti ti-info-circle" />
          About Us
        </div>
      </div>

      <div className="divider" />

      <div className="theme-toggle" onClick={() => setIsDark((prev) => !prev)}>
        <i className={isDark ? "ti ti-moon" : "ti ti-sun"} />

        <span className="tt-label">{isDark ? "Dark Mode" : "Light Mode"}</span>

        <div className="sw" />
      </div>
    </aside>
  );
}
