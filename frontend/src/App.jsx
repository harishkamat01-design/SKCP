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
import NavIcon from "./components/ui/NavIcon";

function App()
{
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

      setIsAuthenticated(false);
    };

    useEffect(() => {
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );

      localStorage.setItem(
        "skcp_theme",
        isDark ? "dark" : "light"
      );
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

    const getUserImage = () => {
      const role = sessionStorage.getItem("skcp_role");

      const userImages = {
        ADMIN: "/assets/Pandurang Timmappa Kamat.png",
        PRODUCTION_MANAGER: "/assets/Rekha Kamat.png",
        B2B: "/assets/Ravi Kamat.png",
        STORE_MANAGER: "/assets/Sunidhi Kamat.png",
        LOGISTICS: "/assets/Harish Kamat.png",
      };

      return userImages[role] || "/assets/skcp-logo.png";
    };

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
          return (
            <Order
              onOpenPayment={handleOpenPayment}
            />
          );

        case "delivery":
          return <Delivery />;

        case "payment":
          return (
            <Payment
              paymentContext={paymentContext}
            />
          );

        case "payment-allocation":
          return <PaymentAllocation />;

        case "dashboard":
          return <Dashboard />;

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

    if (!isAuthenticated) {
      return (
        <Login
          isDark={isDark}
          setIsDark={setIsDark}
          onLogin={() => {
            setIsAuthenticated(true);
          }}
        />
      );
    }

    return (
      <div className={isDark ? "app dark" : "app"}>

        <main className="main">

          <header className="topbar">

            {/* ==================================================
                SKCP BRAND TILE
            ================================================== */}
            <div className="topbar-brand">
              <div className="brand-logo">
                <img
                  src="/assets/skcp-logo.png"
                  alt="SKCP"
                />
              </div>

              <div className="brand-info">
                <div className="brand-name">
                  Shree Kundodari Cement Products
                </div>

                <div className="brand-sub brand-sub-italic">
                  B2B MANAGEMENT PORTAL
                </div>
              </div>
            </div>

            {/* ==================================================
                LANGUAGE + CURRENT PAGE TILE
            ================================================== */}
            <div className="topbar-navigation">

              <div className="topbar-language">
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

              <div className="topbar-title">
                <NavIcon type={getPageIcon()} />
                <span>{getPageTitle()}</span>
              </div>

            </div>

            {/* ==================================================
                USER TILE
            ================================================== */}
            <div className="topbar-user">

              <img
                className="topbar-user-image"
                src={getUserImage()}
                alt={
                  sessionStorage.getItem("skcp_user") || "SKCP User"
                }
              />

              <span>
                {sessionStorage.getItem("skcp_user")} ·{" "}
                {sessionStorage.getItem("skcp_role")}
              </span>

            </div>

          </header>

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