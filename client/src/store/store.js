import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice"
import productReducer from "./product-slice"

const store=configureStore({
    reducer:{
        auth:authReducer,
        product:productReducer
    }
})
export default store
