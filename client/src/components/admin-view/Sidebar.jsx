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
    <div id='options' className='flex w-full flex-col items-start'>
        <nav aria-label='Admin navigation' className='flex w-full flex-col gap-2'>
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
        <SheetContent side="left" className="z-[60] w-[85vw] max-w-72 bg-white p-0">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-slate-200 bg-slate-50 pr-14">
              <SheetTitle className="flex items-center gap-2 text-slate-900">
                <ChartNoAxesCombined className="h-7 w-7 shrink-0" />
                <span className="text-xl font-extrabold">Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 pt-4">
              <NavMenu setOpen={setOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

    <aside className='sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex'>
      <div id='heading' className='flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-5'>
      <ChartNoAxesCombined />
      <span className='text-2xl font-bold'>Admin Panel</span>
      </div>
      <NavMenu/>
    </aside>
    </Fragment>
  )
}

export default AdminSidebar
