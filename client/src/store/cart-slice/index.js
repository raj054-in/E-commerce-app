import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const getErrorMessage = (error, fallback) =>
  error.response?.data?.error || error.response?.data?.message || fallback;

const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/api/carts", {
        withCredentials: true,
      });
      const cart = response.data.cart?.[0];
      return cart?.products || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load your cart"));
    }
  }
);

const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, productQuantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/carts",
        { productId, productQuantity },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to add this product"));
    }
  }
);

const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ productId, productQuantity }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/carts",
        { productId, productQuantity },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to update your cart"));
    }
  }
);

const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/carts/${productId}`,
        { withCredentials: true }
      );
      return { productId, ...response.data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to remove this product"));
    }
  }
);

const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete("http://localhost:3000/api/carts", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to clear your cart"));
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(
          (item) => item.productId?._id !== action.payload.productId
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export { fetchCart, addToCart, updateCart, removeFromCart, clearCart };
export default cartSlice.reducer;
