import { Layout } from 'antd'
import React from 'react'
import useWindowSize from '../../../utils/useWindowSize'
import UserList from 'pages/user-profile/userList'
const RightSideBar: React.FC = () => {
  const windowSize = useWindowSize()

  return (
    <>
      {windowSize < 1000 ? (
        <>
        </>
      ) : (
        <Layout.Sider
        width={287}
        style={
          {
            background: 'linear-gradient(92.88deg, #455eb5 9.16%, #5643cc 43.89%, #673fd7 64.72%)',
            position: 'sticky',
            zIndex: 1,
            marginTop:'10px',
            alignSelf: 'start',
            height: '97vh',
            top: '50px',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
            paddingTop: '12px'
          }
      }
        >
        <UserList/>
        </Layout.Sider>
      )}
    </>
  )
}

export default RightSideBar
