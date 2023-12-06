import { List } from "antd"
import { Http } from "api/http"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import UserCard from "./userCard"

function UserList(){
    const [userList, setUserList] = useState<any>()
    const [loading, setLoading] = useState(false)

    const getAllUser = async () =>
    await Http.get('/api/v1/users')
      .then(res => setUserList(res.data.data))
      .catch(error => enqueueSnackbar('Failed to get all accounts !', { variant: 'error' }))
      .finally(() => setLoading(false))

  useEffect(() => {
    setLoading(true)
    getAllUser()
  }, [])
    return(
    <List
    itemLayout="horizontal"
    dataSource={userList}
    renderItem={user=><UserCard key={`${user}`} user={user} isLoading={loading}/>}
  />
)
}
export default UserList