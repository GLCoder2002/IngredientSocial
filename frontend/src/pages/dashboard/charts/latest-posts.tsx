import { Avatar, List, Skeleton, Tooltip } from 'antd'
import { Http } from 'api/http'
import useRoleNavigate from 'libs/role-navigate'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

const LatestPostList: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useRoleNavigate()
  const [initLoading, setInitLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [postList, setPostList] = useState<any[]>([])

  const getAllPosts = async () =>
    await Http.get(`/api/v1/posts`)
      .then(res => setPostList(res.data.data))
      .catch(error => enqueueSnackbar('Failed to get all posts !', { variant: 'error' }))
      .finally(() => setInitLoading(false))

  useEffect(() => {
    setInitLoading(true)
    getAllPosts()
  }, [])

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      ></div>
    ) : null

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        loading={initLoading}
        loadMore={loadMore}
        dataSource={postList}
        renderItem={(item, index) => (
          <Skeleton avatar title={false} loading={initLoading} active key={index}>
            <List.Item>
              <List.Item.Meta
                style={{
                  maxHeight: 400,
                  overflow: 'hidden',
                }}
                avatar={
                    <Tooltip title={item?.posterId?.name} color="#2db7f5" mouseEnterDelay={1}>
                      <Avatar
                        style={{ backgroundColor: ColorList[index % 4], verticalAlign: 'middle' }}
                        size="large"
                        src={item?.posterId?.avatar}
                      />
                    </Tooltip>
                }
                title={<a onClick={() => navigate(`/post?id=${item._id}`)}>{item?.title}</a>}
                description={
                  <div dangerouslySetInnerHTML={{ __html: item?.content }} style={{ pointerEvents: 'none' }} />
                }
              />
            </List.Item>
          </Skeleton>
        )}
      />
    </>
  )
}

export default LatestPostList
