import { analyze } from "@/open-ai";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await analyze(
    [
      "Your marijuana gummies from The CBD Vape Loft has been delivered",
      "Your prerolled stuff was delivered today.",
      "Hello! On a scale of 1-5, how would you rate the agent you just called?",
      "Huda Beauty: Summer's almost over, so is this sale. Get up to 60% OFF now.",
      "Your appointment on 4/20 is confirmed. See you soon.",
      "Howdy! Your order from Vape.com is on its way.",
      "It’s Sunday NIGHT! Time to place bets on the big game!",
    ].reduce(
      (acc, cur, idx) => Object.assign(acc, { [`message${idx}`]: cur }),
      {}
    )
  );

  res.status(200).json(data);
}
