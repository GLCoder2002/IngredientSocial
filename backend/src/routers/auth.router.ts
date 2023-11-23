import express from "express";
import { authProtect } from "../middlewares/auth";
import { editAccount, login, refreshToken, signUp, verifyAccessToken } from "../controllers/auth.controller";

const authRouter = express.Router()

authRouter.post('/login',login)
authRouter.post('/signup',signUp)
authRouter.put('/edit',authProtect,editAccount)
authRouter.post('/verifyToken', verifyAccessToken)
authRouter.get('/refreshToken', authProtect, refreshToken)

export default authRouter
