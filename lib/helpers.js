export const capitalizeFirstLetter = (string) =>  string.charAt(0).toUpperCase() + string.slice(1);

export const setEllipsis = (label, visibleLength) => {
  let indicator = label
  if (label.length > visibleLength) {
    indicator = `${label.split('').splice(0, visibleLength).join('')}...`;
  }
  return indicator;
};