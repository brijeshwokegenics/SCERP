'use client';
import React, { useState } from 'react';
import AddAdmission from '../../components/admission/addAdmission';

export default function AddClassSchedulePage() {
  const [successMessage, setSuccessMessage] = useState('');

  const handleFormSubmission = async (formData) => {
    const BaseUrl = 'http://localhost:5000'; // Backend server base URL
    try {
      const response = await fetch(`${BaseUrl}/api/class-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setSuccessMessage('Class schedule added successfully!');
        console.log('Added schedule:', responseData);
      } else {
        const errorResponse = await response.json();
        alert(`Error: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error('Error adding class schedule:', error);
      alert('Failed to add class schedule. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      <AddAdmission onFormSubmit={handleFormSubmission} />
    </div>
  );
}
