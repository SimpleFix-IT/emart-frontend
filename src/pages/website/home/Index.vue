<template>
<div class="main-page">
    <!-- Carousel Section (Hero Section) -->
    <section class="hero">
        <div class="hero-content">
        <h1 class="hero-title">Welcome to E-Mart</h1>
        <p class="hero-subtitle">Get the best deals on your favorite products</p>
        <router-link to="/shop" class="hero-btn">Shop Now</router-link>
        </div>
    </section>
    <div class="coupon-section-home" v-if="coupon && userData.token">
        <h4 class="coupon-title-home">
            Coupon Deal
        </h4>
        <p class="product-name">
            Product name: <strong> {{coupon.products.name}}</strong>
        </p>
        <button @click="gotToDeal(coupon.id)" class="c-b">
            Let's Go for Deal
        </button>
    </div>

    <!-- Category Section -->
    <section class="categories py-5" v-if="categories.length > 0">
        <div class="container">
            <h2 class="text-center mb-4">Shop by Categories</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                <div class="col" v-for="category in categories" :key="category.id">
                    <div class="card category-card">
                        <img :src="getImageUrl(category.image)" @click="subCategory(category.slug,category.id)" style="cursor: pointer;" class="card-img-top" alt="Category Image">
                        <div class="card-body text-center">

                            <h5 class="card-title">{{ category.name }}</h5>
                            <a :href="category.link" class="btn btn-primarys" @click="handleFetchSubCategory(category.slug,category.id)">Shop Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div v-else-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div class="latest-products py-10 bg-gray-100">
        <div class="container mx-auto px-4">
            <!-- Section Title -->
            <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">Latest Products</h2>
        </div>
    </div>
    <section class="products-grid py-5" v-if="products.length > 0">
        <div class="container">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                <div class="col" v-for="product in products" :key="product.id">
                    <div class="card product-card shadow-sm">
                        <!-- Product Image -->
                        <img :src="getImageUrl(product.image)" @click="detailProduct(product.slug, product.id)" style="cursor: pointer;" class="card-img-top product-image" alt="Product Image">

                        <div class="card-body product-body">
                            <h5 class="product-name">{{ product.name }}</h5>
                            <p class="product-description">
                                {{ isExpanded[product.id] ? product.description : product.description.slice(0, 100) + '...' }}
                                <button v-if="product.description.length > 100" class="see-more-btn" @click="toggleDescription(product.id)">
                                    {{ isExpanded[product.id] ? 'See Less' : 'See More' }}
                                </button>
                            </p>
                            <!-- Price Section -->
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <p class="price">₹{{ parseInt(product.discount_price) }}</p>
                                <p class="original-price text-muted">₹{{ parseInt(product.price) }}</p>
                            </div>
                            <!-- Buttons -->
                            <div class="button-group d-flex justify-content-between mt-3">
                                <button class="btn btn-primarys btn-custom" @click="handleAddToCart(product.id)">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                                <button class="btn btn-outline-secondary btn-custom" @click="addToWishlist(product.id)">
                                  <i class="fas fa-heart" :class="{ 'text-white': wishlist.has(product.id), 'text-muted': !wishlist.has(product.id) }"></i>
                                  Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div v-else-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <!-- Promotional Banner -->
    <section class="promo-banner bg-light py-4">
        <div class="container text-center">
            <h3>Special Discount on Electronics</h3>
            <p>Get up to 50% off on selected electronics. Don't miss out!</p>
            <button class="btn btn-success">Shop Now</button>
        </div>
    </section>
</div>
</template>

