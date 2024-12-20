import React from 'react'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DashSidebar from '../Components/DashSidebar'
import DashProfile from '../Components/DashProfile'

function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    },
  [location.search]
  );
  return (
    <div className='min-h-screen flex flex-col md:flex-row'> 
      <div className='md:w-56'>
        {/* {Sidebar} */}
        <DashSidebar></DashSidebar>
      </div>
      {/* {Profile} */}
      {tab === 'profile' && <DashProfile></DashProfile>}
    </div>
  )
}

export default Dashboard