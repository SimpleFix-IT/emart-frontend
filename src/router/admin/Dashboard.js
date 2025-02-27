const dashboardRoutes = 
[
 {
    path: '/admin-dashboard',
    name: 'adminDashboard',
    component: () => import ('@/pages/admin/adminDashboard/Index.vue'),
    meta: { requiresAuth: true, role: "admin" }
  },
  {
    path: '/admin-dashboard/profile',
    name: 'adminProfile',
    component: () => import ('@/pages/admin/adminDashboard/Profile.vue'),
    meta: { requiresAuth: true, role: "admin" }
  },
  {
    path: '/admin-dashboard/change-password',
    name: 'adminChangePassword',
    component: () => import ('@/pages/admin/adminDashboard/ChangePassword.vue'),
    meta: { requiresAuth: true, role: "admin" }
  },

];
export default dashboardRoutes;