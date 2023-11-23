import {
  ClockCircleFilled,
  DeleteTwoTone,
  EditTwoTone,
  EyeOutlined,
  FireTwoTone,
  LinkedinOutlined,
  LockTwoTone,
  MessageTwoTone,
  PaperClipOutlined,
  TagsTwoTone,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Card, Empty, List, Popconfirm, Skeleton, Space, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import useWindowSize from '../../utils/useWindowSize'
import { formatDayTime } from 'utils/helperFormat'
import { useSubscription } from 'libs/global-state-hooks'
import { userStore } from 'pages/auth/userStore'
import useRoleNavigate from 'libs/role-navigate'
import { handleDeletePost } from './post-detail/post-detail-service'

const { Text, Link, Title } = Typography

function PostCard({ post, isLoading }:{post:any,isLoading:any}) {
  const windowWidth = useWindowSize()
  const [open, setOpen] = useState(false)
  const { _id } = useSubscription(userStore).state
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
    if (id !== 'Anonymous' && id !== 'Unknown') {
      navigate(`/profile?id=${id}`)
    }
  }

  const actions =
    post?.posterId?._id === _id
      ? [
          <EditTwoTone key="edit" onClick={() => navigate(`/post/edit?id=${post?._id}`)} />,

          <Popconfirm
            title="Warning"
            description="Are you sure you wanna delete it??"
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
      <Card
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
      </Card>
    </>
  ) : (
    <>
      <Card
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
                    <Text key="list-vertical-lock">
                      <Tag color="volcano" style={{ margin: 0 }}>
                        <LockTwoTone /> cannot comments
                      </Tag>
                    </Text>,
                    <Text type="secondary" key="list-vertical-message">
                      <EyeOutlined style={{ padding: '5px' }} />
                      {post.meta.views} views
                    </Text>,
                    <Text key="list-vertical-files">
                      <Tag color="#828DAB" style={{ margin: 0 }}>
                        <PaperClipOutlined style={{ padding: '5px 5px 5px 0' }} />
                        {post?.files?.length || 0} attachments
                      </Tag>
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
                !post?.isAnonymous && post?.posterId?.name ? (
                  <Avatar style={{ margin: '0px' }} size={45} src={post?.posterId?.avatar} />
                ) : (
                  <Avatar style={{ margin: '0px' }} size={45} icon={<UserOutlined />} />
                )
              }
              title={
                <Space wrap direction="horizontal" size={'small'}>
                  <Link
                    onClick={() =>
                      handleViewProfile(!post.isAnonymous ? post.posterId?._id ?? 'Unknown' : 'Anonymous')
                    }
                    style={{ fontSize: '15px', fontWeight: '500', marginRight: '10px' }}
                  >
                    {!post.isAnonymous ? post.posterId?.name ?? 'Account deleted' : 'Anonymous'}
                  </Link>
                  <Typography.Text type="secondary">
                    <Tag icon={<LinkedinOutlined />} color="#007E80">
                      {/* 373B44 004853 */}
                      <strong>
                        {post?.posterId?.department?.name ? post?.posterId?.department?.name : 'No department'}
                      </strong>
                    </Tag>
                  </Typography.Text>
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
                <Link>
                  <Title level={4} style={{ margin: 0 }} onClick={() => handleViewDetail(post._id)}>
                    {post.title}
                  </Title>
                </Link>
              }
              description={
                <>
                  <Typography.Text type="secondary">{description}</Typography.Text>
                  <Space size={[0, 8]} wrap>
                    <TagsTwoTone style={{ padding: '5px' }} />
                    {post?.categories?.length !== 0 ? (
                      post?.categories?.map((tag:any) => (
                        <Tag key={tag.name} color="geekblue">
                          {tag.name}
                        </Tag>
                      ))
                    ) : (
                      <Tag>No Tag</Tag>
                    )}
                  </Space>
                </>
              }
            ></List.Item.Meta>
          </List.Item>
        </Skeleton>
        {/* <Typography.Text type="danger" style={{ marginLeft: "30px", fontSize: "18px", fontFamily: "Palatino Linotype" }}>Time has exceeded Finalclosededdate</Typography.Text> */}
      </Card>
    </>
  )
}

// const StyledCard = styled(Card)`
//   box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
// `
// const StyleTitle = styled(Typography.Title)`
//   margin: 0px;
//   &:hover {
//     color: #007e80;
//   }
// `

export default PostCard
