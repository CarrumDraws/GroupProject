import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState } from 'src/app/interface/auth';

const storedToken: string | null = localStorage.getItem('token');

const initialState: AuthState = {
    loading: false,
    token: storedToken,
    error: null
};

export const AuthReducer = createReducer(
    initialState,
    on(AuthActions.login, state=>({...state, loading: true})),
    on(AuthActions.logout, state => ({...state, token: null})),
    on(AuthActions.loginsuccess, (state, { token }) => ({...state, token, loading: false})),
    on(AuthActions.loginfailure, (state, { error }) => ({...state, error, loading: false}))

);