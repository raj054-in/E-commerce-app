import { ChartNoAxesCombined, LayoutDashboard, PackageSearch, ShoppingBasket } from 'lucide-react'
import React, { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"


const navItems=[
    {to:'/admin/dashboard',label:'Dashboard',icon:LayoutDashboard},
    {to:'/admin/products',label:'Products',icon:ShoppingBasket},
    {to:'/admin/orders',label:"Orders",icon:PackageSearch}

  ]
const NavMenu = ({setOpen}) => {
  return (
    <div id='options' className='flex flex-col w-full items-start'>
        <nav className='flex flex-col gap-3 w-full'>
          {
            navItems.map(({to,label,icon:Icon})=>(
              <NavLink
              key={to}
              to={to}
              onClick={() => setOpen?.(false)}
              className={({isActive})=>`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors hover:bg-slate-100 ${
                isActive ? 'bg-slate-900 font-semibold text-white shadow-sm hover:bg-slate-900' : 'text-slate-600'
              }`}
              >
              <Icon className='w-5'/>
              <span>{label}</span>

              </NavLink>

            ))
          }

        </nav>

      </div>
  )}
    

const AdminSidebar = ({open,setOpen}) => {
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="z-60 w-64 bg-white pointer-events-auto">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-slate-200 bg-slate-50">
              <SheetTitle className="mt-5 mb-5 flex items-center gap-2 text-slate-900">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <div className="relative z-61 pt-4">
              <NavMenu setOpen={setOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

    <aside className='flex h-screen w-55 flex-col border-r border-slate-200 bg-white sm:hidden lg:block'>
      <div id='heading' className='flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-5'>
      <ChartNoAxesCombined />
      <span className=' font-bold text-2xl'>Admin Panel</span>
      </div>
      <NavMenu/>
    </aside>
    </Fragment>
  )
}

export default AdminSidebar
