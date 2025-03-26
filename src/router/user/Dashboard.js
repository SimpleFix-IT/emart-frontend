const userDashboardRoute= [
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/pages/users/CartPage.vue'),
    },
 
    // {
    //     path:'/checkout',
    //     name: 'Checkout',
    //     meta: { requiresAuth: true },
    //     props: true,
    //     component: () => import('@/pages/checkout/Index.vue'),
    // },
    {
        path:'/user/profile',
        name: 'userProfile',
        meta: { requiresAuth: true },
        props: true,
        component: () => import('@/pages/users/UserProfile.vue'),
    },   
    {
        path:'/user/orders',
        name: 'userOrders',
        meta: { requiresAuth: true },
        props: true,
        component: () => import('@/pages/users/Orders.vue'),
    },  
 
    {
        path:'/user/wishlist',
        name: 'userWishlist',
        meta: { requiresAuth: true },
        props: true,
        component: () => import('@/pages/users/Wishlist.vue'),
    }, 
    // {
    //     path:'/user/settings',
    //     name: 'userSettings',
    //     meta: { requiresAuth: true },
    //     props: true,
    //     component: () => import('@/pages/users/AccountSettings.vue'),
    // },  
]
export default userDashboardRoute;