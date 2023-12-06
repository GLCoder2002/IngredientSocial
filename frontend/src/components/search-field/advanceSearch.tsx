import React, { useEffect, useState } from 'react';
import { Button, Card, Checkbox,Image, Col, Input, Modal, Row } from 'antd';
import { Http } from 'api/http';
import { enqueueSnackbar } from 'notistack';
import styled from 'styled-components';

const AdvanceSearch: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState<any>([]);
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const [ingredientList, setIngredientList] = useState<any>();
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<any>([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleMouseEnter = (ingredientSelected: string) => {
    setHoveredIngredient(ingredientSelected);
  };

  const handleMouseLeave = () => {
    setHoveredIngredient(null);
  };

  const handleIngredientChange = (event:any) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedIngredients([...selectedIngredients, name]);
    } else {
      setSelectedIngredients(selectedIngredients.filter((ingredient:any) => ingredient !== name));
    }
  };
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
  
  const findPostsByIngredients = async () => {
    try {
      const response = await fetch(`/api/posts/findPostsByIngredients?ingredients=${selectedIngredients.join(',')}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <Card loading={loading}>
      <Input
      style={{ marginBottom: 16 }}
      allowClear
      placeholder="Search ingredient"
      value={searchKey}
      onChange={(e) => setSearchKey(e.target.value)} />
      <Checkbox.Group onChange={handleIngredientChange}>
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
      <Button loading={loading} onClick={findPostsByIngredients}>Find</Button>
      </Card>
      </Modal>
    </>
  );
};

export default AdvanceSearch;

const StyledLabel = styled.label`
  position: relative;
`;

const StyledImage = styled(Image)<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  z-index: 1;
`;