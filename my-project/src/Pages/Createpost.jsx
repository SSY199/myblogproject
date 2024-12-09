import { Button, FileInput, Select, TextInput } from 'flowbite-react'
 
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// function MyComponent() {
//   const [value, setValue] = useState('');

//   return <ReactQuill theme="snow" value={value} onChange={setValue} />;
// }

function Createpost() {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Create a New Post
      </h1>
      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1'>
          </TextInput>
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
          <FileInput type='file' accept='image/*' />
          <TextInput type='text' placeholder='Caption' className='flex-1' />
          <Button type='submit' gradientDuoTone='purpleToBlue' size='sm' outline >Upload Image</Button>
        </div>
        <ReactQuill theme="snow" placeholder='What is happening?!...' className='h-72 mb-12' required/>
        <Button type='submit' gradientDuoTone='purpleToPink' size='lg' className='w-full'>Publish Post</Button>
      </form>
    </div>
  )
}

export default Createpost