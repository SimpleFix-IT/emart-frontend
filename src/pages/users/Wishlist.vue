<template>
<div class="wishlist-page">
    <!-- Page Header -->
    <header class="wishlist-header">
        <h1>My Wishlist</h1>
        <p class="subtitle">Your favorite items saved for later purchase.</p>
    </header>
    <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <!-- Wishlist Items -->
    <section class="wishlist-items" v-else-if="wishlists.length > 0">
        <div v-for="item in wishlists" :key="item.id" class="wishlist-card">
            <img :src="getImageUrl(item.product.image)" alt="Product Image" class="product-image" />
            <div class="card-details">
                <h2 class="product-title">{{ item.product.name }}</h2>
                <p class="product-price">₹{{ Number(item.product.discount_price).toFixed(0) }}</p>
                <div class="actions">
                    <button class="btn-add-to-cart" @click="handleAddToCart(item.product.id)">
                      <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-remove" @click="removeFromWishlist(item.id)">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    </section>
    <div v-else class="empty-wishlist">
        <div class="empty-wishlist-content">
            <img src="@/assets/empty-cart.jpg" alt="Empty Wishlist" class="empty-wishlist-image" />
            <h2>Your wishlist is currently empty</h2>
            <p class="empty-wishlist-text">
                Save your favorite items here and never lose track of what you love!  
                Explore our latest products and start adding to your wishlist.
            </p>
            <router-link to="/shop" class="btn-shop-now">Browse Products</router-link>
        </div>
    </div>
</div>
</template>

<script setup>
import apiClient from "@/service/Index";
import { getImageUrl } from "@/utils/Helper";
import showToast from "@/plugins/toast";
import {ref,onMounted} from "vue";
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
const wishlists = ref([]);
let loading = ref(true);
const store = useStore();
const router = useRouter();
const userWishlistItems = async () => {
  try {
    const response = await apiClient.get('/user/wishlists');

    if (response?.data.success) {
      wishlists.value = response.data.wishlists;
      loading.value = false;
    } else {
      showToast("warning", response?.data.message || "Failed to fetch wishlist.");
    }
  } catch (error) {
    if (error.response) {
      showToast("error", error.response.data.message || "Error fetching wishlist.");
      loading.value = true;
    } else if (error.request) {
      showToast("error", "No response from the server. Please try again later.");
      loading.value = true;
    } else {
      showToast("error", "An unexpected error occurred.");
      loading.value = true;
    }
  }
};
const handleAddToCart = async (id) => {
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
        showToast("error", "Failed to add item to cart. Please try again.");
        console.error('Error adding to cart:', error);
    }
};
const removeFromWishlist = async (id) => {
    try {
        const response = await apiClient.post('/remove-wishlist-item', { id });

        if (response?.data?.success) {
            showToast("success", response.data.message);
            userWishlistItems && await userWishlistItems();
        } else {
            showToast("error", response?.data?.message || "Failed to remove item.");
        }
    } catch (error) {
        console.error("Error removing wishlist item:", error);
        showToast("error", error.response?.data?.message || "An unexpected error occurred.");
    }
};

onMounted(() => {
  userWishlistItems();
})
</script>

<style scoped>
/* General Styles */
.wishlist-page {
    font-family: "Arial", sans-serif;
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
}

/* Header Styles */
.wishlist-header {
    text-align: center;
    margin-bottom: 20px;
}

.wishlist-header h1 {
    font-size: 2rem;
    margin: 0;
}

.wishlist-header .subtitle {
    font-size: 1rem;
    color: #666;
    
    margin: 5px 0 20px;
}

/* Wishlist Items */
.wishlist-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

/* Wishlist Card */
.wishlist-card {
    display: flex;
    flex-direction: column;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    transition: box-shadow 0.2s ease-in-out;
    min-height: 320px;
    /* Set minimum height to make all cards uniform */
}

.wishlist-card:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.product-image {
    width: 100%;
    height: 150px;
    object-fit: contain;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
}


/* Card Details */
.card-details {
    flex-grow: 1;
    /* Ensures uniform height */
    padding: 15px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Product Title */
.product-title {
    font-size: 1.5rem;
    margin: 0;
    color: #28a745;
    white-space: nowrap;
    /* Prevents text from breaking */
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
}

/* Ensuring uniform price and actions section */
.product-price {
    font-size: 1.5rem;
    color: #8c918d;
    margin: 10px 0;
    font-weight: 600;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

/* Buttons */
.actions button {
    padding: 10px 15px;
    border: none;
    /* border-radius: 5px; */
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.3s ease-in-out;
    border-radius: 35px;
}

.btn-add-to-cart {
  background-color: #28a745;
  border-color: #28a745;
  color: #FFFFFF;
}

.btn-add-to-cart:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.btn-remove {
  background: #b02a37;
  /* transform: scale(1.05); */
  color: #FFFFFF;
  border-radius: 35px;
}

.btn-remove:hover {
    background: #b02a37;
    transform: scale(1.05);
}

.empty-wishlist {
    text-align: center;
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.empty-wishlist-content {
    max-width: 500px;
    background: #f9f9f9;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.empty-wishlist-image {
    width: 150px;
    height: auto;
    margin-bottom: 15px;
}

.empty-wishlist h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 10px;
}

.empty-wishlist-text {
    font-size: 1rem;
    color: #666;
    margin-bottom: 20px;
}

.btn-shop-now {
    background: #007bff;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    display: inline-block;
    transition: background 0.3s ease-in-out;
}

.btn-shop-now:hover {
    background: #0056b3;
}

/* Responsive Styles */
@media (max-width: 768px) {
    .empty-wishlist {
        padding: 20px;
    }

    .empty-wishlist-content {
        width: 90%;
    }

    .empty-wishlist-image {
        width: 120px;
    }
}

/* Responsive Styles */
@media (max-width: 768px) {
    .wishlist-items {
        grid-template-columns: 1fr;
    }

    .wishlist-card {
        flex-direction: column;
    }
}
</style>
