import Category from "../models/Category"
import Ingredient from "../models/Ingredient"
import apiErrorResponse from "../utils/apiErrorResponse"
import cloudinary from "../utils/cloudconfig"

export const createIngredient = async (req:any, res:any, next:any) => {
    try {
    const {name, description, image = req?.file?.path, category} = req.body
    let existIngredients = await Ingredient.findOne({name:name})
    if(existIngredients){
        const urlParts = image.split('/')
        const firstPart = urlParts?.find(part => part === "images");
        const lastPart = urlParts![urlParts!.length - 1]
        const lastPartId = lastPart.split(".")[0];
        const path = `${firstPart}/${lastPartId}`
        cloudinary.uploader.destroy(path);
        next(new apiErrorResponse('Ingredient already existed'),400)
    }
    else{
        const newIngredient = await new Ingredient({
            name,
            description,
            image,
            category,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).save()
        if (category) {
            await Category.findByIdAndUpdate({ _id: category }, { $push: { ingredients: newIngredient._id } })
        }
        res.status(200).json({
            success: true,
            data: newIngredient
        })
    }
    } catch (err:any) {
        next(new apiErrorResponse(`${err.message}`,400))
    }
}

export const updateIngredient = async (req:any, res:any, next:any) => {
    try {
    const {_id, name, description, category, image = req?.file?.path} = req.body
    let existIngredients = await Ingredient.findOne({name:name})
    if(existIngredients){
        const urlParts = image.split('/')
        const firstPart = urlParts?.find(part => part === "images");
        const lastPart = urlParts![urlParts!.length - 1]
        const lastPartId = lastPart.split(".")[0];
        const path = `${firstPart}/${lastPartId}`
        cloudinary.uploader.destroy(path);
        next(new apiErrorResponse('Ingredient already existed'),400)
    }
    else{
        const updateIngredient = await Ingredient.findByIdAndUpdate(
            {_id},
            {
            name,
            description,
            image,
            category
            }
        )
        if (category) {
            await Category.findByIdAndUpdate({ _id: category }, { $push: { ingredients: updateIngredient?._id } })
        }
        const url = updateIngredient?.image?.split('/')
        const firstPart = url?.find(part => part === "images");
        const lastPart = url![url!.length - 1]
        const lastPartId = lastPart.split(".")[0];
        const path = `${firstPart}/${lastPartId}`
        cloudinary.uploader.destroy(path);
        res.status(200).json({
            success: true,
            data: updateIngredient
        })
    }
    } catch (err:any) {
        next(new apiErrorResponse(`${err.message}`,400))
    }
}

export const deleteIngredient = async (req:any, res:any, next:any) => {
    try {
    const {ingredientId} = req.params
    const deletedIngredient = await Ingredient.findByIdAndDelete(ingredientId)
    const url = deletedIngredient?.image
    const urlParts = url?.split('/')
    const firstPart = urlParts?.find(part => part === "images");
    const lastPart = urlParts![urlParts!.length - 1]
    const lastPartId = lastPart.split(".")[0];
    const path = `${firstPart}/${lastPartId}`
    cloudinary.uploader.destroy(path)
    if (!deletedIngredient){
        return(next (new apiErrorResponse('No such this ingredient'),404))
    } 
    res.status(200).json({
      success: true,
      message: "ingredient has been deleted",
      });
  } catch (error: any) {
    next(new apiErrorResponse(`${error.message}`, 500));
  }
}


export const getIngredients = async (req:any, res:any, next:any) => {
    try {
        const { id } = req.query
        const data = await Ingredient.find(id ? { _id: id } : {})
        res.status(200).json({ success: true, data })
    } catch (err:any) {
    next(new apiErrorResponse('No ingredient exist',400))
    }
}

export const ingredientDetail = async (req: any, res: any, next: any) => {
    const { id } = req.params;
  
    try {
      const ingredient = await Ingredient.findById(id)
        .populate({
          path: 'category',
          select: ['name', 'description'],
        })
        .exec();
      if (!ingredient) {
        return next(new apiErrorResponse('Ingredient does not exist', 400));
      }
      return res.status(200).json({
        ingredient,
      });
    } catch (error: any) {
      return next(new apiErrorResponse(`${error.message}`, 500));
    }
  }
