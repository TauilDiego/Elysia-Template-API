import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { JWT_NAME } from "src/config/constant";
import prisma from "src/utils/db";

const AuthPlugin = (app: Elysia) =>
    app.use(
        jwt({
            name: JWT_NAME,
            secret: process.env.JWT_SECRETS!
        })
    )
    .derive(async ({ jwt, cookie: { accessToken }, set }) => {
        if(!accessToken.value) {
            set.status = "Unauthorized";
            throw new Error("Access token is missing");
        }

        const jwtPayload = await jwt.verify(accessToken.value);
        if (!jwtPayload) {
            // handle error for access token is tempted or incorrect
            set.status = "Forbidden";
            throw new Error("Access token is invalid");
        }

        const userId = jwtPayload.sub;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            omit: {
                password: true
            }
        });

        if (!user) {
            // handle error for user not found from the provided access token
            set.status = "Forbidden";
            throw new Error("Access token is invalid");
        }

        return {
            user,
        };
    })

export { AuthPlugin }