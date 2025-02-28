<template>
    <AdminLayout>
        <div class="profile-container">
            <div class="change-password">
                <form @submit.prevent="changePassword ">
                    <h3 class="text-center">Change Password</h3>
                    <div class="form-group">
                        <label for="currentPassword">Current Password</label>
                        <input id="currentPassword" type="password" class="form-input" v-model="currentPassword" placeholder="Enter your current password" />
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input id="password" type="password" class="form-input" v-model="password" placeholder="Leave blank to keep current password" />
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input id="confirmPassword" type="password" class="form-input" v-model="confirmPassword" placeholder="Leave blank to keep current password" />
                    </div>
    
                    <button type="submit" class="save-btn">Save</button>
                </form>
            </div>
        </div>
    </AdminLayout>
    </template>
    
    <script setup>
    import AdminLayout from "@/layouts/AdminLayout.vue";
    import showToast from "@/plugins/toast";
    import apiClient from "@/service/Index";
    import {
        ref
    } from "vue";
    const isLoading = ref(false);
    const currentPassword = ref('');
    const password = ref("");
    const confirmPassword = ref("");
    const changePassword = async () => {
        // Basic client-side validation
        if (!password.value || !confirmPassword.value) {
            showToast('error', 'Password and Confirm Password cannot be empty.');
            return;
        }
    
        if (password.value !== confirmPassword.value) {
            showToast('error', 'Passwords do not match.');
            return;
        }
    
        if (password.value.length < 6) {
            showToast('error', 'Password must be at least 8 characters long.');
            return;
        }
    
        isLoading.value = true;
        try {
            const response = await apiClient.post('/admin-change-password', {
                currentPassword: currentPassword.value,
                password: password.value,
                confirmPassword: confirmPassword.value,
            });
    
            if (response.data ?.success) {
                showToast('success', response.data.message || 'Password changed successfully.');
                // Optionally clear the fields
                currentPassword.value = '';
                password.value = '';
                confirmPassword.value = '';
            } else {
                showToast('error', response.data.message || 'Failed to change password.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            showToast('error', 'An error occurred. Please try again.');
        } finally {
            isLoading.value = false;
        }
    };
    </script>
    
    <style scoped>
    .profile-container[data-v-1d15a1c1] {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 80vh;
    justify-content: center;
}
    .upload-btn {
        display: inline-block;
        padding: 8px 15px;
        background: #007bff;
        color: #ffffff;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 8px;
        font-size: 14px;
    }
    
    .upload-btn:hover {
        background: #0056b3;
    }
    
    .hidden-input {
        display: none;
    }
    .change-password h2 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
    }
    .change-password h3 {
        font-size: 16px;
        font-weight: bold;
        margin-top: 15px;
        margin-bottom: 10px;
    }
    /* Form Group Styles */
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group label {
        display: block;
        font-weight: 600;
        margin-bottom: 5px;
    }
    
    .form-input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
    }
    
    .form-input:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
    
    /* Save Button Styles */
    .save-btn {
        display: inline-block;
        padding: 8px 15px;
        background: #28a745;
        color: #ffffff;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
    }
    
    .save-btn:hover {
        background: #218838;
    }
    
    .loader-overlay {
        position: absolute;
        top: 146px;
        left: 440px;
        width: 11%;
        height: 13%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.7);
        z-index: 10;
    }
    .change-password{ 
        flex: 0 1 48%;
        background: #ffffff; 
        padding: 15px; 
        border-radius: 10px; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-height: 401px; 
    }
    </style>
    