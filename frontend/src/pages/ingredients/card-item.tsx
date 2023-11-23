import { DeleteOutlined, EditOutlined} from '@ant-design/icons'
import { Button, Card } from 'antd'

const {Meta} = Card

interface IIngredient {
  _id: string
  name: string
  image:string
  description:string
  posts: any
}

function IngredientCardItem({
  ingredient,
  handleDeleteIngredient,
  handleEditIngredient,
}: {
  ingredient: IIngredient
  handleDeleteIngredient: any
  handleEditIngredient:any
}) {
  return (
    <Card
    style={{ width: '100%', display: 'block',height:'100%'}}
    cover={
      <img
        width={100}
        height={200}
        alt="ingredientImage"
        src={ingredient.image}
      />
    }
    bordered={false}
    actions={[
      <Button type="text" icon={<EditOutlined />} onClick={() => handleEditIngredient(ingredient)} />,
      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteIngredient(ingredient._id)} />,
    ]}
    headStyle={{ borderBottom: '2px solid #d7d7d7' }}
  >
    <Meta
      title={ingredient.name}
      description={ingredient.description}
    />
  </Card>
  )
}

export default IngredientCardItem
