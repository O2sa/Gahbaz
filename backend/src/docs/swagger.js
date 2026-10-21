import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./openapi.js";

const swaggerRouter = Router();

// Raw JSON spec endpoint within the docs router
swaggerRouter.get("/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(openApiSpec);
});

// Swagger UI customization options
const swaggerUiOptions = {
  customSiteTitle: "Gahbaz E-Learning API Documentation",
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .info .title { color: #1e293b; font-family: system-ui, -apple-system, sans-serif; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 15px; border-radius: 8px; }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
    docExpansion: "list",
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
  },
};

// Interactive Swagger UI documentation
swaggerRouter.use("/", swaggerUi.serve, swaggerUi.setup(openApiSpec, swaggerUiOptions));

export { openApiSpec };
export default swaggerRouter;
