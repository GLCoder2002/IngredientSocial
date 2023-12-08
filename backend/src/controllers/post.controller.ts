import Ingredient from "../models/Ingredient"
import User from "../models/User"
import apiErrorResponse from "../utils/apiErrorResponse"
import Comment from "../models/Comment"
import Post, { IPost } from "../models/Post"
import cloudinary from "../utils/cloudconfig"
import mongoose from "mongoose"
import { io } from "../utils/socket"


export const createPost = async (req: any, res: any, next: any) => {
  try {
    const reqBody = req.body
    reqBody.video = req?.file?.path
    if (!reqBody.content || reqBody.content == '' || reqBody.title == '') {
      const urlParts = reqBody.video.split('/')
      const firstPart = urlParts?.find(part => part === "videos");
      const lastPart = urlParts![urlParts!.length - 1]
      const lastPartId = lastPart.split(".")[0];
      const path = `${firstPart}/${lastPartId}`
      cloudinary.uploader.destroy(path);
      return next(new apiErrorResponse('Please fill the properties of your post', 400))
    }

    if (reqBody?.ingredients?.length) {
      reqBody.ingredients = reqBody?.ingredients?.split(',')?.map(i => new mongoose.Types.ObjectId(i))
    }
    const newPost: IPost = Object.assign({}, reqBody, { posterId: req.payload.user.id })


    let savedPost = await Post.create(newPost)
    const user = await User.findById(savedPost.posterId)
    if (reqBody.ingredients) {
      const addIngredients = reqBody.ingredients.map(async ingredient => {
        let addIngredient = await Ingredient.findById(ingredient)
        addIngredient?.posts?.push(savedPost._id)
        await addIngredient?.save()
      })
      Promise.all(addIngredients)
    }
    user?.posts?.push(savedPost._id)
    user?.save()
    
    res.status(200).json({
      success: true,
      message: 'post is created successfully',
      post: savedPost,
    })
  } catch (err: any) {
    
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const editPost = async (req: any, res: any, next: any) => {
  try {

    const reqBody = req.body
    const { postId } = req.params

    if (reqBody?.ingredients?.length) {
      reqBody.ingredients = reqBody?.ingredients?.split(',')?.map(i => new mongoose.Types.ObjectId(i))
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, reqBody, { new: true, useFindAndModify: false })
      .populate('posterId')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
        },
      })
      .populate('likes')

    if (!updatedPost) {
      return next(new apiErrorResponse(`Not found post id ${postId}`, 404))
    }

    updatedPost.video = reqBody.video ? reqBody.video : updatedPost.video
    await updatedPost.save()

    res.status(202).json({ message: 'post succesfully updated!', updatedPost })
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const getAllPosts = async (req: any, res: any, next: any) => {
  try {
    const reqQuery = req.query;
    const page = parseInt(reqQuery.page) || 1
    const limit = parseInt(reqQuery.limit) || 10
    const offset = (page - 1) * limit
    const trending = reqQuery.tab || null;
    const endIndex = page * limit
    let keyWord = reqQuery.keyword || null;
    const results: any = {};

    if (endIndex < (await Post.countDocuments().exec())) {
      results['next'] = {
        page: page + 1,
        limit: limit,
      }
    }

    if (offset > 0) {
      results['previous'] = {
        page: page - 1,
        limit: limit,
      }
    }

    let options: any = {};

    if (keyWord) {
      keyWord = keyWord?.replace(/-/g, ' ').toLowerCase();
      const rgx = (pattern: any) => new RegExp(`.*${pattern}.*`);
      const searchRegex = rgx(keyWord);
      options = {
        $or: [
          { title: { $regex: searchRegex, $options: 'i' } },
          { content: { $regex: searchRegex, $options: 'i' } },
        ],
      };
    }

    let posts = Post.find(options)
      .select('title meta likes dislikes createdAt comments content video ingredients')
      .populate({
        path: 'posterId',
        select: ['username', 'avatar', 'email', 'role'],
      })
      .populate({
        path: 'ingredients',
        select: ['username', 'description', 'image'],
      });

    if (trending == 'hot') {
      posts.sort({ 'meta.views': -1 });
    } else if (trending == 'best') {
      posts.sort({ 'meta.likesCount': -1 });
    } else if (trending == 'worst') {
      posts.sort({ 'meta.dislikesCount': -1 });
    } else if (trending == 'oldest') {
      posts.sort({ createdAt: 1 });
    } else {
      posts.sort({ createdAt: -1 });
    }

    results['results'] = await posts.limit(limit).skip(offset).exec();

    res.status(200).json({
      success: true,
      count: results['results'].length,
      next: results['next'],
      previous: results['previous'],
      data: results['results'],
    });
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500));
  }
};


