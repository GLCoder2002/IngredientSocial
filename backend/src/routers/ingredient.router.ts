import { authProtect, authorize } from "../middlewares/auth";
import { createIngredient, deleteIngredient, getIngredients, ingredientDetail, updateIngredient } from "../controllers/ingredients.controller";
import express from "express";
import { uploadMulter } from "../utils/cloudconfig";
import { deleteFile } from "../controllers/upload.controller";

const ingredientRouter = express.Router()
ingredientRouter.post('/create', uploadMulter.single('image'), createIngredient, authProtect, authorize(['admin']))
ingredientRouter.get('/', getIngredients, authProtect)
ingredientRouter.put('/update/:id',uploadMulter.single('image'), updateIngredient, authProtect, authorize(['admin']))
ingredientRouter.delete('/delete/:id', deleteIngredient, authProtect, authorize(['admin']))
ingredientRouter.get('/detail/:id', ingredientDetail, authProtect)
ingredientRouter.delete('/:id',deleteFile)
export default ingredientRouter

