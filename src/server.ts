import { Elysia } from "elysia";
import userRoutes from "./modules/user";
import swagger from "@elysiajs/swagger";


const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

app
  .use(swagger({
    documentation: {
      info: {
        title: 'Dom pratus Documentation',
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
  .group("/api", (app) => app.use(userRoutes))
  .listen(process.env.PORT || 3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
