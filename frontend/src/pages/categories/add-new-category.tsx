import { Form, Input, message, Modal } from 'antd'
import { useSnackbar } from 'notistack'
import { Http } from '../../api/http'

interface CategoryModalProps{
  isOpen:any,
  onCloseModal:any,
  setLoading:any,
  setCategoriesList:any,
  categoriesList:any,
  currentCategory:any,
}
export default function AddCategoryModal({
  isOpen,
  onCloseModal,
  setLoading,
  setCategoriesList,
  categoriesList,
  currentCategory,
}:CategoryModalProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [form] = Form.useForm()

  const onFinish = async () => {
    if (!form.getFieldValue('name')) {
      message.error('Name is empty!')
    } else if (currentCategory?.name !== form.getFieldValue('name')) {
      setLoading(true)
      const categoryForm = {
        name: form.getFieldValue('name'),
        description: form.getFieldValue('description'),
        _id: currentCategory?._id || null,
      }
      await Http.post('/api/v1/categories', categoryForm)
        .then(() => {
          if (currentCategory?._id) {
            setCategoriesList(
              categoriesList.map((category:any) => {
                if (category._id === currentCategory._id) {
                  category.name = form.getFieldValue('name')
                  category.description = form.getFieldValue('description')
                }
                return category
              })
            )
          } else {
            setCategoriesList([categoryForm, ...categoriesList])
          }
          onCloseModal()
        })
        .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
        .finally(() => setLoading(false))
    } else {
      message.error('Please type a different name!')
    }
    form.resetFields()
  }

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        onCloseModal()
        form.resetFields()
      }}
      title="Create new category"
      onOk={onFinish}
      destroyOnClose
    >
      <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} layout="horizontal" style={{ width: '100%' }} form={form}>
        <Form.Item name="name" label="Category name" labelAlign="left" required>
          <Input placeholder="Meat, Fish,..." allowClear defaultValue={currentCategory?.name} />
        </Form.Item>
        <Form.Item name="description" label="Category description" labelAlign="left" required>
          <Input placeholder="More detail about the category" allowClear defaultValue={currentCategory?.description} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
