import React from 'react';
import { styled } from '@mui/material/styles';

const StyledContainer = styled('div')({
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  width: '100%',
  background: '#000020',
  border: '1px solid rgba(238, 238, 238, 0.2)',
  marginLeft: '20px',
  maxHeight: '80vh',
});

interface DataVisContainerPropsT {
  // eslint-disable-next-line no-undef
  children: JSX.Element
}

function DataVisContainer(props: DataVisContainerPropsT) {
  const { children } = props;
  return (
    <StyledContainer>
      {children}
    </StyledContainer>
  );
}

export default DataVisContainer;
