<template>
<AdminLayout>
    <div class="categories">
        <router-link to="/admin-dashboard/subcategories">
            <button class="btn btn-success btn-lg">View Sub Categories</button>
        </router-link>
    </div>
    <div class="card shadow-sm mt-5" style="max-width: 600px; margin: 0 auto;">
        <div class="card-header bg-primary text-white text-center">
            <h4>Add New Subcategory</h4>
        </div>
        <div class="card-body">
            <form @submit.prevent="submitForm">
                <div class="row">
                    <!-- Subcategory Name -->
                    <div class="col-md-12 mb-3">
                        <label for="name" class="form-label">Subcategory Name</label>
                        <input type="text" id="name" v-model="formData.name" class="form-control" placeholder="Enter subcategory name" />
                    </div>

                    <!-- Description -->
                    <div class="col-md-12 mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea id="description" v-model="formData.description" class="form-control" rows="4" placeholder="Enter a brief description"></textarea>
                    </div>

                    <!-- Category Selection -->
                    <div class="col-md-12 mb-3">
                        <label for="category_id" class="form-label">Select Category</label>
                        <select id="category_id" v-model="formData.category_id" class="form-select">
                            <option value="" disabled>Select a category</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Image Upload -->
                    <div class="col-md-12 mb-3">
                        <label for="image" class="form-label">Subcategory Image</label>
                        <input type="file" id="image" class="form-control" @change="handleFileChange" />
                    </div>

                    <!-- Submit Button -->
                    <div class="col-12 text-center mt-3">
                        <button type="submit" class="btn btn-success px-4 py-2">
                            Add Subcategory
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</AdminLayout>
</template>

<script setup>
import {ref,onMounted} from "vue";
import apiClient from '@/service/Index';
import AdminLayout from "@/layouts/AdminLayout.vue";
const formData = ref({
    name: "",
    description: "",
    category_id: "",
    image: null,
});

const categories = ref([]);
const fetchCategories = async () => {
    try {
        const response = await apiClient.get("/categories");
        categories.value = response.data.allCategories;
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};
const handleFileChange = (event) => {
    formData.value.image = event.target.files[0];
};
const submitForm = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.value.name);
    formDataToSend.append("description", formData.value.description);
    formDataToSend.append("category_id", formData.value.category_id);
    if (formData.value.image) {
        formDataToSend.append("image", formData.value.image);
    }
    try {
        const response = await apiClient.post("/add-subcategory", formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log(response.data);
        alert("Subcategory added successfully!");
        formData.value.name = "";
        formData.value.description = "";
        formData.value.category_id = "";
        // formData.value.image = null;
        document.getElementById('image').value = '';
    } catch (error) {
        console.error("Error adding subcategory:", error);
        alert("Failed to add subcategory.");
    }
};
onMounted(fetchCategories);
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
.categories {
    margin-left: 81%;
    font-size: larger;
    font-weight: bold;
    color: black;
}
</style>
