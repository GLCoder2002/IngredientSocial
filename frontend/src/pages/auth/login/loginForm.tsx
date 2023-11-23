import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Divider,
  message
} from 'antd';


import { userCredential, userStore } from '../userStore';
import { useNavigate } from 'react-router-dom';
import RegisterModal from '../signup/registerModal';
import { useSubscription } from '../../../libs/global-state-hooks';
import { Http, LOCALSTORAGE } from '../../../api/http';

const LoginForm: React.FC = () => {
const {
state: { login },
} = useSubscription(userCredential, ['login'])
const [form] = Form.useForm()
const [loading, setLoading] = useState(false)
const navigate = useNavigate()
useEffect(() => {
const credential = JSON.parse(localStorage.getItem(LOCALSTORAGE.CREDENTIALS)||'{}')
if (credential && credential.tokenVerified) {
    navigate('/')
    message.info('You already logged in!')
}
}, [])

const handleSubmit = async (val: any) => {
  setLoading(true)
  await Http.post('/api/v1/auth/login', val)
    .then(async (res:any) => {
      if (res?.data?.success) {
        userStore.updateState(res.data.userMetaData)
        login(res.data.userMetaData._id, res.data.accessToken, 30000, true)
      }
      return res.data.userMetaData.role
    })
    .then((enpoint:string) => {
      navigate(`/${enpoint}`)
      window.location.reload()
      message.success('Login successful')
    })
    .catch((error:any) => {
      if (error?.response?.data.message) {
        message.error(error.response.data.message)
      } else {
        message.error(`Login failed, ${error?.message}`)
      }
    })
    .finally(() => setLoading(false))
}

  return (
    <>
      <Card bordered style={
        {
          height: '325px'
        }
      }>
        <Space align="center">
          <Form name="basic"
            initialValues={
              {
                remember: true
              }
            }
            onFinish={handleSubmit}
            autoComplete="off"
            form={form}
          >
            <Form.Item name="username"
              rules={
                [{
                    required: true,
                    message: 'Please input your username!'
                  }]
            }>
              <Input placeholder='username'
                style={
                  {
                    width: '250px',
                    height: '45px'
                  }
                }/>
            </Form.Item>

            <Form.Item name="password"
              rules={
                [{
                    required: true,
                    message: 'Please input your password!'
                  }]
            }>
              <Input.Password placeholder='password'
                style={
                  {
                    width: '250px',
                    height: '45px'
                  }
                }/>
            </Form.Item>

            <Form.Item>
              <Button style={
                  {
                    width: '250px',
                    height: '45px'
                  }
                }
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
            <Divider/>
            <Form.Item wrapperCol={
              {
                offset: 8,
                span: 16
              }
            }>
             <RegisterModal/>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </>
  );
};

export default LoginForm;
