import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rephrasePrompt = `
Here is a message: __MESSAGE__

This message was flagged as being non-compliant with application-to-person (A2P) messaging rules. I need you to rephrase this message in the following ways:
> If a proper noun (such as a name) can be confused with prohibited content, remove the name from the message.
> If words or phrases can be confused for prohibited content, rephrase the content to eliminate that confusion without changing the original intent of the message.

Here are the A2P Rules:
Rule 1: No illegal substances. Messages directly or indirectly referencing Cannabis, CBD, vape, e-cigs, etc. are prohibited. This includes slang such as “weed”, “pot”, “bud”, “reefer” etc.

Rule 2: No gambling, casino apps, sweepstakes, raffles, contests, etc.
`;

export async function rephrase(message: string) {
  console.log("Calling OpenAI to rephrase message");

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: rephrasePrompt.replace("__MESSAGE__", message),
      },
    ],
    model: "gpt-4",
  });

  console.log("Finished OpenAI to rephrase message");

  console.log(completion.choices);

  return completion.choices;
}
