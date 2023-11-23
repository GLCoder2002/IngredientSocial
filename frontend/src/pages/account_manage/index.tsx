import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Button, Card, Row, Space, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { Http } from '../../api/http'
import EditAccountModal from './edit-account'
import SearchField from 'components/search-field/searchField'

interface DataType {
  id: string
  username: string
  email: string
}

function AccountManager() {
  const { enqueueSnackbar } = useSnackbar()
  const [accounts, setAccounts] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [searchKey, setSearchKey] = useState('')

  const filteredAccounts = useMemo(() => {
    return accounts?.filter((acc: DataType) => acc.username.toLowerCase().includes(searchKey.toLowerCase().trim()))
  }, [accounts, searchKey])

  const handleDeleteAccount = async (id:any) => {
    await await Http.delete('/api/v1/users/deleteUser', id)
      .then(res => setAccounts(accounts.filter((acc:any) => acc._id !== id)))
      .catch(error => enqueueSnackbar('Failed to delete account !', { variant: 'error' }))
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: '_id',
      width: '20%',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'username',
      sorter: (a: DataType, b: DataType) => a.username.length - b.username.length,
      width: '30%',
      key: 'username',
    },
    {
      title: 'Actions',
      render: (_, record: any) => (
        <Space wrap>
          <Button type="text" icon={<EditOutlined />} onClick={() => setEditModal(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteAccount(record._id)} />
        </Space>
      ),
      width: '20%',
      key: 'Actions',
      align: 'center',
    },
  ]

  const getAllUser = async () =>
    await Http.get('/api/v1/users')
      .then(res => setAccounts(res.data.data))
      .catch(error => enqueueSnackbar('Failed to get all accounts !', { variant: 'error' }))
      .finally(() => setLoading(false))

  useEffect(() => {
    setLoading(true)
    getAllUser()
  }, [])

  return (
    <Row gutter={16} style={{ padding: '20px', margin: 0 }}>
      <Card
        title="All accounts"
        bordered={false}
        style={{ width: '100%' }}
        bodyStyle={{ overflow: 'scroll', height: loading ? '500px' : 'auto', minHeight: '500px' }}
      >
        <SearchField setInput={setSearchKey} inputKey={searchKey} placeholder="Search accounts by name" />
        <Table
          columns={columns}
          dataSource={filteredAccounts.sort(
            (a:any, b:any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )}
          loading={loading}
        />
      </Card>
      <EditAccountModal
        userProfile={editModal}
        onCloseModal={() => setEditModal(false)}
        onSubmit={() => {
          setLoading(true)
          getAllUser()
        }}
      />
    </Row>
  )
}

export default AccountManager
