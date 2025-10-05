import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { userRoutes } from "./routes/user.route";
import { healthRoutes } from "./routes/health.route";
import { conversationRoute } from "./routes/conversation.route";

export const app = new Hono();

// middlewares
app.use(logger());
app.use(poweredBy());

// routes
app.route("/api/v1/user", userRoutes);
app.route("/api/v1/health", healthRoutes);
app.route("/api/v1/conversation", conversationRoute);
