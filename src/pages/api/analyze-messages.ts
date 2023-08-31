import { analyze } from "@/open-ai";
import { MessageRecord } from "@/state";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const messages = Object.values(
    JSON.parse(req.body) as Record<string, MessageRecord>
  );

  const payload = messages.reduce(
    (acc, cur) => Object.assign(acc, { [cur.Sid]: cur.Body }),
    {}
  );

  const data = await analyze(payload);

  res.status(200).json(data);
}
