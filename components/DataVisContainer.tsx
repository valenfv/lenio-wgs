import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';

const StyledContainer = styled('div')({
  display: 'flex',
  width: 'calc(100% - 360px)',
  background: '#000020',
  border: '1px solid rgba(238, 238, 238, 0.2)',
});

interface DataVisContainerPropsT {
  type: string;
  children: JSX.Element
}

function DataVisContainer(props: DataVisContainerPropsT) {
  return <StyledContainer>{props.children}</StyledContainer>;
}

export default DataVisContainer;
