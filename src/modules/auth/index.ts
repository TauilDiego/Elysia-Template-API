import Elysia from "elysia";
import { AuthModel } from "./model";

const authRoutes = new Elysia({ prefix: "auth" })
    .post("/sign-in", ({ body }): AuthModel.login => ,{
        detail: {
            tags: ['Auth']
        }
    })