import Elysia from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";
import { UserService } from "../user/service";
import jwt from "@elysiajs/jwt";
import getExpTimestamp from "@/utils/getExpTimestamp";
import {
  ACCESS_TOKEN_EXP,
  JWT_NAME,
  REFRESH_TOKEN_EXP,
} from "@/config/constant";
import { Logger } from "@/utils/logger";
import { AuthError } from "@/utils/error/ApiError";

const authRoutes = new Elysia({ prefix: "auth" })
  .use(
    jwt({
      name: JWT_NAME,
      secret: process.env.JWT_SECRETS!,
    })
  )
  .use(AuthModel)
  .decorate("logger", new Logger())
  .post(
    "/sign-in",
    async ({
      set,
      logger,
      jwt,
      body,
      cookie: { accessToken, refreshToken },
    }) => {
        
      const currentUser = await UserService.getUserByEmail(body.email, false);

      if (!currentUser) {
        set.status = 401;
        throw new AuthError("User not found");
      }

      const isPasswordMatched = await AuthService.verifyPassword(
        currentUser.password,
        body.password
      );

      if (!isPasswordMatched) {
        set.status = 401;
        throw new AuthError("Invalid password");
      }

      const JWTToken = await jwt.sign({
        sub: currentUser.id,
        exp: getExpTimestamp(ACCESS_TOKEN_EXP),
      });
      accessToken.set({
        value: JWTToken,
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXP,
        path: "/user",
      });

      const refreshJWTToken = await jwt.sign({
        sub: currentUser.id,
        exp: getExpTimestamp(REFRESH_TOKEN_EXP),
      });
      refreshToken.set({
        value: refreshJWTToken,
        httpOnly: true,
        maxAge: REFRESH_TOKEN_EXP,
        path: "/user",
      });

      await UserService.updateToken(currentUser.id, refreshJWTToken);

      return AuthModel.models.authResponse.Encode({
        message: "User logged successfully",
        data: {
          token: JWTToken,
          refreshToken: refreshJWTToken,
        },
      })
    },
    {
      detail: { tags: ["Auth"] },
      body: "loginRequest"
    }
  )
  .post(
    "sign-in/refresh",
    async ({ jwt, body, set, cookie: { accessToken, refreshToken } }) => {
      
      console.log(body);
      
      if (!refreshToken.value) {
        set.status = "Unauthorized";
        throw new Error("Refresh token is missing!");
      }

      const jwtPayload = await jwt.verify(refreshToken.value);

      if (!jwtPayload) {
        set.status = "Forbidden";
        throw new Error("Refresh token is invalid!");
      }

      const userId = jwtPayload.sub;
      const user = await UserService.getUserById(userId);

      if (!user) {
        set.status = "Forbidden";
        throw new Error("Refresh token is invalid");
      }

      const accessJWTToken = await jwt.sign({
        sub: user.id,
        exp: getExpTimestamp(ACCESS_TOKEN_EXP),
      });

      accessToken.set({
        value: accessJWTToken,
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXP,
        path: "/",
      });

      const refreshJWTToken = await jwt.sign({
        sub: user.id,
        exp: getExpTimestamp(REFRESH_TOKEN_EXP),
      });

      refreshToken.set({
        value: refreshJWTToken,
        httpOnly: true,
        maxAge: REFRESH_TOKEN_EXP,
        path: "/",
      });

      await UserService.updateToken(user.id, refreshJWTToken);

      return AuthModel.models.authResponse.Encode({
        message: "Access token was re-generated successfully",
        data: {
          token: accessJWTToken,
          refreshToken: refreshJWTToken,
        },
      })
    },
    {
      detail: { tags: ["Auth"] },
      body: "refreshRequest"
    }
  );

export default authRoutes;
