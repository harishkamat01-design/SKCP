import React from "react";
import NavIcon from "../ui/NavIcon";
import "./Sidebar.css";

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

  const renderNavItem = (section, icon, englishLabel, kannadaLabel) => (
    <button
      key={section}
      type="button"
      className={`nav-item ${isActive(section) ? "active" : ""}`}
      onClick={() => setActiveSection(section)}
      aria-current={isActive(section) ? "page" : undefined}
    >
      <NavIcon type={icon} />
      <span>{isKannada ? kannadaLabel : englishLabel}</span>
    </button>
  );

  const renderNavSection = (title, kannadaTitle, items) => (
    <div className="nav-section" key={title}>
      <div className="nav-section-title">
        {isKannada ? kannadaTitle : title}
      </div>

      {items.map(([section, icon, englishLabel, kannadaLabel]) =>
        renderNavItem(section, icon, englishLabel, kannadaLabel)
      )}
    </div>
  );

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav" aria-label="Main navigation">
        {renderNavSection("1. MASTER DATA", "1. ಮಾಸ್ಟರ್ ಡೇಟಾ", [
          ["customer", "customer", "Customers", "ಗ್ರಾಹಕರು"],
          ["supplier", "supplier", "Suppliers", "ಪೂರೈಕೆದಾರರು"],
          ["product", "product", "Products", "ಉತ್ಪನ್ನಗಳು"],
          ["raw-material", "raw-material", "Raw Materials", "ಕಚ್ಚಾ ವಸ್ತುಗಳು"],
          ["labour", "labour", "Labour", "ಕಾರ್ಮಿಕರು"],
          ["asset", "asset", "Assets", "ಆಸ್ತಿಗಳು"],
        ])}

        {renderNavSection("2. OPERATIONS", "2. ಕಾರ್ಯಾಚರಣೆಗಳು", [
          ["attendance", "attendance", "Attendance", "ಹಾಜರಾತಿ"],
          ["purchase", "purchase", "Purchases", "ಖರೀದಿಗಳು"],
          ["production", "production", "Production", "ಉತ್ಪಾದನೆ"],
        ])}

        {renderNavSection("3. INVENTORY", "3. ದಾಸ್ತಾನು", [
          [
            "raw-material-stock",
            "raw-material",
            "Raw Material Stock",
            "ಕಚ್ಚಾ ವಸ್ತುಗಳ ದಾಸ್ತಾನು",
          ],
          ["curing-stock", "curing-stock", "Curing Stock", "ಕ್ಯೂರಿಂಗ್ ದಾಸ್ತಾನು"],
          [
            "finished-goods-stock",
            "finished-goods-stock",
            "Finished Goods Stock",
            "ಸಿದ್ಧ ಸರಕುಗಳ ದಾಸ್ತಾನು",
          ],
        ])}

        {renderNavSection("4. SALES", "4. ಮಾರಾಟ", [
          ["order", "order", "Orders", "ಆರ್ಡರ್‌ಗಳು"],
          ["delivery", "delivery", "Deliveries", "ವಿತರಣೆಗಳು"],
        ])}

        {renderNavSection("5. FINANCE", "5. ಹಣಕಾಸು", [
          ["payment", "payment", "Payments", "ಪಾವತಿಗಳು"],
          [
            "payment-allocation",
            "payment-allocation",
            "Payment Allocation",
            "ಪಾವತಿ ಹಂಚಿಕೆ",
          ],
        ])}

        {renderNavSection("6. APPLICATION", "6. ಅಪ್ಲಿಕೇಶನ್", [
          ["dashboard", "dashboard", "Dashboard", "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"],
          ["reports", "reports", "SKCP Reports", "SKCP ವರದಿಗಳು"],
          ["statements", "statements", "Statements", "ಹೇಳಿಕೆಗಳು"],
          ["settings", "settings", "Settings", "ಸೆಟ್ಟಿಂಗ್ಸ್"],
          ["about", "about", "About Us", "ನಮ್ಮ ಬಗ್ಗೆ"],
        ])}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setIsDark(!isDark)}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="tt-label">
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>

          <span className={`sw ${isDark ? "on" : ""}`} aria-hidden="true">
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