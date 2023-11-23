import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input, Space, Spin, Switch, Typography, message } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Http } from '../../api/http'
import useWindowSize from '../../utils/useWindowSize'
import { useEffect, useState } from 'react'
import useRoleNavigate from 'libs/role-navigate'
import { useQuery } from 'utils/useQuery'
import Tags from './create-new-post/tag'
import HashtagInput from './create-new-post/HastagInput'

const { Title } = Typography

export default function Editpost() {
  const [data, setData] = useState<any>([])
  const [form] = Form.useForm()
  const navigate = useRoleNavigate()
  const query = useQuery()
  const id = query.get('id')
  const initialState = () => EditorState.createEmpty()
  const [editorState, setEditorState] = useState(initialState)
  const [openModal, setOpenModal] = useState(false)
  const [files, setFiles] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const [isAnonymous, setAnonymous] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const setFileState = async (value: never[]) => {
    setFiles(value)
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const getPost = async () =>
      await Http.get(`/api/v1/posts/detail?id=${id}`)
        .then(res => {
          setData([res.data.data])
          const blocksFromHtml = convertFromHTML(`${res.data.data.content}`)
          const initialState = () =>
            EditorState.createWithContent(
              ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap)
            )
          setEditorState(initialState)
        })
        .catch(error => message.error('Failed to fetch post!'))
    getPost()
  }, [])

  const [allHastag, setAllHastag] = useState<any>([])

  const getHastagList = async () => {
    await Http.get('/api/v1/hastag')
      .then(res => {
        setAllHastag(res.data.data)
      })
      .catch(error => message.error(error.message))
  }

  useEffect(() => {
    getHastagList()
  }, [])

  const normFile = (e: any) => {
    const fileList = e
    setFileState(fileList)
    return e
  }

  const onSubmitPost = async () => {
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    if(content.length <= 20) {
      return message.error("Your description is too sparsing")
    }
    const postForm = {
      title: form.getFieldValue('title'),
      content: `${content}`,
      categories: categories,
      isAnonymous: isAnonymous,
    }
    if(categories.length === 0) {
      return message.error('At least one tags')
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

    await Http.put(`/api/v1/post/edit/${id}`, postForm)
      .then(res => {
        message.success('Edit post successfully!!')
        navigate('/')
      })
      .catch(error => message.error(error.message + '. Please try again'))
  }

  const windowWidth = useWindowSize()

  return isShown ? (
    <Card
      title={
        <Space align="center" size="middle">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} />
          <Title style={{ fontSize: 18, margin: 0 }}> Edit your post</Title>
        </Space>
      }
      style={{ minWidth: windowWidth < 969 ? 'unset' : '80%', borderRadius: 0, marginRight: 10 }}
    >
      <Form
        form={form}
        name="post"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        layout="horizontal"
        labelAlign="left"
      >
        <Form.Item name="event" label="Chosen Special Event" initialValue={data[0]?.specialEvent?.title}>
          <Input style={{ lineHeight: 2.15 }} disabled></Input>
        </Form.Item>

        <Form.Item name="title" label="Title" initialValue={data[0]?.title}
        rules={[{ required: true, message: "Please input your post's title" }, { type: 'string', min: 30, message: "Your title is too sparsing, at least 30 characters" }]} 
        >
          <Input
            style={{ lineHeight: 2.15 }}
            placeholder="Title (at least 50 characters to summary your post)"
            maxLength={200}
            showCount
            autoComplete="off"
          ></Input>
        </Form.Item>

        {/* <DefaultUpload normFile={normFile} files={files}></DefaultUpload> */}
{/* 
        {data[0]?.files.length > 0 && (
          <Form.Item name="addedFile" label="Original files(can't remove)">
            <FileDisplay files={data[0]?.files} isFit={true}></FileDisplay>
          </Form.Item>
        )} */}

        <Form.Item label="Anonymous Mode">
          <Switch
            defaultChecked={data[0]?.isAnonymous ? true : false}
            onChange={() => setAnonymous(!isAnonymous)}
            checkedChildren="On"
            unCheckedChildren="Off"
          />
        </Form.Item>
        <Form.Item label="Category (max: 1)" 
        rules={[{ required: true, message: "At least one category, please" }]} 
        >
          <Tags setCategories={setCategories} selectedKeys={data[0]?.categories?.map((cate:any) => cate._id)} />
        </Form.Item>

        <FormItem label="HashTags (Optional)" style={{ width: '100%' }}>
          <HashtagInput />
        </FormItem>

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
          <Checkbox defaultChecked>
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
      </Form>
    </Card>
  ) : (
    <Space
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin tip="Loading, wait a few" size="large" style={{}}>
        <div className="content" style={{ width: '200px', textAlign: 'center' }}>
          {' '}
          ...{' '}
        </div>
      </Spin>
    </Space>
  )
}
