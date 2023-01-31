import { getPrompt, queryCompletionsChat } from "./completions";
import { promptTemplate } from "./template";
import { IDataset, IGPTResponse } from "./types";

function stringifyData(data: IDataset) {
  const header =
    Object.keys(data[0]).reduce((lr, l) => {
      return lr + "\t" + l;
    }, "") + "\n";

  return data.reduce((r, row) => {
    return (
      r +
      Object.keys(row).reduce((lr, l) => {
        return lr + "\t" + row[l];
      }, "") +
      "\n"
    );
  }, header);
}

export function generatePrompt(dataset: IDataset) {
  return getPrompt(promptTemplate, [
    {
      question: `
This is the dataset:

${stringifyData(dataset)}
`,
    },
  ]);
}

export async function generateInsight(
  dataset: IDataset,
  apikey: string
): Promise<{ reply: IGPTResponse; response: string }> {
  const response = await queryCompletionsChat(
    promptTemplate,
    [
      {
        question: `
  This is the dataset:

  ${stringifyData(dataset.slice(0, 10))}
          `,
      },
    ],
    { apikey }
  );

  return {
    response: response?.[0].reply || "",
    reply: JSON.parse(response?.[0].reply || "") as IGPTResponse,
  };
}
