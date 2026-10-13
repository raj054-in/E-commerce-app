import React from 'react'
import ShoppingHeader from './ShoppingHeader'
import { Outlet } from 'react-router-dom'

const ShoppingLayout = () => {
  return (
    <div>
        <ShoppingHeader/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default ShoppingLayout