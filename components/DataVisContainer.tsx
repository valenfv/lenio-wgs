import { styled } from '@mui/material/styles';

const StyledContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  width: 'calc(100% - 315px)',
  background: '#000020',
  border: '1px solid rgba(238, 238, 238, 0.2)',
});

interface DataVisContainerPropsT {
  children: JSX.Element
}

function DataVisContainer(props: DataVisContainerPropsT) {
  const { children } = props;
  return (
    <StyledContainer>
      {children}
    </StyledContainer>);
}

export default DataVisContainer;
