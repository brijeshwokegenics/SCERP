"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachers, createTeacher, updateTeacher, deleteTeacher  } from ".././../../store/teacherSlice";

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'school'];

export default function TeachersPage() {
  const dispatch = useDispatch();
  const { teachers, loading } = useSelector((state) => state.teachers);
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [errors, setErrors] = useState({});
  


  const initialTeacherData = {
    firstName: "", 
    middleName: "", 
    lastName: "", 
    email: "", 
    phoneNumber: "", 
    subjects: [], 
    designation: "", 
    qualifications: "", 
    experience: 0, 
    joiningDate: new Date().toISOString().split('T')[0], 
    departments: [], 
    certifications: [], 
    gender: "", 
    dateOfBirth: "", 
    address: "", 
    emergencyContact: { 
      name: "", 
      relationship: "", 
      phoneNumber: "" 
    }, 
    workingHours: { 
      start: "", 
      end: "" 
    }, 
    isActive: true, 
    monthlySalary: 0, 
    school: user // Auto-fill school from logged-in user
  };



  const [teacherData, setTeacherData] = useState(initialTeacherData);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setTeacherData(prev => ({
        ...prev,
        school: user || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prevData) => {
      // Clear error for the field being changed
      setErrors(prev => ({ ...prev, [name]: undefined }));

      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prevData,
          [parent]: { ...prevData[parent], [child]: value },
        };
      }

      // Handle arrays
      if (["subjects", "departments", "certifications"].includes(name)) {
        return {
          ...prevData,
          [name]: value.split(",").map(item => item.trim()).filter(item => item !== "")
        };
      }

      // Handle numeric fields
      if (["experience", "monthlySalary"].includes(name)) {
        const numValue = value === "" ? 0 : Number(value);
        return {
          ...prevData,
          [name]: isNaN(numValue) ? prevData[name] : numValue
        };
      }

      return { ...prevData, [name]: value };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    REQUIRED_FIELDS.forEach(field => {
      if (!teacherData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Email validation
    if (teacherData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone number validation (optional)
    if (teacherData.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(teacherData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    // Experience validation
    if (teacherData.experience < 0) {
      newErrors.experience = "Experience cannot be negative";
    }

    // Salary validation
    if (teacherData.monthlySalary < 0) {
      newErrors.monthlySalary = "Salary cannot be negative";
    }

    // Date validations
    const today = new Date();
    if (teacherData.dateOfBirth) {
      const birthDate = new Date(teacherData.dateOfBirth);
      if (birthDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    if (teacherData.joiningDate) {
      const joiningDate = new Date(teacherData.joiningDate);
      if (joiningDate > today) {
        newErrors.joiningDate = "Joining date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
   
    
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }
  
    try {
      const formattedData = {
        ...teacherData,
        gender: teacherData.gender.charAt(0).toUpperCase() + teacherData.gender.slice(1),
        experience: Number(teacherData.experience),
        monthlySalary: Number(teacherData.monthlySalary),
      };
  
      let result;
    
      if (editingTeacher) {
        result = await dispatch(updateTeacher({ id: editingTeacher._id, teacherData: formattedData }));
      } else {
        result = await dispatch(createTeacher(formattedData));
      }
  
      console.log("Dispatch result:", result);
      result = await dispatch(createTeacher(formattedData));
      // Check if the dispatch action has any errors
      if (result.error) {
        throw new Error(result.error.message || "Something went wrong");
      }
  
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving teacher:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to save teacher data. Please try again.",
      }));
    }
  };
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this teacher?");
    if (!confirmed) return;
  
    try {
      const result = await dispatch(deleteTeacher(id));
      if (result.error) {
        throw new Error(result.error.message || "Delete failed");
      }
    } catch (error) {
      alert("Error deleting teacher: " + error.message);
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTeacherData(initialTeacherData);
    setEditingTeacher(null);
    setErrors({});
  };

  const renderFormField = (label, name, type = "text", options = {}) => {
    const {
      required = false,
      placeholder = "",
      min,
      isTextarea = false,
      isSelect = false,
      selectOptions = [],
      pattern,
    } = options;

    const fieldName = name.includes(".") ? name.split(".")[1] : name;
    const displayLabel = `${label}${required ? " *" : ""}`;
    
    let value = name.includes(".")
      ? teacherData[name.split(".")[0]][name.split(".")[1]]
      : teacherData[name];

    if (["subjects", "departments", "certifications"].includes(name) && Array.isArray(value)) {
      value = value.join(", ");
    }

    const commonProps = {
      name,
      value,
      onChange: handleInputChange,
      className: `w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 ${
        errors[fieldName] ? 'border-red-500' : ''
      }`,
      placeholder,
      ...(min !== undefined && { min }),
      ...(pattern && { pattern })
    };
  
    
    return (
      <div className="space-y-1">
        <label className="block  font-medium">{displayLabel}</label>
        {isSelect ? (
          <select {...commonProps}>
            <option value="">Select {label}</option>
            {selectOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : isTextarea ? (
          <textarea {...commonProps} rows="3" />
        ) : (
          <input type={type} {...commonProps} />
        )}
        {errors[fieldName] && (
          <p className="text-red-500 text-sm">{errors[fieldName]}</p>
        )}
      </div>
    );
  };
console.log(teachers)
  return (
    <div className="max-w-4xl w-full mt-5 mx-auto p-6 overflow-y-auto  shadow-lg rounded-lg" style={{ height: "75vh" }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold text-gray-700">Teachers List</h1>
        <button 
          onClick={() => setOpenDialog(true)} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Teacher
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center my-6 text-lg text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Subjects</th>
              <th className="py-3 px-4">Designation</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {teacher.firstName} {teacher.lastName}
                </td>
                <td className="py-3 px-4">{teacher.email}</td>
                <td className="py-3 px-4">{teacher.phoneNumber || "N/A"}</td>
                <td className="py-3 px-4">
                  {Array.isArray(teacher.subjects) ? teacher.subjects.join(", ") : "N/A"}
                </td>
                <td className="py-3 px-4">{teacher.designation || "N/A"}</td>
                <td className="py-3 px-4 flex gap-2">
  <button
    onClick={() => {
      setEditingTeacher(teacher);
      setTeacherData({
        ...teacher,
        subjects: Array.isArray(teacher.subjects) ? teacher.subjects : [],
        departments: Array.isArray(teacher.departments) ? teacher.departments : [],
        certifications: Array.isArray(teacher.certifications) ? teacher.certifications : [],
        dateOfBirth: teacher.dateOfBirth
          ? new Date(teacher.dateOfBirth).toISOString().split("T")[0]
          : "",
        joiningDate: teacher.joiningDate
          ? new Date(teacher.joiningDate).toISOString().split("T")[0]
          : "",
      });
      setOpenDialog(true);
    }}
    className="text-blue-600 hover:underline"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(teacher._id)}
    className="text-red-600 hover:underline"
  >
    Delete
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      )}

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">
                {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
              </h2>
              <button 
                onClick={handleCloseDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
                {renderFormField("First Name", "firstName", "text", { required: true })}
                {renderFormField("Middle Name", "middleName")}
                {renderFormField("Last Name", "lastName", "text", { required: true })}
                {renderFormField("Email", "email", "email", { required: true })}
                {renderFormField("Phone Number", "phoneNumber", "tel", { 
                  pattern: "\\+?[\\d\\s-]{10,}"
                })}
                {renderFormField("Gender", "gender", "text", { 
                  isSelect: true,
                  selectOptions: [
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" }
                  ]
                })}
                {renderFormField("Date of Birth", "dateOfBirth", "date")}
                {renderFormField("Address", "address", "text", { isTextarea: true })}
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Professional Information</h3>
                {renderFormField("Subjects", "subjects", "text", { 
                  placeholder: "Enter subjects separated by commas" 
                })}
                {renderFormField("Designation", "designation")}
                {renderFormField("Qualifications", "qualifications")}
                {renderFormField("Experience (years)", "experience", "number", { min: 0 })}
                {renderFormField("Joining Date", "joiningDate", "date")}
                {renderFormField("Departments", "departments", "text", { 
                  placeholder: "Enter departments separated by commas"
                })}
                {renderFormField("Certifications", "certifications", "text", {
                  placeholder: "Enter certifications separated by commas"
                })}
                {renderFormField("Monthly Salary", "monthlySalary", "number", { min: 0 })}
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Emergency Contact</h3>
                {renderFormField("Name", "emergencyContact.name")}
                {renderFormField("Relationship", "emergencyContact.relationship")}
                {renderFormField("Phone Number", "emergencyContact.phoneNumber", "tel")}
              </div>

              {/* Working Hours */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Working Hours</h3>
                {renderFormField("Start Time", "workingHours.start", "time")}
                {renderFormField("End Time", "workingHours.end", "time")}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button 
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingTeacher ? "Update Teacher" : "Add Teacher"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}