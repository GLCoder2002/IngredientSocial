import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, message } from 'antd';
import { Http } from '../../../api/http';

const RegisterModal = ()=>{
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false);
  const [loading,setLoading] = useState(false);

  const onFinish = async () => {
    setLoading(true);
    const accountForm = {
    username: form.getFieldValue('username'),
    email: form.getFieldValue('email'),
    password: form.getFieldValue('password'),
    gender: form.getFieldValue('gender'),
    birthday: form.getFieldValue('dob'),
  }
  await Http.post('/api/v1/auth/signup',accountForm)
  .then(()=>{
    setVisible(false)
    message.success('SignUp successful')
  })
  .catch((error:any) => {
    if (error?.response?.data.message) {
      message.error(error.response.data.message)
    } else {
      message.error(`Some thing went wrong sign up fail, ${error?.message}`)
    }
  })
  .finally(()=>setLoading(false))
}
  
  return(
    <>
    <Button onClick={() => setVisible(true)} style={{
    width: '200px',
    height: '45px'
  }}
    type="link"
    >Create new account
  </Button>
  <Modal
    title='SignUp'
    open={visible}
    cancelButtonProps={{ style: { display: 'none' } }}
    okButtonProps={{ style: { display: 'none' } }}
    onCancel={() => {
      setVisible(false)
      form.resetFields()
    }}
  >
  <Form
        name='complex-form'
        autoComplete='off'
        form={form}
        onFinish={onFinish}
      >
        <Form.Item rules={[{
          required: true,
          message: "Please input your Name!",
        }, {
          whitespace: true
        }, {
          min: 5
        }]} hasFeedback name='username'>
          <Input placeholder='Type your name' allowClear/>
        </Form.Item>
        <Form.Item rules={[{
          required: true,
          message: "Please input your Email!",
        }, {
          type: 'email', message: "Please enter valid email"
        }]} hasFeedback name='email'>
          <Input placeholder='user@gmail.com' allowClear />
        </Form.Item>
        <Form.Item rules={[{
          required: true,
          message: "Please input your Password!",
        }, {
          min: 5
        }, {
          validator: (_, value) => value && value.match(/[A-Z]/)
            ? Promise.resolve(value)
            : Promise.reject('Password must have at least one uppercase')
        }]} hasFeedback name='password'>
          <Input.Password placeholder='Type your password' allowClear />
        </Form.Item>
        <Form.Item
          dependencies={['password']}
          rules={[{
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Two passwords that you entered do not match!"));
            }
          })
          ]} hasFeedback
          name='confirmPassword'>
          <Input.Password placeholder='Confirm your password' allowClear />
        </Form.Item>
        <Form.Item name='gender'>
          <Select placeholder='Select your gender'
          options={[
            {label:'Male', value:"male"},
            {label:'Female', value:"female"}
          ]}
          />
        </Form.Item>
        <Form.Item rules={[{
          required: true,
          message: "Please select your birth date!",
        }]} hasFeedback name='dob'>
          <DatePicker style={{ width: '100%' }} picker='date' placeholder='Choose your birthday' />
        </Form.Item>
        <Button loading={loading} type="primary" htmlType='submit' style={{ background: "#16FF00", borderColor: "#16FF00" }}>
          SignUp
        </Button>
      </Form>
    </Modal>
    </>
  )
}

export default RegisterModal;