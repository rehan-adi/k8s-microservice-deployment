import { Hono } from "hono";
import {
  createUser,
  getAllUser,
  getUserByEmail,
} from "../controllers/user.controller";

export const userRoutes = new Hono();

userRoutes.get("/", getAllUser);
userRoutes.post("/", createUser);
userRoutes.get("/get", getUserByEmail);
