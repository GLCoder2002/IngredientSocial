import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Upload, message } from 'antd'

const validFileType = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/avif',
  'image/jpg',
  'image/x-icon',
  'video/mp4'
]

const checkFileFunc = (file: any) => {
  const checkType = validFileType.includes(file.type)
  const checkSize = file.size <= 50*1024*1024
  console.log('size', checkSize, file.size)
  console.log('type', checkType, file.type)
  if (!checkSize || !checkType) {
    return false
  } else {
    return true
  }
}

export const handleValidateFile = (e: any) => {
  const filelist = e?.fileList
  const validFile = filelist.flatMap((file: any) => {
    const checkFile = checkFileFunc(file)
    if (!checkFile) {
      return []
    } else {
      return file
    }
  })
  return validFile
}

export const onChangeUpload = (e:any) => {
  const checkFile = checkFileFunc(e)
  if (!checkFile) {
    message.error('Your file is invalid, over 50Mb or invalid type')
    e.status = 'error'
    e.response = 'This file is invalid (maybe invalid file type or over 50Mb), please remove this one before upload'
  } else {
    e.status = 'done'
    e.response = 'File is valid'
  }
  return false
}

export const previewFile = (image:any) => {
  const checkFile = checkFileFunc(image)
  if (!checkFile) {
    image.url = 'https://freeiconshop.com/wp-content/uploads/edd/document-error-flat.png'
  }
  return image?.thumbUrl ?? ''
}

export function ImageUpload() {
  return (
      <Upload
        name="logo"
        listType="picture"
        onPreview={previewFile}
        accept="image/*"
        onChange={e=>e.file.originFileObj}
        beforeUpload={file => onChangeUpload(file)}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
  )
}
