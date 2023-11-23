import { ArrowLeftOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Divider, Form, Input, Select, Space, Switch, Typography, Upload, message } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useEffect, useState } from 'react'
import { Http } from '../../../api/http'
import useWindowSize from '../../../utils/useWindowSize'
import HashtagInput from './HastagInput'
import Tags from './tag'
import axios from 'axios'
import useRoleNavigate from 'libs/role-navigate'
import { useQuery } from 'utils/useQuery'
import TextEditor from 'components/text-editor/text-editor'
//import IngredientTable from 'components/ingredient-table'
import { handleValidateFile, onChangeUpload } from 'components/upload/uploadImage'


const { Title } = Typography
export default function CreatePost() {
  const [form] = Form.useForm()
  const navigate = useRoleNavigate()
  const query = useQuery()
  const defaultEventId = query.get('event')

  const initialState = () => EditorState.createEmpty()
  const [editorState, setEditorState] = useState(initialState)
  const [openModal, setOpenModal] = useState(false)
  const [video, setVideo] = useState<any>([])
  const [hashTags, setHashTag] = useState([])
  const [categories, setCategories] = useState([])
  const [isAnonymous, setAnonymous] = useState(false)
  const [specialEvent, setSpecialEvent] = useState([])

  const onSubmitPost = async () => {
    
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    if (content.length <= 20) {
      return message.error('Your description is too spacing')
    }
    const postForm = {
      title: form.getFieldValue('title'),

      content: `${content}`,
      categories: categories,
      isAnonymous: isAnonymous,
      specialEvent: defaultEventId || form.getFieldValue('specialevent'),
    }
    if (categories.length === 0) {
      return message.error('Atleast one category')
    }

    if (!defaultEventId && !form.getFieldValue('specialevent')) {
      return message.error('Must be in a special event')
    }
    if (!postForm.title || !postForm.content) {
      return message.error('Please fill the required fields')
    }
    if (postForm.title.length < 30) {
      return message.error('Your title is too sparsing')
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
            { type: 'string', min: 30, message: 'Your title is too sparsing, at least 30 characters' },
          ]}
          label="Title"
        >
          <Input
            style={{ lineHeight: 2.15 }}
            placeholder="Title (at least 30 characters to summary your post)"
            maxLength={200}
            showCount
            autoComplete="off"
          ></Input>
        </Form.Item>
        <TextEditor editorState={editorState} setEditorState={setEditorState}/>
        <Form.Item name="ingredient"
         rules={[
            { required: true, message: "Please select your ingredients for the recipe" },
          ]}
        required
        label="Ingredient">
         {/* // <IngredientTable/> */}
        </Form.Item>
        <Form.Item
    name="image"
    label="Upload image"
    valuePropName="fileList"
    labelAlign="left"
    getValueFromEvent={(e) => {
      const validFiles = handleValidateFile(e);
      setVideo(validFiles);
    }}
    required
  >
    <Upload
          name="video"
          listType="picture-card"
          className="video-uploader"
          accept="video/*"
          beforeUpload={file => onChangeUpload(file)}
          maxCount={1}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
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
        {/* <TermCondition isOpen={openModal} onCloseModal={() => setOpenModal(false)} /> */}
        <Form.Item wrapperCol={{ span: 15 }}>
          <Button type="primary" htmlType="submit" onClick={() => onSubmitPost()} style={{ marginTop: 10 }}>
            Post
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
