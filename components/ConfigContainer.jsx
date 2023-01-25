import React from 'react';
import IndicatorsTable from './Indicators/IndicatorsTable';
import { styled } from '@mui/material/styles';
import { CountryPicker } from './CountryPicker';
import { useDispatch, useSelector } from 'react-redux';
import { changeComparingCountry, changeSelectedCountry, changeAxis } from '../slices/sidebarSlice';
const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  rowGap: '15px'
});

function ConfigContainer() {
  const {
    comparingCountry,
    selectedCountry
  } = useSelector((state) => ({
    comparingCountry: state.sidebar.comparingCountry,
    selectedCountry: state.sidebar.selectedCountry,
  }));
  const dispatch = useDispatch();
  return (
    <StyledContainer>
      <CountryPicker 
        showCountries
        showWorld={false} 
        onChange={(value) => dispatch(changeComparingCountry(value))}
      />
      <CountryPicker
        canBeNull={false}
        showNeighboring
        showOrganizations
        showWorld
        showCountries={false}
        defaultCode="WORLD"
        onChange={(value) => {
          dispatch(changeSelectedCountry(value));
        }}
      />
      <IndicatorsTable 
        onIndicatorAxisChange={(indicators) => dispatch(changeAxis(indicators))} 
      />
    </StyledContainer>
  );
}

export { ConfigContainer };
