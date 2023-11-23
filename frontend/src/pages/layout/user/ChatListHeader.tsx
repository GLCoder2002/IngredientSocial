import { SearchOutlined } from "@ant-design/icons"
import { Col, Input, Row, Typography } from "antd"
const {Text} = Typography

const ChatListHeader=()=>{
  return(
    <>
     <Row>
      <Col span={8}>
        <Text style={{
           display: "flex",
           alignItems: "center",
           height: "100%",
        }}>Chat List</Text>
      </Col>
      <Col span={8} offset={8}>
        <Input style={{borderRadius:'25px'}} prefix={<SearchOutlined/>}/>
      </Col>
    </Row>
    </>
  )
}
export default ChatListHeader