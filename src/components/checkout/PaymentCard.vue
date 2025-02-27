<template>
  <div class="payment-form-container">
    <h2>Payment Information</h2>
    <form @submit.prevent="submitPayment" class="payment-form">
      <div class="input-group">
        <label for="card_number">Card Number:</label>
        <input type="text" id="card_number" v-model="paymentDetails.card_number" placeholder="1234 5678 9876 5432" required />
      </div>

      <div class="input-group">
        <label for="expiry_date">Expiry Date:</label>
        <input type="text" id="expiry_date" v-model="paymentDetails.expiry_date" placeholder="MM/YY" required />
      </div>

      <div class="input-group">
        <label for="cvv">CVV:</label>
        <input type="text" id="cvv" v-model="paymentDetails.cvv" placeholder="123" required />
      </div>

      <button type="submit" class="submit-button">Submit Payment</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const paymentDetails = ref({
  card_number: "",
  expiry_date: "",
  cvv: "",
});

const submitPayment = () => {
  if (paymentDetails.value.card_number && paymentDetails.value.expiry_date && paymentDetails.value.cvv) {
    alert("Payment Processed!");
    // Add your payment processing logic here (e.g., API to process payment)
  } else {
    alert("Please fill in all card details.");
  }
};
</script>

<style scoped>
/* General styles for the payment form */
.payment-form-container {
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  padding: 30px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #28a745;
  outline: none;
}

.submit-button {
  padding: 14px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #218838;
}

/* Responsive design */
@media (max-width: 768px) {
  .payment-form-container {
    padding: 20px;
  }

  h2 {
    font-size: 20px;
  }

  .input-group input {
    font-size: 14px;
    padding: 10px;
  }

  .submit-button {
    font-size: 16px;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .payment-form-container {
    padding: 15px;
  }

  .input-group input {
    font-size: 14px;
    padding: 10px;
  }

  .submit-button {
    font-size: 14px;
    padding: 12px;
  }
}
</style>
