import { Card, Checkbox, Image, Col, Input, Row } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { Http } from "api/http";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import styled from 'styled-components';

export default function IngredientTable({setIngredientSelected}:any) {
  const [ingredientList, setIngredientList] = useState<any>([]);
  const [searchKey, setSearchKey] = useState('');
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAllIngredient = async () => {
    setLoading(true);
    try {
      const res = await Http.get('/api/v1/ingredients');
      setIngredientList(res.data.data);
    } catch (error:any) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllIngredient();
  }, []);

  const handleMouseEnter = (ingredientSelected: string) => {
    setHoveredIngredient(ingredientSelected);
  };

  const handleMouseLeave = () => {
    setHoveredIngredient(null);
  };

  const handleOnchange = (ingredientSelected: CheckboxValueType[])=>{
    setIngredientSelected(ingredientSelected)
  }

  return (
      <>
      <Card loading={loading}>
      <Input
      style={{ marginBottom: 16 }}
      allowClear
      placeholder="Search ingredient"
      value={searchKey}
      onChange={(e) => setSearchKey(e.target.value)} />
      <Checkbox.Group onChange={handleOnchange}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {ingredientList
          .filter((c: any) => c.name?.toLowerCase()?.includes(searchKey?.toLowerCase()))
          .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .map((ingredient: any, index: any) => (
            <Col className="gutter-row" span={6} key={index}>
              <StyledLabel
                onMouseEnter={() => handleMouseEnter(ingredient.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Checkbox value={ingredient._id}>
                  {ingredient.name}
                  <StyledImage visible={hoveredIngredient === ingredient.name} width='30px' height='20px' src={ingredient.image} />
                </Checkbox>
              </StyledLabel>
            </Col>
          ))}
      </Row>
      </Checkbox.Group>
      </Card>
      </>
  );
}

const StyledLabel = styled.label`
  position: relative;
`;

const StyledImage = styled(Image)<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  display: ${(props) => (props?.visible ? 'block' : 'none')};
  z-index: 1;
`;
