import React from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import { useState } from 'react';

export default function SignUp() {
  const [formData,setFormData] = useState({});
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success === false) {
            setError(data.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        setError(null);
        setFormData({});
        navigate('/sign-in');
        console.log("User registered Successfully!!");
        console.log(data);
    } catch (e) {
        setError("An unexpected error occurred. Please try again.");
        console.error("Error during signup:", e);
        setLoading(false);
    }
  }


  return (
    <div className='mx-auto max-w-lg p-3'>
      <h1 className='font-semibold my-7 text-3xl text-center' >Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} type='submit' className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <button type='' className='p-3 bg-rose-600 text-white rounded-lg hover:opacity-90 disabled:opacity-80'>
          Continue with Google
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign In</span>
        </Link> 
      </div>
      {error && <div className='text-red-500 mt-5'>{error}</div>}
    </div>
  )
}
