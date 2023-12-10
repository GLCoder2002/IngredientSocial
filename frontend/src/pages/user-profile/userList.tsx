import { Divider, List, Skeleton } from "antd"
import { Http } from "api/http"
import { enqueueSnackbar } from "notistack"
import { useEffect, useMemo, useState } from "react"
import UserCard from "./userCard"
import InfiniteScroll from "react-infinite-scroll-component"
import SearchField from "components/search-field/searchField"
interface DataType {
  id: string
  username: string
  email: string
  avatar:string
}
function UserList() {
  const [userList, setUserList] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState<any>(0)
  const [searchKey, setSearchKey] = useState('')
  const filteredAccounts = useMemo(() => {
    return userList?.filter((acc: DataType) => acc.username.toLowerCase().includes(searchKey.toLowerCase().trim()))
  }, [userList, searchKey])
  const getAllUser = async () =>
    await Http.get('/api/v1/users')
      .then(res => {
        setUserList(res.data.data)
        setListLength(res.data.data?.length)
      })
      .catch(error => enqueueSnackbar('Failed to get all accounts !', { variant: 'error' }))
      .finally(() => setLoading(false))

  useEffect(() => {
    setLoading(true)
    getAllUser()
  }, [])
  return (
    <>
    <SearchField style={{width: '200px', height:'30px', marginLeft:'30px'}} setInput={setSearchKey} inputKey={searchKey} placeholder="Search users" />
    <InfiniteScroll
      dataLength={listLength}
      next={getAllUser}
      hasMore={userList?.length < 50}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
      scrollableTarget="scrollableDiv"
    >
      <List
        itemLayout="horizontal"
        dataSource={filteredAccounts?.sort(
          (a:any, b:any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )}
        renderItem={user => <UserCard key={`${user}`} user={user} isLoading={loading} />} />
    </InfiniteScroll></>

  )
}
export default UserList