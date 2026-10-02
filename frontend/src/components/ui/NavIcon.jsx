import React from "react";

function NavIcon({ type }) {
  const commonProps = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (type) {
    case "customer":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
        </svg>
      );

    case "supplier":
      return (
        <svg {...commonProps}>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M8 6V4h8v2" />
          <path d="M3 11h18" />
          <path d="M9 11v2h6v-2" />
        </svg>
      );

    case "product":
      return (
        <svg {...commonProps}>
          <path d="M4 8l8-4 8 4-8 4-8-4Z" />
          <path d="M4 8v8l8 4 8-4V8" />
          <path d="M12 12v8" />
        </svg>
      );

    case "raw-material":
      return (
        <svg {...commonProps}>
          <path d="M4 17c2-4 5-6 8-6s6 2 8 6" />
          <path d="M5 17h14" />
          <circle cx="8" cy="14" r="1" />
          <circle cx="12" cy="13" r="1" />
          <circle cx="16" cy="15" r="1" />
        </svg>
      );

    case "labour":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="7" r="3" />
          <path d="M5 21c.5-4 3-6 7-6s6.5 2 7 6" />
          <path d="M8 4l4-2 4 2" />
        </svg>
      );

    case "asset":
      return (
        <svg {...commonProps}>
          <rect x="4" y="7" width="16" height="11" rx="2" />
          <circle cx="9" cy="12.5" r="2" />
          <path d="M14 10h3M14 13h3M7 18v2M17 18v2" />
        </svg>
      );

    case "attendance":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />
          <path d="M14 15c3-.5 5 1 6 4" />
        </svg>
      );

    case "purchase":
      return (
        <svg {...commonProps}>
          <path d="M4 5h2l2 11h10l2-8H7" />
          <circle cx="10" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
          <path d="M10 8h7M10 11h6" />
        </svg>
      );

    case "production":
      return (
        <svg {...commonProps}>
          <path d="M4 20V9l6 3V7l6 3V4h4v16" />
          <path d="M3 20h18" />
          <path d="M8 16h2M14 16h2" />
        </svg>
      );

    case "raw-material-stock":
      return (
        <svg {...commonProps}>
          <path d="M4 17c2-4 5-6 8-6s6 2 8 6" />
          <path d="M5 17h14" />
          <circle cx="8" cy="14" r="1" />
          <circle cx="12" cy="13" r="1" />
          <circle cx="16" cy="15" r="1" />
        </svg>
      );

    case "curing-stock":
      return (
        <svg {...commonProps}>
          <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
          <path d="M9 15c.3 1.5 1.2 2.5 3 2.8" />
        </svg>
      );

    case "finished-goods-stock":
      return (
        <svg {...commonProps}>
          <path d="M4 8l8-4 8 4-8 4-8-4Z" />
          <path d="M4 8v9l8 4 8-4V8" />
          <path d="M12 12v9" />
        </svg>
      );

    case "order":
      return (
        <svg {...commonProps}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );

    case "delivery":
      return (
        <svg {...commonProps}>
          <path d="M3 6h11v10H3z" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );

    case "payment":
      return (
        <svg {...commonProps}>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
          <circle cx="12" cy="14.5" r="2.5" />
          <path d="M12 13v3M11 14h2" />
        </svg>
      );

    case "payment-allocation":
      return (
        <svg {...commonProps}>
          <circle cx="8" cy="12" r="4" />
          <circle cx="16" cy="12" r="4" />
          <path d="M10 9.5h4M10 14.5h4" />
        </svg>
      );

    case "dashboard":
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );

    case "reports":
      return (
        <svg {...commonProps}>
          <path d="M4 19V5" />
          <path d="M4 19h17" />
          <path d="M7 15l4-5 3 3 5-7" />
        </svg>
      );

    case "statements":
      return (
        <svg {...commonProps}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );

    case "settings":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H5.3v-2.5h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.5v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.5h-.2a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      );

    case "about":
      return (
        <img
          src="/assets/skcp-logo.png"
          alt=""
          width="16"
          height="16"
        />
      );

    default:
      return null;
  }
}

export default NavIcon;