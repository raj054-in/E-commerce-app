
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState={
    userOrders:[],
    adminOrders:[],
    isLoading:false,
    totalPages:1,
    currentPages:1,
    error:null
}
const fetchAllOrders=createAsyncThunk("orders/fetchAllOrders",async({page=1,limit=8},{rejectWithValue})=>{
    try {
        const response=await axios.get(`http://localhost:3000/api/orders/admin?page=${page}&limit=${limit}`,{
            withCredentials:true
        })
        return{
            orders:response.data.orders,
            totalPages:response.data.totalPages,
            page:response.data.page,
            totalOrders:response.data.totalOrders
        }
    } catch (error) {
        return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Product fetch failed"
      );
        
    }
})
const updateDeliveryStatus=createAsyncThunk("orders/updateOrderStatus",async({id,data},{rejectWithValue})=>{
    try {
        const response =await axios.patch(`http://localhost:3000/api/orders/admin/${id}/delivery`,data,{withCredentials:true})
        return response.data
    } catch (error) {
         return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || "Product Update failed"
        )
        
    }

})
const orderSlice=createSlice({
    name:"orders",
    initialState,
    reducers:{
        setAdminOrders:(state,action)=>{
            state.adminOrders=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAllOrders.pending,(state)=>{
            state.isLoading=true 
            state.error=null
        })
        builder.addCase(fetchAllOrders.fulfilled,(state,action)=>{
            state.isLoading=false
            state.adminOrders=action.payload.orders
            state.totalPages=action.payload.totalPages || 1
            state.currentPages=action.payload.page || 1
            
        })
        builder.addCase(fetchAllOrders.rejected,(state,action)=>{
            state.isLoading=false
            state.error=action.payload||action.error.message
        })
        builder.addCase(updateDeliveryStatus.pending,(state)=>{
            state.isLoading=true
            state.error=null
        })
        builder.addCase(updateDeliveryStatus.fulfilled,(state,action)=>{
            state.isLoading=false
            const updatedOrder = action.payload
            state.adminOrders = state.adminOrders.map((order) =>
                order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
            )
        })
        builder.addCase(updateDeliveryStatus.rejected,(state,action)=>{
            state.isLoading=false
            state.error=action.payload||action.error.message
        })
    }
})
export const {setAdminOrders }=orderSlice.actions
export{ fetchAllOrders, updateDeliveryStatus}
export default orderSlice.reducer
