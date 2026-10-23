import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    isAuthenticated:false,
    isLoading:false,
    isCheckingAuth:true,
    user:null,
}
const signUpUser=createAsyncThunk('auth/signUpUser',async(userData,{rejectWithValue})=>{
    try {
        const response=await axios.post(
            'http://localhost:3000/api/auths/signup',
            userData,
            { withCredentials: true }
        )
        console.log(response.data)
         return response.data.user
        
    } catch (error) {
        
        return rejectWithValue(
        error.response?.data?.error ||error.response?.data?.message|| 'Signup failed'
      )
    }
})

const loginUser=createAsyncThunk('auth/loginUser',async(userData,{rejectWithValue})=>{
    try {
        const response=await axios.post(
            'http://localhost:3000/api/auths/login',
            userData,
            { withCredentials: true }
        )
        console.log(response.data)
        return response.data.user
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || 'Login failed'
        )
    }
})

const logoutUser=createAsyncThunk('auth/logoutUser',async(_,{rejectWithValue})=>{
    try {
        const response=await axios.post(
            'http://localhost:3000/api/auths/logout',
            {},
            { withCredentials:true }
        )
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || 'Logout failed'
        )
    }
})

const getProfile=createAsyncThunk('auth/getProfile',async(_,{rejectWithValue})=>{
    try {
        const response=await axios.get(
            'http://localhost:3000/api/auths/get-profile',
            { withCredentials:true }
        )
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || 'Not authenticated'
        )
    }
})

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
            state.isAuthenticated=true
        }

    },
    extraReducers:(builder)=>{
        builder.addCase(signUpUser.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(signUpUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isCheckingAuth=false;
            state.user=action.payload;
            state.isAuthenticated=true;
        })
        builder.addCase(signUpUser.rejected,(state)=>{
            state.isLoading=false;
            state.isCheckingAuth=false;
            state.isAuthenticated=false;
        })
        builder.addCase(loginUser.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isCheckingAuth=false;
            state.user=action.payload;
            state.isAuthenticated=true;
        })
        builder.addCase(loginUser.rejected,(state)=>{
            state.isLoading=false;
            state.isCheckingAuth=false;
            state.isAuthenticated=false;
        })
        builder.addCase(logoutUser.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(logoutUser.fulfilled,(state)=>{
            state.isLoading=false;
            state.isCheckingAuth=false;
            state.user=null;
            state.isAuthenticated=false;
        })
        builder.addCase(logoutUser.rejected,(state)=>{
            state.isLoading=false;
            state.isCheckingAuth=false;
            state.user=null;
            state.isAuthenticated=false;
        })
        builder.addCase(getProfile.pending,(state)=>{
            state.isCheckingAuth=true
        })
        builder.addCase(getProfile.fulfilled,(state,action)=>{
            state.isCheckingAuth=false
            state.user=action.payload
            state.isAuthenticated=true
        })
        builder.addCase(getProfile.rejected,(state)=>{
            state.isCheckingAuth=false
            state.user=null
            state.isAuthenticated=false
        })


    }
})

export const {setUser}=authSlice.actions
export {signUpUser,loginUser,logoutUser,getProfile}
export default authSlice.reducer
