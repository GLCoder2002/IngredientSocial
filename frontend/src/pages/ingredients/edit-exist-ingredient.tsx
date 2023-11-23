import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Upload, message } from 'antd';
import { useSnackbar } from 'notistack';
import { Http } from '../../api/http';
import { PlusOutlined } from '@ant-design/icons';
import { handleValidateFile, onChangeUpload, previewFile } from 'components/upload/uploadImage';

interface EditIngredientModalProps {
  isOpen: any;
  onCloseModal: any;
  setLoading: any;
  setIngredientList: any;
  ingredientList: any;
  currentIngredient: any;
}

export default function EditIngredientModal({
  isOpen,
  onCloseModal,
  setLoading,
  setIngredientList,
  ingredientList,
  currentIngredient,
}: EditIngredientModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [imageState, setImageState] = useState<any>([]);
  const [form] = Form.useForm();
  const [categoriesOption, setCategoriesOption] = useState<any>([]);

  const getAllCategories = async () => {
    await Http.get('/api/v1/categories')
      .then((res) => setCategoriesOption(res.data.data))
      .catch((error) => enqueueSnackbar('Failed to get all categories !', { variant: 'error' }));
  };

  useEffect(() => {
    getAllCategories();
    form.setFieldsValue({
      name: currentIngredient?.name,
      category: currentIngredient?.category,
      description: currentIngredient?.description,
    });
  }, [currentIngredient, form]);

  const onFinish = async () => {
    if (!form.getFieldValue('name') || !form.getFieldValue('description')) {
      message.error('Some of your fields are empty!');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.getFieldValue('name'));
    formData.append('category', form.getFieldValue('category'));
    formData.append('description', form.getFieldValue('description'));
    formData.append('_id', currentIngredient?._id || '');
    if (imageState.length > 0) {
      formData.append('image', imageState[0].originFileObj);
    }

    try {
      const ingredientUpdate = await Http.put(`/api/v1/ingredients/update/${currentIngredient?._id}`, formData);

      await setIngredientList(
        ingredientList.map((ingredient: any) => {
          if (ingredient._id === currentIngredient?._id) {
            return [ingredientUpdate,ingredient]
          }
          return ingredient;
        })
      );

      onCloseModal();
    } catch (error: any) {
      console.error('Error during upload:', error);
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };
  return(
    <Modal
      open={isOpen}
      onCancel={() => {
        onCloseModal()
        form.resetFields()
      }}
      title="Create new ingredient"
      onOk={onFinish}
      destroyOnClose
    >
      <Form
  labelCol={{ span: 10 }}
  wrapperCol={{ span: 14 }}
  layout="horizontal"
  style={{ width: '100%' }}
  form={form}
>
  <Form.Item
    name="name"
    label="Ingredient name"
    labelAlign="left"
    required
    rules={[
      { required: true, message: 'Your ingredient name is missing' },
      { max: 30, message: 'Maximum 30 characters allowed for the name' },
    ]}
  >
    <Input
      placeholder="Pork, Chicken, ..."
      allowClear
    />
  </Form.Item>
  <Form.Item
    name="category"
    label="Category"
    labelAlign="left"
    required
    rules={[
      { required: true, message: 'Please select a category' },
    ]}
  >
    <Select
      style={{ width: '100%' }}
      options={categoriesOption.map((category: any) => ({
        value: category._id,
        label: category.name,
      }))}
      placeholder="Select category"
    />
  </Form.Item>
  <Form.Item
    name="description"
    label="Ingredient description"
    labelAlign="left"
    required
    rules={[
      { required: true, message: 'Your ingredient description is missing' },
      { max: 125, message: 'Maximum 125 characters allowed for the description' },
    ]}
  >
    <Input
      placeholder="Chicken wing, ..."
      allowClear
    />
  </Form.Item>
  <Form.Item
    name="image"
    label="Upload image"
    valuePropName="fileList"
    labelAlign="left"
    getValueFromEvent={(e) => {
      const validFiles = handleValidateFile(e);
      setImageState(validFiles);
    }}
    required
  >
    <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          onPreview={previewFile}
          accept="image/*"
          beforeUpload={file => onChangeUpload(file)}
          maxCount={1}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
  </Form.Item>
</Form>
    </Modal>
  )}