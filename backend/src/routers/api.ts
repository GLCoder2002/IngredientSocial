import { Express } from 'express-serve-static-core'
import authRouter from './auth.router'
import { serverErrorHandler } from '../middlewares/serverErrorHandler'
import userRouter from './user.router'
import { postRouter } from './post.router'
import { categoryRouter } from './category.router'
import ingredientRouter from './ingredient.router'
import { commentRouter } from './comment.router'

const apiRoutes = (app:Express) =>{
  app.use('/api/v1/auth',authRouter)
  app.use('/api/v1/users',userRouter)
  app.use('/api/v1/posts',postRouter)
  app.use('/api/v1/categories',categoryRouter)
  app.use('/api/v1/comments',commentRouter)
  app.use('/api/v1/ingredients',ingredientRouter)
  app.use(serverErrorHandler)
}

export default apiRoutes