'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTransports,
  fetchRoutes,
  createTransport,
  createRoute,
} from '../../../store/transportSlice';

export default function TransportPage() {
  const dispatch = useDispatch();
  const { transports, routes } = useSelector((state) => state.transportSystem);

  const [view, setView] = useState('transport');

  const [form, setForm] = useState({
    student: '',
    route: '',
    busNumber: '',
    pickupStop: '',
    dropStop: '',
    pickupTime: '',
    dropTime: '',
    driverName: '',
    driverContact: '',
    attendant: '',
    notes: '',
  });

  const [routeForm, setRouteForm] = useState({
    routeName: '',
    type: 'Both',
    stops: [{ stopName: '', time: '' }],
    totalDistance: '',
    estimatedTime: '',
    notes: '',
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token) {
      dispatch(fetchTransports(token));
      dispatch(fetchRoutes(token));
    }
  }, [dispatch, token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRouteChange = (e, index) => {
    const updatedStops = routeForm.stops.map((stop, idx) =>
      idx === index ? { ...stop, [e.target.name]: e.target.value } : stop
    );
    setRouteForm({ ...routeForm, stops: updatedStops });
  };

  const addStop = () => {
    setRouteForm({ ...routeForm, stops: [...routeForm.stops, { stopName: '', time: '' }] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token) {
      dispatch(createTransport({ data: form, token }));
      setForm({ student: '', route: '', busNumber: '', pickupStop: '', dropStop: '', pickupTime: '', dropTime: '', driverName: '', driverContact: '', attendant: '', notes: '' });
    }
  };

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    if (token) {
      dispatch(createRoute({ data: routeForm, token }));
      setRouteForm({ routeName: '', type: 'Both', stops: [{ stopName: '', time: '' }], totalDistance: '', estimatedTime: '', notes: '' });
    }
  };

  const handleRouteSelection = (e) => {
    const selectedRoute = routes.find((r) => r._id === e.target.value);
    if (selectedRoute) {
      setForm({
        ...form,
        route: selectedRoute._id,
        pickupStop: selectedRoute.stops[0]?.stopName || '',
        pickupTime: selectedRoute.stops[0]?.time || '',
        dropStop: selectedRoute.stops[selectedRoute.stops.length - 1]?.stopName || '',
        dropTime: selectedRoute.stops[selectedRoute.stops.length - 1]?.time || '',
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">School Transport System</h1>

      <div className="flex mb-4">
        <button
          className={`px-4 py-2 rounded-l ${view === 'transport' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('transport')}
        >
          Transport Management
        </button>
        <button
          className={`px-4 py-2 rounded-r ${view === 'route' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('route')}
        >
          Route Management
        </button>
      </div>

      {view === 'transport' && (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
          <input name="student" placeholder="Student ID" value={form.student} onChange={handleChange} className="border p-2 rounded w-full mb-4" required />
          <select name="route" value={form.route} onChange={handleRouteSelection} className="border p-2 rounded w-full mb-4" required>
            <option value="">Select Route</option>
            {routes.map((r) => (
              <option key={r._id} value={r._id}>{r.routeName}</option>
            ))}
          </select>
          {['busNumber', 'pickupStop', 'pickupTime', 'dropStop', 'dropTime', 'driverName', 'driverContact', 'attendant', 'notes'].map((key) => (
            <input key={key} name={key} placeholder={key} value={form[key]} onChange={handleChange} className="border p-2 rounded w-full mb-4" required={key !== 'attendant' && key !== 'notes'} />
          ))}
          <button className="bg-blue-600 text-white py-2 px-4 rounded">Add Transport</button>
        </form>
      )}

      {view === 'route' && (
        <form onSubmit={handleRouteSubmit} className="bg-white p-4 shadow rounded">
          <input name="routeName" placeholder="Route Name" value={routeForm.routeName} onChange={(e) => setRouteForm({...routeForm, routeName: e.target.value})} className="border p-2 rounded w-full mb-4" required />
          {routeForm.stops.map((stop, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input name="stopName" placeholder="Stop Name" value={stop.stopName} onChange={(e) => handleRouteChange(e, index)} className="border p-2 rounded flex-1" required />
              <input name="time" placeholder="Time (HH:mm AM/PM)" value={stop.time} onChange={(e) => handleRouteChange(e, index)} className="border p-2 rounded flex-1" required />
            </div>
          ))}
          <button type="button" onClick={addStop} className="bg-blue-500 text-white px-3 py-1 rounded mb-4">Add Stop</button>
          <button className="bg-green-600 text-white py-2 px-4 rounded">Add Route</button>
        </form>
      )}
    </div>
  );
}