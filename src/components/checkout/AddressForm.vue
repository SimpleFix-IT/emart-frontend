<template>
  <div class="address-form-container">
    <h2>Shipping Address</h2>
    <form @submit.prevent="submitForm" class="address-form">
      <div class="input-group">
        <input v-model="formData.first_name" placeholder="First Name" />
        <input v-model="formData.last_name" placeholder="Last Name" />
      </div>
      <div class="input-group">
        <input v-model="formData.phone" placeholder="Phone" />
        <input v-model="formData.email" placeholder="Email" />
      </div>
      <div class="input-group">
        <input v-model="formData.street_address" placeholder="Street Address" />
        <input v-model="formData.city" placeholder="City" />
      </div>
      <div class="input-group">
        <input v-model="formData.state" placeholder="State" />
        <input v-model="formData.zip_code" placeholder="Zip Code" />
      </div>

      <!-- Country dropdown -->
      <div class="input-group">
        <select v-model="formData.billing_address.country" placeholder="Country">
          <option value="" disabled>Select Country</option>
          <option v-for="country in countries" :key="country.code" :value="country.name">
            {{ country.name }}
          </option>
        </select>
      </div>

      <label class="checkbox-label">
        <input type="checkbox" v-model="formData.billing_same_as_shipping" />
        Billing address same as shipping
      </label>

      <!-- Billing Form (Only shows if checkbox is unchecked) -->
      <div v-if="!formData.billing_same_as_shipping" class="billing-address">
        <h3>Billing Address</h3>
        <div class="input-group">
          <input v-model="formData.billing_address.first_name" placeholder="First Name" />
          <input v-model="formData.billing_address.last_name" placeholder="Last Name" />
        </div>
        <div class="input-group">
          <input v-model="formData.billing_address.phone" placeholder="Phone" />
          <input v-model="formData.billing_address.email" placeholder="Email" />
        </div>
        <div class="input-group">
          <input v-model="formData.billing_address.street_address" placeholder="Street Address" />
          <input v-model="formData.billing_address.city" placeholder="City" />
        </div>
        <div class="input-group">
          <input v-model="formData.billing_address.state" placeholder="State" />
          <input v-model="formData.billing_address.zip_code" placeholder="Zip Code" />
        </div>
        <div class="input-group">
        <div class="input-group">
          <select v-model="formData.billing_address.country" placeholder="Country">
            <option value="" disabled>Select Country</option>
            <option v-for="country in countries" :key="country.code" :value="country.name">
              {{ country.name }}
            </option>
          </select>
        </div>
        </div>
      </div>

      <button type="submit" class="submit-button">Next</button>
    </form>
  </div>
</template>

<script setup>
  import { ref, defineEmits, onMounted } from "vue";
  import { getCountries } from '@/utils/Helper';

  const emit = defineEmits(["next"]);
  const countries = ref([]);

  const formData = ref({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    street_address: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    billing_same_as_shipping: true,
    billing_address: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      street_address: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
    },
  });

  const submitForm = () => {
    if (formData.value.billing_same_as_shipping) {
      formData.value.billing_address = { ...formData.value };
    }
    emit("next", formData.value);
  };

  // Fetch countries on component mount
  
  onMounted(async () => {
    try {
      const fetchedCountries = await getCountries(); // Call the function to fetch countries
      countries.value = fetchedCountries.data.countries;
    } catch (error) {
      console.error('Failed to fetch countries', error);
    }
  });
</script>

<style scoped>
/* General Styles */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.address-form-container {
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

h3 {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.input-group input,
.input-group select {
  flex: 1;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.checkbox-label {
  font-size: 14px;
  display: block;
  margin-top: 10px;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.submit-button:hover {
  background-color: #218838;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .input-group input,
  .input-group select {
    flex: 1 1 100%;
  }

  h2 {
    font-size: 22px;
  }

  h3 {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .address-form-container {
    padding: 15px;
  }

  h2 {
    font-size: 20px;
  }

  .input-group input,
  .input-group select {
    font-size: 12px;
  }

  .submit-button {
    font-size: 14px;
  }
}
</style>
