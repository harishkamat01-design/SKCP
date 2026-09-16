import { useEffect, useState } from "react";
import { apiGet } from "../../../services/api";

function Dashboard() {
  const [productionTrend, setProductionTrend] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    todaysProduction: 0,
    todaysSales: 0,
    finishedGoodsStock: 0,
    rawMaterialStock: 0,
    pendingPayments: 0,
    pendingDeliveries: 0,
    lowRawMaterialCount: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setDashboardData((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      const [
        productionsResult,
        ordersResult,
        orderItemsResult,
        finishedGoodsResult,
        rawMaterialResult,
        paymentAllocationsResult,
      ] = await Promise.all([
        apiGet("/api/productions"),
        apiGet("/api/orders"),
        apiGet("/api/order-items"),
        apiGet("/api/finished-goods-stock"),
        apiGet("/api/raw-material-stock"),
        apiGet("/api/payment-allocations"),
      ]);

      const productions = productionsResult?.data || [];
      const orders = ordersResult?.data || [];
      const orderItems = orderItemsResult?.data || [];
      const finishedGoods = finishedGoodsResult?.data || [];
      const rawMaterials = rawMaterialResult?.data || [];
      const paymentAllocations =
        paymentAllocationsResult?.data || [];

      const today = new Date().toLocaleDateString("en-CA");

      // ============================================================
      // LAST 7 DAYS PRODUCTION TREND
      // ============================================================

      const lastSevenDays = Array.from(
        { length: 7 },
        (_, index) => {
          const date = new Date();

          date.setDate(
            date.getDate() - (6 - index)
          );

          return date.toLocaleDateString("en-CA");
        }
      );

      const productionTrendData = lastSevenDays.map(
        (date) => ({
          date,
          quantity: productions
            .filter(
              (production) =>
                production.productionDate === date &&
                production.status === "COMPLETED"
            )
            .reduce(
              (total, production) =>
                total +
                Number(
                  production.quantityProduced || 0
                ),
              0
            ),
        })
      );

      setProductionTrend(productionTrendData);

      // ============================================================
      // TODAY'S PRODUCTION
      // Only COMPLETED production records for today are included.
      // ============================================================

      const todaysProduction = productions
        .filter(
          (production) =>
            production.productionDate === today &&
            production.status === "COMPLETED"
        )
        .reduce(
          (total, production) =>
            total +
            Number(
              production.quantityProduced || 0
            ),
          0
        );

      // ============================================================
      // ACTIVE / NON-CANCELLED ORDERS
      //
      // GET /api/orders already returns ACTIVE orders only.
      // We still exclude CANCELLED orders from business calculations.
      // ============================================================

      const activeBusinessOrders = orders.filter(
        (order) =>
          order.orderStatus !== "CANCELLED"
      );

      const activeBusinessOrderIds = new Set(
        activeBusinessOrders.map(
          (order) => order.orderId
        )
      );

      // ============================================================
      // TODAY'S SALES
      //
      // Sales value =
      // orderedQuantity Ã— unitSellingPrice
      //
      // The backend already returns ACTIVE order items only.
      // CANCELLED orders are excluded through todaysOrderIds.
      // ============================================================

      const todaysOrderIds = new Set(
        activeBusinessOrders
          .filter(
            (order) =>
              order.orderDate === today
          )
          .map(
            (order) =>
              order.orderId
          )
      );

      const todaysSales = orderItems
        .filter(
          (item) =>
            todaysOrderIds.has(
              item.orderId
            )
        )
        .reduce(
          (total, item) =>
            total +
            Number(
              item.orderedQuantity || 0
            ) *
              Number(
                item.unitSellingPrice || 0
              ),
          0
        );

      // ============================================================
      // FINISHED GOODS STOCK
      //
      // The backend already returns ACTIVE stock records only.
      // Record Status is an internal backend field and is not
      // exposed or evaluated by the frontend.
      //
      // currentStockLevel represents the actual available
      // finished goods quantity.
      // ============================================================

      const finishedGoodsStock =
        finishedGoods.reduce(
          (total, stock) =>
            total +
            Number(
              stock.currentStockLevel || 0
            ),
          0
        );

      // ============================================================
      // RAW MATERIAL STOCK
      //
      // Raw materials use different units such as BAG, TON,
      // CUBIC_METER, etc.
      //
      // Therefore, quantities must NOT be summed.
      // The backend already returns ACTIVE stock records only.
      // Dashboard shows the number of returned stock records.
      // ============================================================

      const rawMaterialStock =
        rawMaterials.length;

      // ============================================================
      // LOW RAW MATERIAL STOCK
      //
      // The backend already filters out inactive records.
      // Dashboard only evaluates the business stock status.
      // ============================================================

      const lowRawMaterialCount =
        rawMaterials.filter(
          (material) =>
            material.stockStatus ===
            "LOW_STOCK"
        ).length;

      // ============================================================
      // ACTIVE BUSINESS ORDER ITEMS
      //
      // The backend already returns ACTIVE order items only.
      // Only items belonging to active, non-cancelled orders
      // are included in the payment calculation.
      // ============================================================

      const activeBusinessOrderItems =
        orderItems.filter(
          (item) =>
            activeBusinessOrderIds.has(
              item.orderId
            )
        );

      const totalOrderValue =
        activeBusinessOrderItems.reduce(
          (total, item) =>
            total +
            Number(
              item.orderedQuantity || 0
            ) *
              Number(
                item.unitSellingPrice || 0
              ),
          0
        );

      // ============================================================
      // PAYMENT ALLOCATIONS
      //
      // The backend already returns ACTIVE payment allocations only.
      // Record Status is an internal backend field and is not
      // evaluated by the frontend.
      //
      // Only allocations belonging to active, non-cancelled orders
      // are included in the pending payment calculation.
      // ============================================================

      const activePaymentAllocations =
        paymentAllocations.filter(
          (allocation) =>
            activeBusinessOrderIds.has(
              allocation.orderId
            )
        );

      const totalAllocatedAmount =
        activePaymentAllocations.reduce(
          (total, allocation) =>
            total +
            Number(
              allocation.allocatedAmount ||
                0
            ),
          0
        );

      const pendingPayments = Math.max(
        0,
        totalOrderValue -
          totalAllocatedAmount
      );

      // ============================================================
      // PENDING DELIVERIES
      //
      // PENDING and PARTIAL orders both require delivery action.
      // COMPLETED and CANCELLED orders are excluded.
      // ============================================================

      const pendingDeliveries =
        activeBusinessOrders.filter(
          (order) =>
            order.orderStatus ===
              "PENDING" ||
            order.orderStatus ===
              "PARTIAL"
        ).length;

      // ============================================================
      // UPDATE DASHBOARD
      // ============================================================

      setDashboardData({
        todaysProduction,
        todaysSales,
        finishedGoodsStock,
        rawMaterialStock,
        pendingPayments,
        pendingDeliveries,
        lowRawMaterialCount,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error(
        "Failed to load dashboard data:",
        error
      );

      setDashboardData((previous) => ({
        ...previous,
        loading: false,
        error:
          error.message ||
          "Failed to load dashboard data.",
      }));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }
    ).format(value || 0);
  };

  const maxProductionTrend = Math.max(
    ...productionTrend.map(
      (item) => item.quantity
    ),
    0
  );

  return (
    <div className="module-container">

      {/* ============================================================
          DASHBOARD HEADER
      ============================================================ */}

      <div className="module-header">

        <h1>
          SKCP Dashboard
        </h1>

        <p>
          Overview of today's production, sales,
          inventory, payments, deliveries, and
          business alerts.
        </p>

      </div>

      {/* ============================================================
          LOADING / ERROR
      ============================================================ */}

      {dashboardData.loading && (
        <div className="dashboard-loading">
          Loading dashboard data...
        </div>
      )}

      {dashboardData.error && (
        <div className="module-card">
          {dashboardData.error}
        </div>
      )}

      {!dashboardData.loading && (
        <div className="dashboard-sections">

          {/* ====================================================
              BUSINESS OVERVIEW
          ==================================================== */}

          <div className="module-card dashboard-overview-card">

            <div className="section-header">

              <div>

                <h2>
                  Business Overview
                </h2>

                <p>
                  Today's key operational information
                </p>

              </div>

            </div>

            <div className="dashboard-kpi-grid">

              {/* Today's Production */}

              <div className="dashboard-kpi-card">

                <div
                  className="dashboard-kpi-icon"
                  role="img"
                  aria-label="Production"
                >
                  &#x1F3ED;</div>

                <div className="dashboard-kpi-content">

                  <div className="dashboard-kpi-label">
                    Today's Production
                  </div>

                  <div className="dashboard-kpi-value">
                    {
                      dashboardData
                        .todaysProduction
                    }
                  </div>

                  <div className="dashboard-kpi-description">
                    Cement Blocks Produced
                  </div>

                </div>

              </div>

              {/* Today's Sales */}

              <div className="dashboard-kpi-card">

                <div
                  className="dashboard-kpi-icon"
                  role="img"
                  aria-label="Sales"
                >
                  &#x1F4B0;</div>

                <div className="dashboard-kpi-content">

                  <div className="dashboard-kpi-label">
                    Today's Sales
                  </div>

                  <div className="dashboard-kpi-value">
                    {formatCurrency(
                      dashboardData
                        .todaysSales
                    )}
                  </div>

                  <div className="dashboard-kpi-description">
                    Sales Value
                  </div>

                </div>

              </div>

              {/* Finished Goods Stock */}

              <div className="dashboard-kpi-card">

                <div
                  className="dashboard-kpi-icon"
                  role="img"
                  aria-label="Finished goods stock"
                >
                  &#x1F4E6;</div>

                <div className="dashboard-kpi-content">

                  <div className="dashboard-kpi-label">
                    Finished Goods Stock
                  </div>

                  <div className="dashboard-kpi-value">
                    {
                      dashboardData
                        .finishedGoodsStock
                    }
                  </div>

                  <div className="dashboard-kpi-description">
                    Available Blocks
                  </div>

                </div>

              </div>

              {/* Raw Material Stock */}

              <div className="dashboard-kpi-card">

                <div
                  className="dashboard-kpi-icon"
                  role="img"
                  aria-label="Raw material stock"
                >
                  &#x1F9F1;</div>

                <div className="dashboard-kpi-content">

                  <div className="dashboard-kpi-label">
                    Raw Material Stock
                  </div>

                  <div className="dashboard-kpi-value">
                    {
                      dashboardData
                        .rawMaterialStock
                    }
                  </div>

                  <div className="dashboard-kpi-description">
                    Active Materials
                  </div>

                </div>

              </div>

              {/* Pending Payments */}

              <div className="dashboard-kpi-card">

                <div
                  className="dashboard-kpi-icon"
                  role="img"
                  aria-label="Pending payments"
                >
                  &#x1F4B3;</div>

                <div className="dashboard-kpi-content">

                  <div className="dashboard-kpi-label">
                    Pending Payments
                  </div>

                  <div className="dashboard-kpi-value">
                    {formatCurrency(
                      dashboardData
                        .pendingPayments
                    )}
                  </div>

                  <div className="dashboard-kpi-description">
                    Outstanding Amount
                  </div>

                </div>

              </div>

              {/* Pending Deliveries */}

              <div className="dashboard-kpi-card">

                <div
                  className="dashboard-kpi-icon"
                  role="img"
                  aria-label="Pending deliveries"
                >
                  &#x1F69A;</div>

                <div className="dashboard-kpi-content">

                  <div className="dashboard-kpi-label">
                    Pending Deliveries
                  </div>

                  <div className="dashboard-kpi-value">
                    {
                      dashboardData
                        .pendingDeliveries
                    }
                  </div>

                  <div className="dashboard-kpi-description">
                    Orders Pending Delivery
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ====================================================
              BUSINESS ALERTS
          ==================================================== */}

          <div className="module-card dashboard-alerts-card">

            <div className="section-header">

              <div>

                <h2>
                  Business Alerts
                </h2>

                <p>
                  Items requiring attention
                </p>

              </div>

            </div>

            <div className="dashboard-alert-grid">

              {/* Pending Payment */}

              <div className="dashboard-alert-item">

                <div
                  className="dashboard-alert-icon"
                  role="img"
                  aria-label="Pending payment"
                >
                  &#x1F4B3;</div>

                <div className="dashboard-alert-content">

                  <div className="dashboard-alert-title">
                    Pending Payment
                  </div>

                  <div className="dashboard-alert-value">
                    {formatCurrency(
                      dashboardData
                        .pendingPayments
                    )}
                  </div>

                  <div className="dashboard-alert-description">
                    Outstanding customer payments
                  </div>

                </div>

              </div>

              {/* Raw Material Status */}

              <div className="dashboard-alert-item">

                <div
                  className="dashboard-alert-icon"
                  role="img"
                  aria-label="Raw material status"
                >
                  &#x1F9F1;</div>

                <div className="dashboard-alert-content">

                  <div className="dashboard-alert-title">
                    Raw Material Status
                  </div>

                  <div className="dashboard-alert-value">
                    {dashboardData
                      .lowRawMaterialCount >
                    0
                      ? `${dashboardData.lowRawMaterialCount} Low`
                      : "All Normal"}
                  </div>

                  <div className="dashboard-alert-description">
                    Raw materials requiring attention
                  </div>

                </div>

              </div>

              {/* Pending Delivery */}

              <div className="dashboard-alert-item">

                <div
                  className="dashboard-alert-icon"
                  role="img"
                  aria-label="Pending delivery"
                >
                  &#x1F69A;</div>

                <div className="dashboard-alert-content">

                  <div className="dashboard-alert-title">
                    Pending Delivery
                  </div>

                  <div className="dashboard-alert-value">
                    {
                      dashboardData
                        .pendingDeliveries
                    }
                  </div>

                  <div className="dashboard-alert-description">
                    Orders awaiting delivery
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ====================================================
              STOCK SNAPSHOT
          ==================================================== */}

          <div className="module-card dashboard-stock-card">

            <div className="section-header">

              <div>

                <h2>
                  Stock Snapshot
                </h2>

                <p>
                  Current inventory position
                </p>

              </div>

            </div>

            <div className="dashboard-stock-grid">

              {/* Finished Goods */}

              <div className="dashboard-stock-item">

                <div
                  className="dashboard-stock-icon"
                  role="img"
                  aria-label="Finished goods"
                >
                  &#x1F4E6;</div>

                <div className="dashboard-stock-content">

                  <div className="dashboard-stock-label">
                    Finished Goods
                  </div>

                  <div className="dashboard-stock-value">
                    {
                      dashboardData
                        .finishedGoodsStock
                    }
                  </div>

                  <div className="dashboard-stock-unit">
                    Total units in stock
                  </div>

                </div>

              </div>

              {/* Raw Materials */}

              <div className="dashboard-stock-item">

                <div
                  className="dashboard-stock-icon"
                  role="img"
                  aria-label="Raw materials"
                >
                  &#x1F9F1;</div>

                <div className="dashboard-stock-content">

                  <div className="dashboard-stock-label">
                    Raw Materials
                  </div>

                  <div className="dashboard-stock-value">
                    {
                      dashboardData
                        .rawMaterialStock
                    }
                  </div>

                  <div className="dashboard-stock-unit">
                    Active stock records
                  </div>

                </div>

              </div>

              {/* Low Stock */}

              <div className="dashboard-stock-item">

                <div
                  className="dashboard-stock-icon"
                  role="img"
                  aria-label="Low stock"
                >
                  &#x26A0;&#xFE0F;</div>

                <div className="dashboard-stock-content">

                  <div className="dashboard-stock-label">
                    Low Stock
                  </div>

                  <div className="dashboard-stock-value">
                    {
                      dashboardData
                        .lowRawMaterialCount
                    }
                  </div>

                  <div className="dashboard-stock-unit">
                    Materials requiring attention
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ====================================================
              PRODUCTION / STOCK TRENDS
          ==================================================== */}

          <div className="module-card dashboard-trends-card">

            <div className="section-header">

              <div>

                <h2>
                  Production / Stock Trends
                </h2>

                <p>
                  Completed production for the last 7 days
                </p>

              </div>

            </div>

            <div className="dashboard-trend-container">

              {productionTrend.length === 0 ? (

                <div className="dashboard-trend-message">
                  No production data available for the last 7 days.
                </div>

              ) : (

                <div className="dashboard-production-trend">

                  {productionTrend.map((item) => {

                    const barHeight =
                      maxProductionTrend > 0
                        ? (item.quantity /
                            maxProductionTrend) *
                          100
                        : 0;

                    const displayDate =
                      new Date(
                        `${item.date}T00:00:00`
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                        }
                      );

                    return (

                      <div
                        className="dashboard-production-day"
                        key={item.date}
                      >

                        <div className="dashboard-production-value">
                          {item.quantity}
                        </div>

                        <div className="dashboard-production-bar-area">

                          <div
                            className="dashboard-production-bar"
                            style={{
                              height: `${Math.max(
                                barHeight,
                                item.quantity >
                                  0
                                  ? 4
                                  : 0
                              )}%`,
                            }}
                          />

                        </div>

                        <div className="dashboard-production-date">
                          {displayDate}
                        </div>

                      </div>

                    );

                  })}

                </div>

              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;