// ✅ Complete fixed and integrated HostelRoomBedManager UI with working Redux slices in a single file
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoom,
  getRooms,
  deleteRoom,
  updateRoom,
} from "../../../store/roomSlice";
import {
  addBed,
  getBeds,
  deleteBed,
  updateBed,
} from "../../../store/bedSlice";
import {
  addHostel,
  getAllHostels,
  deleteHostel,
  updateHostel,
} from "../../../store/hostelSlice";

const tabs = ["Hostel", "Room", "Bed"];
const subTabs = ["Add", "List"];

const HostelRoomBedManager = () => {
  const [activeTab, setActiveTab] = useState("Hostel");
  const [activeSubTab, setActiveSubTab] = useState("Add");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  const dispatch = useDispatch();
  const roomState = useSelector((state) => state.room);
  const bedState = useSelector((state) => state.bed);
  const hostelState = useSelector((state) => state.hostel);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (activeTab === "Room" && activeSubTab === "List") dispatch(getRooms());
    if (activeTab === "Bed" && activeSubTab === "List") dispatch(getBeds());
    if (activeTab === "Hostel" && activeSubTab === "List") dispatch(getAllHostels(token));
  }, [activeTab, activeSubTab, dispatch, token]);

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({ ...item });
  };

  const handleUpdate = () => {
    if (activeTab === "Hostel") dispatch(updateHostel({ id: editId, data: form, token }));
    if (activeTab === "Room") dispatch(updateRoom({ id: editId, data: form, token }));
    if (activeTab === "Bed") dispatch(updateBed({ id: editId, data: form, token }));
    setEditId(null);
    setForm({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      if (activeTab === "Hostel") dispatch(deleteHostel({ id, token }));
      if (activeTab === "Room") dispatch(deleteRoom({ id, token }));
      if (activeTab === "Bed") dispatch(deleteBed({ id, token }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "Hostel") dispatch(addHostel({ data: form }));
    if (activeTab === "Room") dispatch(createRoom({ data: form }));
    if (activeTab === "Bed") dispatch(addBed({ data: form }));
    setForm({});
  };

  const renderFormFields = () => {
    if (activeTab === "Hostel") {
      return (
        <>
      <input className="form-input" placeholder="Hostel Name" value={form.hostelName || ""} onChange={(e) => setForm({ ...form, hostelName: e.target.value })} />
<input className="form-input" placeholder="Hostel Type" value={form.hostelType || ""} onChange={(e) => setForm({ ...form, hostelType: e.target.value })} />
<input className="form-input md:col-span-2" placeholder="Hostel Address" value={form.hostelAddress || ""} onChange={(e) => setForm({ ...form, hostelAddress: e.target.value })} />
<input className="form-input" placeholder="Intake Capacity" type="number" value={form.intakeCapacity || ""} onChange={(e) => setForm({ ...form, intakeCapacity: e.target.value })} />
<textarea className="form-input md:col-span-2" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        </>
      );
    } else if (activeTab === "Room") {
      return (
        <>
          <input className="form-input" placeholder="Room ID" value={form.roomUniqueId || ""} onChange={(e) => setForm({ ...form, roomUniqueId: e.target.value })} />
          <input className="form-input" placeholder="Hostel ID" value={form.hostelId || ""} onChange={(e) => setForm({ ...form, hostelId: e.target.value })} />
          <input className="form-input" placeholder="Type" value={form.roomType || ""} onChange={(e) => setForm({ ...form, roomType: e.target.value })} />
          <input className="form-input" placeholder="Bed Capacity" type="number" value={form.bedCapacity || ""} onChange={(e) => setForm({ ...form, bedCapacity: e.target.value })} />
          <textarea className="form-input md:col-span-2" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </>
      );
    } else if (activeTab === "Bed") {
      return (
        <>
          <input className="form-input" placeholder="Bed ID" value={form.bedUniqueId || ""} onChange={(e) => setForm({ ...form, bedUniqueId: e.target.value })} />
          <input className="form-input" placeholder="Room ID" value={form.roomId || ""} onChange={(e) => setForm({ ...form, roomId: e.target.value })} />
          <input className="form-input" placeholder="Charge" value={form.charge || ""} onChange={(e) => setForm({ ...form, charge: e.target.value })} />
          <select className="form-input" value={form.status || "Available"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
          <textarea className="form-input md:col-span-2" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </>
      );
    }
  };

  const renderList = () => {
    const data = activeTab === "Hostel" ? hostelState.hostels : activeTab === "Room" ? roomState.rooms : bedState.beds;
    const keys = data[0] ? Object.keys(data[0]).filter(key => key !== "_id" && key !== "__v") : [];

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border rounded-md">
          <thead className="bg-blue-50">
            <tr>
              {keys.map(key => <th key={key} className="px-4 py-2 text-left capitalize">{key}</th>)}
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {keys.map((key) => (
                  <td key={key} className="px-4 py-2">{item[key]}</td>
                ))}
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🏨 Hostel Management</h1>
        <div className="flex space-x-2 mb-4">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setActiveSubTab("Add"); setForm({}); setEditId(null); }} className={`relative px-6 py-2 font-semibold transition-all ${activeTab === tab ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg" : "bg-white text-gray-600 border border-blue-200 hover:bg-blue-50"}`}>
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-700 rounded-b"></span>}
            </button>
          ))}
        </div>
        <div className="flex space-x-2 mb-6">
          {subTabs.map((sub) => (
            <button key={sub} onClick={() => setActiveSubTab(sub)} className={`px-4 py-2 font-medium transition-all ${activeSubTab === sub ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-blue-100 border border-gray-200"}`}>{sub}</button>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {activeSubTab === "Add" && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFormFields()}
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md col-span-2">{editId ? "Update" : "Save"}</button>
            </form>
          )}
          {activeSubTab === "List" && renderList()}
        </div>
      </div>
    </div>
  );
};

export default HostelRoomBedManager;
