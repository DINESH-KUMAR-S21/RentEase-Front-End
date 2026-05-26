import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createMaintenanceRequest = createAsyncThunk('maintenance/create', async (requestData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/maintenance/new', requestData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const getMyMaintenanceRequests = createAsyncThunk('maintenance/getMy', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/maintenance/me');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const getSingleMaintenanceRequest = createAsyncThunk('maintenance/getSingle', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/maintenance/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const cancelMaintenanceRequest = createAsyncThunk('maintenance/cancel', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/maintenance/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const adminGetAllMaintenanceRequests = createAsyncThunk('maintenance/adminGetAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/admin/maintenance');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState: {
        requests: [],
        request: null,
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
            .addCase(createMaintenanceRequest.pending, setPending)
            .addCase(createMaintenanceRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(createMaintenanceRequest.rejected, setError)

            .addCase(getMyMaintenanceRequests.pending, setPending)
            .addCase(getMyMaintenanceRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload.requests;
            })
            .addCase(getMyMaintenanceRequests.rejected, setError)

            .addCase(getSingleMaintenanceRequest.pending, setPending)
            .addCase(getSingleMaintenanceRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.request = action.payload.request;
            })
            .addCase(getSingleMaintenanceRequest.rejected, setError)

            .addCase(cancelMaintenanceRequest.pending, setPending)
            .addCase(cancelMaintenanceRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(cancelMaintenanceRequest.rejected, setError)

            .addCase(adminGetAllMaintenanceRequests.pending, setPending)
            .addCase(adminGetAllMaintenanceRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload.requests;
            })
            .addCase(adminGetAllMaintenanceRequests.rejected, setError);
    }
});

export const { clearError, clearMessage } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;