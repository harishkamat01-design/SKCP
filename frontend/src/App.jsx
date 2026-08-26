import { useState } from "react";

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

import Sidebar from "./components/layout/Sidebar";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDark, setIsDark] = useState(false);

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
        return <Order />;

      case "delivery":
        return <Delivery />;

      case "payment":
        return <Payment />;

      case "payment-allocation":
        return <PaymentAllocation />;

      case "dashboard":
        return (
          <div className="card">
            <div className="card-head">
              <div className="card-title">Dashboard</div>
            </div>

            <div className="card-body">
              Welcome to the SKCP Management Portal.
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="card">
            <div className="card-head">
              <div className="card-title">Reports</div>
            </div>

            <div className="card-body">
              Reports module will be implemented here.
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="card">
            <div className="card-head">
              <div className="card-title">Settings</div>
            </div>

            <div className="card-body">
              Settings module will be implemented here.
            </div>
          </div>
        );

      case "about":
        return (
          <div className="card">
            <div className="card-head">
              <div className="card-title">About Us</div>
            </div>

            <div className="card-body">Shree Kundodari Cement Products.</div>
          </div>
        );

      default:
        return (
          <div className="card">
            <div className="card-head">
              <div className="card-title">Dashboard</div>
            </div>

            <div className="card-body">
              Welcome to the SKCP Management Portal.
            </div>
          </div>
        );
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

      reports: "Reports",
      settings: "Settings",
      about: "About Us",
    };

    return titles[activeSection] || "Dashboard";
  };

  return (
    <div className={isDark ? "app dark" : "app"}>
      <Sidebar
        isDark={isDark}
        setIsDark={setIsDark}
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />

      <main className="main">
        <header className="topbar">
          <div className="topbar-title">{getPageTitle()}</div>
        </header>

        <section className="content">{renderActiveSection()}</section>
      </main>
    </div>
  );
}

export default App;
