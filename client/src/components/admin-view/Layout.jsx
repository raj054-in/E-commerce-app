import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false)
  return (
    <div className=' flex min-h-screen w-full'>
        <Sidebar open={openSidebar} setOpen={setOpenSidebar} />
        <div className='flex-1 min-w-0'>
            <Header setOpen={setOpenSidebar}/>
            <main>
                <Outlet/>
            </main>
        </div>
        
    </div>
  )
}

export default AdminLayout
