const { google } = require("googleapis");
require("dotenv").config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });

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
    });

    if (response["status"] == 200 && response["statusText"] === "OK") {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return 0;
  }
};

const getEvents = async (dateTimeStart, dateTimeEnd) => {
  try {
    let response = await calendar.events.list({
      auth: auth,
      calendarId: calendarId,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
      timeZone: "Asia/Kolkata",
    });

    let items = response["data"]["items"];
    return items;
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
  }
};

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
    return 0;
  }
};

let event = {
  summary: `summary test`,
  description: `description test`,
  start: {
    dateTime: dateTime["start"],
    timeZone: "Turkey",
  },
  end: {
    dateTime: dateTime["end"],
    timeZone: "Turkey",
  },
};

//insertEvent(event);
/*let start = "2022-01-01T00:00:00.000Z";
let end = "2024-01-01T00:00:00.000Z";
getEvents(start, end)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });*/

/*let eventID = "hpftfc0fgq1qq2qtvu2sd0n3hg";
deleteEvent(eventID)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
*/
