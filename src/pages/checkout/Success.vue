<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from '@/service/Index';
import {useStore} from 'vuex';
import showToast from "@/plugins/toast";
const route = useRoute();
const orderStatus = ref("loading");
const store = useStore();

onMounted(async () => {
    const sessionId = route.query.session_id; // ✅ session_id ko Stripe webhook me Payment Intent ID ke saath match karein
    console.log("📩 Received session_id:", sessionId);

    if (!sessionId) {
        orderStatus.value = "failed";
        return;
    }
    try {
        const response = await apiClient.get(`/order-status?session_id=${sessionId}`);

        if (response.data.success) {
            orderStatus.value = response.data.status;

            if (orderStatus.value === "completed") {
                localStorage.removeItem("cart");
                localStorage.removeItem("totalPrice");
                store.dispatch("userCart/removeCartItem");

                showToast("success", "🎉 Payment Successful! Your order is confirmed.");
            }
        } else {
            orderStatus.value = "failed";
            showToast("error", "❌ Payment Failed! Order not found.");
        }
    } catch (error) {
        orderStatus.value = "failed";
        showToast("error", "❌ Payment Failed! Please try again.");
    }
});
</script>

<template>
    <div class="checkout-container">
      <!-- ✅ Payment Success Section -->
      <div v-if="orderStatus === 'completed'" class="checkout-box success">
        <div class="icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Your order has been placed successfully.</p>
        <router-link to="/user/orders" class="btn">Check your orders</router-link>
        <router-link to="/" class="btn">Continue Shopping</router-link>
      </div>
  
      <!-- ❌ Payment Failed Section -->
      <div v-else-if="orderStatus === 'failed'" class="checkout-box failed">
        <div class="icon">❌</div>
        <h1>Payment Failed!</h1>
        <p>Something went wrong. Please try again.</p>
        <router-link to="/cart" class="btn">Try Again</router-link>
      </div>
  
      <!-- ⏳ Loading Section -->
      <div v-else class="checkout-box loading">
        <div class="loader"></div>
        <h1>Processing Payment...</h1>
        <p>Please wait while we verify your transaction.</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* ✅ Common Container */
  .checkout-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    background: #f8f9fa;
    padding: 20px;
  }
  
  /* ✅ Common Box Styling */
  .checkout-box {
    text-align: center;
    padding: 30px;
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
  }
  
  /* 🎉 Success Box */
  .success {
    background: #d4edda;
    border: 2px solid #28a745;
    color: #155724;
  }
  
  /* ❌ Failed Box */
  .failed {
    background: #f8d7da;
    border: 2px solid #dc3545;
    color: #721c24;
  }
  
  /* ⏳ Loading Box */
  .loading {
    background: #fff3cd;
    border: 2px solid #ffc107;
    color: #856404;
  }
  
  /* ✅ Emoji Icons */
  .icon {
    font-size: 50px;
    margin-bottom: 15px;
  }
  
  /* ✅ Buttons */
  .btn {
    display: inline-block;
    padding: 10px 20px;
    margin-top: 15px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 8px;
    text-decoration: none;
    transition: 0.3s;
  }
  
  .success .btn {
    background: #28a745;
    color: white;
  }
  
  .failed .btn {
    background: #dc3545;
    color: white;
  }
  
  .btn:hover {
    opacity: 0.8;
  }
  
  /* 🔄 Loading Animation */
  .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #ffc107;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  
