<template>
<div class="coupon-section" v-if="coupon">
    <h4 class="coupon-title">Available Coupons</h4>
    <ul>
        <li class="coupon-item">
            <div class="coupon-text">
                <span class="label">Coupon Code:</span>
                <strong class="coupon-code">{{ coupon.code }}</strong>
                <button @click="copyCouponCode(coupon.code)" class="copy-button">Copy</button>
            </div>
            <div class="coupon-text">
                <p class="discount">
                    {{ coupon.discount_type === 'percentage' ? parseInt(coupon.discount_value) + '%' : '₹' + parseInt(coupon.discount_value) }} discount
                </p>
            </div>
            <div class="coupon-text">
                <p class="valid-until">Valid until: {{ convertToIST(coupon.end_date) }}</p>
            </div>
        </li>
    </ul>
    <div class="apply-coupon">
        <input type="text" v-model="couponCode" placeholder="Enter Coupon Code" class="coupon-input" />
        <button @click="applyCoupon(coupon.id)" class="coupon-button">Apply Coupon</button>
    </div>

    <p v-if="message" :class="{ 'success-message': success, 'error-message': !success }">
        {{ message }}
    </p>
</div>
</template>

<script>
import {ref,onMounted} from 'vue';
import apiClient from '@/service/Index';
import {convertToIST} from '@/utils/Helper';
import showToast from "@/plugins/toast.js";
export default {
    emits: ['couponApplied'],
    setup(props, {
        emit
    }) {
        const couponCode = ref('');
        const message = ref('');
        const success = ref(false);
        const coupon = ref(null);

        const fetchCoupons = async () => {
            try {
                const response = await apiClient.get('/coupons');
                if (response.data ?.success) {
                    coupon.value = response.data.coupon;
                }
            } catch (error) {
                showToast("error", "Error fetching coupons.");
                console.error("Error fetching coupons:", error);
            }
        }
        const applyCoupon = async () => {
            if (!couponCode.value) {
                message.value = "Please enter a coupon code!";
                showToast("error", "Please enter a coupon code!");
                success.value = false;
                return;
            }
            try {
                const response = await apiClient.post('/apply-coupon', {
                    code: couponCode.value
                });

                if (response.data.success) {
                    message.value = response.data.message;
                    showToast("success", message.value);
                    success.value = true;
                    emit("couponApplied");
                } else {
                    message.value = response.data.message || "Coupon not valid";
                    showToast("error", message.value);
                    success.value = false;
                }
            } catch (error) {
                message.value = error.response ?.data ?.message || "Invalid coupon";
                showToast("error", message.value);
                success.value = false;
            }
        };

        const copyCouponCode = (code) => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(code).then(() => {
                    message.value = 'Coupon code copied to clipboard!';
                    showToast("success", message.value);
                    success.value = true;
                    couponCode.value = code;
                }).catch((error) => {
                    message.value = 'Failed to copy coupon code.';
                    showToast("error", message.value);
                    success.value = false;
                    console.error(error);
                });
            } else {
                message.value = 'Clipboard API not supported.';
                showToast("error", message.value);
                success.value = false;
            }
        };
        onMounted(() => {
            fetchCoupons();
        });
        return {
            couponCode,
            message,
            success,
            coupon,
            applyCoupon,
            convertToIST,
            copyCouponCode
        };
    }
};
</script>

<style scoped>
/* @import '@/assets/website/home.css'; */
/* Overall section styling */
.coupon-section {
    padding: 15px;
    background: radial-gradient(#fefefe 5%, #ff6666);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 20px auto;
    font-family: Arial, sans-serif;
}
/* Title styling */
.coupon-title {
    font-size: 1.5rem;
    color: #333;
    text-align: center;
    margin-bottom: 15px;
    font-weight: bold;
}
/* Styling for each coupon item */
.coupon-item {
    background-color: #fff;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
/* Styling for each text line (Coupon Code, Discount, Valid until) */
.coupon-text {
    margin-bottom: 8px;
    display: flex;
}
.coupon-code {
    display: flex;
    font-size: 1.3rem;
    font-weight: bold;
    color: #3498db;
    margin-top: -4px;
    padding-left: 10px;
}
/* Styling for the discount message */
.discount {
    font-size: 1.1rem;
    color: #e74c3c;
    /* Red color for the discount */
}

/* Styling for the valid until date */
.valid-until {
    font-size: 0.9rem;
    color: #888;
    /* Light gray color for valid until */
    font-style: italic;
}
/* Input and button styling for applying coupon */
.apply-coupon {
    margin-top: 15px;
}
.coupon-input {
    width: 100%;
    padding: 8px;
    font-size: 1rem;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    /* Ensure padding doesn't increase the width */
}
.coupon-button {
    width: 100%;
    padding: 10px;
    font-size: 1.1rem;
    color: white;
    background-color: radial-gradient(#fefefe 5%, #ff6666);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-sizing: border-box;
    /* Ensure padding doesn't increase the width */
}
.coupon-button:hover {
    /* background-color: #2980b9; Darker blue on hover */
    background-color: #218838;
    /* Darker green shade on hover */
    border-color: #1e7e34;
}
/* Message styling */
.success-message {
    color: green;
}
.error-message {
    color: red;
}
.copy-button {
    background-color: #4CAF50;
    color: white;
    font-size: 0.9rem;
    padding: 5px 10px;
    margin-left: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.copy-button:hover {
    background-color: #45a049;
}
.copy-button:focus {
    outline: none;
}
</style>
