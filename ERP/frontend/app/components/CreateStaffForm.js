// frontend/components/CreateStaffForm.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStaff } from "../../store/authSlice";

const CreateStaffForm = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [staffRole, setStaffRole] = useState("");

  // UI state
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  /**
   * Validation function
   */
  const validateFields = () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!password || password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (!firstName.trim()) {
      return "First name is required.";
    }
    if (!lastName.trim()) {
      return "Last name is required.";
    }
    if (!staffRole.trim()) {
      return "Staff role is required.";
    }
    return "";
  };

  /**
   * Handler to create a Staff member
   */
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setMessage("");
    setFormError("");

    const validationError = validateFields();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const newStaff = {
        email,
        password,
        firstName,
        lastName,
        staffRole,
      };
      const resultAction = await dispatch(createStaff(newStaff));
      if (createStaff.fulfilled.match(resultAction)) {
        setMessage("Staff member created successfully.");
        // Reset form fields
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setStaffRole("");
      } else {
        setFormError(resultAction.payload?.message || "Failed to create Staff.");
      }
    } catch (err) {
      setFormError("An unexpected error occurred.");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Create a New Staff Member</h2>
      <form onSubmit={handleCreateStaff} className="space-y-4">
        {formError && <p className="text-red-600">{formError}</p>}
        {message && <p className="text-green-600">{message}</p>}

        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">First Name:</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Last Name:</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Staff Role:</label>
          <select
            className="w-full border p-2 rounded"
            value={staffRole}
            onChange={(e) => setStaffRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="ACCOUNTANT">Accountant</option>
            <option value="PRINCIPAL">Principal</option>
            <option value="TEACHER">Teacher</option>
            <option value="OTHERS">Others</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Creating..." : "Create Staff"}
        </button>
      </form>
    </div>
  );
};

export default CreateStaffForm;
