import mongoose from 'mongoose'

const connectToDb = async (DB_URL: string): Promise<void> => {
  try {
    await mongoose.connect(DB_URL)
    console.log('Connected to DB !!')
  } catch (e) {
    console.log(`Cannot connect to DB!!, log:`, e)
    throw e
  }
}
export default connectToDb
