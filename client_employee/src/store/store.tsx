import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserState } from './userSlice.tsx';

const store = configureStore({
    reducer: {
        user: userReducer
    }
});

export type RootState = {
    user: UserState;
}
export default store;