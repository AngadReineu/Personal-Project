import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


//aysnc thnk to fetch user orders

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user orders");
    }
  }
);

// Async thunk to fetch order details by ID
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch order details");
    }
  }
);

const orderSlice = createSlice({
    name:"orders",
    initialState:{
        orders:[],
        totalOrders:0,
        orderDetails:null,
        loading: false,
        error: null,
    },
    reducers:{},
    extraReducers: (builder) => {
  // Fetch user orders
  builder
    .addCase(fetchUserOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })
    .addCase(fetchUserOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch user orders";
    })

    // Fetch order details
    .addCase(fetchOrderDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchOrderDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload; // changed key to avoid overwriting orders
    })
    .addCase(fetchOrderDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch order details";
    });
},
});


export default orderSlice.reducer;
