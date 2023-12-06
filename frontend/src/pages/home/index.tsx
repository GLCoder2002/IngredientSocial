import { SmileFilled } from "@ant-design/icons"
import { Avatar, Badge, Col, Input, Layout, Row, message } from "antd"
import { Http } from "api/http"
import { useSubscription } from "libs/global-state-hooks"
import useRoleNavigate from "libs/role-navigate"
import { userStore } from "pages/auth/userStore"
import { Suspense, useEffect, useState } from "react"
import { handleFilter } from "utils/handleFilter"
import useWindowSize from "utils/useWindowSize"
import MenuFilter from "./menu-filter"
import PostsList from "pages/posts/posts-list"

function HomePage(){
  const navigate = useRoleNavigate()
  const windowWidth = useWindowSize()
  const [posts, setPosts] = useState<any[]>([])
  const [isEnd, setEnd] = useState(false)
  const [filter, setFilter] = useState('new')
  const [optionsQuery, setOptionsQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPost, setTotalPost] = useState(0)
  const fitPadding = windowWidth < 1000 ? '10px 0' : '10px 100px'
  const { avatar, role } = useSubscription(userStore).state
  const handleClickTyping = async () => {
    navigate('/create')
  }

  useEffect(() => {
    setEnd(false)
    const query = handleFilter(filter)
    setOptionsQuery(query!)
    loadMoreData(true, query, 1)
  }, [filter])

  const getTotalPost = async () => {
    await Http.get('/api/v1/posts/totalPosts')
      .then(res => setTotalPost(res.data?.total))
      .catch(err => message.error('Failed to get total posts!'))
  }

  useEffect(() => {
    getTotalPost()
  }, [])

  const loadMoreData = (reset: boolean = false, filter?:any, page?:any) => {
    setLoading(true)
    const tabQuery = filter ? filter : optionsQuery
    const curPage = page ? page : currentPage
    console.log(curPage)
    const getAllPosts = async () =>
      await Http.get(`/api/v1/posts?page=${curPage}&${tabQuery}`)
        .then(res => {
          if (reset === true) {
            setPosts(res.data.data)
            if (res.data?.next?.page) {
              setCurrentPage(res.data.next.page)
            }
            return
          } 
          if (res.data?.next?.page) {
            setCurrentPage(res.data.next.page)
          }
          else {
            setEnd(true)
            setCurrentPage(1)
          }
          setPosts(prev => [...posts, ...res.data.data])
        })
        .catch(err => message.error('Failed to get all posts!'))
        .finally(() => setLoading(false))
    getAllPosts()
  }

  return (
    <Layout.Content
      style={{
        display: 'block',
        padding: fitPadding,
        height: 'auto',
      }}
    >
      {role === 'user' ? (
        <Row style={rowStyle}>
          <Col flex="60px">
            <Badge status="success" count={<SmileFilled style={{ color: '#52c41a' }} />}>
              <Avatar shape="square" size={40} style={{ background: '#f6f7f8' }} src={avatar} />
            </Badge>
          </Col>
          <Col flex="auto">
            <Input
              style={{ lineHeight: 2.15, background: '#f6f7f8' }}
              placeholder="What's your dish today?"
              onClick={() => {
                handleClickTyping()
              }}
            />
          </Col>
        </Row>
      ) : null}
      <Row style={rowStyle}>
        <MenuFilter setFilter={setFilter} filter={filter} totalPost={totalPost} />
      </Row>
      <Suspense fallback = 'loading...'>
      <PostsList posts={posts} loading={loading} loadMoreData={loadMoreData} isEnd={isEnd} />
      </Suspense>
    </Layout.Content>
  )
}
export default HomePage

const rowStyle = {
  boxShadow: '0px 0px 0.25em rgba(67, 71, 85, 0.27), 0px 0.25em 1em rgba(90, 125, 188, 0.05)',
  padding:'10px',
  border: '1px solid',
  borderRadius: '5px',
  background:'#fff',
  marginBottom:'15px'
};
