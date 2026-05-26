import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import rentalReducer from './slices/rentalSlice';
import maintenanceReducer from './slices/maintenanceSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        order: orderReducer,
        rental: rentalReducer,
        maintenance: maintenanceReducer
    }
});

export default store;