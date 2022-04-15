class Event {
    constructor(id, eventCapacity, eventDate, eventDescription, eventDuration, eventId, eventName, eventOrganizers, eventParticipants, eventPlace, organizerName) {
        this.id = id;
        this.eventCapacity = eventCapacity;
        this.eventDate = eventDate;
        this.eventDescription = eventDescription;
        this.eventDuration = eventDuration;
        this.eventId = eventId;
        this.eventName = eventName;
        this.eventOrganizers = eventOrganizers;
        this.eventParticipants = eventParticipants;
        this.eventPlace = eventPlace;
        this.organizerName = organizerName;
    }
}

module.exports = Event;
