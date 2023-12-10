import { SlidersFilled } from '@ant-design/icons'
import { Button, Dropdown, List, MenuProps, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import Comment from './comment'
import { Http } from 'api/http'
import { handleFilter } from 'utils/handleFilter'
import { useSocket } from 'socket.io'
interface DataType {
  gender?: string
  name: {
    title?: string
    first?: string
    last?: string
  }
  email?: string
  picture: {
    large?: string
    medium?: string
    thumbnail?: string
  }
  nat?: string
  loading: boolean
}

function CommentsList({ id, updatePost }:{id:any,updatePost:any}) {
  const [initLoading, setInitLoading] = useState(true)
  const [list, setList] = useState<DataType[]>([])
  const [filter, setFilter] = useState('new')
  const {appSocket} = useSocket()

  const updateComments = (info:any) => {
    return setList([info.comment, ...list])
  }

  useEffect(() => {
    const query = handleFilter(filter)
    Http.get(`/api/v1/comments?postId=${id}&${query}`).then(res => {
      setInitLoading(false)
      setList(res.data.data)
    })
    console.log(id)
  }, [updatePost, filter])
  
  const onClickFilter = (val: any) => {
    setFilter(val)
  }

  useEffect(() => {
    appSocket.on('comments', (data:any) => {
      if (data.postId === id) {
        updateComments(data)
      }
    })

    return () => {
      appSocket.off('comments')
    }
  }, [updateComments])


  const moreItems: MenuProps['items'] = [
    {
      key: 'new',
      label: (
        <Typography.Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('new')}>
          Newest
        </Typography.Text>
      ),
    },
    {
      key: 'oldest',
      label: (
        <Typography.Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('oldest')}>
          Oldest
        </Typography.Text>
      ),
    },
  ]

  return (
    <>
      <Space
        style={{
          width: '100%',
          borderBottom: '0.5px #ccc solid',
          padding: '10px',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Dropdown menu={{ items: moreItems }} placement="bottom" arrow trigger={['click']}>
          <div>
          <Button>
            <SlidersFilled />
          </Button>
          </div>
        </Dropdown>
      </Space>
      <List
        loading={initLoading}
        itemLayout="vertical"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={list}
        style={{ width: '100%', paddingLeft:'10px' }}
        renderItem={item => (
          <Comment item={item} loading={item.loading} />
        )}
      />
    </>
  )
}

export default CommentsList
