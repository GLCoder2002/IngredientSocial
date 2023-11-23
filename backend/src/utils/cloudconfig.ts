import multer from "multer";
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
 cloudinary: cloudinary,
 params: (req, file) => {
  return {
    folder: file.mimetype.startsWith('image') ? 'images' : 'videos',
    resource_type: file.mimetype.startsWith('image') ? 'image' : 'video',
  };
},
});

export const uploadMulter = multer({storage:storage})

cloudinary.config({ 
  cloud_name:'draisiudw' , 
  api_key: '146615774975694', 
  api_secret: 'aXi7JHwD2ttxq_5qeHfCcU6jwSw'
});

export default cloudinary