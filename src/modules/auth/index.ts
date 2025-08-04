import Elysia from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";
import { UserService } from "../user/service";
import jwt from "@elysiajs/jwt";



const authRoutes = new Elysia({ prefix: "auth" })
    .state("teste1Ms", 100)
    .state("teste2Ms", 1000)
    .state("hourMs", 3600)
    .state("journeyMs", 8* 3600)
    .state("dayMs", 86400)
    .state('weekMs', 7 * 86400)
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRETS!
        })
    )
    .use(AuthModel)
    .post("/sign-in", async ({ jwt, body, cookie: { acessToken, refreshToken }, store: { teste1Ms, teste2Ms, journeyMs, weekMs} }) => {
        try {   
            const currentUser = await UserService.getUserByEmail(body.email, false)
            const isPasswordMatched = await AuthService.verifyPassword(currentUser.password, body.password)
            
            if (!currentUser || !isPasswordMatched) {
                throw new Error("Invalid email or password");
            }
            
            const JWTToken = await jwt.sign({ id: currentUser.id });
            acessToken.set({
                value: JWTToken,
                httpOnly: true,
                maxAge: journeyMs,
                path: "/user"
            })

            const refreshJWTToken = await jwt.sign({ id: currentUser.id })
            refreshToken.set({
                value: refreshJWTToken,
                httpOnly: true,
                maxAge: weekMs,
                path: "/user"
            })

            const updateUser = await UserService.updateToken(currentUser.id, refreshJWTToken)

            return {
                acessToken,
            };
        } catch(e) {
            return e
        }
    }, {
        detail: { tags: ['Auth'] },
        body: 'loginRequest'
    })

export default authRoutes;