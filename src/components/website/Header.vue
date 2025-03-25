<template>
<header>
    <nav class="navbar navbar-expand-lg navbar-light bg-neutral">
        <div class="container-fluid">
            <a class="navbar-brand logo" href="#">
                <img src="@/assets/e-mart.jpeg" alt="E-Shop Icon" class="logo-icon" />
                <!-- E-Mart -->
            </a>
            
            <button class="navbar-toggler" type="button" @click="toggleNavbar" aria-controls="navbarNav" :aria-expanded="isNavbarOpen ? 'true' : 'false'" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navbar items -->
            <!-- <div class="collapse navbar-collapse" :class="{ show: isNavbarOpen }" id="navbarNav"> -->
            <div class="navbar-collapse" :class="{ 'show': isNavbarOpen }" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/shop">Shop</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/categories">Categories</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/deal">Deals</router-link>
                    </li>
                    <li class="nav-item">
                        <!-- <router-link class="nav-link" to="/cart"><span v-if="token">{{ countUserItem }}</span><i class="fas fa-shopping-cart"></i> Cart</router-link> -->
                        <router-link class="nav-link cart-link" to="/cart">
                            <i class="fas fa-shopping-cart"></i>
                            <span v-if="token && countUserItem" class="cart-count">
                                {{ countUserItem }}
                            </span>
                            Cart
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="nav-link" to="/login" v-if="!token">Login</router-link>
                    </li>
                    <li class="nav-item user-dropdown">
                        <img v-if="token && profileImage.image" :src="getImageUrl(profileImage.image)" class="user-icon" alt="User Icon" />
                        <img v-else src="@/assets/profile-icon/user-icon.png" class="user-icon" alt="User Icon" />
                        <ul class="dropdown-menu">
                            <li>
                                <router-link to="/user/profile" class="dropdown-item">Profile</router-link>
                            </li>
                            <li>
                                <router-link to="/user/orders" class="dropdown-item">Orders</router-link>
                            </li>
                            <li>
                                <router-link to="/user/wishlist" class="dropdown-item">Wishlist</router-link>
                            </li>
                            <!-- <li><a href="/settings" class="dropdown-item">Settings</a></li> -->
                            <li><a class="dropdown-item logout" href="javascript:void(0)" v-if="token" @click="handleLogout">LogOut</a></li>
                        </ul>
                    </li>

                    <!-- Search Bar -->
                    <li class="nav-item">
                        <form class="d-flex" role="search">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
</template>

<script setup>
import apiClient from '@/service/Index';
import {useStore} from 'vuex';
import {ref,computed,onMounted,onUnmounted } from 'vue';
import {useRouter} from 'vue-router';
import showToast from "@/plugins/toast.js";
import { getImageUrl } from '@/utils/Helper';
import eventBus from "@/eventBus";
const store = useStore();
const router = useRouter();
const isNavbarOpen = ref(false);
const profileImage = ref('');
const token = computed(() => store.getters['auth/getToken']);
const countUserItem = computed(() => store.getters['userCart/getUserCartItem']);

const handleLogout = async () => {
    try {
        const response = await apiClient.post('/logout');
        if (response.data.status === 200) {
            store.dispatch('auth/logout');
            store.dispatch('userCart/removeCartItem');
            router.push('/');
            showToast("success", "Logout successfully");
        }
    } catch (error) {
        console.log('Something went wrong during logout:', error);
        showToast("error", "Something went wrong during logout");
    }
};
const toggleNavbar = () => {
    isNavbarOpen.value = !isNavbarOpen.value;
};
const resetNavbarState = () => {
    isNavbarOpen.value = false;
};
const fetchUserProfileImage = async () => {
    if(!token.value) return;
    try {
        const response = await apiClient.get('/user/profile/image');
        if (response ?.data ?.success) {
            profileImage.value = response.data.userProfile || null;
        } else {
            console.warn('No profile image found:', response.data.message);
        }
    } catch (error) {
        console.error('Error fetching profile image:', error.response ?.data ?.message || error.message);
    } 
};
onMounted(() => {
    window.addEventListener("popstate", resetNavbarState);
    fetchUserProfileImage();
    eventBus.on("profileImageUpdated", fetchUserProfileImage);
});
onUnmounted(() => {
    eventBus.off("profileImageUpdated", fetchUserProfileImage);
});

</script>

<style scoped>
.bg-neutral {
    background-color: #333333 !important;
    border-bottom: 2px solid #444444;
    padding: 10px 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1050;
}

/* Logo Styles */
.logo {
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-decoration: none;
    padding-left: 15px;
    display: flex;
    align-items: center;
}

.logo-icon {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%!important;
}

