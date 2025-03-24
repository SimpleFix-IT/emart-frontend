const categoriesRoute = [
  {
    path: '/admin-dashboard/category',
    name: 'category',
    component: () => import('@/pages/admin/categories/AddCategory.vue'),
    meta:{ requiresAuth: true, role: "admin" }
  },
  {
    path: '/admin-dashboard/categories',
    name: 'AllCategories',
    component:() => import('@/pages/admin/categories/AllCategories.vue'),
    meta: { requiresAuth: true, role: "admin" }
  },
  {
    path: '/admin-dashboard/sub-category',
    name: 'subCategory',
    component:() => import('@/pages/admin/categories/AddSubCategory.vue'),
    meta: { requiresAuth: true, role: "admin" }
  },
  {
    path: '/admin-dashboard/subcategories',
    name: 'subCategories',
    component:() => import('@/pages/admin/categories/Subcategories.vue'),
    meta: { requiresAuth: true, role: "admin" }
  },
];

export default categoriesRoute;