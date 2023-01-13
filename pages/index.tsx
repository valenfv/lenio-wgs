import React, { useState } from 'react'
import Head from 'next/head'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ConfigContainer from '../components/ConfigContainer';
import DataVisContainer from '../components/DataVisContainer';
import { getProcessedDataSet, ProcessedDataSetT } from '../lib/getProcessedDataSet';
import Image from 'next/image';

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

const StyledButton = styled(Button)({
  height: "64px",
  width: "75px",
  border: "1px solid #191935",
});

interface HomePropsT {
  dataSet: ProcessedDataSetT;
};

interface NavButtonPropsT {
  selectedType: string
};

export default function Home(props: HomePropsT) {
  const [dataVisType, setDataVisType] = useState('');

  const handleClick = (chart: string) => {
    setDataVisType(chart)
  };

  const NavButton = (props: NavButtonPropsT) => {
    const { selectedType } = props;
    return (
      <StyledButton
        variant="outlined"
        onClick={() => handleClick(selectedType)}
        style={{
          background: dataVisType === selectedType ? "#191935" : "#000020"
        }}
      >
        <Image
          src={`/lenio-wgs/button_icons/${selectedType}.png`}
          width={30}
          height={30}
          alt="Pie Chart Icon"
        />
      </StyledButton>
    )
  };

  return (
    <>
      <Head>
        <title>WGS - Leniolabs</title>
      </Head>
      <main style={{ padding: "0 50px 50px 50px" }}>
        <StyledHeader>
          <Image
            src="/lenio-wgs/header-logo1.png"
            height={60}
            width={250}
            alt="Logo Image"
            style={{
              marginRight: "auto",
            }}
          />
          <div style={{ color: "rgba(238, 238, 238, 0.5)" }}>
            Dashboard of the Present Future
          </div>
          <div
            style={{
              marginLeft: "auto",
            }}
          >
            <NavButton selectedType="pie"/>
            <NavButton selectedType="line"/>
            <NavButton selectedType="globe"/>
          </div>
        </StyledHeader>
        <div style={{ display: "flex", minHeight: "100px", overflow: "hidden", paddingTop: "40px" }}>
          <ConfigContainer/>
          <DataVisContainer type={dataVisType}/>
        </div>
      </main>
    </>
  )
}

export async function getStaticProps(){
  const dataSet = await getProcessedDataSet();
  return {
    props: {
      dataSet,
    }
  }
}
