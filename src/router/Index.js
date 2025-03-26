// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Cookies from "js-cookie";
import NotFound from '@/pages/empty/404.vue';
import categoriesRoute   from '@/router/admin/Categories.js';
import Auth              from '@/router/auth/Auth.js';
import websiteRoute     from '@/router/website/Website';
import productRoutes from '@/router/admin/Products.js';
import dealRoutes from '@/router/admin/Deals.js';
import couponRoutes from '@/router/admin/Coupon.js';
import dashboardRoutes from '@/router/admin/Dashboard.js';
import userDashboardRoute from '@/router/user/Dashboard.js';
import  paymentCheckoutRoute from '@/router/payments/Checkout.js';
let routes = [];
routes = routes.concat(Auth,websiteRoute,categoriesRoute,productRoutes,dealRoutes,couponRoutes,dashboardRoutes,userDashboardRoute,paymentCheckoutRoute);

// ✅ 404 Catch-All Route (Should be the last route)
routes.push({
  path: "/:pathMatch(.*)*",
  component: NotFound
});
const router = createRouter({
    history:createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  const userRole = Cookies.get("role");
 
  if (token && (to.path === '/login' || to.path === '/sign-up')) {
    if(userRole === 'user'){
      next({ path: '/' });
    }else if(userRole === 'admin'){
      next({ path: '/admin-dashboard' });
    }
    return;
  }
  if (token && userRole === 'admin' && to.path.startsWith('/')) {
    if (to.path !== '/admin-dashboard' && to.meta.role !== 'admin') {
      next({ path: '/admin-dashboard' });
      return;
    }
  }
  if (token && to.path === '/') {
    if (userRole === 'admin') {
      next({ path: '/admin-dashboard' });
    } else {
      next(); 
    }
    return;
  }
  
  if (to.meta.requiresAuth) {
    if (!token) {
      next({ name: "Login" });
    } else if (to.meta.role && to.meta.role !== userRole) {
      next({ name: "Home" });
    } else {
      next();
    }
  }
   else {
    next();
  }
});
router.afterEach((to) => {
  if(to.fullPath !== '/login'){
    localStorage.setItem('redirectPath', to.fullPath);
  }
});



export default router;
