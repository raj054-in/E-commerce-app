import React from 'react'
import { Outlet } from 'react-router-dom'

const Authlayout = () => {
  return (
    <div className=''>
        
        <Outlet/>
    </div>
  )
}

export default Authlayout