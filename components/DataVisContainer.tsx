import { styled } from '@mui/material/styles';
import DynamicComponentWithNoSSR from './DynamicComponentWithNoSSR';

const StyledContainer = styled('div')({
  display: "flex",
  width: "calc(100% - 360px)",
});

interface DataVisContainerPropsT {
  type: string;
};

const DataVisContainer = (props: DataVisContainerPropsT) => {
  return (
    <StyledContainer>
      <DynamicComponentWithNoSSR />
    </StyledContainer>
  )
}

export default DataVisContainer;