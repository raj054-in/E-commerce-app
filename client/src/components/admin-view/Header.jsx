import { ChartNoAxesCombined, LogOut, Menu } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '@/store/auth-slice'

const AdminHeader = ({setOpen}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector((state) => state.auth.isLoading)
  const user = useSelector((state) => state.auth.user)

  async function handleLogout() {
    try {
      await dispatch(logoutUser()).unwrap()
    } catch {
      // The local session is cleared by the reducer even if the request fails.
    } finally {
      navigate('/auth/login', { replace: true })
    }
  }

  return (
    <header className='flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6'>
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={() => setOpen(true)}
          aria-label='Open navigation menu'
          className='rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden'
        >
          <Menu className='h-5 w-5 cursor-pointer'/>
        </button>
        <div className='flex items-center gap-2'>
          <ChartNoAxesCombined className='h-5 w-5 text-slate-900' />
          <div>
            <p className='text-xs font-medium uppercase tracking-wider text-slate-500'>Workspace</p>
            <h2 className='text-lg font-bold text-slate-900'>Ecom Name</h2>
          </div>
        </div>
      </div>

      <div id='logout'>
        <button
          type='button'
          onClick={handleLogout}
          disabled={isLoading}
          aria-label={`Log out${user?.name ? ` ${user.name}` : ''}`}
          className='flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
        >
          <span>{isLoading ? 'Logging out...' : 'Log out'}</span>
          <LogOut className='h-4 w-4'/>
        </button>
      </div>

    </header>
  )
}

export default AdminHeader
