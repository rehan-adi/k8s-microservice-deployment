import { Hono } from "hono";
import { conversation } from "../controllers/conversation.controller";

export const conversationRoute = new Hono();

conversationRoute.post("/", conversation);
