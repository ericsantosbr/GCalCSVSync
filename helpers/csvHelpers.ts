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
    allDayLong?: boolean,
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
            let newCSVDataObject: EventData = {
                title: parsedFile[line][0],
                date: parsedFile[line][1],
                startTime: parsedFile[line][2],
                endTime: parsedFile[line][3],
                address: parsedFile[line][5]
            };

            let lineDate: string = parsedFile[line][1];
            let lineStartTime = parsedFile[line][2];
            let lineEndTime = parsedFile[line][3];
            let allDayLongEvent = parsedFile[line][4];

            if (allDayLongEvent !== 'true') {
                newCSVDataObject.allDayLong = false;
                newCSVDataObject.startTime = lineDate + 'T' + lineStartTime + ':00-03:00';
                // Adds 90 minutes if endTime is not declared
                newCSVDataObject.endTime !== '' ? lineDate + 'T' + lineEndTime + ':00-03:00' : new Date(new Date(newCSVDataObject.startTime).getTime() + 5400000);
            } else {
                newCSVDataObject.startTime = lineDate + 'T00:00:00-03:00';
                // ugly, I know. but works
                let calculatedEndTime = new Date(new Date(lineDate + 'T00:00:00-03:00').getTime() + 86400000).toISOString();
                newCSVDataObject.endTime = calculatedEndTime;
                newCSVDataObject.allDayLong = true;
            }

            outputCSV.push(newCSVDataObject);
        }

        return outputCSV;        
    }
}