// export const findPostByIngredients = async (req:any, res:any, next:any) => {
//   try {
//     const ingredientNames = req.query.ingredients
//     const posts = await Post.find({ingredients:{$in:ingredientNames}})
//     res.json(posts)
//   } catch (error:any) {
//     next(new apiErrorResponse(`${error.message}`,500))
//   }

// }

export const getTotalPost = async (req: any, res: any, next: any) => {
  try {
    const { accessRole } = req.query
    const postsLength = await Post.find(
      accessRole === 'admin'
        ? {
          $expr: {
            $gt: [{ $size: { $ifNull: ['$files', []] } }, 0],
          },
        }
        : {}
    ).count()

    res.status(200).json({
      success: true,
      total: postsLength,
    })
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const getAllPostsOfUser = async (req: any, res: any, next: any) => {
  try {
    const userId = req.params.posterId

    const user = await User.findById(userId)
    if (!user) {
      return next(new apiErrorResponse(`Not found user id ${userId}`, 500))
    }
    const posts = await Post.find({ posterId: userId })
      .select('title likes dislikes meta createdAt comments content video')

      .populate({
        path: 'posterId',
        select: ['username', 'avatar', 'email', 'role'],
      })
      .populate('ingredients')
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    })
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const getAllPostsByIngredients = async (req: any, res: any, next: any) => {
  try {
    const ingredientId = req.query.uid

    const ingredient = await Ingredient.findById(ingredientId)
    if (!ingredient) {
      return next(new apiErrorResponse(`Not found ingredient id ${ingredientId}`, 500))
    }
    const posts = await Post.find({ ingredients: { $in: [ingredient._id] } }) //$all
      .select('title likes dislikes meta createdAt comments content video')
      .populate({
        path: 'posterId',
        select: ['username', 'avatar', 'email', 'role'],
      })
      .populate('ingredients')
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    })
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const getPost = async (req: any, res: any, next: any) => {

  try {
    const post = await Post.findById(req.query.id)
      .populate({
        path: 'posterId',
        select: ['username', 'avatar', 'email', 'role']
      })
      .populate('ingredients')
    post!.meta!.views = post!.meta!.views + 1
    await post?.save()
    res.status(200).json({
      success: true,
      data: post,
    })
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const getDataSuggestion = async (req: any, res: any, next: any) => {
  try {
    const posts = await Post.find().select('title')
    const users = await User
      .find()
      .select('username')
    const ingredients = await Ingredient
      .find()
      .select('username')
    res.status(200).json({
      success: true,
      data: posts,
      count: posts.length,
    })
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const deletePost = async (req: any, res: any, next: any) => {
  try {
    const { postId } = req.params
    const deletedPost = await Post.findByIdAndDelete(postId)
    const url = deletedPost?.video
    const urlParts = url?.split('/')
    const firstPart = urlParts?.find(part => part === "videos");
    const lastPart = urlParts![urlParts!.length - 1]
    const lastPartId = lastPart.split(".")[0];
    const path = `${firstPart}/${lastPartId}`
    cloudinary.uploader.destroy(path);
    if (!deletedPost) {
      return next(new apiErrorResponse(`post id ${postId} not found`, 404))
    }
    const user = await User.findById(deletedPost.posterId)
      .populate('posts')
      .populate('comments')
      .populate({
        path: 'posts',
        populate: {
          path: 'posterId',
        },
      })
      .populate({
        path: 'posts',
        populate: {
          path: 'comments',
        },
      })
    Comment.deleteMany({ postId: deletedPost._id })

    const newUserPosts = user?.posts?.filter(userI => userI._id.toString() !== deletedPost._id)
    const newUserComment = user?.comments?.filter(userC => userC._id.toString() !== deletedPost._id)
    if (deletedPost!.ingredients!.length > 0) {
      const ingredients = await Ingredient.find({ Posts: { $in: [deletedPost._id] } })
      ingredients.forEach(ingredient => {
        const newIngredientPosts = ingredient!.posts!.filter(PostI => PostI._id.toString() !== deletedPost._id)
        ingredient!.posts = newIngredientPosts
        ingredient.save()
      })
    }
    user!.posts = newUserPosts
    user!.comments = newUserComment
    user?.save()
    res.status(200).json({ success: true, message: 'post is deleted!', deletedPost: deletedPost, user })
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}


export const likePost = async (req: any, res: any, next: any) => {
  try {
    const { postId } = req.body;
    const userId = req.payload.user.id;
    let post = await Post.findById(postId).select('createdAt dislikes likes');

    if (post!.likes!.indexOf(userId) >= 0) {
      return res.status(200).json({ success: true, message: 'already like!' });
    }

    if (post!.dislikes!.indexOf(userId) >= 0) {
      post!.dislikes = post!.dislikes!.filter(like => like.toString() !== userId);
    }

    if (post!.likes!.indexOf(userId) === -1) {
      post!.likes!.push(userId);
    }
    await post?.save();
    User.findById(userId)
      .select('comments username email avatar role')
      .then(user => {
        io.emit('votes', { action: 'like', postId: postId, user: user })
      })
    res.status(200).json({ success: true, message: 'post liked!' });
  } catch (error: any) {
    return next(new apiErrorResponse(`${error.message}`, 500));
  }
};


export const disLikePost = async (req: any, res: any, next: any) => {
  try {
    const { postId } = req.body
    const userId = req.payload.user.id
    let post = await Post.findById(postId).select('createdAt dislikes likes')
    if (post!.dislikes!.indexOf(userId) >= 0) {
      return res.status(200).json({ success: true, message: 'already dislike!' })
    }
    if (post!.likes!.indexOf(userId) >= 0) {
      post!.likes = post!.likes!.filter(like => like.toString() !== userId)
    }
    if (post!.dislikes!.indexOf(userId) === -1) {
      post!.dislikes!.push(userId)
    }
    await post?.save()
    User.findById(userId)
      .select('comments username email avatar role')
      .then(user => {
        io.emit('votes', { action: 'like', postId: postId, user: user })
      })
    res.status(200).json({ success: true, message: 'post liked!' })
  } catch (error: any) {
    return next(new apiErrorResponse(`${error.message}`, 500))
  }
}

export const omitVotePost = async (req: any, res: any, next: any) => {
  try {
    const { postId } = req.body
    const userId = req.payload.user.id
    let post = await Post.findById(postId).select('createdAt dislikes likes')
    if (post!.dislikes!.indexOf(userId) === -1 && post!.likes!.indexOf(userId) === -1) {
      return res.status(200).json({ success: true, message: 'already omit!' })
    }
    if (post!.likes!.indexOf(userId) >= 0) {
      post!.likes = post!.likes!.filter(like => like.toString() !== userId)
    }
    if (post!.dislikes!.indexOf(userId) >= 0) {
      post!.dislikes = post!.dislikes!.filter(like => like.toString() !== userId)
    }

    await post?.save()
    User.findById(userId)
      .select('comments username email avatar role')
      .then(user => {
        io.emit('votes', { action: 'omit', postId: postId, user: user })
      })
    res.status(200).json({ success: true, message: 'omit oke!' })
  } catch (error: any) {
    return next(new apiErrorResponse(`${error.message}`, 500))
  }
}

export const getPostLikes = async (req: any, res: any, next: any) => {
  try {
    const { postId } = req.query

    const posts = await Post.findById(postId)
      .populate({
        path: 'likes',
        select: ['username', 'avatar'],
      })
      .populate({
        path: 'dislikes',
        select: ['username', 'avatar'],
      })

    res.status(201).json({
      success: true,
      message: 'post likers fetched succesfully!',
      likes: posts?.likes,
      dislikes: posts?.dislikes,
    })
  } catch (error: any) {
    return next(new apiErrorResponse(`${error.message}`, 500))
  }
}

export const postByTime = async (req: any, res: any, next: any) => {
  try {
    const results = await Post.aggregate([
      { $project: { week: { $week: { date: '$createdAt', timezone: 'GMT' } }, date: '$createdAt' } },
      { $group: { _id: { weeK: '$week' }, count: { $sum: 1 } } },
    ])
    res.status(201).json({
      success: true,
      data: results,
    })
  } catch (error: any) {
    return next(new apiErrorResponse(`${error.message}`, 500))
  }
}
