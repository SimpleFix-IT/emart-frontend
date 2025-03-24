<template>
<AdminLayout>
    <div class="profile-container">
        <!-- Profile Section (Left Side) -->
        <div class="profile-section">
            <div v-if="isLoading" class="loader-overlay">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <h2>Profile</h2>
            <img :src="getImageUrl(profile.image)" class="profile-avatar" />
            <h3>{{ profile.user?.first_name || ""}} {{ profile.user?.last_name  || ""}}</h3>
            <label for="avatar" class="upload-btn">Choose File</label>
            <input type="file" id="avatar" class="hidden-input" @change="onAvatarChange" />
        </div>
        <div class="edit-details-section">
            <h2 class="text-center">Edit Details</h2>
            <form @submit.prevent="updateProfileDetails ">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input id="firstName" type="text" class="form-input" v-model="userData.firstName" />
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input id="lastName" type="text" class="form-input" v-model="userData.lastName" />
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input id="email" type="email" class="form-input" v-model="userData.email" disabled />
                </div>
                <button type="submit" class="save-btn text-center">Save</button>
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
    getImageUrl
} from "@/utils/Helper";
import {
    onMounted,
    ref
} from "vue";
const isLoading = ref(false);
const userData = ref({
    firstName: "",
    lastName: "",
    email: "",
});
const profile = ref({});
const onAvatarChange = async (event) => {
    isLoading.value = true;
    const file = event.target.files[0];
    if (!file) {
        showToast('error', 'Please select a file to upload');
        return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        showToast('error', 'Invalid file type. Please upload an image file.');
        return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB size limit
        showToast('error', 'File size exceeds the 2MB limit.');
        return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
        const response = await apiClient.post('admin-profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.data ?.success) {
            showToast('success', response.data.message || 'Profile updated successfully');
            await adminProfile(); // Refresh admin profile
            isLoading.value = false;
        } else {
            showToast('error', response.data.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Server error:', error);
        showToast('error', 'An error occurred while updating your profile. Please try again.');
    }
};
const adminProfile = async () => {
    isLoading.value = true;
    try {
        const profileResponse = await apiClient.get('/get-profile');
        if (profileResponse.data ?.success) {
            profile.value = profileResponse.data.profile;
            const user = profileResponse.data.profile.user;
            userData.value = {
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
            };
            isLoading.value = false;
        }
    } catch (error) {
        console.log('server error', error);
    }
};
const updateProfileDetails = async () => {
    // Basic client-side validation
    if (!userData.value.firstName || !userData.value.lastName) {
        showToast('error', 'First name and last name cannot be empty.');
        return;
    }
    isLoading.value = true;
    try {
        const response = await apiClient.post('/admin-update-profile', {
            firstName: userData.value.firstName,
            lastName: userData.value.lastName,
        });

        if (response.data ?.success) {
            showToast('success', response.data.message || 'Password changed successfully.');
            await adminProfile();
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
onMounted(() => {
    adminProfile();

})
</script>

<style scoped>
/* General container styles */
.profile-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 80vh;
}

/* Profile Section Styles */
.profile-section {
    flex: 1 1 30%;
    background: #ffffff;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-height: 400px;
    /* Adjusted height */
    overflow-y: auto;
    /* Ensure content is scrollable if it overflows */
}

.profile-section h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.profile-avatar {
    width: 100%;
    max-width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #ddd;
    margin-bottom: 10px;
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

/* Edit Details Section Styles */
/* .edit-details-section {
    flex: 1 1 65%;
    background: #ffffff;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 620px;
} */

.edit-details-section h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
}

.edit-details-section h3 {
    font-size: 16px;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 10px;
}

/* Form Group Styles */
/* .form-group {
    margin-bottom: 15px;
} */

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
    margin-left: 241px;
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
.edit-details-section {
    flex: 1 1 63%;
    background: #ffffff;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 401px;
}
.form-group[data-v-b25ee17a] {
    margin-bottom: 15px;
    width: 819px;

    padding-left: 241px;
}
</style>
