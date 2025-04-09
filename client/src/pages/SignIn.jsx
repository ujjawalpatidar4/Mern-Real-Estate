import React from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import { useState } from 'react';
import { useDispatch , useSelector} from 'react-redux';
import { signInStart,signInFailure,signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData,setFormData] = useState({});
  const {loading,error} = useSelector((state) => state.user);
  const navigate=useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success === false) {
            dispatch(signInFailure(data.message));
            return;
        }

        dispatch(signInSuccess(data));
        navigate('/');
        console.log("User Login Successfully!!");
        console.log(data);
    } catch (e) {
        dispatch(signInFailure(e.message));
        console.error("Error during signin:", e);
    }
  }


  return (
    <div className='mx-auto max-w-lg p-3'>
      <h1 className='font-semibold my-7 text-3xl text-center' >Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/> */}
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>New User?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Register</span>
        </Link> 
      </div>
      {error && <div className='text-red-500 mt-5'>{error}</div>}
    </div>
  )
}
