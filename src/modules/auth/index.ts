import Elysia from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";
import { UserService } from "../user/service";
import jwt from "@elysiajs/jwt";
import getExpTimestamp from "../../utils/getExpTimestamp";
import { ACCESS_TOKEN_EXP, JWT_NAME, REFRESH_TOKEN_EXP } from "../../config/constant";



const authRoutes = new Elysia({ prefix: "auth" })
    .use(
        jwt({
            name: JWT_NAME,
            secret: process.env.JWT_SECRETS!
        })
    )
    .use(AuthModel)
    .post("/sign-in", async ({ jwt, body, cookie: { acessToken, refreshToken } }) => {
        try {   
            const currentUser = await UserService.getUserByEmail(body.email, false)
            const isPasswordMatched = await AuthService.verifyPassword(currentUser.password, body.password)
            
            if (!currentUser || !isPasswordMatched) {
                throw new Error("Invalid email or password");
            }
            
            const JWTToken = await jwt.sign({ 
                sub: currentUser.id,
                exp: getExpTimestamp(ACCESS_TOKEN_EXP)
            });
            acessToken.set({
                value: JWTToken,
                httpOnly: true,
                maxAge: ACCESS_TOKEN_EXP,
                path: "/user"
            })

            const refreshJWTToken = await jwt.sign({ 
                sub: currentUser.id,
                exp: getExpTimestamp(REFRESH_TOKEN_EXP)
            })
            refreshToken.set({
                value: refreshJWTToken,
                httpOnly: true,
                maxAge: REFRESH_TOKEN_EXP,
                path: "/user"
            })

            await UserService.updateToken(currentUser.id, refreshJWTToken)

            return {
                message: "User logged successfully",
                data: {
                    accessToken: JWTToken,
                    refreshToken: refreshJWTToken
                }
            }
        } catch(e) {
            return e
        }
    }, {
        detail: { tags: ['Auth'] },
        body: 'loginRequest'
    })
    .post("sign-in/refresh", async ({jwt, set, cookie: { accessToken, refreshToken } }) => {
        if (!refreshToken.value) {
            set.status = "Unauthorized";
            throw new Error("Refresh token is missing!")
        }

        const jwtPayload = await jwt.verify(refreshToken.value)

        if (!jwtPayload) {
            set.status = "Forbidden";
            throw new Error("Refresh token is invalid!");
        }

        const userId = jwtPayload.sub;
        const user = await UserService.getUserById(userId)
        
        if (!user) {
            set.status = "Forbidden";
            throw new Error("Refresh token is invalid")
        }

        const accessJWTToken = await jwt.sign({
            sub: user.id,
            exp: getExpTimestamp(ACCESS_TOKEN_EXP)
        })

        accessToken.set({
            value: accessJWTToken,
            httpOnly: true,
            maxAge: ACCESS_TOKEN_EXP,
            path: "/"
        })

        const refreshJWTToken = await jwt.sign({
            sub: user.id,
            exp: getExpTimestamp(REFRESH_TOKEN_EXP)
        })

        refreshToken.set({
            value: refreshJWTToken,
            httpOnly: true,
            maxAge: REFRESH_TOKEN_EXP,
            path: "/"
        })

        await UserService.updateToken(user.id, refreshJWTToken)

        return {
            message: "Access token was re-generated successfully",
            data: {
                accessToken: accessJWTToken,
                refreshToken: refreshJWTToken
            }
        }
    }, {
        detail: { tags: ['Auth'] },
        body: 'refreshRequest'
    })

export default authRoutes;