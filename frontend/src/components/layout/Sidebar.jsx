import React from "react";

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
      <div className="brand">
        <div className="brand-row">
          <div className="brand-logo">
            <img src="/assets/skcp-logo.png" alt="SKCP" />
          </div>

          <div>
            <div className="brand-name">
              Shree Kundodari
              <br />
              Cement Products
            </div>

            <div className="brand-sub">B2B MANAGEMENT PORTAL</div>
          </div>
        </div>

        {/* LANGUAGE SELECTOR */}
        <div id="lang-bar">
          <span className="lang-lbl">🌐 Language:</span>

          <button
            type="button"
            className={`lang-btn ${
              currentLang === "en" ? "active" : ""
            }`}
            onClick={() => setCurrentLang("en")}
            aria-pressed={currentLang === "en"}
          >
            English
          </button>

          <button
            type="button"
            className={`lang-btn ${
              currentLang === "kn" ? "active" : ""
            }`}
            onClick={() => setCurrentLang("kn")}
            aria-pressed={currentLang === "kn"}
          >
            ಕನ್ನಡ
          </button>
        </div>
      </div>

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
            {isKannada ? "ಗ್ರಾಹಕರು" : "Customers"}
          </button>

          <button
            className={`nav-item ${
              isActive("supplier") ? "active" : ""
            }`}
            onClick={() => setActiveSection("supplier")}
          >
            {isKannada ? "ಪೂರೈಕೆದಾರರು" : "Suppliers"}
          </button>

          <button
            className={`nav-item ${
              isActive("product") ? "active" : ""
            }`}
            onClick={() => setActiveSection("product")}
          >
            {isKannada ? "ಉತ್ಪನ್ನಗಳು" : "Products"}
          </button>

          <button
            className={`nav-item ${
              isActive("raw-material") ? "active" : ""
            }`}
            onClick={() => setActiveSection("raw-material")}
          >
            {isKannada ? "ಕಚ್ಚಾ ವಸ್ತುಗಳು" : "Raw Materials"}
          </button>

          <button
            className={`nav-item ${
              isActive("labour") ? "active" : ""
            }`}
            onClick={() => setActiveSection("labour")}
          >
            {isKannada ? "ಕಾರ್ಮಿಕರು" : "Labour"}
          </button>

          <button
            className={`nav-item ${
              isActive("asset") ? "active" : ""
            }`}
            onClick={() => setActiveSection("asset")}
          >
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
            {isKannada ? "ಹಾಜರಾತಿ" : "Attendance"}
          </button>

          <button
            className={`nav-item ${
              isActive("purchase") ? "active" : ""
            }`}
            onClick={() => setActiveSection("purchase")}
          >
            {isKannada ? "ಖರೀದಿಗಳು" : "Purchases"}
          </button>

          <button
            className={`nav-item ${
              isActive("production") ? "active" : ""
            }`}
            onClick={() => setActiveSection("production")}
          >
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
            {isKannada ? "ಕ್ಯೂರಿಂಗ್ ದಾಸ್ತಾನು" : "Curing Stock"}
          </button>

          <button
            className={`nav-item ${
              isActive("finished-goods-stock") ? "active" : ""
            }`}
            onClick={() => setActiveSection("finished-goods-stock")}
          >
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
            {isKannada ? "ಆರ್ಡರ್‌ಗಳು" : "Orders"}
          </button>

          <button
            className={`nav-item ${
              isActive("delivery") ? "active" : ""
            }`}
            onClick={() => setActiveSection("delivery")}
          >
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
            {isKannada ? "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" : "Dashboard"}
          </button>

          <button
            className={`nav-item ${
              isActive("reports") ? "active" : ""
            }`}
            onClick={() => setActiveSection("reports")}
          >
            {isKannada ? "ವರದಿಗಳು" : "Reports"}
          </button>

          <button
            className={`nav-item ${
              isActive("settings") ? "active" : ""
            }`}
            onClick={() => setActiveSection("settings")}
          >
            {isKannada ? "ಸೆಟ್ಟಿಂಗ್ಸ್" : "Settings"}
          </button>

          <button
            className={`nav-item ${
              isActive("about") ? "active" : ""
            }`}
            onClick={() => setActiveSection("about")}
          >
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