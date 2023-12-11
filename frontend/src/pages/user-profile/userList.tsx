import { List } from "antd"
import { Http } from "api/http"
import { enqueueSnackbar } from "notistack"
import { useEffect, useMemo, useState } from "react"
import UserCard from "./userCard"
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
  const [searchKey, setSearchKey] = useState('')
  const filteredAccounts = useMemo(() => {
    return userList?.filter((acc: DataType) => acc.username.toLowerCase().includes(searchKey.toLowerCase().trim()))
  }, [userList, searchKey])
  const getAllUser = async () =>
    await Http.get('/api/v1/users')
      .then(res => {
        setUserList(res.data.data)
      })
      .catch(error => enqueueSnackbar('Failed to get all accounts !', { variant: 'error' }))
      .finally(() => setLoading(false))

  useEffect(() => {
    setLoading(true)
    getAllUser()
  }, [])
  return (
    <>
    <SearchField style={{ width: '200px', height: '30px', marginLeft: '30px' }} setInput={setSearchKey} inputKey={searchKey} placeholder="Search users" />
    <List
      style={{overflow:'auto'}}
      itemLayout="horizontal"
      dataSource={filteredAccounts?.sort(
        (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )}
      renderItem={user => <UserCard key={`${user}`} user={user} isLoading={loading} />} />
    </>
  )
}
export default UserList