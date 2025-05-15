import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers } from '../../../store/teacherSlice';
import { createPayment, fetchPayments, deletePayment } from '../../../store/paymentSlice';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { teachers = [] } = useSelector((state) => state.teachers);
  const { payments } = useSelector((state) => state.payments);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [status, setStatus] = useState('Pending');
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [debounceSearch, setDebounceSearch] = useState('');
  const [error, setError] = useState(null);  // For error handling

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const debounceTimeout = 300;

  useEffect(() => {
    dispatch(fetchTeachers());
    dispatch(fetchPayments());
  }, [dispatch]);

  useEffect(() => {
    if (teachers.length > 0) {
      setLoading(false);
    }
  }, [teachers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, debounceTimeout);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debounceSearch) {
      const filtered = teachers.filter((teacher) =>
        teacher?.firstName?.toLowerCase().includes(debounceSearch.toLowerCase().trim())
      );
      setFilteredTeachers(filtered);
      setIsDropdownVisible(filtered.length > 0);
    } else {
      setFilteredTeachers(teachers);
      setIsDropdownVisible(false);
    }
  }, [debounceSearch, teachers]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setAmount(teacher.monthlySalary);
    setSearch(teacher.firstName);
    setIsDropdownVisible(false);
  };

  const handleAddPayment = async () => {
    if (!selectedTeacher || !amount || isNaN(amount)) {
      setError('Please select a teacher and enter a valid amount');
      return;
    }

    try {
      await dispatch(createPayment({
        userId: user.id,
        payee: selectedTeacher.firstName,
        amount: parseFloat(amount), // Ensuring it's a number
        paymentMethod,
        status,
        paymentDate: new Date().toISOString(), // Formatting paymentDate as ISO string
        description: '',
        metadata: {},
      }));
      setError(null);  // Reset error state if payment is successful
    } catch (err) {
      console.error('Payment creation failed:', err);
      setError('An error occurred while creating the payment.');
    }
  };

  const handleDeletePayment = (id) => {
    dispatch(deletePayment(id));
  };

  const handleClickOutside = (e) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(e.target) &&
      !searchInputRef.current.contains(e.target)
    ) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Payment Management</h1>
      
      {/* Error Message */}
      {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>}

      <div className="bg-white p-4 rounded shadow-md relative">
        {/* Teacher search input */}
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Search Teacher/Staff"
          value={search}
          onChange={handleSearch}
          className="p-2 border w-full mb-2"
        />
        {isDropdownVisible && (
          <div
            ref={dropdownRef}
            className="relative bg-gray border w-25 max-h-60 overflow-auto z-10 "
          >
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelectTeacher(teacher)}
              >
               <li>Name: {teacher.firstName} - Salary: ₹{teacher.monthlySalary}</li>
              </div>
            ))}
          </div>
        )}

        {/* Amount input */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border w-full mt-2"
        />

        <label>Payment Status</label>
        <select
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border w-full mt-2"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>

        {/* Payment method dropdown */}
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="p-2 border w-full mt-2"
        >
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Net Banking">Net Banking</option>
        </select>

        {/* Add payment button */}
        <button
          className="bg-blue-500 text-white p-2 w-full mt-4 rounded"
          onClick={handleAddPayment}
        >
          Add Payment
        </button>
      </div>

   {/* Payment History */}
<h2 className="text-xl font-bold mt-6">Payment History</h2>
<div className="mt-4 overflow-x-auto">
  <table className="min-w-full bg-white shadow-md rounded-lg">
    <thead>
      <tr>
        <th className="px-4 py-2 text-left border-b">Payee</th>
        <th className="px-4 py-2 text-left border-b">Amount</th>
        <th className="px-4 py-2 text-left border-b">Payment Method</th>
        <th className="px-4 py-2 text-left border-b">Status</th>
        <th className="px-4 py-2 text-left border-b">Payment Date</th>
        <th className="px-4 py-2 text-left border-b">Actions</th>
      </tr>
    </thead>
    <tbody>
      {payments.map((payment) => (
        <tr key={payment._id} className="border-b hover:bg-gray-100">
          <td className="px-4 py-2">{payment.payee}</td>
          <td className="px-4 py-2 text-gray-700">₹{payment.amount}</td>
          <td className="px-4 py-2 text-gray-700">{payment.paymentMethod}</td>
          <td className="px-4 py-2 text-gray-700">{payment.status}</td>
          <td className="px-4 py-2 text-gray-700">
            {new Date(payment.paymentDate).toLocaleDateString()}
          </td>
          <td className="px-4 py-2 text-center">
            <button
              className="bg-red-500 text-white p-2 rounded"
              onClick={() => handleDeletePayment(payment._id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default PaymentPage;
