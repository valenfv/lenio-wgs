import React from 'react'
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import { Menu, MenuItem, Typography } from '@mui/material';
import TableBody, { tableBodyClasses } from '@mui/material/TableBody';
import TableCell, { tableCellClasses, TableCellProps } from '@mui/material/TableCell';
import TableHead, { tableHeadClasses } from '@mui/material/TableHead';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import { AxisLeftButton } from './AxisLeftButton';
import indicators from '../../data/indicators.json';
import { AxisBottomButton } from './AxisBottomButton';
import { AddAxisButton } from './AddAxisButton';


interface Cell {
  align?: string;
}

const StyledTableCell = styled(TableCell)<TableCellProps & Cell>(() => ({
  [`&.${tableCellClasses.head}`]: {
    color: 'rgba(238, 238, 238, 0.7)',
    fontSize: '14px',
    height: 30,
    padding: "1px 15px 1px 15px",
    border: 'none',
    borderBottom: '1px solid rgba(238, 238, 238, 0.25)',
    borderTop: '1px solid rgba(238, 238, 238, 0.25)',
    position: 'sticky',
    zIndex: '100',
    top: '56.7px',
    background: 'linear-gradient(130deg, rgba(0,0,32), rgba(1,0,43) 70%)',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '12px',
    color: '#DDDDDD',
    border: 'none',
    padding: "1px 0 0 15px",
    height: 50,
    //whiteSpace: 'nowrap',
    overflowWrap: 'break-word',
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
  zIndex: '100',
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
  children: React.ReactNode;
}

const Delta: React.FC<DeltaProps> = ({ up, children }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ color: up ? '#45F9E0CC' : '#DE3108CC' }}>
        {up ? '▲' : '▼'}
      </span>
      <span>{children}</span>
    </div>

  )
}

const TableContainer = styled('div')(() => ({
  height: 500,
  overflowY: 'auto',
  border: '1px solid rgba(238, 238, 238, 0.25)',
  boxSizing:'border-box',
  "::-webkit-scrollbar": {
    width: "2px",
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


const useAxisChange = (onIndicatorAxisChange) => {
  const [{ x: selectedX, y: selectedY }, setAxis] = React.useState({
    x: 'abf6788a66fbe940547ee9c108535f0be5b0eacbd2bec3796634f90a742202cd', // gini
    y: '80c1e29026bae838ab3275c67aed5010b25cc6c12cc109a75a4695a9c9735c56', // happy planet index
  });

  const renderAxisSelectionButton = React.useCallback((indicatorId) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleManuItemClick = (type) => {
      if(type === 'x'){
        setAxis(prev => {
          if(prev.y === indicatorId){
            onIndicatorAxisChange({ y: prev.x, x: prev.y});
            return { y: prev.x, x: prev.y}
          }else{
            onIndicatorAxisChange({ ...prev, x: indicatorId });
            return { ...prev, x: indicatorId };
          }
        })
        handleClose();
      }else if(type === 'y'){
        setAxis(prev => {
          if(prev.x === indicatorId){
            onIndicatorAxisChange({ y: prev.x, x: prev.y});
            return { y: prev.x, x: prev.y}
          }else{
            onIndicatorAxisChange({ ...prev, y: indicatorId });
            return { ...prev, y: indicatorId };
          }
        })
        handleClose();
      }
    }
    return (
      <>
        {(indicatorId === selectedX) && <AxisBottomButton onClick={handleClick}/>}
        {(indicatorId === selectedY) && <AxisLeftButton  onClick={handleClick}/>}
        {(indicatorId !== selectedX && indicatorId !== selectedY) && <AddAxisButton onClick={handleClick}/>}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {(indicatorId !== selectedX) && <MenuItem onClick={() => handleManuItemClick('x')}>Add to X axis</MenuItem>}
          {(indicatorId !== selectedY) && <MenuItem onClick={() => handleManuItemClick('y')}>Add to Y axis</MenuItem>}
        </Menu>
      </>
    );
  }, [selectedX, selectedY]);


  return { renderAxisSelectionButton };
};

const IndicatorsTable = ({
  onIndicatorChange = () => null,
  onIndicatorAxisChange = () => null,
}) => {
  const { renderAxisSelectionButton } = useAxisChange(onIndicatorAxisChange);
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
          {
            Object.keys(indicators).map(indicator => (
              <StyledTableRow key={indicator}>
                <StyledTableCell align="left">{indicators[indicator].indicator_name} {renderAxisSelectionButton(indicator)}</StyledTableCell>
                <StyledTableCell align="left">50th</StyledTableCell>
                <StyledTableCell align="left">41.5</StyledTableCell>
                <StyledTableCell align="left"><Delta up> 0.7</Delta></StyledTableCell>
              </StyledTableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer >
  )
}

export default IndicatorsTable