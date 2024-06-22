import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store.tsx';

export interface UserState {
    isLoggedIn: boolean;
}

const initialState: UserState = {
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state) => {
          state.isLoggedIn = true;
        },
    
        logout: (state) => {
          state.isLoggedIn = false;
        },
      }
});

export const { login, logout } = userSlice.actions;
export const selectIsLoggedIn = (state: RootState) : boolean => state.user.isLoggedIn;
export default userSlice.reducer;