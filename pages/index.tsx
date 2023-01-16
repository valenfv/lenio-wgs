import React from 'react';
import { styled } from '@mui/material/styles';
import ConfigContainer from '../components/ConfigContainer';
import DataVisContainer from '../components/DataVisContainer';
import { getProcessedDataSet, ProcessedDataSetT } from '../lib/getProcessedDataSet';

const StyledHeader = styled('div')({
  width: "100%",
  height: "95px",
  display: "flex",
  flex: 1,
  color: "white",
  justifyContent: "center",
  position: "relative",
  alignItems: "center",
  fontSize: "36px",
  lineHeight: "40px"
});

interface HomePropsT {
  dataSet: ProcessedDataSetT;
};

export default function Home(props: HomePropsT) {

  return (
    <div style={{ display: "flex", minHeight: "100px", overflow: "hidden", paddingTop: "40px" }}>
      <ConfigContainer />
      <DataVisContainer type='' />
    </div>
  )
}

export async function getStaticProps() {
  const dataSet = await getProcessedDataSet();
  return {
    props: {
      dataSet,
    }
  }
}
