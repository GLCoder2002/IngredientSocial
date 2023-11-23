import Comment from "models/Comment"
import Post from "models/Post"
import User from "models/User"
import apiErrorResponse from "utils/apiErrorResponse"


export const createComment = async (req: any, res: any, next: any) => {
  try {
    const commentBody = req.body

    if (
      !commentBody.content ||
      commentBody.content == '' ||
      req.payload?.user?.id == '' ||
      commentBody.postId === ''
    ) {
      return next(new apiErrorResponse('Lack of required information.', 400))
    }

    const data = { content: commentBody.content, postId: commentBody.postId}
    const newComment = { ...data, userId: req.payload?.user?.id }
    let savedComment = await Comment.create(newComment)

    const user = await User.findById(req.payload?.user?.id).select('comments name email avatar role')
    user?.comments!.push(savedComment._id)
    user?.save()
    savedComment.userId = user

    console.log(savedComment)

    res.status(200).json({
      success: true,
      message: 'Comment is created successfully',
      Comment: savedComment,
    })
  } catch (err:any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const getComments = async (req: any, res: any, next: any) => {
  try {
    const reqQuery = req.query
    const { postId } = reqQuery
    const trending = reqQuery.tab || null
    const results = {}

    let options: any = { postId: postId }

    let comments = Comment.find(options).populate({
      path: 'userId',
      select: ['name', 'avatar', 'email', 'role'],
    })

    if (trending == 'best') {
      comments.sort({ like: -1 })
    } else {
      comments.sort({ date: -1 })
    }
    if (trending == 'oldest') {
      comments.sort({ date: 1 })
    } else {
      comments.sort({ date: -1 })
    }

    results['results'] = await comments
      // .limit(5)
      // .skip(offset)
      .exec()

    res.status(200).json({
      success: true,
      count: results['results'].length,
      data: results['results'],
    })
  } catch (err:any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const getAllCommentsOfUser = async (req: any, res: any, next: any) => {
  try {
    const option = req.query.uid
    const userId = option == 'me' ? req.payload.user.id : option

    const user = await User.findById(userId)
    if (!user) {
      return next(new apiErrorResponse(`Not found user id ${userId}`, 500))
    }
    const comments = await Comment.find({ posterId: { $in: user._id } })
      .populate({
        path: 'userId',
        select: ['name', 'avatar', 'email', 'role'],
      })
      .populate('categories')
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    })
  } catch (err:any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const deleteComment = async (req: any, res: any, next: any) => {
  try {
    const { commentId } = req.params

    const deletedComment = await Comment.findByIdAndDelete(commentId)
    if (!deletedComment) {
      return next(new apiErrorResponse(`Comment id ${commentId} not found`, 404))
    }

    const user = await User.findById(deletedComment.userId)
    const post = await Post.findById(deletedComment.postId)
    await User.deleteMany({ CommentId: deletedComment._id });

    const newUserComments = user?.comments!.filter(userI => userI._id.toString() !== deletedComment._id)
    const newPostComment = post?.comments!.filter(userC => userC._id.toString() !== deletedComment._id)

    user!.comments = newUserComments
    post!.comments = newPostComment
    user?.save()
    post?.save()

    res.status(200).json({ success: true, message: 'Comment is deleted!', deletedComment: deletedComment, user })
  } catch (error:any) {
    return next(new apiErrorResponse(`${error.message}`, 500))
  }
}

export const editComment = async (req: any, res: any, next: any) => {
  try {
    //init req body obj
    const reqBody = req.body

    //get Comment id from req params prop
    const { CommentId } = req.params

    //update Comment with req body obj
    const updatedComment = await Comment.findByIdAndUpdate(CommentId, reqBody, { new: true, useFindAndModify: false })
      .populate('userId')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
        },
      })
      .populate('likes')

    if (!updatedComment) {
      return next(new apiErrorResponse(`Not found Comment id ${CommentId}`, 404))
    }

    await updatedComment.save()

    res.status(202).json({ message: 'Comment succesfully updated!', updatedComment })
  } catch (error:any) {
    return next(new apiErrorResponse(`${error.message}`, 500))
  }
}

// export const likeComment = async (req: any, res: any, next: any) => {
//   try {
//     const { commentId } = req.params
//     let comment = await Comment.findById(commentId)
//     comment.like = +comment.like + 1
//     await comment.save()
//     res.status(200).json({ success: true, message: 'Comment liked!', comment })
//   } catch (error) {
//     return next(new apiErrorResponse(`${error.message}`, 500))
//   }
// }

// export const disLikeComment = async (req: any, res: any, next: any) => {
//   try {
//     const { commentId } = req.params
//     let comment = await Comment.findById(commentId)
//     comment.like = +comment.like - 1
//     await comment?.save()
//     res.status(200).json({ success: true, message: 'Comment liked!', comment })
//   } catch (error:any) {
//     return next(new apiErrorResponse(`${error.message}`, 500))
//   }
// }
