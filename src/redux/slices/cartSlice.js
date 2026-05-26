import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const getMyCart = createAsyncThunk('cart/getMyCart', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/cart');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (cartData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/cart/add', cartData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const updateCartItem = createAsyncThunk('cart/updateItem', async (updateData, { rejectWithValue }) => {
    try {
        const { data } = await axios.put('/cart/update', updateData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const removeCartItem = createAsyncThunk('cart/removeItem', async (productId, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/cart/remove/${productId}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete('/cart/clear');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null,
        loading: false,
        error: null,
        message: null
    },
    reducers: {
        clearError: (state) => { state.error = null; },
        clearMessage: (state) => { state.message = null; }
    },
    extraReducers: (builder) => {
        const setPending = (state) => { state.loading = true; state.error = null; };
        const setError = (state, action) => { state.loading = false; state.error = action.payload; };
        const setCart = (state, action) => { state.loading = false; state.cart = action.payload.cart; };

        builder
            .addCase(getMyCart.pending, setPending)
            .addCase(getMyCart.fulfilled, setCart)
            .addCase(getMyCart.rejected, setError)

            .addCase(addToCart.pending, setPending)
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart;
                state.message = action.payload.message;
            })
            .addCase(addToCart.rejected, setError)

            .addCase(updateCartItem.pending, setPending)
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart;
                state.message = "Cart updated";
            })
            .addCase(updateCartItem.rejected, setError)

            .addCase(removeCartItem.pending, setPending)
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart;
                state.message = "Item removed from cart";
            })
            .addCase(removeCartItem.rejected, setError)

            .addCase(clearCart.pending, setPending)
            .addCase(clearCart.fulfilled, (state) => {
                state.loading = false;
                state.cart = null;
                state.message = "Cart cleared";
            })
            .addCase(clearCart.rejected, setError);
    }
});

export const { clearError, clearMessage } = cartSlice.actions;
export default cartSlice.reducer;