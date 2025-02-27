<template>
  <div class="order-page">
    <!-- Page Header -->
    <header class="page-header">
      <h1><i class="bi bi-box-seam"></i> My Orders</h1>
      <p class="subtitle">Track and manage your recent orders.</p>
    </header>

    <!-- Loading & Error Messages -->
    <p v-if="loading" class="loading"><i class="bi bi-hourglass-split"></i> Loading your orders...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <!-- Orders List -->
    <section v-if="orders.length" class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <h3><i class="bi bi-bag-check"></i> Order #{{ order.id }}</h3>
            <p><i class="bi bi-calendar"></i> Placed on: {{ formatDate(order.created_at) }}</p>
          </div>
          <span :class="'status-badge ' + order.status.toLowerCase()">{{ order.status }}</span>
        </div>

        <div class="order-body">
          <div v-for="item in order.order_items" :key="item.id" class="order-item">
            <img :src="getImageUrl(item.product?.image) || defaultImage" alt="Product" class="product-image" />
            <div class="item-details">
              <h4>{{ item.product?.name }}</h4>
              <p><i class="bi bi-cart"></i> Quantity: {{ item.quantity }}</p>
              <p><i class="bi bi-currency-dollar"></i> Price: ${{ parseInt(item.price) }}</p>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <p><i class="bi bi-credit-card"></i> Total: <strong>${{ parseInt(order.total) }}</strong></p>
          <div class="actions">
            <button class="btn-view" @click="viewOrder(order.id)">
              <i class="bi bi-eye"></i> View
            </button>
            <button class="btn-reorder" @click="reorder(order.id)">
              <i class="bi bi-arrow-repeat"></i> Reorder
            </button>
          </div>
        </div>
      </div>
    </section>

    <p v-else-if="!loading" class="no-orders"><i class="bi bi-x-circle"></i> No orders found.</p>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/service/Index";
import showToast from "@/plugins/toast";
import {getImageUrl } from "@/utils/Helper";
const orders = ref([]);
const loading = ref(true);
const error = ref(null);
const defaultImage = ref("@/assets/empty-cart.jpg");

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

const viewOrder = (orderId) => {
  showToast("info", `View details for order #${orderId}`);
};

const reorder = (orderId) => {
  showToast("success", `Reorder items for order #${orderId}`);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.order-page {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.subtitle {
  color: gray;
}

.loading, .error-message, .no-orders {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 10px;
}

.order-list {
  display: grid;
  gap: 20px;
}

.order-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  text-transform: capitalize;
}

.status-badge.delivered {
  background: #28a745;
  color: white;
}

.status-badge.processing {
  background: #ffc107;
  color: black;
}

.status-badge.failed {
  background: #dc3545;
  color: white;
}

.order-body {
  margin-top: 10px;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  object-fit: cover;
  margin-right: 10px;
}

.item-details h4 {
  margin: 0;
  font-size: 1rem;
}

.item-details p {
  margin: 2px 0;
  color: gray;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-view, .btn-reorder {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-view {
  background: #007bff;
  color: white;
}

.btn-reorder {
  background: #28a745;
  color: white;
}

.btn-view:hover, .btn-reorder:hover {
  opacity: 0.8;
}
</style>
