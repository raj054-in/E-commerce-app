import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice"
import productReducer from "./product-slice"
import orderReducer from "./order-slice"
import dashboardReducer from "./dashboard-slice"
import cartReducer from "./cart-slice"

const store=configureStore({
    reducer:{
        auth:authReducer,
        product:productReducer,
        orders:orderReducer,
        dashboard:dashboardReducer,
        cart:cartReducer
    }
})
export default store
