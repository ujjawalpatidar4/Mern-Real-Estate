import React from 'react'
import {GoogleAuthProvider,getAuth ,signInWithPopup} from 'firebase/auth'
import { app } from '../firebase.js'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import {useNavigate} from 'react-router-dom'

export default function OAuth() {
    const dispatch=useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const auth = getAuth(app);
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(auth, provider);
            
            const res=await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName, email:result.user.email,photo:result.user.photoURL
                }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
            
        } catch (error) {
            console.log("Could not sign in with google",error);
        }
    }


  return (
    
    <button onClick={handleGoogleClick} type='button' className='p-3 bg-rose-600 text-white rounded-lg hover:opacity-90 disabled:opacity-80 uppercase'>
        Continue with Google
    </button>
    
  )
}
