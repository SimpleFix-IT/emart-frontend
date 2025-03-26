<template>
<div class="cart-page">
    <div class="container py-5">
        <h1 class="cart-text mb-5"><strong>Your Shopping Cart</strong></h1>
        <div class="loader">
            <div v-if="loading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
        <div class="row" v-if="cartProducts.length > 0">
            <!-- Cart Items -->
            <div class="col-md-8">
                <div class="cart-items">
                    <div class="cart-item" v-for="item in cartProducts" :key="item.id">
                        <div class="row align-items-center">
                            <div class="col-3">
                                <img :src="getImageUrl(item.product.image)" class="card-img-top product-image" alt="Product Image">
                            </div>
                            <div class="col-6">
                                <h5 class="cart-item-title">{{ item.product.name }}</h5>
                                <p class="cart-item-description">{{ item.product.description }}</p>
                                <p class="cart-item-price">₹{{ parseInt(item.price) }}</p>
                            </div>
                            <div class="col-3">
                                <div class="quantity-selector">
                                    <button class="quantity-btn" @click="updateQuantity(item.id, 'decrease')">-</button>
                                    <input type="number" class="quantity-input" v-model="item.quantity" min="1" readonly />
                                    <button class="quantity-btn" @click="updateQuantity(item.id, 'increase')">+</button>
                                </div>
                                <button class="btn btn-danger mt-3" @click="removeItem(item.id)">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Cart Summary -->
            <div class="col-md-4">
                <div>
                    <CouponSection @couponApplied="handleCouponApplied" />
                </div>
                <div class="cart-summary">
                    <h4 class="cart-summary-title">Cart Summary</h4>
                    <div class="cart-summary-item">
                        <p>Total Items: <span>{{ userData.countUserItem }}</span></p>
                        <p>Total Price: <span class="cart-item-price">₹{{ parseInt(totalPrice) }}</span></p>
                    </div>
                    <button class="btn btn-primary w-100" :disabled="!totalPrice" @click="proceedToCheckout">Proceed to Checkout</button>
                </div>
            </div>
        </div>
        <div class="empty-cart" v-else-if="!loading">
            <div class="empty-cart-container">
                <div class="empty-cart-icon">
                    <img src="@/assets/empty-cart.jpg" alt="Empty Cart" class="img-fluid" />
                </div>
                <div class="empty-cart-message">
                    <h3>Your Cart is Empty</h3>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <p>Don't worry, you can start shopping now!</p>
                </div>
                <div class="empty-cart-action">
                    <button class="btn btn-primary" @click="redirectToShop">Go to Shop</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script setup>
    import {useStore} from 'vuex';
    import {ref,onMounted,computed} from 'vue';
    import apiClient from '@/service/Index';
    import {getImageUrl} from '@/utils/Helper';
    import router from '@/router/Index';
    import CouponSection from '@/components/coupon/CouponSection.vue';
    const store = useStore();
    const userData =computed(() => ({
        userId: store.getters['auth/getUserId'],
        token: store.getters['auth/getToken'],
        countUserItem:  store.getters['userCart/getUserCartItem']
    })); 
    const cartProducts = ref([]);
    const loading = ref(false);
    const totalPrice = ref('');
    const fetchUserProducts = async () => {
        if (userData.value.token) {
            loading.value = true;
            try {
                const response = await apiClient.get(`/user-cart-products/${userData.value.userId}`);
                if (response.data ?.success && response.data.cartProducts) {
                    cartProducts.value = response.data.cartProducts;
                    totalPrice.value = response.data.totalPrice;
                    // ✅ Cart Data ko LocalStorage me Save Karna
                    localStorage.setItem("cart", JSON.stringify(cartProducts.value));
                    localStorage.setItem("totalPrice", totalPrice.value);
                }
            } catch (error) {
                console.error('Error fetching user products:', error);
            } finally {
                loading.value = false;
            }
        } else {
            console.warn('No user found, cannot fetch cart data.');
            loading.value = false;
        }
    };
    const updateQuantity = async (id, type) => {
        try {
            const response = await apiClient.post('/increase-decrease-quantity', {
                cartItemId: id,
                type: type,
            });
            if (response ?.data.success) {
                await fetchUserProducts();
                console.log(response.data);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            if (type === 'decrease') alert('Quantity cannot be less than 1');
        }
    };
    const removeItem = async (id) => {
        try {
            const response = await apiClient.post('/remove-cart-item', {
                id
            });
            if (response ?.data) {
                store.dispatch('userCart/userCartItem', response.data.count);
                await fetchUserProducts();
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };
    const proceedToCheckout = () => {
        router.push('/checkout');
    };
    const handleCouponApplied = () => {
        fetchUserProducts();
    };
    const redirectToShop = () => {
          router.push('/shop');
    }
    onMounted (() => {
       fetchUserProducts();
    });
</script>
<style>
/* Cart Page Styles */
.cart-page {
    background-color: #f9f9f9;
    padding-top: 30px;
    margin-top: 74px;
    
}
.cart-item {
    background-color: #fff;
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
}

.cart-item .cart-item-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
}

.cart-item .cart-item-description {
    font-size: 0.9rem;
    color: #777;
}

.cart-item-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #28a745
}

.cart-item .quantity-selector {
    display: flex;
    align-items: center;
}

.quantity-btn {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 5px 10px;
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 4px;
}

.quantity-btn:hover {
    background-color: #0056b3;
}

.quantity-input {
    width: 40px;
    height: 30px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 0 10px;
}

.cart-summary {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.cart-summary-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
}

.cart-summary-item {
    margin-bottom: 20px;
}

.cart-summary-item p {
    font-size: 1rem;
    color: #333;
}

.cart-summary-item span {
    font-weight: 600;
}

.btn-primary {
    background-color: #28a745;
    border-color: #28a745;
    font-size: 1.1rem;
    padding: 12px;
    border-radius: 5px;
}

.btn-primary:hover {
    background-color: #218838;
    border-color: #1e7e34;
}
.btn.btn-primary {
  color: #FFFFFF;
}
.btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
    font-size: 0.9rem;
    padding: 6px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}
