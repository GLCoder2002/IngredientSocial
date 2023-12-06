import { SmileOutlined } from '@ant-design/icons'
import { Divider, message, Space, Switch } from 'antd'
import { useEffect, useRef, useState } from 'react'
import Picker from 'emoji-picker-react'
import './style.css'
import useWindowSize from 'utils/useWindowSize'
import { Http } from 'api/http'
interface Commentprops {
  user: any
  postId?: string
  setComments?: void
  setCount?: void
  email?: string
  setUpdatePost?: any
}

export default function CreateComment(props: Commentprops) {
  const [picker, setPicker] = useState(false)
  const [text, setText] = useState<any>('')
  const [cursorPosition, setCursorPosition] = useState()
  const textRef = useRef<any>(null)

  const { user, postId, setUpdatePost } = props

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition
  }, [cursorPosition])
  
  const handleEmoji = (e:any, emojiObject:any) => {
    const ref = textRef.current
    ref?.focus()
    const start = text.substring(0, ref?.selectionStart)
    const end = text.substring(ref?.selectionStart)
    const newText = start + emojiObject.emoji + end
    setText(newText)
    setCursorPosition(start.length + emojiObject.emoji.length)
  }

  const handleSubmitComment = async () => {
    if (text.length === 0 || !text) {
      return message.error('Type your comment first !!')
    }
    const payload = {
      content: text,
      postId: postId,
    }
    setText('')

    await Http.post('/api/v1/comments/create', payload)
      .then(res => {
        setUpdatePost((prev:any) => ++prev)
        return message.success('Your comment are handled')
      })
      .catch((error:any) => message.error(`Something went wrong: ${error.response?.data?.message}`))
  }

  const _handleKeyDown = (e:any) => {
    if (e.key === 'Enter') {
      handleSubmitComment()
    }
  }

  return (
    <div className="create_comment_wrap" style={{
      position: 'relative',
    }}>
      <div className="create_comment">
        <img src={user?.avatar} alt={user?.username} />
        <div className="comment_input_wrap"
        >
          {picker && (
            <div className="comment_emoji_picker" style={{
              position: 'absolute',
              bottom: '50px'
            }}>
              <Picker onEmojiClick={(emoji:any, event:any) => handleEmoji(event, emoji)} />
            </div>
          )}
          <input
            type="text"
            ref={textRef}
            value={text}
            placeholder="Write a comment..."
            onChange={e => setText(e.target.value)}
            onKeyDown={e => _handleKeyDown(e)}
            autoComplete='off'
          />
          <div
            className="comment_circle_icon hover2"
            onClick={() => {
              setPicker(prev => !prev)
            }}
          >
            <i className="emoji_icon" style={{ color: '#9a9999', fontSize: '16px' }}>
              <SmileOutlined />
            </i>
          </div>
        </div>
      </div>
    </div>
  )
}
