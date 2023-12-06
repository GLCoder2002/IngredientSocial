import {
  CrownFilled,
  DingtalkCircleFilled,
  FireFilled,
  FrownFilled,
  RocketFilled,
} from '@ant-design/icons'
import { Button, Col, Dropdown, MenuProps, Radio, Space, Typography } from 'antd'
import useWindowSize from '../../utils/useWindowSize'

const { Text } = Typography

function MenuFilter({ setFilter, filter, totalPost }:any) {
  const windowWidth = useWindowSize()
  const display = windowWidth < 1000 ? 'block' : 'flex'
  const onClickFilter = (val: any) => {
    setFilter(val)
  }
  const topItems: MenuProps['items'] = [
    {
      key: 'week',
      label: (
        <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('week')}>
          Week
        </Text>
      ),
    },
    {
      key: 'month',
      label: (
        <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('month')}>
          Month
        </Text>
      ),
    },
  ]
  return (
    <>
      <Col>
        <p style={{ fontSize: '19px', fontWeight: '400', marginBottom: '3px 0' }}>{totalPost} Posts</p>
      </Col>
      <Col style={{ float: 'right', width: '100%', justifyContent: 'end', fontSize: '15px', display: display }}>
        <Radio.Group defaultValue={filter} buttonStyle="solid" style={{}} onChange={e => onClickFilter(e.target.value)}>
          <Radio.Button value="new">
            <DingtalkCircleFilled /> Newest
          </Radio.Button>
          <Radio.Button value="hot">
            <FireFilled /> Hot
          </Radio.Button>
          <Radio.Button value="best">
            <RocketFilled /> Best
          </Radio.Button>
          <Radio.Button value="worst">
            <FrownFilled /> Worst
          </Radio.Button>
          <Radio.Button value="oldest">
            <FrownFilled /> Oldest
          </Radio.Button>
        </Radio.Group>
        <Col />
        <Col>
          <Space wrap style={{ float: 'right' }}>
            <Dropdown menu={{ items: topItems }} placement="bottom" arrow trigger={['click']}>
              <Button>
                <CrownFilled /> Top
              </Button>
            </Dropdown>
          </Space>
        </Col>
      </Col>
    </>
  )
}

export default MenuFilter
