import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure , deleteUserStart , deleteUserSuccess , deleteUserFailure, signoutFailure, signoutStart, signoutSuccess} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingErrors, setShowListingErrors] = useState(false);
  const [listings, setListings] = useState([]);
  

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

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignoutUser = async () => {
    try {
      dispatch(signoutStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if(data.success === false){
        dispatch(signoutFailure(data.message));
        return;
      }
      dispatch(signoutSuccess(data));
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingErrors(false);
      const res = await fetch(`/api/users/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingErrors(true);
        return;
      }
      setListings(data);
    } catch (error) {
      setShowListingErrors(true);
    }
  }

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log("error in deleting listing :" , data.message);
        return;
      }
      setListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error);
    }
  }

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
        <Link to="/create-listing" className="bg-green-700 text-center text-white rounded-lg p-3 uppercase hover:opacity-95">
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>Delete account</span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignoutUser}>Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? 'Profile updated successfully' : ''}
      </p>

      <button onClick={handleShowListings} className='text-green-700 w-full cursor-pointer'>Show Listings</button>
      <p className="text-red-700 mt-5">
        {showListingErrors ? 'Error fetching listings' : ''}
      </p>
      { listings && listings.length > 0 && (
        <div className="flex flex-col">
          <h1 className="text-2xl mt-7 text-center font-semibold">Your Listings</h1>
        { 
        listings.map((listing) => (
          <div key={listing._id} className="border mt-5 p-3 flex justify-between items-center rounded-lg gap-4">
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="Listing Cover"
                className="w-16 h-16 object-contain"
              />
            </Link>
            <Link to={`/listing/${listing._id}`}>
              <h2 className="text-slate-700 flex-1 hover:underline truncate font-semibold">{listing.name}</h2>
            </Link>
            <div className='flex flex-col items-center'>
              <button onClick={()=>handleDeleteListing(listing._id)} className='text-red-700 uppercase cursor-pointer'>Delete</button>
              <Link to={`/update-listing/${listing._id}`} className='text-green-700 uppercase cursor-pointer'>Edit</Link>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}