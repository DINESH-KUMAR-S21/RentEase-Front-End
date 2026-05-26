import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const getAllProducts = createAsyncThunk('product/getAll', async (queryString = '', { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/products?${queryString}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const getSingleProduct = createAsyncThunk('product/getSingle', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/product/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const createReview = createAsyncThunk('product/createReview', async (reviewData, { rejectWithValue }) => {
    try {
        const { data } = await axios.put('/review', reviewData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

// Admin
export const adminGetAllProducts = createAsyncThunk('product/adminGetAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/admin/products');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const adminCreateProduct = createAsyncThunk('product/adminCreate', async (productData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/admin/product/create', productData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const adminUpdateProduct = createAsyncThunk('product/adminUpdate', async ({ id, productData }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/admin/product/${id}`, productData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const adminDeleteProduct = createAsyncThunk('product/adminDelete', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/admin/product/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        product: null,
        loading: false,
        error: null,
        message: null,
        totalProducts: 0,
        resultPerPage: 0
    },
    reducers: {
        clearError: (state) => { state.error = null; },
        clearMessage: (state) => { state.message = null; }
    },
    extraReducers: (builder) => {
        const setPending = (state) => { state.loading = true; state.error = null; };
        const setError = (state, action) => { state.loading = false; state.error = action.payload; };

        builder
            .addCase(getAllProducts.pending, setPending)
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.totalProducts = action.payload.totalProducts;
                state.resultPerPage = action.payload.resultPerPage;
            })
            .addCase(getAllProducts.rejected, setError)

            .addCase(getSingleProduct.pending, setPending)
            .addCase(getSingleProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product;
            })
            .addCase(getSingleProduct.rejected, setError)

            .addCase(createReview.pending, setPending)
            .addCase(createReview.fulfilled, (state) => {
                state.loading = false;
                state.message = "Review submitted successfully";
            })
            .addCase(createReview.rejected, setError)

            .addCase(adminGetAllProducts.pending, setPending)
            .addCase(adminGetAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(adminGetAllProducts.rejected, setError)

            .addCase(adminCreateProduct.pending, setPending)
            .addCase(adminCreateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.message = "Product created successfully";
                state.products.push(action.payload.product);
            })
            .addCase(adminCreateProduct.rejected, setError)

            .addCase(adminUpdateProduct.pending, setPending)
            .addCase(adminUpdateProduct.fulfilled, (state) => {
                state.loading = false;
                state.message = "Product updated successfully";
            })
            .addCase(adminUpdateProduct.rejected, setError)

            .addCase(adminDeleteProduct.pending, setPending)
            .addCase(adminDeleteProduct.fulfilled, (state) => {
                state.loading = false;
                state.message = "Product deleted successfully";
            })
            .addCase(adminDeleteProduct.rejected, setError);
    }
});

export const { clearError, clearMessage } = productSlice.actions;
export default productSlice.reducer;