class Group {
    constructor(
        id,
        groupAdmin,
        groupAssistants,
        groupDescription,
        groupId,
        groupIsCommunity,
        groupMembers,
        groupName,
        groupPostPermissions,
        groupPosts,
        groupPrivacyPermissions
    ) {
        this.id = id;
        this.groupAdmin = groupAdmin;
        this.groupAssistants = groupAssistants;
        this.groupDescription = groupDescription;
        this.groupId = groupId;
        this.groupIsCommunity = groupIsCommunity;
        this.groupMembers = groupMembers;
        this.groupName = groupName;
        this.groupPostPermissions = groupPostPermissions;
        this.groupPosts = groupPosts;
        this.groupPrivacyPermissions = groupPrivacyPermissions;
    }
}

module.exports = Group;
