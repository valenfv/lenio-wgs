export interface IndicatorBoundaryT {
    leftBoundary: number;
    rightBoundary: number;
};

export interface IndicatorBoundariesT {
    [indicator: string]: IndicatorBoundaryT;
};

export const getIndicatorsBoundaries = (indicators: string[]): IndicatorBoundariesT => {
    const indicatorsBoundaries: IndicatorBoundariesT = {};

    let lastIndicator = '';
    indicatorsBoundaries[lastIndicator] = {
        leftBoundary: -1,
        rightBoundary: -1
    };
    indicators.forEach((indicator: string, currentIndex: number, indicators: string[]) => {
        if(indicator !== lastIndicator && indicator !== ''){
            if(!indicatorsBoundaries[indicator]) {
                indicatorsBoundaries[indicator] = {
                    leftBoundary: -1,
                    rightBoundary: -1
                };
            }
            indicatorsBoundaries[indicator].leftBoundary = currentIndex;
            indicatorsBoundaries[lastIndicator].rightBoundary = currentIndex - 1;
            lastIndicator = indicator;
        }
        if(indicators.length - 1 === currentIndex){
            indicatorsBoundaries[lastIndicator].rightBoundary = currentIndex;
        }
    });
    delete indicatorsBoundaries[''];
    delete indicatorsBoundaries['indicator'];
    delete indicatorsBoundaries['ISO Country code'];
    return indicatorsBoundaries;
};