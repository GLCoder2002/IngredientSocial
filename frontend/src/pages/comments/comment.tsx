import {
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LikeOutlined,
} from '@ant-design/icons'
import { Avatar, List, Skeleton, Space, Typography } from 'antd'
import React from 'react'
import { deleteComment, editComment } from './comment-services'
import useRoleNavigate from 'libs/role-navigate'
import { useSubscription } from 'libs/global-state-hooks'
import { userStore } from 'pages/auth/userStore'
import { formatDayTime } from 'utils/helperFormat'

const handleMenuClick = (text: unknown, id: unknown) => {
  switch (text) {
    case 'Edit':
      editComment(id)
      break
    case 'Delete':
      deleteComment(id)
      break
    default:
      return
  }
}

const IconText = ({ icon, text, id }: { icon: React.FC; text: string; id: string }) => (
  <Space style={{ cursor: 'pointer' }} onClick={() => handleMenuClick(text, id)}>
    {React.createElement(icon)}
    {text}
  </Space>
)

function Comment({ item, loading }:{item:any,loading:any}) {
  const navigate = useRoleNavigate()
  const { _id } = useSubscription(userStore).state

  const handleViewProfile = (id:any) => {
      navigate(`/profile?id=${id}`)
  }

  let action = [
    <IconText id={item._id} icon={LikeOutlined} text="0" key="list-vertical-like-o" />,
    <IconText id={item._id} icon={DislikeOutlined} text="0" key="list-vertical-star-o" />,
    <IconText id={item._id} icon={ExclamationCircleOutlined} text="0" key="list-vertical-message" />,
  ]
  if (item.userId._id === _id) {
    action = [
      ...action,
      <IconText id={item._id} icon={EditOutlined} text="Edit" key="list-vertical-edit"></IconText>,
      <IconText id={item._id} icon={DeleteOutlined} text="Delete" key="list-vertical-delete"></IconText>,
    ]
  }

  return (
    <>
      {item?.date && (
        <List.Item actions={action} style={{ margin: 0 }}>
          <Skeleton avatar title={false} loading={loading} active>
            <List.Item.Meta
              style={{ margin: 0 }}
              avatar={
                <Avatar
                  size={45}
                  src={item.userId?.avatar ? item.userId?.avatar : window.location.origin + '/images/anonymous.jpg'}
                  style={{ background: '#ccc' }}
                />
              }
              title={
                <>
                  <Typography.Link onClick={() => handleViewProfile(item.userId?._id)}>
                    {item.userId?.username ? item.userId?.username : 'Unknown'}
                  </Typography.Link>
                  {'  '}
                  <Typography.Text italic disabled type="secondary" style={{ fontSize: 13 }}>
                    {item.userId._id === _id ? 'Your Comment' : ''}
                  </Typography.Text>
                  <Typography.Paragraph
                    type="secondary"
                    style={{
                      fontSize: 13,
                      fontWeight: 0,
                      margin: 0,
                      fontFamily:
                        'Roboto,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
                    }}
                  >
                    {formatDayTime(item.date)}
                  </Typography.Paragraph>
                </>
              }
            />
            <article
              style={{
                margin: 0,
                padding: 0,
                fontSize: '16px',
                fontWeight: '400',
                color: 'black',
                fontFamily:
                  'Open Sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
              }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            ></article>
          </Skeleton>
        </List.Item>
      )}
    </>
  )
}

export default Comment
