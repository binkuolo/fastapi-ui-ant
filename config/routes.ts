export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
        footerRender: false,
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: '用户中心',
    icon: 'user',
    access: 'user',
    routes: [
      {
        name: '用户管理',
        path: '/admin/index',
        access: 'user_m',
        component: './user/User',
      },
      {
        name: '角色管理',
        path: '/admin/role',
        access: 'role_m',
        component: './user/Role',
      },
      {
        path: '/admin/set/access',
        component: './user/Access',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/account',
    routes: [
      {
        name: '个人中心',
        path: '/account/center',
        component: './user/Center',
      },
      {
        name: '个人设置',
        path: '/account/settings',
        component: './user/Settings',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
