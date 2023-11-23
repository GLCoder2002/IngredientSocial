import { SmileOutlined } from '@ant-design/icons'
import { Divider, message, Space, Switch } from 'antd'
import { useEffect, useRef, useState } from 'react'
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
  const windowWidth = useWindowSize()
  const [picker, setPicker] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [text, setText] = useState<any>('')
  const [cursorPosition, setCursorPosition] = useState()
  const textRef = useRef(null)

  const { user, postId, setComments, setCount, email, setUpdatePost } = props

  // useEffect(() => {
  //   textRef?.current?.selectionEnd? = cursorPosition
  // }, [cursorPosition])
  // const handleEmoji = (e:any, emojiObject:any) => {
  //   const ref = textRef.current
  //   ref?.focus()
  //   const start = text.substring(0, ref?.selectionStart)
  //   const end = text.substring(ref?.selectionStart)
  //   const newText = start + emojiObject.emoji + end
  //   setText(newText)
  //   setCursorPosition(start.length + emojiObject.emoji.length)
  // }

  const handleSubmitComment = async () => {
    if (text.length === 0 || !text) {
      return message.error('Type your comment first !!')
    }
    const payload = {
      content: text,
      postId: postId,
      isAnonymous: isAnonymous,
    }
    setText('')

    await Http.post('/api/v1/comment/create', payload)
      .then(res => {
        setUpdatePost((prev:any) => ++prev)
        return message.success('Your comment are hanlded')
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
        <img src={user?.avatar} alt={user?.name} />
        <div className="comment_input_wrap"
        
        >
          {picker && (
            <div className="comment_emoji_picker" style={{
              position: 'absolute',
              bottom: '50px'
            }}>
              {/* <Picker onEmojiClick={(emoji, event) => handleEmoji(event, emoji)} /> */}
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
          <Divider type="vertical" style={{ color: 'black' }}></Divider>
          <Space style={{ justifyContent: 'end', display: 'flex', paddingLeft: '5px' }} direction="horizontal">
            {windowWidth > 1000 ? 'Anonymous:' : '🎭'}
            <Switch onChange={() => setIsAnonymous(!isAnonymous)} checkedChildren="On" unCheckedChildren="Off" />
          </Space>
          {/* <div className="comment_circle_icon hover2">
            <i className="gif_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="sticker_icon"></i>
          </div> */}
        </div>
      </div>
    </div>
  )
}
