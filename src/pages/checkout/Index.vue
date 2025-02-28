<template>
  <div class="checkout-container">
    <!-- Step 1: Address Form -->
    <div v-if="step === 1">
      <AddressForm @next="handleAddressSubmit" />
    </div>

    <!-- Step 2: Payment Method Selection -->
    <div v-if="step === 2">
      <Payment @next="handlePaymentSubmit" @prev="prevStep" />
    </div>

    <!-- Step 3: Order Confirmation -->
    <div v-if="step === 3">
      <Confirmation :address="address" :payment="payment" @prev="prevStep" @confirm="handleOrderConfirmation" />
    </div>

    <!-- Step 4: Payment Form (Card Details) -->
    <div v-if="step === 4">
      <PaymentCard @submit="handlePaymentCompletion" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AddressForm from "@/components/checkout/AddressForm.vue";
import Payment from "@/components/checkout/PaymentMethod.vue";
import Confirmation from "@/components/checkout/Confirmation.vue";
import PaymentCard from "@/components/checkout/PaymentCard.vue";

const step = ref(1);
const address = ref(null);
const payment = ref(null);

const nextStep = () => step.value++;

const prevStep = () => step.value--;

const handleAddressSubmit = (formData) => {
  address.value = formData;
  nextStep();
};

const handlePaymentSubmit = (paymentData) => {
  payment.value = paymentData;
  nextStep();
};

const handleOrderConfirmation = () => {
  nextStep();
};

const handlePaymentCompletion = async () => {
  try {
    // Create order data
    const orderData = {
      address: address.value,
      payment_method: payment.value.method,
      order_items: [
        {
          product_id: 1, // ID of the product
          quantity: 2, // Quantity of the product being purchased
          price: 29.99, // Price of one unit of the product
        },
        {
          product_id: 2,
          quantity: 1,
          price: 49.99,
        },
      ],
    };
    console.log(orderData);

    // Make an API call to Laravel to save order data
    // const response = await axios.post("/api/orders", orderData);

    // if (response.data.success) {
    //   alert("Order has been placed successfully!");
    // }
  } catch (error) {
    console.error("Error placing order:", error);
    alert("There was an issue placing your order. Please try again.");
  }
};
</script>

<style scoped>
/* General Styles */
.checkout-container {
  width: 100%;
  max-width: 800px; 
  margin: 20px auto 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkout-container > div {
  margin-bottom: 30px;
}

@media (max-width: 1024px) {
  .checkout-container {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .checkout-container {
    padding: 10px;
    max-width: 100%;
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
    padding: 12px 20px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .checkout-container {
    padding: 10px;
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
    padding: 12px;
  }
}
</style>
