
import Cookies from 'js-cookie';
const state = {
        token: Cookies.get('token') ? Cookies.get('token') : null,
        role:Cookies.get('role')  || null,
        userId: Cookies.get('userId') || null,
    }
 export default state;   