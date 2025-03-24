<template>
    <div class="container">
      <div class="card">
        <h2>Email Verification</h2>
        <p >✅ Your email has been successfully verified!</p>
        <!-- <p v-else-if="message === 'already_verified'">⚠️ Your email is already verified.</p> -->
        <router-link to="/" class="btn">Go to Home Page</router-link>
      </div>
    </div>
  </template>
<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const store = useStore();

onMounted(() => {
    const { token, userId, role } = route.query;

    if (token && userId && role) {
        // localStorage.setItem("token", token);
        // localStorage.setItem("userId", userId);
        // localStorage.setItem("role", role);

        store.dispatch("auth/login", {
            token,
            userId,
            role,
        });

        // router.push(role === "admin" ? "/admin-dashboard" : "/");
    } else {
        router.push("/login");
    }
});
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
    background: #28a745;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  </style>
  