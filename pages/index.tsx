import React from 'react';
import { ConfigContainer } from '../components/ConfigContainer';
import RadialChart from '../components/RadialChart';
import styles from '../styles/commons.module.css';

export default function Home() {
  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      <div className={styles.menu}>
        <ConfigContainer showAxisSelection={false} makeIndicatorListClickable />
      </div>
      <RadialChart />
    </div>
  );
}
