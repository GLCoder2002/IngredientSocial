import { LogoutOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, ConfigProvider, Dropdown, Layout, MenuProps, Row, Space, Typography } from "antd";
import { useSnackbar } from "notistack";
import useWindowSize from "../../utils/useWindowSize";
import { Link, useNavigate } from "react-router-dom";
import { userCredential, userStore } from "pages/auth/userStore";
import { createSubscription, useSubscription } from "libs/global-state-hooks";
import useRoleNavigate from "libs/role-navigate";
import AutoSearch from "components/search-field/autoCompleteSearch";

const { Header } = Layout;

const { Text } = Typography;
export const postCount = createSubscription({ number: 0 })
function AppHeader() {
  const {
    state: { logout },
  } = useSubscription(userCredential);
  const navigate = useRoleNavigate();
  const navigator = useNavigate();
  const windowWidth = useWindowSize();
  const { enqueueSnackbar } = useSnackbar();
  const {
    state: { avatar },
  } = useSubscription(userStore, ['avatar']);

  const userMenu: MenuProps['items'] = [
    {
      key: 'account',
      label: (
        <Text style={{ fontSize: 20, margin: 0 }} onClick={() => handleClickMenu({ key: 'account' })}>
          Profile
        </Text>
      ),
      icon: <UserOutlined style={{ fontSize: 20 }} />,
    },
    {
      key: 'logout',
      label: (
        <Text style={{ fontSize: 20, margin: 0 }} onClick={() => handleClickMenu({ key: 'logout' })}>
          Logout
        </Text>
      ),
      icon: <LogoutOutlined style={{ fontSize: 20 }} />,
    },
  ]
  const handleLogout = () => {
    logout()
    navigator('/login')
    window.location.reload();
    return enqueueSnackbar("Logout successful!")
  }

  const handleClickMenu = async (val: any) => {
    switch (val.key) {
      case 'logout':
        handleLogout()
        break
      default:
        navigate(`/${val.key}`)
    }
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            iconSize: 35,
            horizontalItemBorderRadius: 10,
            horizontalLineHeight: 56,
            horizontalItemHoverBg: '393E46',
            horizontalItemSelectedBg: 'white',
            padding: 20,
            margin: 25,
          },
        },
      }}
    >
      <Header
         style={{
          background: '#2c3e50',
          display: 'flex',
          position: 'sticky',
          zIndex: 2,
          boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px',
          alignSelf: 'start',
          top: 0,
          width: '100%',
          height: '56px',
          lineHeight: 0,
          padding: windowWidth < 1300 ? '0px 10px' : '0px 10px',
        }}
      >
        <Row
          style={{
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '60px',
          }}
        >
          <Space>
            <Link to={'/'} style={{ marginRight: 20, margin: '5px', display: 'contents' }}>
              <Avatar size='large' style={{ background: 'white' }} src='../assets/logo.svg' alt="Logo" />
            </Link>
          <Typography.Title level={3} style={{ margin: 0, color:'#ecf0f1', fontFamily: 'Arial, sans-serif' }}>
            Social Ingredient
           </Typography.Title>
          </Space>
          <Space style={{ height: '40px', width: '500px', padding: '0 5px', display: 'flex', alignItems: 'center' }}>
            <AutoSearch/>
          </Space>
          <Space>
            <Dropdown className="d-flex center" menu={{ items: userMenu }} trigger={['click']}>
              <Avatar
                style={{
                  backgroundColor: 'rgb(246 247 248)',
                  verticalAlign: 'middle',
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
                }}
                size={40}
                gap={0}
                src={avatar}
              />
            </Dropdown>
          </Space>
        </Row>
      </Header>
    </ConfigProvider>
  )
}
export default AppHeader;



