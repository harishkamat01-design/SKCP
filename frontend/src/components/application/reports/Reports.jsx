import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import "./Reports.css";
import Pagination from "../../../components/ui/Pagination";
import usePagination from "../../../hooks/usePagination";
import useTableSort from "../../../hooks/useTableSort";

import { apiGet } from "../../../services/api";

function Reports() {
  const [reportType, setReportType] =
    useState("sales");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [orders, setOrders] =
    useState([]);

  const [orderItems, setOrderItems] =
    useState([]);

  const [customers, setCustomers] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [paymentAllocations, setPaymentAllocations] =
    useState([]);

  const [productions, setProductions] =
    useState([]);

  const [attendance, setAttendance] =
    useState([]);

  const [finishedGoodsStock, setFinishedGoodsStock] =
    useState([]);

  const [rawMaterialStock, setRawMaterialStock] =
    useState([]);

  const [deliveries, setDeliveries] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

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
        deliveriesResult,
        productsResult,
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
        apiGet("/api/deliveries"),
        apiGet("/api/products"),
      ]);

      setOrders(
        ordersResult?.data || []
      );

      setOrderItems(
        orderItemsResult?.data || []
      );

      setCustomers(
        customersResult?.data || []
      );

      setPayments(
        paymentsResult?.data || []
      );

      setPaymentAllocations(
        paymentAllocationsResult?.data || []
      );

      setProductions(
        productionsResult?.data || []
      );

      setAttendance(
        attendanceResult?.data || []
      );

      setFinishedGoodsStock(
        finishedGoodsStockResult?.data || []
      );

      setRawMaterialStock(
        rawMaterialStockResult?.data || []
      );

      setDeliveries(
        deliveriesResult?.data || []
      );

      setProducts(
        productsResult?.data || []
      );
    } catch (err) {
      console.error(
        "Failed to load report data:",
        err
      );

      setError(
        err.message ||
          "Failed to load report data."
      );
    } finally {
      setLoading(false);
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
    ).format(Number(value) || 0);
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

// ============================================================
// PDF DATE FORMATTER
// ============================================================

