const auth = [
  { path: '/', redirect: '/login' },
  { path: '*', component: () => import('@/views/NotFoundPage') },
  { path: '/login', component: () => import('@/views/LoginPage') },
  { path: '/signup', component: () => import('@/views/SignupPage') },
]

export default auth
