import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false)

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const closeSidebarOnDesktop = (event) => {
      if (event.matches) setOpenSidebar(false)
    }

    desktopQuery.addEventListener('change', closeSidebarOnDesktop)
    return () => desktopQuery.removeEventListener('change', closeSidebarOnDesktop)
  }, [])

  return (
    <div className='flex min-h-screen w-full overflow-x-hidden bg-slate-50'>
        <Sidebar open={openSidebar} setOpen={setOpenSidebar} />
        <div className='flex min-w-0 flex-1 flex-col'>
            <Header setOpen={setOpenSidebar}/>
            <main className='min-w-0 flex-1'>
                <Outlet/>
            </main>
        </div>
        
    </div>
  )
}

export default AdminLayout
