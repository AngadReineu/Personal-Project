import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createStaticHandler } from "react-router-dom";

//fetch all orders (admin Only) 

export const fetchAllOrder = createAsyncThunk("adminOrders/fetchAllOrder", async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
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

// update order delivery status

export const updateOrderStatus = createAsyncThunk("adminOrders/updateOrderStatus", async ({id,status}, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        {status},
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

// deleting an order 

export const deleteOrder = createAsyncThunk("adminOrders/deleteOrder", async ({id}, { rejectWithValue }) => {
    try {
    await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
    
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user orders");
    }
  }
);

const adminOrderSlice = createSlice({
    name:"adminOrders",
    initialState:{
    orders:[],
    totalOrders: 0,
    totalSales:0,
    loading:false,
    error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
         builder
      
      // FETCH ALL ORDERS
    
      .addCase(fetchAllOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        //calculate total sales
        const totalSales = action.payload.reduce((acc,order)=>{
            return acc+ order.totalPrice;
        },0);
        state.totalSales =totalSales;
      })
      .addCase(fetchAllOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

   
      // UPDATE ORDER STATUS
   
      
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        
        const orderIndex = state.orders.findIndex(
        (order)=> order._id === action.payload._id
       );
       if(orderIndex !== -1){
        state.orders[orderIndex] = action.payload;
       }
      })
  
      

      // =========================
      // DELETE ORDER
      // =========================
      
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((order) => order._id !== action.payload);
      })
     
  },
});

export default adminOrderSlice.reducer;
