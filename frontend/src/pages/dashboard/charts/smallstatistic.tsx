import { FileDoneOutlined, TeamOutlined } from '@ant-design/icons'
import {Card, Col, message, Row, Statistic} from 'antd'
import {Http} from 'api/http'
import React, {useEffect, useState} from 'react'
import CountUp from 'react-countup'

const SmallStatistic: React.FC = () => { 

  const [totalAccount, setTotalAccount] = useState(0)
  const [totalPost, setTotalPost] = useState(0)
  const formatter = (value: any) => <CountUp end={value} separator=','/>
  const getTotalAccount = async () => {
    await Http.get('/api/v1/users/totalUsers')
    .then(res => setTotalAccount(res.data?.total))
    .catch(err => message.error('Failed to get total users!'))
  }
  const getTotalPost = async () => {
    await Http.get('/api/v1/posts/totalPosts')
    .then(res => setTotalPost(res.data?.total))
    .catch(err => message.error('Failed to get total posts!'))
  }

  useEffect(() => {
    getTotalAccount()
    getTotalPost()
  }, [])

  return (
  <Row gutter={16}>
  <Col xs={24} sm={24} md={12} xxl={12} style={{ marginBottom: 10 }}>
    <Card bordered={false}>
    <Statistic title="Active Users" value={totalAccount} formatter={formatter} />
    <TeamOutlined />
    </Card>
  </Col>
  <Col xs={24} sm={24} md={12} xxl={12} style={{ marginBottom: 10 }}>
    <Card bordered={false}>
    <Statistic title="Total Post" value={totalPost} formatter={formatter} />
    <FileDoneOutlined />
    </Card>
  </Col>
</Row>
)
}

export default SmallStatistic
