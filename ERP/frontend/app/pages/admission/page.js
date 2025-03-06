"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchAdmissions, deleteAdmission } from "../../../store/admissionSlice";
import AddAdmissionModal from "./add/page";
import EditAdmissionModal from "./edit/page";

const AdmissionsList = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { admissions, status, error } = useSelector((state) => state.admissions);
  const { token } = useSelector((state) => state.auth);

  // Fetch admissions on mount if authenticated
  useEffect(() => {
    if (token) {
      dispatch(fetchAdmissions());
    } else {
      router.push("/"); // Redirect to login if not authenticated
    }
  }, [dispatch, token, router]);

  // Open Add Admission modal
  const handleOpenAddModal = () => {
    setIsModalOpen(true);
  };

  // Open Edit Admission modal + store the admission _id
  const handleOpenEditModal = (admissionId) => {
    setSelectedAdmissionId(admissionId);
    setIsEditModalOpen(true);
  };

  // Close any opened modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedAdmissionId(null);
  };

  // Delete an admission
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this admission?")) {
      dispatch(deleteAdmission(id));
    }
  };

  // Filter admissions by first name (example)
  const filteredAdmissions = searchTerm.trim()
    ? admissions.filter((admission) =>
        admission.firstName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : admissions;

  if (status === "loading") return <p>Loading admissions...</p>;
  if (status === "failed") return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      {/* Header section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admissions</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Admission
        </button>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Admissions Table */}
      {filteredAdmissions.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Admission Number</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Class</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmissions.map((admission) => (
              <tr key={admission._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{admission.admissionNumber}</td>
                <td className="border px-4 py-2">{`${admission.firstName} ${admission.lastName}`}</td>
                <td className="border px-4 py-2">{admission.admissionClass}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleOpenEditModal(admission._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admission._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center">No admissions found.</p>
      )}

      {/* Modals */}
      {isModalOpen && <AddAdmissionModal onClose={handleCloseModal} />}
      {isEditModalOpen && selectedAdmissionId && (
        <EditAdmissionModal admissionId={selectedAdmissionId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AdmissionsList;
