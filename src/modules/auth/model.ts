import { t } from "elysia";

export namespace AuthModel {
    export const login = t.Object({
        email: t.String(),
        password: t.String()
    })
    export type login = typeof login.static
}