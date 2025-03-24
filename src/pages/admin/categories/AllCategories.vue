<template>
<AdminLayout>
    <div class="categories">
        <router-link to="/admin-dashboard/category">
            <button class="btn btn-success btn-lg">Add New Category</button>
        </router-link>
    </div>
    <div class="col-md-9 mx-auto">
        <!-- Categories Page -->
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white text-center">
                <h4>Categories List</h4>
            </div>
            <div v-if="isLoading" class="loader-overlay">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div class="card-body">
                <!-- Categories Table -->
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Category Name</th>
                                <th>Image</th>
                                <th>status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(category, index) in categories" :key="category.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ category.name }}</td>
                                <td>
                                    <img :src="getImageUrl(category.image)" alt="" style="width: 100px;">
                                </td>
                                <td>
                                    <button
                                        :class="['btn-status', category.status === 1 ? 'badge bg-success' : 'badge bg-danger']"
                                        @click="toggleStatus(category.id)"
                                    >
                                        {{ category.status === 1 ? 'Active' : 'Inactive' }}
                                    </button>
                                </td>
                                <td>
                                    <!-- View Icon -->
                                    <button class="btn btn-info btn-sm" @click="viewCategory(category)">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-success btn-sm" @click="editCategory(category)">
                                        <i class='fas fa-pencil-alt'></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm" @click="deleteCategory(category.id)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                              
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="modal fade show" style="display: block; background: rgba(0, 0, 0, 0.5);" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Category Details</h5>
                    <button type="button" class="close" @click="closeModal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="text-center">
                        <p><strong>Category Name:</strong> {{ selectedCategory.name }}</p>
                        <p>
                            <strong>Image:</strong><br />
                            <img :src="getImageUrl(selectedCategory.image)" alt="Category Image" style="width: 400px;">
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Update Modal -->
    <div v-if="showUpdateModal" class="modal fade show" style="display: block; background: rgba(0, 0, 0, 0.5);" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Update Category</h5>
                    <button type="button" class="close" @click="closeUpdateModal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="updateCategory">
                        <div class="form-group">
                            <label for="categoryName">Category Name</label>
                            <input id="categoryName" v-model="selectedCategory.name" type="text" class="form-control" placeholder="Enter category name" required />
                        </div>
                        <div class="form-group mt-3">
                            <label for="categoryImage">Category Image</label>
                            <input id="categoryImage" type="file" class="form-control" @change="handleImageUpload" />
                            <div class="mt-3 text-center">
                                <img v-if="selectedCategory.image" :src="getImageUrl(selectedCategory.image)" alt="Category Image" style="width: 200px;" />
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeUpdateModal">
                        Close
                    </button>
                    <button type="button" class="btn btn-primary" @click="updateCategory">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>

</AdminLayout>
</template>

<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";
import showToast from "@/plugins/toast";
import apiClient from "@/service/Index";
import {getImageUrl} from "@/utils/Helper";
import {ref,onMounted} from "vue";
const categories = ref([]);
const showModal = ref(false);
const showUpdateModal = ref(false);
const isLoading = ref(false);
const selectedCategory =
 ref({
    id: null,
    name: "",
    image: null,
});
const formData = new FormData();
const fetchCategories = async () => {
    isLoading.value = true
    try {
        const response = await apiClient.get("/categories");
        if (response.data ?.success) {
            categories.value = response.data.allCategories || [];
            isLoading.value = false
        } else {
            categories.value = [];
            console.log("Categories not found");
        }
    } catch (error) {
        console.log(error.response.data ?.message);
        categories.value = [];
        isLoading.value = false
    }
};
const viewCategory = (category) => {
    selectedCategory.value = category;
    showModal.value = true;
};
const editCategory = (category) => {
    selectedCategory.value = category;
    showUpdateModal.value = true

}
const closeModal = () => {
    showModal.value = false;
};
const closeUpdateModal = () => {
  showUpdateModal.value = false;
};
const deleteCategory =async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        isLoading.value = true
        const removeCategoryResponse = await apiClient.get(`remove-category/${id}`);
        if(removeCategoryResponse.data ?.success){
            await fetchCategories();
           alert("Category remove successfully");
        }else{
          alert('something wrong');
        }
      } catch (error) {
          console.log(error);
          isLoading.value = false
      }
    }
};
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.append("image", file);
  }
}
const updateCategory = async () => {
  try {
    formData.set("name", selectedCategory.value.name);
    const response = await apiClient.post(`/add-category/${selectedCategory.value.id}`,formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.success) {
      alert("Category updated successfully!");
      await fetchCategories();
      closeUpdateModal();
    } else {
      alert("Failed to update the category.");
    }
  } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;
        if (validationErrors.name) {
            console.error(validationErrors.name[0]);
            alert(validationErrors.name[0]);
        }
        if (validationErrors.image) {
            console.error(validationErrors.image[0]);
            alert(validationErrors.image[0]);
        }
      } else {
          console.error("An unexpected error occurred", error);
          alert("An unexpected error occurred. Please try again later.");
      }
  }
};
const toggleStatus = async (id) => {
    try {
        const { data } = await apiClient.post(`category-status-update/${id}`);
        if (data?.success) {
            await fetchCategories();
            showToast("success", "Category status updated successfully");
        } else {
            showToast("error", data?.message || "Failed to update category status");
        }
    } catch (error) {
        console.error("Server error:", error);
        if (error.response) {
            const message = error.response.data?.message || "Server returned an error";
            showToast("error", `Error: ${message}`);
        } else if (error.request) {
            showToast("error", "No response from the server. Please try again later.");
        } else {
            showToast("error", `Request failed: ${error.message}`);
        }
    }
};
// Fetch categories on mount
onMounted(() => {
    fetchCategories();
});
</script>

<style scoped>
.card {
    border-radius: 10px;
}
.card-header {
    background-color: #007bff;
}
.card-body {
    background-color: #f8f9fa;
}
.table {
    margin-top: 20px;
    width: 100%;
}
.table th,
.table td {
    vertical-align: middle;
}
.table th td {
    text-align: center;
}
.table-hover tbody tr:hover {
    background-color: #f1f1f1;
}
button {
    margin: 5px;
}
button i {
    font-size: 16px;
}
.modal-dialog {
    max-width: 700px;
    margin: auto;
    top: 20%;
    transform: translateY(-50%);
}
.modal-content {
    border-radius: 10px;
}

.modal-header {
    background-color: #007bff;
    color: white;
    border-bottom: none;
}

.modal-footer {
    border-top: none;
}

.modal-body {
    background-color: #f8f9fa;
}

.text-center {
    text-align: center;
}

@media (max-width: 768px) {

    .table th,
    .table td {
        font-size: 14px;
    }
}
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
  .categories {
    margin-left: 86%;
    font-size: larger;
    font-weight: bold;
    color: black;
    margin-bottom: 14px;
}

.btn-status {
    padding: 5px 9px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    color: #fff;
    transition: background-color 0.3s ease;
}
.btn-success {
  background-color: #28a745;
}

.btn-danger {
  background-color: #dc3545;
}

.btn:focus {
  outline: none;
}

</style>
