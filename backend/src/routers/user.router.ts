import { changePassword, deleteUser, findUser, getAllUsers, getTotalAccounts, updateProfileAvatar, updateUser } from "../controllers/user.controller";
import express from "express";
import { authProtect, authorize } from "../middlewares/auth";

const userRouter = express.Router();
userRouter.get('/', authProtect, getAllUsers)
userRouter.delete('/deleteUser/:userId', authProtect, authorize(['admin']), deleteUser)
//userRouter.post('/deactiveUser', authProtect, authorize(['admin']), deactiveUser)
//userRouter.post('/activeUser', authProtect, authorize(['admin']), activeUser)
userRouter.put('/changePassword', authProtect, changePassword)
userRouter.put('/updateProfile/:userId', authProtect, updateUser)
userRouter.put('/updateAvatar', authProtect,updateProfileAvatar)
//userRouter.get('/search/:searchTerm', authProtect, search)
userRouter.get('/totalUsers', authProtect, authorize(['admin']), getTotalAccounts)
userRouter.get('/getProfile/:id', authProtect, findUser)
export default userRouter