const formatPdfDate = (date) => {
    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return String(date);
    }

    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();

    return `${day}-${month}-${year}`;
};



  const getCustomerName = (
    customerId
  ) => {
    const customer = customers.find(
      (item) =>
        item.customerId === customerId
    );

    return (
      customer?.customerName ||
      `Customer #${customerId}`
    );
  };

  const getProduct = (
    productId
  ) => {
    return products.find(
      (product) =>
        product.productId === productId
    );
  };

  const isWithinDateRange = (
    date
  ) => {
    if (!date) {
      return false;
    }

    if (
      fromDate &&
      date < fromDate
    ) {
      return false;
    }

    if (
      toDate &&
      date > toDate
    ) {
      return false;
    }

    return true;
  };

  /* ============================================================
     SORT INDICATOR
  ============================================================ */

  const getSortIndicator = (
    activeSortKey,
    columnKey,
    sortDirection
  ) => {
    if (
      activeSortKey !== columnKey
    ) {
      return "";
    }

    return sortDirection === "asc"
      ? " ?"
      : " ?";
  };

  const activeOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.orderStatus !==
        "CANCELLED"
    );
  }, [orders]);

  /* ============================================================
     SALES REPORT
  ============================================================ */

  const salesReport = useMemo(() => {
    const filteredOrders =
      activeOrders.filter(
        (order) =>
          isWithinDateRange(
            order.orderDate
          )
      );

    const filteredOrderIds =
      new Set(
        filteredOrders.map(
          (order) => order.orderId
        )
      );

    const rows = orderItems
      .filter((item) =>
        filteredOrderIds.has(
          item.orderId
        )
      )
      .map((item) => {
        const order =
          filteredOrders.find(
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

    const salesValue =
      rows.reduce(
        (total, row) =>
          total + row.salesValue,
        0
      );

    const unitsSold =
      rows.reduce(
        (total, row) =>
          total + row.quantity,
        0
      );

    return {
      rows,
      salesValue,
      unitsSold,
      orderCount:
        filteredOrders.length,
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

  const productionReport =
    useMemo(() => {
      const rows = productions
        .filter(
          (production) =>
            production.status ===
              "COMPLETED" &&
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

      const totalProduction =
        rows.reduce(
          (total, row) =>
            total +
            row.quantityProduced,
          0
        );

      const totalCementBags =
        rows.reduce(
          (total, row) =>
            total +
            row.totalCementBags,
          0
        );

      const recordCount =
        rows.length;

      const averageProduction =
        recordCount > 0
          ? totalProduction /
            recordCount
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
    const activePayments =
      payments.filter(
        (payment) =>
          payment.recordStatus ===
            "ACTIVE" &&
          isWithinDateRange(
            payment.paymentDate
          )
      );

    const activePaymentIds =
      new Set(
        activePayments.map(
          (payment) =>
            payment.paymentId
        )
      );

    const allocationMap =
      new Map();

    paymentAllocations
      .filter(
        (allocation) =>
          allocation.recordStatus ===
            "ACTIVE" &&
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
          allocationMap.get(
            paymentId
          ) || 0;

        allocationMap.set(
          paymentId,
          currentAmount +
            allocatedAmount
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
        String(
          b.paymentDate
        ).localeCompare(
          String(a.paymentDate)
        )
      );

    const totalPaymentsReceived =
      rows.reduce(
        (total, row) =>
          total +
          row.amountReceived,
        0
      );

    const totalAllocatedAmount =
      rows.reduce(
        (total, row) =>
          total +
          row.allocatedAmount,
        0
      );

    const totalUnallocatedAmount =
      rows.reduce(
        (total, row) =>
          total +
          row.unallocatedAmount,
        0
      );

    return {
      rows,
      totalPaymentsReceived,
      totalAllocatedAmount,
      totalUnallocatedAmount,
      transactionCount:
        rows.length,
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

  const attendanceReport =
    useMemo(() => {
      const rows = attendance
        .filter(
          (record) =>
            record.status ===
              "ACTIVE" &&
            isWithinDateRange(
              record.attendanceDate
            )
        )
        .map((record) => ({
          ...record,
          dailyRate:
            Number(
              record.dailyRate
            ) || 0,
          dailyAmount:
            Number(
              record.dailyAmount
            ) || 0,
        }))
        .sort((a, b) =>
          String(
            b.attendanceDate
          ).localeCompare(
            String(a.attendanceDate)
          )
        );

      const totalAttendanceRecords =
        rows.length;

      const presentDays =
        rows.filter(
          (row) =>
            row.attendanceStatus ===
            "PRESENT"
        ).length;

      const halfDays =
        rows.filter(
          (row) =>
            row.attendanceStatus ===
            "HALF_DAY"
        ).length;

      const absentDays =
        rows.filter(
          (row) =>
            row.attendanceStatus ===
            "ABSENT"
        ).length;

      const leaveDays =
        rows.filter(
          (row) =>
            row.attendanceStatus ===
            "LEAVE"
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

  const pendingPayments =
    useMemo(() => {
      const activeOrderIds =
        new Set(
          activeOrders.map(
            (order) =>
              order.orderId
          )
        );

      const orderValueMap =
        new Map();

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
          currentValue +
            itemValue
        );
      });

      const allocationMap =
        new Map();

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
        (
          orderValue,
          orderId
        ) => {
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

  const inventoryReport =
    useMemo(() => {
      const activeFinishedGoods =
        finishedGoodsStock.filter(
          (stock) =>
            stock.status !==
            "INACTIVE"
        );

      const activeRawMaterials =
        rawMaterialStock.filter(
          (stock) =>
            stock.recordStatus ===
            "ACTIVE"
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
            row.status ===
            "LOW_STOCK"
        ).length;

      const rawMaterialLowStock =
        rawMaterialRows.filter(
          (row) =>
            row.stockStatus ===
            "LOW_STOCK"
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

  /* ============================================================
     UPCOMING DELIVERIES REPORT
  ============================================================ */

  const upcomingDeliveriesReport =
    useMemo(() => {
      /*
       * Delivery records do not contain quantity per trip.
       *
       * Therefore we do NOT duplicate the complete order
       * quantity for every delivery/trip.
       *
       * Instead:
       * - One report row = one order item.
       * - Delivery dates are collected from the applicable
       *   non-delivered/non-cancelled delivery records.
       * - Required quantity comes from the order item.
       * - Product name and size come from /api/products.
       * - Available stock comes from finished goods stock.
       */

      const activeOrdersMap =
        new Map();

      activeOrders.forEach((order) => {
        activeOrdersMap.set(
          order.orderId,
          order
        );
      });

      const applicableDeliveries =
        deliveries
          .filter(
            (delivery) =>
              delivery.deliveryStatus !==
                "DELIVERED" &&
              delivery.deliveryStatus !==
                "CANCELLED" &&
              activeOrdersMap.has(
                delivery.orderId
              )
          )
          .filter((delivery) =>
            isWithinDateRange(
              delivery.deliveryDate
            )
          );

      const deliveryMap =
        new Map();

      applicableDeliveries.forEach(
        (delivery) => {
          const existing =
            deliveryMap.get(
              delivery.orderId
            ) || [];

          existing.push(
            delivery
          );

          deliveryMap.set(
            delivery.orderId,
            existing
          );
        }
      );

      /*
       * Finished goods stock lookup by product.
       */
      const stockMap =
        new Map();

      finishedGoodsStock
        .filter(
          (stock) =>
            stock.status !==
            "INACTIVE"
        )
        .forEach((stock) => {
          stockMap.set(
            stock.productId,
            Number(
              stock.currentStockLevel
            ) || 0
          );
        });

      /*
       * Build one row per order item.
       */
      const rows = [];

      orderItems.forEach((item) => {
        const order =
          activeOrdersMap.get(
            item.orderId
          );

        if (!order) {
          return;
        }

        const itemDeliveries =
          deliveryMap.get(
            item.orderId
          ) || [];

        if (
          itemDeliveries.length === 0
        ) {
          return;
        }

        const product =
          getProduct(
            item.productId
          );

        const requiredQuantity =
          Number(
            item.orderedQuantity
          ) || 0;

        const currentStock =
          stockMap.get(
            item.productId
          ) || 0;

        const deliveryDates =
          [
            ...new Set(
              itemDeliveries
                .map(
                  (delivery) =>
                    delivery.deliveryDate
                )
                .filter(Boolean)
            ),
          ].sort();

        const deliveryStatuses =
          [
            ...new Set(
              itemDeliveries
                .map(
                  (delivery) =>
                    delivery.deliveryStatus
                )
                .filter(Boolean)
            ),
          ];

        const deliveryStatus =
          deliveryStatuses.length === 1
            ? deliveryStatuses[0]
            : deliveryStatuses.join(
                " / "
              );

        /*
         * For a single order-item row, Production Required
         * is calculated against the current available stock.
         *
         * No trip quantity is assumed because the Delivery
         * API does not provide quantity per trip.
         */
        const productionRequired =
          Math.max(
            0,
            requiredQuantity -
              currentStock
          );

        rows.push({
          ...item,
          deliveryDate:
            deliveryDates.join(", "),
          deliveryDateSort:
            deliveryDates[0] || "",
          orderId:
            item.orderId,
          customerName:
            getCustomerName(
              order.customerId
            ),
          productName:
            product?.productName ||
            `Product #${item.productId}`,
          productSize:
            product?.size || "-",
          requiredQuantity,
          availableStock:
            currentStock,
          productionRequired,
          deliveryStatus,
          tripCount:
            itemDeliveries.length,
          totalTrips:
            Math.max(
              ...itemDeliveries.map(
                (delivery) =>
                  Number(
                    delivery.totalTrips
                  ) || 1
              ),
              1
            ),
        });
      });

      /*
       * Sort initially by delivery date,
       * then order ID, then product ID.
       */
      rows.sort((a, b) => {
        const dateComparison =
          String(
            a.deliveryDateSort
          ).localeCompare(
            String(
              b.deliveryDateSort
            )
          );

        if (
          dateComparison !== 0
        ) {
          return dateComparison;
        }

        const orderComparison =
          Number(a.orderId) -
          Number(b.orderId);

        if (
          orderComparison !== 0
        ) {
          return orderComparison;
        }

        return (
          Number(a.productId) -
          Number(b.productId)
        );
      });

            /*
       * Overall totals for the detailed report.
       */
      const totalRequiredQuantity =
        rows.reduce(
          (total, row) =>
            total +
            row.requiredQuantity,
          0
        );

      const totalProductionRequired =
        rows.reduce(
          (total, row) =>
            total +
            row.productionRequired,
          0
        );

      const totalAvailableStock =
        rows.reduce(
          (total, row) =>
            total +
            row.availableStock,
          0
        );

      /*
       * Size-wise Production Summary
       *
       * Important:
       * Available Stock is taken only once for each
       * product. It is NOT added once for every order
       * requiring the same product.
       */
      const productionSummaryMap =
        new Map();

      rows.forEach((row) => {
        const summaryKey =
          String(row.productId);

        if (
          !productionSummaryMap.has(
            summaryKey
          )
        ) {
          productionSummaryMap.set(
            summaryKey,
            {
              productId:
                row.productId,
              productName:
                row.productName,
              productSize:
                row.productSize,
              requiredQuantity: 0,
              availableStock:
                row.availableStock,
              productionRequired: 0,
            }
          );
        }

        const summary =
          productionSummaryMap.get(
            summaryKey
          );

        summary.requiredQuantity +=
          row.requiredQuantity;
      });

      /*
       * Calculate Production Required once per
       * product/size using the total requirement
       * against the actual available finished stock.
       */
      const productionSummary =
        Array.from(
          productionSummaryMap.values()
        )
          .map((summary) => ({
            ...summary,
            productionRequired:
              Math.max(
                0,
                summary.requiredQuantity -
                  summary.availableStock
              ),
          }))
          .sort((a, b) =>
            String(
              a.productSize
            ).localeCompare(
              String(
                b.productSize
              )
            )
          );

      /*
       * Totals for the Size-wise Production Summary.
       *
       * Available Stock is summed once per product,
       * because each product appears only once in
       * productionSummary.
       */
      const productionSummaryTotals =
        productionSummary.reduce(
          (totals, summary) => ({
            requiredQuantity:
              totals.requiredQuantity +
              summary.requiredQuantity,

            availableStock:
              totals.availableStock +
              summary.availableStock,

            productionRequired:
              totals.productionRequired +
              summary.productionRequired,
          }),
          {
            requiredQuantity: 0,
            availableStock: 0,
            productionRequired: 0,
          }
        );

      const deliveryOrderIds =
        new Set(
          rows.map(
            (row) =>
              row.orderId
          )
        );

      const totalDeliveryOrders =
        deliveryOrderIds.size;

      const deliveryRecordCount =
        applicableDeliveries.length;

      return {
        rows,

        /*
         * Detailed table totals.
         */
        totalRequiredQuantity,
        totalAvailableStock,
        totalProductionRequired,

        /*
         * Size-wise production summary.
         */
        productionSummary,
        productionSummaryTotals,

        totalDeliveryOrders,
        deliveryRecordCount,
      };
    }, [
      activeOrders,
      deliveries,
      orderItems,
      products,
      customers,
      finishedGoodsStock,
      fromDate,
      toDate,
    ]);



    // ============================================================
    // DOWNLOAD UPCOMING DELIVERIES PDF
    // ============================================================

const handleDownloadUpcomingDeliveriesPdf = () => {
  if (
    !upcomingDeliveriesReport ||
    upcomingDeliveriesReport.rows.length === 0
  ) {
    return;
  }

  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  const leftMargin = 12;
  const rightMargin = pageWidth - 12;

  let y = 18;

  const addPageIfNeeded = (requiredHeight = 15) => {
    if (y + requiredHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
      return true;
    }

    return false;
  };

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Shree Kundodari Cement Products",
    leftMargin,
    y
  );

  doc.setFontSize(10);

  doc.text(
    "UPCOMING DELIVERIES",
    rightMargin,
    y,
    { align: "right" }
  );

  y += 9;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const periodText =
    fromDate || toDate
      ? `${formatPdfDate(fromDate)} - ${formatPdfDate(toDate)}`
      : "All Dates";

  doc.text(
    `Report Period: ${periodText}`,
    leftMargin,
    y
  );

  y += 10;

    // ============================================================
  // PRODUCTION SUMMARY BY SIZE
  // ============================================================

  addPageIfNeeded(45);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Production Summary by Size",
    leftMargin,
    y
  );

  y += 8;

  doc.setFontSize(8);

  doc.text("Size", 12, y);
  doc.text("Required Qty", 65, y);
  doc.text("Available Stock", 105, y);
  doc.text("Production Required", 155, y);

  y += 5;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 6;

  doc.setFont("helvetica", "normal");

  upcomingDeliveriesReport.productionSummary.forEach(
    (summary) => {
      addPageIfNeeded(10);

      doc.text(
        String(summary.productSize || "-"),
        12,
        y
      );

      doc.text(
        Number(
          summary.requiredQuantity || 0
        ).toLocaleString("en-IN"),
        65,
        y
      );

      doc.text(
        Number(
          summary.availableStock || 0
        ).toLocaleString("en-IN"),
        105,
        y
      );

      doc.text(
        Number(
          summary.productionRequired || 0
        ).toLocaleString("en-IN"),
        155,
        y
      );

      y += 7;
    }
  );

  y += 2;

  doc.setFont("helvetica", "bold");

  doc.text("TOTAL", 12, y);

  doc.text(
    Number(
      upcomingDeliveriesReport
        .productionSummaryTotals
        .requiredQuantity || 0
    ).toLocaleString("en-IN"),
    65,
    y
  );

  doc.text(
    Number(
      upcomingDeliveriesReport
        .productionSummaryTotals
        .availableStock || 0
    ).toLocaleString("en-IN"),
    105,
    y
  );

  doc.text(
    Number(
      upcomingDeliveriesReport
        .productionSummaryTotals
        .productionRequired || 0
    ).toLocaleString("en-IN"),
    155,
    y
  );

  y += 14;

    // ============================================================
  // DETAILED UPCOMING DELIVERIES
  // ============================================================

  addPageIfNeeded(50);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Detailed Upcoming Deliveries",
    leftMargin,
    y
  );

  y += 8;

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");

  const colDeliveryDate = 12;
  const colOrderId = 33;
  const colCustomer = 48;
  const colProduct = 83;
  const colSize = 110;
  const colRequired = 132;
  const colStock = 151;
  const colProduction = 171;
  const colStatus = 196;

  doc.text(
    "Delivery Date",
    colDeliveryDate,
    y
  );

  doc.text(
    "Order ID",
    colOrderId,
    y
  );

  doc.text(
    "Customer",
    colCustomer,
    y
  );

  doc.text(
    "Product",
    colProduct,
    y
  );

  doc.text(
    "Size",
    colSize,
    y
  );

  doc.text(
    "Required",
    colRequired,
    y
  );

  doc.text(
    "Stock",
    colStock,
    y
  );

  doc.text(
    "Production",
    colProduction,
    y
  );

  doc.text(
    "Status",
    colStatus,
    y
  );

  y += 5;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 6;

  doc.setFont("helvetica", "normal");

  upcomingDeliveriesReport.rows.forEach(
    (row) => {
      addPageIfNeeded(12);

      doc.text(
        formatPdfDate(row.deliveryDateSort),
        colDeliveryDate,
        y
      );

      doc.text(
        `#${String(row.orderId || "-")}`,
        colOrderId,
        y
      );

      doc.text(
        String(row.customerName || "-").substring(0, 18),
        colCustomer,
        y
      );

      doc.text(
        String(row.productName || "-").substring(0, 14),
        colProduct,
        y
      );

      doc.text(
        String(row.productSize || "-"),
        colSize,
        y
      );

      doc.text(
        Number(
          row.requiredQuantity || 0
        ).toLocaleString("en-IN"),
        colRequired,
        y
      );

      doc.text(
        Number(
          row.availableStock || 0
        ).toLocaleString("en-IN"),
        colStock,
        y
      );

      doc.text(
        Number(
          row.productionRequired || 0
        ).toLocaleString("en-IN"),
        colProduction,
        y
      );

      doc.text(
        String(row.deliveryStatus || "-").substring(0, 12),
        colStatus,
        y
      );

      y += 7;
    }
  );

    // ============================================================
  // FOOTER + PAGE NUMBERS
  // ============================================================

  const totalPages =
    doc.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    doc.setPage(page);

    const footerY =
      pageHeight - 10;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text(
      "SKCP - Kumta - 581343, Karnataka",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    doc.text(
      `Page ${page} of ${totalPages}`,
      rightMargin,
      footerY,
      { align: "right" }
    );
  }

  // ============================================================
  // SAVE PDF
  // ============================================================

  const fromPart =
    fromDate
      ? formatPdfDate(fromDate)
      : "All";

  const toPart =
    toDate
      ? formatPdfDate(toDate)
      : "Dates";

  doc.save(
    `SKCP-Upcoming-Deliveries-${fromPart}-to-${toPart}.pdf`
  );
};

// ============================================================
// DOWNLOAD SALES REPORT PDF
// ============================================================

const handleDownloadSalesPdf = () => {
  if (
    !salesReport ||
    salesReport.rows.length === 0
  ) {
    return;
  }

  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  const leftMargin = 12;
  const rightMargin = pageWidth - 12;

  let y = 18;

  const addPageIfNeeded = (requiredHeight = 15) => {
    if (y + requiredHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
      return true;
    }

    return false;
  };

  // ============================================================
  // HEADER
  // ============================================================

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Shree Kundodari Cement Products",
    leftMargin,
    y
  );

  doc.setFontSize(10);

  doc.text(
    "SALES REPORT",
    rightMargin,
    y,
    { align: "right" }
  );

  y += 9;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const periodText =
  fromDate && toDate
    ? `${formatPdfDate(fromDate)} - ${formatPdfDate(toDate)}`
    : fromDate
      ? formatPdfDate(fromDate)
      : toDate
        ? formatPdfDate(toDate)
        : "All Dates";

  doc.text(
    `Report Period: ${periodText}`,
    leftMargin,
    y
  );

  y += 10;

  // ============================================================
  // SALES SUMMARY
  // ============================================================

  addPageIfNeeded(40);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Sales Summary",
    leftMargin,
    y
  );

  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Total Sales Value: ${


      `INR ${Number(
      salesReport.totalSalesValue || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  }`,
    leftMargin,
    y
  );

  doc.text(
    `Units Sold: ${Number(
      salesReport.totalUnitsSold || 0
    ).toLocaleString("en-IN")}`,
    85,
    y
  );

  doc.text(
    `Orders: ${Number(
      salesReport.orderCount || 0
    ).toLocaleString("en-IN")}`,
    150,
    y
  );

  y += 12;

  // ============================================================
  // SALES DETAILS
  // ============================================================

  addPageIfNeeded(50);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Sales Details",
    leftMargin,
    y
  );

  y += 8;

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");

  const colDate = 12;
  const colOrderId = 35;
  const colCustomer = 52;
  const colProduct = 95;
  const colQuantity = 120;
  const colUnitPrice = 145;
  const colSalesValue = 175;

  doc.text(
    "Date",
    colDate,
    y
  );

  doc.text(
    "Order ID",
    colOrderId,
    y
  );

  doc.text(
    "Customer",
    colCustomer,
    y
  );

  doc.text(
    "Product ID",
    colProduct,
    y
  );

  doc.text(
    "Quantity",
    colQuantity,
    y
  );

  doc.text(
    "Unit Price",
    colUnitPrice,
    y
  );

  doc.text(
    "Sales Value",
    colSalesValue,
    y
  );

  y += 5;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 6;

  doc.setFont("helvetica", "normal");

  salesReport.rows.forEach(
    (row) => {
      addPageIfNeeded(12);

      doc.text(
        formatPdfDate(row.orderDate),
        colDate,
        y
      );

      doc.text(
        `#${String(row.orderId || "-")}`,
        colOrderId,
        y
      );

      doc.text(
        String(
          row.customerName || "-"
        ).substring(0, 22),
        colCustomer,
        y
      );

      doc.text(
        String(
          row.productId || "-"
        ),
        colProduct,
        y
      );

      doc.text(
        Number(
          row.quantity || 0
        ).toLocaleString("en-IN"),
        colQuantity,
        y
      );

      doc.text(
        `INR ${Number(
            row.unitPrice || 0
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        colUnitPrice,
        y
      );

      doc.text(
        `INR ${Number(
            row.salesValue || 0
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        colSalesValue,
        y
      );

      y += 7;
    }
  );

  // ============================================================
  // FOOTER + PAGE NUMBERS
  // ============================================================

  const totalPages =
    doc.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    doc.setPage(page);

    const footerY =
      pageHeight - 10;

    doc.setFontSize(8);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "SKCP - Kumta - 581343, Karnataka",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    doc.text(
      `Page ${page} of ${totalPages}`,
      rightMargin,
      footerY,
      { align: "right" }
    );
  }

  // ============================================================
  // SAVE PDF
  // ============================================================

  const fromPart =
    fromDate
      ? formatPdfDate(fromDate)
      : "All";

  const toPart =
    toDate
      ? formatPdfDate(toDate)
      : "Dates";

  doc.save(
    `SKCP-Sales-Report-${fromPart}-to-${toPart}.pdf`
  );
};

// ============================================================
// DOWNLOAD PRODUCTION REPORT PDF
// ============================================================

const handleDownloadProductionPdf = () => {
  if (
    !productionReport ||
    productionReport.rows.length === 0
  ) {
    return;
  }

  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  const leftMargin = 12;
  const rightMargin = pageWidth - 12;

  let y = 18;

  const addPageIfNeeded = (requiredHeight = 15) => {
    if (y + requiredHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
      return true;
    }

    return false;
  };

  // ============================================================
  // HEADER
  // ============================================================

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Shree Kundodari Cement Products",
    leftMargin,
    y
  );

  doc.setFontSize(10);

  doc.text(
    "PRODUCTION REPORT",
    rightMargin,
    y,
    { align: "right" }
  );

  y += 9;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 10;

  doc.setFontSize(10);
  doc.setFont(
    "helvetica",
    "normal"
  );

  const periodText =
    fromDate && toDate
      ? `${formatPdfDate(fromDate)} - ${formatPdfDate(toDate)}`
      : fromDate
        ? formatPdfDate(fromDate)
        : toDate
          ? formatPdfDate(toDate)
          : "All Dates";

  doc.text(
    `Report Period: ${periodText}`,
    leftMargin,
    y
  );

  y += 10;

  // ============================================================
  // PRODUCTION SUMMARY
  // ============================================================

  addPageIfNeeded(40);

  doc.setFontSize(12);
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Production Summary",
    leftMargin,
    y
  );

  y += 8;

  doc.setFontSize(9);
  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    `Total Production: ${Number(
      productionReport.totalProduction || 0
    ).toLocaleString("en-IN")}`,
    leftMargin,
    y
  );

  doc.text(
    `Cement Used: ${Number(
      productionReport.totalCementBags || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    85,
    y
  );

  doc.text(
    `Production Records: ${Number(
      productionReport.recordCount || 0
    ).toLocaleString("en-IN")}`,
    155,
    y
  );

  y += 7;

  doc.text(
    `Average Production: ${Number(
      productionReport.averageProduction || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`,
    leftMargin,
    y
  );

  y += 12;

  // ============================================================
  // PRODUCTION DETAILS
  // ============================================================

  addPageIfNeeded(50);

  doc.setFontSize(12);
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Production Details",
    leftMargin,
    y
  );

  y += 8;

  doc.setFontSize(7);
  doc.setFont(
    "helvetica",
    "bold"
  );

  const colDate = 12;
  const colProductionId = 31;
  const colProduct = 51;
  const colSize = 88;
  const colQuantity = 107;
  const colCement = 130;
  const colAsset = 156;
  const colStatus = 187;

  doc.text(
    "Date",
    colDate,
    y
  );

  doc.text(
    "Production ID",
    colProductionId,
    y
  );

  doc.text(
    "Product",
    colProduct,
    y
  );

  doc.text(
    "Size",
    colSize,
    y
  );

  doc.text(
    "Quantity",
    colQuantity,
    y
  );

  doc.text(
    "Cement Bags",
    colCement,
    y
  );

  doc.text(
    "Asset",
    colAsset,
    y
  );

  doc.text(
    "Status",
    colStatus,
    y
  );

  y += 5;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 6;

  doc.setFont(
    "helvetica",
    "normal"
  );

  productionReport.rows.forEach(
    (row) => {
      addPageIfNeeded(12);

      doc.text(
        formatPdfDate(
          row.productionDate
        ),
        colDate,
        y
      );

      doc.text(
        `#${String(
          row.productionId || "-"
        )}`,
        colProductionId,
        y
      );

      doc.text(
        String(
          row.productName || "-"
        ).substring(0, 18),
        colProduct,
        y
      );

      doc.text(
        String(
          row.productSize || "-"
        ).substring(0, 12),
        colSize,
        y
      );

      doc.text(
        Number(
          row.quantityProduced || 0
        ).toLocaleString("en-IN"),
        colQuantity,
        y
      );

      doc.text(
        Number(
          row.totalCementBags || 0
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        colCement,
        y
      );

      doc.text(
        String(
          row.assetName || "-"
        ).substring(0, 15),
        colAsset,
        y
      );

      doc.text(
        String(
          row.status || "-"
        ).substring(0, 12),
        colStatus,
        y
      );

      y += 7;
    }
  );

  // ============================================================
  // FOOTER + PAGE NUMBERS
  // ============================================================

  const totalPages =
    doc.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    doc.setPage(page);

    const footerY =
      pageHeight - 10;

    doc.setFontSize(8);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "SKCP - Kumta - 581343, Karnataka",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    doc.text(
      `Page ${page} of ${totalPages}`,
      rightMargin,
      footerY,
      { align: "right" }
    );
  }

  // ============================================================
  // SAVE PDF
  // ============================================================

  const fromPart =
    fromDate
      ? formatPdfDate(fromDate)
      : "All";

  const toPart =
    toDate
      ? formatPdfDate(toDate)
      : "Dates";

  doc.save(
    `SKCP-Production-Report-${fromPart}-to-${toPart}.pdf`
  );
};

// ============================================================
// DOWNLOAD PAYMENT REPORT PDF
// ============================================================

const handleDownloadPaymentPdf = () => {
  if (
    !paymentReport ||
    paymentReport.rows.length === 0
  ) {
    return;
  }

  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  const leftMargin = 12;
  const rightMargin = pageWidth - 12;

  let y = 18;

  const addPageIfNeeded = (requiredHeight = 15) => {
    if (y + requiredHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
      return true;
    }

    return false;
  };

  // ============================================================
  // HEADER
  // ============================================================

  doc.setFontSize(20);
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Shree Kundodari Cement Products",
    leftMargin,
    y
  );

  doc.setFontSize(10);

  doc.text(
    "PAYMENT REPORT",
    rightMargin,
    y,
    { align: "right" }
  );

  y += 9;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 10;

  doc.setFontSize(10);
  doc.setFont(
    "helvetica",
    "normal"
  );

  const periodText =
    fromDate && toDate
      ? `${formatPdfDate(fromDate)} - ${formatPdfDate(toDate)}`
      : fromDate
        ? formatPdfDate(fromDate)
        : toDate
          ? formatPdfDate(toDate)
          : "All Dates";

  doc.text(
    `Report Period: ${periodText}`,
    leftMargin,
    y
  );

  y += 10;

  // ============================================================
  // PAYMENT SUMMARY
  // ============================================================

  addPageIfNeeded(45);

  doc.setFontSize(12);
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Payment Summary",
    leftMargin,
    y
  );

  y += 8;

  doc.setFontSize(9);
  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    `Total Payments Received: INR ${Number(
      paymentReport.totalPaymentsReceived || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    leftMargin,
    y
  );

  doc.text(
    `Allocated Amount: INR ${Number(
      paymentReport.totalAllocatedAmount || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    105,
    y
  );

  y += 7;

  doc.text(
    `Unallocated Amount: INR ${Number(
      paymentReport.totalUnallocatedAmount || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    leftMargin,
    y
  );

  doc.text(
    `Payment Transactions: ${Number(
      paymentReport.transactionCount || 0
    ).toLocaleString("en-IN")}`,
    105,
    y
  );

  y += 12;

  // ============================================================
  // PAYMENT DETAILS
  // ============================================================

  addPageIfNeeded(50);

  doc.setFontSize(12);
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Payment Details",
    leftMargin,
    y
  );

  y += 8;

  doc.setFontSize(6.5);
  doc.setFont(
    "helvetica",
    "bold"
  );

  const colDate = 12;
  const colPaymentId = 29;
  const colCustomer = 47;
  const colMode = 82;
  const colReceived = 105;
  const colAllocated = 132;
  const colUnallocated = 160;
  const colReceivedBy = 188;
  const colStatus = 211;

  doc.text(
    "Date",
    colDate,
    y
  );

  doc.text(
    "Payment ID",
    colPaymentId,
    y
  );

  doc.text(
    "Customer",
    colCustomer,
    y
  );

  doc.text(
    "Payment Mode",
    colMode,
    y
  );

  doc.text(
    "Received",
    colReceived,
    y
  );

  doc.text(
    "Allocated",
    colAllocated,
    y
  );

  doc.text(
    "Unallocated",
    colUnallocated,
    y
  );

  doc.text(
    "Received By",
    colReceivedBy,
    y
  );

  doc.text(
    "Status",
    colStatus,
    y
  );

  y += 5;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 6;

  doc.setFont(
    "helvetica",
    "normal"
  );

  paymentReport.rows.forEach(
    (row) => {
      addPageIfNeeded(12);

      doc.text(
        formatPdfDate(
          row.paymentDate
        ),
        colDate,
        y
      );

      doc.text(
        `#${String(
          row.paymentId || "-"
        )}`,
        colPaymentId,
        y
      );

      doc.text(
        String(
          row.customerName || "-"
        ).substring(0, 18),
        colCustomer,
        y
      );

      doc.text(
        String(
          row.paymentMode || "-"
        ).substring(0, 14),
        colMode,
        y
      );

      doc.text(
        `INR ${Number(
          row.amountReceived || 0
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        colReceived,
        y
      );

      doc.text(
        `INR ${Number(
          row.allocatedAmount || 0
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        colAllocated,
        y
      );

      doc.text(
        `INR ${Number(
          row.unallocatedAmount || 0
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        colUnallocated,
        y
      );

      doc.text(
        String(
          row.receivedBy || "-"
        ).substring(0, 12),
        colReceivedBy,
        y
      );

      doc.text(
        String(
          row.recordStatus || "-"
        ).substring(0, 10),
        colStatus,
        y
      );

      y += 7;
    }
  );

  // ============================================================
  // FOOTER + PAGE NUMBERS
  // ============================================================

  const totalPages =
    doc.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    doc.setPage(page);

    const footerY =
      pageHeight - 10;

    doc.setFontSize(8);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "SKCP - Kumta - 581343, Karnataka",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    doc.text(
      `Page ${page} of ${totalPages}`,
      rightMargin,
      footerY,
      { align: "right" }
    );
  }

  // ============================================================
  // SAVE PDF
  // ============================================================

  const fromPart =
    fromDate
      ? formatPdfDate(fromDate)
      : "All";

  const toPart =
    toDate
      ? formatPdfDate(toDate)
      : "Dates";

  doc.save(
    `SKCP-Payment-Report-${fromPart}-to-${toPart}.pdf`
  );
};



const handleDownloadAttendancePdf = () => {
  if (
    !attendanceReport ||
    attendanceReport.rows.length === 0
  ) {
    return;
  }

  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  const leftMargin = 12;
  const rightMargin = pageWidth - 12;

  let y = 18;

  const addPageIfNeeded = (requiredHeight = 15) => {
    if (y + requiredHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
      return true;
    }

    return false;
  };

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Shree Kundodari Cement Products",
    leftMargin,
    y
  );

  doc.setFontSize(10);
  doc.text(
    "ATTENDANCE REPORT",
    rightMargin,
    y,
    { align: "right" }
  );

  y += 9;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const periodText =
    fromDate && toDate
      ? `${formatPdfDate(fromDate)} - ${formatPdfDate(toDate)}`
      : fromDate
        ? formatPdfDate(fromDate)
        : toDate
          ? formatPdfDate(toDate)
          : "All Dates";

  doc.text(
    `Report Period: ${periodText}`,
    leftMargin,
    y
  );

  y += 10;

  // Attendance Summary
  addPageIfNeeded(45);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

doc.text(
  "Attendance Summary",
  leftMargin,
  y
);

y += 8;

doc.setFontSize(10);
doc.setFont("helvetica", "normal");

doc.text(
  `Total Records: ${Number(
    attendanceReport.totalAttendanceRecords || 0
  ).toLocaleString("en-IN")}`,
  leftMargin,
  y
);

y += 6;

doc.text(
  `Present Days: ${Number(
    attendanceReport.presentDays || 0
  ).toLocaleString("en-IN")}`,
  leftMargin,
  y
);

y += 6;

doc.text(
  `Half Days: ${Number(
    attendanceReport.halfDays || 0
  ).toLocaleString("en-IN")}`,
  leftMargin,
  y
);

y += 6;

doc.text(
  `Absent / Leave: ${Number(
    (attendanceReport.absentDays || 0) +
    (attendanceReport.leaveDays || 0)
  ).toLocaleString("en-IN")}`,
  leftMargin,
  y
);

y += 6;

doc.text(
  `Attendance Amount: INR ${Number(
    attendanceReport.totalAttendanceAmount || 0
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
  leftMargin,
  y
);

y += 14;



  // Detailed Attendance
  addPageIfNeeded(50);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Detailed Attendance",
    leftMargin,
    y
  );

  y += 8;

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");

  const colDate = 12;
  const colId = 30;
  const colLabour = 43;
  const colStatus = 79;
  const colRate = 101;
  const colAmount = 123;
  const colLeaveReason = 145;
  const colRemarks = 172;
  const colRecordStatus = 198;

  doc.text(
    "Date",
    colDate,
    y
  );

  doc.text(
    "ID",
    colId,
    y
  );

  doc.text(
    "Labour",
    colLabour,
    y
  );

  doc.text(
    "Attendance",
    colStatus,
    y
  );

  doc.text(
    "Daily Rate",
    colRate,
    y
  );

  doc.text(
    "Amount",
    colAmount,
    y
  );

  doc.text(
    "Leave Reason",
    colLeaveReason,
    y
  );

  doc.text(
    "Remarks",
    colRemarks,
    y
  );

  doc.text(
    "Status",
    colRecordStatus,
    y
  );

  y += 5;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 6;

  doc.setFont("helvetica", "normal");

  attendanceReport.rows.forEach((row) => {
    addPageIfNeeded(12);

    doc.text(
      formatPdfDate(row.attendanceDate),
      colDate,
      y
    );

    doc.text(
      `#${String(row.attendanceId || "-")}`,
      colId,
      y
    );

    doc.text(
      String(
        row.labourName ||
          `Labour #${row.labourId}` ||
          "-"
      ).substring(0, 18),
      colLabour,
      y
    );

    doc.text(
      String(
        row.attendanceStatus || "-"
      ).substring(0, 10),
      colStatus,
      y
    );

    doc.text(
      `INR ${Number(
        row.dailyRate || 0
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      colRate,
      y
    );

    doc.text(
      `INR ${Number(
        row.dailyAmount || 0
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      colAmount,
      y
    );

    doc.text(
      String(
        row.leaveReason || "-"
      ).substring(0, 16),
      colLeaveReason,
      y
    );

    doc.text(
      String(
        row.remarks || "-"
      ).substring(0, 16),
      colRemarks,
      y
    );

    doc.text(
      String(
        row.status || "-"
      ).substring(0, 10),
      colRecordStatus,
      y
    );

    y += 7;
  });

  const totalPages =
    doc.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    doc.setPage(page);

    const footerY =
      pageHeight - 10;

    doc.setFontSize(8);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "SKCP - Kumta - 581343, Karnataka",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    doc.text(
      `Page ${page} of ${totalPages}`,
      rightMargin,
      footerY,
      { align: "right" }
    );
  }

  const fromPart =
    fromDate
      ? formatPdfDate(fromDate)
      : "All";

  const toPart =
    toDate
      ? formatPdfDate(toDate)
      : "Dates";

  doc.save(
    `SKCP-Attendance-Report-${fromPart}-to-${toPart}.pdf`
  );
};

const handleDownloadInventoryPdf = () => {
  if (
    !inventoryReport ||
    (
      inventoryReport.finishedGoodsRows?.length === 0 &&
      inventoryReport.rawMaterialRows?.length === 0
    )
  ) {
    return;
  }

  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  const leftMargin = 12;
  const rightMargin = pageWidth - 12;

  let y = 18;

  const addPageIfNeeded = (requiredHeight = 15) => {
    if (y + requiredHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
      return true;
    }

    return false;
  };

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Shree Kundodari Cement Products",
    leftMargin,
    y
  );

  doc.setFontSize(10);
  doc.text(
    "INVENTORY REPORT",
    rightMargin,
    y,
    { align: "right" }
  );

  y += 9;

  doc.line(
    leftMargin,
    y,
    rightMargin,
    y
  );

  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const periodText =
    fromDate && toDate
      ? `${formatPdfDate(fromDate)} - ${formatPdfDate(toDate)}`
      : fromDate
        ? formatPdfDate(fromDate)
        : toDate
          ? formatPdfDate(toDate)
          : "All Dates";

  doc.text(
    `Report Period: ${periodText}`,
    leftMargin,
    y
  );

  y += 12;

  // =========================================================
  // INVENTORY SUMMARY
  // =========================================================

  addPageIfNeeded(40);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Inventory Summary",
    leftMargin,
    y
  );

  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Finished Goods Records: ${Number(
      inventoryReport.finishedGoodsRows?.length || 0
    ).toLocaleString("en-IN")}`,
    leftMargin,
    y
  );

  y += 6;

  doc.text(
    `Raw Material Records: ${Number(
      inventoryReport.rawMaterialRows?.length || 0
    ).toLocaleString("en-IN")}`,
    leftMargin,
    y
  );

  y += 6;

  doc.text(
    `Low Stock Items: ${Number(
      inventoryReport.lowStockCount || 0
    ).toLocaleString("en-IN")}`,
    leftMargin,
    y
  );

  y += 14;

  // =========================================================
  // FINISHED GOODS INVENTORY
  // =========================================================

  if (
    inventoryReport.finishedGoodsRows &&
    inventoryReport.finishedGoodsRows.length > 0
  ) {
    addPageIfNeeded(50);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Finished Goods Inventory",
      leftMargin,
      y
    );

    y += 8;

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");

    const colFgId = 12;
    const colFgProduct = 35;
    const colFgCurrent = 68;
    const colFgMinimum = 98;
    const colFgStatus = 126;
    const colFgDate = 157;
    const colFgNotes = 178;

    doc.text(
      "Stock ID",
      colFgId,
      y
    );

    doc.text(
      "Product",
      colFgProduct,
      y
    );

    doc.text(
      "Current Stock",
      colFgCurrent,
      y
    );

    doc.text(
      "Minimum",
      colFgMinimum,
      y
    );

    doc.text(
      "Status",
      colFgStatus,
      y
    );

    doc.text(
      "Last Updated",
      colFgDate,
      y
    );

    doc.text(
      "Notes",
      colFgNotes,
      y
    );

    y += 5;

    doc.line(
      leftMargin,
      y,
      rightMargin,
      y
    );

    y += 6;

    doc.setFont("helvetica", "normal");

    inventoryReport.finishedGoodsRows.forEach(
      (row) => {
        addPageIfNeeded(12);

        doc.text(
          `#${String(
            row.finishedGoodsStockId || "-"
          )}`,
          colFgId,
          y
        );

        doc.text(
          String(
            row.notes || "-"
          ).substring(0, 20),
          colFgNotes,
          y
        );

        doc.text(
          Number(
            row.currentStock || 0
          ).toLocaleString("en-IN"),
          colFgCurrent,
          y
        );

        doc.text(
          Number(
            row.minimumStock || 0
          ).toLocaleString("en-IN"),
          colFgMinimum,
          y
        );

        doc.text(
          String(
            row.status || "-"
          ).substring(0, 12),
          colFgStatus,
          y
        );

        doc.text(
          formatPdfDate(
            row.lastUpdatedDate
          ),
          colFgDate,
          y
        );

        doc.text(
          String(
            row.notes || "-"
          ).substring(0, 18),
          colFgNotes,
          y
        );

        y += 7;
      }
    );

    y += 8;
  }

  // =========================================================
  // RAW MATERIAL INVENTORY
  // =========================================================

  if (
    inventoryReport.rawMaterialRows &&
    inventoryReport.rawMaterialRows.length > 0
  ) {
    addPageIfNeeded(50);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Raw Material Inventory",
      leftMargin,
      y
    );

    y += 8;

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");

    const colRmId = 12;
    const colRmName = 34;
    const colRmUnit = 83;
    const colRmCurrent = 105;
    const colRmMinimum = 136;
    const colRmStatus = 166;

    doc.text(
      "Stock ID",
      colRmId,
      y
    );

    doc.text(
      "Raw Material",
      colRmName,
      y
    );

    doc.text(
      "Unit",
      colRmUnit,
      y
    );

    doc.text(
      "Current Stock",
      colRmCurrent,
      y
    );

    doc.text(
      "Minimum",
      colRmMinimum,
      y
    );

    doc.text(
      "Status",
      colRmStatus,
      y
    );

    y += 5;

    doc.line(
      leftMargin,
      y,
      rightMargin,
      y
    );

    y += 6;

    doc.setFont(
      "helvetica",
      "normal"
    );

    inventoryReport.rawMaterialRows.forEach(
      (row) => {
        addPageIfNeeded(12);

        doc.text(
          `#${String(
            row.rawMaterialStockId || "-"
          )}`,
          colRmId,
          y
        );

        doc.text(
          String(
            row.rawMaterialName ||
              `Raw Material #${row.rawMaterialId}`
          ).substring(0, 25),
          colRmName,
          y
        );

        doc.text(
          String(
            row.rawMaterialUnit || "-"
          ).substring(0, 10),
          colRmUnit,
          y
        );

        doc.text(
          Number(
            row.currentStock || 0
          ).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          }),
          colRmCurrent,
          y
        );

        doc.text(
          Number(
            row.minimumStock || 0
          ).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          }),
          colRmMinimum,
          y
        );

        doc.text(
          String(
            row.stockStatus || "-"
          ).substring(0, 12),
          colRmStatus,
          y
        );

        y += 7;
      }
    );
  }

  // =========================================================
  // FOOTER
  // =========================================================

  const totalPages =
    doc.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    doc.setPage(page);

    const footerY =
      pageHeight - 10;

    doc.setFontSize(8);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "SKCP - Kumta - 581343, Karnataka",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    doc.text(
      `Page ${page} of ${totalPages}`,
      rightMargin,
      footerY,
      { align: "right" }
    );
  }

  const fromPart =
    fromDate
      ? formatPdfDate(fromDate)
      : "All";

  const toPart =
    toDate
      ? formatPdfDate(toDate)
      : "Dates";

  doc.save(
    `SKCP-Inventory-Report-${fromPart}-to-${toPart}.pdf`
  );
};

  /* ============================================================
     TABLE SORTING
  ============================================================ */

  const {
    sortKey: salesSortKey,
    sortDirection:
      salesSortDirection,
    sortedRecords:
      sortedSalesRows,
    handleSort:
      handleSalesSort,
  } = useTableSort(
    salesReport.rows
  );

  const {
    sortKey: productionSortKey,
    sortDirection:
      productionSortDirection,
    sortedRecords:
      sortedProductionRows,
    handleSort:
      handleProductionSort,
  } = useTableSort(
    productionReport.rows
  );

  const {
    sortKey: paymentSortKey,
    sortDirection:
      paymentSortDirection,
    sortedRecords:
      sortedPaymentRows,
    handleSort:
      handlePaymentSort,
  } = useTableSort(
    paymentReport.rows
  );

  const {
    sortKey: attendanceSortKey,
    sortDirection:
      attendanceSortDirection,
    sortedRecords:
      sortedAttendanceRows,
    handleSort:
      handleAttendanceSort,
  } = useTableSort(
    attendanceReport.rows
  );

  const {
    sortKey:
      finishedGoodsSortKey,
    sortDirection:
      finishedGoodsSortDirection,
    sortedRecords:
      sortedFinishedGoodsRows,
    handleSort:
      handleFinishedGoodsSort,
  } = useTableSort(
    inventoryReport.finishedGoodsRows
  );

  const {
    sortKey:
      rawMaterialSortKey,
    sortDirection:
      rawMaterialSortDirection,
    sortedRecords:
      sortedRawMaterialRows,
    handleSort:
      handleRawMaterialSort,
  } = useTableSort(
    inventoryReport.rawMaterialRows
  );

  const {
    sortKey:
      upcomingDeliveriesSortKey,
    sortDirection:
      upcomingDeliveriesSortDirection,
    sortedRecords:
      sortedUpcomingDeliveriesRows,
    handleSort:
      handleUpcomingDeliveriesSort,
  } = useTableSort(
    upcomingDeliveriesReport.rows
  );

  /* ============================================================
     PAGINATION
  ============================================================ */

  const {
    currentPage:
      salesCurrentPage,
    pageSize:
      salesPageSize,
    totalPages:
      salesTotalPages,
    totalRecords:
      salesTotalRecords,
    paginatedRecords:
      paginatedSalesRows,
    handlePageChange:
      handleSalesPageChange,
    handlePageSizeChange:
      handleSalesPageSizeChange,
  } = usePagination(
    sortedSalesRows,
    10
  );

  const {
    currentPage:
      productionCurrentPage,
    pageSize:
      productionPageSize,
    totalPages:
      productionTotalPages,
    totalRecords:
      productionTotalRecords,
    paginatedRecords:
      paginatedProductionRows,
    handlePageChange:
      handleProductionPageChange,
    handlePageSizeChange:
      handleProductionPageSizeChange,
  } = usePagination(
    sortedProductionRows,
    10
  );

  const {
    currentPage:
      paymentCurrentPage,
    pageSize:
      paymentPageSize,
    totalPages:
      paymentTotalPages,
    totalRecords:
      paymentTotalRecords,
    paginatedRecords:
      paginatedPaymentRows,
    handlePageChange:
      handlePaymentPageChange,
    handlePageSizeChange:
      handlePaymentPageSizeChange,
  } = usePagination(
    sortedPaymentRows,
    10
  );

  const {
    currentPage:
      attendanceCurrentPage,
    pageSize:
      attendancePageSize,
    totalPages:
      attendanceTotalPages,
    totalRecords:
      attendanceTotalRecords,
    paginatedRecords:
      paginatedAttendanceRows,
    handlePageChange:
      handleAttendancePageChange,
    handlePageSizeChange:
      handleAttendancePageSizeChange,
  } = usePagination(
    sortedAttendanceRows,
    10
  );

  const {
    currentPage:
      finishedGoodsCurrentPage,
    pageSize:
      finishedGoodsPageSize,
    totalPages:
      finishedGoodsTotalPages,
    totalRecords:
      finishedGoodsTotalRecords,
    paginatedRecords:
      paginatedFinishedGoodsRows,
    handlePageChange:
      handleFinishedGoodsPageChange,
    handlePageSizeChange:
      handleFinishedGoodsPageSizeChange,
  } = usePagination(
    sortedFinishedGoodsRows,
    10
  );

  const {
    currentPage:
      rawMaterialCurrentPage,
    pageSize:
      rawMaterialPageSize,
    totalPages:
      rawMaterialTotalPages,
    totalRecords:
      rawMaterialTotalRecords,
    paginatedRecords:
      paginatedRawMaterialRows,
    handlePageChange:
      handleRawMaterialPageChange,
    handlePageSizeChange:
      handleRawMaterialPageSizeChange,
  } = usePagination(
    sortedRawMaterialRows,
    10
  );

  const {
    currentPage:
      upcomingDeliveriesCurrentPage,
    pageSize:
      upcomingDeliveriesPageSize,
    totalPages:
      upcomingDeliveriesTotalPages,
    totalRecords:
      upcomingDeliveriesTotalRecords,
    paginatedRecords:
      paginatedUpcomingDeliveriesRows,
    handlePageChange:
      handleUpcomingDeliveriesPageChange,
    handlePageSizeChange:
      handleUpcomingDeliveriesPageSizeChange,
  } = usePagination(
    sortedUpcomingDeliveriesRows,
    10
  );

  /* ============================================================
     SORT + RESET PAGE
  ============================================================ */

  const handleSalesSortAndReset =
    (key) => {
      handleSalesSort(key);
      handleSalesPageChange(1);
    };

  const handleProductionSortAndReset =
    (key) => {
      handleProductionSort(key);
      handleProductionPageChange(1);
    };

  const handlePaymentSortAndReset =
    (key) => {
      handlePaymentSort(key);
      handlePaymentPageChange(1);
    };

  const handleAttendanceSortAndReset =
    (key) => {
      handleAttendanceSort(key);
      handleAttendancePageChange(1);
    };

  const handleFinishedGoodsSortAndReset =
    (key) => {
      handleFinishedGoodsSort(key);
      handleFinishedGoodsPageChange(1);
    };

  const handleRawMaterialSortAndReset =
    (key) => {
      handleRawMaterialSort(key);
      handleRawMaterialPageChange(1);
    };

  const handleUpcomingDeliveriesSortAndReset =
    (key) => {
      handleUpcomingDeliveriesSort(key);
      handleUpcomingDeliveriesPageChange(1);
    };

  const reportTitle = {
    sales: "Sales Report",
    production:
      "Production Report",
    payment: "Payment Report",
    attendance:
      "Attendance Report",
    inventory:
      "Inventory Report",
    upcomingDeliveries:
      "Upcoming Deliveries",
  }[reportType];

  return (
    <div className="reports-page">

      {/* ========================================================
          REPORT HEADER + FILTERS
      ======================================================== */}

      <section className="card">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2>SKCP Reports</h2>

            <p>
              Operational reports for sales,
              production, payments, attendance,
              inventory, and upcoming deliveries.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            alignItems: "end",
            gap: "16px",
            marginTop: "16px",
          }}
        >

          <div className="fld">
            <label>
              SKCP Report Type
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

              <option value="upcomingDeliveries">
                Upcoming Deliveries
              </option>
            </select>
          </div>

          <div className="fld">
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

          <div className="fld">
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

          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
          >
            Clear
          </button>
        </div>

      </section>

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
              REPORT SUMMARY
          ================================================== */}

          <div className="card">
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

              {reportType ===
              "production" ? (
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

              ) : reportType ===
                "payment" ? (
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

              ) : reportType ===
                "attendance" ? (
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

              ) : reportType ===
                "inventory" ? (
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
                 UPCOMING DELIVERIES SUMMARY
              ================================================== */

              ) : reportType ===
                "upcomingDeliveries" ? (
                <>

                  <div className="kpi g">
                    <div className="kpi-label">
                      Delivery Orders
                    </div>

                    <div className="kpi-val">
                      {
                        upcomingDeliveriesReport.totalDeliveryOrders
                      }
                    </div>
                  </div>

                  <div className="kpi b">
                    <div className="kpi-label">
                      Required Units
                    </div>

                    <div className="kpi-val">
                      {upcomingDeliveriesReport.totalRequiredQuantity.toLocaleString(
                        "en-IN"
                      )}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Production Required
                    </div>

                    <div className="kpi-val">
                      {upcomingDeliveriesReport.totalProductionRequired.toLocaleString(
                        "en-IN"
                      )}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="kpi-label">
                      Delivery Records
                    </div>

                    <div className="kpi-val">
                      {
                        upcomingDeliveriesReport.deliveryRecordCount
                      }
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

          <div className="card">
                      <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2>{reportTitle}</h2>
              <p>
                {fromDate || toDate
                  ? `${fromDate || "Start"} to ${toDate || "Today"}`
                  : "All available records"}
              </p>
            </div>

            {reportType === "sales" && (
              <button
                type="button"
                className="action-btn view-btn"
                onClick={handleDownloadSalesPdf}
              >
                Download PDF
              </button>
            )}

            {reportType === "production" && (
              <button
                type="button"
                className="action-btn view-btn"
                onClick={handleDownloadProductionPdf}
              >
                Download PDF
              </button>
            )}


              {reportType === "payment" && (
                <button
                  type="button"
                  className="action-btn view-btn"
                  onClick={handleDownloadPaymentPdf}
                >
                  Download PDF
                </button>
              )}

            {reportType === "attendance" && (
              <button
                type="button"
                className="action-btn view-btn"
                onClick={handleDownloadAttendancePdf}
              >
                Download PDF
              </button>
            )}

          {reportType === "inventory" && (
              <button
                type="button"
                className="action-btn view-btn"
                onClick={handleDownloadInventoryPdf}
              >
                Download PDF
              </button>
            )}


            {reportType === "upcomingDeliveries" && (
              <button
                type="button"
                className="action-btn view-btn"
                onClick={handleDownloadUpcomingDeliveriesPdf}
              >
                Download PDF
              </button>
            )}
          </div>

            {/* ==================================================
                SALES REPORT
            ================================================== */}

            {reportType ===
              "sales" && (
              <div className="table-wrap">

                {salesReport.rows.length ===
                0 ? (
                  <div className="card-body">
                    No sales data available
                    for the selected period.
                  </div>
                ) : (
                  <>
                    <table>
                      <thead>
                        <tr>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleSalesSortAndReset(
                                  "orderDate"
                                )
                              }
                            >
                              Date
                              {getSortIndicator(
                                salesSortKey,
                                "orderDate",
                                salesSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleSalesSortAndReset(
                                  "orderId"
                                )
                              }
                            >
                              Order ID
                              {getSortIndicator(
                                salesSortKey,
                                "orderId",
                                salesSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleSalesSortAndReset(
                                  "customerName"
                                )
                              }
                            >
                              Customer
                              {getSortIndicator(
                                salesSortKey,
                                "customerName",
                                salesSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleSalesSortAndReset(
                                  "productId"
                                )
                              }
                            >
                              Product ID
                              {getSortIndicator(
                                salesSortKey,
                                "productId",
                                salesSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleSalesSortAndReset(
                                  "quantity"
                                )
                              }
                            >
                              Quantity
                              {getSortIndicator(
                                salesSortKey,
                                "quantity",
                                salesSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleSalesSortAndReset(
                                  "unitPrice"
                                )
                              }
                            >
                              Unit Price
                              {getSortIndicator(
                                salesSortKey,
                                "unitPrice",
                                salesSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleSalesSortAndReset(
                                  "salesValue"
                                )
                              }
                            >
                              Sales Value
                              {getSortIndicator(
                                salesSortKey,
                                "salesValue",
                                salesSortDirection
                              )}
                            </button>
                          </th>

                        </tr>
                      </thead>

                      <tbody>
                        {paginatedSalesRows.map(
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

                    <Pagination
                      currentPage={
                        salesCurrentPage
                      }
                      totalPages={
                        salesTotalPages
                      }
                      totalRecords={
                        salesTotalRecords
                      }
                      pageSize={
                        salesPageSize
                      }
                      onPageChange={
                        handleSalesPageChange
                      }
                      onPageSizeChange={
                        handleSalesPageSizeChange
                      }
                    />
                  </>
                )}

              </div>
            )}

            {/* ==================================================
                PRODUCTION REPORT
            ================================================== */}

            {reportType ===
              "production" && (
              <div className="table-wrap">

                {productionReport.rows.length ===
                0 ? (
                  <div className="card-body">
                    No production data available
                    for the selected period.
                  </div>
                ) : (
                  <>
                    <table>
                      <thead>
                        <tr>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleProductionSortAndReset(
                                  "productionDate"
                                )
                              }
                            >
                              Date
                              {getSortIndicator(
                                productionSortKey,
                                "productionDate",
                                productionSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleProductionSortAndReset(
                                  "productionId"
                                )
                              }
                            >
                              Production ID
                              {getSortIndicator(
                                productionSortKey,
                                "productionId",
                                productionSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleProductionSortAndReset(
                                  "productName"
                                )
                              }
                            >
                              Product
                              {getSortIndicator(
                                productionSortKey,
                                "productName",
                                productionSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleProductionSortAndReset(
                                  "productSize"
                                )
                              }
                            >
                              Size
                              {getSortIndicator(
                                productionSortKey,
                                "productSize",
                                productionSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleProductionSortAndReset(
                                  "quantityProduced"
                                )
                              }
                            >
                              Quantity Produced
                              {getSortIndicator(
                                productionSortKey,
                                "quantityProduced",
                                productionSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleProductionSortAndReset(
                                  "totalCementBags"
                                )
                              }
                            >
                              Cement Bags
                              {getSortIndicator(
                                productionSortKey,
                                "totalCementBags",
                                productionSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleProductionSortAndReset(
                                  "assetName"
                                )
                              }
                            >
                              Asset / Machine
                              {getSortIndicator(
                                productionSortKey,
                                "assetName",
                                productionSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleProductionSortAndReset(
                                  "status"
                                )
                              }
                            >
                              Status
                              {getSortIndicator(
                                productionSortKey,
                                "status",
                                productionSortDirection
                              )}
                            </button>
                          </th>

                        </tr>
                      </thead>

                      <tbody>
                        {paginatedProductionRows.map(
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
                                {row.productName ||
                                  "-"}
                              </td>

                              <td>
                                {row.productSize ||
                                  "-"}
                              </td>

                              <td>
                                {Number(
                                  row.quantityProduced ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </td>

                              <td>
                                {Number(
                                  row.totalCementBags ||
                                    0
                                ).toLocaleString(
                                  "en-IN",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>

                              <td>
                                {row.assetName ||
                                  "-"}
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

                    <Pagination
                      currentPage={
                        productionCurrentPage
                      }
                      totalPages={
                        productionTotalPages
                      }
                      totalRecords={
                        productionTotalRecords
                      }
                      pageSize={
                        productionPageSize
                      }
                      onPageChange={
                        handleProductionPageChange
                      }
                      onPageSizeChange={
                        handleProductionPageSizeChange
                      }
                    />
                  </>
                )}

              </div>
            )}

            {/* ==================================================
                PAYMENT REPORT
            ================================================== */}

            {reportType ===
              "payment" && (
              <div className="table-wrap">

                {paymentReport.rows.length ===
                0 ? (
                  <div className="card-body">
                    No payment data available
                    for the selected period.
                  </div>
                ) : (
                  <>
                    <table>
                      <thead>
                        <tr>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handlePaymentSortAndReset(
                                  "paymentDate"
                                )
                              }
                            >
                              Date
                              {getSortIndicator(
                                paymentSortKey,
                                "paymentDate",
                                paymentSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handlePaymentSortAndReset(
                                  "paymentId"
                                )
                              }
                            >
                              Payment ID
                              {getSortIndicator(
                                paymentSortKey,
                                "paymentId",
                                paymentSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handlePaymentSortAndReset(
                                  "customerName"
                                )
                              }
                            >
                              Customer
                              {getSortIndicator(
                                paymentSortKey,
                                "customerName",
                                paymentSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handlePaymentSortAndReset(
                                  "paymentMode"
                                )
                              }
                            >
                              Payment Mode
                              {getSortIndicator(
                                paymentSortKey,
                                "paymentMode",
                                paymentSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handlePaymentSortAndReset(
                                  "amountReceived"
                                )
                              }
                            >
                              Amount Received
                              {getSortIndicator(
                                paymentSortKey,
                                "amountReceived",
                                paymentSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handlePaymentSortAndReset(
                                  "allocatedAmount"
                                )
                              }
                            >
                              Allocated
                              {getSortIndicator(
                                paymentSortKey,
                                "allocatedAmount",
                                paymentSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handlePaymentSortAndReset(
                                  "unallocatedAmount"
                                )
                              }
                            >
                              Unallocated
                              {getSortIndicator(
                                paymentSortKey,
                                "unallocatedAmount",
                                paymentSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handlePaymentSortAndReset(
                                  "receivedBy"
                                )
                              }
                            >
                              Received By
                              {getSortIndicator(
                                paymentSortKey,
                                "receivedBy",
                                paymentSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handlePaymentSortAndReset(
                                  "recordStatus"
                                )
                              }
                            >
                              Status
                              {getSortIndicator(
                                paymentSortKey,
                                "recordStatus",
                                paymentSortDirection
                              )}
                            </button>
                          </th>

                        </tr>
                      </thead>

                      <tbody>
                        {paginatedPaymentRows.map(
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
                                {row.paymentMode ||
                                  "-"}
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
                                {row.receivedBy ||
                                  "-"}
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

                    <Pagination
                      currentPage={
                        paymentCurrentPage
                      }
                      totalPages={
                        paymentTotalPages
                      }
                      totalRecords={
                        paymentTotalRecords
                      }
                      pageSize={
                        paymentPageSize
                      }
                      onPageChange={
                        handlePaymentPageChange
                      }
                      onPageSizeChange={
                        handlePaymentPageSizeChange
                      }
                    />
                  </>
                )}

              </div>
            )}

            {/* ==================================================
                ATTENDANCE REPORT
            ================================================== */}

            {reportType ===
              "attendance" && (
              <div className="table-wrap">

                {attendanceReport.rows.length ===
                0 ? (
                  <div className="card-body">
                    No attendance data available
                    for the selected period.
                  </div>
                ) : (
                  <>
                    <table>
                      <thead>
                        <tr>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleAttendanceSortAndReset(
                                  "attendanceDate"
                                )
                              }
                            >
                              Date
                              {getSortIndicator(
                                attendanceSortKey,
                                "attendanceDate",
                                attendanceSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleAttendanceSortAndReset(
                                  "attendanceId"
                                )
                              }
                            >
                              Attendance ID
                              {getSortIndicator(
                                attendanceSortKey,
                                "attendanceId",
                                attendanceSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleAttendanceSortAndReset(
                                  "labourName"
                                )
                              }
                            >
                              Labour
                              {getSortIndicator(
                                attendanceSortKey,
                                "labourName",
                                attendanceSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleAttendanceSortAndReset(
                                  "attendanceStatus"
                                )
                              }
                            >
                              Status
                              {getSortIndicator(
                                attendanceSortKey,
                                "attendanceStatus",
                                attendanceSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleAttendanceSortAndReset(
                                  "dailyRate"
                                )
                              }
                            >
                              Daily Rate
                              {getSortIndicator(
                                attendanceSortKey,
                                "dailyRate",
                                attendanceSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleAttendanceSortAndReset(
                                  "dailyAmount"
                                )
                              }
                            >
                              Daily Amount
                              {getSortIndicator(
                                attendanceSortKey,
                                "dailyAmount",
                                attendanceSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleAttendanceSortAndReset(
                                  "leaveReason"
                                )
                              }
                            >
                              Leave Reason
                              {getSortIndicator(
                                attendanceSortKey,
                                "leaveReason",
                                attendanceSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleAttendanceSortAndReset(
                                  "remarks"
                                )
                              }
                            >
                              Remarks
                              {getSortIndicator(
                                attendanceSortKey,
                                "remarks",
                                attendanceSortDirection
                              )}
                            </button>
                          </th>

                          <th>
                            <button
                              type="button"
                              className="table-sort-btn"
                              onClick={() =>
                                handleAttendanceSortAndReset(
                                  "status"
                                )
                              }
                            >
                              Record Status
                              {getSortIndicator(
                                attendanceSortKey,
                                "status",
                                attendanceSortDirection
                              )}
                            </button>
                          </th>

                        </tr>
                      </thead>

                      <tbody>
                        {paginatedAttendanceRows.map(
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
                                  {
                                    row.attendanceStatus
                                  }
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
                                {row.leaveReason ||
                                  "-"}
                              </td>

                              <td>
                                {row.remarks ||
                                  "-"}
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

                    <Pagination
                      currentPage={
                        attendanceCurrentPage
                      }
                      totalPages={
                        attendanceTotalPages
                      }
                      totalRecords={
                        attendanceTotalRecords
                      }
                      pageSize={
                        attendancePageSize
                      }
                      onPageChange={
                        handleAttendancePageChange
                      }
                      onPageSizeChange={
                        handleAttendancePageSizeChange
                      }
                    />
                  </>
                )}

              </div>
            )}

            {/* ==================================================
                UPCOMING DELIVERIES REPORT
            ================================================== */}

            {reportType ===
              "upcomingDeliveries" && (
              <div>

                {/* ==================================================
                    1. PRODUCTION SUMMARY BY SIZE
                ================================================== */}

                {upcomingDeliveriesReport.productionSummary &&
                  upcomingDeliveriesReport.productionSummary.length >
                    0 && (
                    <section
                      className="card"
                      style={{
                        marginTop: "24px",
                      }}
                    >

                      <div className="section-header">
                        <div>
                          <h3>
                            Production Summary by Size
                          </h3>

                          <p>
                            Production requirement based on
                            upcoming deliveries and available stock.
                          </p>
                        </div>
                      </div>

                      <table>
                        <thead>
                          <tr>

                            <th>
                              Size
                            </th>

                            <th>
                              Required Qty
                            </th>

                            <th>
                              Available Stock
                            </th>

                            <th>
                              Production Required
                            </th>

                          </tr>
                        </thead>

                        <tbody>

                          {upcomingDeliveriesReport.productionSummary.map(
                            (summary) => (
                              <tr
                                key={
                                  summary.productId
                                }
                              >

                                <td>
                                  {summary.productSize}
                                </td>

                                <td>
                                  {summary.requiredQuantity.toLocaleString(
                                    "en-IN"
                                  )}
                                </td>

                                <td>
                                  {summary.availableStock.toLocaleString(
                                    "en-IN"
                                  )}
                                </td>

                                <td>
                                  {summary.productionRequired.toLocaleString(
                                    "en-IN"
                                  )}
                                </td>

                              </tr>
                            )
                          )}

                          {/* TOTAL */}

                          <tr>

                            <td>
                              <strong>
                                TOTAL
                              </strong>
                            </td>

                            <td>
                              <strong>
                                {
                                  upcomingDeliveriesReport
                                    .productionSummaryTotals
                                    .requiredQuantity
                                .toLocaleString(
                                  "en-IN"
                                )}
                              </strong>
                            </td>

                            <td>
                              <strong>
                                {
                                  upcomingDeliveriesReport
                                    .productionSummaryTotals
                                    .availableStock
                                .toLocaleString(
                                  "en-IN"
                                )}
                              </strong>
                            </td>

                            <td>
                              <strong>
                                {
                                  upcomingDeliveriesReport
                                    .productionSummaryTotals
                                    .productionRequired
                                .toLocaleString(
                                  "en-IN"
                                )}
                              </strong>
                            </td>

                          </tr>

                        </tbody>
                      </table>

                    </section>
                  )}

                {/* ==================================================
                    2. DETAILED UPCOMING DELIVERIES
                ================================================== */}

                <section
                  className="card"
                  style={{
                    marginTop: "24px",
                  }}
                >

                  <div className="section-header">
                    <div>
                      <h3>
                        Detailed Upcoming Deliveries
                      </h3>

                      <p>
                        Detailed delivery requirements and
                        production status.
                      </p>
                    </div>
                  </div>

                  {upcomingDeliveriesReport.rows.length ===
                  0 ? (
                    <div className="card-body">
                      No upcoming delivery data
                      available for the selected period.
                    </div>
                  ) : (
                    <>

                      <table>
                        <thead>
                          <tr>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleUpcomingDeliveriesSortAndReset(
                                    "deliveryDateSort"
                                  )
                                }
                              >
                                Delivery Date

                                {getSortIndicator(
                                  upcomingDeliveriesSortKey,
                                  "deliveryDateSort",
                                  upcomingDeliveriesSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleUpcomingDeliveriesSortAndReset(
                                    "orderId"
                                  )
                                }
                              >
                                Order ID

                                {getSortIndicator(
                                  upcomingDeliveriesSortKey,
                                  "orderId",
                                  upcomingDeliveriesSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleUpcomingDeliveriesSortAndReset(
                                    "customerName"
                                  )
                                }
                              >
                                Customer

                                {getSortIndicator(
                                  upcomingDeliveriesSortKey,
                                  "customerName",
                                  upcomingDeliveriesSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleUpcomingDeliveriesSortAndReset(
                                    "productName"
                                  )
                                }
                              >
                                Product

                                {getSortIndicator(
                                  upcomingDeliveriesSortKey,
                                  "productName",
                                  upcomingDeliveriesSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleUpcomingDeliveriesSortAndReset(
                                    "productSize"
                                  )
                                }
                              >
                                Size

                                {getSortIndicator(
                                  upcomingDeliveriesSortKey,
                                  "productSize",
                                  upcomingDeliveriesSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleUpcomingDeliveriesSortAndReset(
                                    "requiredQuantity"
                                  )
                                }
                              >
                                Required Qty

                                {getSortIndicator(
                                  upcomingDeliveriesSortKey,
                                  "requiredQuantity",
                                  upcomingDeliveriesSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleUpcomingDeliveriesSortAndReset(
                                    "availableStock"
                                  )
                                }
                              >
                                Available Stock

                                {getSortIndicator(
                                  upcomingDeliveriesSortKey,
                                  "availableStock",
                                  upcomingDeliveriesSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleUpcomingDeliveriesSortAndReset(
                                    "productionRequired"
                                  )
                                }
                              >
                                Production Required

                                {getSortIndicator(
                                  upcomingDeliveriesSortKey,
                                  "productionRequired",
                                  upcomingDeliveriesSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleUpcomingDeliveriesSortAndReset(
                                    "deliveryStatus"
                                  )
                                }
                              >
                                Delivery Status

                                {getSortIndicator(
                                  upcomingDeliveriesSortKey,
                                  "deliveryStatus",
                                  upcomingDeliveriesSortDirection
                                )}
                              </button>
                            </th>

                          </tr>
                        </thead>

                        <tbody>
                          {paginatedUpcomingDeliveriesRows.map(
                            (row) => (
                              <tr
                                key={
                                  row.orderItemId
                                }
                              >

                                <td>
                                  {row.deliveryDate
                                    ? row.deliveryDate
                                        .split(", ")
                                        .map(
                                          (
                                            date,
                                            index
                                          ) => (
                                            <div
                                              key={`${row.orderItemId}-${date}-${index}`}
                                            >
                                              {formatDate(
                                                date
                                              )}
                                            </div>
                                          )
                                        )
                                    : "—"}
                                </td>

                                <td>
                                  #{row.orderId}
                                </td>

                                <td>
                                  {row.customerName}
                                </td>

                                <td>
                                  {row.productName}
                                </td>

                                <td>
                                  {row.productSize}
                                </td>

                                <td>
                                  {row.requiredQuantity.toLocaleString(
                                    "en-IN"
                                  )}
                                </td>

                                <td>
                                  {row.availableStock.toLocaleString(
                                    "en-IN"
                                  )}
                                </td>

                                <td>
                                  {row.productionRequired.toLocaleString(
                                    "en-IN"
                                  )}
                                </td>

                                <td>
                                  <span
                                    className={`status ${
                                      row.deliveryStatus ===
                                      "IN_PROGRESS"
                                        ? "warning"
                                        : "active"
                                    }`}
                                  >
                                    {
                                      row.deliveryStatus
                                    }
                                  </span>
                                </td>

                              </tr>
                            )
                          )}
                        </tbody>

                      </table>

                      <Pagination
                        currentPage={
                          upcomingDeliveriesCurrentPage
                        }
                        totalPages={
                          upcomingDeliveriesTotalPages
                        }
                        totalRecords={
                          upcomingDeliveriesTotalRecords
                        }
                        pageSize={
                          upcomingDeliveriesPageSize
                        }
                        onPageChange={
                          handleUpcomingDeliveriesPageChange
                        }
                        onPageSizeChange={
                          handleUpcomingDeliveriesPageSizeChange
                        }
                      />

                    </>
                  )}

                </section>

              </div>
            )}

            {/* ==================================================
                INVENTORY REPORT
            ================================================== */}

            {reportType ===
              "inventory" && (
              <div>

                {/* ==============================================
                    FINISHED GOODS INVENTORY
                ============================================== */}

                <div className="card">

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

                  {inventoryReport.finishedGoodsRows.length ===
                  0 ? (
                    <div className="card-body">
                      No finished goods inventory
                      records available.
                    </div>
                  ) : (
                    <>
                      <table>
                        <thead>
                          <tr>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleFinishedGoodsSortAndReset(
                                    "finishedGoodsStockId"
                                  )
                                }
                              >
                                Stock ID
                                {getSortIndicator(
                                  finishedGoodsSortKey,
                                  "finishedGoodsStockId",
                                  finishedGoodsSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleFinishedGoodsSortAndReset(
                                    "productId"
                                  )
                                }
                              >
                                Product ID
                                {getSortIndicator(
                                  finishedGoodsSortKey,
                                  "productId",
                                  finishedGoodsSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleFinishedGoodsSortAndReset(
                                    "currentStock"
                                  )
                                }
                              >
                                Current Stock
                                {getSortIndicator(
                                  finishedGoodsSortKey,
                                  "currentStock",
                                  finishedGoodsSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleFinishedGoodsSortAndReset(
                                    "minimumStock"
                                  )
                                }
                              >
                                Minimum Stock
                                {getSortIndicator(
                                  finishedGoodsSortKey,
                                  "minimumStock",
                                  finishedGoodsSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleFinishedGoodsSortAndReset(
                                    "status"
                                  )
                                }
                              >
                                Status
                                {getSortIndicator(
                                  finishedGoodsSortKey,
                                  "status",
                                  finishedGoodsSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleFinishedGoodsSortAndReset(
                                    "lastUpdatedDate"
                                  )
                                }
                              >
                                Last Updated
                                {getSortIndicator(
                                  finishedGoodsSortKey,
                                  "lastUpdatedDate",
                                  finishedGoodsSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleFinishedGoodsSortAndReset(
                                    "notes"
                                  )
                                }
                              >
                                Notes
                                {getSortIndicator(
                                  finishedGoodsSortKey,
                                  "notes",
                                  finishedGoodsSortDirection
                                )}
                              </button>
                            </th>

                          </tr>
                        </thead>

                        <tbody>
                          {paginatedFinishedGoodsRows.map(
                            (row) => (
                              <tr
                                key={
                                  row.finishedGoodsStockId
                                }
                              >
                                <td>
                                  #
                                  {
                                    row.finishedGoodsStockId
                                  }
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
                                  {row.notes ||
                                    "-"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>

                      <Pagination
                        currentPage={
                          finishedGoodsCurrentPage
                        }
                        totalPages={
                          finishedGoodsTotalPages
                        }
                        totalRecords={
                          finishedGoodsTotalRecords
                        }
                        pageSize={
                          finishedGoodsPageSize
                        }
                        onPageChange={
                          handleFinishedGoodsPageChange
                        }
                        onPageSizeChange={
                          handleFinishedGoodsPageSizeChange
                        }
                      />
                    </>
                  )}

                </div>

                {/* ==============================================
                    RAW MATERIAL INVENTORY
                ============================================== */}

                <div
                  className="card"
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

                  {inventoryReport.rawMaterialRows.length ===
                  0 ? (
                    <div className="card-body">
                      No raw material inventory
                      records available.
                    </div>
                  ) : (
                    <>
                      <table>
                        <thead>
                          <tr>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleRawMaterialSortAndReset(
                                    "rawMaterialStockId"
                                  )
                                }
                              >
                                Stock ID
                                {getSortIndicator(
                                  rawMaterialSortKey,
                                  "rawMaterialStockId",
                                  rawMaterialSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleRawMaterialSortAndReset(
                                    "rawMaterialName"
                                  )
                                }
                              >
                                Raw Material
                                {getSortIndicator(
                                  rawMaterialSortKey,
                                  "rawMaterialName",
                                  rawMaterialSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleRawMaterialSortAndReset(
                                    "rawMaterialUnit"
                                  )
                                }
                              >
                                Unit
                                {getSortIndicator(
                                  rawMaterialSortKey,
                                  "rawMaterialUnit",
                                  rawMaterialSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleRawMaterialSortAndReset(
                                    "currentStock"
                                  )
                                }
                              >
                                Current Stock
                                {getSortIndicator(
                                  rawMaterialSortKey,
                                  "currentStock",
                                  rawMaterialSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleRawMaterialSortAndReset(
                                    "minimumStock"
                                  )
                                }
                              >
                                Minimum Stock
                                {getSortIndicator(
                                  rawMaterialSortKey,
                                  "minimumStock",
                                  rawMaterialSortDirection
                                )}
                              </button>
                            </th>

                            <th>
                              <button
                                type="button"
                                className="table-sort-btn"
                                onClick={() =>
                                  handleRawMaterialSortAndReset(
                                    "stockStatus"
                                  )
                                }
                              >
                                Status
                                {getSortIndicator(
                                  rawMaterialSortKey,
                                  "stockStatus",
                                  rawMaterialSortDirection
                                )}
                              </button>
                            </th>

                          </tr>
                        </thead>

                        <tbody>
                          {paginatedRawMaterialRows.map(
                            (row) => (
                              <tr
                                key={
                                  row.rawMaterialStockId
                                }
                              >
                                <td>
                                  #
                                  {
                                    row.rawMaterialStockId
                                  }
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
                                    {
                                      row.stockStatus
                                    }
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>

                      <Pagination
                        currentPage={
                          rawMaterialCurrentPage
                        }
                        totalPages={
                          rawMaterialTotalPages
                        }
                        totalRecords={
                          rawMaterialTotalRecords
                        }
                        pageSize={
                          rawMaterialPageSize
                        }
                        onPageChange={
                          handleRawMaterialPageChange
                        }
                        onPageSizeChange={
                          handleRawMaterialPageSizeChange
                        }
                      />
                    </>
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