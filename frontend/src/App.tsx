import { useEffect } from "react"
import { Layout, message } from "antd"
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom"
import { useAuth } from "./hooks/auth-hook"
import { Http, LOCALSTORAGE } from "./api/http"
import { userCredential, userStore } from "./pages/auth/userStore"
import Login from "./pages/auth/login"
import RoleAccess from "./pages/auth/accessRole"
import UserLayout from "./pages/layout/user"
import AdminLayout from "./pages/layout/admin"
import UnAuthorize from "./components/unauth/unauthorize"
import './App.css'
import HomePage from "pages/home"
import CreatePost from "pages/posts/create-new-post"
import UserProfile from "pages/user-profile"
import OtherProfile from "pages/user-profile/otherProfile"
import PostDetail from "pages/posts/post-detail"
import EditPost from "pages/posts/edit-post"
import DashboardAdmin from "pages/dashboard"
import IngredientManage from "pages/ingredients"
//import AdvanceSearch from "components/search-field/advanceSearch"
import CategoryManager from "pages/categories"
import CategoryDetails from "pages/categories/category-details"
import UserList from "pages/user-profile/userList"
import AccountManager from "pages/account_manage"

export default function App() {
  const navigate = useNavigate()
  const { login, logout, token, tokenVerified, userId, role } = useAuth()
  const credential = JSON.parse(localStorage.getItem(LOCALSTORAGE.CREDENTIALS)||'{}')

  useEffect(() => {
    userCredential.updateState({
      userId: userId,
      isLoggedIn: tokenVerified,
      token: token,
      login: login,
      logout: logout,
    })

    if (credential) {
      if (credential?.token === '' || !credential?.token) {
        navigate('/login')
        return message.info('Join us and share your passion!')
      } else {
        if (credential?.tokenVerified === true && credential?.userId) {
          userCredential.updateState({
            userId: credential.userId,
            isLoggedIn: credential.tokenVerified,
            token: credential.token,
          })

          const updateUserInfo = async () => {
            await Http.get(`/api/v1/users/getProfile/${credential.userId}`)
              .then((res:any) => {
                userStore.updateState({ ...res.data.userInfo, loading: false })
              })
              .catch((err:any) => {
                console.error(err.message)
                navigate('/')
              })
          }
          updateUserInfo()
        } else {
          navigate('/login')
          return message.info('Join us and share your passion!')
        }
      }
    } else {
      navigate('/login')
      return message.info('Join us and share your passion!')
    }
  }, [])

  let routes: any

  if (credential?.tokenVerified) {
    routes = (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" />
        <Route path="/" element={<Navigate to={role ? `/${role}` : '/'} replace />} />

        <Route
          path="/user"
          element={
            <RoleAccess roles={['user']}>
              <Layout style={{ minHeight: '100vh' }}>
                <UserLayout>
                  <Outlet />
                </UserLayout>
              </Layout>
            </RoleAccess>
          }
        >
          <Route path="" element={<HomePage />} />
          <Route path="posts" element={<HomePage />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="account" element={<UserProfile />} />
          <Route path="profile" element={<UserList/>} />
          <Route path="post" element={<PostDetail />} />
          <Route path="post/edit" element={<EditPost/>} /> 
          {/* <Route path="advance" element={<AdvanceSearch/>} />  */}
        </Route>

        <Route
          path="/admin"
          element={
            <RoleAccess roles={['admin']}>
              <Layout style={{ minHeight: '100vh' }}>
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </Layout>
            </RoleAccess>
          }
        >
          <Route path="posts" element={<HomePage />} />
          <Route path="" element={<HomePage />} />
          <Route path="account" element={<UserProfile />} />
          <Route path="post" element={<PostDetail />} />
          <Route path="dashboard" element={<DashboardAdmin/>} />
          <Route path="ingredients" element={<IngredientManage />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="category/:id" element={<CategoryDetails />} />
          <Route path="users" element={<AccountManager/>} />
          {/* <Route path="advance" element={<AdvanceSearch />} /> */}
        </Route>

        <Route path="*" element={<Navigate to={role ? `/${role}` : '/'} replace />} />
        <Route path="/unauthorize" element={<UnAuthorize></UnAuthorize>}></Route>
      </Routes>
    )
  } else {
    routes = (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Navigate to={'/login'} replace />} />
      </Routes>
    )
  }

  return (
    <>
      {routes}
    </>
  )
}
