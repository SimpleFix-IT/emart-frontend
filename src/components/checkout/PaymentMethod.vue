<template>
<div class="payment-method-container">
  <h2>Select Payment Method</h2>
  <div class="payment-options">
    <label class="payment-option">
      <input type="radio" v-model="paymentData.method" value="credit_card" /> Credit Card
    </label>
    <label class="payment-option">
      <input type="radio" v-model="paymentData.method" value="paypal" /> PayPal
    </label>
    <label class="payment-option">
      <input type="radio" v-model="paymentData.method" value="cod" /> Cash on Delivery
    </label>
  </div>

  <div class="payment-buttons">
    <button @click="$emit('prev')" class="back-button">Back</button>
    <button @click="submitPayment" class="next-button">Next</button>
  </div>
</div>

</template>
<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["next", "prev"]);

const paymentData = ref({ method: "" });

const submitPayment = () => {
  if (paymentData.value.method) {
    emit("next", paymentData.value);
  } else {
    alert("Please select a payment method");
  }
};
</script>
<style scoped>
/* General Styles */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.payment-method-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-option {
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.payment-option input {
  accent-color: #007bff; /* Custom color for radio buttons */
}

.payment-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.payment-buttons button {
  padding: 12px 20px;
  font-size: 16px;
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

.next-button {
  background-color: #0b9e30;
  color: white;
}

.next-button:hover {
  background-color: #28a745;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .payment-method-container {
    padding: 15px;
  }

  h2 {
    font-size: 22px;
  }

  .payment-options {
    gap: 12px;
  }

  .payment-option {
    font-size: 14px;
  }

  .payment-buttons button {
    font-size: 14px;
    padding: 10px 18px;
  }
}

@media (max-width: 480px) {
  .payment-method-container {
    padding: 10px;
  }

  h2 {
    font-size: 20px;
  }

  .payment-option {
    font-size: 12px;
  }

  .payment-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .payment-buttons button {
    width: 100%;
  }
}

</style>
