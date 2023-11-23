import { Card, Col, Row } from 'antd'
import Meta from 'antd/es/card/Meta'
import { Http } from 'api/http'
import { useEffect, useState } from 'react'

function IngredientCard({ ingredientId }: any) {
  const [ingredientDetail, setIngredientDetail] = useState<any>(null)
  const findIngredient = async (id: any) => {
    try {
      const response = await Http.get(`/api/v1/ingredients/detail/${id}`);
      setIngredientDetail(response.data.ingredient);
    } catch (error) {
      console.error('Error fetching ingredient:', error);
      setIngredientDetail(null);
    }
  }
  useEffect(() => {
    if (ingredientId) {
      findIngredient(ingredientId);
    }
  }, [ingredientId]);
  if (!ingredientDetail) return null

  return (
    <>
      <Row gutter={[16,16]}>
        <Col span={6}>
        <Card
        hoverable
        style={{ width: '100%', display: 'block',height:'100%'}}
        cover={<img alt="ingredient" src={ingredientDetail.image} />}
      >
        <Meta title={ingredientDetail.name} description={ingredientDetail.description} />
      </Card>
        </Col>
      </Row>
    </>
  )
}

export default IngredientCard
