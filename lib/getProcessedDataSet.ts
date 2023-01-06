import { getDataSet } from "./getDataSet";
import { getIndicatorsBoundaries, IndicatorBoundariesT, IndicatorBoundaryT } from "./getIndicatorsBoundaries";

export interface CountryMetricsT {
    [metric: string]: {
        [year: string]: string;
    }
}

export interface ProcessedDataSetT {
    [ISOCC: string]: {
        countryName: string;
        metrics: CountryMetricsT;
    }
}

const getCountryMetrics = (countryData: string[], indicatorsBoundaries: IndicatorBoundariesT, years: string[]) : CountryMetricsT => {
    
    const getCountryDataByMetric = (countryData: string[], boundary: IndicatorBoundaryT, years: string[]) => {
        let metricDataByYear = {};
        for(let i = boundary.leftBoundary; i <= boundary.rightBoundary; i++){
            const year = years[i];
            metricDataByYear = {
                ...metricDataByYear,
                [year]: countryData[i],
            }
        }
        return metricDataByYear;
    }

    const countryMetricsReducer = (prevMetrics: CountryMetricsT, currMetric: string): CountryMetricsT => {
        return {
            ...prevMetrics,
            [currMetric]: {
                ...getCountryDataByMetric(countryData, indicatorsBoundaries[currMetric], years),
            }
        }
    }
    return Object.keys(indicatorsBoundaries).reduce(countryMetricsReducer, {} as CountryMetricsT);
}

export const getProcessedDataSet = async (): Promise<ProcessedDataSetT> => {
    const dataSet = await getDataSet();
    const indicatorsBoundaries = getIndicatorsBoundaries(dataSet[0]);
    const years = dataSet[4];
    const processedDataSet: ProcessedDataSetT = {};

    const processorReducer = (prevData: ProcessedDataSetT, currCountry: string[]):  ProcessedDataSetT => {
        const countryData = {
            ISOCC: currCountry[1],
            countryName: currCountry[0],
        }
        const proccessedOutput = {
            ...prevData,
            [countryData.ISOCC]: {
                countryName: countryData.countryName,
                metrics: {
                    ...getCountryMetrics(currCountry, indicatorsBoundaries, years)
                }
            }
        }
        return proccessedOutput;
    };

    // go through every country
    return dataSet.slice(6, 179).reduce(processorReducer, processedDataSet);
};


