import express from 'express'
import { authorize, authProtect } from '../middlewares/auth'
import Category from '../models/Category'



export const categoryRouter = express.Router()

categoryRouter.get('/', authProtect, async (req, res) => {
  try {
    const { id } = req.query
    const data = await Category.find(id ? { _id: id } : {})
    res.status(200).json({ success: 1, data })
  } catch (err:any) {
    res.status(500).json({
      message: err.message,
    })
  }
})

categoryRouter.post('/', authProtect, authorize(['admin']), express.json(), async (req, res) => {
  try {
    const { _id, name, description } = req.body
    if (_id) {
      await Category.findOneAndUpdate(
        { _id },
        {
          name,
          description
        },
        { upsert: true, timestamps: true }
      )
    } else {
      await Category.collection.insertOne({
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    res.status(200).json({ success: 1 })
    //updateIdeaNumberRealTime()
  } catch (err:any) {
    res.status(500).json({
      message: err.message,
    })
  }
})

categoryRouter.delete('/:id', authProtect, authorize(['admin']), express.json(), async (req, res) => {
  try {
    const eventId = req.params.id
    await Category.findByIdAndDelete(eventId)
    //updateIdeaNumberRealTime()

    res.status(200).json({ success: 1 })
  } catch (err:any) {
    res.status(500).json({
      message: err.message,
    })
  }
})
