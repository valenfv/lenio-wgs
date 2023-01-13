import { styled } from '@mui/material/styles';

const StyledContainer = styled('div')({
  display: "flex",
  width: "calc(100% - 360px)",
});

interface DataVisContainerPropsT {
  type: string;
};

const DataVisContainer = (props: DataVisContainerPropsT) => {
  return (
    <StyledContainer></StyledContainer>
  )
}

export default DataVisContainer;