class Notification {
    constructor(
        id,
        notifContent,
        notifDate,
        notifId,
        notifTargetGroup,
        notifTitle
    ) {
        this.id = id;
        this.notifContent = notifContent;
        this.notifDate = notifDate;
        this.notifId = notifId;
        this.notifTargetGroup = notifTargetGroup;
        this.notifTitle = notifTitle;
    }
}

module.exports = Notification;
