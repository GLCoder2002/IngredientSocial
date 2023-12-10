import React from 'react';
import {
  CalendarOutlined,
  DashboardFilled,
  FormOutlined,
  HomeFilled,
  SafetyOutlined,
  TagOutlined,
  TeamOutlined,
  UngroupOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import { Layout, MenuProps } from 'antd';
import { Content } from 'antd/es/layout/layout';
import useWindowSize from '../../../utils/useWindowSize';
import AppHeader from '../Header';
import AppSidebar from '../AppSideBar';
import AppFooter from '../Footer';

type MenuItem = Required<MenuProps>['items'][number];

export function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: 'group'): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items: MenuProps['items'] = [
  getItem('Home', 'home', <HomeFilled />),
  {
    type: 'divider',
  },
  getItem('PUBLIC', 'grp', null, [
    getItem('Your Profile', 'account', <WeiboOutlined />),
    getItem('Users', 'users', <TeamOutlined />),
    getItem('DashBoard', 'dashboard', <DashboardFilled />),
    getItem('Category', 'categories', <TagOutlined />),
    getItem('Ingredients', 'ingredients', <FormOutlined />),
  ],
  'group'
  ),
];

const AdminLayout = ({ children }: { children: any }) => {
  const windowWidth = useWindowSize();
  const contentStyle = windowWidth > 1000
    ? {
      width: '100%',
      background: 'none',
    }
    : {
      maxWidth: 'none',
      width: '100%',
    };

  return (
    <>
      <AppHeader />
      <Layout style={{
        width: '100%',
        background: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        height: '100%',
      }}>
        <AppSidebar items={items} />
        <Content style={contentStyle}>
          {children}
        </Content>
      </Layout>
      {/* <AppFooter/> */}
    </>
  );
};

export default AdminLayout;
