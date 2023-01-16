import React from 'react';
import {
  Html, Head, Main, NextScript,
} from 'next/document';

export default function Document() {
  return (
    <Html
      style={{
        height: '100vh',
        background: 'linear-gradient(130deg, rgba(0,0,32), rgba(1,0,43) 70%)',
      }}
      lang="en"
    >
      <Head />
      <body style={{
        boxSizing: 'border-box',
      }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
