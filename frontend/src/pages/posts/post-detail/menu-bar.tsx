import {
  CaretDownFilled,
  CaretUpFilled,
  CommentOutlined,
  DownloadOutlined,
  FireTwoTone,
  ShareAltOutlined,
} from '@ant-design/icons'
import { Button, message, Radio, Space, Typography } from 'antd'

import { useEffect, useState } from 'react'
import useWindowSize from '../../../utils/useWindowSize'
import { disLikeHandler, handleDownloadFiles, likeHandler, omitHandler } from './post-detail-service'
import PointInfoModal from './points-info-modal'
import { useSubscription } from 'libs/global-state-hooks'
import { userStore } from 'pages/auth/userStore'
import { Http } from 'api/http'
//import { useSocket } from 'next/socket.io'

let reactionTimeOut:any = null
interface MenuBarProps{
  commentCount:any, 
  handleShowComment:any, 
  postId:any, 
  name:any, 
}
export default function MenuBar({ commentCount, handleShowComment, postId, name }:MenuBarProps) {
  //const { appSocket } = useSocket()
  const windowWidth = useWindowSize()
  const [likers, setLikers] = useState<any[]>([])
  const [dislikers, setDisLikers] = useState<any[]>([])
  const { state } = useSubscription(userStore)
  const [likesCount, setLikes] = useState(0)
  const [dislikesCount, setDisLikes] = useState(0)
  const [votesCount, setVotes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisLiked, setIsDisLiked] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const fetchLikes = async (id: any) => {
    await Http.get(`/api/v1/post/postLikes?postId=${id}`)
      .then(res => {
        setIsLiked(res.data.likes.findIndex((like: any) => like._id === state._id) >= 0)
        setIsDisLiked(res.data.dislikes.findIndex((like: any) => like._id === state._id) >= 0)
        setLikes(res.data.likes.length)
        setDisLikes(res.data.dislikes.length)
        setVotes(res.data.likes.length - res.data.dislikes.length)
        setLikers(res.data.likes)
        setDisLikers(res.data.dislikes)
      })
      .catch(error => {
        return message.error(error.message)
      })
  }

  const updateVoteRealTime = (info:any) => {
    if (info.user._id === state._id) return
    if (info.action === 'like') {
      if (dislikers.map(liker => liker._id).indexOf(info.user._id) >= 0) {
        setDisLikers(dislikers => {
          dislikers = dislikers.filter(l => l._id !== info.user._id)
          return dislikers
        })
        setDisLikes(prev => prev - 1)
        setVotes(votesCount => votesCount + 1)
      }
      setLikers(prev => [...prev, info.user])
      setVotes(votesCount => votesCount + 1)
      return setLikes(prev => prev + 1)
    } else if (info.action === 'dislike') {
      if (likers.map(liker => liker._id).indexOf(info.user._id) >= 0) {
        setLikers(likers => {
          likers = likers.filter(l => l._id !== info.user._id)
          return likers
        })
        setLikes(prev => prev - 1)
        setVotes(votesCount => votesCount - 1)
      }
      setDisLikers(prev => [...prev, info.user])
      setVotes(votesCount => votesCount - 1)
      return setDisLikes(prev => prev + 1)
    } else if (info.action === 'omit') {
      if (dislikers.map(liker => liker._id).indexOf(info.user._id) >= 0) {
        setDisLikers(dislikers => {
          dislikers = dislikers.filter(l => l._id !== info.user._id)
          return dislikers
        })
        setDisLikes(prev => prev - 1)
        setVotes(votesCount => votesCount + 1)
      } else if (likers.map(liker => liker._id).indexOf(info.user._id) >= 0) {
        setLikers(likers => {
          likers = likers.filter(l => l._id !== info.user._id)
          return likers
        })
        setLikes(prev => prev - 1)
        setVotes(votesCount => votesCount - 1)
      }
    }
  }

  // useEffect(() => {
  //   appSocket.on('votes', data => {
  //     if (data.postId === postId) {
  //       updateVoteRealTime(data)
  //     }
  //   })
  //   return () => {
  //     appSocket.off('votes')
  //   }
  // }, [updateVoteRealTime])

  useEffect(() => {
    return () => {
      if (isLiked) {
        likeHandler(postId)
      } else if (isDisLiked) {
        disLikeHandler(postId)
      }
    }
  }, [isLiked, isDisLiked])

  useEffect(() => {
    fetchLikes(postId)
  }, [postId])

  const handleLikePost = async () => {
    if (isLiked) {
      setVotes(votesCount => votesCount - 1)
      setLikes(likesCount => likesCount - 1)
      setIsLiked(isLiked => !isLiked)
      setLikers(likers => {
        likers = likers.filter(l => l._id !== state._id)
        return likers
      })
      reactionTimeOut && clearTimeout(reactionTimeOut)
      reactionTimeOut = setTimeout(() => omitHandler(postId), 200)
    } else {
      setVotes(votesCount => votesCount + 1)
      if (isDisLiked) {
        setDisLikes(dislikesCount => dislikesCount - 1)
        setIsDisLiked(isDisLiked => !isDisLiked)
        setVotes(votesCount => votesCount + 1)
      }
      setIsLiked(isLiked => !isLiked)
      setLikes(likesCount => likesCount + 1)
      setLikers(likers => [...likers, { _id: state._id, name: state.username, avatar: state.avatar }])
      setDisLikers(dislikers => {
        dislikers = dislikers.filter(l => l._id !== state._id)
        return dislikers
      })
      reactionTimeOut && clearTimeout(reactionTimeOut)
      reactionTimeOut = setTimeout(() => likeHandler(postId), 500)
    }
  }

  const handleDislikePost = async () => {
    if (isDisLiked) {
      setVotes(votesCount => votesCount + 1)
      setDisLikes(dislikesCount => dislikesCount - 1)
      setIsDisLiked(isDisLiked => !isDisLiked)
      setDisLikers(dislikers => {
        dislikers = dislikers.filter(l => l._id !== state._id)
        return dislikers
      })
      reactionTimeOut && clearTimeout(reactionTimeOut)
      reactionTimeOut = setTimeout(() => omitHandler(postId), 200)
    } else {
      setVotes(votesCount => votesCount - 1)
      if (isLiked) {
        setIsLiked(isLiked => !isLiked)
        setVotes(votesCount => votesCount - 1)
        setLikes(votesCount => votesCount - 1)
      }
      setDisLikes(dislikesCount => dislikesCount + 1)
      setIsDisLiked(isDisLiked => !isDisLiked)
      setLikers(likers => {
        likers = likers.filter(l => l._id !== state._id)
        return likers
      })
      setDisLikers(dislikers => [...dislikers, { _id: state._id, name: state.username, avatar: state.avatar }])
      reactionTimeOut && clearTimeout(reactionTimeOut)
      reactionTimeOut = setTimeout(() => disLikeHandler(postId), 500)
    }
  }

  return (
    <>
      {windowWidth > 969 ? (
        <>
          <Space
            style={{
              justifyContent: 'start',
              display: 'flex',
              padding: '20px 20px 0 20px',
              marginLeft: '4px',
              marginBottom: 0,
            }}
          >
            <Button
              icon={<FireTwoTone twoToneColor="#eb2f96" style={{}} />}
              onClick={() => setOpenModal(true)}
              type="link"
              style={{}}
              size="middle"
            >
              {votesCount} points
            </Button>
          </Space>
          <Space
            style={{
              justifyContent: 'start',
              display: 'flex',
              padding: '5px 20px 15px 20px',
              marginLeft: '4px',
              marginBottom: 0,
            }}
          >
            <Space>
              {isLiked ? (
                <Button
                  shape="round"
                  icon={<CaretUpFilled />}
                  onClick={() => handleLikePost()}
                  type="primary"
                  style={{ background: '#464F54', color: '#F2FDF7' }}
                >
                  {likesCount}
                </Button>
              ) : (
                <Button shape="round" icon={<CaretUpFilled />} onClick={() => handleLikePost()} type="text">
                  {likesCount}
                </Button>
              )}
              {isDisLiked ? (
                <Button
                  shape="round"
                  icon={<CaretDownFilled />}
                  onClick={() => handleDislikePost()}
                  type="primary"
                  style={{ backgroundColor: '#464F54', color: '#FFADA1' }}
                >
                  {dislikesCount}
                </Button>
              ) : (
                <Button
                  shape="round"
                  icon={<CaretDownFilled />}
                  onClick={() => handleDislikePost()}
                  type="text"
                >
                  {dislikesCount}
                </Button>
              )}
            </Space>
            <Button icon={<CommentOutlined />} onClick={() => handleShowComment()} style={{ cursor: 'pointer' }}>
              {commentCount} Comments
            </Button>
            <Button icon={<ShareAltOutlined />}>Share</Button>
          </Space>
        </>
      ) : (
        <MobileMenuBar
            vote={votesCount}
            commentCount={commentCount}
            handleShowComment={handleShowComment}
            postId={postId} files={undefined}        />
      )}
      <PointInfoModal
        isOpen={openModal}
        onCloseModal={() => setOpenModal(false)}
        likers={likers}
        unlikers={dislikers}
      />
    </>
  )
}

