import {
  CaretDownFilled,
  CaretUpFilled,
  CommentOutlined,
  FireTwoTone,
  ShareAltOutlined,
} from '@ant-design/icons'
import { Button, message, Space } from 'antd'
import { useEffect, useState } from 'react'
import { disLikeHandler,likeHandler } from './post-detail-service'
import PointInfoModal from './points-info-modal'
import { useSubscription } from 'libs/global-state-hooks'
import { userStore } from 'pages/auth/userStore'
import styled from 'styled-components'
import { Http } from 'api/http'
import { useSocket } from 'socket.io'

interface MenuBarProps{
  commentCount:any, 
  handleShowComment:any, 
  postId:any, 
  name:any, 
}
export default function MenuBar({ commentCount, handleShowComment, postId, name }:MenuBarProps) {
  const {appSocket} = useSocket()
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
    await Http.get(`/api/v1/posts/postReaction?postId=${id}`)
      .then(res => {
        setIsLiked(res.data.likes?.findIndex((like: any) => like._id === state._id) >= 0)
        setIsDisLiked(res.data.dislikes?.findIndex((like: any) => like._id === state._id) >= 0)
        setLikes(res.data.likes?.length)
        setDisLikes(res.data.dislikes?.length)
        setVotes(res.data.likes?.length - res.data.dislikes?.length)
        setLikers(res.data?.likes)
        setDisLikers(res.data?.dislikes)
      })
      .catch(error => {
        return message.error(error.message)
      })
  }

  const updateReaction = (info: any) => {
    if (info.user._id === state._id) return;
  
    if (info.action === 'like') {
      const dislikerIndex = dislikers?.findIndex(liker => liker._id === info.user._id);
      if (dislikerIndex >= 0) {
        setDisLikers(dislikers => dislikers?.filter(l => l._id !== info.user._id));
        setDisLikes(prev => prev - 1);
        setVotes(votesCount => votesCount + 1);
      }
  
      setLikers(prev => [...prev, info.user]);
      setVotes(votesCount => votesCount + 1);
      setLikes(prev => prev + 1);
    } else if (info.action === 'dislike') {
      const likerIndex = likers?.findIndex(liker => liker._id === info.user._id);
      if (likerIndex >= 0) {
        setLikers(likers => likers?.filter(l => l._id !== info.user._id));
        setLikes(prev => prev - 1);
        setVotes(votesCount => votesCount - 1);
      }
  
      setDisLikers(prev => [...prev, info.user]);
      setVotes(votesCount => votesCount - 1);
      setDisLikes(prev => prev + 1);
    } else if (info.action === 'omit') {
      const dislikerIndex = dislikers?.findIndex(liker => liker._id === info.user._id);
      const likerIndex = likers?.findIndex(liker => liker._id === info.user._id);
  
      if (dislikerIndex >= 0) {
        setDisLikers(dislikers => dislikers?.filter(l => l._id !== info.user._id));
        setDisLikes(prev => prev - 1);
        setVotes(votesCount => votesCount + 1);
      } else if (likerIndex >= 0) {
        setLikers(likers => likers?.filter(l => l._id !== info.user._id));
        setLikes(prev => prev - 1);
        setVotes(votesCount => votesCount - 1);
      }
    }
  };

  

  useEffect(() => {
    appSocket?.on('votes', (data:any) => {
      if (data.postId === postId) {
        updateReaction(data)
      }
    })
    return () => {
      appSocket?.off('votes')
    }
  }, [updateReaction])

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
        likers = likers?.filter(l => l._id !== state._id)
        return likers
      })
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
        dislikers = dislikers?.filter(l => l._id !== state._id)
        return dislikers
      })
    }
  }

  const handleDislikePost = async () => {
    if (isDisLiked) {
      setVotes(votesCount => votesCount + 1)
      setDisLikes(dislikesCount => dislikesCount - 1)
      setIsDisLiked(isDisLiked => !isDisLiked)
      setDisLikers(dislikers => {
        dislikers = dislikers?.filter(l => l._id !== state._id)
        return dislikers
      })
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
        likers = likers?.filter(l => l._id !== state._id)
        return likers
      })
      setDisLikers(dislikers => [...dislikers, { _id: state._id, name: state.username, avatar: state.avatar }])
    }
  }

  return (
    <>
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
            <SpaceDiv>
              {isLiked ? (
                <ButtonLike
                  shape="round"
                  icon={<CaretUpFilled />}
                  onClick={() => handleLikePost()}
                  type="primary"
                  style={{ background: '#464F54', color: '#F2FDF7' }}
                >
                  {likesCount}
                </ButtonLike>
              ) : (
                <ButtonLike shape="round" icon={<CaretUpFilled />} onClick={() => handleLikePost()} type="text">
                  {likesCount}
                </ButtonLike>
              )}
              {isDisLiked ? (
                <ButtonDislike
                  shape="round"
                  icon={<CaretDownFilled />}
                  onClick={() => handleDislikePost()}
                  type="primary"
                  style={{ backgroundColor: '#464F54', color: '#FFADA1' }}
                >
                  {dislikesCount}
                </ButtonDislike>
              ) : (
                <ButtonDislike
                  shape="round"
                  icon={<CaretDownFilled />}
                  onClick={() => handleDislikePost()}
                  type="text"
                >
                  {dislikesCount}
                </ButtonDislike>
              )}
            </SpaceDiv>
            <Button icon={<CommentOutlined />} onClick={() => handleShowComment()} style={{ cursor: 'pointer' }}>
              {commentCount} Comments
            </Button>
            <Button icon={<ShareAltOutlined />}>Share</Button>
          </Space>
        </>
      <PointInfoModal
        isOpen={openModal}
        onCloseModal={() => setOpenModal(false)}
        likers={likers}
        unlikers={dislikers}
      />
    </>
  )
}
const SpaceDiv = styled(Space)`
  margin: auto;
  display: flex;
  text-align: center;
  justify-content: center;
  background-color: #e5e0e2;
  width: auto;
  border-radius: 100px;
  gap: 0 !important;
`

const ButtonLike = styled(Button)`
  border-bottom-right-radius: 0 !important;
  border-top-right-radius: 0 !important;
`

const ButtonDislike = styled(Button)`
  border-bottom-left-radius: 0 !important;
  border-top-left-radius: 0 !important;
`
