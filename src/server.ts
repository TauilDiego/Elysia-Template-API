import { Elysia, t } from "elysia";
import userRoutes from "./modules/user";
import swagger from "@elysiajs/swagger";
import authRoutes from "./modules/auth";
import publicRoutes from "./modules/public";
import swaggerConfig from "./utils/swagger.config";

const encoder = new TextEncoder();

const app = new Elysia({
  prefix: "/api",
  normalize: false,
})
  .get("/", () => "alive")
  .listen(3001);

app
  .use(swagger(swaggerConfig))
  .mapResponse(({ response, set }) => {

    const isJson = typeof response === "object";

    const text = isJson
      ? JSON.stringify(response)
      : (response?.toString() ?? "");

    const ab = Bun.gzipSync(encoder.encode(text))
    
    set.headers["Content-Encoding"] = "gzip";
    if (isJson) 
      set.headers["Content-Type"] = "application/json";

    return new Response(ab as BodyInit);
  })
  .group("/v1", (app) => app.use(userRoutes))
  .group("/v1", (app) => app.use(authRoutes))
  .group("/v1", (app) => app.use(publicRoutes))
  .listen(process.env.PORT || 3001);

export type App = typeof app;
