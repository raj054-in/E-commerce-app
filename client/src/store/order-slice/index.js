
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from '@/lib/api'

const initialState={
    userOrders:[],
    adminOrders:[],
    isLoading:false,
    isCheckoutLoading:false,
    isPaymentLoading:false,
    paymentError:null,
    checkoutError:null,
    totalPages:1,
    currentPages:1,
    error:null
}
const fetchAllOrders=createAsyncThunk("orders/fetchAllOrders",async({page=1,limit=8},{rejectWithValue})=>{
    try {
        const response=await axios.get(`${API_URL}/api/orders/admin?page=${page}&limit=${limit}`,{
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

const fetchMyOrders=createAsyncThunk("orders/fetchMyOrders",async(_,{rejectWithValue})=>{
    try {
        const response=await axios.get(`${API_URL}/api/orders/my`,{withCredentials:true})
        return response.data.orders || []
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || "Unable to load your orders"
        )
    }
})
const updateDeliveryStatus=createAsyncThunk("orders/updateOrderStatus",async({id,data},{rejectWithValue})=>{
    try {
        const response =await axios.patch(`${API_URL}/api/orders/admin/${id}/delivery`,data,{withCredentials:true})
        return response.data
    } catch (error) {
         return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || "Product Update failed"
        )
        
    }

})

const createOrder=createAsyncThunk("orders/createOrder",async(shippingAddress,{rejectWithValue})=>{
    try {
        const response=await axios.post(`${API_URL}/api/orders`,shippingAddress,{withCredentials:true})
        return response.data
    } catch (error) {
        const serverError = error.response?.data?.error
        return rejectWithValue(
            typeof serverError === "string"
                ? serverError
                : serverError?.message || error.response?.data?.message || "Unable to create order"
        )
    }
})

const resumePendingPayment=createAsyncThunk("orders/resumePendingPayment",async(orderId,{rejectWithValue})=>{
    try {
        const response=await axios.post(`${API_URL}/api/orders/${orderId}/payment`,{}, {withCredentials:true})
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || "Unable to resume payment"
        )
    }
})

const deletePendingOrder=createAsyncThunk("orders/deletePendingOrder",async(orderId,{rejectWithValue})=>{
    try {
        const response=await axios.delete(`${API_URL}/api/orders/${orderId}`,{withCredentials:true})
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || "Unable to delete order"
        )
    }
})

const verifyEsewaPayment=createAsyncThunk("orders/verifyEsewaPayment",async(data,{rejectWithValue})=>{
    try {
        const response=await axios.post(`${API_URL}/api/orders/verify`,{data},{withCredentials:true})
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || "Payment verification failed"
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
        builder.addCase(fetchMyOrders.pending,(state)=>{
            state.isLoading=true
            state.error=null
        })
        builder.addCase(fetchMyOrders.fulfilled,(state,action)=>{
            state.isLoading=false
            state.userOrders=action.payload
        })
        builder.addCase(fetchMyOrders.rejected,(state,action)=>{
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
        builder.addCase(createOrder.pending,(state)=>{
            state.isCheckoutLoading=true
            state.checkoutError=null
        })
        builder.addCase(createOrder.fulfilled,(state)=>{
            state.isCheckoutLoading=false
        })
        builder.addCase(createOrder.rejected,(state,action)=>{
            state.isCheckoutLoading=false
            state.checkoutError=action.payload||action.error.message
        })
        builder.addCase(resumePendingPayment.pending,(state)=>{
            state.isPaymentLoading=true
            state.paymentError=null
        })
        builder.addCase(resumePendingPayment.fulfilled,(state)=>{
            state.isPaymentLoading=false
        })
        builder.addCase(resumePendingPayment.rejected,(state,action)=>{
            state.isPaymentLoading=false
            state.paymentError=action.payload||action.error.message
        })
        builder.addCase(deletePendingOrder.fulfilled,(state,action)=>{
            state.userOrders=state.userOrders.filter((order)=>order._id !== action.payload.orderId)
        })
        builder.addCase(verifyEsewaPayment.pending,(state)=>{
            state.isCheckoutLoading=true
            state.checkoutError=null
        })
        builder.addCase(verifyEsewaPayment.fulfilled,(state)=>{
            state.isCheckoutLoading=false
        })
        builder.addCase(verifyEsewaPayment.rejected,(state,action)=>{
            state.isCheckoutLoading=false
            state.checkoutError=action.payload||action.error.message
        })
    }
})
export const {setAdminOrders }=orderSlice.actions
export{ fetchAllOrders, fetchMyOrders, updateDeliveryStatus, createOrder, resumePendingPayment, deletePendingOrder, verifyEsewaPayment}
export default orderSlice.reducer
