import React from 'react';
import { ConfigContainer } from '../components/ConfigContainer';
import DataVisContainer from '../components/DataVisContainer';
import RadialChart from '../components/RadialChart';
import styles from '../styles/commons.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <ConfigContainer showAxisSelection={false} makeIndicatorListClickable />
      </div>
      <DataVisContainer>
        <RadialChart />
      </DataVisContainer>
    </div>
  );
}
