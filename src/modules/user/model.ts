import Elysia, { t } from "elysia";



export const user = t.Object({
    id: t.String(),
    email: t.String(),
    name: t.String(),
    cpf: t.String()
})

export const createUser = t.Object({
    name: t.String(),
    email: t.String(),
    password: t.String(),
    cpf: t.String()
})

export const updateUserData = t.Object({
    name: t.String(),
    cpf: t.String()
})

export const updateUserEmail = t.Object({
    email: t.String()
})

export const updateUserPassword = t.Object({
    password: t.String()
})

export const UserModel = new Elysia()
    .model({
        user,
        createUser,
        updateUserData,
        updateUserEmail,
        updateUserPassword
    })