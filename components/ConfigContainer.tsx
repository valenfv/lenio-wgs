import { styled } from '@mui/material/styles';

const StyledContainer = styled('div')({
  display: "flex",
  flexDirection: "column",
  width: "30%",
  minWidth: "360px",
});

const ConfigContainer = () => {
    return (
      <StyledContainer></StyledContainer>
    )
};

export default ConfigContainer;