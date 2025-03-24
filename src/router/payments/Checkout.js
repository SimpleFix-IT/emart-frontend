const paymentCheckoutRoute= [
    {
        path:'/checkout',
        name: 'Checkout',
        meta: { requiresAuth: true },
        props: true,
        component: () => import('@/pages/checkout/Checkout.vue'),
    },
    {
        path: '/checkout/success',
        name: 'SuccessPage',
        meta: { requiresAuth: true },
        component: () => import('@/pages/checkout/Success.vue'),
    },
    {
        path: '/checkout/cancel',
        name: 'CancelPage',
        meta: { requiresAuth: true },
        component: () => import('@/pages/checkout/Cancel.vue'), 
    },
]
export default paymentCheckoutRoute;