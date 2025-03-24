const mutations = {
    setUserCartItem(state,cartItem){
        state.cartItem = cartItem,
        localStorage.setItem('cartItem', JSON.stringify(cartItem));
    },
    removeCartItem(state){
        state.cartItem = null,
        localStorage.removeItem('cartItem');
    }
}
export default mutations;