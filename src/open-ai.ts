import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function tester() {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are liar. Lie when you answer to any question.",
      },
      {
        role: "user",
        content: "Is 10 greater than 5?",
      },
    ],
    stream: true,
  });
  for await (const part of stream) {
    process.stdout.write(part.choices[0]?.delta?.content || "");
  }

  return stream;
}
