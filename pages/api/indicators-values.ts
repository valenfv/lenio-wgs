/* eslint-disable no-case-declarations */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from 'next';
import { CountriesDataKeys, IndicatorsKeys, IndicatorValue } from '../../interfaces';
import { getIndicatorValue } from '../../utils/rankingUtils';
import iso_countries from '../../data/iso_country.json';
import indicators_data from '../../data/indicators.json';

function getIndicatorsValues(indicators: Array<IndicatorsKeys>): Array<IndicatorValue> {
  const indicatorsValues: Array<IndicatorValue> = [];

  const countries = Object.keys(iso_countries) as Array<CountriesDataKeys>;

  countries.forEach((iso_country_code: CountriesDataKeys) => {
    const indicatorValue: any = {
      country: iso_country_code,
    };
    indicators.forEach((indicator_key: IndicatorsKeys) => {
      const indicatorValueData = getIndicatorValue(iso_country_code, indicator_key);
      if (indicatorValueData?.value) {
        indicatorValue[indicator_key] = {
          value: indicatorValueData.value,
          higher_is_better: indicators_data[indicator_key].higher_is_better,
        };
      }
    });

    indicatorsValues.push(indicatorValue);
  });

  return indicatorsValues;
}

export default function indicatorsValuesHandler(req: NextApiRequest, res: NextApiResponse<Array<IndicatorValue>>) {
  const { body, method } = req;
  const selected_indicators = body.indicators;
  switch (method) {
    case 'POST':
      if (!selected_indicators?.length) {
        res.status(403).end('Wrong format');
        break;
      }
      const indicatorsValues = getIndicatorsValues(selected_indicators);
      res.status(200).json(indicatorsValues);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
