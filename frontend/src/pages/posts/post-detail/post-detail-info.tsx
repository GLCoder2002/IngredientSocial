import {
  EyeOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Space, Typography } from 'antd'
import { formatDayTime } from 'utils/helperFormat'
const { Text } = Typography

export default function PostDetailInfo({ item }: {
  item: any
}) {
  return (<>
    <Space direction="horizontal">
      {item?.posterId?.name ? (<Avatar style={{ margin: '0px' }}
        size={45}
        src={item?.posterId?.avatar} />)
        :
        (<Avatar style={{ margin: '0px' }}
          size={45}
          icon={<UserOutlined />} />)
      }
      <Space direction="vertical"
        size={[0, 0]}>
        <span>
          <Text strong> {
            item?.posterId?.username ? item?.posterId?.username : 'Unknown'
          }</Text>
          <Text type="secondary"
            style={
              { marginLeft: 10 }
            }>
            Posted {
              formatDayTime(item?.createdAt ? item?.createdAt : Date.now())
            } </Text>
        </span>
        <Space direction="horizontal">
          <Text type="secondary" keyboard
            style={
              { opacity: 0.7 }
            }>
            <EyeOutlined /> {
              item?.meta?.views
            }
            views
          </Text>
        </Space>
      </Space>
    </Space>
    <Typography.Title level={3}
      style={
        { margin: '5px 0' }
      }> {
        item?.title
      } </Typography.Title>
  </>)
}
