import {Button, Divider, List} from 'antd'
import PostCard from './post-card'
import {createSubscription, useSubscription} from 'libs/global-state-hooks';

interface PostListProps {
  posts: any[] | undefined;
  loading: any,
  isEnd: boolean,
  loadMoreData: any
}

function PostsList({posts, loading, isEnd, loadMoreData} : PostListProps) {
  const postCount = createSubscription({number:0})
  const {
  state: { number },
  } = useSubscription(postCount)
  const loadMore = (
    <> {
      !posts?.length ? null : !isEnd && posts?.length <= number
       ? (
        <div style={
          {
            textAlign: 'center',
            marginTop: 30
          }
        }>
          <Button onClick={loadMoreData}
            loading={loading}>
            Load more
          </Button>
        </div>
      ) : (
        <Divider plain>It is all, nothing more 🤐</Divider>
      )
    } </>
  )

  return (
    <List loading={loading}
      loadMore={loadMore}
      itemLayout="vertical"
      size="large"
      dataSource={posts}
      style={
        {marginBottom: '50px'}
      }
      renderItem={
        post => <PostCard key={
            `${post}`
          }
          post={post}
          isLoading={loading}/>
      }/>
  )
}

export default PostsList
