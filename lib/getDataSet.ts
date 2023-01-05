import * as fs from 'fs'

const { parse } = require('csv-parse')

export const getDataSet = (): Promise<string[][]> => {
    return new Promise((resolve) => {
        const data: string[][] = [];
        fs.createReadStream('data/dotpf.csv')
            .pipe(parse({ delimiter: ',' }))
            .on('data', (row: string[]) => {
                data.push(row)
            })
            .on('finish', () => {
                resolve(data)
            })
    });
    
};