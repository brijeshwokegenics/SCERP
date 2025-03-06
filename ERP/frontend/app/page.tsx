// frontend/pages/index.js
"use client";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useRouter } from 'next/navigation';

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user, status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  useEffect(() => {
    // If we already have a token, navigate to dashboard
    if (token && user) {
      router.push('/pages/dashboard');
    }
  }, [token, user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h1 className="text-xl mb-4">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            className="border w-full p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            className="border w-full p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
