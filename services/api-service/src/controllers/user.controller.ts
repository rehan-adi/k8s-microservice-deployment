import type { Context } from "hono";
import { redisClient } from "../lib/redis";
import { client } from "@k8s-microservice-deployment/db";

export const createUser = async (c: Context) => {
  try {
    const body = await c.req.json<{ name: string; email: string }>();

    const { name, email } = body;

    const existingUser = await client.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return c.json(
        {
          success: false,
          message: "user already present in db",
        },
        409
      );
    }

    const newUser = await client.user.create({
      data: {
        name,
        email,
      },
    });

    const payload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      status: newUser.emailSentStatus,
    };

    await redisClient.lpush("worker-queue", JSON.stringify(payload));

    return c.json(
      {
        success: true,
        message: "user created successfully",
        data: newUser,
      },
      201
    );
  } catch (error) {
    console.error("error in createUser controller", error);
    return c.json(
      {
        success: false,
        message: "internal server error",
        error: error,
      },
      500
    );
  }
};

export const getAllUser = async (c: Context) => {
  try {
    const allusers = await client.user.findMany();

    return c.json(
      {
        success: true,
        message: "fetch done properly",
        data: allusers,
      },
      200
    );
  } catch (error) {
    console.error("error in getAllUser controller", error);
    return c.json(
      {
        success: false,
        message: "internal server error",
        error: error,
      },
      500
    );
  }
};

export const getUserByEmail = async (c: Context) => {
  try {
    const email = c.req.query("email");

    const user = await client.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return c.json(
        {
          success: false,
          message: "user not found",
        },
        404
      );
    }

    return c.json(
      {
        success: true,
        message: "data fetched successfully",
        data: user,
      },
      200
    );
  } catch (error) {
    console.error("error in getUserByEmail controller", error);
    return c.json(
      {
        success: false,
        message: "internal server error",
        error: error,
      },
      500
    );
  }
};
