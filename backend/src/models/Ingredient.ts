import { Document, Model, Schema, Types, model } from "mongoose"
import { ICategory } from "./Category"
import { IPost } from "./Post"

export interface IIngredient extends Document {
  name: string
  description?: string
  image?: string
  category?: ICategory['_id']
  posts?: IPost['_id'][]
}

const ingredientSchema = new Schema<IIngredient>({
  name: String,
  description: String,
  image: { type: String, required: true },
  category: { type: Types.ObjectId, required:false, ref: 'Category' },
  posts: [{ type: Types.ObjectId, ref:'Post'}],
})

const Ingredient: Model<IIngredient> = model<IIngredient>('Ingredient', ingredientSchema)

export default Ingredient;