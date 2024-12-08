import { Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Oauth from "../Components/Oauth";
// import OAuth from "../components/OAuth";

function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all the credentials.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/signin");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <div container className="min-h-screen mt-20 ">
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
              <Label value="YOUR USERNAME"></Label>
              <TextInput
                type="text"
                placeholder="Enter your username"
                id="username"
                onChange={handleChange}
              />
            </div>
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
                placeholder="Enter your password"
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
                "Sign Up"
              )}
            </Button>
             <Oauth></Oauth>
          </form>
          <div className="flex-gap-2 text-sm mt-5">
            <span>Already have an account?</span>
            <Link to="/signin" className="text-blue-500">
              {" "}
              Sign In
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

export default Signup;
