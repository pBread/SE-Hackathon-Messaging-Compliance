import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.method, req.body);
  res.status(200).json({ name: "John Doe" });
}
