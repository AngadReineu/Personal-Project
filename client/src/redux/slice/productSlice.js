import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ========== Async Thunks ==========

// Fetch products with filters
export const fetchProductByFilter = createAsyncThunk(
    "products/fetchByFilters",
    async ({
        collection,
        size,
        color,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit,
    }) => {
        const query = new URLSearchParams();
        if (collection) query.append("collection", collection);
        if (size) query.append("size", size);
        if (color) query.append("color", color);
        if (gender) query.append("gender", gender);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (sortBy) query.append("sortBy", sortBy);
        if (search) query.append("search", search);
        if (category) query.append("category", category);
        if (material) query.append("material", material);
        if (brand) query.append("brand", brand);
        if (limit) query.append("limit", limit);
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`;
        console.log("🌍 Fetching from URL:", url);
        const response = await axios.get(url);


        console.log("🛰️ Fetching products with filters...");
        console.log("✅ Response data:", response.data);
        return response.data;

    }
);



// Fetch product details by ID
export const fetchProductByDetails = createAsyncThunk(
    "products/fetchProductByDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch product details");
        }
    }
);

// Update product
export const updateProducts = createAsyncThunk(
    "product/updateProducts",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update product");
        }
    }
);

// Fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
    "products/fetchSimilarProducts",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch similar products");
        }
    }
);

// ========== Slice ==========

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        selectedProduct: null,
        similarProducts: [],
        loading: false,
        error: null,
        filters: {
            category: "",
            size: "",
            color: "",
            gender: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            material: "",
            collection: "",
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        cleanFilters: (state) => {
            state.filters = {
                category: "",
                size: "",
                color: "",
                gender: "",
                brand: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
                material: "",
                collection: "",
            };
        },
    },
    extraReducers: (builder) => {
        builder
            // 🔹 Fetch products
            .addCase(fetchProductByFilter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductByFilter.fulfilled, (state, action) => {
                state.loading = false;
                state.products = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchProductByFilter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // 🔹 Fetch product details
            .addCase(fetchProductByDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductByDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductByDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // 🔹 Update product
            .addCase(updateProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProducts.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload;
                const index = state.products.findIndex(
                    (product) => product._id === updatedProduct._id
                );
                if (index !== -1) {
                    state.products[index] = updatedProduct;
                }
            })
            .addCase(updateProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // 🔹 Fetch similar products
            .addCase(fetchSimilarProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.similarProducts = action.payload;
            })
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { setFilters, cleanFilters } = productsSlice.actions;
export default productsSlice.reducer;
