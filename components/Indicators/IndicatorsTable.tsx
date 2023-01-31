/* eslint-disable max-len */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import { Menu, MenuItem, Typography } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses, TableCellProps } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow, { tableRowClasses, TableRowProps } from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { abbreviateNumber } from 'js-abbreviation-number';
import { AxisLeftButton } from './AxisLeftButton';
import indicators from '../../data/indicators.json';
import { AxisBottomButton } from './AxisBottomButton';
import { AddAxisButton } from './AddAxisButton';
import { changeSelectedIndicator } from '../../slices/sidebarSlice';
import { fetchDeltaData } from '../../slices/deltaSlice';
import { RootState } from '../../store';

interface Cell {
  align?: string;
}

const StyledTableCell = styled(TableCell)<TableCellProps & Cell>(() => ({
  [`&.${tableCellClasses.head}`]: {
    color: 'rgba(238, 238, 238, 0.7)',
    fontSize: '14px',
    height: 30,
    padding: '1px 15px 1px 15px',
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
    padding: '1px 0 0 15px',
    height: 50,
    // whiteSpace: 'nowrap',
    overflowWrap: 'break-word',
    position: 'relative',
  },
}));

// eslint-disable-next-line max-len
const StyledTableRow = styled(TableRow)<TableRowProps & { showIndicationSelection?: boolean }>((props) => ({
  [`&.${tableRowClasses.root}`]: {
    ...(props.showIndicationSelection
      ? {
        background: props.selected ? 'hsla(0, 0%, 100%, 15%)' : 'transparent',
        cursor: 'pointer',
      }
      : {}),
  },
  [`&.${tableRowClasses.root}:hover`]: {
    ...(props.showIndicationSelection && props.selected
      ? { backgroundColor: 'hsla(0, 0%, 100%, 15%)' }
      : { backgroundColor: 'rgba(25, 118, 210, 0.12)' }),
  },
  [`&.${tableRowClasses.root}:not(:last-child)`]: {
    '& td': {
      borderBottom: '1px solid rgba(238, 238, 238, 0.25)',
    },
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
}));

const Tooltip = styled('div')(({ showTooltip }: { showTooltip: boolean }) => ({
  background: '#fff',
  display: showTooltip ? 'block' : 'none',
  zIndex: 1000,
  alignSelf: 'flex-end',
  padding: '4px 6px',
  position: 'absolute',
  left: '-40px',
  bottom: '-30px',
  color: '#000',
  borderRadius: '5px',
}));

// eslint-disable-next-line react/function-component-definition
const TableTitle: React.FC = () => (
  <TitleContainer>
    <Image
      style={{ color: 'white' }}
      src="/lenio-wgs/bars-icon.svg"
      alt="indicators table icon"
      width="20"
      height="20"
    />
    <Typography
      sx={{
        fontSize: '16px',
        fontWeight: 500,
        textAlign: 'left',
        color: '#EEEEEE',
        marginLeft: '10px',
        lineHeight: '24px',
      }}
      variant="h4"
    >
      key indicators
    </Typography>
  </TitleContainer>
);

interface DeltaProps {
  // eslint-disable-next-line react/require-default-props
  up?: boolean;
  children: React.ReactNode;
}

// eslint-disable-next-line react/function-component-definition
const Delta: React.FC<DeltaProps> = ({ up, children }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ color: up ? '#45F9E0CC' : '#DE3108CC' }}>{up ? '▲' : '▼'}</span>
    <span>{abbreviateNumber(Number(children))}</span>
  </div>
);

const TableContainer = styled('div')(() => ({
  height: 550,
  overflowY: 'auto',
  border: '1px solid rgba(238, 238, 238, 0.25)',
  boxSizing: 'border-box',
  '::-webkit-scrollbar': {
    width: '2px',
    height: '10px',
  },
  '::-webkit-scrollbar-track': {
    background: 'linear-gradient(130deg, rgba(0,0,32), rgba(1,0,43) 70%)',
  },
  '::-webkit-scrollbar-thumb': {
    background: 'rgba(217, 217, 217, 0.5)',
    borderRadius: '15px',
  },
  '::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(217, 217, 217, 0.9)',
  },
}));

