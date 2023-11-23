import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons'
import { Badge, Button, Card } from 'antd'
import Link from 'antd/es/typography/Link'
import useRoleNavigate from 'libs/role-navigate'
import { useEffect, useState } from 'react'

interface ICategory {
  _id: string
  name: string
  ingredients: any[]
}

function CategoryCardItem({
  category,
  handleDeleteCategory,
  setEditCategory,
}: {
  category: ICategory
  handleDeleteCategory: any
  setEditCategory: (category: any) => void
}) {
  const navigate = useRoleNavigate()
  const [ingredientCount, setIngredientCount] = useState(category?.ingredients?.length)

  useEffect(() => {
    setIngredientCount(category?.ingredients?.length);
  }, [category.ingredients]);

  const handleViewCategoryDetails = (id: string) => {
    navigate(`/category/${id}`)
  }

  return (
    <Badge.Ribbon
      text={ingredientCount}
      color={ingredientCount > 5 ? 'green' : ingredientCount === 0 ? 'red' : 'volcano'}
    >
      <Card
        cover={
          <div
            className="center w-100 h-100"
            style={{
              display: 'flex',
              minHeight: '150px',
              borderRadius: '8px 8px 0px 0px',
              cursor: 'pointer',
              backgroundSize:'cover',
              backgroundPosition:'center',
              backgroundImage:`url(https://res.cloudinary.com/draisiudw/image/upload/c_fit,h_150,w_363/v1700485418/avatars/backgournd_wbw4sf.jpg)`
            }}
            onClick={() => handleViewCategoryDetails(category._id)}
          >
            <Link
              style={{
                fontFamily: ` 'Share Tech', sans-serif`,
                fontSize: '38px',
                color: 'white',
                textShadow: `8px 8px 10px #0000008c`,
              }}
            >
              {category?.name}
            </Link>
          </div>
        }
        bordered={false}
        style={{ width: '100%', display: 'block' }}
        actions={[
          <Button type="text" icon={<EyeTwoTone />} onClick={() => handleViewCategoryDetails(category._id)} />,
          <Button type="text" icon={<EditOutlined />} onClick={() => setEditCategory(category)} />,
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteCategory(category._id)} />,
        ]}
        headStyle={{ borderBottom: '2px solid #d7d7d7' }}
        bodyStyle={{ display: 'none' }}
      ></Card>
    </Badge.Ribbon>
  )
}

export default CategoryCardItem
