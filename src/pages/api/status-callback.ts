import { rephrase } from "@/open-ai";
import { twilioClient } from "@/twilio";
import type { NextApiRequest, NextApiResponse } from "next";
import { omit } from "lodash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const event = req.body;

  const isFailed = ["undelivered", "failed"].includes(event.MessageStatus);

  if (isFailed) {
    const originalMessage = await twilioClient
      .messages(event.MessageSid)
      .fetch();

    const aiResponse = await rephrase(originalMessage.body);
    console.log("Recommended Wording: ", originalMessage.body);

    const recommendedWording = aiResponse[0].message.content;
    console.log("Recommended Wording: ", recommendedWording);

    if (recommendedWording) {
      const newMessage = await twilioClient.messages.create({
        from: originalMessage.from,
        to: originalMessage.to,
        body: recommendedWording,
      });

      const fields = [
        "body",
        "direction",
        "from",
        "to",
        "dateUpdated",
        "sid",
        "accountSid",
        "messagingServiceSid",
        "dateSent",
        "dateCreated",
      ];

      res.status(200).json({
        originalMessage: fields.reduce(
          // @ts-ignore
          (acc, key) => Object.assign(acc, { [key]: originalMessage[key] }),
          {}
        ),
        newMessage: fields.reduce(
          // @ts-ignore
          (acc, key) => Object.assign(acc, { [key]: newMessage[key] }),
          {}
        ),
      });
    }
  } else res.status(200).json({ status: "Ignore" });
}
