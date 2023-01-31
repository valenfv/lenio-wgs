type ChatInteraction = {
  question: string;
  reply?: string;
};

export async function queryCompletions(
  prompt: string,
  options: { apikey: string }
): Promise<string> {
  return fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${options.apikey}`,
    },
    method: "POST",
    body: JSON.stringify({
      echo: true,
      max_tokens: 3000,
      model: "text-davinci-003",
      prompt,
      stop: ["Human:", "AI:"],
      temperature: 0.8,
    }),
  })
    .then((response) => response.json())
    .then((resp) => {
      return (resp.choices?.[0]?.text || "").replaceAll("\n", "").trim();
    });
}

export function getPrompt(context: string, interactions: ChatInteraction[]) {
  return `${context}
    
${interactions
  .map(
    (i) => `Human: ${i.question}
AI: ${i.reply || ""}`
  )
  .join("\n")}`;
}

export async function queryCompletionsChat(
  context: string,
  interactions: ChatInteraction[],
  options: { apikey: string }
): Promise<ChatInteraction[]> {
  const completion = await queryCompletions(
    getPrompt(context, interactions),
    options
  );

  return completion
    .split("Human:")
    .map((interaction) => {
      const [question, reply] = interaction.split("AI:");

      return {
        question: question.trim(),
        reply: (reply || "").trim(),
      };
    })
    .filter((row) => row.question && row.reply);
}
