import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const getMyActiveRentals = createAsyncThunk('rental/getActive', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/rentals/me/active');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const getMyRentalHistory = createAsyncThunk('rental/getHistory', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/rentals/me/history');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const getSingleRental = createAsyncThunk('rental/getSingle', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/rental/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const extendRental = createAsyncThunk('rental/extend', async ({ id, additionalMonths }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/rental/extend/${id}`, { additionalMonths });
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const requestReturn = createAsyncThunk('rental/requestReturn', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/rental/return/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const createRental = createAsyncThunk('rental/create', async (orderId, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`/rental/new/${orderId}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const adminGetAllRentals = createAsyncThunk('rental/adminGetAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/admin/rentals');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const adminUpdateRentalStatus = createAsyncThunk('rental/adminUpdateStatus', async ({ id, rentalStatus }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/admin/rental/${id}`, { rentalStatus });
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

const rentalSlice = createSlice({
    name: 'rental',
    initialState: {
        rentals: [],
        rental: null,
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

        builder
            .addCase(getMyActiveRentals.pending, setPending)
            .addCase(getMyActiveRentals.fulfilled, (state, action) => {
                state.loading = false;
                state.rentals = action.payload.rentals;
            })
            .addCase(getMyActiveRentals.rejected, setError)

            .addCase(getMyRentalHistory.pending, setPending)
            .addCase(getMyRentalHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.rentals = action.payload.rentals;
            })
            .addCase(getMyRentalHistory.rejected, setError)

            .addCase(getSingleRental.pending, setPending)
            .addCase(getSingleRental.fulfilled, (state, action) => {
                state.loading = false;
                state.rental = action.payload.rental;
            })
            .addCase(getSingleRental.rejected, setError)

            .addCase(extendRental.pending, setPending)
            .addCase(extendRental.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(extendRental.rejected, setError)

            .addCase(requestReturn.pending, setPending)
            .addCase(requestReturn.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(requestReturn.rejected, setError)

            .addCase(createRental.pending, setPending)
            .addCase(createRental.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(createRental.rejected, setError)

            .addCase(adminGetAllRentals.pending, setPending)
            .addCase(adminGetAllRentals.fulfilled, (state, action) => {
                state.loading = false;
                state.rentals = action.payload.rentals;
            })
            .addCase(adminGetAllRentals.rejected, setError)

            .addCase(adminUpdateRentalStatus.pending, setPending)
            .addCase(adminUpdateRentalStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(adminUpdateRentalStatus.rejected, setError);
    }
});

export const { clearError, clearMessage } = rentalSlice.actions;
export default rentalSlice.reducer;