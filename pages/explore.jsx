import React from 'react';
import styles from '../styles/explore.module.css';
import { ConfigContainer } from '../components/ConfigContainer';
import { useScatterPlot, generateData } from '../lib/useScatterPlot';
import DataVisContainer from '../components/DataVisContainer';

export default function World() {
  const svgRef = React.useRef(null);
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
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

    const data = generateData(indicatorX, indicatorY);

    const highlights = data.find(c => c.isoCc === 'ARG').neighboring;

    setData({
      comparing: 'ARG',
      indicatorX,
      indicatorY,
      highlights,
      data,
    })
  }, []);

  useScatterPlot(svgRef, data)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <ConfigContainer />
      </div>
      <DataVisContainer>
        <div ref={svgRef} className={styles.chart} />
      </DataVisContainer>
    </div>
  );
}
