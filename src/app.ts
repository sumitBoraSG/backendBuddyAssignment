import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
const swaggerDocument = YAML.load("./src/docs/swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

export default app;