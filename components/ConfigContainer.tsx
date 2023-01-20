import React from 'react';
import { styled } from '@mui/material/styles';
import { CountryPicker } from './CountryPicker';

const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '300px',
  minWidth: '300px',
  rowGap: '15px'
});

function ConfigContainer() {
  return (
    <StyledContainer>
      <CountryPicker />
      <CountryPicker canBeNull/>
    </StyledContainer>
  );
}

export { ConfigContainer };
