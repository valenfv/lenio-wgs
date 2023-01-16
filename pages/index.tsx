import React from 'react';
import ConfigContainer from '../components/ConfigContainer';
import DataVisContainer from '../components/DataVisContainer';

export default function Home() {
  return (
    <div style={{
      display: 'flex', minHeight: '100px', overflow: 'hidden', paddingTop: '40px',
    }}
    >
      <ConfigContainer />
      <DataVisContainer type="" />
    </div>

  );
}
