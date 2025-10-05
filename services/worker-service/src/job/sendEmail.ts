import { resend } from "../lib/resend";
import type { Message } from "../main";
import { client } from "@k8s-microservice-deployment/db";

export const sendEmail = async (message: Message) => {
  try {
    if (message.status == "SENT") {
      console.error("email already sent to user");
    }

    const { data, error } = await resend.emails.send({
      from: "Fucker <onboarding@resend.dev>",
      to: message.email,
      subject: `Welcome ${message.name} bro`,
      html: `
       <p>Alright, you are an absolute chutiya, thanks for signing up in our system.</p>
       <p>Now go ahead and have some fun 😎</p>
  `,
    });

    if (error) {
      throw new Error("failed to send email resend issue");
    }

    await client.user.update({
      where: {
        id: message.id,
      },
      data: {
        emailSentStatus: "SENT",
      },
    });

    console.log("email sent to user and db staus update successful");
  } catch (error) {
    console.error("failed to send email, job error heappend", error);
  }
};
