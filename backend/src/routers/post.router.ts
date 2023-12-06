import { createPost, deletePost, disLikePost, editPost, getAllPosts, getAllPostsOfUser, getDataSuggestion, getPost, getPostLikes, getTotalPost, likePost, postByTime } from '../controllers/post.controller'
import express from 'express'
import { authProtect, authorize } from '../middlewares/auth'
import { uploadMulter } from '../utils/cloudconfig'

export const postRouter = express.Router()

postRouter.get('/suggest', authProtect, getDataSuggestion)
postRouter.get('/', authProtect, getAllPosts)
postRouter.get('/allPosts', authProtect, getAllPosts)
postRouter.post('/create',uploadMulter.single('video'), authProtect, authorize(['user']), createPost)
postRouter.get('/totalPosts', authProtect, getTotalPost)
postRouter.get('/totalPostByTime', postByTime, authProtect, authorize(['admin']))
postRouter.put('/edit/:postId',uploadMulter.single('video'), authProtect, editPost)
postRouter.get('/detail', authProtect, getPost)
postRouter.put('/dislike', authProtect, disLikePost)
postRouter.put('/like', authProtect, likePost)
postRouter.delete('/delete/:postId', authProtect, deletePost)
postRouter.get('/postsOfUser/:posterId', authProtect, getAllPostsOfUser)
postRouter.get('/postReaction', authProtect, getPostLikes)