function str2bytes(str:any) {
  var bytes = new Uint8Array(str.length)
  for (var i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i)
  }
  return bytes
}
interface MobileMenuBarProps{
  vote:any,
  commentCount:number, 
  handleShowComment:any, 
  postId:any, 
  files:any
}
function MobileMenuBar({ vote, commentCount, handleShowComment, postId, files }:MobileMenuBarProps){
  return (
    <Space style={{ justifyContent: 'space-evenly', display: 'flex' }}>
      <Radio.Group>
        <Radio.Button value="like">
          <CaretUpFilled />
          <Typography.Text strong style={{ marginLeft: '0', width: '100%', fontSize: '13.5px', color: '#948C75' }}>
            {vote >= 0 ? <>+{vote}</> : <>{vote}</>}
          </Typography.Text>
        </Radio.Button>
        <Radio.Button value="dislike">
          <CaretDownFilled />
        </Radio.Button>
      </Radio.Group>
      <Button icon={<CommentOutlined />} onTouchEnd={() => handleShowComment()} style={{ cursor: 'pointer' }}>
        {commentCount}
      </Button>
      <Button icon={<DownloadOutlined />} onTouchEnd={() => handleDownloadFiles(postId, 'attachment', files)} />
      <Button icon={<ShareAltOutlined />} />
    </Space>
  )
}

// const Space = styled(Space)`
//   margin: auto;
//   display: flex;
//   text-align: center;
//   justify-content: center;
//   background-color: #e5e0e2;
//   width: auto;
//   border-radius: 100px;
//   gap: 0 !important;
// `

// const Button = styled(Button)`
//   border-bottom-right-radius: 0 !important;
//   border-top-right-radius: 0 !important;
// `

// const Button = styled(Button)`
//   border-bottom-left-radius: 0 !important;
//   border-top-left-radius: 0 !important;
// `
