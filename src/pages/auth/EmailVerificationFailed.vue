<template>
    <div class="container">
      <div class="card">
        <h2>Email Verification Failed</h2>
        <p v-if="error === 'user_not_found'">❌ User not found.</p>
        <p v-else-if="error === 'invalid_hash'">⚠️ Invalid verification link.</p>
        <p v-else>⚠️ Something went wrong. Please try again later.</p>
        <router-link to="/resend-verification" class="btn">Resend Verification Email</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { useRoute } from "vue-router";
  
  export default {
    setup() {
      const route = useRoute();
      const error = route.query.error || "unknown";
  
      return { error };
    },
  };
  </script>
  
  <style scoped>
  .container {
    text-align: center;
    margin-top: 50px;
  }
  .card {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background: white;
  }
  .btn {
    display: inline-block;
    margin-top: 10px;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  </style>
  