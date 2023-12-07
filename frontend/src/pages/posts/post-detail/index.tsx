import {
  Card,
  Layout,
  Space,
  Spin,
  Typography,
  message
} from 'antd'
import {Content} from 'antd/es/layout/layout'
import {useEffect, useState} from 'react'
import useWindowSize from '../../../utils/useWindowSize'
import CommentsList from '../../comments/comments-list'
import MenuBar from './menu-bar'
import {useQuery} from 'utils/useQuery'
import {useSubscription} from 'libs/global-state-hooks'
import {userStore} from 'pages/auth/userStore'
import {Http} from 'api/http'
import CreateComment from 'pages/comments/create-comment'
import PostDetailInfo from './post-detail-info'
import styled from 'styled-components';
import { useSocket } from 'socket.io'
import ReactPlayer from 'react-player'

const {Text, Link} = Typography

function PostDetail() { 
  const [data, setData] = useState <any>([])
  const [showComment, setShowComment] = useState(false)
  const {appSocket} = useSocket()
  const [updatePost, setUpdatePost] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const query = useQuery()
  const id = query.get('id')
  const {username, avatar} = useSubscription(userStore).state
  const windowWidth = useWindowSize()
  const { role } = useSubscription(userStore).state
  const padding = windowWidth < 969 ? '10px 0' : '15px 60px 50px'

  const handleShowComment = () => {
    setShowComment(!showComment)
  }

  useEffect(() => {
    setLoading(true)
    const getPost = async () => 
    await Http.get(`/api/v1/posts/detail?id=${id}`).then(res => {
      setData([res.data.data])
      setCommentCount(res.data.data.comments.length)
    })
    .catch(error => message.error('Failed to fetch post !'))
    .finally(() => setLoading(false))
    getPost()
  }, [])

  const updateCommentLength = (info : any) => {
    if (info.action === 'create') {
      return setCommentCount(commentCount + 1)
    } else {
      return setCommentCount(commentCount - 1)
    }
  }

  useEffect(() => {
    appSocket?.on('comments', (data:any) => {
      if (data.ideaId === id) {
        updateCommentLength(data)
      }
    })
    return () => {
      appSocket?.off('comments')
    }
  }, [updateCommentLength])

  return (
    <> 
    {!loading ? (
        <Layout className="layout"
          style={
            {padding: padding}
        }>
          <Card>
            <Content>
            <Space direction="horizontal" align="start">
              <Space style={{padding: '16px 28px 0'}}
                direction="vertical">
                <PostDetailInfo item={data[0]}></PostDetailInfo>
                <Space>
                  The recipe include: 
                  {data[0]?.ingredients.length !== 0
                    ? data[0]?.ingredients?.map((ingredient:any,index:any) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: '#f4f4f5',
                            color: '#9ba1af',
                            padding: '5px',
                            borderRadius: '5px',
                            border: '2px',
                          }}
                        >
                          {ingredient.name} 
                        </div>
                      ))
                    : null}
                </Space>
                <ReadMore>{data[0]?.content}</ReadMore>
                {role === 'admin' ? (
                  <ReactPlayer
                  style={{paddingTop:'5px'}}
                  url = {data[0]?.video}
                  light = {true}
                  controls = {true}
                  width='900px'
                  height='300px'
                  />)
                  : 
                  ( <ReactPlayer
                    url = {data[0]?.video}
                    light = {true}
                    controls = {true}
                    width='650px'
                    height='300px'
                    />)
                }
              </Space>
            </Space>
            <MenuBar commentCount={commentCount}
              postId={id}
              handleShowComment={handleShowComment}
              name={
                data[0]?.title
              }/>
          </Content>
            <Content>
              <Space style={
                  {
                    padding: '10px 24px',
                    width: '100%'
                  }
                }
                direction="vertical">
                <Text>
                  Comment as <Space/> 
                  <Text strong>
                    {username}
                  </Text>
                </Text>
                <CreateComment user={
                    {avatar, username}
                  }
                  setUpdatePost={setUpdatePost}
                  email={
                    data[0]?.posterId?.email
                  }/>
              </Space> 
            </Content>
          </Card>
           
          {
          showComment ? (
            <ContentStyle>
              <div style={
                {width: '100%'}
              }>
                <CommentsList id={id}
                  updatePost={updatePost}/>
              </div>
            </ContentStyle>
          ) : null
        } </Layout>
      ) : (
        <>
          <Spin tip="Loading, wait a few" size="large"
            style={
              {marginTop: 80}
          }>
            <div className="content"
              style={
                {
                  width: '200px',
                  textAlign: 'center'
                }
            }>
              {' '}
              ...{' '} </div>
          </Spin>
        </>
      )}
    {' '} </>
  )
}

export default PostDetail

function ReadMore({children} : {
  children : any
}) {
  const text: string = children
  const [isReadMore, setIsReadMore] = useState(true)
  const textDisplay: string = isReadMore ? text?.slice(0, 1500) : text
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }
  return (
    <>
      <RenderHtml text={textDisplay}></RenderHtml>
      <Link onClick={toggleReadMore}
        className="read-or-hide">
        {
        isReadMore ? '...read more' : ' show less'
      }
        {' '} </Link>
    </>
  )
}

export function RenderHtml(prop : any) {
  const {text} = prop
  return <div style={
      {margin: 0}
    }
    dangerouslySetInnerHTML={
      {__html: text}
  }></div>
}

const ContentStyle = styled(Content)`
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  height: 100%;
  padding-bottom: 16px;
  margin-bottom: 16px;
`
