class User {
    constructor(id, userColleague, userId, userLastname, userName, userOtherMail, userPassword, userPhoneNumber, userSchoolMail, userImage, fcmToken) {
        this.id = id;
        this.userColleague = userColleague;
        this.userId = userId;
        this.userLastname = userLastname;
        this.userName = userName;
        this.userOtherMail = userOtherMail;
        this.userPassword = userPassword;
        this.userPhoneNumber = userPhoneNumber;
        this.userSchoolMail = userSchoolMail;
        this.userImage = userImage;
        this.fcmToken = fcmToken;
    }
}

module.exports = User;
