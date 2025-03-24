<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/service/Index";

const orders = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        const response = await apiClient.get("/user-orders");
        if (response.data.success) {
            orders.value = response.data.orders;
        } else {
            error.value = "Failed to load orders.";
        }
    } catch (err) {
        console.error("❌ Error fetching orders:", err);
        error.value = "An error occurred while fetching orders.";
    } finally {
        loading.value = false;
    }
});
</script>

<template>
  <div>
    <h1>📦 My Orders</h1>
    <p v-if="loading">⏳ Loading your orders...</p>
    <p v-if="error">{{ error }}</p>

    <ul v-if="orders.length">
      <li v-for="order in orders" :key="order.id">
        <h3>🛒 Order #{{ order.id }} - {{ order.status }}</h3>
        <ul>
          <li v-for="item in order.order_items" :key="item.id">
            {{ item.product.name }} - {{ item.quantity }} x ${{ item.price }}
          </li>
        </ul>
      </li>
    </ul>

    <p v-else-if="!loading">No orders found.</p>
  </div>
</template>
