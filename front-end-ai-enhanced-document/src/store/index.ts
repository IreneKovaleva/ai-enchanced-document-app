import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from "./dialogView";

const store = configureStore({
    reducer: {
        dialog: dialogReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
