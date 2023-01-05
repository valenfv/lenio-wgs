import Head from 'next/head'
import React from 'react'
import { getDataSet } from '../lib/getDataSet';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getProcessedDataSet } from '../lib/getProcessedDataSet';
import Link from 'next/link';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface HomePropsT {
  dataSet: any[];
}

export default function Home(props: HomePropsT) {
  return (
    <>
      <Head>
        <title>WGS - Leniolabs</title>
      </Head>
      <main>
        <Link href="/jsonview">
          See JSON view
        </Link>
        <TableContainer component={Paper} style={{height: '100vh'}}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {
                  props.dataSet?.[0] && props.dataSet[0].map((columnName: any, i: number) => (
                    <TableCell key={i}>{columnName}</TableCell>
                  ))
                }
              </TableRow>
              <TableRow>
                {
                  props.dataSet?.[4] && props.dataSet[4].map((columnName: any, i: number) => (
                    <TableCell style={{ top: 201 }} key={i}>{columnName}</TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
                {props.dataSet.slice(5).map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      {row.map((cell: any, ci: number) => (
                        <StyledTableCell key={ci}>{cell}</StyledTableCell>
                      ))}
                    </StyledTableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </>
  )
}

export async function getStaticProps(){
  const dataSet = await getDataSet();
  const pd = await getProcessedDataSet();
  return {
    props: {
      dataSet,
    }
  }
}
