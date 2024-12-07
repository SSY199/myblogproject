import { Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { signInFailure } from "../redux/User/userSlice";
import { signInStart } from "../redux/User/userSlice";
import { signInSuccess } from "../redux/User/userSlice";
import Oauth from "../Components/Oauth";
// import OAuth from "../components/OAuth";

function Signin() {
  const [formData, setFormData] = useState({});
  const {loading, error:errorMessage} = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'))
    }
    try {
      dispatch(signInStart());
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
      }
       
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div container className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              DEV
            </span>
            NINJAS
          </Link>
          <p className="text-sm mt-5">
            This is the beginning of creating and publishing{" "}
            <span className="font-bold"> BLOG, WIKI, ARTICLE</span> in one
            platform and gather all the valuable informative resources from
            innovative people across the world.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form
            className="flex flex-col gap-4 mt-4 mr-4"
            onSubmit={handleSubmit}
          >
             
            <div>
              <Label value="YOUR EMAIL"></Label>
              <TextInput
                type="email"
                placeholder="Enter your email-id"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="YOUR PASSWORD"></Label>
              <TextInput
                type="password"
                placeholder="*********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm"></Spinner>
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
             <Oauth></Oauth>
          </form>
          <div className="flex-gap-2 text-sm mt-5">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signin;
