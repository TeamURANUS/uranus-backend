class Post {
    constructor(
        id,
        postAuthor,
        postComments,
        postContent,
        postDate,
        postId,
        postTitle,
        postGroupId,
        postSentByAdmin,
    ) {
        this.id = id;
        this.postAuthor = postAuthor;
        this.postComments = postComments;
        this.postContent = postContent;
        this.postDate = postDate;
        this.postId = postId;
        this.postTitle = postTitle;
        this.postGroupId = postGroupId;
        this.postSentByAdmin = postSentByAdmin;
    }
}

module.exports = Post;
