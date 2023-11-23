import { Document, Model, Schema, Types, model } from "mongoose";
import { IComment } from "./Comment";
import { IUser } from "./User";
import { IIngredient } from "./Ingredient";

export interface IPostMeta extends Document {
  likesCount: number
  views: number
  dislikesCount: number
}

export interface IPost extends Document {
  posterId: IUser['_id']
  title: string
  content: string
  video?: string
  meta?:IPostMeta
  likes?: IUser['_id'][]
  dislikes?: IUser['_id'][]
  comments?: IComment['_id'][]
  createdAt?: Date
  ingredients?: IIngredient['_id'][]
}
const postSchema = new Schema<IPost>({
  posterId: { type: Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
  meta: {
    views: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 }
  },
  video: { type: String, required:true },
  likes: [{ type: Types.ObjectId, default: [], ref: 'User'}],
  dislikes: [{ type: Types.ObjectId, default: [], ref: 'User'}],
  comments: [{ type: Types.ObjectId, default: [], ref: 'Comment'}],
  createdAt: { type: Date, default: Date.now },
  ingredients: [{ type: Types.ObjectId, ref: 'Ingredient', default:[]}],
},{
  timestamps:{updatedAt:true}
})

postSchema.pre("save", async function (done) {
  if (this.isModified("likes") || this.isModified("dislikes")) {
    const likesCounter = await this.get("likes");
    this.set("meta.likesCount", likesCounter?.length)
    const disLikesCounter = await this.get("dislikes");
    this.set("meta.dislikesCount", disLikesCounter?.length)
  }
  done();
})
const Post: Model<IPost> = model<IPost>('Post', postSchema)

export default Post