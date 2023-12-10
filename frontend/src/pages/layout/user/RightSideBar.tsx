import { Layout } from 'antd';
import React from 'react';
import useWindowSize from '../../../utils/useWindowSize';
import UserList from 'pages/user-profile/userList';

const RightSideBar: React.FC = () => {
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
            color: 'transparent',
          }}
        >
          <UserList />
        </Layout.Sider>
    </>
  );
};

export default RightSideBar;
