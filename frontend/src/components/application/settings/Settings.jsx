import { useEffect, useState } from "react";

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

        setTimeout(() => {
            setProfileSaved(false);
        }, 2500);
    };

    const showPricingSaved = () => {
        setPricingSaved(true);

        setTimeout(() => {
            setPricingSaved(false);
        }, 2500);
    };

    return (
        <div className="page">

            {/* =====================================================
                SETTINGS HEADER
            ====================================================== */}

            <section className="card">

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap"
                    }}
                >

                    <div>

                        <h2>
                            Settings
                        </h2>

                        <p>
                            Manage company, pricing, tax, and application preferences.
                        </p>

                    </div>

                </div>

            </section>

            {/* =====================================================
                COMPANY PROFILE + PRICING
            ====================================================== */}

            <div
                className="g2"
                style={{
                    marginTop: "16px"
                }}
            >

                {/* ==================================================
                    COMPANY PROFILE
                ================================================== */}

                <section className="card">

                    <h2>
                        Company Profile
                    </h2>

                    <div
                        className="form-grid"
                        style={{
                            marginTop: "16px"
                        }}
                    >

                        <div className="fld">

                            <label>
                                Company Name
                            </label>

                            <input
                                value="Shree Kundodari Cement Products"
                                readOnly
                            />

                        </div>

                        <div className="fld">

                            <label>
                                GSTIN
                            </label>

                            <input
                                placeholder="Enter GSTIN"
                            />

                        </div>

                        <div className="fld">

                            <label>
                                Phone
                            </label>

                            <input
                                value="+91 94485 37722"
                                readOnly
                            />

                        </div>

                        <div className="fld">

                            <label>
                                Email
                            </label>

                            <input
                                value="harish.kamat01@gmail.com"
                                readOnly
                            />

                        </div>

                        <div className="fld f-full">

                            <label>
                                Address
                            </label>

                            <textarea
                                style={{
                                    minHeight: "44px"
                                }}
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
                        <div className="alert s">
                            Profile updated
                        </div>
                    )}

                </section>

                {/* ==================================================
                    PRICING & TAX
                ================================================== */}

                <section className="card">

                    <h2>
                        Pricing &amp; Tax
                    </h2>

                    <div
                        style={{
                            marginTop: "16px"
                        }}
                    >

                        <div
                            className="fld"
                            style={{
                                marginBottom: "16px"
                            }}
                        >

                            <label>
                                GST Rate
                            </label>

                            <select defaultValue="18%">

                                <option>
                                    18%
                                </option>

                                <option>
                                    12%
                                </option>

                                <option>
                                    5%
                                </option>

                            </select>

                        </div>

                        <div
                            className="fld"
                            style={{
                                marginBottom: "16px"
                            }}
                        >

                            <label>
                                Default Payment Terms
                            </label>

                            <select defaultValue="Advance">

                                <option>
                                    Advance
                                </option>

                                <option>
                                    50-50
                                </option>

                                <option>
                                    Net 30
                                </option>

                            </select>

                        </div>

                        <div
                            className="fld"
                            style={{
                                marginBottom: "16px"
                            }}
                        >

                            <label>
                                Min Order Qty
                            </label>

                            <input
                                type="number"
                                defaultValue="100"
                            />

                        </div>

                        <div
                            className="fld"
                            style={{
                                marginBottom: "16px"
                            }}
                        >

                            <label>
                                UPI ID
                            </label>

                            <input
                                placeholder="Enter UPI ID"
                            />

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
                        <div className="alert s">
                            Settings saved
                        </div>
                    )}

                </section>

            </div>

            {/* =====================================================
                ALERT PREFERENCES
            ====================================================== */}

            <section
                className="card"
                style={{
                    marginTop: "16px"
                }}
            >

                <h2>
                    Alert Preferences
                </h2>

                <div
                    style={{
                        marginTop: "16px"
                    }}
                >

                    {/* LOW STOCK */}

                    <div className="settings-row">

                        <div>

                            <div className="sr-label">
                                Low cement stock alert
                            </div>

                            <div className="sr-sub">
                                Notify when below 300 bags
                            </div>

                        </div>

                        <div
                            className={`sw2 ${
                                alertPreferences.lowStock
                                    ? "on"
                                    : ""
                            }`}
                            onClick={() =>
                                setAlertPreferences(
                                    (previous) => ({
                                        ...previous,
                                        lowStock:
                                            !previous.lowStock
                                    })
                                )
                            }
                        >
                            {alertPreferences.lowStock
                                ? "ON"
                                : "OFF"}
                        </div>

                    </div>

                    {/* OVERDUE DISPATCH */}

                    <div className="settings-row">

                        <div>

                            <div className="sr-label">
                                Overdue dispatch alert
                            </div>

                            <div className="sr-sub">
                                Notify after 1 day delay
                            </div>

                        </div>

                        <div
                            className={`sw2 ${
                                alertPreferences.overdueDispatch
                                    ? "on"
                                    : ""
                            }`}
                            onClick={() =>
                                setAlertPreferences(
                                    (previous) => ({
                                        ...previous,
                                        overdueDispatch:
                                            !previous.overdueDispatch
                                    })
                                )
                            }
                        >
                            {alertPreferences.overdueDispatch
                                ? "ON"
                                : "OFF"}
                        </div>

                    </div>

                    {/* PAYMENT OVERDUE */}

                    <div className="settings-row">

                        <div>

                            <div className="sr-label">
                                Payment overdue reminder
                            </div>

                            <div className="sr-sub">
                                Auto-alert after 30 days
                            </div>

                        </div>

                        <div
                            className={`sw2 ${
                                alertPreferences.paymentOverdue
                                    ? "on"
                                    : ""
                            }`}
                            onClick={() =>
                                setAlertPreferences(
                                    (previous) => ({
                                        ...previous,
                                        paymentOverdue:
                                            !previous.paymentOverdue
                                    })
                                )
                            }
                        >
                            {alertPreferences.paymentOverdue
                                ? "ON"
                                : "OFF"}
                        </div>

                    </div>

                    {/* PRODUCTION SUMMARY */}

                    <div className="settings-row">

                        <div>

                            <div className="sr-label">
                                Daily production summary email
                            </div>

                            <div className="sr-sub">
                                Sent at 6 PM every day
                            </div>

                        </div>

                        <div
                            className={`sw2 ${
                                alertPreferences.productionSummary
                                    ? "on"
                                    : ""
                            }`}
                            onClick={() =>
                                setAlertPreferences(
                                    (previous) => ({
                                        ...previous,
                                        productionSummary:
                                            !previous.productionSummary
                                    })
                                )
                            }
                        >
                            {alertPreferences.productionSummary
                                ? "ON"
                                : "OFF"}
                        </div>

                    </div>

                    {/* DARK MODE */}

                    <div className="settings-row">

                        <div>

                            <div className="sr-label">
                                Dark mode
                            </div>

                            <div className="sr-sub">
                                Switch application appearance
                            </div>

                        </div>

                        <div
                            className={`sw2 ${
                                isDark ? "on" : ""
                            }`}
                            onClick={() =>
                                setIsDark(
                                    (previous) =>
                                        !previous
                                )
                            }
                        >
                            {isDark
                                ? "ON"
                                : "OFF"}
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Settings;