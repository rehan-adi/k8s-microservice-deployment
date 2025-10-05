import type { Context } from "hono";
import { streamSSE } from "hono/streaming";
import { openRouter } from "../lib/openrouter";

export const conversation = async (c: Context) => {
  try {
    const { message } = await c.req.json<{ message: string }>();

    return streamSSE(c, async (stream) => {
      console.log("SSE connection opened");

      const response = await openRouter.chat.completions.create({
        model: "deepseek/deepseek-r1:free",
        stream: true,
        messages: [{ role: "user", content: message }],
      });

      for await (const chunk of response) {
        const token = chunk.choices?.[0]?.delta?.content;
        if (!token) continue;

        await stream.writeSSE({
          event: "ai-response",
          data: token,
        });
      }

      await stream.writeSSE({ event: "end", data: "[DONE]" });
      await stream.close();
    });
  } catch (error) {
    console.error("error in conversation controller", error);
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
