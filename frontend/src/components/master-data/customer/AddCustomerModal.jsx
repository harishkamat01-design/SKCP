import { useState } from "react";
import { apiPost } from "../../../services/api";

import FormModal from "../../ui/common/FormModal";

const initialForm = {
    customerName: "",
    mobileNumber: "",
    alternateMobile: "",
    address: "",
    village: "",
    city: "",
    pincode: "",
    gstNumber: "",
    remarks: "",
};
import "./Customer.css";
function AddCustomerModal({
    isOpen,
    onClose,
    onCustomerCreated,
}) {
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setError("");
        setSuccess("");
    };

    const handleClose = () => {
        if (saving) {
            return;
        }

        resetForm();
        onClose();
    };

    const validateForm = () => {
        if (!form.customerName.trim()) {
            return "Customer name is required.";
        }

        if (!form.mobileNumber.trim()) {
            return "Mobile number is required.";
        }

        return "";
    };

    const buildPayload = () => ({
        customerName: form.customerName.trim(),
        mobileNumber: form.mobileNumber.trim(),
        alternateMobile:
            form.alternateMobile.trim() || null,
        address:
            form.address.trim() || null,
        village:
            form.village.trim() || null,
        city:
            form.city.trim() || null,
        pincode:
            form.pincode.trim() || null,
        gstNumber:
            form.gstNumber.trim() || null,
        remarks:
            form.remarks.trim() || null,
    });

    const handleCreateCustomer = async (event) => {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const result = await apiPost(
                "/api/customers",
                buildPayload()
            );

            const createdCustomer = result?.data;

            if (!createdCustomer?.customerId) {
                throw new Error(
                    "Customer was created but customer ID was not returned."
                );
            }

            setSuccess(
                result?.message ||
                    "Customer created successfully."
            );

            setTimeout(() => {
                resetForm();

                onCustomerCreated(
                    createdCustomer
                );

                onClose();
            }, 700);
        } catch (err) {
            console.error(
                "Error creating customer:",
                err
            );

            setError(
                err.message ||
                    "Failed to create customer."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Customer"
            subtitle="Enter customer information"
            formId="skcp-form-add-customer"
            onSubmit={handleCreateCustomer}
            submitLabel="Add Customer"
            cancelLabel="Cancel"
            saving={saving}
            error={error}
            success={success}
            size="lg"
        >
            <div className="form-section">
                <h4>Customer Information</h4>

                <div className="form-grid">

                    <div className="fld">
                        <label>
                            Customer Name{" "}
                            <span className="required">
                                *
                            </span>
                        </label>

                        <input
                            name="customerName"
                            type="text"
                            value={
                                form.customerName
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Enter customer name"
                        />
                    </div>

                    <div className="fld">
                        <label>
                            Mobile Number{" "}
                            <span className="required">
                                *
                            </span>
                        </label>

                        <input
                            name="mobileNumber"
                            type="text"
                            value={
                                form.mobileNumber
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Enter mobile number"
                        />
                    </div>

                    <div className="fld">
                        <label>
                            Alternate Mobile
                        </label>

                        <input
                            name="alternateMobile"
                            type="text"
                            value={
                                form.alternateMobile
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Enter alternate mobile"
                        />
                    </div>

                    <div className="fld">
                        <label>
                            GST Number
                        </label>

                        <input
                            name="gstNumber"
                            type="text"
                            value={
                                form.gstNumber
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Enter GST number"
                        />
                    </div>

                </div>
            </div>

            <div className="form-section">
                <h4>Address Information</h4>

                <div className="form-grid">

                    <div className="fld">
                        <label>
                            Village
                        </label>

                        <input
                            name="village"
                            type="text"
                            value={
                                form.village
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Enter village"
                        />
                    </div>

                    <div className="fld">
                        <label>
                            City
                        </label>

                        <input
                            name="city"
                            type="text"
                            value={
                                form.city
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Enter city"
                        />
                    </div>

                    <div className="fld">
                        <label>
                            Pincode
                        </label>

                        <input
                            name="pincode"
                            type="text"
                            value={
                                form.pincode
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Enter pincode"
                        />
                    </div>

                    <div className="fld full">
                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={
                                form.address
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Enter address"
                            rows="3"
                        />
                    </div>

                </div>
            </div>

            <div className="form-section">
                <h4>Additional Information</h4>

                <div className="form-grid">

                    <div className="fld full">
                        <label>
                            Remarks
                        </label>

                        <textarea
                            name="remarks"
                            value={
                                form.remarks
                            }
                            onChange={
                                handleFormChange
                            }
                            placeholder="Enter remarks"
                            rows="3"
                        />
                    </div>

                </div>
            </div>
        </FormModal>
    );
}

export default AddCustomerModal;