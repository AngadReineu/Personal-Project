import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkoutData, // ✅ send data directly
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ added space
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Checkout error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: "Checkout failed" });
    }
  }
);

// ✅ Slice
const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false; // ✅ fixed
        state.error = action.payload?.message || "Checkout failed";
      });
  },
});

export default checkoutSlice.reducer;
