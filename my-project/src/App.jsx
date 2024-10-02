import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Project from './Pages/Project'
import Dashboard from './Pages/Dashboard'
import Createpost from './Pages/Createpost'
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'
import Header from './Components/Header'
// import { Footer } from 'flowbite-react'
import Footer from './Components/Footer'

function App() {
  return (
     <BrowserRouter>
     <Header></Header>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/about' element={<About></About>}></Route>
        <Route path='/project' element={<Project></Project>}></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='/createpost' element={<Createpost></Createpost>}></Route>
        <Route path='/signin' element={<Signin></Signin>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
      </Routes>
      <Footer></Footer>
     </BrowserRouter>
  )
}

export default App