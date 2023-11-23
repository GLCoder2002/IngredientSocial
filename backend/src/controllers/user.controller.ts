import cloudinary from '../utils/cloudconfig'
import { bcryptHash } from '../helpers/bcrypt.helpers'
import User from '../models/User'
import apiErrorResponse from '../utils/apiErrorResponse'

export const getAllUsers = async (req: any, res: any, next: any) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password')
    if (!users) {
      return next(new apiErrorResponse('No account exists.', 404))
    }
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const findUser = async (req: any, res: any, next: any) => {
  const { id } = req.params
  try {
    const user = await User.findById(id).select('-password')
    if (!user) {
      return next(new apiErrorResponse('Account does not exists.', 404))
    }
    return res.status(200).json({
      email: user.email,
      avatar: user.avatar,
      userInfo: user,
    })
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const updateProfileAvatar = async (req: any, res: any, next: any) => {
  try {
    const { avatar } = req.body

    await User.findByIdAndUpdate(req.payload.user.id, {
      avatar: await cloudinary.uploader.upload(avatar,{
        folder:'avatars',
        resource_type:'image',
        allowed_formats: ['jpg', 'png', 'jpeg'],
      }),
    })
    res.json(avatar.public_id)
  } catch (err: any) {
    next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const changePassword = async (req: any, res: any, next: any) => {
  const { username, password } = req.body

  const cryptedPassword = await bcryptHash(password)
  if (password !== undefined || password !== '') {
    await User.findOneAndUpdate(
      { username },
      {
        password: cryptedPassword,
      }
    )
  }
  return res.status(200).json({ message: 'ok' })
}

export const updateUser = async (req: any, res: any, next: any) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true }).select(
      '-password'
    )

    if (!updatedUser) {
      return next(new apiErrorResponse(`Could not update`, 400))
    }
    return res.status(200).json({ success: true, message: 'Updated successfully', updatedUser })
  } catch (err: any) {
    next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const search = async (req: any, res: any, next: any) => {
  try {
    const searchTerm = req.params.searchTerm
    const results = await User.find({ $text: { $search: searchTerm } }).select('name email username')
    res.status(200).json({
      success: true,
      results,
    })
  } catch (err: any) {
    next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const getTotalAccounts = async (req: any, res: any, next: any) => {
  try {
    const users = await User.find({ $ne: { role: 'admin' } }).select('-password')
    if (!users) {
      return next(new apiErrorResponse('No account exists.', 404))
    }
    return res.status(200).json({
      success: true,
      total: users.length,
    })
  } catch (err: any) {
    return next(new apiErrorResponse(`${err.message}`, 500))
  }
}

export const deleteUser = async (req: any, res: any, next: any) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId)

    if (!deletedUser) {
      return next(new apiErrorResponse(`Could not update user`, 400))
    }
    // updateAccountNumberRealTime()
    return res.status(200).json({ success: true, message: 'User deleted successfully', user: deletedUser })
  } catch (error:any) {
    next(new apiErrorResponse(`${error.message}`, 500))
  }
}