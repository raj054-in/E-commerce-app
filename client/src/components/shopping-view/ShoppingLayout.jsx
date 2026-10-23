import React from 'react'
import ShoppingHeader from './ShoppingHeader'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getProfile } from '@/store/auth-slice'
import { fetchCart } from '@/store/cart-slice'

const ShoppingLayout = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProfile())
            .unwrap()
            .then(() => dispatch(fetchCart()))
            .catch(() => {})
    }, [dispatch])

  return (
    <div className='min-h-screen bg-slate-50'>
        <ShoppingHeader/>
        <div className='pt-16'>
            <Outlet/>
        </div>
    </div>
  )
}

export default ShoppingLayout
