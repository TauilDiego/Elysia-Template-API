import { Elysia } from "elysia";
import userRoutes from "./modules/user";
import swagger from "@elysiajs/swagger";
import authRoutes from "./modules/auth";
import publicRoutes from "./modules/public";
import { ApiError } from "./utils/error/ApiError";
import swaggerConfig from "./utils/swagger.config";

const app = new Elysia({
  prefix: "/api",
  normalize: true,
})
  .get("/", () => "alive")
  .listen(3001);

app
  .error({
    ApiError
  })
  .onError(({ error, code }) => {
    return {
      error
    }
  })
  .use(swagger(swaggerConfig))
  .group("/v1", (app) => app.use(userRoutes))
  .group("/v1", (app) => app.use(authRoutes))
  .group("/v1", (app) => app.use(publicRoutes))
  .listen(process.env.PORT || 3001);

export type App = typeof app;
