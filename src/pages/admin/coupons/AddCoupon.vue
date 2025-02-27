<template>
<AdminLayout>
    <div class="col-md-6 mx-auto">
        <!-- Create a Coupon Card -->
        <div class="card shadow-sm">
            <div class="card-header text-white text-center">
                <h4>Create a Coupon</h4>
            </div>
            <div class="card-body">
                <form @submit.prevent="submitCouponForm">
                    <!-- Coupon Code -->
                    <div class="mb-3">
                        <label for="code" class="form-label">Code</label>
                        <input type="text" class="form-control" id="code" v-model="formData.code" placeholder="Enter coupon code" />
                    </div>
                    <!-- Discount Type -->
                    <div class="mb-3">
                        <label for="discount_type" class="form-label">Discount Type</label>
                        <select class="form-select" id="discount_type" v-model="formData.discount_type">
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>
                    <!-- Discount Value -->
                    <div class="mb-3">
                        <label for="discount_value" class="form-label">Discount Value</label>
                        <input type="number" class="form-control" id="discount_value" min="1" v-model="formData.discount_value" placeholder="Enter discount value" />
                    </div>
                    <!-- Usage Limit -->
                    <div class="mb-3">
                        <label for="usage_limit" class="form-label">Usage Limit</label>
                        <input type="number" class="form-control" id="usage_limit" min="1" v-model="formData.usage_limit" placeholder="Enter usage limit" />
                    </div>
                    <!-- User Usage Limit -->
                    <div class="mb-3">
                        <label for="user_usage_limit" class="form-label">User Usage Limit</label>
                        <input type="number" class="form-control" id="user_usage_limit" min="1" v-model="formData.user_usage_limit" placeholder="Enter user usage limit" />
                    </div>
                    <!-- Start Date -->
                    <div class="mb-3">
                        <label for="start_date" class="form-label">Start Date</label>
                        <input type="datetime-local" class="form-control" id="start_date" v-model="formData.start_date" />
                    </div>
                    <!-- End Date -->
                    <div class="mb-3">
                        <label for="end_date" class="form-label">End Date</label>
                        <input type="datetime-local" class="form-control" id="end_date" v-model="formData.end_date" />
                    </div>
                    <!-- Is Active -->
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="is_active" v-model="formData.is_active" />
                        <label class="form-check-label" for="is_active">Is Active</label>
                    </div>
                    <!-- Select Product -->
                    <div class="mb-3" v-if="products.length > 0">
                        <label for="product_id" class="form-label">Select Product</label>
                        <select class="form-select" id="product_id" v-model="formData.product_id">
                            <option value="">Select product</option>
                            <option v-for="product in products" :key="product.id" :value="product.id">
                                {{ product.name }}
                            </option>
                        </select>
                    </div>
                    <!-- Submit Button -->
                    <div class="text-center mt-3">
                        <button type="submit" class="btn btn-success px-4 py-2">Create Coupon</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</AdminLayout>
</template>

<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";
import {ref,onMounted} from "vue";
import apiClient from "@/service/Index";
import {
    convertToUTC
} from '@/utils/Helper';

const formData = ref({
    code: "",
    discount_type: "percentage",
    discount_value: 0,
    usage_limit: "",
    user_usage_limit: "",
    start_date: "",
    end_date: "",
    is_active: true,
    product_id: "",
});
const products = ref([]);
const fetchProducts = async () => {
    try {
        const response = await apiClient.get("/products");
        if (response.data ?.success) {
            products.value = response.data.products;
        }
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
};
const submitCouponForm = async () => {
    try {
        if (!formData.value.code || !formData.value.discount_value || !formData.value.start_date || !formData.value.end_date || !formData.value.usage_limit || !formData.value.user_usage_limit || !formData.value.product_id) {
            alert("All fields are required");
            return;
        }
        formData.value.start_date = convertToUTC(formData.value.start_date);
        formData.value.end_date = convertToUTC(formData.value.end_date);
        const response = await apiClient.post("/create-coupon", formData.value, );
        if (response.data.success) {
            // Reset form fields
            formData.value = {
                code: "",
                usage_limit: "",
                user_usage_limit: "",
                discount_type: "percentage",
                discount_value: 0,
                start_date: "",
                end_date: "",
                is_active: true,
                product_id: "",
            };
            alert("Coupon created successfully!");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
};
onMounted(fetchProducts);
</script>
<style scoped>
.card {
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  background-color: #007bff;
}

.card-body {
  background-color: #f8f9fa;
  padding: 25px;
}

.form-control, .form-select {
  height: 38px;
}

.btn-success {
  width: 100%;
  padding: 12px 20px;
}

@media (max-width: 576px) {
  .card {
    width: 100%;
  }

  .form-control, .form-select {
    font-size: 14px;
  }

  .btn-success {
    padding: 10px 15px;
  }
}
</style>