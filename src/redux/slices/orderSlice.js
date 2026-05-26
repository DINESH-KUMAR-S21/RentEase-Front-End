import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createOrder = createAsyncThunk('order/create', async (orderData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/new/order', orderData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const getMyOrders = createAsyncThunk('order/getMyOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/orders/me');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const getSingleOrder = createAsyncThunk('order/getSingle', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/order/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const adminGetAllOrders = createAsyncThunk('order/adminGetAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/admin/orders');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const adminUpdateOrder = createAsyncThunk('order/adminUpdate', async ({ id, orderData }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/admin/order/${id}`, orderData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const adminDeleteOrder = createAsyncThunk('order/adminDelete', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/admin/order/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        order: null,
        loading: false,
        error: null,
        message: null,
        totalRevenue: 0
    },
    reducers: {
        clearError: (state) => { state.error = null; },
        clearMessage: (state) => { state.message = null; }
    },
    extraReducers: (builder) => {
        const setPending = (state) => { state.loading = true; state.error = null; };
        const setError = (state, action) => { state.loading = false; state.error = action.payload; };

        builder
            .addCase(createOrder.pending, setPending)
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
                state.message = "Order placed successfully";
            })
            .addCase(createOrder.rejected, setError)

            .addCase(getMyOrders.pending, setPending)
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(getMyOrders.rejected, setError)

            .addCase(getSingleOrder.pending, setPending)
            .addCase(getSingleOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(getSingleOrder.rejected, setError)

            .addCase(adminGetAllOrders.pending, setPending)
            .addCase(adminGetAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.totalRevenue = action.payload.totalRevenue;
            })
            .addCase(adminGetAllOrders.rejected, setError)

            .addCase(adminUpdateOrder.pending, setPending)
            .addCase(adminUpdateOrder.fulfilled, (state) => {
                state.loading = false;
                state.message = "Order updated successfully";
            })
            .addCase(adminUpdateOrder.rejected, setError)

            .addCase(adminDeleteOrder.pending, setPending)
            .addCase(adminDeleteOrder.fulfilled, (state) => {
                state.loading = false;
                state.message = "Order deleted successfully";
            })
            .addCase(adminDeleteOrder.rejected, setError);
    }
});

export const { clearError, clearMessage } = orderSlice.actions;
export default orderSlice.reducer;