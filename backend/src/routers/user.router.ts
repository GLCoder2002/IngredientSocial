import { changePassword, deleteUser, findUser, getAllUsers, getTotalAccounts, updateUser } from "../controllers/user.controller";
import express from "express";
import { authProtect, authorize } from "../middlewares/auth";

const userRouter = express.Router();
userRouter.get('/', authProtect, getAllUsers)
userRouter.delete('/deleteUser/:userId', authProtect, authorize(['admin']), deleteUser)
userRouter.put('/changePassword', authProtect, changePassword)
userRouter.put('/updateProfile/:userId', authProtect, updateUser)
userRouter.get('/totalUsers', authProtect, authorize(['admin']), getTotalAccounts)
userRouter.get('/getProfile/:id', authProtect, findUser)
export default userRouter
//userRouter.post('/activeUser', authProtect, authorize(['admin']), activeUser)
//userRouter.get('/search/:searchTerm', authProtect, search)
//userRouter.post('/deactiveUser', authProtect, authorize(['admin']), deactiveUser)
