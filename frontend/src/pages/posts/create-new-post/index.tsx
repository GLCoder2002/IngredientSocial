import { ArrowLeftOutlined, InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input, Space, Typography, Upload, message } from 'antd'
import { useState } from 'react'
import { Http } from '../../../api/http'
import useWindowSize from '../../../utils/useWindowSize'
import useRoleNavigate from 'libs/role-navigate'
import TextEditor from 'components/text-editor/text-editor'
import { handleValidateFile, onChangeUpload } from 'components/upload/uploadImage'
import IngredientTable from './ingredient-table'
import TermCondition from './condition'


const { Title } = Typography
export default function CreatePost() {
  const [form] = Form.useForm()
  const navigate = useRoleNavigate()
  const [selectedIngredients, setSelectedIngredients] = useState<any>([])
  // const initialState = () => EditorState.createEmpty()
  const [editorState, setEditorState] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [video, setVideo] = useState<any>([])
  const [loading,setLoading] = useState(false)

  const onSubmitPost = async () => {
    setLoading(true)
    const content = editorState
    if (content.length <= 20) {
      return message.error('Your description is too spacing')
    }
    const postForm = new FormData()
    postForm.append('title',form.getFieldValue('title'))
    postForm.append('content',`${content}`)
    postForm.append('ingredients',selectedIngredients)
    if(video.length > 0){
      postForm.append('video', video[0].originFileObj)
    }
    if (!form.getFieldValue('title')) {
      return message.error('Please fill the required fields')
    }
    if (form.getFieldValue('title').length < 30) {
      return message.error('Your title is too spacing')
    }
    if (!form.getFieldValue('agreement')) {
      return message.error('You must agree to the terms and conditions')
    }

    await Http.post('/api/v1/posts/create', postForm)
      .then(res => {
        message.success('Upload post successfully!!')
        navigate('/')
      })
      .catch(error => message.error(error.message + '. Please try again'))
      .finally(()=>setLoading(false))
  }

  const windowWidth = useWindowSize()

  return (
    <Card
      title={
        <Space align="center" size="middle">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} />
          <Title style={{ fontSize: 18, margin: 0 }}> Create post form</Title>
        </Space>
      }
      style={{ minWidth: windowWidth < 969 ? 'unset' : '80%', borderRadius: 0, margin: '10px 10px 10px 20px' }}
    >
      <Form
        form={form}
        name="post"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        layout="horizontal"
        labelAlign="left"
      >
        <Form.Item
          name="title"
          rules={[
            { required: true, message: "Please input your post's title" },
            { type: 'string', min: 30, message: 'Your title is too spacing, at least 30 characters' },
          ]}
          label="Title"
        >
          <Input
            style={{ lineHeight: 2.15 }}
            placeholder="Title (at least 30 characters to summary your post)"
            maxLength={200}
            showCount
            autoComplete="off"
          >
          </Input>
        </Form.Item>
        <Form.Item name='content' label='Content' required>
        <TextEditor editorState={editorState} setEditorState={setEditorState}/>
        </Form.Item>
        <Form.Item name="ingredient"
        //  rules={[
        //     { required: true, message: "Please select your ingredients for the recipe" },
        //   ]}
        required
        label="Ingredient">
        <IngredientTable setIngredientSelected={setSelectedIngredients} />
        </Form.Item>
      <Form.Item
        label="Video"
        name="dragger"
        valuePropName="fileList"
        getValueFromEvent={e => {
          const validFiles = handleValidateFile(e)
          setVideo(validFiles)
        }}
        required
      >
        <Upload.Dragger
          name="files"
          accept="video/*"
          beforeUpload={file => onChangeUpload(file)}
          maxCount={1}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Maximum Size: 50MB</p>
          <Typography.Text disabled style={{ marginLeft: '10px' }}>
            Maximum Files: 1
          </Typography.Text>
        </Upload.Dragger>
      </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          required
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Must accept terms and conditions')),
            },
          ]}
        >
          <Checkbox>
            I have read and agreed to{' '}
            <Button
              type="link"
              style={{ padding: 0, margin: 0 }}
              icon={<QuestionCircleOutlined style={{ margin: 0, padding: 0 }} />}
              onClick={() => setOpenModal(true)}
            >
              Terms and Conditions{' '}
            </Button>
          </Checkbox>
        </Form.Item>
        <TermCondition isOpen={openModal} onCloseModal={() => setOpenModal(false)} />
        <Form.Item wrapperCol={{ span: 15 }}>
          <Button loading={loading} type="primary" htmlType="submit" onClick={() => onSubmitPost()} style={{ marginTop: 10 }}>
            Post
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
