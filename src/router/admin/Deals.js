const dealRoutes = [

    {
        path: '/admin-dashboard/add/deal',
        name: 'AddDeal',
        component: () => import('@/pages/admin/deals/AddDeal.vue'),
        meta: { requiresAuth: true, role: "admin" },
     
    }
];
export default dealRoutes;