import Cookies from 'js-cookie';
const mutations = {
    setUserData(state, { token, role, userId }) {
        if (token) {
            state.token = token;
            Cookies.set('token', token, { sameSite: 'Strict', expires: 1 }); // No secure flag for dev
        }
        if (role) {
            state.role = role;
            Cookies.set('role', role, { sameSite: 'Strict', expires: 1 });
        }
        if (userId) {
            state.userId = userId;
            Cookies.set('userId', userId, { sameSite: 'Strict', expires: 1 });
        }
    },
    removeUserData(state) {
        state.token = null;
        state.role = null;
        state.userId = null;
        Cookies.remove('token', { path: '/' });
        Cookies.remove('role', { path: '/' });
        Cookies.remove('userId', { path: '/' });
    },
};

export default mutations;