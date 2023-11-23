import {Navigate} from 'react-router-dom'
import {Spin} from 'antd'
import { userStore } from './userStore'
import { useSubscription } from '../../libs/global-state-hooks'

const RoleAccess = ({
  roles = [],
  children
}:{roles:Array<string>,children:React.ReactNode}) => {
  const {
    state: {
      role,
      loading
    }
  } = useSubscription(userStore, ['role'])
  if (loading) {
    return (
      <div className="center"
        style={
          {
            width: '100wh',
            height: '100vh'
          }
      }>
        <Spin size="large"/>
      </div>
    )
  }
  return !roles.length || roles.includes(role) ? <>{children}</> : <Navigate to="/unauthorize" replace/>
}

export default RoleAccess
