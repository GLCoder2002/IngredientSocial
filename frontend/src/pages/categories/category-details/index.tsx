import { Button, Card, Empty, List, Typography } from 'antd'
import { Http } from 'api/http'
import useRoleNavigate from 'libs/role-navigate'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import IngredientCard from './ingredients-items'

const { Title } = Typography

export default function CategoryDetails() {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useRoleNavigate()
  const [category, setCategory] = useState<any>(null)

  const getCategoryDetails = async () => {
    await Http.get(`/api/v1/categories?id=${id}`)
      .then(res => {
        setCategory(res.data?.data[0] || null)
      })
      .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
  }

  useEffect(() => {
    getCategoryDetails()
  }, [id])

  const navigateIngredientForm = () => {
    navigate(`/ingredients`)
  }
  return (
    <Card
      title={
        <Title style={{ margin: 0, fontSize: 24, textOverflow: 'ellipsis' }}>Name category: {category?.name}</Title>
      }
      style={{ borderRadius: 0,padding:'10px 0px 0px 20px', height: '100%'}}
      headStyle={{ backgroundColor: '#1677ff6d', borderRadius: 0 }}
    >
      <Title style={{ margin: '20px 0px 16px', fontSize: 18, color: '#1677ff' }}>Ingredients in this category:</Title>

      {category?.ingredients?.length ? (
        <List
          itemLayout="vertical"
          size="large"
          style={{
            marginBottom: '50px',
          }}
          dataSource={category?.ingredients}
          renderItem={(ingredientId, index) => <IngredientCard index={index} key={index} ingredientId={ingredientId} />}
        />
      ) : (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 60 }}
          description={<span>There is no any ingredient yet</span>}
          style={{ width: '100%', padding: 20 }}
        >
          <Button type="primary" onClick={() => navigateIngredientForm()}>
            Create Now
          </Button>
        </Empty>
      )}
    </Card>
  )
}
