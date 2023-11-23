import { Card, message, Skeleton } from 'antd'
import Title from 'antd/es/typography/Title'
import { Http } from 'api/http'
import { useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

function IngredientClassifyPieChart() {
  const [allIngredients, setAllIngredients] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const getAllIngredients = async () => {
    await Http.get('/api/v1/ingredients')
      .then(res => {
        setAllIngredients(res.data.data.map((ingredient:any) => ({ name: ingredient.name, posts: ingredient.posts })))
        setLoading(false)
      })
      .catch(err => message.error('Failed to get ingredient list'))
  }

  useEffect(() => {
    setLoading(true)
    getAllIngredients()
  }, [])

  const renderActiveShape = (props:any) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} post(s)`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  const formattedData = useMemo(() => {
    if (allIngredients.length) {
      const top5Data = allIngredients
        .map(ingredient => ({ name: ingredient.name, value: ingredient.posts.length }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

      const totalIdea = allIngredients
        .map(ingredient => ({ name: ingredient.name, value: ingredient.posts.length }))
        .sort((a, b) => b.value - a.value)
        .slice(5)
      const restData = totalIdea.length
        ? {
            name: 'Others',
            value: totalIdea.flatMap(ingredient => ingredient.value).reduce((acc, cur) => acc + cur),
          }
        : {}
      return [...top5Data, restData]
    }
  }, [allIngredients])

  return (
    <Skeleton loading={loading}>
      {allIngredients.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <Card bordered={false}>
            <Title level={3} style={{ margin: '5px' }}>
              Number posts of each ingredients
            </Title>

            <PieChart width={500} height={300}>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                innerRadius={90}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {formattedData!.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </Card>
        </ResponsiveContainer>
      ) : null}
    </Skeleton>
  )
}

export default IngredientClassifyPieChart
