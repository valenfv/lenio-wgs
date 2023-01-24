export function getLatestYear(years: Array<string>) {
	years.sort((a, b) => Number(b) - Number(a));
	return years[0];
}
