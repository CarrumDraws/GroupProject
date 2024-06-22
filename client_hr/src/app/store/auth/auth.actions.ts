import { createActionGroup, props, emptyProps } from '@ngrx/store';

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        login: props<{ email: string, password: string}>(),
        logout: emptyProps,
        loginSuccess: props<{ token: string}>(),
        loginFailure: props<{ error: string}>()
    }
})