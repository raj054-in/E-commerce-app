import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// UI-only blueprint data. Replace these mock actions with API calls later.
const mockProducts = [
  {
    _id: "product-1",
    name: "Classic Cotton T-Shirt",
    sku: "TSH-001",
    price: 1499,
    discountPrice: 1199,
    countInStock: 24,
    category: "Clothing",
    brand: "Urban Basics",
    collections: "Summer",
    gender: "Unisex",
    material: "Cotton",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    tags: ["casual", "cotton"],
    description: "A comfortable everyday cotton t-shirt.",
    rating: 4.5,
    isPublished: true,
    isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", altText: "Classic cotton t-shirt" }],
  },
  {
    _id: "product-2",
    name: "Minimal Leather Backpack",
    sku: "BAG-002",
    price: 4999,
    countInStock: 12,
    category: "Accessories",
    brand: "North Street",
    collections: "Essentials",
    gender: "Unisex",
    material: "Leather",
    sizes: ["Standard"],
    colors: ["Brown"],
    tags: ["bag", "travel"],
    description: "A practical backpack with a clean, minimal design.",
    rating: 4.2,
    isPublished: true,
    isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800", altText: "Minimal leather backpack" }],
  },
];

const initialState = {
  products: mockProducts,
  shopProducts:[],
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  error: null,
};

const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ page = 1, limit = 8 } , { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products/?page=${page}&limit=${limit}`,
        {
        withCredentials: true,
        }
      );

      const { products = [], pagination = {} } = response.data;

      return {
        products,
        totalPages: pagination.totalPage || 1,
        page: pagination.currentPage || page,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Product fetch failed"
      );
    }
  }
);

const addNewProduct = createAsyncThunk("product/addNewProduct", async (formData,{rejectWithValue}) => {
    try {
        const response =await axios.post("http://localhost:3000/api/products",formData,{withCredentials:true})
        return response.data
    } catch (error) {
         return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || "Product creation failed"
      )
        
    }


});

const updateProduct = createAsyncThunk("product/updateProduct", async ({ id, formData },{rejectWithValue}) => {
    try {
        const response=await axios.patch(`http://localhost:3000/api/products/${id}`,formData,{withCredentials:true}) 
        return response.data
        
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || "Product Update failed"
        )
    }
//   // TODO: replace with the real PUT/PATCH product request.
//   return { id, formData };
});

const deleteProduct = createAsyncThunk("product/deleteProduct", async (id,{rejectWithValue}) => {
    try {
        await axios.delete(`http://localhost:3000/api/products/${id}`,{withCredentials:true})
        return id
        
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.error || error.response?.data?.message || "Product deletion failed"
        )
        
    }
//   // TODO: replace with the real DELETE product request.
//   return id;
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product._id !== action.payload);
      });
  },
});

export const { setProducts, clearProductError } = productSlice.actions;
export { fetchProducts, addNewProduct, updateProduct, deleteProduct };
export default productSlice.reducer;
