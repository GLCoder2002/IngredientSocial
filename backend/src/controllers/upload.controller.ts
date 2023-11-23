import apiErrorResponse from "../utils/apiErrorResponse"
import cloudinary from "../utils/cloudconfig"

export const uploadFile = async (req:any, res:any, next: any) => {
    try {
        const file = req?.file?.path
        return res.status(201).json({success:true, file })
    } catch (error:any) {
        next(new apiErrorResponse(`${error.message}`,400))
    }
}

export const deleteFile = async (req:any, res:any, next:any) => {
    const publicId = req?.params?.public_id?.public_id;
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Failed to delete image' });
      } else {
        console.log('Image deleted:', result);
        res.json({ message: 'Image deleted' });
      }
    });
  }