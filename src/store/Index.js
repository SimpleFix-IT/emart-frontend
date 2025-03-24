import { createStore } from 'vuex';
import auth from './modules/auth';
import userCart from './modules/userCart';
const store = createStore ({
    modules:{
        auth,
        userCart,
    }
    // state: {
    //     token: Cookies.get('token') ? Cookies.get('token') : null,
    //     role:Cookies.get('role')  || null,
    //     userId: Cookies.get('userId') || null,
    // },
    // mutations: {
    //     setUserData(state,{token,role,userId}){
    //         if(token){
    //             state.token = token;
    //             Cookies.set('token', token, { secure: true, sameSite: 'Strict', expires: 1 });
    //         }
    //         if(role)
    //         {
    //             state.role = role;
    //             Cookies.set('role',role,  { secure: true, sameSite: 'Strict', expires: 1 })
    //         }
    //         if(userId){
    //             state.userId = userId;
    //             Cookies.set('userId',userId, { secure: true, sameSite: 'Strict', expires: 1 })
    //         }
    //     },
    //     removeUserData(state){
    //         state.token = null;
    //         state.role = null;
    //         state.userId = null;
    //         Cookies.remove('token', { path: '/' });
    //         Cookies.remove('role', { path: '/' });
    //         Cookies.remove('userId', { path: '/' });
    //     },
      
    // },
    // actions: {
    //     login({commit},{token,role,userId}){
    //         commit('setUserData',{token,role,userId});
    //         // commit('checkRole',role);
    //         // commit('userId', userId);
    //     },
    //     logout({commit}){
    //         commit('removeUserData');
    //     },
    //     // role({commit},role){
    //     //     Cookies.set('role',role,  { secure: true, sameSite: 'Strict', expires: 1 })
    //     //     commit('checkRole',role);
    //     // }
    // },
    // getters: {
    //     getToken:(state) => state.token,
    //     getRole: (state) => state.role,
    //     getUserId: (state) => state.userId,
    // },

});
export default store;
