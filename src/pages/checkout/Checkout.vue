<template>
<div class="checkout-container">
    <div class="container py-5">
        <div class="row">
            <!-- Left Section: Shipping Information -->
            <div class="col-md-7">
                <h2 class="mb-4">Checkout</h2>
                <!-- Shipping Address Form -->
                <Form :key="formKey" :initial-values="userProfileData" @submit="updateProfile" :validation-schema="validationSchema" v-slot="{ errors }">
                    <h4>Shipping Address</h4>
                    <div class="mb-3">
                        <BaseInput name="first_name" label="Full Name*" type="text" :error="errors.first_name" />
                    </div>
                    <div class="mb-3">
                        <BaseInput name="last_name" label="Last Name*" type="text" :error="errors.last_name" />
                    </div>
                    <div class="mb-3">
                        <BaseInput name="email" label="Email Address*" type="email" :error="errors.email" readonly />
                    </div>
                    <div class="mb-3">
                        <BaseInput name="phone" label="Phone Number*" type="number" :error="errors.phone" />
                    </div>
                    <div class="mb-3">
                        <BaseInput name="country" label="Country*" type="select" :error="errors.country" :options="countries" />
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <BaseInput name="city" label="City" type="text" :error="errors.city" />
                        </div>
                        <div class="col-md-6">
                            <BaseInput name="address" label="Address" type="text" :error="errors.address" />
                        </div>
                    </div>

                    <div class="form-check mt-3">
                        <input type="checkbox" id="sameAsShipping" v-model="sameAsShipping" class="form-check-input" />
                        <label for="sameAsShipping" class="form-check-label">Billing address same as shipping</label>
                    </div>

                    <div v-if="!sameAsShipping">
                        <h4>Billing Address</h4>
                        <div class="mb-3">
                            <BaseInput name="billing_first_name" label="Full Name*" type="text" :error="errors.billing_first_name" />
                        </div>
                        <div class="mb-3">
                            <BaseInput name="billing_last_name" label="Last Name*" type="text" :error="errors.billing_last_name" />
                        </div>
                        <div class="mb-3">
                            <BaseInput name="billing_email" label="Email Address*" type="email" :error="errors.billing_email" />
                        </div>
                        <div class="mb-3">
                            <BaseInput name="billing_phone" label="Phone Number*" type="number" :error="errors.billing_phone" />
                        </div>
                        <div class="mb-3">
                            <BaseInput name="billing_country" label="Country*" type="select" :error="errors.billing_country" :options="countries" />
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <BaseInput name="billing_city" label="City" type="text" :error="errors.billing_city" />
                            </div>
                            <div class="col-md-6">
                                <BaseInput name="billing_address" label="Address" type="text" :error="errors.billing_address" />
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
            <!-- Right Section: Cart Summary -->
            <!-- <div class="col-md-5 mt-5 cart-reviews">
                <h5 class="mb-3">Review your cart</h5>
                <div v-for="item in cartProducts" :key="item.id" class="cart-item d-flex align-items-center">
                    <img :src="getImageUrl(item.product.image)"  class="cart-img me-3" alt="Product Image">
                    <div>
                        <p class="mb-0">{{ item.product.name }}</p>
                        <p class="text-muted">₹{{ parseInt(item.price) }}</p>
                    </div>
                </div>

                <div class="checkout">
                    <h3>Total Amount: ${{ totalPrice }}</h3>
                    <button @click="payNow" class="btn btn-primary w-100 mt-3">Pay Now</button>
                    <p class="text-center mt-2 text-muted">
                        <i class="bi bi-lock"></i> Secure Checkout - SSL Encrypted
                    </p>
                </div>
            </div> -->
            <div class="col-md-5 mt-5 cart-reviews">
                <h5 class="mb-3">Review your cart</h5>

                <!-- Show Loading Indicator When Fetching Data -->
                <div v-if="loading" class="text-center">
                    <p>Loading cart items...</p>
                </div>

                <!-- Display Cart Products -->
                <div v-else-if="cartProducts.length">
                    <div v-for="item in cartProducts" :key="item.id" class="cart-item d-flex align-items-center">
                        <img :src="getImageUrl(item.product.image)" class="cart-img me-3" alt="Product Image">
                        <div>
                            <p class="mb-0">{{ item.product.name }}</p>
                            <p class="text-muted">₹{{ parseInt(item.price) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Show Message When Cart is Empty -->
                <div v-else class="text-center">
                    <p class="text-muted">Your cart is empty.</p>
                </div>

                <div class="checkout">
                    <h3>Total Amount: ₹{{ parseInt(totalPrice) }}</h3>

                    <!-- Disable Button While Loading or When Cart is Empty -->
                    <button @click="payNow" class="btn btn-primary w-100 mt-3" :disabled="loading || cartProducts.length === 0">
                        {{ loading ? 'Loading...' : 'Pay Now' }}
                    </button>

                    <p class="text-center mt-2 text-muted">
                        <i class="bi bi-lock"></i> Secure Checkout - SSL Encrypted
                    </p>
                </div>
            </div>

        </div>
    </div>
</div>
</template>

<script setup>
import {
    ref,
    onMounted,
    watch,
    computed
} from 'vue';
import {
    getCountries
} from '@/utils/Helper';
import BaseInput from "@/components/inputs/BaseInput.vue";
import {
    Form
} from "vee-validate";
import {
    userShippingSchema
} from "@/validations/userProfile";
import {
    getImageUrl
} from '@/utils/Helper';
import apiClient from '@/service/Index';
import showToast from '@/plugins/toast';
import {
    redirectToCheckout
} from "@/service/stripeService";
const countries = ref([]);
const sameAsShipping = ref(true);
const userProfileData = ref({});
const formKey = ref(0);
const cartProducts = ref([]);
const totalPrice = ref(0);
const shippingAddress = ref({});
const billingAddress = ref({});
const  loading = ref(true);
const validationSchema = computed(() => userShippingSchema(sameAsShipping.value));
const userData = async () => {
    try {
        const response = await apiClient.get("/user/profile");
        if (response ?.data ?.success && response ?.data ?.userData) {
            userProfileData.value = {
                ...response.data.userData,
                country: response.data.userData.country_id,
            };
            formKey.value++;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        console.error("Error fetching user profile:", error ?.response ?.data ?.message || error.message);
        showToast("error", error ?.response ?.data ?.message || "Failed to load profile data. Please try again.");
    }
};
const updateProfile = (values) => {
    console.log("🚀 Form Submitted!");
    shippingAddress.value = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        country: values.country,
        city: values.city,
        address: values.address,
    };
    if (sameAsShipping.value) {
        billingAddress.value = JSON.parse(JSON.stringify(shippingAddress.value));
        // billingAddress.value = { ...shippingAddress };
    } else {
        billingAddress.value = {
            first_name: values.billing_first_name,
            last_name: values.billing_last_name,
            email: values.billing_email,
            phone: values.billing_phone,
            country: values.billing_country,
            city: values.billing_city,
            address: values.billing_address,
        };
    }
    console.log("📦 Shipping Address:", shippingAddress.value);
    console.log("💳 Billing Address:", billingAddress.value);
}
const payNow = async () => {
    updateProfile(userProfileData.value);
    shippingAddress.value.country = String(shippingAddress.value.country || "");
    billingAddress.value.country = String(billingAddress.value.country || "");
    try {
        const response = await apiClient.post("/create-checkout-session", {
            cart: cartProducts.value,
            total: totalPrice.value,
            shipping_address: shippingAddress.value,
            billing_address: billingAddress.value,

        });
        if (response.data.success) {
            const {
                session_id
            } = response.data;
            await redirectToCheckout(session_id);
        }
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
    }
};
watch(sameAsShipping, (newValue) => {
    if (newValue) {
        userProfileData.value = {
            ...userProfileData.value
        }; // Copying shipping to billing
        formKey.value++; // Refresh form
    }
});
onMounted(async () => {
    loading.value = true;
    try {
        const fetchedCountries = await getCountries();
        countries.value = fetchedCountries ?.data ?.countries.map(country => ({
            value: country.id,
            text: country.name
        })) || [];
    } catch (error) {
        console.error("Failed to fetch countries:", error);
    }
    await userData();
    const storedCart = localStorage.getItem("cart");
    const storedTotal = localStorage.getItem("totalPrice");

    if (storedCart) {
        cartProducts.value = JSON.parse(storedCart);
    }
    if (storedTotal) {
        totalPrice.value = storedTotal;
    }
    loading.value = false;
});
</script>

<style scoped>
.checkout-container {
    background: #f8f9fa;
    padding: 20px;
}

.cart-item {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
}

.cart-img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
}

.btn-primary {
    background: #14db50;
    border: none;
}

.btn-primary:hover {
    background: #e9612c;
}

.col-md-5.mt-5.cart-reviews {
    margin-top: 99px !important;
}
</style>
