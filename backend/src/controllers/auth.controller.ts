import { bcryptCompare, bcryptHash } from '../helpers/bcrypt.helpers'
import { generateJWToken, verifyJWTToken } from '../helpers/token.helper'
import User from '../models/User'
import apiErrorResponse from '../utils/apiErrorResponse'

// @route POST /api/v1/auth/login
export const login = async (req: any, res: any, next: any) => {
  try {
    const { username, password } = req.body
    let user = await User.findOne({ username: username.toString() }).select('+password')
    if (!user) {
      return next(new apiErrorResponse('Invalid username or password', 401))
    }
    const checkPassword = await bcryptCompare(password, user!.password)
    if (!checkPassword) {
      return next(new apiErrorResponse('Invalid username or password', 400))
    } else await sendTokenResponse(user, 200, 'Login successfully', res, next)
  } catch (err: any) {
    next(new apiErrorResponse(err.message))
  }
}

// @route POST /api/v1/auth/signUp
export const signUp = async (req: any, res: any, next: any) => {
  try {
    const { username, password, role, birthday, email, gender } = req.body
    const isUserExists = await User.findOne({ email: email })
    if (isUserExists) {
      next(new apiErrorResponse('Email is taken', 400))
    }

    const passwordHash = await bcryptHash(password)
    const newAccount = await new User({
      username,
      email,
      password: passwordHash,
      role,
      birthday,
      gender,
    }).save()
    res.status(200).json({ success: true, savedUser: newAccount })
  } catch (err: any) {
    next(new apiErrorResponse(err.message))
  }
}

export const editAccount = async (req: any, res: any, next: any) => {
  try {
    const { _id, username, password, email,gender,dob } = req.body

    const isUserExists = await User.find({ email: email })

    if (isUserExists?.length > 1) {
      next(new apiErrorResponse('Email is taken', 400))
    }

    if (password) {
      const passwordHash = await bcryptHash(password)

      await User.findByIdAndUpdate(
        { _id },
        {
          username,
          password: passwordHash,
          email,
          gender,
          dob
        }
      )
    } else {
      await User.findByIdAndUpdate(
        { _id },
        {
          username,
          email,
          gender,
          dob
        }
      )
    }

    res.status(200).json({ success: true })
  } catch (err: any) {
    next(new apiErrorResponse(err.message))
  }
}



const sendTokenResponse = async (userData: any, statusCode: any, message: any, res: any, next: any) => {
  const payload = {
    user: {
      id: userData._id,
      username: userData.username,
      role: userData.role,
    },
  }

  const cookieOptions = {
    expires: new Date(Date.now() + 169696),
    httpOnly: true,
  }

  const refreshToken = generateJWToken(payload, process.env.JWT_REFRESH_SECRET, '15d')
  const accessToken = generateJWToken(payload, process.env.JWT_ACCESS_SECRET, '30000s')

  setRefreshToken(refreshToken, userData, next)

  res
    .status(statusCode)
    .cookie('token', refreshToken, cookieOptions)
    .json({
      success: true,
      userMetaData: {
        _id: userData._id,
        username: userData.username,
        role: userData.role,
        name: userData.name,
        birthday: userData.birthday || '',
        email: userData.email,
        avatar: userData.avatar || '',
        phone: userData.phone || '',
      },
      message,
      accessToken: accessToken,
    })
}

const setRefreshToken = async (token: string, userData: any, next: any) => {
  try {
    await new User(userData).save()
  } catch (err: any) {
    next(new apiErrorResponse(err.message))
  }
}

export const verifyAccessToken = async (req: any, res: any, next: any) => {
  try {
    const { token } = req.body
    const verify = verifyJWTToken(token, process.env.JWT_ACCESS_SECRET)
    if (verify) {
      return res.status(200).json({
        success: true,
      })
    }
  } catch (err) {
    return res.status(200).json({
      success: false,
    })
  }
}

// @route POST /api/v1/auth/refreshToken -- call for refresh the access token
export const refreshToken = async (req: any, res: any, next: any) => {
  try {
    const refreshToken = await User.findOne({ _id: req.payload.user.id }).select('token')
    if (refreshToken) {
      const accessOption = {
        expriresIn: 300,
      }
      const decodedJWTToken = await verifyJWTToken(refreshToken, process.env.JWT_REFRESH_SECRET)
      if (decodedJWTToken) {
        const newAccessToken = await generateJWToken(decodedJWTToken, process.env.JWT_ACCESS_SECRET, accessOption)
        res.status(200).json({
          newAccessToken: newAccessToken,
        })
      }
    } else {
      return next(new apiErrorResponse('The user is not authenticated.', 401))
    }
  } catch (error: any) {
    next(new apiErrorResponse(error.message))
  }
}
