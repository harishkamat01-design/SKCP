import { useEffect, useState } from "react";
import "./Settings.css";

function Settings() {
    const [isDark, setIsDark] = useState(
        document.documentElement.getAttribute("data-theme") === "dark"
    );

    const [profileSaved, setProfileSaved] = useState(false);
    const [pricingSaved, setPricingSaved] = useState(false);

    const [alertPreferences, setAlertPreferences] = useState({
        lowStock: true,
        overdueDispatch: true,
        paymentOverdue: true,
        productionSummary: false
    });

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            isDark ? "dark" : "light"
        );
    }, [isDark]);

    const showProfileSaved = () => {
        setProfileSaved(true);
        window.setTimeout(() => setProfileSaved(false), 2500);
    };

    const showPricingSaved = () => {
        setPricingSaved(true);
        window.setTimeout(() => setPricingSaved(false), 2500);
    };

    const toggleAlert = (key) => {
        setAlertPreferences((previous) => ({
            ...previous,
            [key]: !previous[key]
        }));
    };

    const renderToggle = (checked, onClick, label) => (
        <button
            type="button"
            className={`sw2 ${checked ? "on" : ""}`}
            onClick={onClick}
            aria-pressed={checked}
            aria-label={label}
        >
            {checked ? "ON" : "OFF"}
        </button>
    );

    return (
        <div className="page skcp-settings">
            {/* SETTINGS HEADER */}
            <section className="settings-header">
                <h2>Settings</h2>
                <p>
                    Manage company, pricing, tax, and application preferences.
                </p>
            </section>

            {/* COMPANY PROFILE AND PRICING */}
            <div className="settings-grid">
                {/* COMPANY PROFILE */}
                <section className="settings-card">
                    <h2>Company Profile</h2>

                    <div className="form-grid" style={{ marginTop: "16px" }}>
                        <div className="fld">
                            <label>Company Name</label>
                            <input
                                value="Shree Kundodari Cement Products"
                                readOnly
                            />
                        </div>

                        <div className="fld">
                            <label>GSTIN</label>
                            <input
                                placeholder="Enter GSTIN"
                                aria-label="GSTIN"
                            />
                        </div>

                        <div className="fld">
                            <label>Phone</label>
                            <input value="+91 94485 37722" readOnly />
                        </div>

                        <div className="fld">
                            <label>Email</label>
                            <input
                                value="harish.kamat01@gmail.com"
                                readOnly
                            />
                        </div>

                        <div className="fld f-full">
                            <label>Address</label>
                            <textarea
                                style={{ minHeight: "44px" }}
                                value="Halkar Road, Kumta, Uttara Kannada — 581343, Karnataka, India"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="btn-row">
                        <button
                            type="button"
                            className="btn primary"
                            onClick={showProfileSaved}
                        >
                            Save
                        </button>
                    </div>

                    {profileSaved && (
                        <div className="alert s" role="status">
                            Demo only: company profile has not been saved.
                        </div>
                    )}
                </section>

                {/* PRICING AND TAX */}
                <section className="settings-card">
                    <h2>Pricing &amp; Tax</h2>

                    <div style={{ marginTop: "16px" }}>
                        <div className="fld" style={{ marginBottom: "16px" }}>
                            <label>GST Rate</label>
                            <select defaultValue="18%">
                                <option value="18%">18%</option>
                                <option value="12%">12%</option>
                                <option value="5%">5%</option>
                            </select>
                        </div>

                        <div className="fld" style={{ marginBottom: "16px" }}>
                            <label>Default Payment Terms</label>
                            <select defaultValue="Advance">
                                <option value="Advance">Advance</option>
                                <option value="50-50">50-50</option>
                                <option value="Net 30">Net 30</option>
                            </select>
                        </div>

                        <div className="fld" style={{ marginBottom: "16px" }}>
                            <label>Minimum Order Quantity</label>
                            <input
                                type="number"
                                min="1"
                                defaultValue="100"
                            />
                        </div>

                        <div className="fld" style={{ marginBottom: "16px" }}>
                            <label>UPI ID</label>
                            <input placeholder="Enter UPI ID" />
                        </div>
                    </div>

                    <div className="btn-row">
                        <button
                            type="button"
                            className="btn primary"
                            onClick={showPricingSaved}
                        >
                            Save
                        </button>
                    </div>

                    {pricingSaved && (
                        <div className="alert s" role="status">
                            Demo only: pricing preferences have not been saved.
                        </div>
                    )}
                </section>
            </div>

            {/* ALERT PREFERENCES */}
            <section className="settings-card">
                <h2>Alert Preferences</h2>

                <div style={{ marginTop: "16px" }}>
                    <div className="settings-row">
                        <div>
                            <div className="sr-label">
                                Low cement stock alert
                            </div>
                            <div className="sr-sub">
                                Notify when below 300 bags
                            </div>
                        </div>
                        {renderToggle(
                            alertPreferences.lowStock,
                            () => toggleAlert("lowStock"),
                            "Toggle low cement stock alert"
                        )}
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="sr-label">
                                Overdue dispatch alert
                            </div>
                            <div className="sr-sub">
                                Notify after 1 day delay
                            </div>
                        </div>
                        {renderToggle(
                            alertPreferences.overdueDispatch,
                            () => toggleAlert("overdueDispatch"),
                            "Toggle overdue dispatch alert"
                        )}
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="sr-label">
                                Payment overdue reminder
                            </div>
                            <div className="sr-sub">
                                Auto-alert after 30 days
                            </div>
                        </div>
                        {renderToggle(
                            alertPreferences.paymentOverdue,
                            () => toggleAlert("paymentOverdue"),
                            "Toggle payment overdue reminder"
                        )}
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="sr-label">
                                Daily production summary email
                            </div>
                            <div className="sr-sub">
                                Intended for 6 PM daily; sending is not implemented.
                            </div>
                        </div>
                        {renderToggle(
                            alertPreferences.productionSummary,
                            () => toggleAlert("productionSummary"),
                            "Toggle daily production summary"
                        )}
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="sr-label">Dark mode</div>
                            <div className="sr-sub">
                                Switch application appearance
                            </div>
                        </div>
                        {renderToggle(
                            isDark,
                            () => setIsDark((previous) => !previous),
                            "Toggle dark mode"
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Settings;
