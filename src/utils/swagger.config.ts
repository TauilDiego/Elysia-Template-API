import { ElysiaSwaggerConfig } from "@elysiajs/swagger";

const swaggerConfig: ElysiaSwaggerConfig = {
  documentation: {
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
    tags: [
      { name: "User", description: "User endpoints" },
      { name: "Auth", description: "Authentication endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
};

export default swaggerConfig;