<script setup>
import {ref,onMounted,computed,reactive} from 'vue';
import apiClient from '@/service/Index';
import {getImageUrl} from '@/utils/Helper.js';
import {useRouter} from 'vue-router'; 
import {useStore} from 'vuex';
import showToast from "@/plugins/toast.js";
const wishlist = reactive(new Set());
const categories = ref([]);
const router = useRouter();
let loading = ref(true);
const products = ref([]);
const store = useStore();
const coupon = ref('');
const isExpanded = ref({});
const userData = computed(() => ({
    role: store.getters['auth/getRole'],
    token: store.getters['auth/getToken'],
}));
const fetchCategories = async () => {
    try {
        const response = await apiClient.get('/fetch-categories');
        if (response.data.success) {
            loading.value = false;
            categories.value = response.data.allCategories;
            // showToast("success", "Categories found successfully.");
        } else {
            throw new Error('Failed to fetch categories');
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // showToast("error", "Categories not found.");
        } else {
            console.error('Error fetching categories:', error);
            // showToast("error", "An error occurred while fetching categories.");
        }
        categories.value = [];
        loading.value = false;
    }
};
const fetchProducts = async () => {
    try {
        const responseProduct = await apiClient.get('/latest-products');
        if (responseProduct.data ?.success) {
            products.value = responseProduct.data.products;
            loading.value = false;
            // showToast("success", "Products found successfully.");
        } else {
            throw new Error('Failed to fetch products');
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('Products not found:', error);
            // showToast("error", "Products not found.");
        }
        products.value = [];
        loading.value = false;
    }

}
const handleFetchSubCategory = async (categorySlug, categoryId) => {
    try {
        const responseSubCategory = await apiClient.get(`fetch-sub-category/${categoryId}`);
        if (responseSubCategory.data.success) {
            router.push({
                name: 'sub-categories',
                params: {
                    categorySlug,
                    categoryId
                }
            });
        }
    } catch (error) {
        // showToast("error", "This category does not have sub-categories");
        console.log('something wrong', error);
    }
};
const handleAddToCart = async (id) => {
    if (!userData.value.token) {
        localStorage.setItem('redirectPath', window.location.pathname);
        // alert('Please log in to add items to the cart.');
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
            const userItemCount = responseAddToCart.data.count;
            store.dispatch('userCart/userCartItem', userItemCount);
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
        // showToast("error", "Failed to add item to cart. Please try again.");
        console.error('Error adding to cart:', error);
    }
};
const detailProduct = async (slug, id) => {
    try {
        const responseProduct = await apiClient.get(`/product-details/${slug}/${id}`);
        if (responseProduct.data && responseProduct.data.success) {
            const product = responseProduct.data.product;
            router.push({
                name: 'productDeatils',
                params: {
                    productSlug: product.slug
                }
            });
        } else {
            console.error('Product not found or API error:', responseProduct.data.message);
            // showToast("error", "Product not found.");
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        // showToast("error", "Error fetching product.");
        // alert('An error occurred while fetching the product details.');
    }
};
const fetchCoupons = async () => {
    try {
        const responseCoupon = await apiClient.get('/coupons');
        if (responseCoupon.data ?.success) {
            coupon.value = responseCoupon.data.coupon;
        }
    } catch (error) {
        console.error("Error fetching coupons:", error);
        // showToast("error", "Error fetching coupons.");
    }
};
const gotToDeal = async (id) => {
    return router.push({
        name: 'coupon',
        params: {
            couponId: id
        }
    });
};
const toggleDescription = (productId) => {
    isExpanded.value[productId] = !isExpanded.value[productId];
};
const subCategory = async (categorySlug, categoryId) => {
    await handleFetchSubCategory(categorySlug, categoryId)
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
    fetchCategories();
    fetchProducts();
    if (userData.value.role == 'user') {
        fetchCoupons();
    }
});
</script>

<style scoped>
@import '@/assets/website/home.css';

@import '@/assets/website/categories.css';
.text-white {
  color: rgb(68, 223, 76) !important;
}

.text-muted {
  color: gray !important;
}

/* new hero section css */
.hero {
    position: relative;
    width: 100%;
    height: 30vh; /* Medium screen coverage */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: 20px;
    background: linear-gradient(135deg, #ff7e5f, #feb47b, #ffcc33); /* Warm, vibrant gradient */
}

.hero-content {
    background: rgba(0, 0, 0, 0.3); /* Light overlay for readability */
    padding: 30px;
    border-radius: 10px;
}

.hero-title {
    font-size: 2.5rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
}

.hero-subtitle {
    font-size: 1.3rem;
    margin-bottom: 20px;
}

.hero-btn {
    background: #ffcc33;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: bold;
    transition: 0.3s ease-in-out;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.hero-btn:hover {
    background: #ff9900;
    transform: scale(1.05);
}

/* ✅ Responsive Design */
@media (max-width: 768px) {
    .hero {
        height: 40vh;
        padding: 10px;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1.1rem;
    }

    .hero-btn {
        font-size: 1rem;
        padding: 10px 20px;
    }
}

</style>
