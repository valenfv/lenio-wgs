import React from 'react'
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import { Typography } from '@mui/material';
import TableBody, { tableBodyClasses } from '@mui/material/TableBody';
import TableCell, { tableCellClasses, TableCellProps } from '@mui/material/TableCell';
import TableHead, { tableHeadClasses } from '@mui/material/TableHead';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';

interface Cell {
  align?: string;
}

const StyledTableCell = styled(TableCell)<TableCellProps & Cell>(() => ({
  [`&.${tableCellClasses.head}`]: {
    color: 'rgba(238, 238, 238, 0.7)',
    fontSize: '16px',
    height: 30,
    padding: "1px 0 1px 15px",
    border: 'none',
    borderBottom: '1px solid rgba(238, 238, 238, 0.25)',
    borderTop: '1px solid rgba(238, 238, 238, 0.25)',
    position: 'sticky',
    top: '56.7px',
    background: 'linear-gradient(130deg, rgba(0,0,32), rgba(1,0,43) 70%)',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    color: '#DDDDDD',
    border: 'none',
    padding: "1px 0 1px 15px",
    height: 50,
    whiteSpace: 'nowrap',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  [`&.${tableRowClasses.root}:not(:last-child)`]: {
    '& td': {
      borderBottom: '1px solid rgba(238, 238, 238, 0.25)',
    }
  },
}));


const TitleContainer = styled('div')(() => ({
  padding: '1rem 15px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  boxSizing: 'border-box',
  background: 'linear-gradient(130deg, rgba(0,0,32), rgba(1,0,43) 70%)',
  position: 'sticky',
  top: 0,
}))

const TableTitle: React.FC = () => {
  return (
    <TitleContainer>
      <Image
        style={{ color: 'white' }}
        src='/lenio-wgs/bars-icon.svg'
        alt='indicators table icon'
        width="20"
        height="20"
      />
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 500,
          textAlign: 'left',
          color: '#EEEEEE',
          marginLeft: '10px',
        }}
        variant="h4"
      >
        Key Indicators
      </Typography>
    </TitleContainer>
  )
}

interface DeltaProps {
  up?: boolean;
}

const Delta: React.FC<DeltaProps> = ({ up }) => {
  return (
    <span style={{ color: up ? '#45F9E0CC' : '#DE3108CC' }}>
      {up ? '▲' : '▼'}
    </span>
  )
}

const TableContainer = styled('div')(() => ({
  height: 500,
  overflowY: 'auto',
  border: '1px solid rgba(238, 238, 238, 0.25)',
  width: '366px',
  "::-webkit-scrollbar": {
    width: "5px",
    height: '10px'
  },
  "::-webkit-scrollbar-track": {
    background: 'linear-gradient(130deg, rgba(0,0,32), rgba(1,0,43) 70%)',
  },
  "::-webkit-scrollbar-thumb": {
    background: 'rgba(217, 217, 217, 0.5)',
    borderRadius: "15px",
  },
  "::-webkit-scrollbar-thumb:hover": {
    background: 'rgba(217, 217, 217, 0.9)',
  },
}))

const IndicatorsTable: React.FC = () => {
  return (
    <TableContainer>
      <TableTitle />
      <Table sx={{ width: '100%', borderCollapse: 'separate' }}>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="left">KPI</StyledTableCell>
            <StyledTableCell align="left">Ranking</StyledTableCell>
            <StyledTableCell align="left">Value</StyledTableCell>
            <StyledTableCell align="left" >Delta</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell align="left">GINI Index</StyledTableCell>
            <StyledTableCell align="left">50th</StyledTableCell>
            <StyledTableCell align="left">41.5</StyledTableCell>
            <StyledTableCell align="left"><Delta up /> 0.7</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell align="left">HDI Index</StyledTableCell>
            <StyledTableCell align="left">21st</StyledTableCell>
            <StyledTableCell align="left">0.926</StyledTableCell>
            <StyledTableCell align="left"><Delta up />0.7</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell align="left">GDP</StyledTableCell>
            <StyledTableCell align="left">1st</StyledTableCell>
            <StyledTableCell align="left">$23T</StyledTableCell>
            <StyledTableCell align="left"><Delta up /> 1.1</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell align="left">Unemployment</StyledTableCell>
            <StyledTableCell align="left">12th</StyledTableCell>
            <StyledTableCell align="left">3.5%</StyledTableCell>
            <StyledTableCell align="left"><Delta />1.1</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell align="left">Extreme Poverty</StyledTableCell>
            <StyledTableCell align="left">14th</StyledTableCell>
            <StyledTableCell align="left">3.3%</StyledTableCell>
            <StyledTableCell align="left"><Delta up />1.5</StyledTableCell>
          </StyledTableRow>

          <StyledTableRow>
            <StyledTableCell align="left">Military Expendidure</StyledTableCell>
            <StyledTableCell align="left">14th</StyledTableCell>
            <StyledTableCell align="left">3.3%</StyledTableCell>
            <StyledTableCell align="left"><Delta up />1.5</StyledTableCell>
          </StyledTableRow>

          <StyledTableRow>
            <StyledTableCell align="left">Health Expendidure</StyledTableCell>
            <StyledTableCell align="left">14th</StyledTableCell>
            <StyledTableCell align="left">3.3%</StyledTableCell>
            <StyledTableCell align="left"><Delta />1.5</StyledTableCell>
          </StyledTableRow>

          <StyledTableRow>
            <StyledTableCell align="left">Happy Planet Index</StyledTableCell>
            <StyledTableCell align="left">14th</StyledTableCell>
            <StyledTableCell align="left">3.3%</StyledTableCell>
            <StyledTableCell align="left"><Delta /> 1.5</StyledTableCell>
          </StyledTableRow>

          <StyledTableRow>
            <StyledTableCell align="left">Maternal Mortality</StyledTableCell>
            <StyledTableCell align="left">14th</StyledTableCell>
            <StyledTableCell align="left">3.3%</StyledTableCell>
            <StyledTableCell align="left"><Delta />1.5</StyledTableCell>
          </StyledTableRow>

          <StyledTableRow>
            <StyledTableCell align="left">Political Rights Score</StyledTableCell>
            <StyledTableCell align="left">14th</StyledTableCell>
            <StyledTableCell align="left">3.3%</StyledTableCell>
            <StyledTableCell align="left"><Delta up />1.5</StyledTableCell>
          </StyledTableRow>

          <StyledTableRow>
            <StyledTableCell align="left">Regulatory Quality</StyledTableCell>
            <StyledTableCell align="left">14th</StyledTableCell>
            <StyledTableCell align="left">3.3%</StyledTableCell>
            <StyledTableCell align="left"><Delta />1.5</StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default IndicatorsTable