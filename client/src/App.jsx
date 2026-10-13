
import { Route, Routes } from 'react-router-dom'
import Authlayout from './components/auth/layout'

import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import AdminLayout from './components/admin-view/layout'
import AdminDashboard from './pages/admin-view/AdminDashboard'
import AdminProduct from './pages/admin-view/AdminProduct'
import AdminOrders from './pages/admin-view/AdminOrders'
import AdminFeatures from './pages/admin-view/AdminFeatures'
import ShoppingLayout from './components/shopping-view/ShoppingLayout'
import Account from './pages/shopping-view/Account'
import Checkout from './pages/shopping-view/Checkout'
import Home from './pages/shopping-view/Home'
import Listing from './pages/shopping-view/Listing'

function App() {
 

  return (
    <>
     <div>
      App
      <Routes>
        <Route path='/auth' element={<Authlayout/>}>
          <Route path='login' element={<Login/>}/>
          <Route path='signup' element={<Register/>}/>
        </Route>
        <Route path='/admin' element={<AdminLayout/>}>
          <Route path='dashboar' element={<AdminDashboard/>}/>
          <Route path='products' element={<AdminProduct/>}/>
          <Route path='orders' element={<AdminOrders/>}/>
          <Route path='features' element={<AdminFeatures/>}/>
        

        </Route>
        <Route path='/shopping' element={<ShoppingLayout/>}>
          <Route path='account' element={<Account/>}/>
          <Route path='checkout' element={<Checkout/>}/>
          <Route path='home' element={<Home/>}/>
          <Route path='listing' element={<Listing/>}/>

           
        </Route>
        
      </Routes>
     </div>
    </>
  )
}

export default App
