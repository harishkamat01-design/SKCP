import React from "react";
import NavIcon from "../ui/NavIcon";

export default function Sidebar({
  isDark,
  setIsDark,
  currentLang,
  setCurrentLang,
  setActiveSection,
  activeSection,
  onLogout,
}) {
  const isActive = (section) => activeSection === section;

  const isKannada = currentLang === "kn";

  return (
    <aside className="sidebar">

      <nav className="sidebar-nav">
        {/* MASTER DATA */}
        <div className="nav-section">
          <div className="nav-section-title">
            {isKannada ? "1. ಮಾಸ್ಟರ್ ಡೇಟಾ" : "1. MASTER DATA"}
          </div>

          <button
            className={`nav-item ${
              isActive("customer") ? "active" : ""
            }`}
            onClick={() => setActiveSection("customer")}
          >
            <NavIcon type="customer" />
            {isKannada ? "ಗ್ರಾಹಕರು" : "Customers"}
          </button>

          <button
            className={`nav-item ${
              isActive("supplier") ? "active" : ""
            }`}
            onClick={() => setActiveSection("supplier")}
          >
             <NavIcon type="supplier" />
            {isKannada ? "ಪೂರೈಕೆದಾರರು" : "Suppliers"}
          </button>

          <button
            className={`nav-item ${
              isActive("product") ? "active" : ""
            }`}
            onClick={() => setActiveSection("product")}
          >
            <NavIcon type="product" />
            {isKannada ? "ಉತ್ಪನ್ನಗಳು" : "Products"}
          </button>

          <button
            className={`nav-item ${
              isActive("raw-material") ? "active" : ""
            }`}
            onClick={() => setActiveSection("raw-material")}
          >
            <NavIcon type="raw-material" />
            {isKannada ? "ಕಚ್ಚಾ ವಸ್ತುಗಳು" : "Raw Materials"}
          </button>

          <button
            className={`nav-item ${
              isActive("labour") ? "active" : ""
            }`}
            onClick={() => setActiveSection("labour")}
          >
            <NavIcon type="labour" />
            {isKannada ? "ಕಾರ್ಮಿಕರು" : "Labour"}
          </button>

          <button
            className={`nav-item ${
              isActive("asset") ? "active" : ""
            }`}
            onClick={() => setActiveSection("asset")}
          >
            <NavIcon type="asset" />
            {isKannada ? "ಆಸ್ತಿಗಳು" : "Assets"}
          </button>
        </div>

        {/* OPERATIONS */}
        <div className="nav-section">
          <div className="nav-section-title">
            {isKannada ? "2. ಕಾರ್ಯಾಚರಣೆಗಳು" : "2. OPERATIONS"}
          </div>

          <button
            className={`nav-item ${
              isActive("attendance") ? "active" : ""
            }`}
            onClick={() => setActiveSection("attendance")}
          >
            <NavIcon type="attendance" />
            {isKannada ? "ಹಾಜರಾತಿ" : "Attendance"}
          </button>

          <button
            className={`nav-item ${
              isActive("purchase") ? "active" : ""
            }`}
            onClick={() => setActiveSection("purchase")}
          >
            <NavIcon type="purchase" />
            {isKannada ? "ಖರೀದಿಗಳು" : "Purchases"}
          </button>

          <button
            className={`nav-item ${
              isActive("production") ? "active" : ""
            }`}
            onClick={() => setActiveSection("production")}
          >
            <NavIcon type="production" />
            {isKannada ? "ಉತ್ಪಾದನೆ" : "Production"}
          </button>
        </div>

        {/* INVENTORY */}
        <div className="nav-section">
          <div className="nav-section-title">
            {isKannada ? "3. ದಾಸ್ತಾನು" : "3. INVENTORY"}
          </div>

          <button
            className={`nav-item ${
              isActive("raw-material-stock") ? "active" : ""
            }`}
            onClick={() => setActiveSection("raw-material-stock")}
          >
            <NavIcon type="raw-material" />
            {isKannada
              ? "ಕಚ್ಚಾ ವಸ್ತುಗಳ ದಾಸ್ತಾನು"
              : "Raw Material Stock"}
          </button>

          <button
            className={`nav-item ${
              isActive("curing-stock") ? "active" : ""
            }`}
            onClick={() => setActiveSection("curing-stock")}
          >
            <NavIcon type="curing-stock" />
            {isKannada ? "ಕ್ಯೂರಿಂಗ್ ದಾಸ್ತಾನು" : "Curing Stock"}
          </button>

          <button
            className={`nav-item ${
              isActive("finished-goods-stock") ? "active" : ""
            }`}
            onClick={() => setActiveSection("finished-goods-stock")}
          >
            <NavIcon type="finished-goods-stock" />
            {isKannada
              ? "ಸಿದ್ಧ ಸರಕುಗಳ ದಾಸ್ತಾನು"
              : "Finished Goods Stock"}
          </button>
        </div>

        {/* SALES */}
        <div className="nav-section">
          <div className="nav-section-title">
            {isKannada ? "4. ಮಾರಾಟ" : "4. SALES"}
          </div>

          <button
            className={`nav-item ${
              isActive("order") ? "active" : ""
            }`}
            onClick={() => setActiveSection("order")}
          >
            <NavIcon type="order" />
            {isKannada ? "ಆರ್ಡರ್‌ಗಳು" : "Orders"}
          </button>

          <button
            className={`nav-item ${
              isActive("delivery") ? "active" : ""
            }`}
            onClick={() => setActiveSection("delivery")}
          >
            <NavIcon type="delivery" />
            {isKannada ? "ವಿತರಣೆಗಳು" : "Deliveries"}
          </button>
        </div>

        {/* FINANCE */}
        <div className="nav-section">
          <div className="nav-section-title">
            {isKannada ? "5. ಹಣಕಾಸು" : "5. FINANCE"}
          </div>

          <button
            className={`nav-item ${
              isActive("payment") ? "active" : ""
            }`}
            onClick={() => setActiveSection("payment")}
          >
            <NavIcon type="payment" />
            {isKannada ? "ಪಾವತಿಗಳು" : "Payments"}
          </button>

          <button
            className={`nav-item ${
              isActive("payment-allocation")
                ? "active"
                : ""
            }`}
            onClick={() => setActiveSection("payment-allocation")}
          >
            <NavIcon type="payment-allocation" />
            {isKannada
              ? "ಪಾವತಿ ಹಂಚಿಕೆ"
              : "Payment Allocation"}
          </button>
        </div>

        {/* APPLICATION */}
        <div className="nav-section">
          <div className="nav-section-title">
            {isKannada ? "6. ಅಪ್ಲಿಕೇಶನ್" : "6. APPLICATION"}
          </div>

          <button
            className={`nav-item ${
              isActive("dashboard") ? "active" : ""
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            <NavIcon type="dashboard" />
            {isKannada ? "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" : "Dashboard"}
          </button>

          <button
            className={`nav-item ${
              isActive("reports") ? "active" : ""
            }`}
            onClick={() => setActiveSection("reports")}
          >
            <NavIcon type="reports" />
            {isKannada ? "SKCP ವರದಿಗಳು" : "SKCP Reports"}
          </button>

          <button
            className={`nav-item ${
              isActive("statements") ? "active" : ""
            }`}
            onClick={() => setActiveSection("statements")}
          >
            <NavIcon type="statements" />
            {isKannada ? "ಹೇಳಿಕೆಗಳು" : "Statements"}
          </button>

          <button
            className={`nav-item ${
              isActive("settings") ? "active" : ""
            }`}
            onClick={() => setActiveSection("settings")}
          >
            <NavIcon type="settings" />
            {isKannada ? "ಸೆಟ್ಟಿಂಗ್ಸ್" : "Settings"}
          </button>

          <button
            className={`nav-item ${
              isActive("about") ? "active" : ""
            }`}
            onClick={() => setActiveSection("about")}
          >
            <NavIcon type="about" />
            {isKannada ? "ನಮ್ಮ ಬಗ್ಗೆ" : "About Us"}
          </button>
        </div>
      </nav>

      {/* THEME + LOGOUT */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setIsDark(!isDark)}
        >
          <span className="tt-label">
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>

          <span className={`sw ${isDark ? "on" : ""}`}>
            <span />
          </span>
        </button>

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          <span className="tt-label">
            {isKannada ? "ಲಾಗ್‌ಔಟ್" : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}