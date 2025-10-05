import { Hono } from "hono";
import { health } from "../controllers/health.controller";

export const healthRoutes = new Hono();

healthRoutes.get("/", health);
