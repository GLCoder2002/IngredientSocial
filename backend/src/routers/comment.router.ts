import express from 'express'
import { authProtect } from '../middlewares/auth'
import { createComment, deleteComment, editComment, getAllCommentsOfUser, getComments } from '../controllers/comment.controller'

export const commentRouter = express.Router()

commentRouter.post('/create', authProtect, createComment)
commentRouter.put('/edit/:commentId', authProtect, editComment)
//commentRouter.put('/like/:commentId', authProtect, likeComment)
//commentRouter.put('/dislike/:commentId', authProtect, disLikeComment)
commentRouter.put('/edit', authProtect, editComment)
commentRouter.get('/', authProtect, getComments)
commentRouter.get('/commentsOfUser', authProtect, getAllCommentsOfUser)
commentRouter.delete('/delete/:commentId', authProtect, deleteComment)