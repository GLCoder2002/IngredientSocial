import { Document, Model, Schema, Types, model } from "mongoose";
import { IPost } from "./Post";
import { IUser } from "./User";

export interface IComment extends Document {
  userId?: IUser['_id'];
  postId?: IPost['_id'];
  content: string;
  date: Date;
  like?: Number;
  dislike?: Number;
}
const commentSchema: Schema = new Schema<IComment>({
  userId: { type: Types.ObjectId, ref: 'User' },
  postId: { type: Types.ObjectId, ref: 'Post' },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  like: { type: Number, default: 0, required: false },
  dislike: { type: Number, default: 0, required: false },
})

const Comment: Model<IComment> = model<IComment>('Comment', commentSchema);

export default Comment;