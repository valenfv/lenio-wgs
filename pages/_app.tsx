import type { AppProps } from 'next/app';

import React, { useState } from 'react';
import Head from 'next/head';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Image from 'next/image';
// import ConfigContainer from '../components/ConfigContainer';
// import DataVisContainer from '../components/DataVisContainer';

const StyledHeader = styled('div')({
  width: '100%',
  height: '95px',
  display: 'flex',
  flex: 1,
  color: 'white',
  justifyContent: 'center',
  position: 'relative',
  alignItems: 'center',
  fontSize: '28px',
  lineHeight: '40px',
  maxWidth: 1280,
  margin: '0 auto'
});

const StyledButton = styled(Button)({
  height: '51px',
  width: '60px',
  border: '1px solid #191935',
});

interface NavButtonPropsT {
  navType: string;
  selected: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (type: string) => void,
}

function NavButton(props: NavButtonPropsT) {
  const { navType, selected, onClick } = props;
  return (
    <StyledButton
      variant="outlined"
      onClick={() => onClick(navType)}
      style={{
        background: selected === navType ? '#191935' : '#000020',
      }}
    >
      <Image
        src={`/lenio-wgs/button_icons/${navType}.png`}
        width={30}
        height={30}
        alt="Pie Chart Icon"
      />
    </StyledButton>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const [dataVisType, setDataVisType] = useState('');

  return (
    <>
      <Head>
        <title>WGS - Leniolabs</title>
      </Head>
      <main style={{ padding: '0 50px 50px 50px' }}>
        <StyledHeader>
          <Image
            src="/lenio-wgs/header-logo1.png"
            height={48}
            width={200}
            alt="Logo Image"
            style={{
              marginRight: 'auto',
            }}
          />
          <div style={{ color: 'rgba(238, 238, 238, 0.5)' }}>
            Dashboard of the Present Future
          </div>
          <div
            style={{
              marginLeft: 'auto',
            }}
          >
            <NavButton selected={dataVisType} onClick={setDataVisType} navType="pie" />
            <NavButton selected={dataVisType} onClick={setDataVisType} navType="line" />
            <NavButton selected={dataVisType} onClick={setDataVisType} navType="globe" />
          </div>
        </StyledHeader>
        <Component {...pageProps} />
      </main>
    </>
  );
}
