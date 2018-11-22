module.exports = {
  findNestedComment: (
    findNestedComment = (comment, id) => {
      for (let i = 0; i < comment.length; i++) {
        if (comment[i]._id == id) {
          return comment[i]
        }

        const foundedComment = findNestedComment(comment[i].comments, id)

        if (foundedComment) {
          return foundedComment
        }
      }
    }
  )
}