/* Navbar link styles */
.navbar-nav .nav-item .nav-link {
    color: #d1d1d1 !important;
    font-size: 16px;
    font-weight: 500;
    margin: 0 15px;
    text-transform: capitalize;
    transition: all 0.3s ease-in-out;
}

.navbar-nav .nav-item .nav-link:hover {
    color: #ff9f00 !important;
    text-decoration: underline;
}

.navbar-nav .nav-item .nav-link.active {
    color: #ff9f00 !important;
    font-weight: 600;
}

/* Navbar search form styles */
.navbar-nav .nav-item form .form-control {
    width: 200px;
    border-radius: 30px;
    border: 1px solid #ff9f00;
}

.navbar-nav .nav-item form .btn {
    background-color: #ff9f00;
    border-radius: 30px;
    color: #fff;
    padding: 6px 15px;
    margin-left: 10px;
    transition: all 0.3s ease;
}

.navbar-nav .nav-item form .btn:hover {
    background-color: #e68900;
}

/* Navbar collapse styles */
.navbar-collapse {
    position: relative;
    z-index: 1051;
}

.navbar-toggler-icon {
    background-color: transparent;
    position: relative;
    width: 30px;
    height: 25px;
}

.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
    content: "";
    position: absolute;
    width: 30px;
    height: 3px;
    background-color: #ff9f00;
    transition: 0.3s ease;
}

.navbar-toggler-icon::before {
    top: 0;
}

.navbar-toggler-icon::after {
    bottom: 0;
}

.navbar-toggler.collapsed .navbar-toggler-icon::before {
    transform: rotate(45deg);
    top: 10px;
}

.navbar-toggler.collapsed .navbar-toggler-icon::after {
    transform: rotate(-45deg);
    bottom: 10px;
}

/* Fixing Navbar Layout for 1024px screen */
@media (max-width: 1024px) {
    .navbar {
        width: 100%;
        /* Ensure navbar doesn’t overflow outside of the page */
        padding-left: 0;
        /* Remove any extra padding */
        padding-right: 0;
        /* Remove any extra padding */
    }

    .navbar-nav {
        display: flex;
        justify-content: center;
        /* Center nav items */
        padding-top: 10px;
        flex-wrap: wrap;
        /* Ensure it doesn’t overflow horizontally */
    }

    .navbar-nav .nav-item {
        margin: 10px 15px;
        /* Adjust margins between items */
    }

    .navbar-toggler {
        border-color: #ff9f00;
    }

    .navbar-toggler-icon {
        background-color: #ff9f00;
    }

    .navbar-nav .nav-item .nav-link {
        font-size: 14px;
        /* Adjust font size */
    }
}

/* For mobile devices (below 768px) */
@media (max-width: 768px) {
    .navbar-nav {
        text-align: center;
        padding-top: 10px;
    }

    .navbar-nav .nav-item {
        margin: 10px 0;
    }

    .navbar-toggler {
        border-color: #ff9f00;
    }

    .navbar-toggler-icon {
        background-color: #ff9f00;
    }
}

/* For very small screens (below 480px) */
@media (max-width: 480px) {
    .logo-text {
        font-size: 1rem;
    }

    .logo-icon {
        width: 25px;
    }

    .navbar-nav .nav-item .nav-link {
        font-size: 14px;
        /* Adjust font size for small screens */
    }

    .navbar-nav .nav-item form .form-control {
        width: 150px;
        /* Reduce search bar width on small screens */
    }
}

.cart-link {
    position: relative;
    display: inline-block;
}

.cart-link i {
    font-size: 20px;
    /* Adjust icon size */
    position: relative;
}

.cart-count {
    position: absolute;
    top: -5px;
    right: 43px;
    background: #45b582;
    color: white;
    font-size: 12px;
    font-weight: bold;
    width: 16px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

/* User Dropdown Styling */
.user-dropdown {
    position: relative;
    display: inline-block;
}

.user-dropdown:hover .dropdown-menu {
    display: block;
}

.user-icon {
    width: 50px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #007bff;
    object-fit: cover;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
    margin-right: 18px;
}

.user-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
}

.user-icon:active {
    transform: scale(0.95);
    box-shadow: none;
}

.dropdown-menu {
    display: none;
    position: absolute;
    top: 50px;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 10px;
    z-index: 1000;
    width: 200px;
    left: 0px;
}

.dropdown-item {
    display: block;
    padding: 10px;
    font-size: 1rem;
    color: #333;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.2s, color 0.2s;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
    color: #00ff00;
}

.logout {
    color: #dc3545;
}

.logout:hover {
    background-color: #ffe6e6;
}

@media (max-width: 768px) {
    .dropdown-menu {
        top: 60px;
        right: 10px;
        width: 100%;
    }

    .user-icon {
        width: 50px;
    }
}
</style>
