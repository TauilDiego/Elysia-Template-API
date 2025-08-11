import Elysia, { t } from "elysia";

export const loginRequest = t.Object({
    email: t.String(),
    password: t.String()
})

export const refreshRequest = t.Object({
    refreshToken: t.String()
})

export const authResponse = t.Object({
    token: t.String(),
    refreshToken: t.String(),
})

export const tokenContent = t.Object({
    id: t.String(),
    iat: t.Number()
})

export const AuthModel = new Elysia()
.model({
    loginRequest,
    authResponse,
    refreshRequest,
    tokenContent
})