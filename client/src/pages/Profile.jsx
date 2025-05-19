import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(res);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        dispatch(updateUserFailure(data.message));
        return;
      }
      
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <img
          className="w-24 h-24 rounded-full object-cover self-center mt-2"
          src={currentUser.avatar}
          alt="Profile"
        />
        <input
          type="text"
          id="username"
          onChange={handleChange}
          defaultValue={currentUser.username}
          placeholder="Username"
          className="border-black bg-white rounded-lg p-3"
        />
        <input
          type="email"
          id="email"
          onChange={handleChange}
          defaultValue={currentUser.email}
          placeholder="Email"
          className="border-black bg-white rounded-lg p-3"
        />
        <input
          type="password"
          id="password"
          onChange={handleChange}
          placeholder="Password"
          className="border-black bg-white rounded-lg p-3"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-85"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Log out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? 'Profile updated successfully' : ''}
      </p>
    </div>
  );
}