import { useState } from "react";

const API_BASE_URL = "http://localhost:8080/api";

const ROLES = [
  {
    value: "ADMIN",
    label: "Admin",
    description: "Proprietor / Director",
  },
  {
    value: "PRODUCTION_MANAGER",
    label: "Production Manager",
    description: "Production operations",
  },
  {
    value: "B2B",
    label: "B2B",
    description: "B2B / Sales operations",
  },
  {
    value: "STORE_MANAGER",
    label: "Store Manager",
    description: "Store operations",
  },
  {
    value: "LOGISTICS",
    label: "Logistics",
    description: "Logistics / Delivery",
  },
];

function Login({ onLogin, isDark, setIsDark }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Invalid username, password, or role."
        );
      }

      sessionStorage.setItem("skcp_token", data.token);
      sessionStorage.setItem("skcp_user", data.username);
      sessionStorage.setItem("skcp_role", data.role);
      sessionStorage.setItem(
        "skcp_user_id",
        String(data.userId)
      );

      onLogin();
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the SKCP authentication service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skcp-login-page"
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="skcp-login-header">

        {/* Logo */}
        <div className="skcp-login-logo-wrap">
          <img
            src="/assets/skcp-logo.png"
            alt="SKCP Logo"
            className="skcp-login-logo"
          />
        </div>

        {/* Centered company name + tagline */}
        <div className="skcp-login-brand-center">
          <div className="skcp-login-brand-name">
            Shree Kundodari Cement Products
          </div>

          <div className="skcp-login-brand-tagline">
            Build your dreams with our passion
          </div>
        </div>

        {/* Login dropdown */}
        <div className="skcp-login-menu-wrapper">

          <button
            type="button"
            className="skcp-login-menu"
            onClick={() =>
              setShowRoleMenu(!showRoleMenu)
            }
          >
            <span>
              Login
            </span>

            <span className="skcp-login-menu-arrow">
              {showRoleMenu ? "▴" : "▾"}
            </span>
          </button>

          {showRoleMenu && (
            <div className="skcp-login-role-menu">

              {ROLES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`skcp-login-role-option ${
                    role === item.value ? "active" : ""
                  }`}
                  onClick={() => {
                    setRole(item.value);
                    setShowRoleMenu(false);
                  }}
                >
                  <span className="skcp-role-option-name">
                    {item.label}
                  </span>

                  <span className="skcp-role-option-description">
                    {item.description}
                  </span>
                </button>
              ))}

            </div>
          )}

        </div>

      </header>

      {/* =====================================================
          MAIN LOGIN AREA
          ===================================================== */}

      <main className="skcp-login-main">

          {/* Login page visual background */}
          <div className="skcp-login-visual">

            <div className="skcp-login-image skcp-login-image-left">
              <img
                src="/assets/LoginPage_LeftSide_2.png"
                alt=""
              />
            </div>

            <div className="skcp-login-image skcp-login-image-right">
              <img
                src="/assets/LoginPage_RightSide_1.png"
                alt=""
              />
            </div>

          </div>

        {/* Centered management card */}
        <section className="skcp-login-card">

          <div className="skcp-login-form-panel">

            <div className="skcp-login-form-heading">

              <span className="skcp-login-eyebrow">
                SKCP MANAGEMENT
              </span>

              <h1>
                Welcome back
              </h1>

              <p>
                Sign in to access the SKCP Management Dashboard.
              </p>

            </div>

            <form onSubmit={handleLogin}>

              {/* Username */}
              <div className="skcp-login-field">

                <label htmlFor="skcp-username">
                  Username
                </label>

                <input
                  id="skcp-username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  placeholder="Enter username"
                  autoComplete="username"
                />

              </div>

              {/* Password */}
              <div className="skcp-login-field">

                <label htmlFor="skcp-password">
                  Password
                </label>

                <div className="skcp-login-password-wrap">

                  <input
                    id="skcp-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="skcp-login-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    title={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      /* Eye-off icon */
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 3l18 18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        <path
                          d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        <path
                          d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.5 6a11.8 11.8 0 0 1-3.1 3.7M6.2 6.2C4.4 7.5 3.2 9.2 2.5 10c1 2 4.5 6 9.5 6 1 0 1.9-.2 2.8-.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      /* Eye icon */
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r="2.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </button>

                </div>

              </div>

              {/* Role */}
              <div className="skcp-login-field">

                <label htmlFor="skcp-role">
                  Login as
                </label>

                <select
                  id="skcp-role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                >
                  {ROLES.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label} — {item.description}
                    </option>
                  ))}
                </select>

              </div>

              {/* Error */}
              {error && (
                <div className="skcp-login-error">

                  <span>!</span>

                  <span>
                    {error}
                  </span>

                </div>
              )}

              {/* Login */}
              <button
                type="submit"
                className="skcp-login-button"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Login"}
              </button>

            </form>

            {/* Authorization + Address */}
            <div className="skcp-login-footer-info">

              <div className="skcp-login-security">

                <span className="skcp-login-lock">
                  🔒
                </span>

                <span>
                  Authorised SKCP staff only
                </span>

              </div>

              <div className="skcp-login-address">
                Halkar Road, Kumta - 581343
              </div>

              {/* Global Light / Dark Mode */}
              <button
                type="button"
                className="skcp-login-theme-toggle"
                onClick={() => setIsDark(!isDark)}
                aria-label={
                  isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                title={
                  isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                <span className="skcp-login-theme-icon">
                  {isDark ? "☀" : "☾"}
                </span>

                <span>
                  {isDark
                    ? "Light Mode"
                    : "Dark Mode"}
                </span>
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="skcp-login-footer">
        © {new Date().getFullYear()} Shree Kundodari Cement Products
      </footer>

    </div>
  );
}

export default Login;