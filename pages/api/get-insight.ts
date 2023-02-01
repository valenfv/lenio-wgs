/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */
/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateInsight } from '../../openai';
import { IGPTResponse } from '../../openai/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGPTResponse>,
) {
  const {
    dataset, key,
    comparingCountry,
    selectedOrg,
    indicator,
  } = req.body;
  // checking if insight is already in the cloud storage
  // @ts-ignore
  const insightExists = await fetch(
    `https://kzkgagh296.execute-api.us-east-1.amazonaws.com/prod/designs/${key}-test1`,
  )
    .then((reply) => reply.json())
    .catch(() => false);

  if (insightExists) {
    return res.status(200).send({ description: insightExists.design });
  }

  const insight = await generateInsight(
    dataset,
    comparingCountry,
    selectedOrg,
    indicator,
    process.env.OPENAI_API_KEY || '',
  );

  // saving new insight to cloud storage
  await fetch(
    'https://kzkgagh296.execute-api.us-east-1.amazonaws.com/prod/designs',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `${key}-test1`,
        design: insight.reply.description,
      }),
    },
  );

  res.status(200).send(insight.reply);
}
