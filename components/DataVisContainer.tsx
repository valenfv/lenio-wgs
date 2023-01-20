import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import RadialChart from './RadialChart';

const StyledContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  width: 'calc(100% - 360px)',
  background: '#000020',
  border: '1px solid rgba(238, 238, 238, 0.2)',
});

interface DataVisContainerPropsT {
  type: string;
  children: JSX.Element
}

function DataVisContainer(props: DataVisContainerPropsT) {
  const { type } = props;
  return (
  <StyledContainer>
    {type === 'pie' ? <RadialChart /> : null}
  </StyledContainer>);
}

export default DataVisContainer;
