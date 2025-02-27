const state = {
    cartItem: JSON.parse(localStorage.getItem('cartItem')) || '',
};
export default state;