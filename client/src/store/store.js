import { configureStore } from '@reduxjs/toolkit';
import ProductSlice from './slices/productSlice';

const store = configureStore({
    reducer: {
        products: ProductSlice,
    },
});

export default store;