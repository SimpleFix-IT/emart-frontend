<template>
  <div>
    <h2>Create a New Deal</h2>
    
    <form @submit.prevent="createDeal">
      <div class="form-group">
        <label for="name">Deal Name:</label>
        <input type="text" id="name" v-model="deal.name" required />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="deal.description"></textarea>
      </div>

      <div class="form-group">
        <label for="deal_type">Deal Type:</label>
        <select id="deal_type" v-model="deal.deal_type" >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>

      <div class="form-group">
        <label for="deal_value">Deal Value:</label>
        <input type="number" id="deal_value" v-model="deal.deal_value"  />
      </div>

      <div class="form-group">
        <label for="start_date">Start Date:</label>
        <input type="datetime-local" id="start_date" v-model="deal.start_date"  />
      </div>

      <div class="form-group">
        <label for="end_date">End Date:</label>
        <input type="datetime-local" id="end_date" v-model="deal.end_date"  />
      </div>

      <div class="form-group">
        <label for="products">Select Products:</label>
        <select id="products" v-model="deal.products" multiple >
          <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
        </select>
      </div>

      <button type="submit">Create Deal</button>
    </form>

    <!-- Debugging: Display selected products -->
    <div>
      <h3>Selected Products:</h3>
      <pre>{{ deal.products }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';  // Import `toRaw` from Vue
import apiClient from '@/service/Index';

export default {
  setup() {
    const deal = ref({
      name: '',
      description: '',
      deal_type: 'percentage',
      deal_value: 0,
      start_date: '',
      end_date: '',
      products: [],  // Array to store selected product IDs
    });

    const products = ref([]);  // Array to store fetched products

    // Fetch products from backend API
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        products.value = response.data.products;
        console.log('Fetched Products:', products.value);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };


    // Handle form submission
    const createDeal = async () => {
      // Log selected products before submitting
      console.log('Submitting deal with selected products:', deal.value.products);
      // Proceed with deal creation logic (e.g., API call)
    };

    onMounted(() => {
      fetchProducts();  // Fetch products when the component is mounted
    });

    return {
      deal,
      products,
      createDeal,
    };
  },
};
</script>

<style scoped>
/* Add basic styling for the form */
form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

h3 {
  margin-top: 20px;
}

pre {
  background-color: #f4f4f4;
  padding: 10px;
}
</style>
