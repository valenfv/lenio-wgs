import { CircularProgress } from '@mui/material';
import React from 'react';

export function Loading({ loading = false }) {
  return (
    loading && (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backdropFilter: 'blur(6px)',
    }}
    >
      <CircularProgress />
    </div>
    )
  );
}
