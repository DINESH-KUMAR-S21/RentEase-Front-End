import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// ─── Async Thunks ─────────────────────────────────────────────────

export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/register', formData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/login', formData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/logout');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/me');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axios.put('/me/update', formData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axios.put('/password/update', formData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/password/forgot', { email });
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, passwords }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/password/reset/${token}`, passwords);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

// ─── Slice ────────────────────────────────────────────────────────

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        clearMessage: (state) => { state.message = null; },
        // Restore auth state from localStorage
        restoreAuthFromStorage: (state, action) => {
            const savedAuth = localStorage.getItem('authState');
            if (savedAuth) {
                try {
                    const parsed = JSON.parse(savedAuth);
                    state.user = parsed.user;
                    state.isAuthenticated = parsed.isAuthenticated;
                } catch (error) {
                    localStorage.removeItem('authState');
                }
            }
        }
    },
    extraReducers: (builder) => {
        // Helper functions
        const setPending = (state) => {
            state.loading = true;
            state.error = null;
        };
        const setError = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };

        builder
            // Register
            .addCase(registerUser.pending, setPending)
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem('authState', JSON.stringify({
                    user: action.payload.user,
                    isAuthenticated: true
                }));
            })
            .addCase(registerUser.rejected, setError)

            // Login
            .addCase(loginUser.pending, setPending)
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem('authState', JSON.stringify({
                    user: action.payload.user,
                    isAuthenticated: true
                }));
            })
            .addCase(loginUser.rejected, setError)

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem('authState');
            })

            // Load User
            .addCase(loadUser.pending, setPending)
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem('authState', JSON.stringify({
                    user: action.payload.user,
                    isAuthenticated: true
                }));
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem('authState');
            })

            // Update Profile
            .addCase(updateProfile.pending, setPending)
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.message = "Profile updated successfully";
                localStorage.setItem('authState', JSON.stringify({
                    user: action.payload.user,
                    isAuthenticated: true
                }));
            })
            .addCase(updateProfile.rejected, setError)

            // Update Password
            .addCase(updatePassword.pending, setPending)
            .addCase(updatePassword.fulfilled, (state) => {
                state.loading = false;
                state.message = "Password updated successfully";
            })
            .addCase(updatePassword.rejected, setError)

            // Forgot Password
            .addCase(forgotPassword.pending, setPending)
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, setError)

            // Reset Password
            .addCase(resetPassword.pending, setPending)
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem('authState', JSON.stringify({
                    user: action.payload.user,
                    isAuthenticated: true
                }));
            })
            .addCase(resetPassword.rejected, setError);
    }
});

export const { clearError, clearMessage, restoreAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;