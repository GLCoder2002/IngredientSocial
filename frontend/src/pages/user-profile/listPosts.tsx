import { Button, Divider, List, message } from 'antd'
import { Http } from 'api/http'
import PostCard from 'pages/posts/post-card'
import { useEffect, useState } from 'react'

export default function ListPosts({ userId }:any) {
  const [myPost, setMyPost] = useState([])
  const [loadmore, setLoadmore] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const getMyPost = async () => {
      await Http.get('/api/v1/posts')
        .then(res => {
          setMyPost(res.data.data.filter((post:any) => post.likes.includes(userId)))
          setLoadmore(res.data.data.filter((post:any) => post.likes.includes(userId)).length)
        })
        .catch((err:any) => message.error('Fail to get post list'))
        .finally(() => setLoading(false))
    }
    getMyPost()
  }, [])

  const loadMoreButton =
    myPost?.length < loadmore ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={() => setLoadmore(Number(loadmore + 5))} loading={loading}>
          Loading more
        </Button>
      </div>
    ) : myPost?.length ? (
      <Divider plain>It is all, nothing more 🤐</Divider>
    ) : null

  return (
    <List
      loading={loading}
      loadMore={loadMoreButton}
      itemLayout="vertical"
      size="large"
      dataSource={myPost.slice(0, loadmore)}
      renderItem={post => <PostCard key={`${post}`} post={post} isLoading={loading}></PostCard>}
    />
  )
}
