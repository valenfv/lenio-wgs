import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { store } from '../store';
import '../styles/main.css';

// import ConfigContainer from '../components/ConfigContainer';
// import DataVisContainer from '../components/DataVisContainer';

const StyledHeader = styled('header')({
  width: '100%',
  '& > div': {
    display: 'flex',
    flex: 1,
    color: 'white',
    justifyContent: 'flex-start',
    position: 'relative',
    alignItems: 'center',
    fontSize: '28px',
    lineHeight: '40px',
    margin: '0 auto',

    '&:first-child': {
      margin: '0 auto',
      height: '95px',
    },
    '&:last-child': {
      height: '40px',
    },
  },
});

const StyledButton = styled(Button)({
  height: '51px',
  width: 'auto',
  border: '1px solid #191935',
  color: '#fff',
  textTransform: 'capitalize',
});

interface NavButtonProps {
  text: string;
  selected: boolean;
  onClick: () => void;
}

const charts = [
  {
    chartType: 'pie',
    href: '/',
    text: 'Overview',
  },
  {
    chartType: 'line',
    href: '/explore',
    text: 'Compare',
  },
  {
    chartType: 'globe',
    href: '/world',
    text: 'Explore',
  },
];

function NavButton({ text, selected, onClick }: NavButtonProps) {
  return (
    <StyledButton
      variant="outlined"
      style={{
        background: selected ? '#191935' : '#000020',
        opacity: selected ? 1 : 0.7,
      }}
      onClick={onClick}
    >
      {text}
    </StyledButton>
  );
}

const NavButtonsContainer = styled('div')(() => ({
  marginRight: '25px',
  marginLeft: 'auto',
  '& button': {
    borderRadius: 0,
  },
  '& button:first-child': {
    borderRadius: '4px 0 0 4px',
  },
  '& button:last-child': {
    borderRadius: '0 4px 4px 0',
  },
}));

export default function App({ Component, pageProps }: AppProps) {
  const [currentChart, setCurrentChart] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const selectedPath = charts.find((chart) => chart.href === `/${window.location.pathname.split('/').pop()}`);
    if (selectedPath) {
      setCurrentChart(selectedPath.chartType);
    } else {
      setCurrentChart('pie');
    }
  }, []);

  return (
    <Provider store={store}>
      <StyledHeader>
        <div>
          <Image
            src="/header-logo1.png"
            height={48}
            width={200}
            alt="Logo Image"
            style={{
              marginLeft: '25px',
            }}
          />
          <div
            style={{
              color: 'rgba(238, 238, 238, 0.5)',
              margin: '0 auto',
            }}
          >
            « Dashboard of the Present Future »
          </div>
        </div>
        <div>
          <NavButtonsContainer>
            {charts.map((props) => (
              <NavButton
                key={props.href}
                onClick={() => {
                  setCurrentChart(props.chartType);
                  router.push(props.href);
                }}
                selected={currentChart === props.chartType}
                text={props.text}
              />
            ))}

          </NavButtonsContainer>
        </div>
      </StyledHeader>
      <main style={{ padding: '0 50px 50px 25px' }}>
        <Component {...pageProps} />
      </main>
    </Provider>
  );
}
