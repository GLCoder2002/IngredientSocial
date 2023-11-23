import { PlusCircleTwoTone } from '@ant-design/icons'
import { Button, Col, Divider, Input, Row, Skeleton, Typography } from 'antd'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import AddCategoryModal from './add-new-category'
import CategoryCardItem from './card-item'
import { Http } from 'api/http'

const { Title } = Typography

function CategoryManager() {
  const { enqueueSnackbar } = useSnackbar()
  const [searchKey, setSearchKey] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [allCategoryList, setAllCategoryList] = useState<any>([])
  const [editCategory, setEditCategory] = useState(null)
  const [loading, setLoading] = useState(false)

  const getCategoryList = async () => {
    setLoading(true)
    await Http.get('/api/v1/categories')
      .then(res => {
        setAllCategoryList(res.data.data)
      })
      .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getCategoryList()
  }, [])

  const handleDeleteCategory = async (id: string) => {
    await Http.delete('/api/v1/categories', id)
      .then(() => setAllCategoryList(allCategoryList.filter((category: { _id: string }) => category._id !== id)))
      .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
  }

  return (
    <>
      <AddCategoryModal
        setLoading={setLoading}
        isOpen={openModal}
        onCloseModal={() => setOpenModal(false)}
        setCategoriesList={setAllCategoryList}
        categoriesList={allCategoryList}
        currentCategory={editCategory}
      />
      <div style={{ padding: 20, margin: 0 }}>
        <Row justify="space-between">
          <Title level={3} style={{ margin: 0 }}>
            Categories list
          </Title>
          <Button
            icon={<PlusCircleTwoTone twoToneColor={'#005ec2'} />}
            onClick={() => {
              setOpenModal(true)
              setEditCategory(null)
            }}
            size="large"
          >
            Add new category
          </Button>
        </Row>
        <Divider />
        <Input
          style={{ marginBottom: 16 }}
          allowClear
          placeholder="Search categories"
          value={searchKey}
          onChange={e => setSearchKey(e.target.value)}
        />
        <Skeleton loading={loading} avatar active>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {allCategoryList
              .filter((c:any) => c.name.toLowerCase().includes(searchKey.toLowerCase()))
              .sort((a:any, b:any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((category:any, index:any) => (
                <Col className="gutter-row" xs={24} sm={12} md={8} lg={8} key={index} style={{ marginBottom: 16 }}>
                  <CategoryCardItem
                    category={category}
                    setEditCategory={category => {
                      setEditCategory(category)
                      setOpenModal(true)
                    }}
                    handleDeleteCategory={handleDeleteCategory}
                  />
                </Col>
              ))}
          </Row>
        </Skeleton>
      </div>
    </>
  )
}

export default CategoryManager
