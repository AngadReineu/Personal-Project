import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}`
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`

//async thunk to fetch admin products

export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchAdminProducts", async () => {
    const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: {
            Authorization: USER_TOKEN,
        }
    });
    return response.data
})

//async function to create a new product

export const createProduct = createAsyncThunk("adminProducts/createProduct", async (productData) => {
    const response = await axios.post(`${API_URL}/api/admin/products`,
        productData,
        {
            headers:{
                Authorization: USER_TOKEN,
            }
        }
    );
    return response.data;
})

//async thunk to update an existing product

export const updateProduct = createAsyncThunk("adminProducts/updateProduct", async({id,productData})=>{
    const response = await axios.put(`${API_URL}/api/admin/products/${id}`,
        productData,
        {
            headers:{
                Authorization:USER_TOKEN,
            }
        }
    );
    return response.data
})

// to delete the product

export const deleteProduct = createAsyncThunk("adminProducts/deleteProduct",async(id)=>{
     await axios.delete(`${API_URL}/api/admin/products/${id}`,
        {
            headers:{
                Authorization: USER_TOKEN,
            }
        }
    );
    return id;
});

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
    
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
       const index = state.products.findIndex(
        (product)=> product._id === action.payload._id
       );
       if(index !== -1){
        state.products[index] = action.payload;
       }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminProductSlice.reducer;