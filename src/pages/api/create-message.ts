// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { twilioClient } from "@/twilio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("create-message");
  const msg = await twilioClient.messages.create({
    body: req.body.body,
    from: "+17076255260",
    to: "+18475070348",
  });

  res.status(200).json(msg);
}
