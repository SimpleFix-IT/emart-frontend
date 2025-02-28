const productRoutes = [
    {
        path: '/admin-dashboard/add-product',
        name: 'addProduct',
        component: () => import('@/pages/admin/products/AddProduct.vue'),
        meta: { requiresAuth: true, role: "admin" },
    },
    {
        path: '/admin-dashboard/products',
        name: 'products',
        component: () => import('@/pages/admin/products/Products.vue'),
        meta: { requiresAuth: true, role: "admin" },
    },
];
export default productRoutes;