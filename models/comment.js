class Comment {
    constructor(id, commentAuthor, commentContent, commentDate, commentId) {
        this.id = id;
        this.commentAuthor = commentAuthor;
        this.commentContent = commentContent;
        this.commentDate = commentDate;
        this.commentId = commentId;
    }
}

module.exports = Comment;