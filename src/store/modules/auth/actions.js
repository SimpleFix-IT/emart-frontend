
const  actions = {
    login({commit},{token,role,userId}){
        commit('setUserData',{token,role,userId});
        // commit('checkRole',role);
        // commit('userId', userId);
    },
    logout({commit}){
        commit('removeUserData');
    },
};

export default actions