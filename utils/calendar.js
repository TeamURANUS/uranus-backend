const {google} = require("googleapis");

const {calendarId, CREDENTIALS} = require("./config");

const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({version: "v3"});

CREDENTIALS.private_key = CREDENTIALS.private_key.replace(/\\n/g, "\n");

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

const TIMEOFFSET = "+03:00";

const dateTimeForCalendar = () => {
    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }
    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(
        new Date(startDate).setHours(startDate.getHours() + 1)
    );

    return {
        start: startDate,
        end: endDate,
    };
};

const insertEvent = async (event) => {
    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event,
            sendNotifications: true,
            sendUpdates: "all"
        });

        //console.log(response.data.htmlLink);
        if (response["status"] === 200 && response["statusText"] === "OK") {
            return response.data.htmlLink;
        } else {
            return "";
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

const getEvents = async () => {
    try {
        const items = await getEventsFromCalendar();
        if (items.empty) {
            return [];
        } else {
            return items;
        }
    } catch (error) {
        return [];
    }
};

const getEventsFromCalendar = async () => {
    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
        });

        let items = response.data.items;
        return items;
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
}

let dateTime = dateTimeForCalendar();

const deleteEvent = async (eventId) => {
    try {
        let response = await calendar.events.delete({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId,
        });

        if (response.data === "") {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at deleteEvent --> ${error}`);
        return [];
    }
};

/*let event = {
    summary: `summary test`,
    description: `description test`,
    location: "B69",
    start: {
        dateTime: dateTime["start"],
        timeZone: "Turkey",
    },
    end: {
        dateTime: dateTime["start"],
        timeZone: "Turkey",
    },
    visibility: 'public'

};*/

//insertEvent(event);
//getEvents();


module.exports = {
    insertEvent,
    deleteEvent,
    getEvents,
    dateTimeForCalendar,
};
