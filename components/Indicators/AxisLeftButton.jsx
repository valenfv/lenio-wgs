import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

export function AxisLeftButton(props) {
  return (
    <Tooltip title="Y Axis">
      <IconButton {...props}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="15" y1="13" y2="13" stroke="white" strokeOpacity="0.5" strokeWidth="4" />
          <line x1="13" y1="15" x2="13" stroke="white" strokeWidth="4" />
        </svg>
      </IconButton>
    </Tooltip>
  );
}
