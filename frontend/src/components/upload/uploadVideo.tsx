// import { Http } from "api/http";

// const data = new FormData();
// data.append("file", 'image');
// data.append("timestamp", timestamp);
// data.append("signature", signature);
// data.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
// data.append("folder", 'image');


// const fetchAllToCloud = async (url:any, file:any) => {
//   try {
//   const urlRequest = `https://api.cloudinary.com/v1_1/draisiudw/image/upload`;
//   const uploadConfig = await Http.get(urlRequest)
//   const uploadToCloud = await axios.post(api, data);
//   const { secure_url } = res.data;
//   console.log(secure_url);
//   return secure_url;
// } catch (error) {
//   console.error(error);
// }

// }


// export const getSignatureForUpload = async (files:any) => {
// try {
//   const url = '/api/v1/ingredients/upLoadImage'
//   const requests = files.map(async(file:any)=>{
//     return await fetchAllToCloud(url,file).then(result => result)
//   })
//   return Promise.all(requests)
// } catch (error) {
//   console.error(error);
// }
// }
export {}