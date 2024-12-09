import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react';
import { app } from '../firebase.js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Createpost() {
  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleUploadImage = async (e) => {
    try {
      const selectedFile = e.target.files[0];
      if (!selectedFile) {
        setImageUploadError("Please select an image");
        return;
      }

      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}_${selectedFile.name}`;
      const storageRef = ref(storage, `images/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Could not upload image (File must be less than 2MB)");
          setImageUploadProgress(null);
          console.error(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUploadProgress(null);
            setImageUploadError(null);
            
            // Update the state with the new image URL (keep the existing images)
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images || [], downloadURL]  // store multiple images
            }));
          } catch (error) {
            setImageUploadError("Failed to retrieve image URL");
            console.error(error);
          }
        }
      );
    } catch (error) {
      setImageUploadError("An unexpected error occurred");
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Create a New Post
      </h1>
      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1'></TextInput>
          <Select>
            <option value='uncategorized'>Select a category</option>
            <option value='programming'>Programming</option>
            <option value='politics'>Politics</option>
            <option value='finance'>Finance</option>
            <option value='sports'>Sports</option>
            <option value='entertainment'>Entertainment</option>
            <option value='health'>Health</option>
            <option value='science'>Science</option>
            <option value='other'>Other</option>
          </Select>
        </div>
        
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={handleUploadImage}
          />
          <TextInput type='text' placeholder='Caption' className='flex-1' />
          <Button type='submit' gradientDuoTone='purpleToBlue' size='sm' outline disabled={imageUploadProgress}>
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress}%`}
                />
              </div>
            ) : (
              'Upload image'
            )}
          </Button>
        </div>

        {imageUploadError && (
          <div className='text-red-500 text-sm'>{imageUploadError}</div>
        )}

        {/* Display images */}
        <div className="image-preview">
          {formData.images &&
            formData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Uploaded ${index}`}
                className='w-full h-72 object-cover mb-4'
              />
            ))}
        </div>

        <ReactQuill theme="snow" placeholder='What is happening?!...' className='h-72 mb-12' required />
        <Button type='submit' gradientDuoTone='purpleToPink' size='lg' className='w-full'>
          Publish Post
        </Button>
      </form>
    </div>
  );
}

export default Createpost;
