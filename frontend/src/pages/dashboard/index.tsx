import { Col, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import SmallStatistic from './charts/smallstatistic'
import LatestPostList from './charts/latest-posts'
import CategoryClassifyPieChart from './charts/eventPieChart'
import EventLineChart from './charts/eventLineChart'

function DashboardAdmin() {
  return (
    <>
      <Row
        gutter={{ xs: 8, sm: 16, md: 24 }}
        style={{
          padding: '20px',
        }}
      >
        <Col span={24}>
          <SmallStatistic />
        </Col>
      </Row>

      <Row
        gutter={{ xs: 8, sm: 16, md: 24 }}
        style={{
          padding: '20px',
        }}
      >
        <Col
          className="gutter-row"
          xs={24}
          sm={24}
          md={12}
          xxl={6}
          style={{
            borderRadius: '5px',
          }}
        >
          <CategoryClassifyPieChart />
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={24}
          md={12}
          xxl={6}
          style={{
            borderRadius: '5px',
          }}
        >
          <EventLineChart />
        </Col>
      </Row>
      <Row
        style={{
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '5px',
          width: 'auto',
          margin: '20px',
        }}
      >
        <Col span={24} style={{ display: 'flex', justifyContent: 'center', borderBottom: 'inset' }}>
          <Title level={3}>Latest list posts</Title>
        </Col>
        <Col span={24}>
          <LatestPostList />
        </Col>
      </Row>
    </>
  )
}

export default DashboardAdmin
