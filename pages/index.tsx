import Head from 'next/head'
import React from 'react'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getProcessedDataSet, ProcessedDataSetT } from '../lib/getProcessedDataSet';
import Link from 'next/link';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
  dataSet: ProcessedDataSetT;
}

/*
  ISOCC   CountryName
    Metric
      Year    Value
      Year    Value
      Year    Value
  ISOCC   CountryName
    Metric
      Year    Value
      Year    Value
      Year    Value
*/

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
                <TableCell />
                <TableCell>ISO Country Code</TableCell>
                <TableCell>Country Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Object.keys(props.dataSet).map((isoCc: string, i: number) => {
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const [open, setOpen] = React.useState(false);
                  return (
                    <React.Fragment key={i}>
                      <StyledTableRow>
                        <StyledTableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                          >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </StyledTableCell>
                        <StyledTableCell>{isoCc}</StyledTableCell>
                        <StyledTableCell>{props.dataSet[isoCc].countryName}</StyledTableCell>
                      </StyledTableRow>
                      <TableRow>
                        <TableCell colSpan={3} style={{ paddingBottom: 0, paddingTop: 0 }}>
                          <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Typography variant="h6" gutterBottom component="div">
                                History
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Metric</TableCell>
                                    <TableCell align="left">Year</TableCell>
                                    <TableCell align="left">Value</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {
                                    Object.keys(props.dataSet[isoCc].metrics).map((metric) => 
                                      Object.keys(props.dataSet[isoCc].metrics[metric]).map((year, mi, years) => (
                                        mi === 0 ? 
                                          (
                                            <TableRow key={mi}>
                                              <TableCell rowSpan={years.length} style={{verticalAlign: 'top'}}><b>{metric}</b></TableCell>
                                              <TableCell>{year}</TableCell>
                                              <TableCell>{props.dataSet[isoCc].metrics[metric][year]}</TableCell>
                                            </TableRow>
                                          ):(
                                            <TableRow key={mi}>
                                              { // {mi === 1 && <TableCell rowSpan={years.length - 1}/>} 
                                              }
                                              <TableCell>{year}</TableCell>
                                              <TableCell>{props.dataSet[isoCc].metrics[metric][year]}</TableCell>
                                            </TableRow>
                                          )
                                        
                                      ))
                                    )
                                  }
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </>
  )
}

export async function getStaticProps(){
  const dataSet = await getProcessedDataSet();
  return {
    props: {
      dataSet,
    }
  }
}