.empty-cart-icon {
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn-danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
}

@media (max-width: 768px) {
    .cart-item .row {
        flex-direction: column;
        align-items: flex-start;
    }

    .cart-summary {
        margin-top: 30px;
    }
}
img.card-img-top.product-image {
    max-height: 174px;
}

.empty-cart {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32vh;
    text-align: center;
    background-color: #f9f9f9;
    padding: 20px;
}

.empty-cart-container {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
}

.empty-cart-icon img {
    width: 120px;
    height: 120px;
    object-fit: contain;
    margin-bottom: 20px;
}

.empty-cart-message h3 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
}

.empty-cart-message p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 10px;
}

.empty-cart-action {
    margin-top: 20px;
}

.empty-cart-action .btn {
    font-size: 1rem;
    padding: 10px 20px;
    border-radius: 5px;
    text-transform: uppercase;
    transition: background-color 0.3s ease;
}

.empty-cart-action .btn:hover {
    background-color: #007bff;
    border-color: #007bff;
}

.spinner-border.text-primary {
    position: fixed;
    z-index: 1;
    top: 360px;
    right: 970px;
}
.py-5 {
    padding-top: 3rem !important;
    padding-bottom: 17rem !important;
}
.cart-text {
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem; /* Adjust for responsiveness */
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    color: #333; /* Dark grey for a premium look */
    background: linear-gradient(to right, #ff7e5f, #feb47b); /* Modern gradient */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; /* Gradient text effect */
    letter-spacing: 2px;
    padding-bottom: 10px; /* Space between text and border */
    /* Centering the text */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%; /* Full width to align center */
}

</style>
