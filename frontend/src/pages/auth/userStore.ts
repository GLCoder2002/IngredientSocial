import { createSubscription } from "../../libs/global-state-hooks"


export const userStore = createSubscription({
  loading: true,
  role: '',
  _id: '',
  avatar: '',
  birthday: Date,
  email: '',
  phone: '',
  description: '',
  username: '',
  interests: [],
})

export const userCredential = createSubscription({
  userId: '',
  token: '',
  isLoggedIn: false,
  login: (uid: any, token: any, tokenVerified: any, expirationDate?: any) => {},
  logout: () => {},
})
