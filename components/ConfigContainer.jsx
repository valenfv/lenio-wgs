import React from 'react';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import IndicatorsTable from './Indicators/IndicatorsTable';
import { CountryPicker } from './CountryPicker';
import { changeComparingCountry, changeSelectedCountry, changeAxis } from '../slices/sidebarSlice';

const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  rowGap: '15px',
});

function ConfigContainer({
  showAxisSelection,
  makeIndicatorListClickable,
}) {
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
        // eslint-disable-next-line max-len
        onIndicatorAxisChange={showAxisSelection && ((indicators) => dispatch(changeAxis(indicators)))}
        showIndicationSelection={makeIndicatorListClickable}
      />
    </StyledContainer>
  );
}

export { ConfigContainer };
