import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../../services/api";

function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentAllocations, setPaymentAllocations] = useState([]);
  const [productions, setProductions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [finishedGoodsStock, setFinishedGoodsStock] = useState([]);
  const [rawMaterialStock, setRawMaterialStock] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        ordersResult,
        orderItemsResult,
        customersResult,
        paymentsResult,
        paymentAllocationsResult,
        productionsResult,
        attendanceResult,
        finishedGoodsStockResult,
        rawMaterialStockResult,
      ] = await Promise.all([
        apiGet("/api/orders"),
        apiGet("/api/order-items"),
        apiGet("/api/customers"),
        apiGet("/api/payments"),
        apiGet("/api/payment-allocations"),
        apiGet("/api/productions"),
        apiGet("/api/attendance"),
        apiGet("/api/finished-goods-stock"),
        apiGet("/api/raw-material-stock"),
      ]);

      setOrders(ordersResult?.data || []);
      setOrderItems(orderItemsResult?.data || []);
      setCustomers(customersResult?.data || []);
      setPayments(paymentsResult?.data || []);
      setPaymentAllocations(
        paymentAllocationsResult?.data || []
      );
      setProductions(productionsResult?.data || []);
      setAttendance(attendanceResult?.data || []);
      setFinishedGoodsStock(
        finishedGoodsStockResult?.data || []
      );
      setRawMaterialStock(
        rawMaterialStockResult?.data || []
      );
    } catch (err) {
      console.error("Failed to load report data:", err);

      setError(
        err.message ||
          "Failed to load report data."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(value) || 0);
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(
      (item) =>
        item.customerId === customerId
    );

    return (
      customer?.customerName ||
      `Customer #${customerId}`
    );
  };

  const isWithinDateRange = (date) => {
    if (!date) {
      return false;
    }

    if (fromDate && date < fromDate) {
      return false;
    }

    if (toDate && date > toDate) {
      return false;
    }

    return true;
  };

  const activeOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.orderStatus !== "CANCELLED"
    );
  }, [orders]);

  /* ============================================================
     SALES REPORT
  ============================================================ */

  const salesReport = useMemo(() => {
    const filteredOrders = activeOrders.filter(
      (order) =>
        isWithinDateRange(order.orderDate)
    );

    const filteredOrderIds = new Set(
      filteredOrders.map(
        (order) => order.orderId
      )
    );

    const rows = orderItems
      .filter((item) =>
        filteredOrderIds.has(item.orderId)
      )
      .map((item) => {
        const order = filteredOrders.find(
          (currentOrder) =>
            currentOrder.orderId ===
            item.orderId
        );

        const quantity =
          Number(
            item.orderedQuantity
          ) || 0;

        const unitPrice =
          Number(
            item.unitSellingPrice
          ) || 0;

        const salesValue =
          quantity * unitPrice;

        return {
          ...item,
          orderDate:
            order?.orderDate || "",
          customerId:
            order?.customerId || null,
          customerName:
            getCustomerName(
              order?.customerId
            ),
          quantity,
          unitPrice,
          salesValue,
        };
      });

    const salesValue = rows.reduce(
      (total, row) =>
        total + row.salesValue,
      0
    );

    const unitsSold = rows.reduce(
      (total, row) =>
        total + row.quantity,
      0
    );

    return {
      rows,
      salesValue,
      unitsSold,
      orderCount: filteredOrders.length,
    };
  }, [
    activeOrders,
    orderItems,
    customers,
    fromDate,
    toDate,
  ]);

  /* ============================================================
     PRODUCTION REPORT
  ============================================================ */

  const productionReport = useMemo(() => {
    const rows = productions
      .filter(
        (production) =>
          production.status === "COMPLETED" &&
          isWithinDateRange(
            production.productionDate
          )
      )
      .map((production) => {
        const quantityProduced =
          Number(
            production.quantityProduced
          ) || 0;

        const totalCementBags =
          Number(
            production.totalCementBags
          ) || 0;

        return {
          ...production,
          quantityProduced,
          totalCementBags,
        };
      });

    const totalProduction = rows.reduce(
      (total, row) =>
        total + row.quantityProduced,
      0
    );

    const totalCementBags = rows.reduce(
      (total, row) =>
        total + row.totalCementBags,
      0
    );

    const recordCount = rows.length;

    const averageProduction =
      recordCount > 0
        ? totalProduction / recordCount
        : 0;

    return {
      rows,
      totalProduction,
      totalCementBags,
      recordCount,
      averageProduction,
    };
  }, [
    productions,
    fromDate,
    toDate,
  ]);

  /* ============================================================
     PAYMENT REPORT
  ============================================================ */

  const paymentReport = useMemo(() => {
    const activePayments = payments.filter(
      (payment) =>
        payment.recordStatus === "ACTIVE" &&
        isWithinDateRange(
          payment.paymentDate
        )
    );

    const activePaymentIds = new Set(
      activePayments.map(
        (payment) => payment.paymentId
      )
    );

    const allocationMap = new Map();

    paymentAllocations
      .filter(
        (allocation) =>
          allocation.recordStatus === "ACTIVE" &&
          activePaymentIds.has(
            allocation.paymentId
          )
      )
      .forEach((allocation) => {
        const paymentId =
          allocation.paymentId;

        const allocatedAmount =
          Number(
            allocation.allocatedAmount
          ) || 0;

        const currentAmount =
          allocationMap.get(paymentId) || 0;

        allocationMap.set(
          paymentId,
          currentAmount + allocatedAmount
        );
      });

    const rows = activePayments
      .map((payment) => {
        const amountReceived =
          Number(
            payment.totalAmountReceived
          ) || 0;

        const allocatedAmount =
          allocationMap.get(
            payment.paymentId
          ) || 0;

        const unallocatedAmount =
          Math.max(
            0,
            amountReceived -
              allocatedAmount
          );

        return {
          ...payment,
          customerName:
            getCustomerName(
              payment.customerId
            ),
          amountReceived,
          allocatedAmount,
          unallocatedAmount,
        };
      })
      .sort((a, b) =>
        String(b.paymentDate).localeCompare(
          String(a.paymentDate)
        )
      );

    const totalPaymentsReceived =
      rows.reduce(
        (total, row) =>
          total + row.amountReceived,
        0
      );

    const totalAllocatedAmount =
      rows.reduce(
        (total, row) =>
          total + row.allocatedAmount,
        0
      );

    const totalUnallocatedAmount =
      rows.reduce(
        (total, row) =>
          total + row.unallocatedAmount,
        0
      );

    return {
      rows,
      totalPaymentsReceived,
      totalAllocatedAmount,
      totalUnallocatedAmount,
      transactionCount: rows.length,
    };
  }, [
    payments,
    paymentAllocations,
    customers,
    fromDate,
    toDate,
  ]);

  /* ============================================================
     ATTENDANCE REPORT
  ============================================================ */

  const attendanceReport = useMemo(() => {
    const rows = attendance
      .filter(
        (record) =>
          record.status === "ACTIVE" &&
          isWithinDateRange(
            record.attendanceDate
          )
      )
      .map((record) => ({
        ...record,
        dailyRate:
          Number(record.dailyRate) || 0,
        dailyAmount:
          Number(record.dailyAmount) || 0,
      }))
      .sort((a, b) =>
        String(b.attendanceDate).localeCompare(
          String(a.attendanceDate)
        )
      );

    const totalAttendanceRecords =
      rows.length;

    const presentDays = rows.filter(
      (row) =>
        row.attendanceStatus === "PRESENT"
    ).length;

    const halfDays = rows.filter(
      (row) =>
        row.attendanceStatus === "HALF_DAY"
    ).length;

    const absentDays = rows.filter(
      (row) =>
        row.attendanceStatus === "ABSENT"
    ).length;

    const leaveDays = rows.filter(
      (row) =>
        row.attendanceStatus === "LEAVE"
    ).length;

    const totalAttendanceAmount =
      rows.reduce(
        (total, row) =>
          total + row.dailyAmount,
        0
      );

    return {
      rows,
      totalAttendanceRecords,
      presentDays,
      halfDays,
      absentDays,
      leaveDays,
      totalAttendanceAmount,
    };
  }, [
    attendance,
    fromDate,
    toDate,
  ]);

  /* ============================================================
     PENDING PAYMENTS
  ============================================================ */

  const pendingPayments = useMemo(() => {
    const activeOrderIds = new Set(
      activeOrders.map(
        (order) => order.orderId
      )
    );

    const orderValueMap = new Map();

    orderItems.forEach((item) => {
      if (
        !activeOrderIds.has(
          item.orderId
        )
      ) {
        return;
      }

      const quantity =
        Number(
          item.orderedQuantity
        ) || 0;

      const unitPrice =
        Number(
          item.unitSellingPrice
        ) || 0;

      const itemValue =
        quantity * unitPrice;

      const currentValue =
        orderValueMap.get(
          item.orderId
        ) || 0;

      orderValueMap.set(
        item.orderId,
        currentValue + itemValue
      );
    });

    const allocationMap = new Map();

    paymentAllocations.forEach(
      (allocation) => {
        if (
          !activeOrderIds.has(
            allocation.orderId
          )
        ) {
          return;
        }

        const amount =
          Number(
            allocation.allocatedAmount
          ) || 0;

        const currentAmount =
          allocationMap.get(
            allocation.orderId
          ) || 0;

        allocationMap.set(
          allocation.orderId,
          currentAmount + amount
        );
      }
    );

    let totalPending = 0;

    orderValueMap.forEach(
      (orderValue, orderId) => {
        const allocated =
          allocationMap.get(
            orderId
          ) || 0;

        totalPending += Math.max(
          0,
          orderValue - allocated
        );
      }
    );

    return totalPending;
  }, [
    activeOrders,
    orderItems,
    paymentAllocations,
  ]);

  /* ============================================================
     INVENTORY REPORT
  ============================================================ */

  const inventoryReport = useMemo(() => {
    const activeFinishedGoods =
      finishedGoodsStock.filter(
        (stock) =>
          stock.status !== "INACTIVE"
      );

    const activeRawMaterials =
      rawMaterialStock.filter(
        (stock) =>
          stock.recordStatus === "ACTIVE"
      );

    const finishedGoodsRows =
      activeFinishedGoods
        .map((stock) => {
          const currentStock =
            Number(
              stock.currentStockLevel
            ) || 0;

          const minimumStock =
            Number(
              stock.minimumStockLevel
            ) || 0;

          return {
            ...stock,
            currentStock,
            minimumStock,
          };
        })
        .sort((a, b) =>
          String(
            a.finishedGoodsStockId
          ).localeCompare(
            String(
              b.finishedGoodsStockId
            )
          )
        );

    const rawMaterialRows =
      activeRawMaterials
        .map((stock) => {
          const currentStock =
            Number(
              stock.currentStockLevel
            ) || 0;

          const minimumStock =
            Number(
              stock.minimumStockLevel
            ) || 0;

          return {
            ...stock,
            currentStock,
            minimumStock,
          };
        })
        .sort((a, b) =>
          String(
            a.rawMaterialStockId
          ).localeCompare(
            String(
              b.rawMaterialStockId
            )
          )
        );

    const totalFinishedGoods =
      finishedGoodsRows.reduce(
        (total, row) =>
          total + row.currentStock,
        0
      );

    const finishedGoodsLowStock =
      finishedGoodsRows.filter(
        (row) =>
          row.status === "LOW_STOCK"
      ).length;

    const rawMaterialLowStock =
      rawMaterialRows.filter(
        (row) =>
          row.stockStatus === "LOW_STOCK"
      ).length;

    const totalLowStockItems =
      finishedGoodsLowStock +
      rawMaterialLowStock;

    return {
      finishedGoodsRows,
      rawMaterialRows,
      totalFinishedGoods,
      finishedGoodsCount:
        finishedGoodsRows.length,
      rawMaterialCount:
        rawMaterialRows.length,
      finishedGoodsLowStock,
      rawMaterialLowStock,
      totalLowStockItems,
    };
  }, [
    finishedGoodsStock,
    rawMaterialStock,
  ]);

  const reportTitle = {
    sales: "Sales Report",
    production: "Production Report",
    payment: "Payment Report",
    attendance: "Attendance Report",
    inventory: "Inventory Report",
  }[reportType];

  return (
    <div className="module-container">

      {/* ========================================================
          REPORT HEADER
      ======================================================== */}

      <div className="module-header">
        <h1>Reports</h1>

        <p>
          Operational reports for sales,
          production, payments, attendance,
          and inventory.
        </p>
      </div>

      {/* ========================================================
          LOADING
      ======================================================== */}

      {loading && (
        <div className="dashboard-loading">
          Loading report data...
        </div>
      )}

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div className="module-card">
          <div className="card-body">
            {error}
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* ==================================================
              REPORT FILTERS
          ================================================== */}

          <div className="module-card">
            <div className="section-header">
              <div>
                <h2>
                  Report Filters
                </h2>

                <p>
                  Select the report and
                  reporting period.
                </p>
              </div>
            </div>

            <div className="reports-filter-grid">

              <div className="reports-filter-field">
                <label>
                  Report Type
                </label>

                <select
                  value={reportType}
                  onChange={(event) =>
                    setReportType(
                      event.target.value
                    )
                  }
                >
                  <option value="sales">
                    Sales Report
                  </option>

                  <option value="production">
                    Production Report
                  </option>

                  <option value="payment">
                    Payment Report
                  </option>

                  <option value="attendance">
                    Attendance Report
                  </option>

                  <option value="inventory">
                    Inventory Report
                  </option>
                </select>
              </div>

              <div className="reports-filter-field">
                <label>
                  From Date
                </label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) =>
                    setFromDate(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="reports-filter-field">
                <label>
                  To Date
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(event) =>
                    setToDate(
                      event.target.value
                    )
                  }
                />
              </div>

            </div>
          </div>

          {/* ==================================================
              REPORT SUMMARY
          ================================================== */}

          <div className="module-card">
            <div className="section-header">
              <div>
                <h2>
                  Report Summary
                </h2>

                <p>
                  Calculated from active
                  SKCP business records.
                </p>
              </div>
            </div>

            <div className="kpi-grid">

              {/* ==================================================
                  PRODUCTION SUMMARY
              ================================================== */}

              {reportType === "production" ? (
                <>
                  <div className="kpi g">
                    <div className="kpi-label">
                      Total Production
                    </div>

                    <div className="kpi-val">
                      {productionReport.totalProduction.toLocaleString(
                        "en-IN"
                      )}
                    </div>
                  </div>

                  <div className="kpi b">
                    <div className="kpi-label">
                      Cement Used
                    </div>

                    <div className="kpi-val">
                      {productionReport.totalCementBags.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Production Records
                    </div>

                    <div className="kpi-val">
                      {productionReport.recordCount}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Average Production
                    </div>

                    <div className="kpi-val">
                      {productionReport.averageProduction.toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </div>
                  </div>
                </>

              /* ==================================================
                 PAYMENT SUMMARY
              ================================================== */

              ) : reportType === "payment" ? (
                <>
                  <div className="kpi g">
                    <div className="kpi-label">
                      Total Payments Received
                    </div>

                    <div className="kpi-val">
                      {formatCurrency(
                        paymentReport.totalPaymentsReceived
                      )}
                    </div>
                  </div>

                  <div className="kpi b">
                    <div className="kpi-label">
                      Allocated Amount
                    </div>

                    <div className="kpi-val">
                      {formatCurrency(
                        paymentReport.totalAllocatedAmount
                      )}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Unallocated Amount
                    </div>

                    <div className="kpi-val">
                      {formatCurrency(
                        paymentReport.totalUnallocatedAmount
                      )}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Payment Transactions
                    </div>

                    <div className="kpi-val">
                      {paymentReport.transactionCount}
                    </div>
                  </div>
                </>

              /* ==================================================
                 ATTENDANCE SUMMARY
              ================================================== */

              ) : reportType === "attendance" ? (
                <>
                  <div className="kpi g">
                    <div className="kpi-label">
                      Attendance Records
                    </div>

                    <div className="kpi-val">
                      {attendanceReport.totalAttendanceRecords}
                    </div>
                  </div>

                  <div className="kpi b">
                    <div className="kpi-label">
                      Present Days
                    </div>

                    <div className="kpi-val">
                      {attendanceReport.presentDays}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Half Days
                    </div>

                    <div className="kpi-val">
                      {attendanceReport.halfDays}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Absent / Leave
                    </div>

                    <div className="kpi-val">
                      {attendanceReport.absentDays +
                        attendanceReport.leaveDays}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Attendance Amount
                    </div>

                    <div className="kpi-val">
                      {formatCurrency(
                        attendanceReport.totalAttendanceAmount
                      )}
                    </div>
                  </div>
                </>

              /* ==================================================
                 INVENTORY SUMMARY
              ================================================== */

              ) : reportType === "inventory" ? (
                <>
                  <div className="kpi g">
                    <div className="kpi-label">
                      Finished Goods Units
                    </div>

                    <div className="kpi-val">
                      {inventoryReport.totalFinishedGoods.toLocaleString(
                        "en-IN"
                      )}
                    </div>
                  </div>

                  <div className="kpi b">
                    <div className="kpi-label">
                      Finished Goods Items
                    </div>

                    <div className="kpi-val">
                      {inventoryReport.finishedGoodsCount}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Raw Material Items
                    </div>

                    <div className="kpi-val">
                      {inventoryReport.rawMaterialCount}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Low Stock Items
                    </div>

                    <div className="kpi-val">
                      {inventoryReport.totalLowStockItems}
                    </div>
                  </div>
                </>

              /* ==================================================
                 SALES SUMMARY
              ================================================== */

              ) : (
                <>
                  <div className="kpi g">
                    <div className="kpi-label">
                      Sales Value
                    </div>

                    <div className="kpi-val">
                      {formatCurrency(
                        salesReport.salesValue
                      )}
                    </div>
                  </div>

                  <div className="kpi b">
                    <div className="kpi-label">
                      Units Sold
                    </div>

                    <div className="kpi-val">
                      {salesReport.unitsSold.toLocaleString(
                        "en-IN"
                      )}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Orders
                    </div>

                    <div className="kpi-val">
                      {salesReport.orderCount}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Pending Payments
                    </div>

                    <div className="kpi-val">
                      {formatCurrency(
                        pendingPayments
                      )}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* ==================================================
              SELECTED REPORT
          ================================================== */}

          <div className="module-card">
            <div className="section-header">
              <div>
                <h2>
                  {reportTitle}
                </h2>

                <p>
                  {fromDate || toDate
                    ? `${fromDate || "Start"} to ${
                        toDate || "Today"
                      }`
                    : "All available records"}
                </p>
              </div>
            </div>

            {/* ==================================================
                SALES REPORT
            ================================================== */}

            {reportType === "sales" && (
              <div className="table-wrap">

                {salesReport.rows.length === 0 ? (
                  <div className="card-body">
                    No sales data available
                    for the selected period.
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Date
                        </th>

                        <th>
                          Order ID
                        </th>

                        <th>
                          Customer
                        </th>

                        <th>
                          Product ID
                        </th>

                        <th>
                          Quantity
                        </th>

                        <th>
                          Unit Price
                        </th>

                        <th>
                          Sales Value
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {salesReport.rows.map(
                        (row) => (
                          <tr
                            key={
                              row.orderItemId
                            }
                          >
                            <td>
                              {formatDate(
                                row.orderDate
                              )}
                            </td>

                            <td>
                              #{row.orderId}
                            </td>

                            <td>
                              {row.customerName}
                            </td>

                            <td>
                              {row.productId}
                            </td>

                            <td>
                              {row.quantity.toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td>
                              {formatCurrency(
                                row.unitPrice
                              )}
                            </td>

                            <td>
                              {formatCurrency(
                                row.salesValue
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}

              </div>
            )}

            {/* ==================================================
                PRODUCTION REPORT
            ================================================== */}

            {reportType === "production" && (
              <div className="table-wrap">

                {productionReport.rows.length === 0 ? (
                  <div className="card-body">
                    No production data available
                    for the selected period.
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Date
                        </th>

                        <th>
                          Production ID
                        </th>

                        <th>
                          Product
                        </th>

                        <th>
                          Size
                        </th>

                        <th>
                          Quantity Produced
                        </th>

                        <th>
                          Cement Bags
                        </th>

                        <th>
                          Asset / Machine
                        </th>

                        <th>
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {productionReport.rows.map(
                        (row) => (
                          <tr
                            key={
                              row.productionId
                            }
                          >
                            <td>
                              {formatDate(
                                row.productionDate
                              )}
                            </td>

                            <td>
                              #{row.productionId}
                            </td>

                            <td>
                              {row.productName || "-"}
                            </td>

                            <td>
                              {row.productSize || "-"}
                            </td>

                            <td>
                              {Number(
                                row.quantityProduced || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td>
                              {Number(
                                row.totalCementBags || 0
                              ).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </td>

                            <td>
                              {row.assetName || "-"}
                            </td>

                            <td>
                              <span className="status active">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}

              </div>
            )}

            {/* ==================================================
                PAYMENT REPORT
            ================================================== */}

            {reportType === "payment" && (
              <div className="table-wrap">

                {paymentReport.rows.length === 0 ? (
                  <div className="card-body">
                    No payment data available
                    for the selected period.
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Date
                        </th>

                        <th>
                          Payment ID
                        </th>

                        <th>
                          Customer
                        </th>

                        <th>
                          Payment Mode
                        </th>

                        <th>
                          Amount Received
                        </th>

                        <th>
                          Allocated
                        </th>

                        <th>
                          Unallocated
                        </th>

                        <th>
                          Received By
                        </th>

                        <th>
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {paymentReport.rows.map(
                        (row) => (
                          <tr
                            key={
                              row.paymentId
                            }
                          >
                            <td>
                              {formatDate(
                                row.paymentDate
                              )}
                            </td>

                            <td>
                              #{row.paymentId}
                            </td>

                            <td>
                              {row.customerName}
                            </td>

                            <td>
                              {row.paymentMode || "-"}
                            </td>

                            <td>
                              {formatCurrency(
                                row.amountReceived
                              )}
                            </td>

                            <td>
                              {formatCurrency(
                                row.allocatedAmount
                              )}
                            </td>

                            <td>
                              {formatCurrency(
                                row.unallocatedAmount
                              )}
                            </td>

                            <td>
                              {row.receivedBy || "-"}
                            </td>

                            <td>
                              <span className="status active">
                                {row.recordStatus}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}

              </div>
            )}

            {/* ==================================================
                ATTENDANCE REPORT
            ================================================== */}

            {reportType === "attendance" && (
              <div className="table-wrap">

                {attendanceReport.rows.length === 0 ? (
                  <div className="card-body">
                    No attendance data available
                    for the selected period.
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Date
                        </th>

                        <th>
                          Attendance ID
                        </th>

                        <th>
                          Labour
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Daily Rate
                        </th>

                        <th>
                          Daily Amount
                        </th>

                        <th>
                          Leave Reason
                        </th>

                        <th>
                          Remarks
                        </th>

                        <th>
                          Record Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceReport.rows.map(
                        (row) => (
                          <tr
                            key={
                              row.attendanceId
                            }
                          >
                            <td>
                              {formatDate(
                                row.attendanceDate
                              )}
                            </td>

                            <td>
                              #{row.attendanceId}
                            </td>

                            <td>
                              {row.labourName ||
                                `Labour #${row.labourId}`}
                            </td>

                            <td>
                              <span className="status active">
                                {row.attendanceStatus}
                              </span>
                            </td>

                            <td>
                              {formatCurrency(
                                row.dailyRate
                              )}
                            </td>

                            <td>
                              {formatCurrency(
                                row.dailyAmount
                              )}
                            </td>

                            <td>
                              {row.leaveReason || "-"}
                            </td>

                            <td>
                              {row.remarks || "-"}
                            </td>

                            <td>
                              <span className="status active">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}

              </div>
            )}

            {/* ==================================================
                INVENTORY REPORT
            ================================================== */}

            {reportType === "inventory" && (
              <div>

                {/* ==============================================
                    FINISHED GOODS INVENTORY
                ============================================== */}

                <div className="table-wrap">

                  <div className="section-header">
                    <div>
                      <h3>
                        Finished Goods Inventory
                      </h3>

                      <p>
                        Current finished goods stock
                        by product.
                      </p>
                    </div>
                  </div>

                  {inventoryReport.finishedGoodsRows.length === 0 ? (
                    <div className="card-body">
                      No finished goods inventory
                      records available.
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>
                            Stock ID
                          </th>

                          <th>
                            Product ID
                          </th>

                          <th>
                            Current Stock
                          </th>

                          <th>
                            Minimum Stock
                          </th>

                          <th>
                            Status
                          </th>

                          <th>
                            Last Updated
                          </th>

                          <th>
                            Notes
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {inventoryReport.finishedGoodsRows.map(
                          (row) => (
                            <tr
                              key={
                                row.finishedGoodsStockId
                              }
                            >
                              <td>
                                #{row.finishedGoodsStockId}
                              </td>

                              <td>
                                {row.productId}
                              </td>

                              <td>
                                {row.currentStock.toLocaleString(
                                  "en-IN"
                                )}
                              </td>

                              <td>
                                {row.minimumStock.toLocaleString(
                                  "en-IN"
                                )}
                              </td>

                              <td>
                                <span
                                  className={`status ${
                                    row.status ===
                                    "LOW_STOCK"
                                      ? "warning"
                                      : "active"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </td>

                              <td>
                                {formatDate(
                                  row.lastUpdatedDate
                                )}
                              </td>

                              <td>
                                {row.notes || "-"}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  )}

                </div>

                {/* ==============================================
                    RAW MATERIAL INVENTORY
                ============================================== */}

                <div
                  className="table-wrap"
                  style={{
                    marginTop: "24px",
                  }}
                >

                  <div className="section-header">
                    <div>
                      <h3>
                        Raw Material Inventory
                      </h3>

                      <p>
                        Current raw material stock
                        by material and unit.
                      </p>
                    </div>
                  </div>

                  {inventoryReport.rawMaterialRows.length === 0 ? (
                    <div className="card-body">
                      No raw material inventory
                      records available.
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>
                            Stock ID
                          </th>

                          <th>
                            Raw Material
                          </th>

                          <th>
                            Unit
                          </th>

                          <th>
                            Current Stock
                          </th>

                          <th>
                            Minimum Stock
                          </th>

                          <th>
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {inventoryReport.rawMaterialRows.map(
                          (row) => (
                            <tr
                              key={
                                row.rawMaterialStockId
                              }
                            >
                              <td>
                                #{row.rawMaterialStockId}
                              </td>

                              <td>
                                {row.rawMaterialName ||
                                  `Raw Material #${row.rawMaterialId}`}
                              </td>

                              <td>
                                {row.rawMaterialUnit ||
                                  "-"}
                              </td>

                              <td>
                                {row.currentStock.toLocaleString(
                                  "en-IN",
                                  {
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>

                              <td>
                                {row.minimumStock.toLocaleString(
                                  "en-IN",
                                  {
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>

                              <td>
                                <span
                                  className={`status ${
                                    row.stockStatus ===
                                    "LOW_STOCK"
                                      ? "warning"
                                      : "active"
                                  }`}
                                >
                                  {row.stockStatus}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  )}

                </div>

              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
}

export default Reports;