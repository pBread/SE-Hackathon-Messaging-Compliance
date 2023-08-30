import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const rephrasePrompt = `
Here is a message: __MESSAGE__

This message was flagged as being non-compliant with application-to-person (A2P) messaging rules. I need you to rephrase this message in the following ways:
> If a proper noun (such as a name) can be confused with prohibited content, remove the name from the message.
> If words or phrases can be confused for prohibited content, rephrase the content to eliminate that confusion without changing the original intent of the message.
> Abbreviated dates like “4/20” should be written out to “April 20th”

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

const analysisPrompt = `
Some content is prohibited from application-to-person (A2P) messages. I have included the rules below and a list of messages.

Please analyze these messages. Include a summary of how many of the messages have potential violations and the general type of violations. If a message is compliant, no feedback for that message is required.

Your response should be returned as a JSON object.  The keys should be the IDs and the values should be your feedback.

Something like:
{ summary: “…..”,  message1: “This message is not compliant for these reasons” }

Here are the A2P Rules:
Rule 1: No illegal substances. Messages directly or indirectly referencing Cannabis, CBD, vape, e-cigs, etc. are prohibited. This includes slang such as “weed”, “pot”, “bud”, “reefer” etc.

Rule 2: No gambling, casino apps, sweepstakes, raffles, contests, etc.

Here are the messages:
`;

export async function analyze(messages: { [key: string]: string }) {
  console.log("Calling OpenAI to analyze messages");

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: analysisPrompt + JSON.stringify(messages),
      },
    ],
    model: "gpt-4",
  });

  console.log("Finished analyzing messages");

  console.log(completion.choices);

  return completion.choices;
}
