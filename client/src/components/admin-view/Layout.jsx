import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
const AdminLayout = () => {
  return (
    <div className=' flex min-h-screen w-full'>
        <Sidebar/>
        <div>
            <Header/>
            <main>
                <Outlet/>
            </main>
        </div>
        
    </div>
  )
}

export default AdminLayout