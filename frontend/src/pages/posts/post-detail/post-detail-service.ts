
import { message } from 'antd'
import { Http } from 'api/http'

export const likeHandler = async (id: any) => {
  try {
    const result = await Http.put('/api/v1/posts/like', { postId: id })
    console.log('like', result)
  } catch (e) {
    console.error(e)
  }
}

export const disLikeHandler = async (id: any) => {
  try {
    const result = await Http.put('/api/v1/posts/dislike', { postId: id })
    console.log('dislike', result)
  } catch (e) {
    console.error(e)
  }
}

export const handleDeletePost = async (id: any) => {
  try {
    const result = await Http.delete('/api/v1/posts/delete', id)
    console.log('post deleted', result)
    message.success('post deleted')
  } catch (e: any) {
    message.error(e.message)
  }
}