const useAxisChange = (onIndicatorAxisChange: () => void | null) => {
  if (!onIndicatorAxisChange) return () => null;
  const [{ x: selectedX, y: selectedY }, setAxis] = React.useState({
    x: 'abf6788a66fbe940547ee9c108535f0be5b0eacbd2bec3796634f90a742202cd', // gini
    y: '80c1e29026bae838ab3275c67aed5010b25cc6c12cc109a75a4695a9c9735c56', // happy planet index
  });

  const renderAxisSelectionButton = React.useCallback(
    (indicatorId: string) => {
      const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null);
      const open = Boolean(anchorEl);
      const handleClick = (event: Event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null);
      };

      const handleManuItemClick = (type: string) => {
        if (type === 'x') {
          setAxis((prev) => {
            if (prev.y === indicatorId) {
              onIndicatorAxisChange({ y: prev.x, x: prev.y });
              return { y: prev.x, x: prev.y };
            }
            onIndicatorAxisChange({ ...prev, x: indicatorId });
            return { ...prev, x: indicatorId };
          });
          handleClose();
        } else if (type === 'y') {
          setAxis((prev) => {
            if (prev.x === indicatorId) {
              onIndicatorAxisChange({ y: prev.x, x: prev.y });
              return { y: prev.x, x: prev.y };
            }
            onIndicatorAxisChange({ ...prev, y: indicatorId });
            return { ...prev, y: indicatorId };
          });
          handleClose();
        }
      };
      return (
        <>
          {indicatorId === selectedX && <AxisBottomButton onClick={handleClick} />}
          {indicatorId === selectedY && <AxisLeftButton onClick={handleClick} />}
          {indicatorId !== selectedX && indicatorId !== selectedY && <AddAxisButton onClick={handleClick} />}
          <Menu id="basic-menu" anchorEl={anchorEl as HTMLElement} open={open} onClose={handleClose}>
            {indicatorId !== selectedX && (
              <MenuItem onClick={() => handleManuItemClick('x')}>Add to X axis</MenuItem>
            )}
            {indicatorId !== selectedY && (
              <MenuItem onClick={() => handleManuItemClick('y')}>Add to Y axis</MenuItem>
            )}
          </Menu>
        </>
      );
    },
    [selectedX, selectedY],
  );

  return renderAxisSelectionButton;
};

const useIndicatorSelector = (showIndicationSelection: Boolean) => {
  if (!showIndicationSelection) {
    return {
      onClick: () => null,
      isIndicatorSelected: () => false,
    };
  }

  const selectedIndicator = useSelector(
    (state: { sidebar: { selectedIndicator: string } }) => state.sidebar.selectedIndicator,
  );
  const dispatch = useDispatch();

  const onClick = (indicatorId: string) => {
    dispatch(changeSelectedIndicator(indicatorId));
  };

  const isIndicatorSelected = (indicatorId: string) => selectedIndicator === indicatorId;

  return { onClick, isIndicatorSelected };
};

function IndicatorsTable({ showIndicationSelection = false, onIndicatorAxisChange = null }) {
  const renderAxisSelectionButton = useAxisChange(onIndicatorAxisChange);
  const [openTooltipIndicator, setOpenTooltipIndicator] = React.useState<string>('');
  const { isIndicatorSelected, onClick } = useIndicatorSelector(showIndicationSelection);
  const { comparingCountry, indicatorsDelta } = useSelector((state: RootState) => ({
    comparingCountry: state.sidebar.comparingCountry,
    indicatorsDelta: state.delta.indicatorsDelta,
  }));
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (comparingCountry?.code) {
      dispatch(fetchDeltaData(comparingCountry.code));
    }
  }, [dispatch, comparingCountry]);

  return (
    <TableContainer>
      <TableTitle />
      <Table sx={{ width: '100%', borderCollapse: 'separate' }}>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="left">KPI</StyledTableCell>
            <StyledTableCell align="left">Ranking</StyledTableCell>
            <StyledTableCell align="left">Value</StyledTableCell>
            <StyledTableCell align="left">Delta</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {Object.keys(indicators).map((indicator: string) => (
            <StyledTableRow
              key={indicator}
              showIndicationSelection={showIndicationSelection}
              selected={isIndicatorSelected(indicator)}
              onClick={() => onClick(indicator)}
            >
              <StyledTableCell align="left">
                {(indicators as { [index: string]: { indicator_name: string } })[indicator].indicator_name}
                {renderAxisSelectionButton(indicator)}
              </StyledTableCell>
              <StyledTableCell align="left">
                {indicatorsDelta?.[indicator]?.ranking || '-'}
              </StyledTableCell>
              <StyledTableCell align="left">
                {indicatorsDelta?.[indicator]?.values[1].value || '-'}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                onMouseEnter={() => {
                  setOpenTooltipIndicator(indicator);
                }}
                onMouseLeave={() => {
                  setOpenTooltipIndicator('');
                }}
              >
                {indicatorsDelta?.[indicator]?.delta ? (
                  <Delta up={indicatorsDelta?.[indicator]?.higher_is_better}>
                    {indicatorsDelta?.[indicator]?.delta}
                  </Delta>
                ) : (
                  '-'
                )}
                {indicatorsDelta?.[indicator]?.delta && (
                  <Tooltip showTooltip={openTooltipIndicator === indicator}>
                    {indicatorsDelta?.[indicator]?.values.map(({ year, value }) => (
                      <div key={`${year}-${value}`}>
                        {year}
                        :
                        {' '}
                        {value}
                      </div>
                    ))}
                  </Tooltip>
                )}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default IndicatorsTable;
