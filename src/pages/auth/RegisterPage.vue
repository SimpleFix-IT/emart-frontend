<template>
<div class="auth-page">
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <div class="col-lg-8">
                <div class="card auth-card shadow-lg">
                    <div class="row g-0">
                        <!-- Left Section (Text) -->
                        <div class="col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center auth-info">
                            <h2>Welcome to Our Shop!</h2>
                            <p>Create an account to enjoy exclusive offers and a seamless shopping experience.</p>
                            <button class="btn btn-outline-primary" @click="redirectToSignIn">Sign In</button>
                        </div>

                        <!-- Right Section (Form) -->
                        <div class="col-md-7">
                            <div class="card-body p-4">
                                <div class="text-center mb-3">
                                    <h2 class="auth-title">Create an Account</h2>
                                </div>
                                <!-- Loader -->
                                <div v-if="isLoading" class="loader-overlay">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                <Form @submit="handleSubmit" :validation-schema="registerSchema" v-slot="{ errors }">
                                    <div class="row g-3">
                                        <div class="col-12 col-md-6">
                                            <BaseInput name="firstName" label="First Name" type="text" :error="errors.firstName" />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <BaseInput name="lastName" label="Last Name" type="text" :error="errors.lastName" />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <BaseInput name="email" label="Email" type="email" :error="errors.email" />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <BaseInput name="phone" label="Phone Number" type="number" :error="errors.phone" />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <BaseInput name="password" label="Password" type="password" :error="errors.password" />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <BaseInput name="confirmPassword" label="Confirm Password" type="password" :error="errors.confirmPassword" />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <BaseInput name="address" label="Address" type="text" :error="errors.address" />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <BaseInput name="city" label="City" type="text" :error="errors.city" />
                                        </div>
                                        <div class="col-12 col-md-12">
                                          <BaseInput name="country" label="Country" type="select" :error="errors.country" :options="countries"
                                          />
                                        </div>
                                    </div>
                                    <div class="text-center mt-4">
                                        <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                                            <span v-if="isLoading">Registering...</span>
                                            <span v-else>Register</span>
                                        </button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile View: Show Info Above Form -->
                    <div class="row d-md-none auth-info">
                        <h2>Welcome to Our Shop!</h2>
                        <p>Create an account to enjoy exclusive offers and a seamless shopping experience.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

  
<script setup>
import {ref,onMounted} from "vue";
import {useRouter} from "vue-router";
import {Form} from "vee-validate";
import apiClient from "@/service/Index";
import store from "@/store/Index";
import BaseInput from "@/components/inputs/BaseInput.vue";
import {registerSchema} from "@/validations/authValidation";
import showToast from "@/plugins/toast";
import { getCountries } from '@/utils/Helper';
const countries = ref([]);
const router = useRouter();
const isLoading = ref(false);

const handleSubmit = async (values) => {
    isLoading.value = true;
    try {
        const response = await apiClient.post("/sign-up", values);
        if (response.data ?.userId) {
            store.dispatch("auth/login", {
                userId: response.data.userId
            });
            showToast("success", "Registration successful. Please verify your email");
            router.push("/verify-email");
        } else {
            console.log("Something went wrong");
        }
    } catch (error) {
        console.log("Something went wrong", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
  try {
    const fetchedCountries = await getCountries();
    countries.value = fetchedCountries?.data?.countries.map(country => ({
      value: country.id,
      text: country.name
    })) || [];
  } catch (error) {
    console.error("Failed to fetch countries:", error);
  }
});
const redirectToSignIn = () => {
    router.push('/login')
}
</script>

  
<style scoped>
.auth-page {
    min-height: 78vh;
    background: #f8f9fa;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.auth-card {
    border-radius: 12px;
    overflow: hidden;
    background-color: #fff;
    width: 100%;
    max-width: 800px;
}

.auth-title {
    color: #333;
    font-size: 1.5rem;
    font-weight: bold;
}

/* Left Section */
.auth-info {
    background: #eaf2ff;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30px;
}

.auth-info h2 {
    font-size: 1.5rem;
    color: #007bff;
}

.auth-info p {
    font-size: 1rem;
    color: #555;
    margin-top: 10px;
}

/* Mobile View - Stack Sections */
@media (max-width: 767px) {
    .auth-info {
        padding: 20px;
    }

    .auth-info h2 {
        font-size: 1.3rem;
    }

    .auth-info p {
        font-size: 0.95rem;
    }

    .auth-title {
        font-size: 1.3rem;
    }
}

/* Loader Overlay */
.loader-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.7);
    z-index: 10;
}

.g-3,
.gy-3 {
    --bs-gutter-y: -1rem;
}

.btn.btn-primary {
    color: #FFFFFF;
}

.btn-primary {
    background-color: #28a745;
    border-color: #28a745;
    border: none;
    padding: 12px;
    font-weight: 600;
}

.btn-primary:hover {
    background-color: #28a745;
    border-color: #28a745;
}

</style>
