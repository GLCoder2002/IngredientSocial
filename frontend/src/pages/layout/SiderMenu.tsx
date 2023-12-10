import { Layout, Menu } from 'antd';
import { useState } from 'react';
import useRoleNavigate from '../../libs/role-navigate';

interface AppSidebarProps {
  menuItems: Array<any>;
}

export default function SiderMenu({ menuItems }: AppSidebarProps) {
  const navigate = useRoleNavigate();
  const [tabKey, setTabKey] = useState([window.location.pathname.split('/')?.[2] || 'home']);

  const handleClickMenu = async (val: any) => {
    setTabKey([val.key]);
    switch (val.key) {
      case 'home':
        navigate('/');
        break;
      default:
        navigate(`/${val.key}`);
    }
  };

  return (
    <>
      <Layout.Sider
        width={287}
        style={{
          background: '#34495e', 
          position: 'sticky',
          zIndex: 1,
          marginTop: '10px',
          alignSelf: 'start',
          height: '97vh',
          top: '50px',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
          paddingTop: '12px',
        }}
      >
        <Menu
          className="menu-sidebar"
          onClick={handleClickMenu}
          defaultSelectedKeys={tabKey}
          mode="inline"
          theme="dark"
          items={menuItems}
          style={{
            background: 'transparent', 
          }}
        />
      </Layout.Sider>
    </>
  );
}
