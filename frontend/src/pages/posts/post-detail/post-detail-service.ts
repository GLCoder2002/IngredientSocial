
import { message } from 'antd'
import axios from 'axios'
import { SERVER_ENDPOINT } from '../../../api/server-url'
import { Http } from 'api/http'

export const likeHandler = async (id: any) => {
  try {
    const result = await Http.put('/api/v1/post/like', { postId: id })
    console.log('like', result)
  } catch (e) {
    console.error(e)
  }
}

export const omitHandler = async (id: any) => {
  try {
    const result = await Http.put('/api/v1/post/omitVote', { postId: id })
    console.log('dont like', result)
  } catch (e) {
    console.error(e)
  }
}

export const disLikeHandler = async (id: any) => {
  try {
    const result = await Http.put('/api/v1/post/dislike', { postId: id })
    console.log('dislike', result)
  } catch (e) {
    console.error(e)
  }
}
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export const handleDownloadFiles = async (id: any, name: any, files?: Array<string>) => {
  if (!files || files?.length === 0) {
    return message.warning('No files attachment in this post or selected ~.~')
  }
  const token = Http._getHeader()
  const options = {
    headers: {
      ...token,
      'Content-Type': 'application/zip; charset=utf-8',
    },
    params: {},
    responseType: 'arraybuffer' as ResponseType,
  }
  const fileName = name ? `${name + '...'}.zip` : 'attachments.zip'
  await axios
    .get(`${SERVER_ENDPOINT}/api/v1/post/downloadFiles?id=${id}`, options)
    .then(res => {
      message.success('The attachments are handled and downloaded!!')
      return new Blob([res.data], { type: 'application/zip' })
    })
    .then(blob => {
      // const href = window.URL.createObjectURL(blob)
      // const link = document.createElement('a')
      // link.href = href
      // link.setAttribute('download', 'attachments.7z')
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
      console.log(blob)
      //saveAs(blob, `${fileName}`)
    })
    .catch(err => Promise.reject(() => message.error(err)))
}


export const handleDeletePost = async (id: any) => {
  try {
    const result = await Http.delete('/api/v1/post/delete', id)
    console.log('post deleted', result)
    message.success('post deleted')
  } catch (e: any) {
    message.error(e.message)
  }
}