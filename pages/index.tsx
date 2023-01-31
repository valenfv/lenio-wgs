import React from 'react';
import { useSelector } from 'react-redux';
import { ConfigContainer } from '../components/ConfigContainer';
import RadialChart from '../components/RadialChart';
import styles from '../styles/commons.module.css';
import { Loading } from '../components/Loading';

export default function Home() {
  const loading = useSelector((state) => state.radialChart.loading);
  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      <div className={styles.menu}>
        <ConfigContainer showAxisSelection={false} makeIndicatorListClickable />
      </div>
      <Loading loading={loading} />
      <RadialChart />
    </div>
  );
}
