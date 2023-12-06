import { HomeFilled, RedditOutlined, UsergroupDeleteOutlined, WeiboOutlined } from '@ant-design/icons';
import { Layout, MenuProps, Avatar } from 'antd';
import { Content } from 'antd/es/layout/layout';
import useWindowSize from '../../../utils/useWindowSize';
import { getItem } from '../admin';
import AppHeader from '../Header';
import AppSidebar from '../AppSideBar';
import RightSideBar from './RightSideBar';
import { useSubscription } from 'libs/global-state-hooks';
import { userStore } from 'pages/auth/userStore';
import AppFooter from '../Footer';

const UserLayout = ({ children }: { children: any }) => {
  const {
    state: { avatar, username },
  } = useSubscription(userStore, ['avatar', 'username']);
  const windowWidth = useWindowSize();
  const contentStyle = windowWidth > 1000
    ? { width: '100%', background: 'none' }
    : { maxWidth: 'none', width: '100%' };

  const items: MenuProps['items'] = [
    {
      label: (
        <>
          <Avatar style={{marginRight:'10px'}} src={avatar} /> {username}
        </>
      ),
      key: 'account',
    },
    {
      type: 'divider',
    },
    getItem('PUBLIC', 'grp', null, [
      getItem('Home', 'home', <HomeFilled />),
      getItem('Advance Search', 'advance', <WeiboOutlined />),
      getItem('Posts', 'posts', <RedditOutlined />),
    ], 'group'),
  ];

  return (
    <>
      <AppHeader />
      <Layout
        style={{
          width: '100%',
          background: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <AppSidebar items={items} />
        <Content style={contentStyle}>
          <>{children}</>
        </Content>
        <RightSideBar />
      </Layout>
      <AppFooter/>
    </>
  );
};

export default UserLayout;
