import React from "react";
import { FaGoogle} from 'react-icons/fa';
import { Button } from "flowbite-react";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/User/userSlice';
import { useNavigate } from 'react-router-dom'

function Oauth() {
  const auth = getAuth(app)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    try {
     const resultsFromGoogle = await signInWithPopup(auth, provider)
     const res = await fetch('/api/auth/google', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         name: resultsFromGoogle.user.displayName,
         email: resultsFromGoogle.user.email,
         googlePhotoUrl: resultsFromGoogle.user.photoURL,
       }),
     })
     const data = await res.json()
     if(res.ok){
       dispatch(signInSuccess(data))
       navigate('/')
     }
    } catch (error) {
     console.log(error);
    }
 }
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <FaGoogle className="w-6 h-6 mr-2"></FaGoogle>
      Sign Up with Google
    </Button>
  );
}

export default Oauth;
