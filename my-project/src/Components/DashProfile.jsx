import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess } from "../redux/User/userSlice";
import { useDispatch } from "react-redux";
import {HiOutlineExclamationCircle} from 'react-icons/hi'

function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImageChange = (e) => {

  const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
    setImageFile(e.target.files[0]);
  };

 useEffect(() => {
  if (imageFile) {
    uploadImage();
  }
 }, [imageFile]);

 const uploadImage = async => {
  //rules_version = '2';
  // // Craft rules based on data in your Firestore database
  // // allow write: if firestore.get(
  // //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
  // service firebase.storage {
  //   match /b/{bucket}/o {
  //     match /{allPaths=**} {
  //       allow read;
  //       allow write: if 
  //       request.resource.size <2 * 1024 *1024 && 
  //       request.resource.contentType.matches('image/.*')
  //     }
  //   }
  // }
  setImageFileUploadProgress(true);
  setImageFileUploadError(null);
  const storage =  getStorage(app);
  const fileName = new Date().getTime() + imageFile.name;
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setImageFileUploading(progress.toFixed(0));
    },
    (error) => {
      setImageFileUploadError('Could not upload image (File must be less than 2MB)');
      setImageFileUploading(null);
      setImageFileUrl(null);
      setImageFileUploadProgress(false);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageFileUrl(downloadURL);
        setFormData({...formData, profilePicture: downloadURL});
        setImageFileUploadProgress(false);
      })
    }
  );
 }
const handleChange = (e) => {
  setFormData({
    ...formData,[e.target.id]: e.target.value
  });
}
 
const handleSubmit = async (e) => {
  e.preventDefault();
  setUpdateUserError(null);
  setUpdateUserSuccess(null);
  if (Object.keys(formData).length === 0) {
    setUpdateUserError("No changes Made")
    return;

  }
  if (imageFileUploadProgress) {
    return;
  }
  try {
    dispatch(updateStart());
    const res = await fetch(`api/user/update/${currentUser._id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      dispatch(updateFailure(data.message));
      setUpdateUserError(data.message);
    }
    else{
      dispatch(updateSuccess(data));
      setUpdateUserSuccess("User's profile updated successfully");
    }
  } catch (error) {
    dispatch(updateFailure(error.message));
    setUpdateUserError(error.message);
  }
};
  const handleDeleteUser = async() => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      }
      else{
        dispatch(deleteUserSuccess(data));
        alert("User deleted successfully");
        window.location.href = "/";
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
   const handleSignOut = async () => {
    try {
      const res = await fetch(`api/user/signout`, {
        method: 'POST',
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
   };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div className=" relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>

          {imageFileUploading && (
            <CircularProgressbar value={imageFileUploading || 0} text={`${imageFileUploading}%`} strokeWidth={5} 
            styles={{
              root:{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              },
              path:{
                stroke:  `rgba(62, 152, 199, ${imageFileUploading / 100})`,
              },
            }}
            ></CircularProgressbar>
          )}

          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="USER"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
              ${imageFileUploading && imageFileUploading < 100 && 'opacity-60'}`}
          />
        </div>
        {imageFileUploadError && <Alert color={failure}>{imageFileUploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username} onChange={handleChange}
        ></TextInput>

        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email} onChange={handleChange}
        ></TextInput>

        <TextInput
          type="password"
          id="password"
          placeholder="password" onChange={handleChange}
           
        ></TextInput>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className="text-red-600 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className="mt-5">
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
      <Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-300 mb-4 mx-auto"></HiOutlineExclamationCircle>
              <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400">Are you sure you want to delete your account?</h3>
              <div className="flex justify-center gap-6">
                <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                <Button color='gray' onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
          </div>
        </Modal.Body>
      </Modal.Header>
      </Modal>
    </div>
  );
}

export default DashProfile;
