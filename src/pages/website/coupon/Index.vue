<template>
<div class="coupon-product-page">
    <!-- Hero Section -->
    <section class="hero-section text-center py-5">
        <div class="container">
            <h1 class="display-4 fw-bold text-white">🔥 Exclusive Deals & Discounts 🔥</h1>
            <p class="lead text-white mb-4">Shop now to grab the best offers and limited-time deals on top products!</p>
            <button class="btn btn-deal btn-lg">Shop Now</button>
        </div>
    </section>

    <!-- Loader -->
    <div class="loader">
        <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>

    <!-- Product Section -->
    <section class="categories py-5" v-if="product">
        <div class="container">
            <h2 class="text-center mb-5 fw-bold">🎉 Featured Product 🎉</h2>
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <div class="card product-card shadow-lg border-0 rounded">
                        <img :src="getImageUrl(product.image)" class="card-img-top" alt="Product Image" />
                        <div class="card-body text-center">
                            <h5 class="card-title">{{ product.name }}</h5>
                            <p class="text-success fs-4 fw-bold">₹{{ parseInt(product.discount_price) }}</p>
                            <p class="text-muted">Offer Price</p>
                            <p class="text-danger text-decoration-line-through">₹{{ parseInt(product.price) }}</p>
                            <button class="btn btn-primarys mt-3 w-100" @click="handleAddToCart(product.id)"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                            <button class="btn btn-outline-secondary btn-custom mt-3 w-100" @click="addToWishlist(product.id)">
                                <i class="fas fa-heart" :class="{ 'text-white': wishlist.has(product.id), 'text-muted': !wishlist.has(product.id) }"></i>
                                Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- No Product Available -->
    <section v-else-if="!loading" class="py-5 text-center">
        <div class="container">
            <h2 class="mb-4">😢 Product Not Available</h2>
            <p>Sorry, the product you're looking for is not available at the moment.</p>
        </div>
    </section>
</div>
</template>

<script setup>
import apiClient from '@/service/Index';
import {
    ref,
    onMounted,
    computed,
    reactive
} from 'vue';
import {
    getImageUrl
} from '@/utils/Helper';
import {
    useRoute,
    useRouter
} from 'vue-router';
import {
    useStore
} from 'vuex';
import showToast from "@/plugins/toast.js";
const wishlist = reactive(new Set());
const product = ref(null);
const loading = ref(true);
const store = useStore();
const route = useRoute();
const router = useRouter();
const couponId = route.params.couponId;
const userData = computed(() => ({
    token: store.getters['auth/getToken'],
}));
const fetchCoupon = async () => {
    try {
        const response = await apiClient.get(`/coupons/${couponId}`);
        if (response.data ?.success) {
            product.value = response.data.product;
            loading.value = false;
        }
    } catch (error) {
        console.error('Deals not fetched', error);
        loading.value = false;
    }
};

const handleAddToCart = async (id) => {
    if (!userData.value.token) {
        localStorage.setItem('redirectPath', window.location.pathname);
        alert('Please log in to add items to the cart.');
        showToast("info", "Please log in to add items to the cart.");
        return router.push({
            name: 'Login'
        });
    }
    try {
        const responseAddToCart = await apiClient.post('/add-to-cart', {
            productId: id
        });
        if (responseAddToCart ?.data) {
            store.dispatch('userCart/userCartItem', responseAddToCart.data.count);
            if (responseAddToCart.data.message == 'Product added to the cart successfully.') {
                showToast("success", responseAddToCart.data.message);
                return router.push({
                    name: 'Cart'
                });
            }
            if (responseAddToCart.data.message == 'Product is already in the cart.') {
                showToast("info", responseAddToCart.data.message);
            }
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast("error", "Failed to add item to cart. Please try again.");
    }
};
const addToWishlist = async (id) => {
    if (!userData.value.token) {
        localStorage.setItem('redirectPath', window.location.pathname);
        showToast("info", "Please log in to add items to the wishlist.");
        return router.push({
            name: 'Login'
        });
    }
    try {
        const wishlistResponse = await apiClient.post('/user/add/wishlist', {
            id: id
        });
        if (wishlistResponse ?.data.success) {
            wishlist.add(id);
            showToast("success", "Product added to wishlist successfully.");
        } else {
            showToast("error", wishlistResponse ?.data.message || "Something went wrong while adding to the wishlist.");
        }
    } catch (error) {
        if (error.response) {
            const {
                status,
                data
            } = error.response;
            if (status === 409) {
                showToast("warning", data.message || "This product is already in your wishlist.");
            } else if (status === 422) {
                showToast("error", "Invalid data. Please try again.");
                console.error("Validation errors:", data.errors);
            } else {
                showToast("error", data.message || "An unexpected error occurred. Please try again later.");
            }
        } else {
            showToast("error", "Unable to connect to the server. Please check your internet connection.");
        }
        console.error('Error while adding to wishlist:', error);
    }
};
onMounted(() => {
    fetchCoupon();
});
</script>

<style scoped>
/* Hero Section */
.hero-section {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    padding: 80px 0;
}

.hero-section h1 {
    font-size: 3rem;
    font-weight: 700;
}

.hero-section p {
    font-size: 1.2rem;
}

.hero-section .btn-deal {
    background-color: #ff5733;
    border-color: #ff5733;
    color: white;
    padding: 0.75rem 2rem;
    font-weight: 600;
    border-radius: 30px;
    transition: all 0.3s ease-in-out;
}

.hero-section .btn-deal:hover {
    background-color: #e04e2e;
    transform: scale(1.05);
}

/* Product Card */
.product-card {
    border-radius: 15px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card-img-top {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 15px 15px 0 0;
}

.card-body {
    padding: 1.5rem;
    background-color: #fff;
    text-align: center;
}

.card-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
}

.price {
    font-size: 1.5rem;
    font-weight: 700;
}

.text-success {
    color: #28a745;
}

.text-danger {
    color: #dc3545;
}

/* Add to Cart Button */
.btn-primarys {
    background-color: #28a745;
    border-color: #28a745;
    padding: 0.25rem 1.5rem;
    font-weight: 400;
    border-radius: 35px;
    transition: background-color 0.3s ease-in-out, transform 0.2s;
}

.btn-primarys:hover {
    background-color: #218838;
    transform: scale(1.05);
}

.btn.btn-primarys {
    color: #FFFFFF;
}

.text-white {
    color: rgb(68, 223, 76) !important;
}

.text-muted {
    color: gray !important;
}

.btn-outline-secondary {
    color: #6c757d;
    border-color: #6c757d;
}

.btn-outline-secondary:hover {
    background-color: #6c757d;
    color: #fff;
    transform: scale(1.05);
}

.btn-primarys,
.btn-outline-secondary {
    border-radius: 35px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-section h1 {
        font-size: 2.5rem;
    }

    .hero-section p {
        font-size: 1rem;
    }

    .card-title {
        font-size: 1.3rem;
    }

    .price {
        font-size: 1.2rem;
    }

    .btn-primary {
        padding: 0.5rem 1rem;
    }
}
</style>
