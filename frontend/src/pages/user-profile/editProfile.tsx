import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Upload,
  message
} from 'antd'
import { Http } from 'api/http'
import { handleValidateFile, onChangeUpload, previewFile } from 'components/upload/uploadImage'
import dayjs from 'dayjs'
import { useSubscription } from 'libs/global-state-hooks'
import { userStore } from 'pages/auth/userStore'
import { useState } from 'react'

const { Title } = Typography
const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

function EditProfileForm() {
  const { state, setState } = useSubscription(userStore)
  const [form] = Form.useForm()
  const [avatar, setAvatar] = useState<any>([])
  const [loading, setLoading] = useState(false)

  userStore.subscribe(newState => {
    form.setFieldsValue({
      name: newState?.username,
      username: newState?.username,
      phone: newState.phone,
      email: !newState.email || newState.email === 'None' ? '' : newState.email,
      birthday: newState?.birthday ? dayjs(newState?.birthday.toString(), DATE_FORMAT) : null
    })
  })

  const onReset = () => {
    form.resetFields()
  }

  const handleUpdateProfile = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('username', form.getFieldValue('username'));
    formData.append('phone', form.getFieldValue('phone'));
    formData.append('email', form.getFieldValue('email'));
    formData.append('birthday', form.getFieldValue('birthday')?.$d);
    if (avatar?.length > 0) {
      formData.append('avatar', avatar[0]?.originFileObj);
    }
    if (!form.getFieldValue('username') || !form.getFieldValue('email')) {
      return message.error('Please input the required fields')
    }
    if (form.getFieldValue('username')?.length <= 4 || form.getFieldValue('name')?.length <= 10) {
      return message.error('Please input the valid fields')
    }


    await Http.put(`/api/v1/users/updateProfile/${state._id
      }`, formData).then(() => {
        message.success('Updated profile successfully!')
        setState({
          name: form.getFieldValue('name'),
          username: form.getFieldValue('username'),
          phone: form.getFieldValue('phone'),
          email: form.getFieldValue('email'),
          birthday: form.getFieldValue('birthday')?.$d,
          avatar: avatar[0]?.originFileObj
        })
      }).catch(message.error('Failed to update profile!')).finally(() => setLoading(false))
  }

  return (
    <Form labelCol={
      { span: 6 }
    }
      wrapperCol={
        { span: 18 }
      }
      layout="horizontal"
      style={
        { width: '100%' }
      }
      form={form}
      onFinish={handleUpdateProfile}>
      <Row gutter={
        {
          xs: 8,
          sm: 16,
          md: 24
        }
      }>
        <Title level={3}
          style={
            { margin: '0px 10px 16px' }
          }>
          General
        </Title>
      </Row>
      <Form.Item name="username" label="Username" labelAlign="left"
        initialValue={
          state.username
        }
        rules={
          [
            {
              required: true,
              message: 'Please input your username'
            }, {
              type: 'string',
              min: 3,
              message: 'Invalid username (At least 3 characters)'
            },
          ]
        }>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone number" labelAlign="left"
        initialValue={
          state.phone
        }
        rules={
          [{
            pattern: new RegExp(/^[0-9]{10}$/),
            message: 'The input is not valid phone number!'
          },]
        }>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" labelAlign="left"
        initialValue={
          !state.email || state.email === 'None' ? '' : state.email
        }
        rules={
          [
            {
              type: 'email',
              message: 'The input is not valid E-mail!'
            }, {
              required: true,
              message: 'Please input your email'
            },
          ]
        }>
        <Input />
      </Form.Item>
      <Form.Item name="birthday" label="Date of birth" labelAlign="left"
        initialValue={
          typeof state?.birthday === 'string' && state?.birthday ? dayjs(state?.birthday, DATE_FORMAT) : null
        }>
        <DatePicker disabledDate={
          current => {
            return current && current > dayjs().endOf('day')
          }
        } />
      </Form.Item>

      <Form.Item
        name="avatar"
        label="Upload image"
        valuePropName="fileList"
        labelAlign="left"
        getValueFromEvent={(e) => {
          const validFiles = handleValidateFile(e);
          setAvatar(validFiles);
        }}
        required
      >
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          onPreview={previewFile}
          accept="image/*"
          beforeUpload={file => onChangeUpload(file)}
          maxCount={1}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>
      <Row gutter={
        {
          xs: 8,
          sm: 16,
          md: 24
        }
      }
        style={
          { padding: '0px 16px' }
        }>
        <Form.Item>
          <Space direction="horizontal" align="end">
            <Button type="primary" htmlType="submit"
              loading={loading}>
              Submit
            </Button>
            <Button htmlType="button"
              onClick={onReset}
              danger>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Row>
    </Form>
  )
}

export default EditProfileForm
