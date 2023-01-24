import React from 'react';
import styles from '../styles/explore.module.css';
import commonStyles from '../styles/commons.module.css';
import { ConfigContainer } from '../components/ConfigContainer';
import { useScatterPlot } from '../lib/useScatterPlot';
import DataVisContainer from '../components/DataVisContainer';
import { useDispatch, useSelector } from 'react-redux';
import { NEIGHBORS, ORGANIZATION, WORLD, COUNTRY } from '../components/CountryPicker';
import bordering from '../data/bordering_countries.json';
import organizations from '../data/organizations.json';
import { fetchExploreData } from '../slices/exploreSlice';

export default function World() {
  const svgRef = React.useRef(null);

  const { 
    comparingCountry,
    selectedCountry,
    data
  } = useSelector((state) => ({
    comparingCountry: state.sidebar.comparingCountry,
    selectedCountry: state.sidebar.selectedCountry,
    data: state.explore.data,
  }));

  const dispatch = useDispatch();

  const { indicatorX, indicatorY } = React.useMemo(() => {
    const indicatorX = {
        id: 'c8316e0c7c1dca5df2a7fa9c63297c9d772b33c10d812ece07a1ad4ad2df650a',
        indicator_name: 'PERCENTAGE OF POPULATION IN EXTREME POVERTY',
        min: 0,
        max: 100,
    };
    const indicatorY = {
        id: 'e04d546d273c7f54c904d2dc81871af194740b45802e6364046292d242e0c0c2',
        indicator_name: 'CO2E EMISSIONS PER CAPITA',
        min: 200,
        max: 1500,
    }
    return { indicatorX, indicatorY };
  }, []);


  const highlights = React.useMemo(() => {
    if(selectedCountry?.code === NEIGHBORS){
      return bordering[comparingCountry?.code];
    }else if(selectedCountry?.code === WORLD || selectedCountry?.code === COUNTRY){
      return null;
    }else if(selectedCountry?.group === ORGANIZATION){
      return organizations?.[selectedCountry?.code];
    }
  }, [comparingCountry, selectedCountry]);

  React.useEffect(() => {

    // const data = generateData(indicatorX, indicatorY);

    // const highlights = data.find(c => c.isoCc === 'ARG').neighboring;

    // setData({
    //   comparing: 'ARG',
    //   indicatorX,
    //   indicatorY,
    //   highlights,
    //   data,
    // })

    dispatch(fetchExploreData({indicatorX, indicatorY}));
  }, [indicatorX, indicatorY]);



  useScatterPlot({svgRef, data, highlights, indicatorX, indicatorY, comparingCountry})

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.menu}>
        <ConfigContainer />
      </div>
      <DataVisContainer>
        <div ref={svgRef} className={styles.chart} />
      </DataVisContainer>
    </div>
  );
}
