import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { authRequire: true },
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/dashboard/NewsFeedView.vue'),
      },
      {
        path: 'friends',
        name: 'Friends',
        component: () => import('@/views/dashboard/FriendsView.vue'),
      },
      {
        path: 'videos',
        name: 'Videos',
        component: () => import('@/views/dashboard/VideosView.vue'),
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/dashboard/MessagesView.vue'),
      },
      {
        path: 'groups',
        name: 'Groups',
        component: () => import('@/views/dashboard/GroupsView.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/dashboard/SettingsView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuthStore()

  console.log(to)

  if (to.meta.authRequire && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (isAuthenticated && ['/login', '/register'].includes(to.path)) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
