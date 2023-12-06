import { Document, Model, Schema, Types, model } from "mongoose"
import { IPost } from "./Post"
import { IComment } from "./Comment"

export interface IUser extends Document {
  token: string
  password: string
  resetPasswordToken: string
  resetPasswordDate: Date
  role: string
  username: string
  birthday: Date
  email: string
  avatar?: string
  phone?: string
  comments?: IComment['_id'][]
  posts?: IPost['_id'][]
}

export const userSchema = new Schema<IUser>(
  {
    token: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user',},
    password: { type: String, required: true, minlength: 8, select: false,},
    resetPasswordToken: String,
    resetPasswordDate: Date,
    username: { type: String, required: true, trim: true, },
    email: { unique: true, type: String, required: false, default: 'None'},
    birthday: { type: Date, required: false },
    avatar: { type: String, required: false, default:'https://res.cloudinary.com/draisiudw/image/upload/v1701134250/avatars/avatar.jpg',},
    phone: String,
    posts: [{ type: Types.ObjectId, ref: 'Post', default: [] }],
    comments: [{ type: Types.ObjectId, ref: 'Comment', default: [] }],
  },

  { timestamps: { createdAt: true, updatedAt: true } }
)
const User: Model<IUser> = model<IUser>('User', userSchema)

export default User