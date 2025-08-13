import { Elysia } from "elysia";
import userRoutes from "./modules/user";
import swagger from "@elysiajs/swagger";
import authRoutes from "./modules/auth";

const app = new Elysia({
  prefix: "/api",
  normalize: true
}).get("/", () => "alive").listen(3001);

app
  .use(swagger({
    documentation: {
      info: {
        title: 'API Documentation',
        version: '1.0.0'
      },
      tags: [
        { name: 'User', description: 'User endpoints' },
        { name: 'Auth', description: 'Authentication endpoints' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  }))
  .group("/v1", (app) => app.use(userRoutes))
  .group("/v1", (app) => app.use(authRoutes))
  .listen(process.env.PORT || 3001);

export type App = typeof app;