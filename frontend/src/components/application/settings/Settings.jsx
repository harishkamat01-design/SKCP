import { useEffect, useState } from "react";

function Settings() {
    
    const [isDark, setIsDark] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
    );

    useEffect(() => {
    document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
       );
     }, [isDark]);

    const [profileSaved, setProfileSaved] = useState(false);
    const [pricingSaved, setPricingSaved] = useState(false);
    const [alertPreferences, setAlertPreferences] = useState({
    lowStock: true,
    overdueDispatch: true,
    paymentOverdue: true,
    productionSummary: false,
    });

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
        <div className="module-container">

            {/* ====================================================
                SETTINGS HEADER
            ==================================================== */}

            <div className="module-header">

                <h1>
                    Settings
                </h1>

                <p>
                    Manage company, pricing, tax, and application preferences.
                </p>

            </div>


            {/* ====================================================
                COMPANY PROFILE + PRICING
            ==================================================== */}

            <div className="g2">

                {/* ==================================================
                    COMPANY PROFILE
                ================================================== */}

                <div className="card">

                    <div className="card-head">

                        <div className="card-title">

                            <i className="ti ti-building"></i>

                            Company profile

                        </div>

                    </div>


                    <div className="form-grid">

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
                                style={{ minHeight: "44px" }}
                                value="Halkar Road, Kumta, Uttara Kannada — 581343, Karnataka, India"
                                readOnly
                            />

                        </div>

                    </div>


                    <div className="btn-row">

                        <button
                            className="btn primary"
                            onClick={showProfileSaved}
                        >

                            <i className="ti ti-device-floppy"></i>

                           Save 

                        </button>

                    </div>


                    {profileSaved && (
                        <div className="alert s">
                            Profile updated
                        </div>
                    )}

                </div>


                {/* ==================================================
                    PRICING & TAX
                ================================================== */}

                <div className="card">

                    <div className="card-head">

                        <div className="card-title">

                            <i className="ti ti-receipt"></i>

                            Pricing &amp; Tax

                        </div>

                    </div>


                    <div
                        className="fld"
                        style={{ marginBottom: "9px" }}
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
                        style={{ marginBottom: "9px" }}
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
                        style={{ marginBottom: "9px" }}
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
                        style={{ marginBottom: "9px" }}
                    >

                        <label>
                            UPI ID
                        </label>

                        <input
                            placeholder="Enter UPI ID"
                        />

                    </div>


                    <div className="btn-row">

                        <button
                            className="btn primary"
                            onClick={showPricingSaved}
                        >

                            <i className="ti ti-device-floppy"></i>

                            Save

                        </button>

                    </div>


                    {pricingSaved && (
                        <div className="alert s">
                            Settings saved
                        </div>
                    )}

                </div>

            </div>


            {/* ====================================================
                ALERT PREFERENCES
            ==================================================== */}

            <div className="card">

                <div className="card-head">

                    <div className="card-title">

                        <i className="ti ti-bell"></i>

                        Alert preferences

                    </div>

                </div>


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
                        alertPreferences.lowStock ? "on" : ""
                    }`}
                    onClick={() =>
                        setAlertPreferences((previous) => ({
                            ...previous,
                            lowStock: !previous.lowStock,
                        }))
                    }
                >
                  {alertPreferences.lowStock ? "ON" : "OFF"} 
                </div>

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

                    <div
                      className={`sw2 ${
                          alertPreferences.overdueDispatch ? "on" : ""
                      }`}
                      onClick={() =>
                          setAlertPreferences((previous) => ({
                              ...previous,
                              overdueDispatch: !previous.overdueDispatch,
                          }))
                      }
                   >
                      {alertPreferences.overdueDispatch ? "ON" : "OFF"}
                  </div>

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

                <div
                    className={`sw2 ${
                        alertPreferences.paymentOverdue ? "on" : ""
                    }`}
                    onClick={() =>
                        setAlertPreferences((previous) => ({
                            ...previous,
                            paymentOverdue: !previous.paymentOverdue,
                        }))
                    }
                >
                    {alertPreferences.paymentOverdue ? "ON" : "OFF"}
                </div>

              </div>


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
                            alertPreferences.productionSummary ? "on" : ""
                        }`}
                        onClick={() =>
                            setAlertPreferences((previous) => ({
                                ...previous,
                                productionSummary: !previous.productionSummary,
                            }))
                        }
                    >
                        {alertPreferences.productionSummary ? "ON" : "OFF"}
                    </div>

                </div>


                <div className="settings-row">

                    <div>

                        <div className="sr-label">
                            Dark mode
                        </div>

                    </div>

                    <div
                        className={`sw2 ${isDark ? "on" : ""}`}
                        onClick={() =>
                            setIsDark((previous) => !previous)
                        }
                    >
                        {isDark ? "ON" : "OFF"}
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Settings;

