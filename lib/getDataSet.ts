import * as fs from 'fs'

const { parse } = require('csv-parse')

export const getDataSet = () => {
    return new Promise((resolve) => {
        const data: any[] = [];
        fs.createReadStream('data/dotpf.csv')
            .pipe(parse({ delimiter: ',' }))
            .on('data', (row: any[]) => {
                data.push(row)
            })
            .on('finish', () => {
                resolve(data)
            })
    });
    
};