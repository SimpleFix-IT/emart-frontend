
<template>
  <div class="profile-page">
    <!-- Profile Header -->
    <section class="profile-header">
      <div class="profile-image-container">
        <div v-if="loading" class="loader-container">
          <div class="loader"></div>
        </div>
        <div v-else class="profile-image-wrapper">
          <img v-if="profileImage.image" :src="getImageUrl(profileImage?.image)" alt="Profile" class="profile-image" />
          <img v-else src="@/assets/profile-icon/user-icon.png" class="user-icon" alt="User Icon" />
          <div class="file-input-wrapper">
            <input type="file" id="profilePicture" class="file-input" @change="handleFileUpload">
            <label for="profilePicture" class="upload-label">Upload New</label>
          </div>
        </div>
      </div>
      <div class="profile-info">
        <h1 class="profile-name">{{ userProfileData.first_name }}</h1>
        <p class="profile-email">{{userProfileData.email }}</p>
        <p class="profile-bio">{{ user.bio || "No bio available" }}</p>
        <button class="btn-edit" @click="openModal">Edit Profile</button>
      </div>
    </section>
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Profile</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <Form  :initial-values="userProfileData" @submit="updateProfile" :validation-schema="userProfileSchema" v-slot="{ errors }">
          <div class="form-grid">
            <BaseInput name="first_name" label="First Name" type="text" :error="errors.first_name" />
            <BaseInput name="last_name" label="Last Name" type="text" :error="errors.last_name" />
            <BaseInput  name="email" label="Email" type="email" :error="errors.email" readonly />
            <BaseInput  name="phone" label="Phone Number" type="number" :error="errors.phone" />
            <BaseInput  name="address" label="Address" type="text" :error="errors.address" />
            <BaseInput name="city" label="City" type="text" :error="errors.city" />
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn-save">Save</button>
            <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
          </div>
        </Form>
      </div>
    </div>
    <!-- User Stats -->
    <section class="user-stats">
      <div class="stat-card">
        <h3>{{ user.orders }}</h3>
        <p>Orders</p>
      </div>
      <div class="stat-card">
        <h3>{{ user.wishlist }}</h3>
        <p>Wishlist</p>
      </div>
      <div class="stat-card">
        <h3>{{ user.reviews }}</h3>
        <p>Reviews</p>
      </div>
    </section>

    <!-- Settings and Activity -->
    <section class="profile-content">
      <div class="tabs">
        <button :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">Settings</button>
        <button :class="{ active: activeTab === 'activity' }" @click="activeTab = 'activity'">Activity</button>
      </div>
      <div class="tab-content">
        <div v-if="activeTab === 'settings'">
          <h2>Account Settings</h2>
          <p>Update your password, preferences, and other account settings here.</p>
        </div>
        <div v-else-if="activeTab === 'activity'">
          <h2>Recent Activity</h2>
          <p>View your order history, reviews, and other activities.</p>
        </div>
      </div>
    </section>
  </div>
</template>


<script setup>
import apiClient from "@/service/Index";
import showToast from "@/plugins/toast";
import {onMounted,ref} from "vue";
import {getImageUrl} from "@/utils/Helper";
import eventBus from "@/eventBus";
// import { Form } from "vee-validate";
import BaseInput from "@/components/inputs/BaseInput.vue";
import { Form } from "vee-validate";
import { userProfileSchema } from "@/validations/userProfile";
const user = ref({
    name: "John Doe",
    email: "johndoe@example.com",
    bio: "Lover of tech, books, and coffee. Always learning.",
    profilePicture: "@/assets/profile-icon/user-icon.png",
    orders: 15,
    wishlist: 8,
    reviews: 23,
});
const userProfileData = ref({});
const isModalOpen = ref(false);
const activeTab = ref("settings");
const profileImage = ref({});
const loading = ref(true);

const handleFileUpload = async (event) => {
    loading.value = true;
    const file = event.target.files[0];
    if (!file) return;
    let formData = new FormData();
    formData.append("image", file);
    try {
        const response = await apiClient.post("/user/change/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        if (response.data.success) {
            showToast("success", "Profile picture updated!");
            await fetchUserProfileImage();
            eventBus.emit("profileImageUpdated");
            loading.value = false;
        } else {
            showToast("error", response.data.message);
        }
    } catch (error) {
        console.error("Error updating profile picture:", error);
        showToast("error", "Failed to update profile picture.");
    }
};
const fetchUserProfileImage = async () => {
    try {
        const response = await apiClient.get('/user/profile/image');
        if (response ?.data ?.success) {
            profileImage.value = response.data.userProfile || null;
            loading.value = false;
        } else {
            console.warn('No profile image found:', response.data.message);
        }
    } catch (error) {
        console.error('Error fetching profile image:', error.response ?.data ?.message || error.message);
    } finally {
        loading.value = false;
    }
};
const userData = async () => {
  try {
    const response = await apiClient.get("/user/profile");
    if (response?.data?.success && response?.data?.userData) {
      userProfileData.value = response.data.userData;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error?.response?.data?.message || error.message);
    showToast("error", error?.response?.data?.message || "Failed to load profile data. Please try again.");
  }
};

const updateProfile = async (values) => {
  try {
    const response = await apiClient.post("/user/update-profile", values);
    if (response.data.success) {
      closeModal();
      await userData();
      showToast("success", "Profile updated successfully!");
    } else {
      showToast("error", response.data.message || "Profile update failed.");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 422 && error.response.data.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat().join("\n");
        showToast("error", validationErrors);
      } 
      else if (error.response.status === 401 || error.response.status === 403) {
        showToast("error", "Unauthorized! Please login again.");
      } 
      else if (error.response.status === 404) {
        showToast("error", "User not found.");
      } 
      else {
        showToast("error", error.response.data.message || "An error occurred. Please try again.");
      }
    } else {
      showToast("error", "Network error! Please check your connection.");
    }
  }
};

const openModal = () => {
  isModalOpen.value = true;
};

// Close modal
const closeModal = () => {
  isModalOpen.value = false;
};
onMounted(() => {
    fetchUserProfileImage();
    userData();
})
</script>

<style scoped>
.profile-page {
  font-family: "Arial", sans-serif;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Profile Header */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  padding: 20px;
}

.profile-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Loader */
.loader-container {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #17b829;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Profile Image */
.profile-image-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
}

/* File Input */
.file-input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-input {
  display: none;
}

.upload-label {
  display: inline-block;
  padding: 8px 15px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-label:hover {
  background-color: #0056b3;
}

/* Profile Info */
.profile-info {
  text-align: center;
}

.profile-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

.profile-email {
  font-size: 1rem;
  color: #666;
}

.profile-bio {
  font-size: 1rem;
  margin: 10px 0;
  color: #444;
}

/* Edit Button */
.btn-edit {
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-edit:hover {
  background: #0056b3;
}

/* User Stats */
.user-stats {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  flex: 1;
}

.stat-card h3 {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.stat-card p {
  color: #666;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 15px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tabs button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.tab-content {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 450px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #888;
}

.close-btn:hover {
  color: #444;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 15px 0;
}

/* Buttons */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.btn-save {
  background-color: #007bff;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-save:hover {
  background-color: #0056b3;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
  padding: 8px 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-cancel:hover {
  background-color: #ddd;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
