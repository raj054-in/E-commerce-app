import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/lib/api";

const initialState = {
  summary: null,
  isLoading: false,
  error: null,
};

const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchDashboardSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/admin/summary`,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to load dashboard data"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export { fetchDashboardSummary };
export default dashboardSlice.reducer;
