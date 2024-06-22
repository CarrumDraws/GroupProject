import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from 'src/app/interface/auth';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(
    selectAuthState,
    (state: AuthState) => state.token
);

export const selectError = createSelector(
    selectAuthState,
    (state: AuthState) => state.error
)

export const selectLoading = createSelector(
    selectAuthState,
    (state: AuthState) => state.loading
)