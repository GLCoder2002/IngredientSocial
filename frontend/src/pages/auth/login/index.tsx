import {Row, Image, Space} from "antd";
import Text from "antd/es/typography/Title";
import LoginForm from "./loginForm";
import AppFooter from "../../layout/Footer";

function Login() {
  return (
    <>
      <Row 
      style={{
          width: '100%',
          height: '100vh',
          paddingTop: 70,
          paddingBottom: 50,
          justifyContent: 'center',
          background: '#F4F9F9',
          margin: '0px'
        }
      }>
        <Space style={{width:'70%', columnGap:'360px', justifyItems:'space-between'}}>
          <Space direction="vertical" style={{rowGap:'36.20px'}}>
          <Text italic
              style={
                {fontSize: '45px'}
            }>Ingredient social</Text>
            <Text italic
              style={
                {fontSize: '15px'}
            }>Unleash your inner culinary inspiration to everyone!</Text>
            <Image style={{marginLeft:'65px'}} src='../assets/logo.svg'
              height={150}
              alt="logo"/>
          </Space>
          <Space>
            <LoginForm/>
          </Space>
        </Space>
      </Row>
      {/* <AppFooter/> */}
    </>
  )
}
export default Login
