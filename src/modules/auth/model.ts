import Elysia, { t } from "elysia";

export const loginRequest = t.Object({
    email: t.String(),
    password: t.String()
})

export const authResponse = t.Object({
    token: t.String(),
    refreshToken: t.String(),
})

export const AuthModel = new Elysia()
.model({
    loginRequest,
    authResponse
})