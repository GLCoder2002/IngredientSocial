import { Document, Model, Schema, Types, model } from "mongoose"
import { IIngredient } from "./Ingredient"

export interface ICategory extends Document {
  name: string
  description?: string
  ingredients:IIngredient['_id'][]
}
const categorySchema = new Schema<ICategory>({
  name: String,
  description: { type: String, default: "" },
  ingredients: [{type:Types.ObjectId, ref:'Ingredient'}]
},{
  timestamps:true
})

const Category: Model<ICategory> = model<ICategory>('Category',categorySchema)

export default Category;
