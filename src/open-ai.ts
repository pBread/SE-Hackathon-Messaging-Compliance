import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function rephrase(message: string) {
  const prompt = `Please rephrase the following message so it does not reference anything related to marijuana. The meaning of the message should not change.
  Message: __MESSAGE__
  `;

  console.log("Calling OpenAI to rephrase message");

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt.replace("__MESSAGE__", message),
      },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log("Finished OpenAI to rephrase message");

  console.log(completion.choices);

  return completion.choices;
}
