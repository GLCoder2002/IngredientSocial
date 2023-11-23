import { useNavigate } from 'react-router-dom'
import { useSubscription } from './global-state-hooks'
import { userStore } from '../pages/auth/userStore'



export default function useRoleNavigate() {
  const navigate = useNavigate()
  const {
    state: { role },
  } = useSubscription(userStore, ['role'])

  const roleBasedNavigate = (endPoint:string) => navigate(role ? `/${role}${endPoint}` : endPoint)

  return roleBasedNavigate
}
