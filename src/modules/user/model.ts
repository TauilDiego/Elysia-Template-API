import { t } from "elysia";

export namespace UserModel {

    export const user = t.Object({
        id: t.String(),
        email: t.String(),
        name: t.String(),
        cpf: t.String()
    })
    export type user = typeof user.static

    export const createUser = t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
        cpf: t.String()
    })
    export type userCreate = typeof createUser.static

    export const updateUserData = t.Object({
        name: t.String(),
        cpf: t.String()
    })
    export type updateUserData = typeof updateUserData.static

    export const updateUserEmail = t.Object({
        email: t.String()
    })
    export type updateUserEmail = typeof updateUserEmail.static

    export const updateUserPassword = t.Object({
        password: t.String()
    })
    export type updateUserPassword = typeof updateUserPassword.static
}