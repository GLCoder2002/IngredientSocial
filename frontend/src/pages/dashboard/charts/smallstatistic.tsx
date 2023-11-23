import {Card, Col, message, Row} from 'antd'
import Title from 'antd/es/typography/Title'
import {Http} from 'api/http'
import React, {useEffect, useState} from 'react'

const SmallStatistic: React.FC = () => { 

  const [totalAccount, setTotalAccount] = useState(0)
  const [totalPost, setTotalPost] = useState(0)

  const getTotalAccount = async () => {
    await Http.get('/api/v1/users/totalUsers').then(res => setTotalAccount(res.data?.total)).catch(err => message.error('Failed to get total users!'))
  }
  const getTotalPost = async () => {
    await Http.get('/api/v1/posts/totalPosts').then(res => setTotalPost(res.data?.total)).catch(err => message.error('Failed to get total posts!'))
  }

  useEffect(() => {
    getTotalAccount()
    getTotalPost()
  }, [])

  return (
  <Row gutter={16}>
  <Col xs={24} sm={24} md={12} xxl={12} style={{ marginBottom: 10 }}>
    <Card bordered={false}>
      <Title level={3} style={{ margin: 0 }}>
        Total Accounts
      </Title>
      <Title level={4} type="success">
        {totalAccount?.toString()} accounts
      </Title>
    </Card>
  </Col>
  <Col xs={24} sm={24} md={12} xxl={12} style={{ marginBottom: 10 }}>
    <Card bordered={false}>
      <Title level={3} style={{ margin: 0 }}>
        Total Posts
      </Title>
      <Title level={4} type="success">
        {totalPost?.toString()} posts
      </Title>
    </Card>
  </Col>
</Row>
)
}

export default SmallStatistic
