import * as fs from 'node:fs';
import { parse } from 'csv-parse/sync';

export interface HelperOptions {
    filepath: string,
    firstLineHeader?: boolean
}

export interface EventData {
    title: string,
    date: string,
    startTime: string,
    endTime: string,
    allDayLong?: string,
    address?: string,
    description?: string
}

export default class CSVHelpers {
    static readFromCSVData(filepath: string): string[] {
        let parsedCSV: string[];

        let fileData = fs.readFileSync(filepath, 'utf-8');
        try {
            parsedCSV = parse(fileData, {
                delimiter: ';',
                encoding: 'utf8'
            });
        } catch (e) {
            parsedCSV = [];
            console.error(e);
        }
        return parsedCSV;
    }

    /**
     * Reads a CSV file and builds an Object on it
     * @param filepath - Absolute filepath to the given CSV file
     */
    static buildCSVDataObject(options: HelperOptions): Array<EventData>{
        let parsedFile = this.readFromCSVData(options.filepath);
        let outputCSV: Array<EventData> = [];

        if (parsedFile.length < 1) {
            return [] as Array<EventData>;
        }

        for (const line in parsedFile) {
            let newObject: EventData = {
                title: parsedFile[line][0],
                date: parsedFile[line][1],
                startTime: parsedFile[line][2],
                endTime: parsedFile[line][3],
                allDayLong: parsedFile[line][4],
                address: parsedFile[line][5]
            };

            outputCSV.push(newObject);
        }

        return outputCSV;        
    }
}