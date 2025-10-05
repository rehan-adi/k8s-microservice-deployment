import type { Context } from "hono";

export const health = (c: Context) => {
  try {
    return c.json(
      {
        success: true,
        message: "server is up and running",
      },
      200
    );
  } catch (error) {
    console.error("error in health controller", error);
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
