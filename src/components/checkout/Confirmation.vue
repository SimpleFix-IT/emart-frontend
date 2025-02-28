<template>
<div class="confirmation-container">
  <h2>Order Confirmation</h2>

  <div class="address-section">
    <h3>Shipping Address</h3>
    <p>{{ address.first_name }} {{ address.last_name }}</p>
    <p>{{ address.street_address }}, {{ address.city }}, {{ address.state }}</p>
    <p>{{ address.country }}, {{ address.zip_code }}</p>
    <p>Phone: {{ address.phone }}</p>
  </div>

  <div class="address-section">
    <h3>Billing Address</h3>
    <p>{{ address.billing_address.first_name }} {{ address.billing_address.last_name }}</p>
    <p>{{ address.billing_address.street_address }}, {{ address.billing_address.city }}, {{ address.billing_address.state }}</p>
    <p>{{ address.billing_address.country }}, {{ address.billing_address.zip_code }}</p>
    <p>Phone: {{ address.billing_address.phone }}</p>
  </div>

  <div class="payment-method-section">
    <h3>Payment Method</h3>
    <p>{{ payment.method }}</p>
  </div>

  <div class="confirmation-buttons">
    <button @click="$emit('prev')" class="back-button">Back</button>
    <button @click="$emit('confirm')" class="confirm-button">Confirm Order</button>
  </div>

  <!-- Show Payment Form After Confirmation -->
  <div v-if="payment.method" class="payment-information">
    <h3>Payment Information</h3>
    <!-- Show Payment Card Form -->
    <!-- <PaymentForm /> -->
  </div>
</div>

</template>
<script setup>
import { defineProps, defineEmits } from "vue";

defineProps(["address", "payment"]);
defineEmits(["prev", "confirm"]);
</script>
<style scoped>
/* General Styles */
.confirmation-container {
  width: 100%; /* Allow full width */
  padding: 30px; /* More padding for a spacious feel */
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 26px; /* Slightly larger font size for headings */
  margin-bottom: 25px;
}

h3 {
  font-size: 22px; /* Increased font size for section headings */
  margin-bottom: 15px;
  color: #333;
}

.address-section, .payment-method-section, .payment-information {
  margin-bottom: 25px; /* Increased space between sections */
}

p {
  font-size: 16px;
  margin: 8px 0;
  line-height: 1.6;
}

.confirmation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.confirmation-buttons button {
  padding: 14px 24px; /* Increased padding for buttons */
  font-size: 18px; /* Larger text size for buttons */
  border-radius: 4px;
  cursor: pointer;
  border: none;
  width: 48%;
}

.back-button {
  background-color: #f0f0f0;
  color: #007bff;
  border: 1px solid #007bff;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.confirm-button {
  background-color: #007bff;
  color: white;
}

.confirm-button:hover {
  background-color: #0056b3;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .confirmation-container {
    padding: 20px;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
  }

  p {
    font-size: 14px;
  }

  .confirmation-buttons button {
    font-size: 16px;
    padding: 12px 22px;
  }
}

@media (max-width: 480px) {
  .confirmation-container {
    padding: 15px;
  }

  h2 {
    font-size: 22px;
  }

  h3 {
    font-size: 18px;
  }

  p {
    font-size: 14px;
  }

  .confirmation-buttons {
    flex-direction: column;
    gap: 20px;
  }

  .confirmation-buttons button {
    width: 100%;
  }
}


</style>