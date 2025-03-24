const auth = [
    {
        path: '/login',
        name: 'Login',
        // component: LoginPage
        component: () => import ('@/pages/auth/LoginPage.vue'),
    },
    { path: '/sign-up',
      name: 'signUp',
        //   component: RegisterPage
      component: () => import ('@/pages/auth/RegisterPage.vue'),
    },
    { 
      path: "/verify-email",
      name: "VerifyEmail",
      component: () => import ('@/pages/auth/VerifyEmail.vue'),
    },
    { 
      path: "/email-verification-success",
      name: "VerifyEmailSuccess",
      component: () => import ('@/pages/auth/EmailVerificationSuccess.vue'),
    },
    { 
      path: "/email-verification-failed",
      name: "VerifyEmailFailed",
      component: () => import ('@/pages/auth/EmailVerificationFailed.vue'),
    },
];
export default auth;
