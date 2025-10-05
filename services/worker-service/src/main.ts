import { redisClient } from "./lib/redis";
import { sendEmail } from "./job/sendEmail";

export interface Message {
  id: string;
  name: string;
  email: string;
  status: string;
}

async function main() {
  console.log("worker is ready to process messages");

  while (true) {
    try {
      const data = await redisClient.brpop("worker-queue", 0);

      if (!data) continue;

      const [, rawMessage] = data;

      let message: Message;
      try {
        message = JSON.parse(rawMessage);
      } catch (err) {
        console.error("Invalid JSON:", rawMessage, err);
        continue;
      }

      await sendEmail(message);
    } catch (err) {
      console.error("Redis consumer error:", err);
    }
  }
}

main().catch((err) => {
  console.error("server error:", err);
  process.exit(1);
});
