const couponRoutes = [
    {
        path: '/admin-dashboard/add/coupon',
        name: 'addCoupon',
        component: () => import('@/pages/admin/coupons/AddCoupon.vue'),
        meta: { requiresAuth: true, role: "admin" },
     
    },
];
export default couponRoutes;