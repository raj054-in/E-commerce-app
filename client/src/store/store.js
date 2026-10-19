import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice"
import productReducer from "./product-slice"
import orderReducer from "./order-slice"

const store=configureStore({
    reducer:{
        auth:authReducer,
        product:productReducer,
        orders:orderReducer
    }
})
export default store
