import { useEffect, useState } from "react";
import Login from "./components/auth/Login";

import Customer from "./components/master-data/customer/Customer";
import Supplier from "./components/master-data/supplier/Supplier";
import Product from "./components/master-data/product/Product";
import RawMaterial from "./components/master-data/rawmaterial/RawMaterial";
import Labour from "./components/master-data/labour/Labour";
import Asset from "./components/master-data/asset/Asset";

import Purchase from "./components/procurement/purchase/Purchase";

import Production from "./components/production/production/Production";
import Attendance from "./components/production/attendance/Attendance";

import RawMaterialStock from "./components/inventory/rawmaterialstock/RawMaterialStock";
import CuringStock from "./components/inventory/curingstock/CuringStock";
import FinishedGoodsStock from "./components/inventory/finishedgoodsstock/FinishedGoodsStock";

import Order from "./components/sales/order/Order";
import Delivery from "./components/sales/delivery/Delivery";

import Payment from "./components/payment/payment/Payment";
import PaymentAllocation from "./components/payment/paymentallocation/PaymentAllocation";

import Dashboard from "./components/application/dashboard/Dashboard";
import Reports from "./components/application/reports/Reports";
import Statements from "./components/application/statements/Statements";
import Settings from "./components/application/settings/Settings";
import AboutUs from "./components/application/aboutus/AboutUs";

