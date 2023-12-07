import {
  ClockCircleFilled,
  DeleteTwoTone,
  EditTwoTone,
  EyeOutlined,
  FireTwoTone,
  MessageTwoTone,
} from '@ant-design/icons'
import { Avatar, Empty, List, Popconfirm, Skeleton, Space, Tag, Typography, Card } from 'antd'
import { useEffect, useState } from 'react'
import useWindowSize from '../../utils/useWindowSize'
import { formatDayTime } from 'utils/helperFormat'
import { useSubscription } from 'libs/global-state-hooks'
import { userStore } from 'pages/auth/userStore'
import useRoleNavigate from 'libs/role-navigate'
import { handleDeletePost } from './post-detail/post-detail-service'
import styled from 'styled-components';
import ReactPlayer from 'react-player'

const { Text, Link } = Typography

function PostStyleCard({ post, isLoading, width, height }:any) {
  const windowWidth = useWindowSize()
  const [open, setOpen] = useState(false)
  const { _id, role } = useSubscription(userStore).state
  const navigate = useRoleNavigate()
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)

  const onChange = (checked: boolean) => {
    setLoading(isLoading)
  }
  useEffect(() => {
    onChange(loading)
  }, [isDeleted, setIsDeleted])

  const description = post.content?.replace(/(<([^>]+)>)/gi, '').slice(0, 70) + '...'
  const showPopconfirm = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setIsDeleted(true)
    setOpen(false)
    return handleDeletePost(post?._id)
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }

  const handleViewDetail = (id:any) => {
    navigate(`/post?id=${id}`)
  }

  const handleViewProfile = (id:any) => {
      navigate(`/profile?id=${id}`)
  }

  const actions =
    post?.posterId?._id === _id
      ? [
          <EditTwoTone key="edit" onClick={() => navigate(`/post/edit?id=${post?._id}`)} />,
          <Popconfirm
            title="Warning"
            description="Are you sure to delete it?"
            open={open}
            onConfirm={handleOk}
            onCancel={handleCancel}
          >
            <DeleteTwoTone key="delete" onClick={showPopconfirm} />
          </Popconfirm>,
        ]
      : []
  return isDeleted ? (
    <>
      <StyledCard
        style={{
          width: '100%',
          marginTop: 16,
        }}
        bodyStyle={{ padding: '2px' }}
      >
        <Empty
          description={
            <h4 style={{ color: '#FA6900' }}>This post has been deleted, reload and it'll be disappeared</h4>
          }
        />
      </StyledCard>
    </>
  ) : (
    <>
      <StyledCard
        style={{
          width: '100%',
          marginTop: 16,
        }}
        bodyStyle={{ padding: '2px' }}
        actions={actions}
      >
        <Skeleton loading={loading} avatar active>
          <List.Item
            actions={
              windowWidth > 900
                ? [
                    <Text strong key="list-vertical-star-o">
                      <FireTwoTone twoToneColor={'#FE4365'} style={{ padding: '5px' }} />
                      {post?.meta?.likesCount - post?.meta?.dislikesCount || 0} points
                    </Text>,
                    <Text key="list-vertical-like-o">
                      <Tag color="cyan" style={{ margin: 0 }}>
                        <MessageTwoTone /> {post?.comments?.length} comments
                      </Tag>
                    </Text>,
                    <Text type="secondary" key="list-vertical-message">
                      <EyeOutlined style={{ padding: '5px' }} />
                      {post.meta.views} views
                    </Text>,
                  ]
                : [
                    <Text strong key="list-vertical-star-o">
                      <FireTwoTone style={{ paddingRight: '2px' }} />
                      {post.like - post.dislike}
                    </Text>,
                    <Text key="list-vertical-like-o">
                      <Tag color="cyan">
                        <MessageTwoTone /> {post?.comments?.length}
                      </Tag>
                    </Text>,
                    <Text type="secondary" key="list-vertical-message">
                      <EyeOutlined style={{ paddingRight: '2px' }} />
                      {post.views}
                    </Text>,
                  ]
            }
          >
            <List.Item.Meta
              key={post._id}
              avatar={
              <Avatar style={{ margin: '0px' }} size={45} src={post?.posterId?.avatar} />
              }
              title={
                <Space wrap direction="horizontal" size={'small'}>
                  <Link
                    onClick={() =>
                      handleViewProfile(post.posterId?._id)
                    }
                    style={{ fontSize: '15px', fontWeight: '500', marginRight: '10px' }}
                  >
                    {post.posterId?.username}
                  </Link>
                  <Typography.Text type="secondary">
                    <ClockCircleFilled /> Posted {formatDayTime(post.createdAt)}
                  </Typography.Text>
                </Space>
              }
              style={{ margin: '0' }}
            />
            <List.Item.Meta
              style={{ margin: '0' }}
              key="01"
              title={
                <>
                <Link>
                  <StyleTitle level={4} style={{ margin: 0 }} onClick={() => handleViewDetail(post._id)}>
                    {post.title}
                  </StyleTitle>
                </Link>
                </>
              }
              description={
                <>
                <Typography.Text type="secondary">{description}</Typography.Text>
                {role === 'admin' ? (
                  <ReactPlayer
                  style={{paddingTop:'5px'}}
                  url = {post.video}
                  light = {true}
                  controls = {true}
                  width='940px'
                  height='300px'
                  />)
                  : 
                  ( <ReactPlayer
                    url = {post.video}
                    light = {true}
                    controls = {true}
                    width={width}
                    height={height}
                    />)
                }
                </>
              }
            />
          </List.Item>
        </Skeleton>
      </StyledCard>
    </>
  )
}

const StyledCard = styled(Card)`
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`
const StyleTitle = styled(Typography.Title)`
  margin: 0px;
  &:hover {
    color: #007e80;
  }
`

export default PostStyleCard
