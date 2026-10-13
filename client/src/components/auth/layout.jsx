import React from 'react'
import { Outlet } from 'react-router-dom'

const Authlayout = () => {
  return (
    <div className=''>
        AuthLayout
        <Outlet/>
    </div>
  )
}

export default Authlayout