import Sidebar from "./components/layout/Sidebar";
import "./components/layout/Topbar.css";
import NavIcon from "./components/ui/NavIcon";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [paymentContext, setPaymentContext] = useState(null);

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("skcp_theme") === "dark"
  );

  const [currentLang, setCurrentLang] = useState("en");

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(sessionStorage.getItem("skcp_token"))
  );

  const handleLogout = () => {
    sessionStorage.removeItem("skcp_token");
    sessionStorage.removeItem("skcp_user");
    sessionStorage.removeItem("skcp_role");
    sessionStorage.removeItem("skcp_user_id");

    // Reset application navigation and context.
    setActiveSection("dashboard");
    setPaymentContext(null);

    setIsAuthenticated(false);
};

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );

    localStorage.setItem("skcp_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleOpenPayment = (context) => {
    console.log("OPEN PAYMENT CONTEXT:", context);

    setPaymentContext(context);
    setActiveSection("payment");
  };

  const handleSectionChange = (section) => {
    if (section === "payment") {
      setPaymentContext(null);
    }

    setActiveSection(section);
  };

  // ==================================================
  // LOGGED-IN USER PROFILE
  // ==================================================

  const getUserProfile = () => {
    const username = (
      sessionStorage.getItem("skcp_user") || ""
    ).trim();

    const role = (
      sessionStorage.getItem("skcp_role") || ""
    ).trim().toUpperCase();

    const normalizedUsername = username.toLowerCase();

    const profiles = {
      PRODUCTION_MANAGER: {
        name: "Rekha Kamat",
        designation: "Production Manager",
        image: "/assets/Rekha Kamat.png",
        roleLabel: "Production Manager",
      },

      B2B: {
        name: "Ravi Kamat",
        designation: "Sales Executive, B2B Sales & Orders",
        image: "/assets/Ravi Kamat.png",
        roleLabel: "B2B",
      },

      STORE_MANAGER: {
        name: "Sunidhi Kamat",
        designation: "Store Manager",
        image: "/assets/Sunidhi Kamat.png",
        roleLabel: "Store Manager",
      },

      LOGISTICS: {
        name: "Harish Kamat",
        designation: "Logistics",
        image: "/assets/Harish Kamat.png",
        roleLabel: "Logistics",
      },
    };

    if (role === "ADMIN") {
      if (normalizedUsername.includes("padma")) {
        return {
          name: "Padma Pandurang Kamat",
          designation: "Proprietor, Founder & Director",
          image: "/assets/Padma Pandurang Kamat.png",
          roleLabel: "Admin",
        };
      }

      return {
        name: "Pandurang Timmappa Kamat",
        designation: "Proprietor, Founder & Director",
        image: "/assets/Pandurang Timmappa Kamat.png",
        roleLabel: "Admin",
      };
    }

    return (
      profiles[role] || {
        name: username || "SKCP User",
        designation: "SKCP Team",
        image: "/assets/skcp-logo.png",
        roleLabel: role || "User",
      }
    );
  };

  // ==================================================
  // ACTIVE MODULE CONTENT
  // ==================================================

  const renderActiveSection = () => {
    switch (activeSection) {
      case "customer":
        return <Customer />;
      case "supplier":
        return <Supplier />;
      case "product":
        return <Product />;
      case "raw-material":
        return <RawMaterial />;
      case "labour":
        return <Labour />;
      case "asset":
        return <Asset />;
      case "attendance":
        return <Attendance />;
      case "purchase":
        return <Purchase />;
      case "production":
        return <Production />;
      case "raw-material-stock":
        return <RawMaterialStock />;
      case "curing-stock":
        return <CuringStock />;
      case "finished-goods-stock":
        return <FinishedGoodsStock />;
      case "order":
        return <Order onOpenPayment={handleOpenPayment} />;
      case "delivery":
        return <Delivery />;
      case "payment":
        return <Payment paymentContext={paymentContext} />;
      case "payment-allocation":
        return <PaymentAllocation />;
      case "dashboard":
        return <Dashboard onNavigate={handleSectionChange} />;
      case "reports":
        return <Reports />;
      case "statements":
        return <Statements />;
      case "settings":
        return <Settings />;
      case "about":
        return <AboutUs />;
      default:
        return <Dashboard />;
    }
  };

  // ==================================================
  // MODULE TITLE AND ICON
  // ==================================================

  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      customer: "Customers",
      supplier: "Suppliers",
      product: "Products",
      "raw-material": "Raw Materials",
      labour: "Labour",
      asset: "Assets",
      attendance: "Attendance",
      purchase: "Purchases",
      production: "Production",
      "raw-material-stock": "Raw Material Stock",
      "curing-stock": "Curing Stock",
      "finished-goods-stock": "Finished Goods Stock",
      order: "Orders",
      delivery: "Deliveries",
      payment: "Payments",
      "payment-allocation": "Payment Allocation",
      reports: "SKCP Reports",
      statements: "Statements",
      settings: "Settings",
      about: "About Us",
    };

    return titles[activeSection] || "Dashboard";
  };

  const getPageIcon = () => {
    const icons = {
      dashboard: "dashboard",
      customer: "customer",
      supplier: "supplier",
      product: "product",
      "raw-material": "raw-material",
      labour: "labour",
      asset: "asset",
      attendance: "attendance",
      purchase: "purchase",
      production: "production",
      "raw-material-stock": "raw-material-stock",
      "curing-stock": "curing-stock",
      "finished-goods-stock": "finished-goods-stock",
      order: "order",
      delivery: "delivery",
      payment: "payment",
      "payment-allocation": "payment-allocation",
      reports: "reports",
      statements: "statements",
      settings: "settings",
      about: "about",
    };

    return icons[activeSection] || "dashboard";
  };

  // ==================================================
  // LOGIN SCREEN
  // ==================================================

  if (!isAuthenticated) {
    return (
      <Login
        isDark={isDark}
        setIsDark={setIsDark}
        onLogin={() => {
    setActiveSection("dashboard");
    setPaymentContext(null);
    setIsAuthenticated(true);
}}
      />
    );
  }

  const userProfile = getUserProfile();

  // ==================================================
  // MAIN APPLICATION
  // ==================================================

  return (
    <div className={isDark ? "app dark" : "app"}>
      <main className="main">
        {/* SKCP TOPBAR — ONE OUTER TILE, THREE INNER SECTIONS */}
        <header className="topbar">
          {/* SECTION 1: COMPANY BRAND + LANGUAGE SELECTION */}
          <div className="topbar-brand">
            <div className="brand-logo">
              <img src="/assets/skcp-logo.png" alt="SKCP Logo" />
            </div>

            <div className="brand-info">
              <div className="brand-name">
                Shree Kundodari Cement Products
              </div>

              <div className="brand-sub">
                <span className="brand-portal-label">
                  Admin Portal
                </span>

                <div
                  className="brand-language"
                  aria-label="Language selection"
                >
                  <button
                    type="button"
                    className={`lang-btn ${
                      currentLang === "en" ? "active" : ""
                    }`}
                    onClick={() => setCurrentLang("en")}
                    aria-pressed={currentLang === "en"}
                    aria-label="Select English"
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
                    aria-label="ಕನ್ನಡ ಆಯ್ಕೆಮಾಡಿ"
                  >
                    ಕನ್ನಡ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CURRENT MODULE */}
          <div className="topbar-navigation">
            <div className="topbar-title">
              <NavIcon type={getPageIcon()} />
              <span>{getPageTitle()}</span>
            </div>
          </div>

          {/* SECTION 3: USER PROFILE */}
          <div className="topbar-user">
            <img
              className="topbar-user-image"
              src={userProfile.image}
              alt={userProfile.name}
            />

            <div className="topbar-user-info">
              <div
                className="topbar-user-name"
                title={userProfile.name}
              >
                {userProfile.name}
              </div>

              <div
                className="topbar-user-designation"
                title={userProfile.designation}
              >
                {userProfile.designation}
              </div>

              <div className="topbar-user-bottom-row">
                <span className="topbar-user-role">
                  {userProfile.roleLabel}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* SIDEBAR AND APPLICATION CONTENT */}
        <section className="content">
          <Sidebar
            isDark={isDark}
            setIsDark={setIsDark}
            currentLang={currentLang}
            setCurrentLang={setCurrentLang}
            setActiveSection={handleSectionChange}
            activeSection={activeSection}
            onLogout={handleLogout}
          />

          <div className="application-content">
            {renderActiveSection()}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
