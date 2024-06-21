import * as dotenv from 'dotenv';
import CSVHelpers from './helpers/csvHelpers';
import { calendar, auth } from '@googleapis/calendar';

async function main() {
    dotenv.config();

    const scopes = ["https://www.googleapis.com/auth/calendar"];

    const jwtClient = new auth.JWT(
        process.env.CLIENT_EMAIL,
        undefined,
        process.env.CLIENT_PRIVATE_KEY,
        process.env.SCOPES
    );

    const authenticationClient = new auth.GoogleAuth({
        keyFile: './keys.json',
        scopes: scopes
    });

    const calendarClient = await calendar({
        version: 'v3',
        auth: jwtClient
    });

    let fileReadData = CSVHelpers.buildCSVDataObject({filepath: process.env.CSV_FILEPATH!});

    for (const line in fileReadData) {
        const calendarEvent = {
            summary: fileReadData[line].title,
            description: fileReadData[line].title,
            start: {
                dateTime: fileReadData[line].startTime,
                timeZone: process.env.TIMEZONE
            },
            end: {
                dateTime: fileReadData[line].endTime,
                timeZone: process.env.TIMEZONE
            },
            attendees: [],
            reminders: {},
        };

        let calendarInsertResult = await calendarClient.events.insert({
            calendarId: process.env.CALENDAR_ID,
            auth: authenticationClient,
            requestBody: calendarEvent
        });
    }
}

main();