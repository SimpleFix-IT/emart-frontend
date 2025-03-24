const actions = {
    userCartItem({commit},userItemCount){
        commit('setUserCartItem',userItemCount);
    },
    removeCartItem({commit}){
        commit('removeCartItem');
    },
};
export default actions;