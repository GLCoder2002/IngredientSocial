import { authProtect, authorize } from "../middlewares/auth";
import { createIngredient, deleteIngredient, getIngredients, ingredientDetail, updateIngredient } from "../controllers/ingredient.controller";
import express from "express";
import { uploadMulter } from "../utils/cloudconfig";

const ingredientRouter = express.Router()
ingredientRouter.post('/create', uploadMulter.single('image'), createIngredient, authProtect, authorize(['admin']))
ingredientRouter.get('/', getIngredients, authProtect)
ingredientRouter.put('/update/:id',uploadMulter.single('image'), updateIngredient, authProtect, authorize(['admin']))
ingredientRouter.delete('/delete/:ingredientId', deleteIngredient, authProtect, authorize(['admin']))
ingredientRouter.get('/detail/:id', ingredientDetail, authProtect)
export default ingredientRouter

