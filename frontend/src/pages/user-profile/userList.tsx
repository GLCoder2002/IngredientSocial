import { Card, Col, Empty, List, Skeleton } from "antd";
import Title from "antd/es/typography/Title";
import { Http } from "api/http";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import UserCard from "./userCard";


function UserList(){
    const [users, setUsers] = useState<any>([])
    const [loading, setLoading] = useState(false)
    
    const getAllUser = async () =>
    await Http.get('/api/v1/users')
      .then(res => setUsers(res.data.data))
      .catch(error => enqueueSnackbar('Failed to get all accounts !', { variant: 'error' }))
      .finally(() => setLoading(false))

  useEffect(() => {
    setLoading(true)
    getAllUser()
  }, [])

  console.log(users)
  
  return(
    <Card
      title={<Title style={{ margin: 0, fontSize: 24, textOverflow: 'ellipsis' }}>User in this app</Title>}
      style={{ borderRadius: 0, height: '100%', marginRight: 16 }}
      headStyle={{ backgroundColor: '#1677ff6d', borderRadius: 0 }}
    >
      <Title style={{ margin: '20px 0px', fontSize: 18, color: '#1677ff' }}>Your can see there profile below</Title>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 5,
          }}
          style={{
            marginBottom: '50px',
          }}
          dataSource={users}
          renderItem={(userId, index) => (
            <Col className="gutter-row"  key={index}>
              <Skeleton loading={loading}>
                <UserCard userId={userId} />
              </Skeleton>
            </Col>
          )}
        />
      
    </Card>
  )
}
export default UserList