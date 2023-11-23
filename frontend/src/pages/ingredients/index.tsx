import { PlusCircleTwoTone } from '@ant-design/icons'
import { Button, Col, Divider, Input, Row, Skeleton, Typography } from 'antd'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Http } from 'api/http'
import AddIngredientModal from './add-new-ingredient'
import IngredientCardItem from './card-item'
import EditIngredientModal from './edit-exist-ingredient'

const { Title } = Typography

function IngredientManage() {
  const { enqueueSnackbar } = useSnackbar()
  const [searchKey, setSearchKey] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [allIngredientList, setAllIngredientList] = useState<any>([])
  const [editIngredient, setEditIngredient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [openEditModal,setOpenEditModal] = useState(false)
  const handleEditIngredient = (ingredient: any) => {
    setEditIngredient(ingredient);
    setOpenEditModal(true);
  };
  const getIngredientList = async () => {
    setLoading(true)
    await Http.get('/api/v1/ingredients')
      .then((res:any) => {
        setAllIngredientList(res.data.data)
      })
      .catch((error:any) => enqueueSnackbar(error.message, { variant: 'error' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getIngredientList()
  }, [])

  const handleDeleteIngredient = async (id: string) => {
    await Http.delete('/api/v1/ingredients/delete', id)
      .then(() => setAllIngredientList(allIngredientList.filter((ingredient:any) => ingredient._id !== id)))
      .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
  }

  return (
    <>
      <AddIngredientModal
        setLoading={setLoading}
        isOpen={openModal}
        onCloseModal={() => setOpenModal(false)}
        setIngredientList={setAllIngredientList}
        ingredientList={allIngredientList}
      />
      <EditIngredientModal
        setLoading={setLoading}
        isOpen={openEditModal}
        onCloseModal={() => setOpenEditModal(false)}
        setIngredientList={setAllIngredientList}
        ingredientList={allIngredientList}
        currentIngredient={editIngredient}
      />
      <div style={{ padding: 20, margin: 0 }}>
        <Row justify="space-between">
          <Title level={3} style={{ margin: 0 }}>
            Ingredients list
          </Title>
          <Button
            icon={<PlusCircleTwoTone twoToneColor={'#005ec2'} />}
            onClick={() => {
              setOpenModal(true)
              setEditIngredient(null)
            }}
            size="large"
          >
            Add new ingredient
          </Button>
        </Row>
        <Divider />
        <Input
          style={{ marginBottom: 16 }}
          allowClear
          placeholder="Search ingredient"
          value={searchKey}
          onChange={e => setSearchKey(e.target.value)}
        />
        <Skeleton loading={loading} avatar active>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {allIngredientList
              .filter((c:any) => c.name?.toLowerCase().includes(searchKey?.toLowerCase()))
              .sort((a:any, b:any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((ingredient:any, index:any) => (
                <Col className="gutter-row" xs={24} sm={12} md={8} lg={8} key={index} style={{ marginBottom: 16 }}>
                  <IngredientCardItem
                    ingredient={ingredient}
                    handleEditIngredient={handleEditIngredient}
                    handleDeleteIngredient={handleDeleteIngredient}
                  />
                </Col>
              ))}
          </Row>
        </Skeleton>
      </div>
    </>
  )
}

export default IngredientManage
