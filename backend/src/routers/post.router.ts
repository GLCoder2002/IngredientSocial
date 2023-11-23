import { createPost, getAllPosts, getTotalPost, postByTime } from '../controllers/post.controller'
import express from 'express'
import { authProtect, authorize } from '../middlewares/auth'
import { uploadMulter } from '../utils/cloudconfig'
import { uploadFile } from '../controllers/upload.controller'
//import { getPresignedUrl } from '../controllers/upload.controller'


export const postRouter = express.Router()

postRouter.get('/', authProtect, getAllPosts)
//postRouter.get('/suggest', authProtect, getDataSuggestion)
//postRouter.get('/ideasOfUser', authProtect, getAllIdeasOfUser)
// postRouter.get('/ideasByCategory', authProtect, getAllIdeasByCategory)
// postRouter.get('/ideasByDepartment', authProtect, getAllIdeasByDepartment)
//postRouter.get('/detail', authProtect, getPostDetail)
//postRouter.get('/ideaLikes', authProtect, getPostLikes)
postRouter.get('/allPosts', authProtect, getAllPosts)
//postRouter.get('/ideaTotalByDuration', authProtect, ideaTotalByDuration)
postRouter.post('/create',uploadMulter.single('video'), authProtect, authorize(['user']), createPost)
postRouter.post('/video',uploadFile, authProtect)
postRouter.post('/totalPosts', authProtect, getTotalPost)
postRouter.get('/totalPostByTime', postByTime, authProtect, authorize(['admin']))
//postRouter.put('/dislike', authProtect, disLikeIdea)
//postRouter.put('/like', authProtect, likeIdea)
//postRouter.put('/omitVote', authProtect, omitVoteIdea)
// postRouter.put('/edit/:ideaId', authProtect, editIdea)
// postRouter.delete('/delete/:ideaId', authProtect, deleteIdea)
