import "./Dashboard.css";

function Dashboard({ onNavigate }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const navigate = (section) => {
    if (typeof onNavigate === "function") {
      onNavigate(section);
    }
  };

  const sections = [
    {
      id: "sales",
      title: "Sales & Customer Orders",
      heading: "Build relationships. Deliver on promises.",
      description: "Manage customers, orders, payments and deliveries.",
      className: "dcc-section-sales",
      actions: [
        {
          title: "Add Customer",
          description: "Register a new customer",
          icon: "👤",
          section: "customer",
        },
        {
          title: "Create Order",
          description: "Record a customer order",
          icon: "🧾",
          section: "order",
          primary: true,
        },
        {
          title: "Record Payment",
          description: "Enter a customer payment",
          icon: "₹",
          section: "payment",
        },
        {
          title: "Allocate Payment",
          description: "Link payment to an order",
          icon: "↗",
          section: "payment-allocation",
        },
        {
          title: "Create Delivery",
          description: "Manage customer deliveries",
          icon: "🚚",
          section: "delivery",
        },
        {
          title: "View Orders",
          description: "Review customer orders",
          icon: "📋",
          section: "order",
        },
      ],
    },
    {
      id: "stock",
      title: "Purchase & Stock",
      heading: "Keep materials ready. Maintain control.",
      description: "Manage suppliers, purchases and inventory.",
      className: "dcc-section-stock",
      actions: [
        {
          title: "Add Supplier",
          description: "Register a supplier",
          icon: "🤝",
          section: "supplier",
        },
        {
          title: "Create Purchase",
          description: "Record a material purchase",
          icon: "🛒",
          section: "purchase",
        },
        {
          title: "Add Raw Material Stock",
          description: "Record incoming stock",
          icon: "🧱",
          section: "raw-material-stock",
          primary: true,
        },
        {
          title: "View Raw Material Stock",
          description: "Review available materials",
          icon: "📦",
          section: "raw-material-stock",
        },
        {
          title: "Manage Curing Stock",
          description: "Track blocks during curing",
          icon: "⏳",
          section: "curing-stock",
        },
        {
          title: "Finished Goods Stock",
          description: "Review ready products",
          icon: "🏗️",
          section: "finished-goods-stock",
        },
      ],
    },
    {
      id: "quick",
      title: "Quick Access",
      heading: "Everything you need. One click away.",
      description: "Open other frequently used business modules.",
      className: "dcc-section-quick",
      actions: [
        {
          title: "Add Labour",
          description: "Register a labourer",
          icon: "👷",
          section: "labour",
        },
        {
          title: "Reports",
          description: "Review business reports",
          icon: "📊",
          section: "reports",
        },
        {
          title: "Customer Statements",
          description: "Review customer statements",
          icon: "📄",
          section: "statements",
        },
        {
          title: "Items Needing Attention",
          description: "Review raw material stock",
          icon: "🔎",
          section: "raw-material-stock",
        },
      ],
    },
  ];

  return (
    <div className="page skcp-control-centre">
      <header className="dcc-header">
        <div className="dcc-header-copy">
          <p className="dcc-eyebrow">
            SHREE KUNDODARI CEMENT PRODUCTS
          </p>

          <h1>Business Centre</h1>

          <p className="dcc-subtitle">
            Your daily business activities, all in one place.
          </p>
        </div>

        <div className="dcc-date">
          <span className="dcc-date-label">Today</span>
          <strong>{today}</strong>
          <span className="dcc-date-note">
            Hare Srinivasa Hare Venkatesha 🙏
          </span>
        </div>
      </header>

      {/* 01 · DAILY WORK */}
      <section className="dcc-section dcc-section-daily">
        <div className="dcc-section-heading">
          <div>
            <span className="dcc-section-kicker">
              01 · DAILY WORK
            </span>

            <h2>Start the day. Finish the work.</h2>

            <p>
              Quick access to your two essential daily activities.
            </p>
          </div>
        </div>

        <div className="dcc-daily-grid">
          <button
            type="button"
            className="dcc-action dcc-action-primary dcc-action-green"
            onClick={() => navigate("attendance")}
          >
            <span className="dcc-action-icon" aria-hidden="true">
              👷
            </span>

            <span className="dcc-action-content">
              <strong>Take Attendance</strong>
              <span>
                Start the day by recording labour attendance.
              </span>
              <span className="dcc-action-link">
                Open Attendance →
              </span>
            </span>

            <span className="dcc-action-arrow" aria-hidden="true">
              →
            </span>
          </button>

          <button
            type="button"
            className="dcc-action dcc-action-primary dcc-action-blue"
            onClick={() => navigate("production")}
          >
            <span className="dcc-action-icon" aria-hidden="true">
              🧱
            </span>

            <span className="dcc-action-content">
              <strong>Add Production</strong>
              <span>
                Record the blocks produced for the day.
              </span>
              <span className="dcc-action-link">
                Open Production →
              </span>
            </span>

            <span className="dcc-action-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </section>

      {/* 02 · SALES & CUSTOMER ORDERS
          03 · PURCHASE & STOCK
          04 · QUICK ACCESS */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          className={`dcc-section ${section.className}`}
        >
          <div className="dcc-section-heading">
            <div>
              <span className="dcc-section-kicker">
                {String(index + 2).padStart(2, "0")} ·{" "}
                {section.title.toUpperCase()}
              </span>

              <h2>{section.heading}</h2>

              <p>{section.description}</p>
            </div>
          </div>

          <div className="dcc-action-grid">
            {section.actions.map((action) => (
              <button
                key={`${section.id}-${action.title}`}
                type="button"
                className={`dcc-action ${
                  action.primary ? "dcc-action-primary" : ""
                }`}
                onClick={() => navigate(action.section)}
              >
                <span className="dcc-action-icon" aria-hidden="true">
                  {action.icon}
                </span>

                <span className="dcc-action-content">
                  <strong>{action.title}</strong>
                  <span>{action.description}</span>
                </span>

                <span className="dcc-action-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      <footer className="dcc-footer">
        <span>SKCP · Business Centre</span>
        <span>Quality first</span>
        <span>Every block matters</span>
      </footer>
    </div>
  );
}

export default Dashboard;

