import { styled } from '@mui/material/styles';
import IndicatorsTable from './IndicatorsTable';

const StyledContainer = styled('div')({
  display: "flex",
  flexDirection: "column",
  width: "30%",
  minWidth: "360px",
});

const ConfigContainer = () => {
  return (
    <StyledContainer>
      <IndicatorsTable />
    </StyledContainer>
  )
};

export default ConfigContainer;