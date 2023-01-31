import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import getCountryISO2 from 'country-iso-3-to-2';
import { styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';
import InputAdornment from '@mui/material/InputAdornment';
import { WorldIcon } from './icons/WorldIcon';
import countries from '../data/iso_country.json';
import organizations from '../data/organizations.json';

export const ORGANIZATION = 'Organizations';
export const GROUPS = 'Groups';
export const COUNTRY = 'Countries';

export const NEIGHBORS = 'NEIGHBORS';
export const WORLD = 'WORLD';

export const WORLD_ITEM = { code: WORLD, label: 'World', group: GROUPS };

const getCountryFlag = (country, group) => {
  if (group === GROUPS) return <WorldIcon />;
  if (group === ORGANIZATION) return null;
  return (
    <img
      loading="lazy"
      width="20"
      src={`https://flagcdn.com/w20/${String(getCountryISO2(country)).toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w40/${String(getCountryISO2(country)).toLowerCase()}.png 2x`}
      alt={`${countries[country]} flag`}
    />
  );
};
const getPickerItems = ({
  showOrganizations,
  showCountries,
  showNeighboring,
  showWorld,
}) => ([
  ...(showWorld ? [WORLD_ITEM] : []),
  ...(showNeighboring ? [{ code: NEIGHBORS, label: 'Neighboring Countries', group: GROUPS }] : []),
  ...(showCountries ? Object.keys(countries).map((country) => ({
    code: country,
    label: countries[country],
    group: COUNTRY,
  })) : []),
  ...(showOrganizations ? Object.keys(organizations).map((organization) => ({
    code: organization,
    label: organization,
    group: ORGANIZATION,
  })) : []),
]);

const StyledTextField = styled(TextField)({
  '& input, label': {
    color: '#EEEEEE!important',
    background: '#000022',
    padding: '0 10px',
  },
  '& svg': {
    fill: '#D9D9D9',
  },
  // background: '#191935',
  background: 'hsla(240, 100%, 6%, 0.4)',
  // hsla(240, 100%, 6%, 0.2)
  border: '1px solid rgba(238, 238, 238, 0.2)',
  borderRadius: '2px',
});

const StyledBox = styled(Box)({
  background: '#191935',
  color: '#EEEEEE',
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    background: '#191935',
  },
  [`& .${autocompleteClasses.listbox} .MuiListSubheader-root`]: {
    background: '#191935',
    color: '#EEEEEE',
  },
});

export function CountryPicker({
  canBeNull = false,
  label = 'Select a country to compare',
  onChange = () => null,
  showOrganizations = false,
  showCountries = false,
  showNeighboring = false,
  showWorld = false,
  defaultCode = 'USA',
  country,
}) {
  const pickerItems = React.useMemo(() => getPickerItems({
    showOrganizations, showCountries, showNeighboring, showWorld,
  }), [showOrganizations, showCountries, showNeighboring, showWorld]);

  return (
    <Autocomplete
      id="country-select-demo"
      style={{ width: '100%' }}
      onBlur={() => {
        if (!canBeNull && !country) {
          const defaultOption = pickerItems.find((item) => item.code === defaultCode);
          onChange(defaultOption);
        }
      }}
      onChange={(_, newValue) => {
        if (newValue) {
          onChange(newValue);
        } else {
          onChange(null);
        }
      }}
      value={country}
      sx={{ width: 300 }}
      options={pickerItems}
      autoHighlight
      groupBy={(option) => option.group}
      PopperComponent={StyledPopper}
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => (
        <StyledBox component="li" sx={{ '& > img, svg': { mr: 2, flexShrink: 0 } }} {...props}>
          {getCountryFlag(option.code, option.group)}
          {option.label}
        </StyledBox>
      )}
      isOptionEqualToValue={(opt, value) => opt.code === value.code}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            autoComplete: 'off',
            ...(!country ? {} : {
              startAdornment: (
                <InputAdornment position="start" sx={{ '& > img, svg': { ml: 1, flexShrink: 0 } }}>
                  {getCountryFlag(country.code, country?.group)}
                </InputAdornment>
              ),
            }),
          }}
        />
      )}
    />
  );
}
