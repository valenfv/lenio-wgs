import React from 'react';
import { styled } from '@mui/material/styles';
import { CountryPicker } from './CountryPicker';
import { useDispatch, useSelector } from 'react-redux';
import { changeComparingCountry } from '../slices/sidebarSlice';

const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '300px',
  minWidth: '300px',
  rowGap: '15px'
});

function ConfigContainer() {
  const comparingCountry = useSelector((state) => state.sidebar.comparingCountry);
  const dispatch = useDispatch();

  React.useEffect(() => {
    console.log({comparingCountry})
  }, [comparingCountry])

  return (
    <StyledContainer>
      <CountryPicker showCountries onChange={(value) => {
        dispatch(changeComparingCountry(value.code))
      }}/>
      <CountryPicker canBeNull showNeighboring showOrganizations showWorld showCountries={false}/>
    </StyledContainer>
  );
}

export { ConfigContainer };
