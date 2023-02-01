import { getPrompt, queryCompletionsChat } from './completions';
import { promptTemplate } from './template';
import { IDataset, IGPTResponse } from './types';

function stringifyData(data: IDataset) {
  const header = `${Object.keys(data[0]).reduce((lr, l) => `${lr}\t${l}`, '')}\n`;

  return data.reduce((r, row) => (
    `${r
      + Object.keys(row).reduce((lr, l) => `${lr}\t${row[l]}`, '')
    }\n`
  ), header);
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
  comparingCountry: string,
  selectedOrg: string,
  indicator: string,
  apikey: string,
): Promise<{ reply: IGPTResponse; response: string }> {
  const response = await queryCompletionsChat(
    promptTemplate,
    [
      {
        question: `
  This dataset compares the country of ${comparingCountry} against the members of the ${selectedOrg} taking into account the values the metric called "${indicator}".
  This is the dataset:

  ${stringifyData(dataset)}
          `,
      },
    ],
    { apikey },
  );

  return {
    response: response?.[0].reply || '',
    reply: JSON.parse(response?.[0].reply || '') as IGPTResponse,
  };
}
