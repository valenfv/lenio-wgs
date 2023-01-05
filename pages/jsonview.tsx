import Head from 'next/head'
import React from 'react'
import { getProcessedDataSet } from '../lib/getProcessedDataSet';
import { JsonViewer } from '@textea/json-viewer'


export default function JsonView(props: any) {

  return (
    <>
      <Head>
        <title>WGS - Leniolabs</title>
      </Head>
      <main>
        <JsonViewer defaultInspectDepth={1} value={props.processedData}/>
      </main>
    </>
  )
}

export async function getStaticProps(){
  const processedData = await getProcessedDataSet();
  return {
    props: {
      processedData,
    }
  }
}
